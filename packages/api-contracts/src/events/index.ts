import { z } from 'zod';
import { StatutRapport } from '../schemas/rapport.js';

export const WebhookEventType = z.enum([
  'rapport.cree',
  'rapport.progresse',
  'rapport.termine',
  'rapport.echec',
]);
export type WebhookEventType = z.infer<typeof WebhookEventType>;

export const WebhookProgressionSchema = z.object({
  type: z.literal('rapport.progresse'),
  rapportId: z.string().uuid(),
  statut: StatutRapport,
  etape: z.string(),
  progressionPct: z.number().min(0).max(100),
  emisLe: z.string().datetime(),
});
export type WebhookProgression = z.infer<typeof WebhookProgressionSchema>;

export const WebhookTermineSchema = z.object({
  type: z.literal('rapport.termine'),
  rapportId: z.string().uuid(),
  emisLe: z.string().datetime(),
});
export type WebhookTermine = z.infer<typeof WebhookTermineSchema>;

export const WebhookEchecSchema = z.object({
  type: z.literal('rapport.echec'),
  rapportId: z.string().uuid(),
  erreur: z.string(),
  emisLe: z.string().datetime(),
});
export type WebhookEchec = z.infer<typeof WebhookEchecSchema>;

export const WebhookPayloadSchema = z.discriminatedUnion('type', [
  WebhookProgressionSchema,
  WebhookTermineSchema,
  WebhookEchecSchema,
]);
export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;
