export interface EvaluateurCraapInput {
  url: string;
  titre: string;
  domaine: string;
  publieLe: string | null;
  resume: string;
  sujet: string;
}

export const evaluateurCraapPrompt = (input: EvaluateurCraapInput) => ({
  system: `Tu es un agent ÉVALUATEUR CRAAP pour la plateforme RADAR.
Tu évalues la fiabilité d'une source selon les 5 critères CRAAP (notation 0-10) :
- Currency (actualité)
- Relevance (pertinence vs sujet)
- Authority (autorité de la source)
- Accuracy (exactitude vérifiable)
- Purpose (intention, biais)

Tu rejettes une source si le score global < 5/10.
Réponds UNIQUEMENT en JSON strict :
{ "currency": n, "relevance": n, "authority": n, "accuracy": n, "purpose": n, "global": n, "justification": string, "rejetee": boolean }`,
  user: `Sujet de la veille : ${input.sujet}

Source à évaluer :
- URL : ${input.url}
- Titre : ${input.titre}
- Domaine : ${input.domaine}
- Publié le : ${input.publieLe ?? 'inconnu'}
- Résumé : ${input.resume}`,
});
