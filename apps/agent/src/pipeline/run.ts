import { prisma } from '@radar/database';
import { createLogger } from '@radar/shared';
import { notifyWeb } from '../webhooks/notify.js';
import { runCollecteur } from '../agents/collecteur/index.js';
import { runEvaluateur } from '../agents/evaluateur/index.js';
import { runAnalysteSwot } from '../agents/analyste-swot/index.js';
import { runAnalystePestel } from '../agents/analyste-pestel/index.js';
import { runRedacteur } from '../agents/redacteur/index.js';

const log = createLogger('pipeline');

export const runPipeline = async (rapportId: string): Promise<void> => {
  log.info('Pipeline démarré', { rapportId });

  const rapport = await prisma.rapport.findUnique({ where: { id: rapportId } });
  if (!rapport) {
    log.error('Rapport introuvable', { rapportId });
    return;
  }

  try {
    // Étape 1 : collecte
    await notifyWeb({
      type: 'rapport.progresse',
      rapportId,
      statut: 'collecte',
      etape: 'Génération des requêtes',
      progressionPct: 10,
      emisLe: new Date().toISOString(),
    });
    const { requetes } = await runCollecteur({
      sujet: rapport.sujet,
      contexte: rapport.contexte ?? undefined,
      profondeur: rapport.profondeur,
      langue: rapport.langue as 'fr' | 'en',
    });
    log.info('Requêtes générées', { rapportId, count: requetes.length });

    // TODO : exécuter les requêtes via Serper/Tavily, peupler Source[], puis évaluer.
    // Pour l'instant on saute directement à l'analyse sur un corpus stub.

    // Étape 2 : évaluation CRAAP (stub - à brancher quand collecte web faite)
    await notifyWeb({
      type: 'rapport.progresse',
      rapportId,
      statut: 'evaluation',
      etape: 'Évaluation CRAAP',
      progressionPct: 30,
      emisLe: new Date().toISOString(),
    });

    const sourcesContexte = requetes.map((r, i) => `[${i + 1}] requête: ${r}`).join('\n');

    // Étape 3 : analyses parallèles
    await notifyWeb({
      type: 'rapport.progresse',
      rapportId,
      statut: 'analyse',
      etape: 'Analyses SWOT, PESTEL et signaux faibles',
      progressionPct: 60,
      emisLe: new Date().toISOString(),
    });

    const [swot, pestel] = await Promise.all([
      runAnalysteSwot({ sujet: rapport.sujet, sourcesContexte }),
      runAnalystePestel({ sujet: rapport.sujet, sourcesContexte }),
    ]);

    await prisma.sWOT.create({ data: { rapportId, ...swot } });
    await prisma.pESTEL.create({ data: { rapportId, ...pestel } });

    // Étape 4 : rédaction
    await notifyWeb({
      type: 'rapport.progresse',
      rapportId,
      statut: 'redaction',
      etape: 'Rédaction de la synthèse',
      progressionPct: 85,
      emisLe: new Date().toISOString(),
    });

    const synthese = await runRedacteur({
      sujet: rapport.sujet,
      swot: JSON.stringify(swot, null, 2),
      pestel: JSON.stringify(pestel, null, 2),
      signauxFaibles: '[]',
      sourcesContexte,
      langue: rapport.langue as 'fr' | 'en',
    });

    await prisma.rapport.update({
      where: { id: rapportId },
      data: { synthese, statut: 'pret', progressionPct: 100, termineLe: new Date() },
    });

    await notifyWeb({
      type: 'rapport.termine',
      rapportId,
      emisLe: new Date().toISOString(),
    });

    log.info('Pipeline terminé', { rapportId });
  } catch (e) {
    const erreur = e instanceof Error ? e.message : String(e);
    log.error('Pipeline en échec', { rapportId, erreur });
    await prisma.rapport.update({
      where: { id: rapportId },
      data: { statut: 'echec', erreur },
    });
    await notifyWeb({
      type: 'rapport.echec',
      rapportId,
      erreur,
      emisLe: new Date().toISOString(),
    });
  }
};

// Référence muette à l'évaluateur pour éviter l'erreur "unused" tant qu'il n'est pas branché
export const _evaluateurRef = runEvaluateur;
