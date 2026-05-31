import {
  AppShellSkeleton,
  PageHeaderSkeleton,
} from "@/components/dashboard/app-shell-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton de /cycles (audit trail : sections par sprint + lignes de table).
 */
export default function CyclesLoading() {
  return (
    <AppShellSkeleton>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
          <PageHeaderSkeleton wide />

          <div className="space-y-8">
            {Array.from({ length: 2 }).map((_, s) => (
              <section key={s}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-royal" />
                  <Skeleton className="h-4 w-36" />
                  <span className="h-px flex-1 bg-navy-700" />
                </div>
                <div className="overflow-hidden rounded-lg border border-navy-700">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={`${s}-${i}`}
                      className="flex items-center gap-4 border-b border-navy-700 bg-navy-900 px-5 py-4 last:border-b-0"
                    >
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-3.5 w-40" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="ml-auto h-3 w-16" />
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
