"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@radar/database";

import { auth } from "@/lib/auth/auth";
import {
  triggerOpenClawCycle,
  triggerOpenClawWeek,
  type WeekBatchItem,
} from "@/lib/agents/openclaw-client";

/**
 * Server Actions du dashboard — branchées sur Prisma + OpenClaw.
 *
 * - markMovement* : World "Mouvement" (feed Kanban), scoping par cycle.userId
 * - launchCycle   : World "Rapport" (contrat de l'orchestrateur OpenClaw)
 * - saveNotificationPreference : upsert NotificationPreference
 */

export type DashboardActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

async function requireUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  return session.user.id;
}

/* ── Mouvements : marquage (scoping ownership via la relation cycle) ──────── */

export async function markMovementViewed(
  id: string,
): Promise<DashboardActionResult> {
  const userId = await requireUserId();
  try {
    await prisma.mouvement.updateMany({
      where: { id, cycle: { userId } },
      data: { statut: "VIEWED", viewedAt: new Date() },
    });
  } catch (err) {
    return { success: false, error: errMsg(err) };
  }
  revalidatePath("/dashboard");
  return { success: true };
}

export async function markMovementSaved(
  id: string,
): Promise<DashboardActionResult> {
  const userId = await requireUserId();
  try {
    await prisma.mouvement.updateMany({
      where: { id, cycle: { userId } },
      data: { statut: "SAVED", savedAt: new Date() },
    });
  } catch (err) {
    return { success: false, error: errMsg(err) };
  }
  revalidatePath("/dashboard");
  return { success: true };
}

export async function markMovementIgnored(
  id: string,
): Promise<DashboardActionResult> {
  const userId = await requireUserId();
  try {
    await prisma.mouvement.updateMany({
      where: { id, cycle: { userId } },
      data: { statut: "IGNORED", ignoredAt: new Date() },
    });
  } catch (err) {
    return { success: false, error: errMsg(err) };
  }
  revalidatePath("/dashboard");
  return { success: true };
}

/* ── Lancement d'un cycle de veille OpenClaw ──────────────────────────────── */

const RATE_LIMIT_MS = 2 * 60 * 60 * 1000; // 2h entre deux lancements manuels

/**
 * Crée un Rapport par concurrent puis déclenche l'orchestrateur OpenClaw pour
 * chacun. OpenClaw travaille en arrière-plan (202-like) et POST sa progression
 * sur /api/internal/rapport/* au fur et à mesure.
 *
 * Garde-fous : profil enrichi requis, au moins 1 concurrent, anti-spam 2h.
 */
export async function launchCycle(): Promise<DashboardActionResult> {
  const userId = await requireUserId();

  const [profil, concurrents, dernierRapport, rapportsCount] =
    await Promise.all([
      prisma.profilUtilisateur.findUnique({ where: { userId } }),
      prisma.concurrent.findMany({ where: { userId } }),
      prisma.rapport.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.rapport.count({ where: { userId } }),
    ]);

  if (!profil) {
    return {
      success: false,
      error: "Profil introuvable. Terminez l'onboarding.",
    };
  }
  if (!profil.enrichissement) {
    return {
      success: false,
      error: "Profil non encore enrichi par le Deep Research.",
    };
  }
  if (concurrents.length === 0) {
    return {
      success: false,
      error: "Ajoutez au moins un concurrent avant de lancer un cycle.",
    };
  }

  // Anti-spam : un cycle lancé il y a moins de 2h bloque un nouveau lancement.
  if (
    dernierRapport &&
    Date.now() - dernierRapport.createdAt.getTime() < RATE_LIMIT_MS
  ) {
    return {
      success: false,
      error:
        "Un cycle a déjà été lancé il y a moins de 2h. Réessayez plus tard.",
    };
  }

  const premierRapport = rapportsCount === 0;

  // 1 Rapport par concurrent (« 1 cycle = 1 rapport par concurrent »), créés
  // tous EN_ATTENTE (colonne « Programmé » du Kanban).
  const items: WeekBatchItem[] = [];
  const errors: string[] = [];
  for (const concurrent of concurrents) {
    try {
      const rapport = await prisma.rapport.create({
        data: {
          userId,
          concurrentId: concurrent.id,
          statut: "EN_ATTENTE",
          etape: "En file",
          progressionPct: 0,
        },
      });
      items.push({
        rapportId: rapport.id,
        concurrentNom: concurrent.nom,
        concurrentSite: concurrent.siteWeb ?? "",
      });
    } catch (err) {
      errors.push(`${concurrent.nom} (BDD) : ${errMsg(err)}`);
    }
  }

  revalidatePath("/dashboard");

  if (items.length === 0) {
    return {
      success: false,
      error: `Aucun cycle créé. ${errors.slice(0, 2).join(" · ")}`,
    };
  }

  // Un SEUL déclenchement : l'orchestrateur traite les concurrents EN FILE.
  const res = await triggerOpenClawWeek({
    entreprise: profil.nomEntreprise,
    secteur: profil.secteur ?? "",
    premierRapport,
    items,
  });

  if (!res.ok) {
    return {
      success: false,
      error: `Veille non démarrée : ${res.error ?? "OpenClaw indisponible"}`,
    };
  }

  return {
    success: true,
    message: `Veille hebdomadaire lancée : ${items.length} concurrent${
      items.length > 1 ? "s" : ""
    } traité${items.length > 1 ? "s" : ""} l'un après l'autre.`,
  };
}

/* ── Relance / clôture d'un rapport ───────────────────────────────────────── */

/**
 * Relance un rapport (interrompu/zombie ou en échec) : réinitialise son état et
 * redéclenche l'orchestrateur sur le MÊME rapportId (callbacks idempotents → pas
 * de doublon). Pas d'anti-spam ici (relance manuelle, intentionnelle).
 */
export async function relancerRapport(
  rapportId: string,
): Promise<DashboardActionResult> {
  const userId = await requireUserId();

  const [rapport, profil] = await Promise.all([
    prisma.rapport.findFirst({
      where: { id: rapportId, userId },
      include: { concurrent: true },
    }),
    prisma.profilUtilisateur.findUnique({ where: { userId } }),
  ]);

  if (!rapport) return { success: false, error: "Rapport introuvable." };
  if (!profil) {
    return {
      success: false,
      error: "Profil introuvable. Terminez l'onboarding.",
    };
  }

  await prisma.rapport.update({
    where: { id: rapportId },
    data: {
      statut: "EN_ATTENTE",
      progressionPct: 0,
      etape: "demarrage",
      erreur: null,
      termineLe: null,
    },
  });

  const res = await triggerOpenClawCycle({
    rapportId,
    entreprise: profil.nomEntreprise,
    secteur: profil.secteur ?? "",
    concurrentNom: rapport.concurrent.nom,
    concurrentSite: rapport.concurrent.siteWeb ?? "",
    premierRapport: true,
  });

  revalidatePath("/dashboard");
  revalidatePath("/cycles");

  if (!res.ok) {
    return {
      success: false,
      error: res.error ?? "Lancement OpenClaw impossible.",
    };
  }
  return { success: true, message: "Cycle relancé." };
}

/**
 * Clôture manuellement un rapport interrompu (le marque ECHEC) sans le relancer.
 */
export async function marquerRapportEchec(
  rapportId: string,
): Promise<DashboardActionResult> {
  const userId = await requireUserId();
  try {
    await prisma.rapport.updateMany({
      where: { id: rapportId, userId },
      data: {
        statut: "ECHEC",
        erreur: "Cycle interrompu (clôturé manuellement).",
      },
    });
  } catch (err) {
    return { success: false, error: errMsg(err) };
  }
  revalidatePath("/dashboard");
  revalidatePath("/cycles");
  return { success: true };
}

/* ── Préférences de notification ──────────────────────────────────────────── */

export type NotificationPreferenceInput = {
  digestFrequency: "DAILY" | "WEEKLY" | "NEVER";
  emailDigest: string;
  criticalAlertsOnly: boolean;
};

export async function saveNotificationPreference(
  input: NotificationPreferenceInput,
): Promise<DashboardActionResult> {
  const userId = await requireUserId();
  try {
    await prisma.notificationPreference.upsert({
      where: { userId },
      create: { userId, ...input, configuredAt: new Date() },
      update: { ...input, configuredAt: new Date() },
    });
  } catch (err) {
    return { success: false, error: errMsg(err) };
  }
  revalidatePath("/dashboard");
  return { success: true };
}

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message.slice(0, 200) : String(err);
}
