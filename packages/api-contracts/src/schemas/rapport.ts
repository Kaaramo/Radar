import { z } from 'zod';
import { SWOTSchema, PESTELSchema, SignalFaibleSchema } from './analyse.js';
import { SourceEvalueeSchema } from './source.js';

export const StatutRapport = z.enum([
  'demande',
  'collecte',
  'evaluation',
  'analyse',
  'redaction',
  'pret',
  'echec',
]);
export type StatutRapport = z.infer<typeof StatutRapport>;

export const DemandeRapportSchema = z.object({
  sujet: z.string().min(3).max(280),
  contexte: z.string().max(2000).optional(),
  profondeur: z.enum(['rapide', 'standard', 'approfondi']).default('standard'),
  langue: z.enum(['fr', 'en']).default('fr'),
});
export type DemandeRapport = z.infer<typeof DemandeRapportSchema>;

export const RapportSchema = z.object({
  id: z.string().uuid(),
  sujet: z.string(),
  statut: StatutRapport,
  creeLe: z.string().datetime(),
  termineLe: z.string().datetime().nullable(),
  sources: z.array(SourceEvalueeSchema),
  swot: SWOTSchema.nullable(),
  pestel: PESTELSchema.nullable(),
  signauxFaibles: z.array(SignalFaibleSchema),
  synthese: z.string().nullable(),
  erreur: z.string().nullable(),
});
export type Rapport = z.infer<typeof RapportSchema>;
