#!/usr/bin/env node
/**
 * Orchestration déterministe d'un cycle de veille RADAR (Option 1).
 *
 * Contexte : l'orchestrateur OpenClaw chaîne ses sous-agents via
 * sessions_spawn + yield (imbriqué), or ce pattern CALE sur cette image (le
 * sous-agent spawné ne démarre jamais). Lancé en tour top-level, chaque agent
 * fonctionne (prouvé : collecteur → 18 sources réelles).
 *
 * Ce script remplace donc l'orchestration imbriquée par une séquence
 * DÉTERMINISTE de tours `openclaw agent` top-level, en threadant la sortie de
 * chaque étape vers la suivante, et en postant la progression sur
 * /api/internal/rapport/progresse.
 *
 * Tourne DANS le conteneur OpenClaw (a accès au CLI `openclaw` + au réseau
 * `web:3000`). Déclenché en détaché par apps/web `launchCycle`.
 *
 * Usage :
 *   node run-cycle.mjs <rapportId> <entreprise> <secteur> <concurrent> <site> <premierRapport>
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const [, , rapportId, entreprise, secteur, concurrent, site, premier] =
  process.argv;

const WEB = process.env.RADAR_WEB_BASE_URL || "http://web:3000";
const SECRET = process.env.OPENCLAW_INTERNAL_SECRET || "";
const premierRapport = String(premier) === "true";

function log(msg) {
  console.log(`[run-cycle ${rapportId?.slice(0, 8)}] ${msg}`);
}

/** POST sur une route /api/internal. Ne jette pas (best-effort). */
async function postInternal(path, body) {
  try {
    const res = await fetch(`${WEB}/api/internal/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": SECRET,
      },
      body: JSON.stringify(body),
    });
    const txt = await res.text();
    log(`POST ${path} -> ${res.status} ${txt.slice(0, 120)}`);
    return res.ok;
  } catch (e) {
    log(`POST ${path} ERR ${e.message}`);
    return false;
  }
}

const progresse = (etape, progressionPct) =>
  postInternal("rapport/progresse", {
    rapportId,
    statut: "EN_COURS",
    etape,
    progressionPct,
  });

/**
 * Lance UN tour d'agent top-level (séquentiel, jamais imbriqué) et renvoie
 * le texte de la réponse de l'agent (qui contient sa prose + ses blocs JSON,
 * et l'agent s'est déjà auto-posté sur /api/internal le cas échéant).
 */
async function runAgent(stage, message, model) {
  log(`→ étape ${stage} (openclaw agent${model ? " · " + model : ""})…`);
  try {
    const args = [
      "agent",
      "--agent",
      "main",
      "--session-key",
      `agent:main:cycle-${rapportId}-${stage}`,
      "--timeout",
      "600",
    ];
    // Override modèle pour les étapes lourdes (évaluateur) → modèle rapide.
    if (model) args.push("--model", model);
    args.push("--message", message);
    const { stdout } = await execFileAsync("openclaw", args, {
      timeout: 660_000,
      maxBuffer: 50 * 1024 * 1024,
    });
    log(`← étape ${stage} terminée (${stdout.length} c)`);
    return stdout;
  } catch (e) {
    log(`✗ étape ${stage} ERR ${String(e.message).slice(0, 200)}`);
    return "";
  }
}

const profilTxt = `entreprise: ${entreprise}, secteur: ${secteur}, concurrent cible: ${concurrent} (${site})`;
const note = `Tavily renvoie le contenu complet des pages: utilise web_search, n'utilise PAS web_fetch. POST ton resultat sur http://web:3000/api/internal/* avec le header x-internal-secret (process.env.OPENCLAW_INTERNAL_SECRET) comme decrit dans ton SKILL.`;

async function main() {
  if (!rapportId) {
    log("rapportId manquant");
    process.exit(1);
  }
  log(`Démarrage cycle | ${profilTxt} | premierRapport=${premierRapport}`);
  await progresse("Démarrage", 5);

  // 1) Collecteur (s'auto-poste /sources)
  await progresse("Collecte des sources", 10);
  const sources = await runAgent(
    "collecteur",
    `Tu es le COLLECTEUR RADAR (skill collecteur). rapportId: ${rapportId}. premierRapport: ${premierRapport}. profilUtilisateur: ${profilTxt}, concurrents_connus: [{nom: ${concurrent}, siteWeb: ${site}}]. ${note}`,
  );

  // 2) Évaluateur CRAAP (s'auto-poste /sources avec scores)
  await progresse("Évaluation CRAAP", 28);
  const scored = await runAgent(
    "evaluateur",
    `Tu es l'EVALUATEUR CRAAP RADAR (skill evaluateur). rapportId: ${rapportId}. Voici les sources collectees a scorer:\n${sources.slice(0, 20000)}\n${note}`,
    "deepseek/deepseek-v4-flash",
  );
  const sourcesCtx = (scored || sources).slice(0, 18000);

  // 3) PESTEL (s'auto-poste /pestel) — avant SWOT (cf. SKILL)
  await progresse("Analyse PESTEL", 45);
  const pestel = await runAgent(
    "analyste-pestel",
    `Tu es l'ANALYSTE PESTEL RADAR (skill analyste-pestel). rapportId: ${rapportId}. profilUtilisateur: ${profilTxt}. Sources:\n${sourcesCtx}\n${note}`,
  );

  // 4) Signaux faibles (s'auto-poste /signaux)
  await progresse("Détection des signaux faibles", 60);
  const signaux = await runAgent(
    "detecteur-signaux-faibles",
    `Tu es le DETECTEUR DE SIGNAUX FAIBLES RADAR (skill detecteur-signaux-faibles). rapportId: ${rapportId}. profilUtilisateur: ${profilTxt}. Sources:\n${sourcesCtx}\n${note}`,
  );

  // 5) SWOT (s'auto-poste /swot) — enrichi PESTEL + signaux
  await progresse("Analyse SWOT", 75);
  const swot = await runAgent(
    "analyste-swot",
    `Tu es l'ANALYSTE SWOT RADAR (skill analyste-swot). rapportId: ${rapportId}. profilUtilisateur: ${profilTxt}. Sources evaluees:\n${sourcesCtx}\nanalysePESTEL:\n${(pestel || "").slice(0, 8000)}\nsignauxFaibles:\n${(signaux || "").slice(0, 6000)}\n${note}`,
  );

  // 6) Rédacteur (rend du Markdown — c'est NOUS qui postons /rapport/termine)
  await progresse("Rédaction de la synthèse", 90);
  const synthese = await runAgent(
    "redacteur",
    `Tu es le REDACTEUR RADAR (skill redacteur). rapportId: ${rapportId}. profilUtilisateur: ${profilTxt}. pestel:\n${(pestel || "").slice(0, 6000)}\nsignaux:\n${(signaux || "").slice(0, 4000)}\nswot:\n${(swot || "").slice(0, 8000)}\nsources (resume): ${concurrent}. Produis le rapport Markdown complet (6 sections) selon ton SKILL.`,
  );

  const syntheseClean = (synthese || "").trim();
  if (syntheseClean.length > 20) {
    await postInternal("rapport/termine", {
      rapportId,
      synthese: syntheseClean.slice(0, 49000),
    });
  } else {
    await postInternal("rapport/termine", {
      rapportId,
      synthese: `Cycle de veille terminé pour ${concurrent}. Synthèse rédacteur indisponible (sources, SWOT et PESTEL disponibles dans le rapport).`,
    });
  }
  log("✅ Cycle terminé.");
}

main().catch((e) => {
  log(`FATAL ${e.message}`);
  postInternal("rapport/echec", {
    rapportId,
    erreur: String(e.message).slice(0, 4000),
  }).finally(() => process.exit(1));
});
