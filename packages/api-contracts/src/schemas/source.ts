import { z } from 'zod';

export const SourceSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  titre: z.string().min(1),
  domaine: z.string(),
  publieLe: z.string().datetime().nullable(),
  collecteLe: z.string().datetime(),
  resume: z.string().nullable(),
  langue: z.string().length(2),
});
export type Source = z.infer<typeof SourceSchema>;

export const ScoreCRAAPSchema = z.object({
  currency: z.number().min(0).max(10),
  relevance: z.number().min(0).max(10),
  authority: z.number().min(0).max(10),
  accuracy: z.number().min(0).max(10),
  purpose: z.number().min(0).max(10),
  global: z.number().min(0).max(10),
  justification: z.string(),
});
export type ScoreCRAAP = z.infer<typeof ScoreCRAAPSchema>;

export const SourceEvalueeSchema = SourceSchema.extend({
  craap: ScoreCRAAPSchema,
  rejetee: z.boolean(),
});
export type SourceEvaluee = z.infer<typeof SourceEvalueeSchema>;
