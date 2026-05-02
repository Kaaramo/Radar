import {
  evaluateurCraapPrompt,
  type EvaluateurCraapInput,
} from '@radar/agent-prompts/evaluateur-craap';
import type { ScoreCRAAP } from '@radar/api-contracts';
import { callAgentJSON } from '../../orchestrator/index.js';

export interface EvaluateurResult extends ScoreCRAAP {
  rejetee: boolean;
}

export const runEvaluateur = async (input: EvaluateurCraapInput): Promise<EvaluateurResult> => {
  const { system, user } = evaluateurCraapPrompt(input);
  return callAgentJSON<EvaluateurResult>({ system, user });
};
