/**
 * Vide la BDD de toute donnée utilisateur (incluant Better Auth).
 *
 * Cible : ProfilUtilisateur, Concurrent, VeilleCycle (+ Mouvement, SwotSnapshot,
 * MouvementSource), WeakSignal, NotificationPreference, Rapport (+ Source, Swot,
 * Pestel, SignalFaible), Session, Account, Verification, User.
 *
 * Le schéma reste intact — uniquement les lignes sont supprimées.
 *
 * Lancement (depuis racine du repo) :
 *   pnpm --filter @radar/web exec tsx --env-file=apps/web/.env.local apps/web/scripts/wipe-db.ts
 */

import { PrismaClient } from "@radar/database";

const prisma = new PrismaClient();

async function count(
  label: string,
  fn: () => Promise<number>,
): Promise<number> {
  const n = await fn();
  console.log(`  ${label.padEnd(28)} : ${n}`);
  return n;
}

async function snapshot(prefix: string): Promise<void> {
  console.log(`\n── ${prefix} ─────────────────────────────────────────`);
  await count("User", () => prisma.user.count());
  await count("Session", () => prisma.session.count());
  await count("Account", () => prisma.account.count());
  await count("Verification", () => prisma.verification.count());
  await count("ProfilUtilisateur", () => prisma.profilUtilisateur.count());
  await count("Concurrent", () => prisma.concurrent.count());
  await count("VeilleCycle", () => prisma.veilleCycle.count());
  await count("Mouvement", () => prisma.mouvement.count());
  await count("MouvementSource", () => prisma.mouvementSource.count());
  await count("SwotSnapshot", () => prisma.swotSnapshot.count());
  await count("WeakSignal", () => prisma.weakSignal.count());
  await count("NotificationPreference", () =>
    prisma.notificationPreference.count(),
  );
  await count("Rapport", () => prisma.rapport.count());
  await count("Source", () => prisma.source.count());
  await count("Swot", () => prisma.swot.count());
  await count("Pestel", () => prisma.pestel.count());
  await count("SignalFaible", () => prisma.signalFaible.count());
}

async function wipe(): Promise<void> {
  // Ordre : les enfants n'ont pas besoin d'être supprimés explicitement
  // grâce à onDelete: Cascade. Mais on est belt-and-suspenders et on les
  // efface tout de même pour être sûr (au cas où le schéma local diffère
  // de la prod). L'ordre respecte les FKs.

  await prisma.signalFaible.deleteMany();
  await prisma.pestel.deleteMany();
  await prisma.swot.deleteMany();
  await prisma.source.deleteMany();
  await prisma.rapport.deleteMany();

  await prisma.weakSignal.deleteMany();

  await prisma.mouvementSource.deleteMany();
  await prisma.swotSnapshot.deleteMany();
  await prisma.mouvement.deleteMany();
  await prisma.veilleCycle.deleteMany();

  await prisma.concurrent.deleteMany();
  await prisma.profilUtilisateur.deleteMany();
  await prisma.notificationPreference.deleteMany();

  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
}

async function main(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL ?? "";
  const masked = dbUrl.replace(/:\/\/[^@]*@/, "://****:****@");
  console.log("══════════════════════════════════════════════════════════");
  console.log(" RADAR — Wipe BDD (toutes données utilisateur)");
  console.log("══════════════════════════════════════════════════════════");
  console.log(` DB    = ${masked.slice(0, 80)}…`);
  console.log(` Date  = ${new Date().toISOString()}`);

  await snapshot("AVANT");

  console.log("\n── Suppression en cours…");
  const startedAt = Date.now();
  await wipe();
  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);

  await snapshot("APRÈS");

  console.log(`\n  ✓ Wipe terminé en ${elapsed}s`);
  console.log("══════════════════════════════════════════════════════════\n");

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("FATAL:", err);
  await prisma.$disconnect();
  process.exit(1);
});
