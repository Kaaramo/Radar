import { NextResponse } from "next/server";

import { prisma } from "@radar/database";
import { SignauxEventSchema } from "@radar/contracts/internal";

import { assertInternalSecret } from "@/lib/agents/internal-auth";

/**
 * POST /api/internal/signaux
 *
 * Callback émis par l'agent détecteur-signaux-faibles après croisement
 * multi-sources sur fenêtre glissante 30j. createMany — chaque signal
 * détecté devient une ligne SignalFaible liée au Rapport courant.
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

  const parsed = SignauxEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation", details: parsed.error.issues.slice(0, 5) },
      { status: 400 },
    );
  }

  const { rapportId, signaux } = parsed.data;

  try {
    await prisma.signalFaible.createMany({
      data: signaux.map((s) => ({
        rapportId,
        intitule: s.intitule,
        description: s.description,
        scorePertinence: s.scorePertinence,
      })),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "DB insert", details: msg.slice(0, 200) },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, count: signaux.length });
}
