import { NextResponse } from "next/server";

import { prisma } from "@radar/database";

import { assertInternalSecret } from "@/lib/agents/internal-auth";

/**
 * POST /api/internal/swot
 *
 * Callback émis par l'agent analyste-swot. Upsert : 1 Swot par Rapport.
 *
 * ⚠️ L'agent (SKILL analyste-swot) produit une structure IMBRIQUÉE en français
 * avec des objets riches :
 *   { rapportId, swot: { forces:[{titre,description,sources}], faiblesses, opportunites, menaces } }
 * alors que le modèle Prisma stocke 4 tableaux de strings plats. On NORMALISE
 * ici, en tolérant aussi la forme plate anglaise (strengths/weaknesses/…) au cas
 * où un autre producteur l'enverrait. Sans cette normalisation, les SWOT
 * arrivaient vides (mismatch de clés silencieux).
 */

type RichItem =
  | string
  | {
      titre?: unknown;
      description?: unknown;
      intitule?: unknown;
      label?: unknown;
      text?: unknown;
    };

/** Convertit un item (string ou objet riche) en une ligne lisible. */
function toLine(item: RichItem): string | null {
  if (typeof item === "string") {
    const s = item.trim();
    return s.length > 0 ? s : null;
  }
  if (item && typeof item === "object") {
    const titre =
      pickString(item.titre) ??
      pickString(item.intitule) ??
      pickString(item.label) ??
      pickString(item.text);
    const desc = pickString(item.description);
    if (titre && desc) return `${titre} : ${desc}`;
    return titre ?? desc ?? null;
  }
  return null;
}

function pickString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s.length > 0 ? s : null;
}

/** Normalise une valeur d'axe (tableau d'items hétérogènes) en string[]. */
function axis(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((it) => toLine(it as RichItem))
    .filter((s): s is string => s !== null)
    .slice(0, 20)
    .map((s) => s.slice(0, 1000));
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

  const rapportId = pickString(b.rapportId);
  if (!rapportId) {
    return NextResponse.json({ error: "rapportId requis" }, { status: 400 });
  }

  // Source des axes : soit imbriquée (b.swot), soit à plat (b).
  const nested =
    b.swot && typeof b.swot === "object"
      ? (b.swot as Record<string, unknown>)
      : b;

  // Accepte clés FR (forces/faiblesses/opportunites/menaces) ET EN
  // (strengths/weaknesses/opportunities/threats).
  const strengths = axis(nested.forces ?? nested.strengths);
  const weaknesses = axis(nested.faiblesses ?? nested.weaknesses);
  const opportunities = axis(nested.opportunites ?? nested.opportunities);
  const threats = axis(nested.menaces ?? nested.threats);

  try {
    await prisma.swot.upsert({
      where: { rapportId },
      create: { rapportId, strengths, weaknesses, opportunities, threats },
      update: { strengths, weaknesses, opportunities, threats },
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
      forces: strengths.length,
      faiblesses: weaknesses.length,
      opportunites: opportunities.length,
      menaces: threats.length,
    },
  });
}
