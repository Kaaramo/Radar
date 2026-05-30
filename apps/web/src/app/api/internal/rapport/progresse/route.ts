import { NextResponse } from "next/server";

import { prisma } from "@radar/database";
import { RapportProgresseEventSchema } from "@radar/contracts/internal";

import { assertInternalSecret } from "@/lib/agents/internal-auth";

/**
 * POST /api/internal/rapport/progresse
 *
 * Callback émis par chaque sous-agent OpenClaw à chaque étape du cycle.
 * Met à jour Rapport.statut + progressionPct + etape (consommés par
 * le dashboard pour afficher la progression en live).
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

  const parsed = RapportProgresseEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation", details: parsed.error.issues.slice(0, 5) },
      { status: 400 },
    );
  }

  const { rapportId, statut, progressionPct, etape } = parsed.data;

  try {
    await prisma.rapport.update({
      where: { id: rapportId },
      data: { statut, progressionPct, etape },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "DB update", details: msg.slice(0, 200) },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
