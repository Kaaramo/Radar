"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  Flame,
  Shield,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { RapportSwot } from "@/lib/dashboard/types";

/**
 * SWOT en accordéon vertical (panneau Brief, 380px de large).
 *
 * Remplace la grille 2×2 qui devenait illisible dans le panneau étroit. Chaque
 * quadrant est une section dépliable ; Forces ouvert par défaut. Sobre, charte
 * Radar : accent coloré fin à gauche, navy en surface.
 */
const QUADRANTS: {
  key: keyof NonNullable<RapportSwot>;
  label: string;
  Icon: LucideIcon;
  color: string;
  bar: string;
}[] = [
  {
    key: "strengths",
    label: "Forces",
    Icon: Shield,
    color: "text-royal",
    bar: "bg-royal",
  },
  {
    key: "weaknesses",
    label: "Faiblesses",
    Icon: AlertTriangle,
    color: "text-amber",
    bar: "bg-amber",
  },
  {
    key: "opportunities",
    label: "Opportunités",
    Icon: TrendingUp,
    color: "text-emerald-400",
    bar: "bg-emerald-400",
  },
  {
    key: "threats",
    label: "Menaces",
    Icon: Flame,
    color: "text-red-400",
    bar: "bg-red-400",
  },
];

export function SwotAccordion({ swot }: { swot: NonNullable<RapportSwot> }) {
  // Forces (1er quadrant) ouvert par défaut.
  const [open, setOpen] = useState<string | null>("strengths");

  return (
    <div className="flex flex-col gap-1.5">
      {QUADRANTS.map((q) => {
        const items = swot[q.key];
        const isOpen = open === q.key;
        return (
          <div
            key={q.key}
            className="overflow-hidden rounded-md border border-navy-700 bg-navy-900"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : q.key)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors duration-150 hover:bg-navy-800"
            >
              <span className={cn("h-3.5 w-0.5 rounded-full", q.bar)} />
              <q.Icon
                className={cn("h-3.5 w-3.5", q.color)}
                strokeWidth={1.6}
              />
              <span className="flex-1 text-[13px] font-medium text-bone">
                {q.label}
              </span>
              <span className="font-mono text-[10.5px] tabular-nums text-muted-soft">
                {items.length}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-muted-soft transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
                strokeWidth={1.6}
              />
            </button>

            {isOpen ? (
              <div className="border-t border-navy-700 px-3 py-2.5">
                {items.length > 0 ? (
                  <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {items.map((it, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-[12.5px] leading-[1.55] text-muted"
                      >
                        <span
                          className={cn(
                            "mt-1.5 h-1 w-1 shrink-0 rounded-full",
                            q.bar,
                          )}
                        />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="m-0 text-[12px] text-muted-soft">
                    Aucun élément détecté.
                  </p>
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
