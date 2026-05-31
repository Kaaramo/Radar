import {
  AppShellSkeleton,
  PageHeaderSkeleton,
} from "@/components/dashboard/app-shell-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton de /reports (bibliothèque : sections par sprint + cartes rapport).
 */
export default function ReportsLoading() {
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
                  <Skeleton className="h-4 w-40" />
                  <span className="h-px flex-1 bg-navy-700" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={`${s}-${i}`}
                      className="rounded-lg border border-navy-700 bg-navy-900 p-5"
                    >
                      <Skeleton className="h-5 w-44" />
                      <Skeleton className="mt-3 h-3 w-full" />
                      <Skeleton className="mt-2 h-3 w-3/4" />
                      <div className="mt-4 flex items-center gap-3 border-t border-navy-700 pt-3">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="ml-auto h-3 w-20" />
                      </div>
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
