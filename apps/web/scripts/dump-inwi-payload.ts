/**
 * Dump du payload Deep Research pour le user inwi e2e — script de lecture humaine.
 */
import { PrismaClient } from "@radar/database";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const p = await prisma.profilUtilisateur.findFirst({
    where: {
      user: { email: { startsWith: "dr-e2e-1779979664045-inwi" } },
    },
    include: { user: true },
  });

  if (!p) {
    console.log("Profil inwi e2e introuvable");
    return;
  }

  console.log("═══════════════════════════════════════════════════════");
  console.log(" PROFIL DEEP RESEARCH — inwi.ma");
  console.log("═══════════════════════════════════════════════════════");
  console.log(` Entreprise   : ${p.nomEntreprise}`);
  console.log(` Site         : ${p.siteWeb}`);
  console.log(` Statut       : ${p.enrichissementStatut}`);
  console.log(` Terminé le   : ${p.enrichissementLe?.toISOString()}`);
  console.log(` Schema ver   : ${p.enrichissementVer}`);
  console.log();
  console.log("═══════════════════════════════════════════════════════");
  console.log(" PAYLOAD COMPLET (JSON)");
  console.log("═══════════════════════════════════════════════════════");
  console.log(JSON.stringify(p.enrichissement, null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
