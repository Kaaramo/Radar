export interface CollecteurInput {
  sujet: string;
  contexte?: string;
  profondeur: 'rapide' | 'standard' | 'approfondi';
  langue: 'fr' | 'en';
}

const NB_REQUETES: Record<CollecteurInput['profondeur'], number> = {
  rapide: 5,
  standard: 12,
  approfondi: 25,
};

export const collecteurPrompt = (input: CollecteurInput) => {
  const n = NB_REQUETES[input.profondeur];
  return {
    system: `Tu es un agent COLLECTEUR pour la plateforme RADAR (veille stratégique M244).
Mission : générer des requêtes de recherche pertinentes pour explorer un sujet de veille.
Tu privilégies la diversité (sources institutionnelles, presse spécialisée, rapports, blogs experts) et tu rejettes les requêtes triviales.
Réponds UNIQUEMENT en JSON strict : { "requetes": string[] }.`,
    user: `Sujet : ${input.sujet}
${input.contexte ? `Contexte : ${input.contexte}\n` : ''}Langue : ${input.langue}
Génère ${n} requêtes de recherche complémentaires couvrant : marché, acteurs, technologies, signaux faibles, régulation.`,
  };
};
