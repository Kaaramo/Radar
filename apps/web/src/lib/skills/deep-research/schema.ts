import { z } from "zod";

/**
 * Schéma Zod miroir du JSON Schema (`references/output-schema.json`).
 *
 * Utilisé pour valider la sortie du modèle OpenAI Deep Research côté serveur
 * (cf. `lib/agents/deep-research.ts` → `extractJsonBlock` + safeParse). Le
 * modèle reçoit le JSON Schema dans le developer prompt (SKILL.md) et doit
 * produire un bloc ```json``` conforme à la fin de son rapport final.
 */
export const taillesEnum = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "500+",
] as const;
export type Taille = (typeof taillesEnum)[number];

export const visibiliteEnum = ["fort", "moyen", "faible"] as const;
export type NoteVisibilite = (typeof visibiliteEnum)[number];

const concurrentSuggereSchema = z.object({
  nom: z.string().min(1).max(120),
  siteWeb: z.string().url().nullable(),
  raison: z.string().min(1).max(100),
});

const sourceUtiliseeSchema = z.object({
  url: z.string().url().nullable(),
  titre: z.string().min(1).max(200),
});

const presenceDigitaleSchema = z.object({
  linkedinActif: z.boolean().nullable(),
  blogActif: z.boolean().nullable(),
  noteVisibilite: z.enum(visibiliteEnum).nullable(),
});

/** Schéma unique : injecté en prompt OpenAI ET persisté tel quel après extraction. */
export const deepResearchOutputSchema = z.object({
  version: z.literal("1.0"),
  secteur: z.string().max(280).nullable(),
  description: z.string().max(280).nullable(),
  produits: z.array(z.string().max(100)).max(6),
  marches: z.array(z.string().max(100)).max(6),
  positionnement: z.string().max(280).nullable(),
  icp: z.string().max(280).nullable(),
  motsClesMetier: z.array(z.string().max(60)).max(8),
  taille: z.enum(taillesEnum).nullable(),
  concurrentsSuggeres: z.array(concurrentSuggereSchema).max(5),
  presenceDigitale: presenceDigitaleSchema,
  sourcesUtilisees: z.array(sourceUtiliseeSchema).min(1).max(12),
});

export type DeepResearchOutput = z.infer<typeof deepResearchOutputSchema>;
