import { z } from "zod";

// POST /api/internal/profil
// Émis par l'agent deep-research à la fin de l'onboarding (1 fois par utilisateur).

export const ProfilEventSchema = z.object({
  type: z.literal("profil").optional(),
  userId: z.string().uuid(),
  nomEntreprise: z.string().min(1).max(200),
  // Relâché en string : l'agent envoie parfois un domaine nu.
  siteWeb: z.string().max(2000).nullish(),
  secteur: z.string().max(200).nullish(),
  description: z.string().max(5000).nullish(),
  produits: z
    .array(z.string().max(200))
    .max(50)
    .nullish()
    .transform((v) => v ?? []),
  marches: z
    .array(z.string().max(200))
    .max(50)
    .nullish()
    .transform((v) => v ?? []),
  positionnement: z.string().max(2000).nullish(),
});

export type ProfilEvent = z.infer<typeof ProfilEventSchema>;
