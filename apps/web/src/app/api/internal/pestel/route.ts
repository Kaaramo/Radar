import { NextResponse } from "next/server";

import { prisma } from "@radar/database";

import { assertInternalSecret } from "@/lib/agents/internal-auth";

/**
 * POST /api/internal/pestel
 *
 * Callback émis par l'agent analyste-pestel. Upsert : 1 Pestel par Rapport.
 *
 * ⚠️ Le SKILL analyste-pestel produit une structure IMBRIQUÉE en français avec
 * des objets riches :
 *   { rapportId, pestel: { politique:[{facteur,description,impact,intensite}], economique, ... } }
 * On NORMALISE ici vers les 6 tableaux de strings plats du modèle Prisma, en
 * tolérant aussi la forme plate anglaise. Chaque facteur est aplati en
 * « Facteur | Impact: x | Intensité: y | Description [Sources: …] » (format que
 * le board PESTEL sait reparser côté UI).
 */

function pickStr(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s.length > 0 ? s : null;
}

type RichFactor = {
  facteur?: unknown;
  titre?: unknown;
  intitule?: unknown;
  description?: unknown;
  impact?: unknown;
  intensite?: unknown;
  intensité?: unknown;
  sources?: unknown;
};

/** Aplati un facteur (string ou objet riche) en une ligne lisible et reparsable. */
function toLine(item: unknown): string | null {
  if (typeof item === "string") return pickStr(item);
  if (!item || typeof item !== "object") return null;
  const f = item as RichFactor;
  const titre = pickStr(f.facteur) ?? pickStr(f.titre) ?? pickStr(f.intitule);
  if (!titre) return pickStr(f.description);

  const parts = [titre];
  const impact = pickStr(f.impact);
  if (impact) parts.push(`Impact: ${impact}`);
  const intensite = pickStr(f.intensite) ?? pickStr(f.intensité);
  if (intensite) parts.push(`Intensité: ${intensite}`);
  const desc = pickStr(f.description);
  if (desc) parts.push(desc);

  let line = parts.join(" | ");
  // Annexe les sources si présentes (tableau d'objets {titre,url} ou strings).
  if (Array.isArray(f.sources) && f.sources.length > 0) {
    const srcs = f.sources
      .map((s) =>
        typeof s === "string"
          ? s
          : s && typeof s === "object"
            ? (pickStr((s as { titre?: unknown }).titre) ??
              pickStr((s as { url?: unknown }).url))
            : null,
      )
      .filter((s): s is string => !!s)
      .slice(0, 4);
    if (srcs.length > 0) line += ` [Sources: ${srcs.join(" ; ")}]`;
  }
  return line.slice(0, 1000);
}

function axis(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map(toLine)
    .filter((s): s is string => s !== null)
    .slice(0, 20);
}

export async function POST(request: Request) {
  const authError = assertInternalSecret(request);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON invalide" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Body attendu objet" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  const rapportId = pickStr(b.rapportId);
  if (!rapportId) {
    return NextResponse.json({ error: "rapportId requis" }, { status: 400 });
  }

  const src =
    b.pestel && typeof b.pestel === "object"
      ? (b.pestel as Record<string, unknown>)
      : b;

  // Accepte clés FR (politique/economique/sociologique/…) ET EN.
  const political = axis(src.politique ?? src.political);
  const economic = axis(src.economique ?? src.economic);
  const social = axis(src.sociologique ?? src.social ?? src.sociale);
  const technological = axis(src.technologique ?? src.technological);
  const environmental = axis(src.environnemental ?? src.environmental);
  const legal = axis(src.legal ?? src.juridique ?? src.legale);

  try {
    await prisma.pestel.upsert({
      where: { rapportId },
      create: {
        rapportId,
        political,
        economic,
        social,
        technological,
        environmental,
        legal,
      },
      update: {
        political,
        economic,
        social,
        technological,
        environmental,
        legal,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "DB upsert", details: msg.slice(0, 200) },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    counts: {
      political: political.length,
      economic: economic.length,
      social: social.length,
      technological: technological.length,
      environmental: environmental.length,
      legal: legal.length,
    },
  });
}
