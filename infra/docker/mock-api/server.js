import http from 'http';
import fs from 'fs';
import path from 'path';

const SECRET = process.env.OPENCLAW_INTERNAL_SECRET || 'change-me';
const PORT = 3000;
const TESTS_DIR = '/app/tests';

const resolveDir = (url, parsed) => {
  if (url === '/api/internal/profil') return 'deep-research';
  if (url === '/api/internal/swot') return 'analyste-swot';
  if (url === '/api/internal/pestel') return 'analyste-pestel';
  if (url === '/api/internal/signaux') return 'detecteur-signaux-faibles';
  if (url === '/api/internal/rapport/progresse') return 'orchestrateur';
  if (url === '/api/internal/rapport/termine') return 'orchestrateur';
  if (url === '/api/internal/rapport/echec') return 'orchestrateur';
  if (url === '/api/internal/sources') {
    const sources = parsed?.sources ?? [];
    const isEvaluateur = parsed?.evaluation === 'complete' || (sources.length > 0 && sources[0]?.scoreCRAAP !== undefined);
    return isEvaluateur ? 'evaluateur' : 'collecteur';
  }
  return null;
};

const resolveFilename = (url) => {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  if (url === '/api/internal/rapport/progresse') return `progresse-${ts}.json`;
  if (url === '/api/internal/rapport/termine') return `termine-${ts}.json`;
  if (url === '/api/internal/rapport/echec') return `echec-${ts}.json`;
  return `result-${ts}.json`;
};

const saveResult = (url, parsed) => {
  const dir = resolveDir(url, parsed);
  if (!dir) return;
  const outDir = path.join(TESTS_DIR, dir);
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, resolveFilename(url));
  fs.writeFileSync(file, JSON.stringify(parsed, null, 2), 'utf8');
  console.log(`[SAVED] ${file}`);
};

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', () => {
    const secret = req.headers['x-internal-secret'];

    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);

    if (req.method === 'POST' && secret !== SECRET) {
      console.log(`[AUTH FAIL] secret recu: "${secret}" | attendu: "${SECRET}"`);
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    if (req.method === 'POST' && body) {
      try {
        const parsed = JSON.parse(body);
        console.log(JSON.stringify(parsed, null, 2));
        saveResult(req.url, parsed);
      } catch {
        console.log(body);
      }
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[MOCK API] En ecoute sur le port ${PORT}`);
  console.log(`[MOCK API] Les resultats sont sauvegardes dans ${TESTS_DIR}`);
});
