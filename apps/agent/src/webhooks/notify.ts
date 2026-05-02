import type { WebhookPayload } from '@radar/api-contracts';
import { createLogger } from '@radar/shared';

const log = createLogger('webhooks:notify');

export const notifyWeb = async (payload: WebhookPayload): Promise<void> => {
  const url = process.env['WEB_API_URL'];
  const secret = process.env['AGENT_WEBHOOK_SECRET'];
  if (!url || !secret) {
    log.warn('WEB_API_URL ou AGENT_WEBHOOK_SECRET manquant, webhook ignoré');
    return;
  }
  try {
    const res = await fetch(`${url}/api/webhooks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-radar-secret': secret },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      log.error('Webhook rejeté', { status: res.status, type: payload.type });
    }
  } catch (e) {
    log.error('Webhook envoi échoué', { error: String(e) });
  }
};
