import { prisma } from '../src/index.js';

async function main(): Promise<void> {
  console.log('[seed] Insertion des données de démo...');

  await prisma.rapport.create({
    data: {
      sujet: 'Marché de la veille stratégique IA en France 2026',
      contexte: 'Démo de seed pour valider le schéma RADAR.',
      profondeur: 'standard',
      statut: 'demande',
    },
  });

  console.log('[seed] OK');
}

main()
  .catch((e: unknown) => {
    console.error('[seed] erreur', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
