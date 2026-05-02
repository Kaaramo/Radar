import { analysteSwotPrompt, type AnalysteSwotInput } from '@radar/agent-prompts/analyste-swot';
import type { SWOT } from '@radar/api-contracts';
import { callAgentJSON } from '../../orchestrator/index.js';

export const runAnalysteSwot = async (input: AnalysteSwotInput): Promise<SWOT> => {
  const { system, user } = analysteSwotPrompt(input);
  return callAgentJSON<SWOT>({ system, user });
};
