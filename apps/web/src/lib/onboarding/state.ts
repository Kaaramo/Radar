import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@radar/database";
import type { Concurrent, ProfilUtilisateur } from "@radar/database";

import { auth } from "@/lib/auth/auth";

export type OnboardingNextStep =
  | "step-1"
  | "step-2"
  | "step-3"
  | "success"
  | "done";

/**
 * Concurrent suggéré par le Deep Research, prêt à être ajouté en 1 clic.
 * Toujours dédupliqué contre les concurrents déjà ajoutés par le user.
 */
export type ConcurrentSuggestion = {
  nom: string;
  siteWeb: string | null;
  raison: string;
};

/**
 * Extrait les concurrents suggérés du payload Deep Research (status: "structured"
 * seulement). Dédupliqué contre `existingNames` (lowercase trim). Retourne []
 * si l'enrichment est null, en cours, FAILED, ou en raw-fallback.
 */
export function extractConcurrentSuggestions(
  enrichissement: unknown,
  existingNames: ReadonlySet<string>,
): ConcurrentSuggestion[] {
  if (!enrichissement || typeof enrichissement !== "object") return [];
  const e = enrichissement as Record<string, unknown>;
  if (e.status !== "structured") return [];
  const raw = e.concurrentsSuggeres;
  if (!Array.isArray(raw)) return [];

  const out: ConcurrentSuggestion[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const o = item as Record<string, unknown>;
    const nom = typeof o.nom === "string" ? o.nom.trim() : "";
    if (!nom) continue;
    const key = nom.toLowerCase();
    if (existingNames.has(key)) continue;
    out.push({
      nom,
      siteWeb: typeof o.siteWeb === "string" ? o.siteWeb : null,
      raison: typeof o.raison === "string" ? o.raison : "",
    });
  }
  return out;
}

export type OnboardingState = {
  userId: string;
  userName: string;
  userEmail: string;
  profil: ProfilUtilisateur | null;
  concurrents: Concurrent[];
  concurrentsCount: number;
  isComplete: boolean;
  nextStep: OnboardingNextStep;
};

/**
 * Helper Server Component : retourne l'état complet de l'onboarding pour
 * un utilisateur connecté. Redirige vers /login si pas de session.
 */
export async function getOnboardingState(): Promise<OnboardingState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const userId = session.user.id;

  const [profil, concurrents] = await Promise.all([
    prisma.profilUtilisateur.findUnique({ where: { userId } }),
    prisma.concurrent.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const concurrentsCount = concurrents.length;
  const isComplete = !!profil?.onboardingCompleteLe;

  let nextStep: OnboardingNextStep;
  if (isComplete) nextStep = "done";
  else if (!profil) nextStep = "step-1";
  else if (concurrentsCount === 0) nextStep = "step-2";
  else if (!profil.axes || profil.axes.length === 0) nextStep = "step-3";
  else nextStep = "success";

  return {
    userId,
    userName: session.user.name,
    userEmail: session.user.email,
    profil,
    concurrents,
    concurrentsCount,
    isComplete,
    nextStep,
  };
}
