import "server-only";

import { prisma } from "@radar/database";

import type {
  CycleState,
  DashboardData,
  RapportCard,
  RapportDetail,
  RapportSignal,
  RapportSource,
  RapportStatut,
  WeakSignal,
} from "./types";

export type { CycleState, DashboardData } from "./types";

/**
 * Couche d'accès aux données du dashboard — monde « Rapport ».
 *
 * Source de vérité : ce qu'OpenClaw produit via /api/internal/* (Rapport +
 * Source + Swot + Pestel + SignalFaible). 100% Prisma, zéro mock.
 */

/* ── Helpers de formatage ─────────────────────────────────────────────────── */

function domainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0] ?? url;
  }
}

function relTime(d: Date): string {
  const diffMs = Date.now() - d.getTime();
  const h = Math.floor(diffMs / 3_600_000);
  if (h < 1) return "à l'instant";
  if (h < 24) return `il y a ${h}h`;
  const j = Math.floor(h / 24);
  return `il y a ${j}j`;
}

function fmtDate(d: Date | null): string | null {
  if (!d) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/* ── Feed principal : dernier rapport par concurrent ──────────────────────── */

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const [concurrents, rapports] = await Promise.all([
    prisma.concurrent.findMany({ where: { userId } }),
    prisma.rapport.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        concurrent: { select: { id: true, nom: true, secteur: true } },
        _count: { select: { sources: true, signaux: true } },
        swot: { select: { id: true } },
        pestel: { select: { id: true } },
      },
    }),
  ]);

  // Dernier rapport par concurrent (rapports déjà triés desc).
  const latestByConcurrent = new Map<string, (typeof rapports)[number]>();
  for (const r of rapports) {
    if (!latestByConcurrent.has(r.concurrentId)) {
      latestByConcurrent.set(r.concurrentId, r);
    }
  }

  const cards: RapportCard[] = [...latestByConcurrent.values()].map((r) => ({
    id: r.id,
    concurrentId: r.concurrentId,
    concurrentNom: r.concurrent.nom,
    concurrentSecteur: r.concurrent.secteur,
    statut: r.statut as RapportStatut,
    progressionPct: r.progressionPct,
    etape: r.etape,
    synthese: r.synthese,
    sourceCount: r._count.sources,
    hasSwot: r.swot !== null,
    hasPestel: r.pestel !== null,
    signalCount: r._count.signaux,
    createdAt: relTime(r.createdAt),
    termineLe: fmtDate(r.termineLe),
  }));

  const runningCount = cards.filter(
    (c) => c.statut === "EN_COURS" || c.statut === "EN_ATTENTE",
  ).length;
  const rapportCount = cards.filter((c) => c.statut === "TERMINE").length;
  const signalCount = cards.reduce((sum, c) => sum + c.signalCount, 0);

  const cycleState: CycleState =
    runningCount > 0 ? "running" : rapportCount > 0 ? "completed" : "idle";

  return {
    cycleState,
    competitorCount: concurrents.length,
    rapportCount,
    runningCount,
    signalCount,
    rapports: cards,
  };
}

/* ── Détail d'un rapport (panneau de droite) ──────────────────────────────── */

export async function getRapportDetail(
  rapportId: string,
  userId: string,
): Promise<RapportDetail | null> {
  const r = await prisma.rapport.findFirst({
    where: { id: rapportId, userId },
    include: {
      concurrent: { select: { id: true, nom: true, secteur: true } },
      sources: { orderBy: { collecteeLe: "desc" } },
      swot: true,
      pestel: true,
      signaux: { orderBy: { detecteLe: "desc" } },
      _count: { select: { sources: true, signaux: true } },
    },
  });
  if (!r) return null;

  const sources: RapportSource[] = r.sources.map((s) => ({
    id: s.id,
    url: s.url,
    domain: domainFromUrl(s.url),
    titre: s.titre,
    craapTotal: s.craapTotal,
    publieeLe: fmtDate(s.publieeLe),
  }));

  const signaux: RapportSignal[] = r.signaux.map((s) => ({
    id: s.id,
    intitule: s.intitule,
    description: s.description,
    scorePertinence: s.scorePertinence,
  }));

  return {
    id: r.id,
    concurrentId: r.concurrentId,
    concurrentNom: r.concurrent.nom,
    concurrentSecteur: r.concurrent.secteur,
    statut: r.statut as RapportStatut,
    progressionPct: r.progressionPct,
    etape: r.etape,
    synthese: r.synthese,
    sourceCount: r._count.sources,
    hasSwot: r.swot !== null,
    hasPestel: r.pestel !== null,
    signalCount: r._count.signaux,
    createdAt: relTime(r.createdAt),
    termineLe: fmtDate(r.termineLe),
    sources,
    swot: r.swot
      ? {
          strengths: r.swot.strengths,
          weaknesses: r.swot.weaknesses,
          opportunities: r.swot.opportunities,
          threats: r.swot.threats,
        }
      : null,
    pestel: r.pestel
      ? {
          political: r.pestel.political,
          economic: r.pestel.economic,
          social: r.pestel.social,
          technological: r.pestel.technological,
          environmental: r.pestel.environmental,
          legal: r.pestel.legal,
        }
      : null,
    signaux,
  };
}

/* ── Signaux faibles (page dédiée) : agrégés sur tous les rapports du user ─── */

export async function getWeakSignals(userId: string): Promise<WeakSignal[]> {
  const signaux = await prisma.signalFaible.findMany({
    where: { rapport: { userId } },
    orderBy: { detecteLe: "desc" },
    include: {
      rapport: { include: { concurrent: { select: { nom: true } } } },
    },
  });

  return signaux.map((s) => ({
    id: s.id,
    intitule: s.intitule,
    description: s.description,
    scorePertinence: s.scorePertinence,
    concurrentNom: s.rapport.concurrent.nom,
    detecteLe: fmtDate(s.detecteLe) ?? "",
  }));
}

/* ── Concurrents ──────────────────────────────────────────────────────────── */

export async function getCompetitor(id: string, userId: string) {
  return prisma.concurrent.findFirst({ where: { id, userId } });
}

/**
 * Détail du dernier rapport pour un concurrent donné (page concurrent).
 */
export async function getCompetitorLatestRapport(
  concurrentId: string,
  userId: string,
): Promise<RapportDetail | null> {
  const r = await prisma.rapport.findFirst({
    where: { concurrentId, userId },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });
  if (!r) return null;
  return getRapportDetail(r.id, userId);
}
