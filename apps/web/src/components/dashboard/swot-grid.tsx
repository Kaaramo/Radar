import {
  AlertTriangle,
  Flame,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import type { RapportSwot } from "@/lib/dashboard/types";

export type SwotGridProps = {
  swot: NonNullable<RapportSwot>;
};

/**
 * Grille SWOT 2×2 — 4 quadrants colorés selon les tokens DS.
 *
 * Source design : `dash-screens.jsx` (SwotCell + grid usage in ScreenCompetitorInwi).
 */
export function SwotGrid({ swot }: SwotGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <SwotCell
        color="#2251FF"
        icon={ShieldCheck}
        label="Strengths"
        sublabel="INTERNE / POSITIF"
        items={swot.strengths}
      />
      <SwotCell
        color="#C77700"
        icon={AlertTriangle}
        label="Weaknesses"
        sublabel="INTERNE / NÉGATIF"
        items={swot.weaknesses}
      />
      <SwotCell
        color="#0F8F65"
        icon={TrendingUp}
        label="Opportunities"
        sublabel="EXTERNE / POSITIF"
        items={swot.opportunities}
      />
      <SwotCell
        color="#B42318"
        icon={Flame}
        label="Threats"
        sublabel="EXTERNE / NÉGATIF"
        items={swot.threats}
      />
    </div>
  );
}

type SwotCellProps = {
  color: string;
  icon: LucideIcon;
  label: string;
  sublabel: string;
  items: string[];
};

function SwotCell({
  color,
  icon: Icon,
  label,
  sublabel,
  items,
}: SwotCellProps) {
  return (
    <div
      className="rounded-lg border border-navy-700 bg-navy-900 p-5"
      style={{ borderTop: `3px solid ${color}` }}
    >
      <div className="mb-1 flex items-center gap-2">
        <span style={{ color }} aria-hidden="true">
          <Icon size={20} strokeWidth={1.6} />
        </span>
        <h3 className="m-0 text-[18px] font-semibold text-bone">{label}</h3>
      </div>
      <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-soft">
        {sublabel}
      </div>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-2.5 text-[13.5px] leading-[1.55] text-muted"
          >
            <span
              aria-hidden="true"
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: color }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
