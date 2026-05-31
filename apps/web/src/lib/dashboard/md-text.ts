/**
 * Petites aides pour afficher du Markdown en TEXTE BRUT (sans syntaxe) dans les
 * endroits où l'on ne veut pas de rendu riche : carte Kanban, extraits, etc.
 */

/** Retire la syntaxe Markdown courante d'une ligne (gras, code, liens, puces…). */
export function stripMarkdown(input: string): string {
  return input
    .replace(/`{1,3}([^`]*)`{1,3}/g, "$1") // code inline
    .replace(/\*\*([^*]+)\*\*/g, "$1") // gras
    .replace(/\*([^*]+)\*/g, "$1") // italique *
    .replace(/_([^_]+)_/g, "$1") // italique _
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // liens
    .replace(/^[#>\s-]+/, "") // marqueurs de début (#, >, -, espaces)
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extrait un TITRE (1er titre Markdown, sinon 1re ligne) et un EXTRAIT (1er
 * paragraphe de prose) depuis une synthèse Markdown. Tout est nettoyé du
 * Markdown. `null` si vide.
 */
export function titleAndExcerpt(
  markdown: string | null | undefined,
  excerptMax = 180,
): { title: string | null; excerpt: string | null } {
  if (!markdown) return { title: null, excerpt: null };
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");

  let title: string | null = null;
  let titleIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = (lines[i] ?? "").trim();
    if (!l) continue;
    const h = /^#{1,6}\s+(.*)$/.exec(l);
    if (h) {
      title = stripMarkdown(h[1] ?? "");
      titleIdx = i;
      break;
    }
    // Pas de titre Markdown : 1re ligne non vide sert de titre.
    title = stripMarkdown(l);
    titleIdx = i;
    break;
  }

  // Premier paragraphe de prose après le titre (saute titres, puces, vides).
  const buf: string[] = [];
  for (let i = titleIdx + 1; i < lines.length; i++) {
    const raw = lines[i] ?? "";
    const l = raw.trim();
    if (!l) {
      if (buf.length > 0) break;
      continue;
    }
    if (/^#{1,6}\s+/.test(l)) {
      if (buf.length > 0) break;
      continue; // sous-titre avant la prose → on saute
    }
    if (/^([-*+]|\d+\.)\s+/.test(l)) {
      if (buf.length > 0) break;
      buf.push(stripMarkdown(l)); // liste : on prend la 1re puce comme amorce
      continue;
    }
    buf.push(stripMarkdown(l));
  }

  let excerpt = buf.join(" ").trim() || null;
  if (excerpt && excerpt.length > excerptMax) {
    excerpt = excerpt.slice(0, excerptMax).trimEnd() + "…";
  }
  return { title, excerpt };
}
