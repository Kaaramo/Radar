import type { ReactNode } from "react";

/**
 * Visualiseur Markdown maison (zéro dépendance) pour les rapports rédigés par
 * l'agent. Couvre le sous-ensemble réellement produit : titres, paragraphes,
 * listes, citations, code, règles, tableaux GFM, et l'inline (gras, italique,
 * code, liens). Stylé charte Radar : Fraunces pour les titres, Inter pour le
 * corps, JetBrains Mono pour le code.
 */

/* ── Inline ───────────────────────────────────────────────────────────────── */

const INLINE =
  /(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))|(\*([^*]+)\*)|(_([^_]+)_)/g;

function parseInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  INLINE.lastIndex = 0;
  while ((m = INLINE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2] !== undefined) {
      nodes.push(
        <strong key={key++} className="font-semibold text-bone">
          {m[2]}
        </strong>,
      );
    } else if (m[4] !== undefined) {
      nodes.push(
        <code
          key={key++}
          className="rounded bg-navy-800 px-1.5 py-0.5 font-mono text-[0.85em] text-royal-light"
        >
          {m[4]}
        </code>,
      );
    } else if (m[6] !== undefined) {
      nodes.push(
        <a
          key={key++}
          href={m[7]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-royal-light underline decoration-royal/40 underline-offset-2 hover:decoration-royal"
        >
          {m[6]}
        </a>,
      );
    } else if (m[9] !== undefined) {
      nodes.push(
        <em key={key++} className="italic text-muted">
          {m[9]}
        </em>,
      );
    } else if (m[11] !== undefined) {
      nodes.push(
        <em key={key++} className="italic text-muted">
          {m[11]}
        </em>,
      );
    }
    last = INLINE.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/* ── Blocs ────────────────────────────────────────────────────────────────── */

function splitCells(row: string): string[] {
  return row
    .replace(/^\s*\|/, "")
    .replace(/\|\s*$/, "")
    .split("|")
    .map((c) => c.trim());
}

export function MarkdownView({ markdown }: { markdown: string }) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";

    // Lignes vides
    if (!line.trim()) {
      i++;
      continue;
    }

    // Bloc de code ```
    if (line.trim().startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? "").trim().startsWith("```")) {
        buf.push(lines[i] ?? "");
        i++;
      }
      i++; // saute la fence fermante
      blocks.push(
        <pre
          key={key++}
          className="overflow-x-auto rounded-md border border-navy-700 bg-navy-900 p-4 font-mono text-[12.5px] leading-relaxed text-muted"
        >
          <code>{buf.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    // Titres
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1]?.length ?? 1;
      const content = parseInline(h[2] ?? "");
      if (level === 1) {
        blocks.push(
          <h1
            key={key++}
            className="mb-4 mt-8 font-display text-[28px] font-light leading-tight tracking-[-0.02em] text-bone first:mt-0"
          >
            {content}
          </h1>,
        );
      } else if (level === 2) {
        blocks.push(
          <h2
            key={key++}
            className="mb-3 mt-8 border-b border-navy-700 pb-2 font-display text-[21px] font-normal tracking-[-0.01em] text-bone first:mt-0"
          >
            {content}
          </h2>,
        );
      } else {
        blocks.push(
          <h3
            key={key++}
            className="mb-2 mt-6 text-[15px] font-semibold uppercase tracking-[0.04em] text-royal-light"
          >
            {content}
          </h3>,
        );
      }
      i++;
      continue;
    }

    // Règle horizontale
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push(<hr key={key++} className="my-6 border-navy-700" />);
      i++;
      continue;
    }

    // Citation
    if (line.trimStart().startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && (lines[i] ?? "").trimStart().startsWith(">")) {
        buf.push((lines[i] ?? "").replace(/^\s*>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote
          key={key++}
          className="my-4 border-l-2 border-royal/50 bg-navy-900/40 py-2 pl-4 text-[14px] italic leading-relaxed text-muted"
        >
          {parseInline(buf.join(" "))}
        </blockquote>,
      );
      continue;
    }

    // Tableau GFM
    const next = lines[i + 1] ?? "";
    if (
      line.includes("|") &&
      /\|/.test(next) &&
      /^[\s:|-]+$/.test(next.trim()) &&
      next.includes("-")
    ) {
      const header = splitCells(line);
      i += 2; // header + séparateur
      const rows: string[][] = [];
      while (
        i < lines.length &&
        (lines[i] ?? "").includes("|") &&
        (lines[i] ?? "").trim()
      ) {
        rows.push(splitCells(lines[i] ?? ""));
        i++;
      }
      blocks.push(
        <div key={key++} className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-navy-700">
                {header.map((c, ci) => (
                  <th
                    key={ci}
                    className="px-3 py-2 text-left font-semibold text-bone"
                  >
                    {parseInline(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className="border-b border-navy-800">
                  {r.map((c, ci) => (
                    <td key={ci} className="px-3 py-2 align-top text-muted">
                      {parseInline(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // Listes (puces ou numérotées)
    const isUl = /^\s*[-*+]\s+/.test(line);
    const isOl = /^\s*\d+\.\s+/.test(line);
    if (isUl || isOl) {
      const items: string[] = [];
      while (i < lines.length) {
        const l = lines[i] ?? "";
        const mu = /^\s*[-*+]\s+(.*)$/.exec(l);
        const mo = /^\s*\d+\.\s+(.*)$/.exec(l);
        if (isUl && mu) items.push(mu[1] ?? "");
        else if (isOl && mo) items.push(mo[1] ?? "");
        else break;
        i++;
      }
      const inner = items.map((it, idx) => (
        <li key={idx} className="leading-relaxed">
          {parseInline(it)}
        </li>
      ));
      blocks.push(
        isOl ? (
          <ol
            key={key++}
            className="my-3 list-decimal space-y-1.5 pl-5 text-[14px] text-muted marker:text-muted-soft"
          >
            {inner}
          </ol>
        ) : (
          <ul
            key={key++}
            className="my-3 list-disc space-y-1.5 pl-5 text-[14px] text-muted marker:text-royal"
          >
            {inner}
          </ul>
        ),
      );
      continue;
    }

    // Paragraphe (lignes consécutives non spéciales)
    const para: string[] = [];
    while (i < lines.length) {
      const l = lines[i] ?? "";
      if (
        !l.trim() ||
        /^(#{1,6})\s+/.test(l) ||
        l.trim().startsWith("```") ||
        l.trimStart().startsWith(">") ||
        /^\s*[-*+]\s+/.test(l) ||
        /^\s*\d+\.\s+/.test(l) ||
        /^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(l)
      ) {
        break;
      }
      para.push(l);
      i++;
    }
    blocks.push(
      <p key={key++} className="my-3 text-[14px] leading-[1.7] text-muted">
        {parseInline(para.join(" "))}
      </p>,
    );
  }

  return <div className="max-w-none">{blocks}</div>;
}
