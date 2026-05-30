"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@radar/database";

import { auth } from "@/lib/auth/auth";
import { triggerDeepResearch } from "@/lib/agents/deep-research";
import {
  step1EntrepriseSchema,
  step2ConcurrentSchema,
  step3AxesSchema,
  type Step1EntrepriseInput,
  type Step2ConcurrentInput,
  type Step3AxesInput,
} from "@/lib/validators/onboarding";

export type OnboardingErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "NOT_FOUND"
  | "SERVER_ERROR";

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: OnboardingErrorCode; details?: string };

async function requireUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  return session.user.id;
}

/**
 * Persiste l'étape 1 et déclenche en arrière-plan le Deep Research mock.
 * Idempotent : upsert sur ProfilUtilisateur.userId (relation 1-1).
 */
export async function saveStep1(
  input: Step1EntrepriseInput,
): Promise<ActionResult> {
  const parsed = step1EntrepriseSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "VALIDATION_ERROR",
      details: parsed.error.issues[0]?.message,
    };
  }

  const userId = await requireUserId();

  try {
    const profil = await prisma.profilUtilisateur.upsert({
      where: { userId },
      create: {
        userId,
        nomEntreprise: parsed.data.nomEntreprise,
        siteWeb: parsed.data.siteWeb,
      },
      update: {
        nomEntreprise: parsed.data.nomEntreprise,
        siteWeb: parsed.data.siteWeb,
      },
    });

    triggerDeepResearch(profil.id);

    revalidatePath("/onboarding", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "SERVER_ERROR" };
  }
}

/**
 * Ajoute un concurrent à la liste de l'utilisateur.
 * Le profil entreprise doit exister (étape 1 faite) sinon NOT_FOUND.
 */
export async function addConcurrent(
  input: Step2ConcurrentInput,
): Promise<ActionResult<{ id: string }>> {
  const parsed = step2ConcurrentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "VALIDATION_ERROR",
      details: parsed.error.issues[0]?.message,
    };
  }

  const userId = await requireUserId();

  try {
    const concurrent = await prisma.concurrent.create({
      data: {
        userId,
        nom: parsed.data.nom,
        siteWeb: parsed.data.siteWeb ?? null,
      },
    });
    revalidatePath("/onboarding/step-2");
    return { success: true, data: { id: concurrent.id } };
  } catch {
    return { success: false, error: "SERVER_ERROR" };
  }
}

/**
 * Supprime un concurrent — vérifie strictement l'ownership avant.
 */
export async function removeConcurrent(id: string): Promise<ActionResult> {
  const userId = await requireUserId();

  try {
    const target = await prisma.concurrent.findUnique({ where: { id } });
    if (!target || target.userId !== userId) {
      return { success: false, error: "NOT_FOUND" };
    }
    await prisma.concurrent.delete({ where: { id } });
    revalidatePath("/onboarding/step-2");
    return { success: true };
  } catch {
    return { success: false, error: "SERVER_ERROR" };
  }
}

/**
 * Étape 3 finale : persiste les axes choisis et marque l'onboarding terminé.
 * Doit avoir au moins 1 concurrent en base, sinon SERVER_ERROR (le client redirige avant).
 */
export async function completeOnboarding(
  input: Step3AxesInput,
): Promise<ActionResult> {
  const parsed = step3AxesSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "VALIDATION_ERROR",
      details: parsed.error.issues[0]?.message,
    };
  }

  const userId = await requireUserId();

  try {
    const concurrentsCount = await prisma.concurrent.count({
      where: { userId },
    });
    if (concurrentsCount === 0) {
      return { success: false, error: "NOT_FOUND" };
    }

    await prisma.profilUtilisateur.update({
      where: { userId },
      data: {
        axes: parsed.data.axes,
        onboardingCompleteLe: new Date(),
      },
    });

    revalidatePath("/onboarding", "layout");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "SERVER_ERROR" };
  }
}
