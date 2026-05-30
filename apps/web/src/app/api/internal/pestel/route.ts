import { NextResponse } from "next/server";

import { prisma } from "@radar/database";
import { PestelEventSchema } from "@radar/contracts/internal";

import { assertInternalSecret } from "@/lib/agents/internal-auth";

/**
 * POST /api/internal/pestel
 *
 * Callback émis par l'agent analyste-pestel (hebdomadaire en V2).
 * Upsert : 1 Pestel par Rapport.
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

  const parsed = PestelEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation", details: parsed.error.issues.slice(0, 5) },
      { status: 400 },
    );
  }

  const {
    rapportId,
    political,
    economic,
    social,
    technological,
    environmental,
    legal,
  } = parsed.data;

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

  return NextResponse.json({ ok: true });
}
