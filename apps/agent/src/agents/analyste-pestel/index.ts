import { analystePestelPrompt, type AnalystePestelInput } from '@radar/agent-prompts/analyste-pestel';
import type { PESTEL } from '@radar/api-contracts';
import { callAgentJSON } from '../../orchestrator/index.js';

export const runAnalystePestel = async (input: AnalystePestelInput): Promise<PESTEL> => {
  const { system, user } = analystePestelPrompt(input);
  return callAgentJSON<PESTEL>({ system, user });
};
