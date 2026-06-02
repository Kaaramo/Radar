import { z } from "zod";

// POST /api/internal/pestel
// Émis par l'agent analyste-pestel (hebdomadaire à l'échelle sectorielle en V2).

export const PestelEventSchema = z.object({
  type: z.literal("pestel"),
  rapportId: z.string().uuid(),
  political: z.array(z.string().max(1000)).max(20),
  economic: z.array(z.string().max(1000)).max(20),
  social: z.array(z.string().max(1000)).max(20),
  technological: z.array(z.string().max(1000)).max(20),
  environmental: z.array(z.string().max(1000)).max(20),
  legal: z.array(z.string().max(1000)).max(20),
});

export type PestelEvent = z.infer<typeof PestelEventSchema>;
