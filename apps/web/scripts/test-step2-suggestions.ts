/**
 * Test d'intégration léger : crée un user, lui injecte un enrichment fake
 * (sans appel OpenAI), GET /onboarding/step-2 avec cookie session, et vérifie
 * que la page contient bien la section "Suggestions Deep Research" + les
 * noms des concurrents suggérés.
 *
 * Lancement (apps/web/) :
 *   pnpm exec tsx --env-file=.env.local scripts/test-step2-suggestions.ts
 */
import { PrismaClient } from "@radar/database";

const prisma = new PrismaClient();
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const TEST_EMAIL = `step2-suggestions-${Date.now()}@radar.test`;

const FAKE_ENRICHMENT = {
  status: "structured",
  schemaVersion: "1.0",
  skillVersion: "1.0",
  version: "1.0",
  secteur: "Télécommunications",
  description: "Opérateur télécom marocain",
  positionnement: null,
  icp: null,
  taille: "500+",
  produits: ["Mobile", "Fibre"],
  marches: ["Maroc"],
  motsClesMetier: ["télécoms"],
  presenceDigitale: {
    linkedinActif: true,
    blogActif: null,
    noteVisibilite: "fort",
  },
  concurrentsSuggeres: [
    {
      nom: "Maroc Telecom",
      siteWeb: "https://www.iam.ma",
      raison: "Concurrence directe sur mobile et fixe",
    },
    {
      nom: "Orange Maroc",
      siteWeb: "https://www.orange.ma",
      raison: "Concurrence directe sur fibre et entreprises",
    },
    {
      nom: "N+ONE",
      siteWeb: "https://www.nplusone.ma",
      raison: "Concurrent B2B cloud et cybersécurité",
    },
  ],
  sourcesUtilisees: [{ url: "https://medias24.com", titre: "Test source" }],
};

async function main(): Promise<void> {
  console.log("── Sign-up via Better Auth");
  const signUp = await fetch(`${BASE}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE },
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: "TestPass1234",
      name: "Test Step2",
    }),
  });
  if (!signUp.ok) {
    console.error(`✗ Sign-up HTTP ${signUp.status}`);
    process.exit(1);
  }

  const setCookie = signUp.headers.get("set-cookie") ?? "";
  const cookie =
    setCookie.split(",").find((c) => c.includes("better-auth.session_token")) ??
    "";
  if (!cookie) {
    console.error("✗ Pas de cookie session");
    process.exit(1);
  }
  console.log("  ✓ User créé + cookie OK");

  const user = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
  if (!user) {
    console.error("✗ User introuvable après sign-up");
    process.exit(1);
  }

  console.log("── Injection profil + enrichment fake");
  await prisma.profilUtilisateur.create({
    data: {
      userId: user.id,
      nomEntreprise: "Inwi (test)",
      siteWeb: "https://www.inwi.ma",
      enrichissement: FAKE_ENRICHMENT,
      enrichissementLe: new Date(),
      enrichissementVer: "1.0",
      enrichissementStatut: "SUCCESS",
    },
  });
  console.log("  ✓ Profil + enrichment injectés");

  console.log("── GET /onboarding/step-2");
  const res = await fetch(`${BASE}/onboarding/step-2`, {
    headers: { Cookie: cookie.split(";")[0] ?? "" },
    redirect: "follow",
  });
  if (!res.ok) {
    console.error(`✗ step-2 HTTP ${res.status}`);
    process.exit(1);
  }
  const html = await res.text();

  console.log("── Assertions sur le HTML rendu");
  const checks = [
    ["Section title", html.includes("Suggestions Deep Research")],
    ["Maroc Telecom listé", html.includes("Maroc Telecom")],
    ["Orange Maroc listé", html.includes("Orange Maroc")],
    ["N+ONE listé", html.includes("N+ONE")],
    [
      "Raison Maroc Telecom",
      html.includes("Concurrence directe sur mobile et fixe"),
    ],
    ["Bouton Ajouter présent", html.toLowerCase().includes("ajouter")],
    [
      "Domaine extrait (iam.ma rendu)",
      // Le texte visible dans le DOM est `iam.ma` (extractDomain retire le
      // protocole + www). La full URL peut apparaître dans les props React
      // sérialisées pour hydration, on ne teste donc que la présence du
      // domaine court.
      html.includes(">iam.ma<"),
    ],
  ] as const;

  let failed = 0;
  for (const [label, ok] of checks) {
    console.log(`  ${ok ? "✓" : "✗"} ${label}`);
    if (!ok) failed++;
  }

  console.log("── Cleanup");
  await prisma.user.delete({ where: { id: user.id } });
  await prisma.$disconnect();

  if (failed > 0) {
    console.error(`\n${failed} assertion(s) en échec`);
    process.exit(1);
  }
  console.log("\nAll OK");
}

main().catch(async (err) => {
  console.error("FATAL:", err);
  await prisma.user
    .deleteMany({ where: { email: TEST_EMAIL } })
    .catch(() => {});
  await prisma.$disconnect();
  process.exit(2);
});
