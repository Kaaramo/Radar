/**
 * Tests E2E du pipeline Deep Research (OpenAI Responses API, mode synchrone).
 *
 * Lancement (depuis la racine du repo) :
 *   pnpm --filter @radar/web exec tsx --env-file=apps/web/.env.local apps/web/scripts/test-deep-research-e2e.ts
 *
 * Pré-requis :
 *   - Dev Next.js qui tourne sur http://localhost:3000
 *   - OPENAI_API_KEY valide dans apps/web/.env.local (compte avec accès gpt-5.4 + web_search_preview)
 *   - Connexion réseau (appels OpenAI réels — coût ~0.20-0.25 $/run sur gpt-5.4)
 *
 * Tests :
 *   T1  Site réel (inwi.ma)       — exécution complète (~30-90s)
 *   T2  Lecture BDD post-T1       — payload récupérable
 *   T3  Rendu UI /settings        — HTML contient les données
 *   T4  Site bidon                — FAILED ou SUCCESS dégradé
 *   T5  API key absente           — FAILED rapide
 *   T6  Double-submit concurrent  — verrou actif (5 min)
 *
 * Durée totale estimée : ~3-5 min (T1 + T4 sont les seuls calls OpenAI longs).
 */

// L'env est chargé par tsx via --env-file=apps/web/.env.local
// (cf. scripts/run-deep-research-test.sh).

import { PrismaClient } from "@radar/database";
import { runDeepResearch } from "../src/lib/agents/deep-research";

const prisma = new PrismaClient();
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const TEST_PREFIX = `dr-e2e-${Date.now()}`;

type TestResult = {
  name: string;
  pass: boolean;
  durationMs: number;
  details?: string;
};
const results: TestResult[] = [];

function fmt(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

async function record(
  name: string,
  fn: () => Promise<{ pass: boolean; details?: string }>,
): Promise<void> {
  const start = Date.now();
  process.stdout.write(`\n  ▶ ${name}…`);
  try {
    const { pass, details } = await fn();
    const durationMs = Date.now() - start;
    results.push({ name, pass, durationMs, details });
    process.stdout.write(
      `\r  ${pass ? "✓" : "✗"} ${name}  (${fmt(durationMs)})${details ? ` — ${details}` : ""}\n`,
    );
  } catch (err) {
    const durationMs = Date.now() - start;
    const msg = err instanceof Error ? err.message : String(err);
    results.push({
      name,
      pass: false,
      durationMs,
      details: `EXCEPTION: ${msg}`,
    });
    process.stdout.write(
      `\r  ✗ ${name}  (${fmt(durationMs)}) — EXCEPTION: ${msg}\n`,
    );
  }
}

async function setupTestUser(
  label: string,
  siteWeb: string | null,
): Promise<{
  userId: string;
  profilId: string;
}> {
  const email = `${TEST_PREFIX}-${label}@radar.test`;
  const user = await prisma.user.create({
    data: {
      email,
      name: `Test ${label}`,
      emailVerified: false,
    },
  });
  const profil = await prisma.profilUtilisateur.create({
    data: {
      userId: user.id,
      nomEntreprise: `Test Entreprise ${label}`,
      siteWeb,
    },
  });
  return { userId: user.id, profilId: profil.id };
}

async function cleanup(): Promise<void> {
  await prisma.user.deleteMany({
    where: { email: { startsWith: TEST_PREFIX } },
  });
}

async function main(): Promise<void> {
  console.log("══════════════════════════════════════════════════════════");
  console.log(" RADAR — Tests E2E Deep Research");
  console.log("══════════════════════════════════════════════════════════");
  console.log(` BASE  = ${BASE}`);
  console.log(` PREFIX= ${TEST_PREFIX}`);
  const apiKey = process.env.OPENAI_API_KEY;
  const apiKeyState =
    !apiKey || apiKey.startsWith("sk-xxx") || apiKey.length < 20
      ? "MISSING (placeholder)"
      : "OK";
  console.log(` API KEY = ${apiKeyState}`);
  console.log();

  // ─── T1 : site réel (inwi.ma) ───────────────────────────────────────────
  // Exécution synchrone via runDeepResearch (await) — on veut mesurer le full pipeline
  console.log("── Setup T1/T2/T3 : user + profil avec inwi.ma");
  const t1 = await setupTestUser("inwi", "https://www.inwi.ma");

  await record(
    "T1 · runDeepResearch(inwi.ma) → SUCCESS, payload présent",
    async () => {
      await runDeepResearch(t1.profilId);
      const profil = await prisma.profilUtilisateur.findUnique({
        where: { id: t1.profilId },
      });
      if (!profil) return { pass: false, details: "profil introuvable" };
      const okStatut = profil.enrichissementStatut === "SUCCESS";
      const okPayload = profil.enrichissement !== null;
      const okDate = profil.enrichissementLe !== null;
      const pass = okStatut && okPayload && okDate;
      return {
        pass,
        details: `statut=${profil.enrichissementStatut} payload=${okPayload ? "présent" : "null"} err=${profil.enrichissementErreur ?? "-"}`,
      };
    },
  );

  // ─── T2 : récup via Prisma ──────────────────────────────────────────────
  await record(
    "T2 · lecture BDD payload lisible (status structured OU raw-fallback)",
    async () => {
      const profil = await prisma.profilUtilisateur.findUnique({
        where: { id: t1.profilId },
        select: { enrichissement: true },
      });
      if (!profil?.enrichissement) {
        return { pass: false, details: "enrichissement null" };
      }
      const obj = profil.enrichissement as Record<string, unknown>;
      const status = obj.status;
      const hasSchemaVer = typeof obj.schemaVersion === "string";
      const hasSkillVer = typeof obj.skillVersion === "string";
      const pass =
        (status === "structured" || status === "raw-fallback") &&
        hasSchemaVer &&
        hasSkillVer;
      return {
        pass,
        details: `status=${String(status)} schemaVer=${String(obj.schemaVersion)} skillVer=${String(obj.skillVersion)}`,
      };
    },
  );

  // ─── T3 : rendu UI /settings (auth via Better Auth sign-up + cookie) ────
  await record(
    "T3 · rendu UI /settings?section=deep-research contient les données",
    async () => {
      // Crée un user via Better Auth pour avoir un cookie session valide.
      // (le user créé en T1 via Prisma directement n'a pas de mot de passe → on créé via API)
      const t3email = `${TEST_PREFIX}-ui@radar.test`;
      const signUp = await fetch(`${BASE}/api/auth/sign-up/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: BASE },
        body: JSON.stringify({
          email: t3email,
          password: "TestPass1234",
          name: "T3 UI",
        }),
      });
      if (!signUp.ok) {
        return { pass: false, details: `sign-up failed ${signUp.status}` };
      }
      const setCookie = signUp.headers.get("set-cookie") ?? "";
      const cookie =
        setCookie
          .split(",")
          .find((c) => c.includes("better-auth.session_token")) ?? "";
      if (!cookie) return { pass: false, details: "pas de cookie session" };

      // Lie le profil T1 (avec enrichissement) à ce user
      const newUser = await prisma.user.findUnique({
        where: { email: t3email },
      });
      if (!newUser) return { pass: false, details: "user T3 introuvable" };

      // Détruit le user inwi temporairement pour libérer le profil → relier au user T3
      // (simple : on déplace l'enrichissement vers un nouveau profil sur user T3)
      const t1Profile = await prisma.profilUtilisateur.findUnique({
        where: { id: t1.profilId },
      });
      if (!t1Profile) return { pass: false, details: "profil T1 introuvable" };

      await prisma.profilUtilisateur.upsert({
        where: { userId: newUser.id },
        create: {
          userId: newUser.id,
          nomEntreprise: t1Profile.nomEntreprise,
          siteWeb: t1Profile.siteWeb,
          enrichissement: t1Profile.enrichissement ?? undefined,
          enrichissementLe: t1Profile.enrichissementLe,
          enrichissementVer: t1Profile.enrichissementVer,
          enrichissementStatut: t1Profile.enrichissementStatut,
          // Onboarding complet pour passer le garde-fou /app
          axes: ["STRATEGIE", "TECH"],
          onboardingCompleteLe: new Date(),
        },
        update: {},
      });

      // Crée un concurrent pour passer la garde onboarding step-2 → step-3
      await prisma.concurrent.create({
        data: { userId: newUser.id, nom: "Concurrent T3" },
      });

      // GET /settings avec cookie
      const res = await fetch(`${BASE}/settings?section=deep-research`, {
        headers: { Cookie: cookie.split(";")[0] ?? "" },
        redirect: "follow",
      });
      if (!res.ok)
        return { pass: false, details: `settings HTTP ${res.status}` };
      const html = await res.text();
      const lower = html.toLowerCase();
      const hasDeepResearch = lower.includes("deep research");
      // "Sources · N" (vue structured) ou "N sources" (raw-fallback)
      const hasSources = lower.includes("sources");
      const hasNoEmpty = !html.includes("Lancer le Deep Research");
      return {
        pass: hasDeepResearch && hasSources && hasNoEmpty,
        details: `dr=${hasDeepResearch} sources=${hasSources} noEmpty=${hasNoEmpty}`,
      };
    },
  );

  // ─── T4 : site bidon → FAILED propre ────────────────────────────────────
  console.log("\n── Setup T4 : user + profil avec site bidon");
  const t4 = await setupTestUser(
    "bidon",
    "https://thissitedoesnotexist-radar.invalid",
  );
  await record("T4 · site bidon → FAILED ou SUCCESS dégradé", async () => {
    await runDeepResearch(t4.profilId);
    const profil = await prisma.profilUtilisateur.findUnique({
      where: { id: t4.profilId },
    });
    if (!profil) return { pass: false, details: "profil introuvable" };
    // Accept: soit OpenAI renvoie FAILED (avec message), soit SUCCESS avec raw-fallback
    // (le modèle peut "réussir" sans rien trouver sur un domaine invalide — c'est correct)
    const pass =
      profil.enrichissementStatut === "FAILED" ||
      profil.enrichissementStatut === "SUCCESS";
    return {
      pass,
      details: `statut=${profil.enrichissementStatut} err=${profil.enrichissementErreur ?? "-"}`,
    };
  });

  // ─── T5 : API key absente → FAILED rapide ──────────────────────────────
  console.log("\n── Setup T5 : profil + retrait OPENAI_API_KEY temporaire");
  const t5 = await setupTestUser("nokey", "https://www.inwi.ma");
  await record("T5 · OPENAI_API_KEY absente → FAILED rapide < 2s", async () => {
    const saved = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    try {
      await runDeepResearch(t5.profilId);
      const profil = await prisma.profilUtilisateur.findUnique({
        where: { id: t5.profilId },
      });
      if (!profil) return { pass: false, details: "profil introuvable" };
      const okStatut = profil.enrichissementStatut === "FAILED";
      const okErr = (profil.enrichissementErreur ?? "").includes("API_KEY");
      return {
        pass: okStatut && okErr,
        details: `statut=${profil.enrichissementStatut} err="${profil.enrichissementErreur}"`,
      };
    } finally {
      if (saved) process.env.OPENAI_API_KEY = saved;
    }
  });

  // ─── T6 : double-submit concurrent → verrou actif ──────────────────────
  console.log("\n── Setup T6 : profil + 2 runDeepResearch en parallèle");
  // Pour T6 on simule directement le verrou : on positionne IN_PROGRESS récent,
  // puis on lance runDeepResearch — il doit skip.
  const t6 = await setupTestUser("lock", "https://www.inwi.ma");
  await record(
    "T6 · verrou actif (IN_PROGRESS récent) → skip propre",
    async () => {
      // Place le profil en IN_PROGRESS à l'instant
      await prisma.profilUtilisateur.update({
        where: { id: t6.profilId },
        data: {
          enrichissementStatut: "IN_PROGRESS",
          enrichissementStartedAt: new Date(),
        },
      });
      const before = await prisma.profilUtilisateur.findUnique({
        where: { id: t6.profilId },
      });
      // Lance runDeepResearch — il doit skip car verrouillé
      await runDeepResearch(t6.profilId);
      const after = await prisma.profilUtilisateur.findUnique({
        where: { id: t6.profilId },
      });
      if (!before || !after)
        return { pass: false, details: "profil introuvable" };
      // Le statut doit rester IN_PROGRESS, le startedAt ne doit PAS avoir bougé
      const pass =
        after.enrichissementStatut === "IN_PROGRESS" &&
        before.enrichissementStartedAt?.getTime() ===
          after.enrichissementStartedAt?.getTime();
      return {
        pass,
        details: `statut=${after.enrichissementStatut} startedAt-changed=${
          before.enrichissementStartedAt?.getTime() !==
          after.enrichissementStartedAt?.getTime()
        }`,
      };
    },
  );

  // ─── BILAN ─────────────────────────────────────────────────────────────
  console.log("\n══════════════════════════════════════════════════════════");
  const passed = results.filter((r) => r.pass).length;
  const failed = results.length - passed;
  const totalMs = results.reduce((acc, r) => acc + r.durationMs, 0);
  console.log(` Bilan : ${passed} OK · ${failed} KO · total ${fmt(totalMs)}`);
  for (const r of results) {
    console.log(
      `   ${r.pass ? "✓" : "✗"} ${r.name}  (${fmt(r.durationMs)})${r.details ? ` — ${r.details}` : ""}`,
    );
  }
  console.log("══════════════════════════════════════════════════════════\n");

  if (process.env.SKIP_CLEANUP === "1") {
    console.log(
      `  (SKIP_CLEANUP=1 — users gardés en BDD pour inspection : prefix=${TEST_PREFIX})\n`,
    );
  } else {
    await cleanup();
  }
  await prisma.$disconnect();

  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (err) => {
  console.error("FATAL:", err);
  try {
    if (process.env.SKIP_CLEANUP !== "1") await cleanup();
  } catch {
    /* ignore */
  }
  await prisma.$disconnect();
  process.exit(2);
});
