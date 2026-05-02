import { NextResponse } from 'next/server';
import { WebhookPayloadSchema } from '@radar/api-contracts';
import { prisma } from '@radar/database';
import { createLogger } from '@radar/shared';

const log = createLogger('api:webhooks');

export async function POST(req: Request) {
  const secret = req.headers.get('x-radar-secret');
  if (!secret || secret !== process.env['AGENT_WEBHOOK_SECRET']) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = WebhookPayloadSchema.safeParse(body);
  if (!parsed.success) {
    log.warn('Payload webhook invalide', { issues: parsed.error.issues });
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const evt = parsed.data;
  log.info('Webhook reçu', { type: evt.type, rapportId: evt.rapportId });

  await prisma.evenementRapport.create({
    data: {
      rapportId: evt.rapportId,
      type: evt.type,
      payload: evt as object,
    },
  });

  if (evt.type === 'rapport.progresse') {
    await prisma.rapport.update({
      where: { id: evt.rapportId },
      data: { statut: evt.statut, progressionPct: evt.progressionPct, etape: evt.etape },
    });
  } else if (evt.type === 'rapport.termine') {
    await prisma.rapport.update({
      where: { id: evt.rapportId },
      data: { statut: 'pret', progressionPct: 100, termineLe: new Date() },
    });
  } else if (evt.type === 'rapport.echec') {
    await prisma.rapport.update({
      where: { id: evt.rapportId },
      data: { statut: 'echec', erreur: evt.erreur },
    });
  }

  return NextResponse.json({ ok: true });
}
