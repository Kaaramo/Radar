import "server-only";

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/**
 * Déclencheur de cycle OpenClaw — V1 (local / VPS Docker).
 *
 * Découverte d'intégration :
 *  1. Cette image OpenClaw N'EXPOSE PAS d'API HTTP OpenAI-compatible
 *     (`/v1/chat/completions` → 404). C'est une Gateway WebSocket ; on déclenche
 *     un tour d'agent via la CLI `openclaw agent`.
 *  2. L'orchestrateur chaîne ses sous-agents via sessions_spawn + yield
 *     (imbriqué), or ce pattern CALE (le sous-agent spawné ne démarre jamais).
 *     Lancé en tour top-level, chaque agent fonctionne.
 *
 * Donc on N'appelle PAS l'orchestrateur imbriqué : on déclenche un script
 * d'orchestration déterministe (apps/agent/workspace/scripts/run-cycle.mjs)
 * qui enchaîne les 6 sous-agents en tours top-level séquentiels et poste la
 * progression + les résultats sur /api/internal/*.
 *
 * Le script tourne DANS le conteneur (a accès au CLI `openclaw` + au réseau
 * `web:3000`). `docker exec -d` détache l'exécution → la Server Action rend la
 * main immédiatement.
 *
 * V2 (web sur Vercel, openclaw distant) : remplacer `docker exec` par un client
 * WebSocket vers la Gateway, ou exposer un canal HTTP.
 */

const OPENCLAW_CONTAINER = process.env.OPENCLAW_CONTAINER ?? "radar-openclaw";
const CYCLE_SCRIPT =
  process.env.OPENCLAW_CYCLE_SCRIPT ??
  "/home/node/.openclaw/workspace/scripts/run-cycle.mjs";
const WEEK_SCRIPT =
  process.env.OPENCLAW_WEEK_SCRIPT ??
  "/home/node/.openclaw/workspace/scripts/run-week.mjs";

export type OpenClawTriggerResult = {
  ok: boolean;
  error?: string;
};

export type WeekBatchItem = {
  rapportId: string;
  concurrentNom: string;
  concurrentSite: string;
};

/**
 * Déclenche un cycle de veille pour un rapport donné (fire-and-forget).
 *
 * Retourne { ok: true } dès que le script a été lancé dans le conteneur (`-d`
 * détache). La progression + les résultats arrivent ensuite par callbacks sur
 * /api/internal/*. { ok: false } si le lancement lui-même échoue (Docker
 * absent, conteneur arrêté).
 */
export async function triggerOpenClawCycle(input: {
  rapportId: string;
  entreprise: string;
  secteur: string;
  concurrentNom: string;
  concurrentSite: string;
  premierRapport: boolean;
}): Promise<OpenClawTriggerResult> {
  // execFile (pas exec) : arguments en tableau, jamais interprétés par un shell
  // → aucune injection possible via les valeurs (nom concurrent, etc.).
  const args = [
    "exec",
    "-d",
    OPENCLAW_CONTAINER,
    "node",
    CYCLE_SCRIPT,
    input.rapportId,
    input.entreprise,
    input.secteur,
    input.concurrentNom,
    input.concurrentSite,
    String(input.premierRapport),
  ];

  try {
    await execFileAsync("docker", args, { timeout: 15_000 });
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `docker exec run-cycle : ${msg.slice(0, 300)}` };
  }
}

/**
 * Déclenche une veille hebdomadaire : un cycle par concurrent, traités EN FILE
 * (séquentiellement) par `run-week.mjs` dans le conteneur. Le détail des items
 * passe en argument base64 (JSON) → aucune interprétation shell, aucune limite
 * de parsing d'arguments.
 */
export async function triggerOpenClawWeek(input: {
  entreprise: string;
  secteur: string;
  premierRapport: boolean;
  items: WeekBatchItem[];
}): Promise<OpenClawTriggerResult> {
  const payload = Buffer.from(JSON.stringify(input), "utf8").toString("base64");
  const args = ["exec", "-d", OPENCLAW_CONTAINER, "node", WEEK_SCRIPT, payload];

  try {
    await execFileAsync("docker", args, { timeout: 15_000 });
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `docker exec run-week : ${msg.slice(0, 300)}` };
  }
}
