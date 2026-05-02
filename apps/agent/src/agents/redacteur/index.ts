import { redacteurPrompt, type RedacteurInput } from '@radar/agent-prompts/redacteur';
import { callAgent } from '../../orchestrator/index.js';

export const runRedacteur = async (input: RedacteurInput): Promise<string> => {
  const { system, user } = redacteurPrompt(input);
  return callAgent({ system, user, maxTokens: 8192 });
};
