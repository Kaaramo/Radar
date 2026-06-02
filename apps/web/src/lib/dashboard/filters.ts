import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

/**
 * Parsers Nuqs pour l'état URL du dashboard (filtres + drawer).
 *
 * Permet aux URL filtrées d'être bookmarkables, partageables et navigables
 * (Back/Forward). Source de vérité = URL, pas un store React local.
 */

export const TAB_VALUES = [
  "feed",
  "weak-signals",
  "cycles",
  "reports",
] as const;
export const PERIODE_VALUES = ["7d", "30d", "90d", "all"] as const;
export const SORT_VALUES = ["recent", "craap", "axe"] as const;
export const STATUT_VALUES = ["NEW", "VIEWED", "SAVED", "IGNORED"] as const;
export const AXE_VALUES = [
  "RH",
  "STRATEGIE",
  "TECH",
  "DIGITAL",
  "REGLEMENTAIRE",
] as const;

export const tabParser = parseAsStringEnum([...TAB_VALUES]).withDefault("feed");
export const concurrentParser = parseAsArrayOf(parseAsString).withDefault([]);
export const axeParser = parseAsArrayOf(
  parseAsStringEnum([...AXE_VALUES]),
).withDefault([]);
export const periodeParser = parseAsStringEnum([...PERIODE_VALUES]).withDefault(
  "7d",
);
export const craapMinParser = parseAsInteger.withDefault(0);
export const statutParser = parseAsArrayOf(
  parseAsStringEnum([...STATUT_VALUES]),
).withDefault([]);
export const sortParser = parseAsStringEnum([...SORT_VALUES]).withDefault(
  "recent",
);
export const mvtParser = parseAsString;

/** Forçage de l'état du dashboard (utile pour la démo jury : `?demo=nominal`). */
export const demoParser = parseAsStringEnum([
  "nominal",
  "j0",
  "running",
]).withDefault("nominal");

export type DashboardFilters = {
  tab: (typeof TAB_VALUES)[number];
  concurrent: string[];
  axe: (typeof AXE_VALUES)[number][];
  periode: (typeof PERIODE_VALUES)[number];
  craapMin: number;
  statut: (typeof STATUT_VALUES)[number][];
  sort: (typeof SORT_VALUES)[number];
};
