# SPEC — Sprint 01 : Authentification

**Projet** : RADAR — Outil de veille concurrentielle propulsé par OpenClaw
**Version** : 1.0
**Priorité** : Critique (Must V1)
**Responsable spec** : Karamo Sylla
**Responsable implémentation** : Claude Code
**Date** : Mai 2026
**Cadre académique** : Module M244 (Veille Technologique), ENSA Tétouan

---

## 1. Objectif

Implémenter le parcours d'authentification complet de RADAR : inscription par email/password ou Google OAuth, connexion, récupération de mot de passe, réinitialisation par token, vérification email non-bloquante. L'utilisateur doit pouvoir créer un compte (en moins de 30 secondes selon PRD § 7.2), être redirigé vers la bonne destination selon son état (onboarding non fait → `/onboarding`, onboarding fait → `/dashboard`, callbackUrl prioritaire), et récupérer son accès en cas d'oubli de mot de passe.

Ce sprint produit les **5 écrans Auth** pixel-perfect alignés sur le design `RADAR Auth Screens.html` (livré par l'équipe design dans `.tmp-design/radar/project/auth-*.jsx`), la **validation Zod** des formulaires côté client, et les **Server Actions stubs** prêts à être branchés sur Better Auth au sprint 1.5 (la lib backend, le middleware Next.js et les templates emails Resend sont **explicitement hors scope** — voir § 18).

---

## 2. User Stories (résumé)

| #      | En tant que...                                            | Je veux...                                                 | Afin de...                                          |
| ------ | --------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------- |
| US-A01 | Visiteur pressé                                           | m'inscrire en un clic via Google OAuth                     | démarrer en 8 secondes sans nouveau mot de passe    |
| US-A02 | Visiteur méthodique                                       | m'inscrire avec mon email professionnel et un mot de passe | garder un compte dédié avec mes identifiants        |
| US-A03 | Visiteur déjà inscrit                                     | recevoir un message clair si mon email est déjà utilisé    | comprendre que je dois me connecter, pas recréer    |
| US-A04 | Utilisateur revenant                                      | me connecter rapidement avec email/password                | retrouver mon dashboard et le digest du jour        |
| US-A05 | Utilisateur dont les identifiants sont incorrects         | voir un message d'erreur générique                         | comprendre sans révéler quel champ est faux         |
| US-A06 | Utilisateur n'ayant pas vérifié son email                 | être averti à la connexion sans être bloqué                | accéder au dashboard avec une bannière de rappel    |
| US-A07 | Utilisateur revenant via Google                           | me connecter en un clic via Google                         | éviter de retaper mes identifiants                  |
| US-A08 | Visiteur ayant oublié son mot de passe                    | demander un lien de réinitialisation par email             | récupérer l'accès à mon compte                      |
| US-A09 | Utilisateur cliquant sur un lien expiré                   | voir un message clair et redemander un nouveau lien        | ne pas perdre du temps à comprendre l'erreur        |
| US-A10 | Utilisateur réinitialisant son mot de passe               | choisir un nouveau mot de passe sécurisé avec confirmation | éviter une faute de frappe qui bloquerait à nouveau |
| US-A11 | Nouvel inscrit recevant l'email de vérification           | cliquer sur le lien et voir une confirmation visuelle      | être rassuré que mon compte est actif               |
| US-A12 | Utilisateur arrivant sur l'écran « Vérifiez votre email » | pouvoir continuer vers le dashboard sans vérifier          | ne pas être bloqué par la friction                  |

Le cahier de User Stories détaillé est dans le document compagnon [`USER-STORIES-Sprint01-Authentification.md`](./USER-STORIES-Sprint01-Authentification.md).

---

## 3. Écrans concernés

| #   | Écran               | Route                                                | Auth                                          | Layout                                    |
| --- | ------------------- | ---------------------------------------------------- | --------------------------------------------- | ----------------------------------------- |
| 1   | Connexion           | `/login`                                             | Non (redirige `/dashboard` si auth)           | Split 50/50 (formulaire + branding panel) |
| 2   | Inscription         | `/register`                                          | Non (redirige `/dashboard` si auth)           | Split 50/50                               |
| 3   | Mot de passe oublié | `/forgot-password`                                   | Non                                           | Card centrée 420px sur fond bg-primary    |
| 4   | Réinitialisation    | `/reset-password?token=...`                          | Non                                           | Card centrée 420px                        |
| 5   | Vérification email  | `/verify-email?token=...` ou écran après inscription | Non (mais affiche après login si non vérifié) | Card centrée 420px                        |

Le design suit la charte graphique **Intel Dark / Radar Pulse** : fond `#0B0F14`, surfaces `#141A22`, primary teal `#14B8A6`, accent safran `#F59E0B`, police Outfit (avec JetBrains Mono pour les valeurs mono). Source de vérité design : [`Branding/CHARTE_GRAPHIQUE_RADAR.md`](../../Branding/CHARTE_GRAPHIQUE_RADAR.md) + tokens dans [`Branding/tokens/radar-tokens.json`](../../Branding/tokens/radar-tokens.json).

**Persona principal** : **Karim Berrada**, fondateur de Marka Logistics (PME marocaine de logistique B2B, Casablanca, 35 salariés, 6 ans d'existence). Il surveille 3 concurrents historiques + 2 nouveaux entrants. Persona 2 du PRD § 4.2 (Dirigeant PME). Voir [USER-STORIES-Sprint01-Authentification.md](./USER-STORIES-Sprint01-Authentification.md) § Préambule.

**Référence design** : le design HTML/CSS/JSX livré par l'équipe est dans `.tmp-design/radar/project/` :

- `auth-styles.css` : feuille de styles complète (tokens + composants + animations)
- `auth-shared.jsx` : 12 composants React (logo, branding panel, card, form input, password strength, buttons, divider, alerts, countdown, status circle)
- `auth-screens.jsx` : 5 écrans avec leurs états (Login : 6 états, Register : 4, Forgot : 3, Reset : 3, Verify : 3)
- `auth-icons.jsx` : 14 icônes outline 1.5px (Mail, Lock, User, Eye, EyeOff, ArrowLeft, AlertCircle, AlertTriangle, CheckCircle, KeyRound, ShieldCheck, MailCheck, Loader, Google)

Cette source est à **réimplémenter en TSX/Tailwind v4** dans `apps/web/` (pas à copier brut). Les coordonnées SVG, les durées d'animation et les textes UI doivent être préservés à l'identique.

---

## 4. Livrables techniques

| #    | Livrable                 | Fichier(s)                                           | Description                                                                                                                                                                             |
| ---- | ------------------------ | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1  | Validation Zod           | `apps/web/src/lib/validators/auth.ts`                | 6 schémas (email, password, login, register, forgotPassword, resetPassword) avec messages français                                                                                      |
| 4.2  | Server Actions stubs     | `apps/web/src/lib/actions/auth.ts`                   | 5 actions `'use server'` qui mockent (resolve 800ms) ; TODO sprint 1.5 : brancher Better Auth                                                                                           |
| 4.3  | Page Connexion           | `apps/web/src/app/(auth)/login/page.tsx`             | Formulaire avec 6 états (default, loading, email-invalid, password-empty, auth-error, unverified)                                                                                       |
| 4.4  | Page Inscription         | `apps/web/src/app/(auth)/register/page.tsx`          | Formulaire avec 4 états + indicateur de force password                                                                                                                                  |
| 4.5  | Page Mot de passe oublié | `apps/web/src/app/(auth)/forgot-password/page.tsx`   | 2 stages (form, sent) avec countdown 60s, état d'erreur not-found                                                                                                                       |
| 4.6  | Page Réinitialisation    | `apps/web/src/app/(auth)/reset-password/page.tsx`    | 3 états (form, success, expired) selon `token` query param                                                                                                                              |
| 4.7  | Page Vérification email  | `apps/web/src/app/(auth)/verify-email/page.tsx`      | 3 états (default, success, invalid) + lien skip vers `/dashboard`                                                                                                                       |
| 4.8  | Layout du groupe Auth    | `apps/web/src/app/(auth)/layout.tsx`                 | Wrapper minimal `min-h-dvh` avec `fade-mount`                                                                                                                                           |
| 4.9  | 12 composants Auth       | `apps/web/src/components/auth/*.tsx`                 | AuthLayout, AuthBrandingPanel, AuthCard, RadarPulseBackground, SignalDot, FormInput, PasswordStrength, GoogleOAuthButton, AuthDivider, InlineAlert, ResendCountdownButton, StatusCircle |
| 4.10 | Composant brand Logo     | `apps/web/src/components/brand/logo.tsx`             | RadarLockupLight (mark teal + wordmark blanc inline SVG, height par prop)                                                                                                               |
| 4.11 | Refonte fondations       | `apps/web/src/app/{globals.css,layout.tsx,page.tsx}` | globals.css = Branding tokens + @keyframes Auth ; layout = next/font/local Outfit + JetBrains Mono ; page racine redirect vers `/login`                                                 |
| 4.12 | Assets statiques         | `apps/web/public/{fonts,logos,favicons}/`            | Polices TTF (Outfit 5 poids + JetBrains Mono 2), 8 logos SVG, set complet de favicons + manifest                                                                                        |
| 4.13 | Dépendances ajoutées     | `apps/web/package.json`                              | `lucide-react`, `react-hook-form`, `@hookform/resolvers`, `zod`                                                                                                                         |

---

## 5. Comportements attendus

### 5.1 Page Connexion (`/login`)

**Layout** : Split 50/50 sur desktop. Partie gauche = formulaire centré max-w 420px padding 56px 32px. Partie droite = `AuthBrandingPanel variant="login"` avec fond `#141A22` padding 64px. Mobile (<900px) : panneau masqué via `@media (max-width: 900px)`, formulaire en pleine largeur.

**Champs du formulaire** :

| Champ               | Type     | Obligatoire | Validation                                               | Icône leading | autoComplete       |
| ------------------- | -------- | ----------- | -------------------------------------------------------- | ------------- | ------------------ |
| Email professionnel | email    | oui         | Format email valide (regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`) | Mail 16px     | `email`            |
| Mot de passe        | password | oui         | Non vide (≥1 char)                                       | Lock 16px     | `current-password` |

**Éléments UI (de haut en bas)** :

1. Logo `RadarLockupLight` height 36px, top-left du formulaire (mark teal + wordmark blanc inline)
2. Spacer 48px
3. Titre H1 « Bon retour. » (40px, Outfit 700, `#E8EAED`, line-height 1.15, letter-spacing -0.01em)
4. Sous-titre « Connectez-vous pour reprendre la veille. » (16px, `#94A3B8`, line-height 1.5, marge top 8px)
5. Spacer 32px
6. **Inline alert** conditionnel (state-dépendant, voir § États ci-dessous)
7. Bouton **GoogleOAuth** pleine largeur : « Continuer avec Google » (h 44px, bg `#141A22`, border 1px `#334155`, icône Google SVG officielle)
8. Spacer 24px
9. Divider « ou » centré (1px `#1F2937` avec texte centré sur fond `#0B0F14` padding-x 16px)
10. Spacer 24px
11. **FormInput email** : label « Email professionnel », placeholder « nom@entreprise.ma »
12. Spacer 16px
13. **FormInput password** : label « Mot de passe », placeholder « •••••••• », toggle eye à droite
14. Lien « Mot de passe oublié ? » aligné à droite, marge top 10px (Caption 13px, `#14B8A6` hover `#2DD4BF`)
15. Spacer 24px
16. **PrimaryButton** « Se connecter » (h 44px, bg `#14B8A6`, text `#0B0F14`, hover `#0D9488`)
17. Spacer 32px
18. Footer : « Pas encore de compte ? » + lien teal « Créer un compte » → `/register`

**Branding panel droite (variant="login")** :

- Fond `#141A22`, padding 64px
- `RadarPulseBackground` en absolu : 3 arcs concentriques teal centrés sur (60, 540) avec rayons 100/220/360. Animation `arc-N-anim` cascade décalée 1.3s, opacité variable 0.45→0.18, scale 1→1.06 sur 4s infinite
- `SignalDot` safran 5px à `[200°, 265°]` aléatoire sur l'arc 360, animation `signal-blink` (opacity 0→1→0 sur 2.4s) + `signal-ring` (r 5→22 + opacity 0.8→0)
- Contenu centré verticalement (z-index 2, max-width 460px) :
  - H2 « Vos concurrents bougent. » (32px Outfit 600 `#E8EAED`)
  - H2 « Radar vous le dit avant tout le monde. » (32px Outfit 600 **`#14B8A6`** marge top 8px)
  - Body L 18px `#94A3B8` marge top 24px : « Agent IA de veille concurrentielle. Cycle M244 intégré. »
- Meta absolu bottom-left : « Module M244 · ENSA Tétouan · 2026 » (Caption 12px `#64748B` JetBrains Mono letter-spacing 0.04em)

**États du formulaire** :

| État               | Déclencheur                                        | Comportement                                                                                                                                                          |
| ------------------ | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **default**        | Au montage                                         | Tous champs vides, pas d'alerte                                                                                                                                       |
| **loading**        | Après clic « Se connecter » avec validation OK     | Bouton disabled + spinner `Loader` 16px qui tourne (1s linear infinite) + libellé « Connexion... »                                                                    |
| **email-invalid**  | Submit + email vide ou format invalide             | Border input rouge `#EF4444` + ring 2px `rgba(239,68,68,0.20)` + message « Format d'email invalide » avec icône `AlertCircle` 14px                                    |
| **password-empty** | Submit + password vide                             | Idem mais sur le champ password, message « Mot de passe requis »                                                                                                      |
| **auth-error**     | Server Action retourne erreur 401                  | InlineAlert tone="error" en haut du formulaire (au-dessus de Google) : « Email ou mot de passe incorrect » avec icône `AlertTriangle` 16px. Border-left 3px `#EF4444` |
| **unverified**     | Server Action retourne erreur "EMAIL_NOT_VERIFIED" | InlineAlert tone="warn" : « Vérifiez d'abord votre email. » + lien teal « Renvoyer le lien » qui appelle `resendVerificationAction()`                                 |

**Comportements (ordre d'événements)** :

1. Au focus d'un champ : transition border-color 150ms vers `#14B8A6`, box-shadow ring teal/30
2. Au blur du champ email : si non vide et invalide → état `email-invalid`
3. Au keystroke dans email : si état `email-invalid`, recheck à chaque keystroke pour potentiellement nettoyer
4. Au clic toggle eye du password : bascule type=text/password, icône `Eye`/`EyeOff` (le focus reste, `tabIndex={-1}` pour skip dans le tab order)
5. Au clic « Se connecter » : valider via Zod `loginSchema`. Si invalide → afficher erreurs inline + scroll au premier champ erreur. Si valide → état `loading` → appel `loginAction(input)`. Réponse :
   - `{ success: true, redirectTo: "/dashboard" }` → `router.push(redirectTo)`
   - `{ success: false, error: "INVALID_CREDENTIALS" }` → état `auth-error`
   - `{ success: false, error: "EMAIL_NOT_VERIFIED" }` → état `unverified`

> Pour Sprint 01, `loginAction` est mockée (resolve `{ success: true, redirectTo: "/dashboard" }` après 800ms). Les états `auth-error` / `unverified` sont déclenchables via une prop `initialState` injectée par les pages de démo (visible dans `apps/web/src/app/(auth)/login/page.tsx` via le pattern de l'auth-screens.jsx du design).

### 5.2 Page Inscription (`/register`)

**Layout** : Split 50/50 identique à login.

**Champs du formulaire** :

| Champ               | Type     | Obligatoire | Validation                                | Icône leading | autoComplete   |
| ------------------- | -------- | ----------- | ----------------------------------------- | ------------- | -------------- |
| Nom complet         | text     | oui         | Min 2 caractères, max 100                 | User 16px     | `name`         |
| Email professionnel | email    | oui         | Format valide, unicité (vérifiée serveur) | Mail 16px     | `email`        |
| Mot de passe        | password | oui         | Min 8 char, ≥ 1 majuscule, ≥ 1 chiffre    | Lock 16px     | `new-password` |

**Éléments UI** :

1. Logo identique
2. Titre H1 « Démarrez votre veille. »
3. Sous-titre « Créez votre compte. Le premier mouvement détecté arrive demain matin. »
4. Inline alert conditionnel (`email-exists`)
5. Bouton GoogleOAuth « S'inscrire avec Google »
6. Divider « ou »
7. **FormInput nom** : placeholder « Karamo Sylla »
8. **FormInput email** : placeholder « nom@entreprise.ma »
9. **FormInput password** : placeholder « Min. 8 caractères », toggle eye
10. **PasswordStrength** sous le champ password : 4 segments horizontaux (h 4px, gap 4px, radius 2px). Couleurs : segment 1 `#EF4444`, 2 `#F59E0B`, 3 `#FCD34D`, 4 `#10B981`. Sous l'indicateur, caption 13px `#64748B` : « Min. 8 caractères, 1 majuscule, 1 chiffre »
11. **PrimaryButton** « Créer mon compte » (en loading : « Création du compte... »)
12. Texte légal centré (caption 12.5px, `#64748B`, line-height 1.55) : « En créant un compte, vous acceptez nos [Conditions d'utilisation] et notre [Politique de confidentialité]. » (liens teal)
13. Footer : « Déjà un compte ? » + lien « Se connecter »

**Branding panel droite (variant="register")** :

- `RadarPulseBackground` identique
- En plus, **3 floating badges** (`fbadge`) en absolu sur le panneau, animation `float-y` (translateY ±6px sur 4-6s) :
  - Top 12% Right 8% : `fbadge-teal` « PRICING_CHANGE » (bg rgba teal/0.15, text `#2DD4BF`, JetBrains Mono 12px medium)
  - Top 48% Right 14% : `fbadge-safran` « LEVEE_FONDS » (bg rgba safran/0.15, text `#F59E0B`)
  - Top 28% Right 28% : `fbadge-neutral` « RECRUTEMENT » (bg `#1C242F`, text `#94A3B8`)
- Slogan adapté :
  - H2 « Aucun mouvement concurrent ne devrait » (`#E8EAED`)
  - H2 « vous prendre par surprise. » (`#14B8A6`)
  - Body L : « Agent IA, méthodologie M244, recoupement multi-sources. Sans intervention humaine. »

**Validations temps réel** (pas seulement au submit) :

| Champ        | Règle                                                    | Feedback visuel                                                    |
| ------------ | -------------------------------------------------------- | ------------------------------------------------------------------ |
| Nom          | longueur ≥ 2                                             | Border `#10B981` + icône `CheckCircle` 16px trailing en `#10B981`  |
| Email        | regex format valide                                      | Idem                                                               |
| Mot de passe | 4 segments PasswordStrength via fonction `scorePassword` | Segments allumés progressivement (transition width 200ms ease-out) |

**État `email-exists`** : InlineAlert tone="warn" en haut du formulaire : « Cet email est déjà utilisé. » + lien teal « Se connecter ? » → `/login?email={value}` (pré-remplit le champ email sur login).

### 5.3 Page Mot de passe oublié (`/forgot-password`)

**Layout** : Pas de split. Card centrée verticalement et horizontalement (`auth-card-shell` : flex center, padding 32px 24px) sur fond `#0B0F14`.

**Card** :

- max-width 420px
- bg `#141A22`, border 1px `#1F2937`, radius 12px, padding 32px

**Stage `form` (par défaut)** :

1. **StatusCircle** tone="teal" : cercle 64px bg `#1C242F` border `#1F2937`, icône `KeyRound` 24px en `#14B8A6` centrée
2. Spacer 24px
3. Titre H2 centré « Mot de passe oublié ? » (28px Outfit 600 `#E8EAED`)
4. Body 16px centré `#94A3B8` line-height 1.55 : « Entrez votre email, nous vous enverrons un lien de réinitialisation. »
5. Spacer 32px
6. FormInput email
7. Spacer 24px
8. PrimaryButton « Envoyer le lien »
9. Spacer 24px
10. **Back link** centré : icône `ArrowLeft` 14px + « Retour à la connexion » → `/login` (couleur `#14B8A6` font 500)

**Stage `sent` (après envoi succès)** :

1. **StatusCircle** tone="success" : icône `MailCheck` 24px en `#10B981`
2. Spacer 24px
3. Titre H2 centré « Email envoyé »
4. Body centré : « Vérifiez votre boîte de réception à **{email}** » (l'email en `#E8EAED` bold inline) « . Le lien expire dans 1 heure. »
5. Spacer 24px
6. **ResendCountdownButton** initialSeconds=60, label="Renvoyer l'email" (Bouton Secondary qui décompte chaque seconde, libellé « Renvoyer dans Xs », réactivable au bout de 60s)
7. Spacer 16px
8. Back link « Retour à la connexion »

**Comportement « Envoyer le lien »** : valider Zod `forgotPasswordSchema` → `loadingAction` → mock résout `{ success: true }` → bascule stage="sent". **Sécurité** : toujours basculer en "sent" même si l'email n'existe pas, pour ne jamais révéler l'existence d'un compte (conformité PRD § 7.2 + bonnes pratiques OWASP).

**État erreur réseau** (état `not-found` du design, optionnel pour debug) : message inline sous le champ « Aucun compte trouvé avec cet email. » (Caption 13px `#EF4444` avec icône `AlertCircle`).

### 5.4 Page Réinitialisation (`/reset-password?token=...`)

**Layout** : Card centrée identique à forgot-password.

**3 états selon le query param `token`** :

#### État `form` (token présent et présumé valide)

1. **StatusCircle** tone="teal" : icône `ShieldCheck` 24px en `#14B8A6`
2. Spacer 24px
3. Titre H2 centré « Nouveau mot de passe »
4. Body centré : « Choisissez un mot de passe sécurisé pour votre compte. »
5. Spacer 32px
6. **FormInput** « Nouveau mot de passe » avec toggle eye, placeholder « Min. 8 caractères »
7. **PasswordStrength** sous le champ
8. Spacer 16px
9. **FormInput** « Confirmer le mot de passe » avec toggle eye, placeholder « Retapez votre mot de passe »
   - **Validation temps réel** : si != premier mot de passe → state `error` avec message « Les mots de passe ne correspondent pas »
   - Si == → state `success` avec icône `CheckCircle` 14px trailing
10. Spacer 24px
11. PrimaryButton « Réinitialiser le mot de passe »

#### État `success` (après reset OK)

1. StatusCircle tone="success" : icône `CheckCircle` 24px en `#10B981`
2. H2 « Mot de passe modifié »
3. Body « Votre mot de passe a été réinitialisé avec succès. »
4. PrimaryButton « Se connecter » → `/login`

#### État `expired` (token invalide ou absent)

1. StatusCircle tone="error" : icône `AlertTriangle` 24px en `#EF4444`
2. H2 « Lien expiré »
3. Body « Ce lien de réinitialisation a expiré ou est invalide. »
4. PrimaryButton « Demander un nouveau lien » → `/forgot-password`

### 5.5 Page Vérification email (`/verify-email`)

**Layout** : Card centrée.

**3 états** :

#### État `default` (l'utilisateur arrive après inscription, le mail vient d'être envoyé)

1. StatusCircle tone="teal" : icône `Mail` 24px en `#14B8A6`
2. H2 « Vérifiez votre email »
3. Body : « Nous avons envoyé un lien de confirmation à **{email}**. Clique dessus pour valider ton compte. »
4. Spacer 24px
5. **ResendCountdownButton** initialSeconds=60
6. Spacer 12px
7. **Ghost link** centré (Caption 13px `#94A3B8` hover `#E8EAED`, padding 10px 0) : « Continuer vers le dashboard sans vérifier » → `/dashboard` (vérification non-bloquante per PRD § 5.1)

#### État `success` (utilisateur a cliqué sur le lien dans l'email)

1. StatusCircle tone="success" : icône `CheckCircle`
2. H2 « Email vérifié »
3. Body : « Ton compte est désormais entièrement actif. »
4. PrimaryButton « Aller au dashboard »

#### État `invalid` (token expiré ou utilisé)

1. StatusCircle tone="error" : `AlertTriangle`
2. H2 « Lien invalide »
3. Body : « Ce lien de vérification a expiré ou a déjà été utilisé. »
4. SecondaryButton « Renvoyer un nouveau lien »

---

## 6. Composants réutilisables

> Tous les composants vivent dans `apps/web/src/components/` et sont marqués `'use client'` (hors `auth-layout.tsx` et `auth-card.tsx` qui peuvent rester Server Components purs sans state).

| #   | Composant                   | Fichier                            | Description courte                                                                                                                        |
| --- | --------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `AuthLayout`                | `auth/auth-layout.tsx`             | Wrapper grid 1fr 1fr (split shell). Collapse panneau droit `<md:hidden`. Ne rend pas le branding lui-même : prop `panel` à passer         |
| 2   | `AuthBrandingPanel`         | `auth/auth-branding-panel.tsx`     | Le panneau droit complet. Variant `"login"` ou `"register"`, slogans différents. Inclut RadarPulseBackground + (si register) les 3 fbadge |
| 3   | `RadarPulseBackground`      | `auth/radar-pulse-background.tsx`  | 3 arcs SVG concentriques teal animés en cascade depuis l'origine (60, 540) avec rayons 100/220/360. Inclut `SignalDot`                    |
| 4   | `SignalDot`                 | `auth/signal-dot.tsx`              | Dot safran 5px qui apparaît périodiquement à un angle aléatoire `[200°, 265°]` sur l'arc extérieur. useEffect avec setTimeout 2400ms      |
| 5   | `AuthCard`                  | `auth/auth-card.tsx`               | Wrapper card centrée 420px avec padding 32px                                                                                              |
| 6   | `FormInput`                 | `auth/form-input.tsx`              | Input typé avec label, leading icon, états error/success, toggle eye pour `type="password"`, ARIA                                         |
| 7   | `PasswordStrength`          | `auth/password-strength.tsx`       | 4 segments horizontaux + caption critères. Exporte aussi `scorePassword(pw): 0..4`                                                        |
| 8   | `GoogleOAuthButton`         | `auth/google-oauth-button.tsx`     | Bouton avec logo Google SVG inline (4 paths colors officiels)                                                                             |
| 9   | `AuthDivider`               | `auth/auth-divider.tsx`            | Ligne horizontale 1px `#1F2937` avec « ou » centré sur fond bg-primary (bg-surface dans une card)                                         |
| 10  | `InlineAlert`               | `auth/inline-alert.tsx`            | Bandeau d'alerte tone="error" ou tone="warn", border-left 3px, icône `AlertTriangle`                                                      |
| 11  | `ResendCountdownButton`     | `auth/resend-countdown-button.tsx` | Bouton Secondary qui décompte avec `setInterval`, libellé « Renvoyer dans Xs » puis « Renvoyer l'email » à 0s                             |
| 12  | `StatusCircle`              | `auth/status-circle.tsx`           | Cercle 64px bg `#1C242F` border `#1F2937` avec icône colorée (tone teal/success/error)                                                    |
| 13  | `Logo` (`RadarLockupLight`) | `brand/logo.tsx`                   | SVG inline du lockup-light : mark teal + safran dot + wordmark blanc « RADAR ». Prop `height`                                             |

---

## 7. Middleware et redirections

> **Hors scope sprint 01** (différé sprint 1.5 quand Better Auth + Postgres seront branchés). Spécifié ici pour traçabilité.

### 7.1 Matrice de redirections cible

| Situation                      | URL demandée                                                                                  | Redirection                                               |
| ------------------------------ | --------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Non connecté                   | `/dashboard`, `/competitors/*`, `/movements/*`, `/settings/*`, `/onboarding`, `/onboarding/*` | → `/login?callbackUrl={url}`                              |
| Connecté + onboarding fait     | `/login`, `/register`                                                                         | → `/dashboard`                                            |
| Connecté + onboarding non fait | `/dashboard`, `/settings`, `/competitors/*`, `/movements/*`                                   | → `/onboarding?step=1`                                    |
| Connecté + onboarding fait     | `/onboarding`, `/onboarding/*`                                                                | → `/dashboard`                                            |
| Connecté + email non vérifié   | (toutes routes auth)                                                                          | Accès autorisé + bannière persistante au layout dashboard |

### 7.2 Routes publiques

```
/login
/register
/forgot-password
/reset-password
/verify-email
```

### 7.3 Routes protégées (à brancher sprint 1.5)

```
/dashboard, /dashboard/*
/competitors, /competitors/*
/movements, /movements/*
/settings, /settings/*
/onboarding, /onboarding/*
/api/internal/*  (gardé par X-Internal-Secret, hors auth utilisateur)
```

---

## 8. Templates email

> **Hors scope sprint 01**. Sera implémenté au sprint 1.5 (templates React Email + intégration Resend). Spécifié ici pour traçabilité.

### 8.1 Email de réinitialisation de mot de passe

| Propriété   | Valeur                                                                        |
| ----------- | ----------------------------------------------------------------------------- |
| Sujet       | « Réinitialiser votre mot de passe — RADAR »                                  |
| From        | « RADAR \<noreply@radar.{domaine}\> »                                         |
| Bouton CTA  | « Réinitialiser mon mot de passe » → `{APP_URL}/reset-password?token={token}` |
| Lien expire | 1 heure, usage unique                                                         |

### 8.2 Email de vérification

| Propriété   | Valeur                                                          |
| ----------- | --------------------------------------------------------------- |
| Sujet       | « Vérifiez votre adresse email — RADAR »                        |
| From        | « RADAR \<noreply@radar.{domaine}\> »                           |
| Bouton CTA  | « Vérifier mon email » → `{APP_URL}/verify-email?token={token}` |
| Lien expire | 24 heures                                                       |

---

## 9. Schémas Zod de validation

```typescript
// apps/web/src/lib/validators/auth.ts
import { z } from "zod";

export const emailSchema = z
  .string({ required_error: "Email requis" })
  .min(1, "Email requis")
  .email({ message: "Format d'email invalide" })
  .toLowerCase();

export const passwordSchema = z
  .string({ required_error: "Mot de passe requis" })
  .min(8, "Min. 8 caractères")
  .max(128, "Mot de passe trop long")
  .regex(/[A-Z]/, "Au moins 1 majuscule")
  .regex(/\d/, "Au moins 1 chiffre");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Mot de passe requis"),
});

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Nom complet requis" })
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token requis"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
```

---

## 10. Server Actions

> Sprint 01 : **toutes mockées** (resolve `{ success: true }` après 800ms). TODO sprint 1.5 : brancher Better Auth réel.

```typescript
// apps/web/src/lib/actions/auth.ts
"use server";

import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginInput,
  type RegisterInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/lib/validators/auth";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type ActionResult<T = void> =
  | { success: true; data?: T; redirectTo?: string }
  | { success: false; error: AuthErrorCode };

export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "EMAIL_NOT_VERIFIED"
  | "EMAIL_ALREADY_EXISTS"
  | "ACCOUNT_NOT_FOUND"
  | "TOKEN_INVALID"
  | "TOKEN_EXPIRED"
  | "RATE_LIMITED"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR";

export async function loginAction(
  input: LoginInput,
): Promise<ActionResult<{ userId: string }>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "VALIDATION_ERROR" };
  await wait(800);
  // TODO sprint 1.5 : await auth.api.signInEmail({ body: parsed.data })
  // → déterminer redirectTo : callbackUrl > /onboarding (si non fait) > /dashboard
  return {
    success: true,
    redirectTo: "/dashboard",
    data: { userId: "mock_user_01" },
  };
}

export async function registerAction(
  input: RegisterInput,
): Promise<ActionResult<{ userId: string }>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "VALIDATION_ERROR" };
  await wait(800);
  // TODO sprint 1.5 : await auth.api.signUpEmail({ body: parsed.data }) + Resend verify
  return {
    success: true,
    redirectTo: "/verify-email",
    data: { userId: "mock_user_02" },
  };
}

export async function forgotPasswordAction(
  input: ForgotPasswordInput,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "VALIDATION_ERROR" };
  await wait(800);
  // TODO sprint 1.5 : si email existe, envoyer Resend ; toujours retourner success
  return { success: true };
}

export async function resetPasswordAction(
  input: ResetPasswordInput,
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "VALIDATION_ERROR" };
  await wait(800);
  // TODO sprint 1.5 : valider token, hash bcrypt, invalider token (usage unique)
  return { success: true };
}

export async function resendVerificationAction(): Promise<ActionResult> {
  await wait(800);
  // TODO sprint 1.5 : récupérer session, rate-limit 1/60s, regen token, Resend
  return { success: true };
}
```

---

## 11. Sécurité

| Aspect                        | Mesure                                                           | Implémentation prévue (sprint 1.5)                                            |
| ----------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Hash mot de passe             | Argon2id                                                         | Better Auth en utilise nativement (memory 64 MB, iterations 3, parallelism 1) |
| Tokens reset                  | 256 bits aléatoires, valable 1h, usage unique                    | Better Auth + table `VerificationToken`                                       |
| Tokens vérification email     | 256 bits, valable 24h, usage unique                              | Idem                                                                          |
| Rate limiting                 | 1 envoi resend / 60s par utilisateur                             | Côté Server Action via Postgres-backed bucket                                 |
| Sessions                      | Database-backed (pas JWT côté client)                            | Better Auth cookie session HttpOnly + SameSite=Lax                            |
| HTTPS                         | Obligatoire en prod                                              | Caddy reverse proxy V1, Vercel V2                                             |
| Pas de leak existence compte  | Forgot password retourne toujours success                        | Spec § 5.3                                                                    |
| Pas de leak quel champ erroné | Login retourne « Email ou mot de passe incorrect » sans préciser | Spec § 5.1                                                                    |

---

## 12. Animations et transitions

| Élément                    | Animation                                | Durée                             | Easing                                     |
| -------------------------- | ---------------------------------------- | --------------------------------- | ------------------------------------------ |
| Page mount                 | fade-up : opacity 0→1 + translateY 8px→0 | 300ms                             | `cubic-bezier(0.16, 1, 0.3, 1)`            |
| Inputs focus               | border-color + box-shadow ring           | 150ms                             | ease-out                                   |
| Inputs hover               | bg-color (hover bg-elevated)             | 150ms                             | ease-out                                   |
| Bouton primary hover       | bg-color                                 | 150ms                             | ease-out                                   |
| Bouton primary active      | translateY 0.5px                         | 150ms                             | ease-out                                   |
| Toggle eye click           | (instantané, juste le swap d'icône)      | —                                 | —                                          |
| Spinner Loader             | rotate 0→360                             | 1s infinite                       | linear                                     |
| Indicateur force password  | bg-color des segments                    | 200ms                             | ease-out                                   |
| Arc 1 (innermost)          | scale 1→1.06, opacity 0.45→0.18          | 4s infinite                       | ease-in-out                                |
| Arc 2                      | idem, delay 1.3s, opacity 0.28→0.10      | 4s infinite                       | ease-in-out                                |
| Arc 3 (outermost)          | idem, delay 2.6s, opacity 0.12→0.04      | 4s infinite                       | ease-in-out                                |
| SignalDot blink            | opacity 0→1 (20%)→1 (70%)→0              | 2.4s                              | ease-out                                   |
| SignalDot ring             | r 5→22, opacity 0.8→0                    | 2.4s                              | ease-out                                   |
| Floating badges (register) | translateY 0→-6px→0                      | 4-6s infinite avec delays décalés | ease-in-out                                |
| InlineAlert mount          | opacity 0→1 + translateY 4px→0           | 200ms                             | ease-out                                   |
| StatusCircle (état succès) | scale 0→1.1→1                            | 400ms                             | spring (cubic-bezier(0.34, 1.56, 0.64, 1)) |

---

## 13. Responsive

| Breakpoint                                     | Login / Register                                                                                                                | Forgot / Reset / Verify                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Desktop ≥1280px (xl)                           | Split 50/50, panneau visible                                                                                                    | Card 420px centrée                                       |
| Desktop 1024-1279px (lg)                       | Idem                                                                                                                            | Idem                                                     |
| Tablette 768-1023px (md)                       | Split 50/50 (légèrement compressé)                                                                                              | Idem                                                     |
| **Mobile <900px** (point de bascule du design) | **Panneau masqué** (`@media (max-width: 900px) { .split-panel { display: none; } }`), formulaire pleine largeur, padding-x 16px | Card pleine largeur sans max-width, padding 16px latéral |

**Touch targets mobile** : tous les boutons et inputs en min 44px (déjà la cible WCAG AA respectée).

---

## 14. Stack imposée

| Technologie              | Version                            | Usage                                                         |
| ------------------------ | ---------------------------------- | ------------------------------------------------------------- |
| Next.js                  | 16.2.4                             | Framework, App Router                                         |
| React                    | 19.2.4                             | UI                                                            |
| TypeScript               | 5.9                                | strict + noUncheckedIndexedAccess                             |
| Tailwind CSS             | 4.2                                | styling via `@theme` block dans globals.css                   |
| Zod                      | latest                             | Validation client + serveur                                   |
| React Hook Form          | latest                             | State des formulaires                                         |
| @hookform/resolvers      | latest                             | Bridge RHF + Zod (`zodResolver`)                              |
| Lucide React             | latest                             | Icônes outline 1.5px                                          |
| Outfit                   | Google Fonts via `next/font/local` | Police principale UI                                          |
| JetBrains Mono           | Google Fonts via `next/font/local` | Police mono pour valeurs numériques                           |
| **Hors scope sprint 01** |                                    |                                                               |
| Better Auth              | latest                             | Backend auth (sprint 1.5)                                     |
| Resend                   | latest                             | Envoi emails (sprint 1.5)                                     |
| Prisma                   | 6                                  | Tables User, Session, Account, VerificationToken (sprint 1.5) |

---

## 15. Arborescence fichiers (cible après sprint 01)

```
apps/web/
├── public/
│   ├── fonts/
│   │   ├── Outfit/
│   │   │   ├── Outfit-Light.ttf
│   │   │   ├── Outfit-Regular.ttf
│   │   │   ├── Outfit-Medium.ttf
│   │   │   ├── Outfit-SemiBold.ttf
│   │   │   └── Outfit-Bold.ttf
│   │   └── JetBrainsMono/
│   │       ├── JetBrainsMono-Regular.ttf
│   │       └── JetBrainsMono-Medium.ttf
│   ├── logos/
│   │   ├── mark.svg
│   │   ├── mark-mono.svg
│   │   ├── wordmark.svg
│   │   ├── wordmark-light.svg
│   │   ├── wordmark-mono.svg
│   │   ├── lockup.svg
│   │   ├── lockup-light.svg
│   │   └── lockup-mono.svg
│   ├── favicon.svg
│   ├── favicon.ico
│   ├── favicon-{16,32,48,64,96,180,192,512}.png
│   ├── apple-touch-icon.png
│   └── manifest.json
└── src/
    ├── app/
    │   ├── layout.tsx                ← root, next/font/local + metadata RADAR
    │   ├── page.tsx                  ← redirect("/login")
    │   ├── globals.css               ← @theme Tailwind v4 + @keyframes auth
    │   └── (auth)/
    │       ├── layout.tsx            ← min-h-dvh + fade-mount
    │       ├── login/page.tsx
    │       ├── register/page.tsx
    │       ├── forgot-password/page.tsx
    │       ├── reset-password/page.tsx
    │       └── verify-email/page.tsx
    ├── components/
    │   ├── auth/
    │   │   ├── auth-layout.tsx
    │   │   ├── auth-branding-panel.tsx
    │   │   ├── auth-card.tsx
    │   │   ├── radar-pulse-background.tsx
    │   │   ├── signal-dot.tsx
    │   │   ├── form-input.tsx
    │   │   ├── password-strength.tsx
    │   │   ├── google-oauth-button.tsx
    │   │   ├── auth-divider.tsx
    │   │   ├── inline-alert.tsx
    │   │   ├── resend-countdown-button.tsx
    │   │   └── status-circle.tsx
    │   └── brand/
    │       └── logo.tsx              ← RadarLockupLight
    └── lib/
        ├── validators/
        │   └── auth.ts               ← 6 schémas Zod
        └── actions/
            └── auth.ts               ← 5 Server Actions stubs
```

---

## 16. Variables d'environnement requises

> Sprint 01 : aucune (mocks). Sprint 1.5 : ajout de `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `RESEND_API_KEY`, `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `DATABASE_URL`.

À documenter dans `.env.example` au sprint 1.5.

---

## 17. Critères d'acceptation

### 17.1 Page Login

- [ ] La page rend correctement à l'URL `/login`
- [ ] Logo `RadarLockupLight` 36px en haut à gauche du formulaire
- [ ] Titre H1 « Bon retour. » et sous-titre exact
- [ ] Bouton GoogleOAuth « Continuer avec Google » fonctionnel (mock)
- [ ] Divider « ou » centré sur fond bg-primary
- [ ] FormInput email avec icône Mail, validation regex au submit, message erreur français si invalide
- [ ] FormInput password avec icône Lock + toggle eye, message erreur si vide au submit
- [ ] Lien « Mot de passe oublié ? » aligné droite, navigue vers `/forgot-password`
- [ ] PrimaryButton « Se connecter » avec spinner + libellé « Connexion... » en loading
- [ ] InlineAlert tone="error" s'affiche si erreur 401 simulée
- [ ] InlineAlert tone="warn" s'affiche si email non vérifié simulé
- [ ] Lien footer « Créer un compte » navigue vers `/register`
- [ ] Branding panel avec slogan « Vos concurrents bougent... » en `#E8EAED` puis `#14B8A6`
- [ ] RadarPulseBackground : 3 arcs animés en cascade visibles
- [ ] SignalDot safran qui apparaît périodiquement sur l'arc extérieur
- [ ] Meta absolu bottom-left « Module M244 · ENSA Tétouan · 2026 » en JetBrains Mono

### 17.2 Page Register

- [ ] La page rend à `/register`
- [ ] Titre H1 « Démarrez votre veille. » + sous-titre exact
- [ ] InlineAlert tone="warn" « Cet email est déjà utilisé. » + lien « Se connecter ? » s'affiche en état `email-exists`
- [ ] FormInput nom, email, password
- [ ] PasswordStrength sous le password : 4 segments allumés progressivement avec couleurs `#EF4444 → #F59E0B → #FCD34D → #10B981`
- [ ] Caption « Min. 8 caractères, 1 majuscule, 1 chiffre » sous l'indicateur
- [ ] Validation temps réel : check vert sur nom et email valides
- [ ] PrimaryButton « Créer mon compte » → libellé « Création du compte... » en loading
- [ ] Texte légal centré avec liens Conditions / Politique
- [ ] Footer « Déjà un compte ? Se connecter » → `/login`
- [ ] Branding panel avec slogan « Aucun mouvement concurrent... »
- [ ] **3 floating badges** « PRICING_CHANGE », « LEVEE_FONDS », « RECRUTEMENT » qui flottent

### 17.3 Page Forgot Password

- [ ] La page rend à `/forgot-password`
- [ ] Card centrée 420px avec StatusCircle teal + KeyRound
- [ ] Titre « Mot de passe oublié ? » centré
- [ ] FormInput email
- [ ] PrimaryButton « Envoyer le lien »
- [ ] Stage `sent` après submit : icône MailCheck verte + titre « Email envoyé » + body avec email en bold
- [ ] ResendCountdownButton qui décompte de 60 à 0
- [ ] Back link « Retour à la connexion » → `/login`

### 17.4 Page Reset Password

- [ ] La page rend à `/reset-password?token=valid` en état `form`
- [ ] StatusCircle teal + ShieldCheck
- [ ] Titre « Nouveau mot de passe »
- [ ] 2 FormInputs password avec toggle eye chacun
- [ ] PasswordStrength sur le premier
- [ ] Validation match temps réel sur le second (success vert si match, erreur rouge si mismatch)
- [ ] PrimaryButton « Réinitialiser le mot de passe »
- [ ] Sans token (ou `?token=expired`) → état `expired` avec AlertTriangle + bouton « Demander un nouveau lien » → `/forgot-password`
- [ ] Après submit success → état `success` avec CheckCircle + bouton « Se connecter » → `/login`

### 17.5 Page Verify Email

- [ ] La page rend à `/verify-email`
- [ ] StatusCircle teal + Mail
- [ ] Titre « Vérifiez votre email »
- [ ] Body avec email en bold inline
- [ ] ResendCountdownButton 60s
- [ ] Ghost link « Continuer vers le dashboard sans vérifier » → `/dashboard`
- [ ] Avec `?token=valid` → état `success`
- [ ] Avec `?token=invalid` → état `invalid`

### 17.6 Qualité technique

- [ ] `pnpm exec turbo run type-check` retourne 0 erreur
- [ ] `pnpm exec turbo run lint` retourne 0 erreur ESLint
- [ ] `pnpm exec turbo run build` réussit pour `@radar/web`
- [ ] Aucun `any` TypeScript dans les composants ni les pages
- [ ] Tous les composants client marqués `'use client'`
- [ ] `next/font/local` charge Outfit + JetBrains Mono sans erreur de path
- [ ] Tous les imports résolus (`@/components/...`, `@/lib/...`)
- [ ] Pas de console.log dans le code de production

### 17.7 Accessibilité

- [ ] Tous les inputs ont un `<label htmlFor>`
- [ ] `aria-invalid={true}` sur les champs en erreur
- [ ] `aria-describedby` pointant sur le message d'erreur
- [ ] Toggle eye a un `aria-label` dynamique (« Afficher le mot de passe » / « Masquer... »)
- [ ] Le `tabIndex={-1}` sur le toggle eye le sort du tab order
- [ ] Focus visible (ring 2px teal/30) sur tous les éléments interactifs
- [ ] InlineAlert a `role="alert"`
- [ ] `lang="fr"` sur `<html>`
- [ ] Contraste WCAG AAA sur le texte primary, AA sur secondary

### 17.8 Responsive

- [ ] Desktop ≥1280px : split 50/50 visible sur login/register
- [ ] Tablette 900-1279px : split 50/50 maintenu
- [ ] Mobile <900px : panneau branding masqué, formulaire pleine largeur padding 16px
- [ ] Cards centrées (forgot/reset/verify) restent lisibles à 320px de largeur
- [ ] Aucun débordement horizontal (`overflow-x: hidden` au besoin)

---

## 18. Hors scope (différé sprint 1.5)

| Item                                                                  | Raison                                                 | Sprint cible        |
| --------------------------------------------------------------------- | ------------------------------------------------------ | ------------------- |
| Setup Better Auth réel                                                | Postgres pas encore tournant en local de tous les devs | 1.5                 |
| Middleware Next.js (`src/middleware.ts`)                              | Dépend de Better Auth                                  | 1.5                 |
| Schéma Prisma `User` + `Session` + `Account` + `VerificationToken`    | Idem                                                   | 1.5                 |
| Templates emails React Email + intégration Resend                     | Dépend de Better Auth events                           | 1.5                 |
| Tests unitaires (Vitest) sur les composants Auth                      | Pas de framework de test installé                      | 2                   |
| Tests e2e Playwright des parcours auth                                | Idem                                                   | 2                   |
| Suppression compte / RGPD (PRD § 7.2 critère 6)                       | Couvert par F7 (Settings/Account)                      | 6 (sprint Settings) |
| Vérification email cliquable (route `/api/auth/verify-email/[token]`) | Sera géré par Better Auth handlers                     | 1.5                 |
| OAuth Google réel (popup, callback)                                   | Dépend de Better Auth + provider config                | 1.5                 |
| Détection compte Google déjà lié                                      | Idem                                                   | 1.5                 |
| Pre-fill email sur `/login?email=...` (bascule depuis register)       | Implémenté en frontend mais sans persistance d'erreur  | OK ce sprint        |
| Bannière vérification email persistante dans le dashboard             | Couvert par BLOC-03 Dashboard (déjà spec)              | 5 (Dashboard)       |

---

## 19. Dépendances à installer

Au démarrage du sprint, ajouter dans `apps/web` :

```bash
pnpm --filter @radar/web add lucide-react react-hook-form @hookform/resolvers zod
```

> `zod` est déjà disponible via `@radar/contracts` mais on l'ajoute en direct à `apps/web` pour une utilisation simple côté client (pas besoin de passer par les contrats internes pour les formulaires Auth).

Aucune nouvelle dépendance dev requise (Tailwind 4, TS 5, ESLint 9 déjà en place).

---

## 20. Références

- **PRD** :
  - § 5.2 Phase 1 : Inscription (champs, vérification non-bloquante)
  - § 5.3 Phase 2 : Onboarding (qui suit l'inscription)
  - § 7.2 F1 : Authentification et gestion compte (critères d'acceptation détaillés)
  - § 9.4 Endpoints publics auth (signature des routes API)
- **Charte graphique** : [`Branding/CHARTE_GRAPHIQUE_RADAR.md`](../../Branding/CHARTE_GRAPHIQUE_RADAR.md)
- **Tokens W3C** : [`Branding/tokens/radar-tokens.json`](../../Branding/tokens/radar-tokens.json)
- **Tailwind globals** : [`Branding/tailwind/globals.css`](../../Branding/tailwind/globals.css)
- **Logos** : [`Branding/logo/`](../../Branding/logo/)
- **Polices** : [`Branding/assets/fonts/`](../../Branding/assets/fonts/)
- **Favicons** : [`Branding/favicons/`](../../Branding/favicons/)
- **Design source de vérité** : `.tmp-design/radar/project/auth-{styles.css,shared.jsx,screens.jsx,icons.jsx}` (à archiver dans `docs/Sprint-01/design/` avant suppression du dossier `.tmp-design/`)
- **Document compagnon User Stories** : [`USER-STORIES-Sprint01-Authentification.md`](./USER-STORIES-Sprint01-Authentification.md)
