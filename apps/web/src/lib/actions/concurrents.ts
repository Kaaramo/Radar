"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@radar/database";

import { auth } from "@/lib/auth/auth";
import { optionalUrlSchema } from "@/lib/validators/onboarding";

/**
 * Gestion des concurrents depuis le hub /competitors (hors onboarding).
 *
 * Toutes les mutations revalident les pages liées (/competitors, /dashboard,
 * /settings) pour que l'UI server-rendered se mette à jour immédiatement.
 */

const concurrentInputSchema = z.object({
  nom: z
    .string({ required_error: "Nom du concurrent requis" })
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(120, "Le nom ne peut pas dépasser 120 caractères"),
  siteWeb: optionalUrlSchema,
  secteur: z
    .string()
    .max(120, "Secteur trop long")
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : null)),
});

export type ConcurrentInput = {
  nom: string;
  siteWeb?: string;
  secteur?: string;
};

export type ConcurrentActionResult =
  | { success: true }
  | { success: false; error: string };

async function requireUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  return session.user.id;
}

function revalidateLinkedPages(): void {
  revalidatePath("/competitors");
  revalidatePath("/dashboard");
  revalidatePath("/settings");
}

export async function createConcurrent(
  input: ConcurrentInput,
): Promise<ConcurrentActionResult> {
  const parsed = concurrentInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides",
    };
  }

  const userId = await requireUserId();

  try {
    await prisma.concurrent.create({
      data: {
        userId,
        nom: parsed.data.nom,
        siteWeb: parsed.data.siteWeb ?? null,
        secteur: parsed.data.secteur,
      },
    });
  } catch {
    return { success: false, error: "Erreur lors de l'ajout du concurrent." };
  }

  revalidateLinkedPages();
  return { success: true };
}

export async function updateConcurrent(
  id: string,
  input: ConcurrentInput,
): Promise<ConcurrentActionResult> {
  const parsed = concurrentInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides",
    };
  }

  const userId = await requireUserId();

  try {
    // updateMany + filtre userId = garantie d'ownership sans throw si absent.
    const res = await prisma.concurrent.updateMany({
      where: { id, userId },
      data: {
        nom: parsed.data.nom,
        siteWeb: parsed.data.siteWeb ?? null,
        secteur: parsed.data.secteur,
      },
    });
    if (res.count === 0) {
      return { success: false, error: "Concurrent introuvable." };
    }
  } catch {
    return { success: false, error: "Erreur lors de la mise à jour." };
  }

  revalidateLinkedPages();
  return { success: true };
}

export async function deleteConcurrent(
  id: string,
): Promise<ConcurrentActionResult> {
  const userId = await requireUserId();

  try {
    const res = await prisma.concurrent.deleteMany({ where: { id, userId } });
    if (res.count === 0) {
      return { success: false, error: "Concurrent introuvable." };
    }
  } catch {
    return { success: false, error: "Erreur lors de la suppression." };
  }

  revalidateLinkedPages();
  return { success: true };
}
