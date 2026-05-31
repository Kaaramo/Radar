"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CompetitorListItem } from "@/lib/dashboard/types";

/**
 * Rail de sélection des concurrents, commun aux pages « lens » (Signaux, SWOT,
 * PESTEL). Le concurrent actif est passé en query (`?c=<id>`). Sobre : surface
 * navy, accent royal uniquement sur l'item actif.
 */
export function CompetitorRail({
  items,
  activeId,
  // Libellé du compteur secondaire affiché à droite de chaque item.
  metric = "signals",
}: {
  items: CompetitorListItem[];
  activeId: string | null;
  metric?: "signals" | "cycles";
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-navy-700 bg-navy">
      <div className="border-b border-navy-700 px-5 py-4">
        <h2 className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-soft">
          Concurrents · {items.length}
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {items.map((c) => {
            const active = c.id === activeId;
            const count = metric === "cycles" ? c.rapportCount : c.signalCount;
            const countLabel = metric === "cycles" ? "cycles" : "signaux";
            return (
              <li key={c.id}>
                <Link
                  href={`${pathname}?c=${c.id}`}
                  className={cn(
                    "block rounded-md border px-3 py-2.5 transition-colors duration-150 ease-out",
                    active
                      ? "border-royal/50 bg-royal/10"
                      : "border-transparent hover:border-navy-700 hover:bg-navy-900",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Building2
                      size={13}
                      strokeWidth={1.6}
                      className={
                        active ? "text-royal-light" : "text-muted-soft"
                      }
                    />
                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate text-[13.5px] font-medium",
                        active ? "text-bone" : "text-muted",
                      )}
                    >
                      {c.nom}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 pl-[21px] font-mono text-[10px] uppercase tracking-[0.06em] text-muted-soft">
                    <span>
                      {count} {countLabel}
                    </span>
                    {c.hasSwot ? (
                      <span className="text-muted-soft">· SWOT</span>
                    ) : null}
                    {c.hasPestel ? (
                      <span className="text-muted-soft">· PESTEL</span>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
