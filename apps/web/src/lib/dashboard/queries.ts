import "server-only";

import { prisma } from "@radar/database";

import type {
  BriefCard,
  CompetitorListItem,
  CycleAuditRow,
  CycleState,
  DashboardData,
  KanbanColumn,
  KanbanData,
  PestelVersion,
  PestelView,
  RapportCard,
  RapportDetail,
  RapportSignal,
  RapportSource,
  RapportStatut,
  ReportCard,
  ReportDetail,
  SprintSignals,
  SwotByCompetitor,
  SwotVersion,
  WeakSignal,
} from "./types";

export type {
  BriefCard,
  CompetitorListItem,
  CycleAuditRow,
  CycleState,
  DashboardData,
  KanbanColumn,
  KanbanData,
  PestelVersion,
  PestelView,
  ReportCard,
  ReportDetail,
  SprintSignals,
  SwotByCompetitor,
  SwotVersion,
} from "./types";

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

/**
 * Au-delà de ce délai sans mise à jour, un rapport `EN_COURS` est considéré
 * comme interrompu (process orchestrateur mort). Chaque étape de l'orchestrateur
 * poste sa progression, donc un écart > 20 min = anomalie.
 */
const STALE_MS = 20 * 60 * 1000;

/**
 * Statut EFFECTIF affiché : convertit un `EN_COURS` figé en `INTERROMPU`.
 * Source de vérité pour tout l'affichage (badges, compteurs, panneaux).
 */
function effectiveStatut(statut: string, updatedAt: Date): RapportStatut {
  if (statut === "EN_COURS" && Date.now() - updatedAt.getTime() > STALE_MS) {
    return "INTERROMPU";
  }
  return statut as RapportStatut;
}

/**
 * Recalcule le score CRAAP total (/50) = somme des 5 dimensions, de façon
 * déterministe quand elles sont toutes présentes. Sinon retombe sur la valeur
 * fournie (legacy) ou null.
 */
function craapScore(s: {
  craapCurrency: number | null;
  craapRelevance: number | null;
  craapAuthority: number | null;
  craapAccuracy: number | null;
  craapPurpose: number | null;
  craapTotal: number | null;
}): number | null {
  const dims = [
    s.craapCurrency,
    s.craapRelevance,
    s.craapAuthority,
    s.craapAccuracy,
    s.craapPurpose,
  ];
  if (dims.every((d) => typeof d === "number")) {
    return (dims as number[]).reduce((a, b) => a + b, 0);
  }
  return s.craapTotal;
}

const MOIS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

/** Timestamp du lundi 00h00 de la semaine d'une date (ISO, lundi = début). */
function mondayMs(d: Date): number {
  const x = new Date(d);
  const day = x.getDay(); // 0 = dimanche
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

/** Libellé de la semaine (lundi) d'une date, ex « Semaine du 26 mai ». */
function semaineLabel(d: Date): string {
  const lundi = new Date(mondayMs(d));
  return `Semaine du ${lundi.getDate()} ${MOIS[lundi.getMonth()]}`;
}

function estCetteSemaine(d: Date): boolean {
  return mondayMs(d) === mondayMs(new Date());
}

/**
 * Colonne Kanban d'un rapport. « À lire » = terminé cette semaine, « Consultés »
 * = terminé une semaine précédente (modèle basé sur la fraîcheur, sans état de
 * lecture stocké).
 */
function kanbanColumn(statut: RapportStatut, createdAt: Date): KanbanColumn {
  if (statut === "EN_ATTENTE") return "PROGRAMME";
  if (statut === "TERMINE") {
    return estCetteSemaine(createdAt) ? "A_LIRE" : "CONSULTES";
  }
  // EN_COURS / INTERROMPU / ECHEC → travail en cours (ou à reprendre)
  return "EN_ANALYSE";
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
    statut: effectiveStatut(r.statut, r.updatedAt),
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

  // Compteurs basés sur le statut EFFECTIF (un zombie n'est plus « en cours »).
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
    craapTotal: craapScore(s),
    craapCurrency: s.craapCurrency,
    craapRelevance: s.craapRelevance,
    craapAuthority: s.craapAuthority,
    craapAccuracy: s.craapAccuracy,
    craapPurpose: s.craapPurpose,
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
    statut: effectiveStatut(r.statut, r.updatedAt),
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

/* ── Brief Kanban (page principale) ───────────────────────────────────────── */

export async function getKanbanData(userId: string): Promise<KanbanData> {
  const [competitorCount, rapports] = await Promise.all([
    prisma.concurrent.count({ where: { userId } }),
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

  const columns: Record<KanbanColumn, BriefCard[]> = {
    PROGRAMME: [],
    EN_ANALYSE: [],
    A_LIRE: [],
    CONSULTES: [],
  };
  let signalCount = 0;

  for (const r of rapports) {
    const statut = effectiveStatut(r.statut, r.updatedAt);
    const column = kanbanColumn(statut, r.createdAt);
    signalCount += r._count.signaux;
    const card: BriefCard = {
      id: r.id,
      concurrentId: r.concurrentId,
      concurrentNom: r.concurrent.nom,
      concurrentSecteur: r.concurrent.secteur,
      statut,
      progressionPct: r.progressionPct,
      etape: r.etape,
      synthese: r.synthese,
      sourceCount: r._count.sources,
      hasSwot: r.swot !== null,
      hasPestel: r.pestel !== null,
      signalCount: r._count.signaux,
      createdAt: relTime(r.createdAt),
      termineLe: fmtDate(r.termineLe),
      column,
      semaine: semaineLabel(r.createdAt),
      lu: column === "CONSULTES",
    };
    columns[column].push(card);
  }

  return {
    competitorCount,
    columns,
    signalCount,
    hasAnyRapport: rapports.length > 0,
  };
}

/* ── Rail concurrents (commun aux pages lens) ─────────────────────────────── */

export async function getCompetitorList(
  userId: string,
): Promise<CompetitorListItem[]> {
  const concurrents = await prisma.concurrent.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      rapports: {
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { signaux: true } },
          swot: { select: { id: true } },
          pestel: { select: { id: true } },
        },
      },
    },
  });

  return concurrents.map((c) => {
    const signalCount = c.rapports.reduce(
      (sum, r) => sum + r._count.signaux,
      0,
    );
    const dernier = c.rapports[0];
    return {
      id: c.id,
      nom: c.nom,
      secteur: c.secteur,
      rapportCount: c.rapports.length,
      signalCount,
      hasSwot: c.rapports.some((r) => r.swot !== null),
      hasPestel: c.rapports.some((r) => r.pestel !== null),
      dernierCycle: dernier ? relTime(dernier.createdAt) : null,
    };
  });
}

/* ── Versions SWOT / PESTEL d'un concurrent (par semaine) ──────────────────── */

export async function getSwotVersions(
  concurrentId: string,
  userId: string,
): Promise<SwotVersion[]> {
  const rapports = await prisma.rapport.findMany({
    where: { concurrentId, userId, swot: { isNot: null } },
    orderBy: { createdAt: "desc" },
    include: { swot: true },
  });
  return rapports.flatMap((r) =>
    r.swot
      ? [
          {
            rapportId: r.id,
            semaine: semaineLabel(r.createdAt),
            genereLe: fmtDate(r.createdAt) ?? "",
            swot: {
              strengths: r.swot.strengths,
              weaknesses: r.swot.weaknesses,
              opportunities: r.swot.opportunities,
              threats: r.swot.threats,
            },
          },
        ]
      : [],
  );
}

export async function getPestelVersions(
  concurrentId: string,
  userId: string,
): Promise<PestelVersion[]> {
  const rapports = await prisma.rapport.findMany({
    where: { concurrentId, userId, pestel: { isNot: null } },
    orderBy: { createdAt: "desc" },
    include: { pestel: true },
  });
  return rapports.flatMap((r) =>
    r.pestel
      ? [
          {
            rapportId: r.id,
            semaine: semaineLabel(r.createdAt),
            genereLe: fmtDate(r.createdAt) ?? "",
            pestel: {
              political: r.pestel.political,
              economic: r.pestel.economic,
              social: r.pestel.social,
              technological: r.pestel.technological,
              environmental: r.pestel.environmental,
              legal: r.pestel.legal,
            },
          },
        ]
      : [],
  );
}

/* ── Signaux faibles d'un concurrent ──────────────────────────────────────── */

export async function getCompetitorSignals(
  concurrentId: string,
  userId: string,
): Promise<WeakSignal[]> {
  const signaux = await prisma.signalFaible.findMany({
    where: { rapport: { concurrentId, userId } },
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

/**
 * Signaux faibles d'un concurrent regroupés par sprint de veille (semaine),
 * sprint le plus récent en premier, et par temps dans chaque sprint.
 */
export async function getCompetitorSignalsBySprint(
  concurrentId: string,
  userId: string,
): Promise<SprintSignals[]> {
  const rapports = await prisma.rapport.findMany({
    where: { concurrentId, userId, signaux: { some: {} } },
    orderBy: { createdAt: "desc" },
    include: {
      concurrent: { select: { nom: true } },
      signaux: { orderBy: { detecteLe: "desc" } },
    },
  });

  return rapports.map((r) => ({
    rapportId: r.id,
    semaine: semaineLabel(r.createdAt),
    date: fmtDate(r.createdAt) ?? "",
    signaux: r.signaux.map((s) => ({
      id: s.id,
      intitule: s.intitule,
      description: s.description,
      scorePertinence: s.scorePertinence,
      concurrentNom: r.concurrent.nom,
      detecteLe: fmtDate(s.detecteLe) ?? "",
    })),
  }));
}

/* ── Page /swot : dernière matrice SWOT par concurrent ────────────────────── */

export async function getSwotByCompetitor(
  userId: string,
): Promise<SwotByCompetitor[]> {
  const rapports = await prisma.rapport.findMany({
    where: { userId, swot: { isNot: null } },
    orderBy: { createdAt: "desc" },
    include: {
      concurrent: { select: { id: true, nom: true, secteur: true } },
      swot: true,
    },
  });

  // Dernier SWOT par concurrent (rapports triés desc).
  const seen = new Set<string>();
  const out: SwotByCompetitor[] = [];
  for (const r of rapports) {
    if (!r.swot || seen.has(r.concurrentId)) continue;
    seen.add(r.concurrentId);
    out.push({
      rapportId: r.id,
      concurrentId: r.concurrentId,
      concurrentNom: r.concurrent.nom,
      concurrentSecteur: r.concurrent.secteur,
      genereLe: fmtDate(r.swot.createdAt) ?? relTime(r.createdAt),
      swot: {
        strengths: r.swot.strengths,
        weaknesses: r.swot.weaknesses,
        opportunities: r.swot.opportunities,
        threats: r.swot.threats,
      },
    });
  }
  return out;
}

/* ── Page /pestel : dernières analyses PESTEL disponibles ─────────────────── */

export async function getPestelViews(userId: string): Promise<PestelView[]> {
  const rapports = await prisma.rapport.findMany({
    where: { userId, pestel: { isNot: null } },
    orderBy: { createdAt: "desc" },
    include: {
      concurrent: { select: { nom: true } },
      pestel: true,
    },
  });

  // Dernier PESTEL par concurrent.
  const seen = new Set<string>();
  const out: PestelView[] = [];
  for (const r of rapports) {
    if (!r.pestel || seen.has(r.concurrentId)) continue;
    seen.add(r.concurrentId);
    out.push({
      rapportId: r.id,
      concurrentNom: r.concurrent.nom,
      genereLe: fmtDate(r.pestel.createdAt) ?? relTime(r.createdAt),
      pestel: {
        political: r.pestel.political,
        economic: r.pestel.economic,
        social: r.pestel.social,
        technological: r.pestel.technological,
        environmental: r.pestel.environmental,
        legal: r.pestel.legal,
      },
    });
  }
  return out;
}

/* ── Page /cycles : audit trail complet ───────────────────────────────────── */

function dureeLisible(start: Date, end: Date | null): string | null {
  if (!end) return null;
  const ms = end.getTime() - start.getTime();
  if (ms < 0) return null;
  const min = Math.round(ms / 60000);
  if (min < 1) return "< 1 min";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  return `${h} h ${min % 60} min`;
}

export async function getCyclesAuditTrail(
  userId: string,
): Promise<CycleAuditRow[]> {
  const rapports = await prisma.rapport.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      concurrent: { select: { nom: true } },
      _count: { select: { sources: true, signaux: true } },
      swot: { select: { id: true } },
      pestel: { select: { id: true } },
      sources: {
        select: {
          craapCurrency: true,
          craapRelevance: true,
          craapAuthority: true,
          craapAccuracy: true,
          craapPurpose: true,
          craapTotal: true,
        },
      },
    },
  });

  return rapports.map((r) => {
    const scores = r.sources
      .map((s) => craapScore(s))
      .filter((n): n is number => typeof n === "number");
    const craapMoyen =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : null;

    return {
      rapportId: r.id,
      concurrentNom: r.concurrent.nom,
      statut: effectiveStatut(r.statut, r.updatedAt),
      progressionPct: r.progressionPct,
      etape: r.etape,
      sourceCount: r._count.sources,
      signalCount: r._count.signaux,
      hasSwot: r.swot !== null,
      hasPestel: r.pestel !== null,
      craapMoyen,
      semaine: semaineLabel(r.createdAt),
      lanceLe: fmtDate(r.createdAt) ?? "",
      termineLe: fmtDate(r.termineLe),
      duree: dureeLisible(r.createdAt, r.termineLe),
      hasReport: !!(r.synthese && r.synthese.trim().length > 20),
    };
  });
}

/* ── Rapports Markdown (page /reports) ────────────────────────────────────── */

/** Extrait texte brut d'un markdown (titres/puces/emphasen retirés). */
function extraitMarkdown(md: string, max = 160): string {
  const txt = md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`>-]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return txt.length > max ? txt.slice(0, max).trimEnd() + "…" : txt;
}

export async function getReportsList(userId: string): Promise<ReportCard[]> {
  const rapports = await prisma.rapport.findMany({
    where: { userId, statut: "TERMINE", synthese: { not: null } },
    orderBy: [{ termineLe: "desc" }, { createdAt: "desc" }],
    include: {
      concurrent: { select: { id: true, nom: true } },
      _count: { select: { sources: true, signaux: true } },
      swot: { select: { id: true } },
      pestel: { select: { id: true } },
    },
  });

  return rapports
    .filter((r) => (r.synthese ?? "").trim().length > 20)
    .map((r) => ({
      rapportId: r.id,
      concurrentId: r.concurrentId,
      concurrentNom: r.concurrent.nom,
      semaine: semaineLabel(r.createdAt),
      genereLe: fmtDate(r.termineLe ?? r.createdAt) ?? "",
      extrait: extraitMarkdown(r.synthese ?? ""),
      sourceCount: r._count.sources,
      signalCount: r._count.signaux,
      hasSwot: r.swot !== null,
      hasPestel: r.pestel !== null,
    }));
}

export async function getReport(
  rapportId: string,
  userId: string,
): Promise<ReportDetail | null> {
  const r = await prisma.rapport.findFirst({
    where: { id: rapportId, userId },
    include: {
      concurrent: { select: { id: true, nom: true, secteur: true } },
      _count: { select: { sources: true, signaux: true } },
      swot: { select: { id: true } },
      pestel: { select: { id: true } },
    },
  });
  if (!r || !r.synthese || r.synthese.trim().length === 0) return null;

  return {
    rapportId: r.id,
    concurrentId: r.concurrentId,
    concurrentNom: r.concurrent.nom,
    concurrentSecteur: r.concurrent.secteur,
    semaine: semaineLabel(r.createdAt),
    genereLe: fmtDate(r.termineLe ?? r.createdAt) ?? "",
    synthese: r.synthese,
    sourceCount: r._count.sources,
    signalCount: r._count.signaux,
    hasSwot: r.swot !== null,
    hasPestel: r.pestel !== null,
  };
}
