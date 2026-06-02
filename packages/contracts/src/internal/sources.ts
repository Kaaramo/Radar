import { z } from "zod";

// POST /api/internal/sources
// Émis par l'agent collecteur (sources brutes) puis enrichi par l'évaluateur (CRAAP).

export const SourceSchema = z.object({
  // Relâché en string : un agent renvoie parfois un domaine nu sans https://.
  url: z.string().min(1).max(2000),
  titre: z.string().max(500).nullish(),
  extrait: z.string().max(5000).nullish(),
  // L'agent envoie souvent une date non ISO ; on tolère toute string ou null.
  publieeLe: z.string().max(100).nullish(),
  // Score CRAAP — chaque dimension 0..10, total 0..50
  craapCurrency: z.number().int().min(0).max(10).nullable(),
  craapRelevance: z.number().int().min(0).max(10).nullable(),
  craapAuthority: z.number().int().min(0).max(10).nullable(),
  craapAccuracy: z.number().int().min(0).max(10).nullable(),
  craapPurpose: z.number().int().min(0).max(10).nullable(),
  craapTotal: z.number().int().min(0).max(50).nullable(),
});

export type SourcePayload = z.infer<typeof SourceSchema>;

export const SourcesEventSchema = z.object({
  type: z.literal("sources").optional(),
  rapportId: z.string().uuid(),
  sources: z
    .array(SourceSchema)
    .max(200)
    .nullish()
    .transform((v) => v ?? []),
});

export type SourcesEvent = z.infer<typeof SourcesEventSchema>;
