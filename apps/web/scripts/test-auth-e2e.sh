#!/usr/bin/env bash
# E2E auth tests — sign-up / sign-in / sign-out / guards / Google OAuth endpoint.
# Hits the dev server directly via curl. Cleans test users via Prisma at start.
#
# Usage : bash apps/web/scripts/test-auth-e2e.sh
#         (le dev server doit tourner sur http://localhost:3000)

set -uo pipefail

BASE=${BASE:-http://localhost:3000}
TEST_PREFIX="auth-e2e-$(date +%s)"
EMAIL_NEW="${TEST_PREFIX}-new@radar.test"
EMAIL_DUP="${TEST_PREFIX}-dup@radar.test"
PASS_OK="RadarTest12345"
PASS_WEAK="abc"

PASS=0
FAIL=0
RESULTS=()

assert() {
  local label="$1"; local actual="$2"; local expected="$3"
  if [[ "$actual" == "$expected" ]]; then
    PASS=$((PASS+1))
    RESULTS+=("PASS  $label   ($actual)")
  else
    FAIL=$((FAIL+1))
    RESULTS+=("FAIL  $label   actual='$actual' expected='$expected'")
  fi
}

assert_match() {
  local label="$1"; local haystack="$2"; local needle="$3"
  if [[ "$haystack" == *"$needle"* ]]; then
    PASS=$((PASS+1))
    RESULTS+=("PASS  $label   (matched '$needle')")
  else
    FAIL=$((FAIL+1))
    RESULTS+=("FAIL  $label   '$needle' not found in '$haystack'")
  fi
}

# Petite fonction helper qui retourne le HTTP status d'un POST JSON
http_post() {
  local url="$1"; local body="$2"; shift 2
  curl -s -X POST -H "Content-Type: application/json" -d "$body" "$@" "$url"
}

echo "==========================================="
echo " RADAR auth E2E — base=$BASE"
echo " new=$EMAIL_NEW"
echo " dup=$EMAIL_DUP"
echo "==========================================="

# ─── 0. Test du wrapper /login & /register : session existante → /onboarding
# (Bloque l'inscription/connexion d'un user déjà loggé — cf. (auth)/*/page.tsx)
JAR_GUARD=$(mktemp)
curl -s -o /dev/null -X POST -H "Content-Type: application/json" \
  -d "{\"email\":\"guard-${TEST_PREFIX}@radar.test\",\"password\":\"$PASS_OK\",\"name\":\"G\"}" \
  -c "$JAR_GUARD" "$BASE/api/auth/sign-up/email"
final_url=$(curl -s -b "$JAR_GUARD" -L -o /dev/null -w "%{url_effective}" "$BASE/login")
assert_match "/login avec session → /onboarding" "$final_url" "/onboarding"
final_url=$(curl -s -b "$JAR_GUARD" -L -o /dev/null -w "%{url_effective}" "$BASE/register")
assert_match "/register avec session → /onboarding" "$final_url" "/onboarding"
rm -f "$JAR_GUARD"

# ─── 1. Sign-up happy path ────────────────────────────────────
JAR1=$(mktemp)
body=$(http_post "$BASE/api/auth/sign-up/email" \
  "{\"email\":\"$EMAIL_NEW\",\"password\":\"$PASS_OK\",\"name\":\"E2E New\"}" \
  -c "$JAR1" -w "\n%{http_code}")
code=$(echo "$body" | tail -1)
payload=$(echo "$body" | head -n -1)
assert "sign-up happy → 200" "$code" "200"
assert_match "sign-up retourne user.id" "$payload" '"id":"'
assert_match "cookie session set" "$(cat "$JAR1")" "better-auth.session_token"

# ─── 2. Sign-up duplicate ─────────────────────────────────────
body=$(http_post "$BASE/api/auth/sign-up/email" \
  "{\"email\":\"$EMAIL_NEW\",\"password\":\"$PASS_OK\",\"name\":\"Dup\"}" \
  -w "\n%{http_code}")
code=$(echo "$body" | tail -1)
payload=$(echo "$body" | head -n -1)
assert "sign-up doublon → 422" "$code" "422"
assert_match "sign-up doublon code" "$payload" "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"

# ─── 3. Sign-up weak password ─────────────────────────────────
body=$(http_post "$BASE/api/auth/sign-up/email" \
  "{\"email\":\"${TEST_PREFIX}-weak@radar.test\",\"password\":\"$PASS_WEAK\",\"name\":\"Weak\"}" \
  -w "\n%{http_code}")
code=$(echo "$body" | tail -1)
payload=$(echo "$body" | head -n -1)
assert "sign-up password faible → 400" "$code" "400"
assert_match "sign-up weak code" "$payload" "PASSWORD_TOO_SHORT"

# ─── 4. Sign-up invalid email ─────────────────────────────────
body=$(http_post "$BASE/api/auth/sign-up/email" \
  "{\"email\":\"not-an-email\",\"password\":\"$PASS_OK\",\"name\":\"Bad\"}" \
  -w "\n%{http_code}")
code=$(echo "$body" | tail -1)
payload=$(echo "$body" | head -n -1)
assert "sign-up email invalide → 400" "$code" "400"

# ─── 5. Sign-in happy path ────────────────────────────────────
JAR2=$(mktemp)
body=$(http_post "$BASE/api/auth/sign-in/email" \
  "{\"email\":\"$EMAIL_NEW\",\"password\":\"$PASS_OK\"}" \
  -c "$JAR2" -w "\n%{http_code}")
code=$(echo "$body" | tail -1)
assert "sign-in happy → 200" "$code" "200"
assert_match "sign-in cookie set" "$(cat "$JAR2")" "better-auth.session_token"

# ─── 6. Sign-in wrong password ────────────────────────────────
body=$(http_post "$BASE/api/auth/sign-in/email" \
  "{\"email\":\"$EMAIL_NEW\",\"password\":\"WrongPass1234\"}" \
  -w "\n%{http_code}")
code=$(echo "$body" | tail -1)
payload=$(echo "$body" | head -n -1)
assert "sign-in mauvais mdp → 401" "$code" "401"
assert_match "sign-in code INVALID" "$payload" "INVALID_EMAIL_OR_PASSWORD"

# ─── 7. Sign-in user inexistant (anti-leak) ───────────────────
body=$(http_post "$BASE/api/auth/sign-in/email" \
  "{\"email\":\"nobody-${TEST_PREFIX}@radar.test\",\"password\":\"$PASS_OK\"}" \
  -w "\n%{http_code}")
code=$(echo "$body" | tail -1)
payload=$(echo "$body" | head -n -1)
assert "sign-in user inconnu → 401" "$code" "401"
assert_match "sign-in pas de leak" "$payload" "INVALID_EMAIL_OR_PASSWORD"

# ─── 8. get-session avec cookie ───────────────────────────────
body=$(curl -s -b "$JAR2" "$BASE/api/auth/get-session" -w "\n%{http_code}")
code=$(echo "$body" | tail -1)
payload=$(echo "$body" | head -n -1)
assert "get-session avec cookie → 200" "$code" "200"
assert_match "get-session retourne userId" "$payload" "\"userId\":"

# ─── 9. get-session sans cookie ───────────────────────────────
body=$(curl -s "$BASE/api/auth/get-session" -w "\n%{http_code}")
code=$(echo "$body" | tail -1)
payload=$(echo "$body" | head -n -1)
assert "get-session sans cookie → 200" "$code" "200"
assert "get-session retourne null" "$(echo "$payload" | tr -d '[:space:]')" "null"

# ─── 10. /onboarding sans cookie → redirige login ─────────────
final_url=$(curl -s -L -o /dev/null -w "%{url_effective}" "$BASE/onboarding")
assert_match "/onboarding sans session → /login" "$final_url" "/login"

# ─── 11. /dashboard sans cookie → redirige login ──────────────
final_url=$(curl -s -L -o /dev/null -w "%{url_effective}" "$BASE/dashboard")
assert_match "/dashboard sans session → /login" "$final_url" "/login"

# ─── 12. /onboarding avec cookie → step-1 ─────────────────────
final_url=$(curl -s -b "$JAR2" -L -o /dev/null -w "%{url_effective}" "$BASE/onboarding")
assert_match "/onboarding avec session → step-1" "$final_url" "/onboarding/step-1"

# ─── 13. /dashboard avec session sans onboarding → /onboarding
final_url=$(curl -s -b "$JAR2" -L -o /dev/null -w "%{url_effective}" "$BASE/dashboard")
assert_match "/dashboard sans onboarding → /onboarding" "$final_url" "/onboarding"

# ─── 14. Home redirect sans session → /login ──────────────────
final_url=$(curl -s -L -o /dev/null -w "%{url_effective}" "$BASE/")
assert_match "home sans session → /login" "$final_url" "/login"

# ─── 15. Home redirect AVEC session → /dashboard (donc /onboarding)
final_url=$(curl -s -b "$JAR2" -L -o /dev/null -w "%{url_effective}" "$BASE/")
assert_match "home avec session → onboarding/dashboard" "$final_url" "/onboarding"

# ─── 16. Sign-out ─────────────────────────────────────────────
# Better Auth exige Origin sur les routes mutantes (CSRF protection)
body=$(curl -s -X POST -H "Content-Type: application/json" -H "Origin: $BASE" \
  -d '{}' -b "$JAR2" -c "$JAR2" "$BASE/api/auth/sign-out" -w "\n%{http_code}")
code=$(echo "$body" | tail -1)
assert "sign-out → 200" "$code" "200"

# Vérif session révoquée
body=$(curl -s -b "$JAR2" "$BASE/api/auth/get-session" -w "\n%{http_code}")
payload=$(echo "$body" | head -n -1)
assert "post-signout session null" "$(echo "$payload" | tr -d '[:space:]')" "null"

# ─── 17. Google OAuth — /sign-in/social initie un redirect ────
body=$(curl -s -o /dev/null -X POST -H "Content-Type: application/json" \
  -d '{"provider":"google","callbackURL":"/onboarding"}' \
  "$BASE/api/auth/sign-in/social" -w "%{http_code}")
# Better Auth retourne 200 avec un body contenant l'URL Google
assert "google social-signin → 200" "$body" "200"

body=$(http_post "$BASE/api/auth/sign-in/social" \
  '{"provider":"google","callbackURL":"/onboarding"}')
assert_match "google social URL accounts.google.com" "$body" "accounts.google.com"
assert_match "google client_id présent" "$body" "client_id="

# ─── 18. Request password reset (Better Auth 1.6.9 = /request-password-reset)
# Note : actuellement disabled tant que sendResetPassword n'est pas configuré
# (sprint 1.5 → Resend). On valide juste que l'endpoint répond correctement.
body=$(http_post "$BASE/api/auth/request-password-reset" \
  "{\"email\":\"$EMAIL_NEW\",\"redirectTo\":\"/reset-password\"}" \
  -w "\n%{http_code}")
code=$(echo "$body" | tail -1)
payload=$(echo "$body" | head -n -1)
# 400 attendu tant que sendResetPassword n'est pas branché
assert "request-password-reset reachable" "$code" "400"
assert_match "code RESET_PASSWORD_DISABLED" "$payload" "RESET_PASSWORD_DISABLED"

# ─── 19. Rate limit Better Auth (10 sign-in échecs rapides) ───
# (Better Auth a un rate limiter natif. Si pas activé → on log mais on n'échoue pas)
rl_codes=""
for i in {1..15}; do
  c=$(curl -s -o /dev/null -X POST -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL_NEW\",\"password\":\"WrongPass$i\"}" \
    "$BASE/api/auth/sign-in/email" -w "%{http_code}")
  rl_codes+="$c "
done
echo " sign-in burst codes: $rl_codes"

# ─── BILAN ────────────────────────────────────────────────────
echo
echo "==========================================="
echo " Résultats"
echo "==========================================="
for r in "${RESULTS[@]}"; do echo " $r"; done
echo
echo " $PASS passed, $FAIL failed"

rm -f "$JAR1" "$JAR2"
[[ $FAIL -eq 0 ]] && exit 0 || exit 1
