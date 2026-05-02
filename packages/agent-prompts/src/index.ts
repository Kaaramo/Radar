export { collecteurPrompt } from './collecteur/index.js';
export { evaluateurCraapPrompt } from './evaluateur-craap/index.js';
export { analysteSwotPrompt } from './analyste-swot/index.js';
export { analystePestelPrompt } from './analyste-pestel/index.js';
export { detecteurSignauxFaiblesPrompt } from './detecteur-signaux-faibles/index.js';
export { redacteurPrompt } from './redacteur/index.js';

export type PromptInput = Record<string, string | number | boolean | string[]>;
export type Prompt<I extends PromptInput = PromptInput> = (input: I) => {
  system: string;
  user: string;
};
