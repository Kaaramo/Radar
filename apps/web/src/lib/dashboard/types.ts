/**
 * Types vue du dashboard — monde « Rapport » (ce qu'OpenClaw produit réellement).
 *
 * Un cycle de veille crée 1 Rapport par concurrent. Chaque Rapport porte sa
 * progression, sa synthèse, ses sources (avec CRAAP), son SWOT, son PESTEL et
 * ses signaux faibles. Ces types vue sont mappés depuis Prisma dans `queries.ts`
 * (les composants ne connaissent jamais Prisma directement).
 */

export type CycleState = "idle" | "running" | "completed";

/** Axe de surveillance (miroir de l'enum Prisma `Axe`). */
export type Axe = "RH" | "STRATEGIE" | "TECH" | "DIGITAL" | "REGLEMENTAIRE";

/**
 * Statut Prisma brut (enum `StatutRapport`).
 */
export type RapportStatutDb = "EN_ATTENTE" | "EN_COURS" | "TERMINE" | "ECHEC";

/**
 * Statut effectif affiché à l'utilisateur. `INTERROMPU` est un statut DÉRIVÉ
 * (jamais stocké en DB) : un rapport resté `EN_COURS` sans aucune mise à jour
 * depuis trop longtemps (process orchestrateur mort) est considéré comme
 * interrompu, pour ne plus afficher « en cours » à tort.
 */
export type RapportStatut = RapportStatutDb | "INTERROMPU";

/** Source collectée, grille CRAAP M244 (5 dimensions /10, total /50). */
export type RapportSource = {
  id: string;
  url: string;
  domain: string;
  titre: string | null;
  /** Somme des 5 dimensions, sur 50. */
  craapTotal: number | null;
  craapCurrency: number | null;
  craapRelevance: number | null;
  craapAuthority: number | null;
  craapAccuracy: number | null;
  craapPurpose: number | null;
  publieeLe: string | null;
};

export type RapportSwot = {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
} | null;

export type RapportPestel = {
  political: string[];
  economic: string[];
  social: string[];
  technological: string[];
  environmental: string[];
  legal: string[];
} | null;

export type RapportSignal = {
  id: string;
  intitule: string;
  description: string | null;
  scorePertinence: number | null;
};

/** Carte rapport pour le feed (vue condensée, 1 par concurrent). */
export type RapportCard = {
  id: string;
  concurrentId: string;
  concurrentNom: string;
  concurrentSecteur: string | null;
  statut: RapportStatut;
  progressionPct: number;
  etape: string | null;
  synthese: string | null;
  sourceCount: number;
  hasSwot: boolean;
  hasPestel: boolean;
  signalCount: number;
  createdAt: string;
  termineLe: string | null;
};

/** Détail complet d'un rapport (panneau de droite). */
export type RapportDetail = RapportCard & {
  sources: RapportSource[];
  swot: RapportSwot;
  pestel: RapportPestel;
  signaux: RapportSignal[];
};

/** Signal faible agrégé (page Signaux faibles). */
export type WeakSignal = {
  id: string;
  intitule: string;
  description: string | null;
  scorePertinence: number | null;
  concurrentNom: string;
  detecteLe: string;
};

export type DashboardData = {
  cycleState: CycleState;
  competitorCount: number;
  /** Rapports terminés */
  rapportCount: number;
  /** Rapports en cours */
  runningCount: number;
  /** Total signaux faibles détectés */
  signalCount: number;
  /** Dernier rapport par concurrent */
  rapports: RapportCard[];
};

/* ── Vues des pages dédiées (SWOT / PESTEL / Cycles) ──────────────────────── */

/** Dernière matrice SWOT disponible pour un concurrent (page /swot). */
export type SwotByCompetitor = {
  rapportId: string;
  concurrentId: string;
  concurrentNom: string;
  concurrentSecteur: string | null;
  genereLe: string;
  swot: NonNullable<RapportSwot>;
};

/** Dernière analyse PESTEL disponible (page /pestel). */
export type PestelView = {
  rapportId: string;
  concurrentNom: string;
  genereLe: string;
  pestel: NonNullable<RapportPestel>;
};

/** Ligne d'audit trail d'un cycle (page /cycles). */
export type CycleAuditRow = {
  rapportId: string;
  concurrentNom: string;
  statut: RapportStatut;
  progressionPct: number;
  etape: string | null;
  sourceCount: number;
  signalCount: number;
  hasSwot: boolean;
  hasPestel: boolean;
  /** Score CRAAP moyen des sources (/50), null si aucune source scorée. */
  craapMoyen: number | null;
  /** Libellé de la semaine du cycle (sprint). */
  semaine: string;
  lanceLe: string;
  termineLe: string | null;
  /** Durée lisible (ex « 4 min »), null si non terminé. */
  duree: string | null;
  /** Un rapport Markdown lisible existe (terminé + synthèse non vide). */
  hasReport: boolean;
};

/* ── Rapports Markdown (page /reports) ────────────────────────────────────── */

/** Carte rapport pour la bibliothèque (page /reports). */
export type ReportCard = {
  rapportId: string;
  concurrentId: string;
  concurrentNom: string;
  semaine: string;
  genereLe: string;
  /** Extrait de la synthèse (texte brut, ~160 c). */
  extrait: string;
  sourceCount: number;
  signalCount: number;
  hasSwot: boolean;
  hasPestel: boolean;
};

/** Rapport complet ouvert en lecture (page /reports/[id]). */
export type ReportDetail = {
  rapportId: string;
  concurrentId: string;
  concurrentNom: string;
  concurrentSecteur: string | null;
  semaine: string;
  genereLe: string;
  /** Markdown brut de la synthèse rédacteur. */
  synthese: string;
  sourceCount: number;
  signalCount: number;
  hasSwot: boolean;
  hasPestel: boolean;
};

/** Signaux faibles d'un concurrent regroupés par sprint de veille (semaine). */
export type SprintSignals = {
  rapportId: string;
  semaine: string;
  /** Date du cycle, ex « 30 mai, 01:43 ». */
  date: string;
  signaux: WeakSignal[];
};

/* ── Brief Kanban (page principale) ───────────────────────────────────────── */

/** Colonne du Kanban = étape du cycle hebdomadaire. */
export type KanbanColumn = "PROGRAMME" | "EN_ANALYSE" | "A_LIRE" | "CONSULTES";

/** Carte du Kanban : un brief hebdo d'un concurrent. */
export type BriefCard = RapportCard & {
  column: KanbanColumn;
  /** Libellé de la semaine du cycle, ex « Semaine du 26 mai ». */
  semaine: string;
  lu: boolean;
};

export type KanbanData = {
  competitorCount: number;
  /** Cartes regroupées par colonne (déjà triées). */
  columns: Record<KanbanColumn, BriefCard[]>;
  /** Total signaux faibles détectés (toutes semaines). */
  signalCount: number;
  /** Y a-t-il au moins un rapport (sinon état « première veille »). */
  hasAnyRapport: boolean;
};

/* ── Vues concurrent-first (rail commun SWOT / PESTEL / Signaux) ───────────── */

export type CompetitorListItem = {
  id: string;
  nom: string;
  secteur: string | null;
  rapportCount: number;
  signalCount: number;
  hasSwot: boolean;
  hasPestel: boolean;
  /** Dernier cycle relatif, ex « il y a 2j ». */
  dernierCycle: string | null;
};

/** Une version hebdomadaire d'un livrable (SWOT ou PESTEL). */
export type SwotVersion = {
  rapportId: string;
  semaine: string;
  genereLe: string;
  swot: NonNullable<RapportSwot>;
};

export type PestelVersion = {
  rapportId: string;
  semaine: string;
  genereLe: string;
  pestel: NonNullable<RapportPestel>;
};
