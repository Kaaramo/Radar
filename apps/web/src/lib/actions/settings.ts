"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@radar/database";

import { triggerDeepResearch } from "@/lib/agents/deep-research";
import { auth } from "@/lib/auth/auth";
import { AXES_KEYS, type AxeKey } from "@/lib/onboarding/axes";

/**
 * Relance le deep research pour le user courant.
 *
 * Fire-and-forget : `triggerDeepResearch` enchaîne sur un verrou DB atomique
 * (cf. `acquireLock` dans deep-research.ts). Pas besoin de double anti-spam ici :
 * si déjà IN_PROGRESS < 5 min, l'agent skip de lui-même.
 */
export async function relaunchDeepResearch(): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }

  const profil = await prisma.profilUtilisateur.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!profil) return;

  triggerDeepResearch(profil.id);
  redirect("/settings?section=deep-research&relaunched=1");
}

/**
 * Polling-friendly : statut courant + erreur éventuelle.
 * Retourne juste les champs nécessaires (pas le payload complet).
 */
export async function getEnrichissementStatus(): Promise<{
  statut: "IDLE" | "IN_PROGRESS" | "SUCCESS" | "FAILED";
  erreur: string | null;
  enrichissementLe: string | null;
} | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const profil = await prisma.profilUtilisateur.findUnique({
    where: { userId: session.user.id },
    select: {
      enrichissementStatut: true,
      enrichissementErreur: true,
      enrichissementLe: true,
    },
  });

  if (!profil) return null;

  return {
    statut: profil.enrichissementStatut,
    erreur: profil.enrichissementErreur,
    enrichissementLe: profil.enrichissementLe?.toISOString() ?? null,
  };
}

/**
 * Met à jour les axes de surveillance du profil courant.
 *
 * Appelé en temps réel depuis `AxesSection` (toggle Apple-style) avec optimistic
 * update côté client. La validation Zod côté serveur reste l'autorité finale :
 * si un payload invalide arrive (clé inconnue, > AXES_KEYS.length, etc.) on
 * renvoie une erreur structurée et le client rollback.
 *
 * Pas de min(1) ici (vs onboarding step-3) : l'utilisateur peut désactiver tous
 * ses axes depuis settings — cas extrême mais légitime.
 */
const updateAxesSchema = z.object({
  axes: z.array(z.enum(AXES_KEYS)).max(AXES_KEYS.length),
});

export type UpdateAxesResult =
  | { success: true; axes: AxeKey[] }
  | { success: false; error: "UNAUTHENTICATED" | "NOT_FOUND" | "VALIDATION" };

export async function updateAxes(input: {
  axes: string[];
}): Promise<UpdateAxesResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: "UNAUTHENTICATED" };

  const parsed = updateAxesSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "VALIDATION" };

  // Dédoublonnage défensif (le client ne devrait pas envoyer de doublons mais on
  // ne fait pas confiance aveuglément aux inputs).
  const uniqueAxes = Array.from(new Set(parsed.data.axes));

  const result = await prisma.profilUtilisateur.updateMany({
    where: { userId: session.user.id },
    data: { axes: uniqueAxes },
  });

  if (result.count === 0) return { success: false, error: "NOT_FOUND" };

  // Revalider settings + dashboard (la sidebar et le brief utilisent les axes)
  revalidatePath("/settings");
  revalidatePath("/dashboard");

  return { success: true, axes: uniqueAxes };
}
