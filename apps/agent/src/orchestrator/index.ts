import Anthropic from '@anthropic-ai/sdk';
import { createLogger } from '@radar/shared';

const log = createLogger('orchestrator');

let client: Anthropic | null = null;

export const getAnthropicClient = (): Anthropic => {
  if (client) return client;
  const apiKey = process.env['ANTHROPIC_API_KEY'];
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY manquante');
  }
  client = new Anthropic({ apiKey });
  return client;
};

export interface AgentCall {
  system: string;
  user: string;
  model?: string;
  maxTokens?: number;
}

const DEFAULT_MODEL = 'claude-opus-4-7';
const DEFAULT_MAX_TOKENS = 4096;

export const callAgent = async (call: AgentCall): Promise<string> => {
  const c = getAnthropicClient();
  const model = call.model ?? DEFAULT_MODEL;
  log.debug('Appel agent', { model, systemLen: call.system.length });

  const res = await c.messages.create({
    model,
    max_tokens: call.maxTokens ?? DEFAULT_MAX_TOKENS,
    system: call.system,
    messages: [{ role: 'user', content: call.user }],
  });

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n');

  return text;
};

export const callAgentJSON = async <T>(call: AgentCall): Promise<T> => {
  const raw = await callAgent(call);
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned) as T;
};
