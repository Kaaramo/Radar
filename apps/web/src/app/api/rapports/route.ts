import { NextResponse } from 'next/server';
import { DemandeRapportSchema } from '@radar/api-contracts';
import { prisma } from '@radar/database';
import { createLogger } from '@radar/shared';

const log = createLogger('api:rapports');

export async function GET() {
  const rapports = await prisma.rapport.findMany({
    orderBy: { creeLe: 'desc' },
    take: 50,
  });
  return NextResponse.json({ rapports });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = DemandeRapportSchema.safeParse(body);
  if (!parsed.success) {
    log.warn('Demande invalide', { issues: parsed.error.issues });
    return NextResponse.json({ error: 'invalid_payload', issues: parsed.error.issues }, { status: 400 });
  }

  const rapport = await prisma.rapport.create({
    data: {
      sujet: parsed.data.sujet,
      contexte: parsed.data.contexte,
      profondeur: parsed.data.profondeur,
      langue: parsed.data.langue,
      statut: 'demande',
    },
  });

  log.info('Rapport créé', { id: rapport.id, sujet: rapport.sujet });

  // TODO : déclencher l'agent (POST AGENT_API_URL/run avec rapport.id + secret)

  return NextResponse.json({ rapport }, { status: 201 });
}
