import { NextResponse } from "next/server";

import { prisma } from "@radar/database";
import { RapportEchecEventSchema } from "@radar/contracts/internal";

import { assertInternalSecret } from "@/lib/agents/internal-auth";

/**
 * POST /api/internal/rapport/echec
 *
 * Callback émis par l'orchestrateur en cas d'échec irrécupérable
 * (rate limit DeepSeek dépassé, timeout collecteur, etc.).
 * Marque Rapport ECHEC + persiste le message d'erreur.
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

  const parsed = RapportEchecEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation", details: parsed.error.issues.slice(0, 5) },
      { status: 400 },
    );
  }

  const { rapportId, erreur } = parsed.data;

  try {
    await prisma.rapport.update({
      where: { id: rapportId },
      data: { statut: "ECHEC", erreur, termineLe: new Date() },
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
