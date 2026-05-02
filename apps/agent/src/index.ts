import Fastify from 'fastify';
import { createLogger } from '@radar/shared';
import { runPipeline } from './pipeline/run.js';
import { z } from 'zod';

const log = createLogger('agent');
const PORT = Number(process.env['AGENT_PORT'] ?? 4000);

const app = Fastify({ logger: false });

const RunBodySchema = z.object({
  rapportId: z.string().uuid(),
});

app.get('/health', async () => ({ ok: true, ts: new Date().toISOString() }));

app.post('/run', async (req, reply) => {
  const auth = req.headers['x-radar-secret'];
  if (auth !== process.env['WEB_WEBHOOK_SECRET']) {
    return reply.code(401).send({ error: 'unauthorized' });
  }
  const parsed = RunBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.code(400).send({ error: 'invalid_payload', issues: parsed.error.issues });
  }

  // Lance le pipeline en arrière-plan ; on accepte tout de suite (202).
  void runPipeline(parsed.data.rapportId).catch((e: unknown) => {
    log.error('Pipeline en échec', { rapportId: parsed.data.rapportId, error: String(e) });
  });

  return reply.code(202).send({ accepted: true, rapportId: parsed.data.rapportId });
});

app
  .listen({ port: PORT, host: '0.0.0.0' })
  .then(() => log.info('Agent démarré', { port: PORT }))
  .catch((e: unknown) => {
    log.error('Échec démarrage agent', { error: String(e) });
    process.exit(1);
  });
