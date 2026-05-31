import type { ReactNode } from "react";

import { RadarLockupLight } from "@/components/brand/logo";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Silhouette du shell dashboard (BriefBar 60px + Sidebar 220px + main),
 * affichée pendant le chargement d'une page via `loading.tsx`. Le logo et les
 * libellés de section restent réels (repère d'identité et de structure), seul
 * le reste est en skeleton. Le contenu spécifique de chaque page passe en
 * `children`.
 */
const NAV_SECTIONS: ReadonlyArray<readonly [string, number]> = [
  ["Aujourd'hui", 2],
  ["Analyse", 3],
  ["Livrables", 2],
];

export function AppShellSkeleton({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-navy">
      {/* BriefBar silhouette */}
      <header className="flex h-[60px] shrink-0 items-center gap-6 border-b border-navy-700 bg-navy px-6">
        <div className="flex shrink-0 items-center gap-3">
          <RadarLockupLight height={22} />
          <span aria-hidden="true" className="h-4 w-px bg-navy-700" />
          <Skeleton className="h-3.5 w-28" />
        </div>
        <div className="flex-1" />
        <Skeleton className="h-7 w-32" />
        <div className="flex-1" />
        <Skeleton className="hidden h-9 w-[260px] sm:block" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </header>

      <div className="relative flex min-h-0 flex-1">
        {/* Sidebar silhouette */}
        <aside className="hidden h-full w-[220px] shrink-0 border-r border-navy-700 bg-navy py-4 md:block">
          <div className="flex flex-col gap-5 px-3 pt-9">
            {NAV_SECTIONS.map(([label, count]) => (
              <div key={label}>
                <div className="mb-2 px-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-soft/50">
                  {label}
                </div>
                <div className="flex flex-col gap-1.5">
                  {Array.from({ length: count }).map((_, i) => (
                    <div
                      key={`${label}-${i}`}
                      className="flex h-8 items-center gap-2.5 px-2.5"
                    >
                      <Skeleton className="h-[15px] w-[15px] rounded" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

/**
 * Silhouette du rail concurrents (gauche du contenu) partagé par SWOT, PESTEL
 * et Signaux faibles.
 */
export function CompetitorRailSkeleton() {
  return (
    <aside className="hidden h-full w-[240px] shrink-0 border-r border-navy-700 px-3 py-6 lg:block">
      <Skeleton className="mb-4 ml-2.5 h-3 w-20" />
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-md px-2.5 py-2.5"
          >
            <Skeleton className="h-7 w-7 rounded-md" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

/**
 * En-tête de page (eyebrow + titre + sous-ligne) commun aux pages livrables.
 */
export function PageHeaderSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <header className="mb-8">
      <Skeleton className="h-3 w-32" />
      <Skeleton className={`mt-3 h-9 ${wide ? "w-72" : "w-56"}`} />
      <Skeleton className="mt-3 h-3.5 w-64" />
    </header>
  );
}
