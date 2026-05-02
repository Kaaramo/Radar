export interface AnalysteSwotInput {
  sujet: string;
  sourcesContexte: string;
}

export const analysteSwotPrompt = (input: AnalysteSwotInput) => ({
  system: `Tu es un agent ANALYSTE SWOT pour la plateforme RADAR.
Tu produis une matrice SWOT rigoureuse à partir d'un corpus de sources évaluées.
Chaque item doit être : factuel, sourcé implicitement, exploitable.
Évite la généralité et le jargon creux.
Réponds UNIQUEMENT en JSON strict :
{ "strengths": string[], "weaknesses": string[], "opportunities": string[], "threats": string[] }
Cible 4 à 8 items par catégorie.`,
  user: `Sujet : ${input.sujet}

Corpus de sources évaluées :
${input.sourcesContexte}`,
});
