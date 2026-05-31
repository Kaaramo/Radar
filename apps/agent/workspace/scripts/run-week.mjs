#!/usr/bin/env node
/**
 * Orchestration d'une VEILLE HEBDOMADAIRE RADAR.
 *
 * Lance un cycle de veille par concurrent, traités EN FILE (séquentiellement,
 * jamais en parallèle) pour ne pas saturer l'IA / Tavily ni faire exploser les
 * coûts. Chaque concurrent passe ainsi un par un de « Programmé » à « À lire »
 * dans le Kanban du Brief.
 *
 * Tourne DANS le conteneur OpenClaw. Déclenché en détaché par apps/web
 * (`triggerOpenClawWeek`). Reçoit un seul argument base64(JSON) :
 *   { entreprise, secteur, premierRapport, items: [{rapportId, concurrentNom, concurrentSite}] }
 *
 * Réutilise run-cycle.mjs (1 concurrent = 1 cycle complet) en l'attendant pour
 * garantir l'exécution séquentielle.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const execFileAsync = promisify(execFile);
const HERE = dirname(fileURLToPath(import.meta.url));
const RUN_CYCLE = join(HERE, "run-cycle.mjs");

function log(msg) {
  console.log(`[run-week] ${msg}`);
}

const raw = process.argv[2];
if (!raw) {
  log("payload manquant");
  process.exit(1);
}

let cfg;
try {
  cfg = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
} catch (e) {
  log(`payload illisible: ${e.message}`);
  process.exit(1);
}

const { entreprise, secteur, premierRapport, items } = cfg;
if (!Array.isArray(items) || items.length === 0) {
  log("aucun concurrent à traiter");
  process.exit(0);
}

log(
  `Veille hebdo: ${items.length} concurrent(s) en file | entreprise=${entreprise}`,
);

for (let i = 0; i < items.length; i++) {
  const it = items[i];
  log(
    `(${i + 1}/${items.length}) → ${it.concurrentNom} [${it.rapportId.slice(0, 8)}]`,
  );
  try {
    await execFileAsync(
      "node",
      [
        RUN_CYCLE,
        it.rapportId,
        entreprise ?? "",
        secteur ?? "",
        it.concurrentNom ?? "",
        it.concurrentSite ?? "",
        String(Boolean(premierRapport)),
      ],
      { timeout: 60 * 60 * 1000, maxBuffer: 50 * 1024 * 1024 },
    );
    log(`✓ ${it.concurrentNom} terminé`);
  } catch (e) {
    // Un échec sur un concurrent ne bloque pas les suivants.
    log(`✗ ${it.concurrentNom} ERR ${String(e.message).slice(0, 200)}`);
  }
}

log("✅ Veille hebdomadaire terminée (tous concurrents traités).");
