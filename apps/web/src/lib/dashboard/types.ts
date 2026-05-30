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

export type RapportStatut = "EN_ATTENTE" | "EN_COURS" | "TERMINE" | "ECHEC";

/** Source collectée, grille CRAAP M244. */
export type RapportSource = {
  id: string;
  url: string;
  domain: string;
  titre: string | null;
  craapTotal: number | null;
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
