import {
  AlertTriangle,
  Flame,
  Shield,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { RapportSwot } from "@/lib/dashboard/types";

/**
 * Matrice SWOT pleine largeur (page /swot).
 *
 * 4 quadrants M244 : Forces / Faiblesses (interne) · Opportunités / Menaces
 * (externe). Liste réelle issue de l'agent analyste-swot.
 */
const QUADRANTS: {
  key: keyof NonNullable<RapportSwot>;
  label: string;
  sub: string;
  Icon: LucideIcon;
  color: string;
  border: string;
}[] = [
  {
    key: "strengths",
    label: "Forces",
    sub: "Interne · Positif",
    Icon: Shield,
    color: "text-royal",
    border: "border-t-royal",
  },
  {
    key: "weaknesses",
    label: "Faiblesses",
    sub: "Interne · Négatif",
    Icon: AlertTriangle,
    color: "text-amber",
    border: "border-t-amber",
  },
  {
    key: "opportunities",
    label: "Opportunités",
    sub: "Externe · Positif",
    Icon: TrendingUp,
    color: "text-emerald-400",
    border: "border-t-emerald-400",
  },
  {
    key: "threats",
    label: "Menaces",
    sub: "Externe · Négatif",
    Icon: Flame,
    color: "text-red-400",
    border: "border-t-red-400",
  },
];

export function SwotMatrix({ swot }: { swot: NonNullable<RapportSwot> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {QUADRANTS.map((q) => {
        const items = swot[q.key];
        return (
          <div
            key={q.key}
            className={cn(
              "rounded-lg border border-t-2 border-line/50 bg-navy-800/40 p-4",
              q.border,
            )}
          >
            <div className="mb-1 flex items-center gap-2">
              <q.Icon className={cn("h-4 w-4", q.color)} strokeWidth={1.5} />
              <span className="font-display text-base text-bone">
                {q.label}
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-fog">
              {q.sub}
            </p>
            {items.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {items.map((it, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm leading-snug text-mist"
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-1 w-1 shrink-0 rounded-full",
                        q.color.replace("text-", "bg-"),
                      )}
                    />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-fog">Aucun élément détecté.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
