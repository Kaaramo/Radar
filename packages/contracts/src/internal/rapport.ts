import { z } from "zod";

// POST /api/internal/rapport/progresse
// Émis par chaque sous-agent OpenClaw à chaque étape du cycle.

// Tolérant à la casse / aux variantes produites par un LLM ("en_cours",
// "en cours", "En_Cours" → "EN_COURS"). Les callbacks viennent d'un agent,
// pas d'un client typé : on normalise plutôt que de rejeter (400).
export const StatutRapportSchema = z.preprocess(
  (v) =>
    typeof v === "string"
      ? v
          .trim()
          .toUpperCase()
          .replace(/[\s-]+/g, "_")
      : v,
  z.enum(["EN_ATTENTE", "EN_COURS", "TERMINE", "ECHEC"]),
);

export type StatutRapport = z.infer<typeof StatutRapportSchema>;

export const RapportProgresseEventSchema = z
  .object({
    // `type` toléré absent : l'orchestrateur ne l'envoie pas toujours.
    type: z.literal("rapport.progresse").optional(),
    rapportId: z.string().uuid(),
    statut: StatutRapportSchema,
    // L'agent omet parfois la progression → défaut 0.
    progressionPct: z.coerce
      .number()
      .int()
      .min(0)
      .max(100)
      .optional()
      .default(0),
    etape: z.string().max(200).optional().default(""),
    // Champ libre envoyé par le SKILL, ignoré côté persistance.
    message: z.string().max(2000).optional(),
  })
  .passthrough();

export type RapportProgresseEvent = z.infer<typeof RapportProgresseEventSchema>;

// POST /api/internal/rapport/termine
// Émis par l'agent rédacteur (via run-cycle.mjs) à la fin du cycle.

// `type` toléré absent : run-cycle.mjs poste { rapportId, synthese } sans
// `type`. Sans `.optional()`, chaque POST de fin échouait en 400 et le rapport
// restait figé à EN_COURS 90% (synthèse jamais persistée). Cohérent avec les
// autres schémas (progresse/swot/signaux).
export const RapportTermineEventSchema = z.object({
  type: z.literal("rapport.termine").optional(),
  rapportId: z.string().uuid(),
  synthese: z.string().min(1).max(50000),
});

export type RapportTermineEvent = z.infer<typeof RapportTermineEventSchema>;

// POST /api/internal/rapport/echec
// Émis par l'orchestrateur en cas d'échec irrécupérable.

export const RapportEchecEventSchema = z.object({
  type: z.literal("rapport.echec").optional(),
  rapportId: z.string().uuid(),
  erreur: z.string().min(1).max(5000),
});

export type RapportEchecEvent = z.infer<typeof RapportEchecEventSchema>;
