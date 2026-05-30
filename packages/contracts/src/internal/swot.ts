import { z } from "zod";

// POST /api/internal/swot
// Émis par l'agent analyste-swot après analyse contextualisée par le profil utilisateur.

const swotAxis = z
  .array(z.string().max(1000))
  .max(20)
  .nullish()
  .transform((v) => v ?? []);

export const SwotEventSchema = z.object({
  type: z.literal("swot").optional(),
  rapportId: z.string().uuid(),
  strengths: swotAxis,
  weaknesses: swotAxis,
  opportunities: swotAxis,
  threats: swotAxis,
});

export type SwotEvent = z.infer<typeof SwotEventSchema>;
