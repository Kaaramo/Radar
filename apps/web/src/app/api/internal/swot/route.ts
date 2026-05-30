import { NextResponse } from "next/server";

import { prisma } from "@radar/database";
import { SwotEventSchema } from "@radar/contracts/internal";

import { assertInternalSecret } from "@/lib/agents/internal-auth";

/**
 * POST /api/internal/swot
 *
 * Callback émis par l'agent analyste-swot après analyse contextualisée
 * (profil utilisateur + sources collectées). Upsert : 1 Swot par Rapport.
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

  const parsed = SwotEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation", details: parsed.error.issues.slice(0, 5) },
      { status: 400 },
    );
  }

  const { rapportId, strengths, weaknesses, opportunities, threats } =
    parsed.data;

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

  return NextResponse.json({ ok: true });
}
