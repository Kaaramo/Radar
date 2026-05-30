import { z } from "zod";

// POST /api/internal/signaux
// Émis par l'agent détecteur-signaux-faibles après croisement multi-sources sur 30 jours.

export const SignalFaibleSchema = z.object({
  intitule: z.string().min(1).max(300),
  description: z.string().max(2000).nullable(),
  scorePertinence: z.number().int().min(0).max(100).nullable(),
});

export type SignalFaiblePayload = z.infer<typeof SignalFaibleSchema>;

export const SignauxEventSchema = z.object({
  type: z.literal("signaux").optional(),
  rapportId: z.string().uuid(),
  signaux: z
    .array(SignalFaibleSchema)
    .max(50)
    .nullish()
    .transform((v) => v ?? []),
});

export type SignauxEvent = z.infer<typeof SignauxEventSchema>;
