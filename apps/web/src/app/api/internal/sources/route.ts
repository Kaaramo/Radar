import { NextResponse } from "next/server";

import { prisma } from "@radar/database";
import { SourcesEventSchema } from "@radar/contracts/internal";

import { assertInternalSecret } from "@/lib/agents/internal-auth";

/**
 * POST /api/internal/sources
 *
 * Callback émis par l'agent collecteur (sources brutes) puis ré-émis enrichi
 * par l'évaluateur (scores CRAAP). Sémantique REMPLACE (deleteMany +
 * createMany dans une transaction) : chaque POST redéfinit l'ensemble des
 * sources du rapport → pas de doublons, la version scorée gagne sur la brute.
 */
export async function POST(request: Request) {
  const authError = assertInternalSecret(request);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON invalide" }, { status: 400 });
  }

  const parsed = SourcesEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation", details: parsed.error.issues.slice(0, 5) },
      { status: 400 },
    );
  }

  const { rapportId, sources } = parsed.data;

  // Dédoublonnage par URL à l'intérieur du même POST.
  const seen = new Set<string>();
  const deduped = sources.filter((s) => {
    if (seen.has(s.url)) return false;
    seen.add(s.url);
    return true;
  });

  try {
    await prisma.$transaction([
      prisma.source.deleteMany({ where: { rapportId } }),
      prisma.source.createMany({
        data: deduped.map((s) => ({
          rapportId,
          url: s.url,
          titre: s.titre,
          extrait: s.extrait,
          publieeLe: safeDate(s.publieeLe),
          craapCurrency: s.craapCurrency,
          craapRelevance: s.craapRelevance,
          craapAuthority: s.craapAuthority,
          craapAccuracy: s.craapAccuracy,
          craapPurpose: s.craapPurpose,
          craapTotal: totalCraap(s),
        })),
      }),
    ]);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "DB insert", details: msg.slice(0, 200) },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, count: deduped.length });
}

/** Parse tolérante : une date d'agent non-ISO/invalide devient null (pas un 500). */
function safeDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Score CRAAP total déterministe = somme des 5 dimensions (/50). On NE fait PAS
 * confiance au `craapTotal` du LLM (souvent incohérent). On le recalcule dès que
 * les 5 dimensions sont présentes ; sinon on retombe sur la valeur fournie.
 */
function totalCraap(s: {
  craapCurrency?: number | null;
  craapRelevance?: number | null;
  craapAuthority?: number | null;
  craapAccuracy?: number | null;
  craapPurpose?: number | null;
  craapTotal?: number | null;
}): number | null {
  const dims = [
    s.craapCurrency,
    s.craapRelevance,
    s.craapAuthority,
    s.craapAccuracy,
    s.craapPurpose,
  ];
  if (dims.every((d) => typeof d === "number")) {
    return (dims as number[]).reduce((a, b) => a + b, 0);
  }
  return s.craapTotal ?? null;
}
