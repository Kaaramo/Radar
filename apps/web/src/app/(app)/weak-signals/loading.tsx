import {
  AppShellSkeleton,
  CompetitorRailSkeleton,
  PageHeaderSkeleton,
} from "@/components/dashboard/app-shell-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton de /weak-signals (rail concurrents + sections par sprint, cartes
 * signal en grille 2 colonnes).
 */
export default function WeakSignalsLoading() {
  return (
    <AppShellSkeleton>
      <div className="flex w-full overflow-hidden">
        <CompetitorRailSkeleton />
        <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
          <PageHeaderSkeleton />
          <div className="space-y-10">
            {Array.from({ length: 2 }).map((_, s) => (
              <section key={s}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-royal" />
                  <Skeleton className="h-4 w-32" />
                  <span className="h-px flex-1 bg-navy-700" />
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={`${s}-${i}`}
                      className="radar-card-validated rounded-lg border border-navy-700 bg-navy-900 p-4"
                    >
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="ml-auto h-3 w-10" />
                      </div>
                      <Skeleton className="mt-3 h-3.5 w-5/6" />
                      <Skeleton className="mt-2 h-3 w-full" />
                      <Skeleton className="mt-2 h-3 w-2/3" />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </AppShellSkeleton>
  );
}
