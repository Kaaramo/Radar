import {
  Compass,
  Cpu,
  Megaphone,
  ShieldCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import type { Axe } from "./types";

/**
 * Tokens des 5 axes de surveillance — version dashboard.
 *
 * Note : le naming diffère légèrement de `lib/onboarding/axes.ts` (où les clés
 * sont `RECRUTEMENT_RH`, `STRATEGIE_DIRECTION`, etc.). Sprint 04 alignera les
 * deux côtés (Prisma enum `Axe` est la source de vérité).
 */
export const AXE_TOKENS: Record<
  Axe,
  { label: string; full: string; color: string; icon: LucideIcon }
> = {
  RH: {
    label: "RH",
    full: "Recrutements et RH",
    color: "#4A1D6E",
    icon: UsersRound,
  },
  STRATEGIE: {
    label: "STRATÉGIE",
    full: "Stratégie et direction",
    color: "#C77700",
    icon: Compass,
  },
  TECH: {
    label: "TECH",
    full: "Technologie et innovation",
    color: "#2251FF",
    icon: Cpu,
  },
  DIGITAL: {
    label: "DIGITAL",
    full: "Présence digitale",
    color: "#BE185D",
    icon: Megaphone,
  },
  REGLEMENTAIRE: {
    label: "RÉGLEMENT.",
    full: "Réglementation et conformité",
    color: "#0F8F65",
    icon: ShieldCheck,
  },
};

/** Couleur d'un score CRAAP (0-10) selon les seuils PRD. */
export function craapColor(score: number): string {
  if (score >= 8) return "#2251FF";
  if (score >= 6) return "#0F8F65";
  if (score >= 4) return "#C77700";
  return "#B42318";
}
