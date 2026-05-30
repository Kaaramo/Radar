import "server-only";

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Skill = répertoire au format compatible avec le skill-creator d'Anthropic :
 *
 *   <skill-name>/
 *     SKILL.md           ← frontmatter YAML + corps Markdown
 *     references/        ← schémas JSON, exemples, tables
 *
 * Le frontmatter expose au minimum `name` et `description`. Le corps est
 * passé tel quel comme prompt aux agents (OpenAI Deep Research en sprint 02, OpenClaw
 * en sprint 04 et au-delà).
 */
export type LoadedSkill = {
  /** Identifiant du skill (ex : `deep-research`). */
  name: string;
  /** Description courte — utilisée pour le triggering / debug. */
  description: string;
  /** Métadonnées libres récupérées dans le frontmatter (version, owners…). */
  meta: Record<string, string>;
  /** Corps Markdown SANS le frontmatter — c'est lui qui sert de prompt. */
  body: string;
  /** Chemin absolu vers le dossier du skill (utile pour référencer les fichiers de `references/`). */
  rootDir: string;
};

const SKILLS_DIR = join(dirname(fileURLToPath(import.meta.url)));

const cache = new Map<string, LoadedSkill>();

/**
 * Charge un skill du dossier courant (`apps/web/src/lib/skills/<name>/SKILL.md`).
 * Met en cache pour éviter les lectures disque répétées (les skills sont quasi-immutables
 * pendant la durée de vie d'un process Node).
 */
export function loadSkill(skillName: string): LoadedSkill {
  const cached = cache.get(skillName);
  if (cached) return cached;

  const rootDir = join(SKILLS_DIR, skillName);
  const skillPath = join(rootDir, "SKILL.md");

  let content: string;
  try {
    content = readFileSync(skillPath, "utf-8");
  } catch (err) {
    throw new Error(
      `[loadSkill] cannot read ${skillPath} : ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  const parsed = parseFrontmatter(content);
  const skill: LoadedSkill = {
    name: parsed.meta.name ?? skillName,
    description: parsed.meta.description ?? "",
    meta: parsed.meta,
    body: parsed.body,
    rootDir,
  };

  cache.set(skillName, skill);
  return skill;
}

/**
 * Parseur YAML frontmatter minimal — supporte uniquement `key: value` plat
 * (pas de listes, pas d'objets imbriqués). Suffisant pour notre format SKILL.md.
 */
function parseFrontmatter(content: string): {
  meta: Record<string, string>;
  body: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(content);
  if (!match) {
    return { meta: {}, body: content.trim() };
  }

  const meta: Record<string, string> = {};
  const lines = (match[1] ?? "").split(/\r?\n/);

  for (const line of lines) {
    if (!line.trim() || line.startsWith("#")) continue;
    const m = /^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/.exec(line);
    if (!m) continue;
    const key = m[1]!;
    const value = (m[2] ?? "").trim();
    meta[key] = stripQuotes(value);
  }

  return { meta, body: (match[2] ?? "").trim() };
}

function stripQuotes(s: string): string {
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}
