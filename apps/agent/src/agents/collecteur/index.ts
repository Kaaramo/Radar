import { collecteurPrompt, type CollecteurInput } from '@radar/agent-prompts/collecteur';
import { callAgentJSON } from '../../orchestrator/index.js';

export interface CollecteurResult {
  requetes: string[];
}

export const runCollecteur = async (input: CollecteurInput): Promise<CollecteurResult> => {
  const { system, user } = collecteurPrompt(input);
  return callAgentJSON<CollecteurResult>({ system, user });
};
