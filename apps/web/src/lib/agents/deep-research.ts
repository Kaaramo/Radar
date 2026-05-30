import "server-only";

import { prisma } from "@radar/database";

import { loadSkill } from "@/lib/skills/load-skill";
import {
  deepResearchOutputSchema,
  type DeepResearchOutput,
} from "@/lib/skills/deep-research/schema";

/**
 * Deep Research onboarding — sprint 02 (OpenAI Responses API, mode synchrone).
 *
 * Choix modèle : `gpt-5.4` (non-mini) + outil `web_search_preview`.
 *   - Mode "agentic search" (reasoning ≠ deep-research), latence typique 30-120s
 *     pour un profil entreprise + 5 concurrents + insights.
 *   - Coût ≈ 0.20-0.25 $ par run (input $2.50/M + output $15/M + $10/1k tool calls).
 *   - Pourquoi pas gpt-5.4-mini : testé en E2E, instable sur le respect du format
 *     de sortie (1 run sur 3 : pas de bloc JSON, ou champs requis absents, ou
 *     valeurs hors enum). Le surcoût gpt-5.4 (+$0.10/run) est justifié par la
 *     fiabilité structured > raw-fallback dans l'UX onboarding.
 *   - `tool_choice: "required"` force au moins 1 web_search (sinon le modèle
 *     répond depuis ses connaissances pré-entraînées, ce qui casse la veille
 *     temps réel).
 *   - Override possible via env `OPENAI_DEEP_RESEARCH_MODEL` (fallback escalade
 *     vers `gpt-5.5` flagship ou `o4-mini-deep-research-2025-06-26` en V2).
 *
 * Pipeline (fire-and-forget) :
 *   1. Verrou anti-double-submit (statut IN_PROGRESS + heartbeat 5 min).
 *   2. Charge le skill `deep-research` (SKILL.md).
 *   3. POST /v1/responses (synchrone, sans `background`, sans `store`) avec :
 *        - model = `gpt-5.4-mini`
 *        - tools = [{ type: "web_search_preview" }]
 *        - reasoning = { summary: "auto" }
 *        - input = [developer(SKILL.md), user(query buildResearchQuery)]
 *   4. AbortController + timeout 5 min — au-delà on annule et on FAIL.
 *   5. Extrait le dernier item `message` → text + annotations (citations).
 *   6. Cherche un bloc ```json … ``` dans le text → coerce longueurs → Zod parse.
 *   7. Si pas de JSON valide → raw-fallback (markdown brut + sources annotations).
 *   8. Persiste payload + statut final (SUCCESS / FAILED) dans `enrichissement` JSONB.
 *
 * Erreurs jamais propagées : l'UX onboarding ne doit pas être bloquée par un échec
 * de l'agent (cf. PRD § 7.3 « le cycle quotidien fonctionne avec ce qu'il a »).
 */

const OPENAI_API_BASE = "https://api.openai.com/v1";
const DR_MODEL_DEFAULT = "gpt-5.4";

// Timeout hard côté client : on annule le call si OpenAI dépasse 5 min.
const OPENAI_SYNC_TIMEOUT_MS = 5 * 60 * 1000;

// Verrou : si IN_PROGRESS plus vieux que ça → zombie, on prend le relais.
// Cohérent avec OPENAI_SYNC_TIMEOUT_MS (un peu de marge pour markFailed).
const HEARTBEAT_LOCK_MS = 5 * 60 * 1000;

// ── Types réponse OpenAI Responses API ────────────────────────────────────
// Sous-set minimal — on ignore les champs qu'on n'utilise pas (web_search_call,
// reasoning, etc.). Le shape est documenté sur developers.openai.com/api/docs.

type OpenAIAnnotation = {
  type?: string;
  title?: string;
  url?: string;
  start_index?: number;
  end_index?: number;
};

type OpenAIContentItem = {
  type?: string;
  text?: string;
  annotations?: OpenAIAnnotation[];
};

type OpenAIOutputItem = {
  id?: string;
  type?: string; // "message" | "web_search_call" | "reasoning" | ...
  role?: string;
  status?: string;
  content?: OpenAIContentItem[];
};

type OpenAIResponse = {
  id: string;
  status:
    | "queued"
    | "in_progress"
    | "completed"
    | "failed"
    | "incomplete"
    | "cancelled";
  output?: OpenAIOutputItem[];
  output_text?: string; // convenience flat field
  error?: { type?: string; message?: string; code?: string };
  incomplete_details?: { reason?: string; description?: string };
};

// ── Logger structuré ──────────────────────────────────────────────────────

type LogEvent = {
  profilId: string;
  phase:
    | "start"
    | "skip_no_apikey"
    | "skip_no_website"
    | "skip_locked"
    | "openai_submit"
    | "openai_response"
    | "validated_structured"
    | "raw_fallback"
    | "error"
    | "done";
  status?: "IDLE" | "IN_PROGRESS" | "SUCCESS" | "FAILED";
  durationMs?: number;
  skillVersion?: string;
  model?: string;
  responseId?: string;
  sourcesCount?: number;
  errorMessage?: string;
  errorCode?: string;
};

function logDR(evt: LogEvent): void {
  const line = JSON.stringify({
    scope: "deep-research",
    ts: new Date().toISOString(),
    ...evt,
  });
  if (evt.phase === "error") console.error(line);
  else if (evt.phase.startsWith("skip_")) console.warn(line);
  else console.info(line);
}

// ── API publique ──────────────────────────────────────────────────────────

export function triggerDeepResearch(profilId: string): void {
  void runDeepResearch(profilId).catch((err: unknown) => {
    logDR({
      profilId,
      phase: "error",
      status: "FAILED",
      errorMessage: err instanceof Error ? err.message : String(err),
    });
  });
}

/** Variante awaitable — utile pour les scripts CLI / tests d'intégration. */
export async function runDeepResearch(profilId: string): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.startsWith("sk-xxx") || apiKey.length < 20) {
    logDR({ profilId, phase: "skip_no_apikey" });
    await markFailed(
      profilId,
      "OPENAI_API_KEY manquante ou placeholder (config serveur)",
    );
    return;
  }

  // Verrou atomique
  const locked = await acquireLock(profilId);
  if (!locked.ok) {
    logDR({ profilId, phase: "skip_locked", errorMessage: locked.reason });
    return;
  }

  const profil = locked.profil;
  if (!profil.siteWeb) {
    logDR({ profilId, phase: "skip_no_website" });
    await markFailed(profilId, "Site web manquant sur le profil");
    return;
  }

  const skill = loadSkill("deep-research");
  const skillVersion = skill.meta.version ?? "unknown";
  const model = process.env.OPENAI_DEEP_RESEARCH_MODEL ?? DR_MODEL_DEFAULT;

  const userPrompt = buildResearchQuery({
    nomEntreprise: profil.nomEntreprise,
    siteWeb: profil.siteWeb,
  });

  const startedAt = Date.now();
  logDR({
    profilId,
    phase: "start",
    status: "IN_PROGRESS",
    skillVersion,
    model,
  });

  let final: OpenAIResponse;
  try {
    final = await callOpenAIResponses({
      apiKey,
      model,
      developerPrompt: skill.body,
      userPrompt,
      profilId,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logDR({
      profilId,
      phase: "error",
      status: "FAILED",
      durationMs: Date.now() - startedAt,
      errorMessage: msg,
    });
    await markFailed(profilId, `OpenAI Responses a échoué : ${msg}`);
    return;
  }

  // Extract message (final answer) — c'est le dernier item de type `message`
  const messageItem = findFinalMessage(final);
  const fullText =
    messageItem?.content?.find((c) => c.type === "output_text")?.text ??
    final.output_text ??
    "";
  const annotations =
    messageItem?.content?.find((c) => c.type === "output_text")?.annotations ??
    [];

  logDR({
    profilId,
    phase: "openai_response",
    responseId: final.id,
    sourcesCount: annotations.length,
  });

  if (!fullText.trim()) {
    const msg = "Réponse OpenAI sans texte (output vide)";
    logDR({ profilId, phase: "error", status: "FAILED", errorMessage: msg });
    await markFailed(profilId, msg);
    return;
  }

  // Stratégie : on demande au modèle de glisser un bloc ```json … ``` dans son
  // rapport final. On l'extrait, on coerce les longueurs aux maxima du schéma
  // (gpt-5.4-mini est verbeux et peut dépasser 280 chars sur description /
  // positionnement / icp), puis on valide Zod. Si pas de bloc ou validation
  // échouée même après coercition → raw-fallback (markdown brut + annotations).
  let structured: DeepResearchOutput | null = null;
  const extracted = extractJsonBlock(fullText);
  if (extracted !== null) {
    const coerced = coerceToSchemaLengths(extracted);
    const parsed = deepResearchOutputSchema.safeParse(coerced);
    if (parsed.success) {
      structured = parsed.data;
      logDR({ profilId, phase: "validated_structured" });
    } else {
      logDR({
        profilId,
        phase: "raw_fallback",
        errorMessage: `Validation Zod échouée : ${parsed.error.issues
          .slice(0, 3)
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join(" | ")}`,
      });
    }
  } else {
    logDR({
      profilId,
      phase: "raw_fallback",
      errorMessage: "Aucun bloc ```json``` trouvé dans le rapport final",
    });
  }

  const enrichissementPayload =
    structured !== null
      ? {
          schemaVersion: structured.version,
          skillVersion,
          status: "structured" as const,
          ...structured,
          rawAnalysis: fullText,
        }
      : {
          schemaVersion: "1.0-raw",
          skillVersion,
          status: "raw-fallback" as const,
          finalAnalysis: fullText,
          sources: dedupeAnnotations(annotations).map((a) => ({
            url: a.url ?? null,
            titre: a.title ?? null,
            description: null as string | null,
          })),
        };

  const durationMs = Date.now() - startedAt;

  await prisma.profilUtilisateur.update({
    where: { id: profilId },
    data: {
      enrichissement: enrichissementPayload,
      enrichissementLe: new Date(),
      enrichissementVer: skillVersion,
      enrichissementStatut: "SUCCESS",
      enrichissementErreur: null,
    },
  });

  logDR({
    profilId,
    phase: "done",
    status: "SUCCESS",
    durationMs,
    skillVersion,
    model,
    responseId: final.id,
    sourcesCount: annotations.length,
  });
}

// ── Verrou atomique (Postgres updateMany) ─────────────────────────────────

async function acquireLock(profilId: string): Promise<
  | { ok: false; reason: string }
  | {
      ok: true;
      profil: { id: string; nomEntreprise: string; siteWeb: string | null };
    }
> {
  const cutoff = new Date(Date.now() - HEARTBEAT_LOCK_MS);

  const result = await prisma.profilUtilisateur.updateMany({
    where: {
      id: profilId,
      OR: [
        { enrichissementStatut: { not: "IN_PROGRESS" } },
        { enrichissementStartedAt: { lt: cutoff } },
        { enrichissementStartedAt: null },
      ],
    },
    data: {
      enrichissementStatut: "IN_PROGRESS",
      enrichissementStartedAt: new Date(),
      enrichissementErreur: null,
    },
  });

  if (result.count === 0) {
    return {
      ok: false,
      reason: `Un enrichissement est déjà en cours (verrou actif < ${HEARTBEAT_LOCK_MS / 60000} min)`,
    };
  }

  const profil = await prisma.profilUtilisateur.findUnique({
    where: { id: profilId },
    select: { id: true, nomEntreprise: true, siteWeb: true },
  });

  if (!profil) {
    return {
      ok: false,
      reason: "Profil introuvable après acquisition du verrou",
    };
  }

  return { ok: true, profil };
}

// ── Appel OpenAI Responses API (synchrone) ────────────────────────────────

async function callOpenAIResponses(input: {
  apiKey: string;
  model: string;
  developerPrompt: string;
  userPrompt: string;
  profilId: string;
}): Promise<OpenAIResponse> {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${input.apiKey}`,
  };

  // Body synchrone : pas de `background`, pas de `store`. Le call attend la fin.
  //
  // `tool_choice: "required"` : OBLIGE le modèle à appeler web_search_preview
  // au moins une fois. Sinon gpt-5.4-mini (et tous les modèles non deep-research)
  // a tendance à répondre depuis ses connaissances pré-entraînées sans toucher
  // au web — ce qui casse notre cas d'usage « veille temps réel ».
  const body = {
    model: input.model,
    input: [
      {
        role: "developer",
        content: [{ type: "input_text", text: input.developerPrompt }],
      },
      {
        role: "user",
        content: [{ type: "input_text", text: input.userPrompt }],
      },
    ],
    tools: [{ type: "web_search_preview" }],
    tool_choice: "required",
    reasoning: { summary: "auto" },
  };

  // AbortController : on annule le fetch si OpenAI dépasse le timeout.
  // Pourquoi : Vercel / next dev timeout fetch est ~15 min par défaut, mais on
  // veut un plafond propre côté agent pour FAIL proprement et libérer le verrou.
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    OPENAI_SYNC_TIMEOUT_MS,
  );

  let res: Response;
  try {
    res = await fetch(`${OPENAI_API_BASE}/responses`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    if (controller.signal.aborted) {
      throw new Error(
        `Timeout côté client après ${OPENAI_SYNC_TIMEOUT_MS / 1000}s (job toujours en cours côté OpenAI)`,
      );
    }
    throw new Error(
      `OpenAI network error : ${err instanceof Error ? err.message : String(err)}`,
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`OpenAI HTTP ${res.status} : ${errBody.slice(0, 500)}`);
  }

  const payload = (await res.json()) as OpenAIResponse;

  logDR({
    profilId: input.profilId,
    phase: "openai_submit",
    responseId: payload.id,
    model: input.model,
  });

  if (payload.status === "completed") {
    return payload;
  }

  // `incomplete` peut quand même contenir un message exploitable — on remonte
  // la response, le caller décidera (extractJsonBlock essaiera).
  if (payload.status === "incomplete" && findFinalMessage(payload)) {
    return payload;
  }

  const reason =
    payload.error?.message ??
    payload.incomplete_details?.reason ??
    payload.incomplete_details?.description ??
    payload.status;
  throw new Error(`OpenAI response ${payload.status} : ${reason}`);
}

// ── Helpers ───────────────────────────────────────────────────────────────

/** Le dernier item `message` du output array contient la réponse finale. */
function findFinalMessage(resp: OpenAIResponse): OpenAIOutputItem | null {
  if (!resp.output || resp.output.length === 0) return null;
  for (let i = resp.output.length - 1; i >= 0; i--) {
    const item = resp.output[i];
    if (item && item.type === "message") return item;
  }
  return null;
}

/**
 * Extrait le premier bloc JSON ```json … ``` (ou ``` … ```) du markdown.
 * Retourne null si pas trouvé ou JSON.parse fail. Tolère le json placé en milieu
 * de prose (le rapport contient prose + citations + bloc final).
 */
function extractJsonBlock(markdown: string): unknown | null {
  if (!markdown) return null;
  // 1. Cherche un bloc ```json … ``` (greedy sur le dernier — souvent en fin de rapport)
  const fencedRegex = /```(?:json)?\s*([\s\S]*?)\s*```/gi;
  const matches = [...markdown.matchAll(fencedRegex)];
  // On essaie du dernier au premier (le JSON final est en fin de rapport)
  for (let i = matches.length - 1; i >= 0; i--) {
    const content = matches[i]?.[1]?.trim();
    if (!content) continue;
    try {
      const parsed = JSON.parse(content);
      // Filet : on ignore les blocs qui ne sont pas des objets JSON
      if (typeof parsed === "object" && parsed !== null) return parsed;
    } catch {
      // fall through
    }
  }
  // 2. Sinon, tente de parser le markdown entier (cas où le LLM répond sans fence)
  const trimmed = markdown.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      // fall through
    }
  }
  return null;
}

/**
 * Tronque les champs string aux longueurs max du schéma + raboute les arrays.
 *
 * Pourquoi : `gpt-5.4-mini` produit naturellement des `description` /
 * `positionnement` / `icp` de 300-500 caractères. Notre schéma plafonne à 280.
 * Plutôt que de perdre toute la donnée structurée (raw-fallback), on coerce en
 * douceur AVANT la validation Zod : on tronque les strings trop longues à
 * maxLength-1 + ellipse, et on raboute les arrays à maxItems.
 *
 * Sécurité : pas de mutation des inputs (clone partiel). Si le payload n'est
 * pas un objet, on le renvoie tel quel — Zod fera l'erreur explicite.
 */
function coerceToSchemaLengths(raw: unknown): unknown {
  if (typeof raw !== "object" || raw === null) return raw;
  const obj = { ...(raw as Record<string, unknown>) };

  // Strings simples nullable à maxLength 280
  const stringMaxLen: Record<string, number> = {
    secteur: 280,
    description: 280,
    positionnement: 280,
    icp: 280,
  };
  for (const [field, max] of Object.entries(stringMaxLen)) {
    const v = obj[field];
    if (typeof v === "string" && v.length > max) {
      obj[field] = `${v.slice(0, max - 1).trimEnd()}…`;
    }
  }

  // `taille` : enum strict { "1-10" | "11-50" | "51-200" | "201-500" | "500+" }.
  // gpt-5.4-mini invente parfois des ranges hors-enum ("1001-5000", "1000+",
  // "moyenne", etc.) — on remappe vers le bucket le plus proche.
  obj.taille = normalizeTaille(obj.taille);

  // Arrays de strings avec items maxLength
  const arrayStringMax: Record<string, { items: number; max: number }> = {
    produits: { items: 6, max: 100 },
    marches: { items: 6, max: 100 },
    motsClesMetier: { items: 8, max: 60 },
  };
  for (const [field, { items, max }] of Object.entries(arrayStringMax)) {
    const arr = obj[field];
    if (Array.isArray(arr)) {
      obj[field] = arr
        .slice(0, items)
        .map((x) => (typeof x === "string" ? x.slice(0, max) : x));
    }
  }

  // concurrentsSuggeres : max 5 items, nom ≤ 120, raison ≤ 100
  if (Array.isArray(obj.concurrentsSuggeres)) {
    obj.concurrentsSuggeres = (
      obj.concurrentsSuggeres as Array<Record<string, unknown>>
    )
      .slice(0, 5)
      .map((c) => ({
        ...c,
        nom: typeof c.nom === "string" ? c.nom.slice(0, 120) : c.nom,
        raison:
          typeof c.raison === "string" ? c.raison.slice(0, 100) : c.raison,
      }));
  }

  // sourcesUtilisees : max 12 items, titre ≤ 200
  if (Array.isArray(obj.sourcesUtilisees)) {
    obj.sourcesUtilisees = (
      obj.sourcesUtilisees as Array<Record<string, unknown>>
    )
      .slice(0, 12)
      .map((s) => ({
        ...s,
        titre: typeof s.titre === "string" ? s.titre.slice(0, 200) : s.titre,
      }));
  }

  return obj;
}

/**
 * Mappe les valeurs `taille` invalides vers le bucket enum le plus proche.
 *
 * - Valeurs déjà-valides → passthrough.
 * - Strings type "1001-5000", "5000+", "200-500 employés" → parse le premier
 *   nombre et place dans le bucket adéquat.
 * - Strings type "moyenne entreprise", "PME" → null (mieux que de fail Zod).
 * - Tout le reste (null, undefined, autre type) → null.
 */
function normalizeTaille(raw: unknown): string | null {
  const validEnum = ["1-10", "11-50", "51-200", "201-500", "500+"] as const;
  if (typeof raw !== "string") return null;
  if ((validEnum as readonly string[]).includes(raw)) return raw;
  const firstNum = /(\d+)/.exec(raw);
  if (!firstNum) return null;
  const n = Number.parseInt(firstNum[1] ?? "0", 10);
  if (Number.isNaN(n) || n <= 0) return null;
  if (n <= 10) return "1-10";
  if (n <= 50) return "11-50";
  if (n <= 200) return "51-200";
  if (n <= 500) return "201-500";
  return "500+";
}

/** Déduplique les annotations OpenAI sur l'URL (le modèle cite souvent N fois). */
function dedupeAnnotations(
  annotations: OpenAIAnnotation[],
): OpenAIAnnotation[] {
  const seen = new Set<string>();
  const result: OpenAIAnnotation[] = [];
  for (const a of annotations) {
    const key = a.url ?? a.title ?? "";
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(a);
  }
  return result;
}

/** Marque le profil comme FAILED + persiste le message d'erreur (idempotent). */
async function markFailed(profilId: string, message: string): Promise<void> {
  try {
    await prisma.profilUtilisateur.update({
      where: { id: profilId },
      data: {
        enrichissementStatut: "FAILED",
        enrichissementErreur: message.slice(0, 1000),
      },
    });
  } catch (err) {
    console.error(
      `[deep-research] markFailed failed for profilId=${profilId}:`,
      err,
    );
  }
}

/**
 * Construit le prompt user (inputs + cadrage). Le SKILL.md est passé en
 * `developer` role — ici on n'envoie que les inputs spécifiques + un pointeur
 * vers les sources locales à privilégier.
 */
function buildResearchQuery(input: {
  nomEntreprise: string;
  siteWeb: string;
}): string {
  return [
    `Profil business de l'entreprise « ${input.nomEntreprise} » (site renseigné : ${input.siteWeb}).`,
    "",
    "Privilégier les sources marocaines et maghrébines (medias24.com, leconomiste.com, h24info.ma, jeuneafrique.com, telquel.ma, le360.ma, challenge.ma) puis francophones internationales.",
    "Ne pas scraper le site renseigné — utiliser uniquement les snippets de recherche web.",
    "Cibler les éléments exigés par le schéma JSON fourni dans le prompt developer.",
    "",
    "Format de sortie OBLIGATOIRE : ton rapport final doit contenir un bloc ```json …``` valide à la fin, conforme au schéma JSON Schema détaillé dans le developer prompt. Aucun autre format n'est consommé.",
  ].join("\n");
}
