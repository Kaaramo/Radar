import { NextResponse } from "next/server";

import { prisma } from "@radar/database";
import { ProfilEventSchema } from "@radar/contracts/internal";

import { assertInternalSecret } from "@/lib/agents/internal-auth";

/**
 * POST /api/internal/profil
 *
 * Callback émis par l'agent OpenClaw `deep-research` à la fin de l'onboarding.
 * Met à jour le ProfilUtilisateur en BDD avec les données extraites.
 *
 * Note : pour V1 l'onboarding utilise `apps/web/src/lib/agents/deep-research.ts`
 * (OpenAI Responses API direct, ~30s) plutôt que le path OpenClaw. Cette route
 * existe pour le path OpenClaw fallback (V2) et pour les re-enrichissements
 * déclenchés par le cron quotidien.
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

  const parsed = ProfilEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation", details: parsed.error.issues.slice(0, 5) },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    await prisma.profilUtilisateur.update({
      where: { userId: data.userId },
      data: {
        nomEntreprise: data.nomEntreprise,
        siteWeb: data.siteWeb,
        secteur: data.secteur,
        description: data.description,
        produits: data.produits,
        marches: data.marches,
        positionnement: data.positionnement,
      },
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
