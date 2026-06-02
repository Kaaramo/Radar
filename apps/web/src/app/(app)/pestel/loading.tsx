import {
  AppShellSkeleton,
  CompetitorRailSkeleton,
  PageHeaderSkeleton,
} from "@/components/dashboard/app-shell-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton de /pestel (rail concurrents + 6 catégories Politique, Économique,
 * Social, Technologique, Environnemental, Légal).
 */
export default function PestelLoading() {
  return (
    <AppShellSkeleton>
      <div className="flex w-full overflow-hidden">
        <CompetitorRailSkeleton />
        <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
          <PageHeaderSkeleton />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, c) => (
              <div
                key={c}
                className="rounded-lg border border-navy-700 bg-navy-900 p-5"
              >
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-6 w-6 rounded-md" />
                  <Skeleton className="h-3.5 w-24" />
                </div>
                <div className="mt-4 space-y-2.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton
                      key={`${c}-${i}`}
                      className="h-3"
                      style={{ width: `${88 - i * 14}%` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShellSkeleton>
  );
}
