/**
 * Lit et affiche le dernier `ProfilUtilisateur.enrichissement` de la BDD.
 * Utilisé pour valider à l'œil le payload OpenAI Deep Research post-T1.
 *
 * Lancement :
 *   cd apps/web
 *   pnpm exec tsx --env-file=.env.local scripts/inspect-enrichissement.ts
 */

import { PrismaClient } from "@radar/database";

const prisma = new PrismaClient();

function trunc(s: string | null | undefined, n: number): string {
  if (!s) return "(null)";
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

async function main(): Promise<void> {
  const profils = await prisma.profilUtilisateur.findMany({
    orderBy: { enrichissementLe: "desc" },
    include: { user: { select: { email: true, name: true } } },
    take: 5,
  });

  console.log("══════════════════════════════════════════════════════════");
  console.log(` ${profils.length} profil(s) avec enrichissement trouvé(s)`);
  console.log("══════════════════════════════════════════════════════════");

  for (const p of profils) {
    console.log(`\n┌─ Profil ${p.id}`);
    console.log(`│ User       : ${p.user.email} (${p.user.name})`);
    console.log(
      `│ Entreprise : ${p.nomEntreprise} — ${p.siteWeb ?? "(sans site)"}`,
    );
    console.log(`│ Statut     : ${p.enrichissementStatut}`);
    console.log(
      `│ Started    : ${p.enrichissementStartedAt?.toISOString() ?? "-"}`,
    );
    console.log(`│ Done       : ${p.enrichissementLe?.toISOString() ?? "-"}`);
    console.log(`│ Schema ver : ${p.enrichissementVer ?? "-"}`);
    console.log(`│ Erreur     : ${trunc(p.enrichissementErreur, 200)}`);

    const e = p.enrichissement as Record<string, unknown> | null;
    if (!e) {
      console.log("│ Payload    : (null)");
      continue;
    }

    console.log(`│ Status     : ${String(e.status)}`);
    console.log(`│ schemaVer  : ${String(e.schemaVersion)}`);

    if (e.status === "structured") {
      console.log(`│ Secteur    : ${trunc(e.secteur as string | null, 120)}`);
      console.log(
        `│ Descr.     : ${trunc(e.description as string | null, 160)}`,
      );
      console.log(
        `│ Position.  : ${trunc(e.positionnement as string | null, 160)}`,
      );
      console.log(`│ ICP        : ${trunc(e.icp as string | null, 160)}`);
      console.log(`│ Taille     : ${String(e.taille)}`);

      const produits = (e.produits as string[]) ?? [];
      console.log(
        `│ Produits   : ${produits.length} → ${produits.slice(0, 5).join(", ")}`,
      );
      const marches = (e.marches as string[]) ?? [];
      console.log(
        `│ Marchés    : ${marches.length} → ${marches.slice(0, 5).join(", ")}`,
      );
      const motsCles = (e.motsClesMetier as string[]) ?? [];
      console.log(
        `│ Mots-clés  : ${motsCles.length} → ${motsCles.slice(0, 6).join(", ")}`,
      );

      const concurrents =
        (e.concurrentsSuggeres as Array<{
          nom: string;
          siteWeb: string | null;
          raison: string;
        }>) ?? [];
      console.log(`│ Concurrents: ${concurrents.length}`);
      for (const c of concurrents.slice(0, 5)) {
        console.log(`│   ↳ ${c.nom} — ${c.siteWeb ?? "(no site)"}`);
        console.log(`│      "${trunc(c.raison, 90)}"`);
      }

      const pd = e.presenceDigitale as Record<string, unknown> | undefined;
      if (pd) {
        console.log(
          `│ Présence   : linkedin=${String(pd.linkedinActif)} blog=${String(pd.blogActif)} visi=${String(pd.noteVisibilite)}`,
        );
      }

      const sources =
        (e.sourcesUtilisees as Array<{
          url: string | null;
          titre: string;
        }>) ?? [];
      console.log(`│ Sources    : ${sources.length}`);
      for (const s of sources.slice(0, 10)) {
        console.log(`│   • ${trunc(s.titre, 80)}`);
        console.log(`│     ${s.url ?? "(no url)"}`);
      }
    } else if (e.status === "raw-fallback") {
      const sources =
        (e.sources as Array<{ url: string | null; titre: string | null }>) ??
        [];
      console.log(`│ Sources    : ${sources.length}`);
      const fa = e.finalAnalysis as string | null;
      console.log(`│ Final analysis (${fa?.length ?? 0} chars) :`);
      console.log(`│ ${trunc(fa, 600)}`);
    } else {
      console.log(`│ (status inconnu : ${String(e.status)})`);
    }

    console.log("└──");
  }

  console.log("\n══════════════════════════════════════════════════════════\n");

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("FATAL:", err);
  await prisma.$disconnect();
  process.exit(1);
});
