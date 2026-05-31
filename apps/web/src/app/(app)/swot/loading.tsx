import {
  AppShellSkeleton,
  CompetitorRailSkeleton,
  PageHeaderSkeleton,
} from "@/components/dashboard/app-shell-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton de /swot (rail concurrents + matrice 2×2 Forces/Faiblesses/
 * Opportunités/Menaces).
 */
export default function SwotLoading() {
  return (
    <AppShellSkeleton>
      <div className="flex w-full overflow-hidden">
        <CompetitorRailSkeleton />
        <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
          <PageHeaderSkeleton />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, q) => (
              <div
                key={q}
                className="rounded-lg border border-navy-700 bg-navy-900 p-5"
              >
                <Skeleton className="h-4 w-28" />
                <div className="mt-4 space-y-2.5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton
                      key={`${q}-${i}`}
                      className="h-3"
                      style={{ width: `${90 - i * 12}%` }}
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
