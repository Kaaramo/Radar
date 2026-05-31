import { AppShellSkeleton } from "@/components/dashboard/app-shell-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton de /competitors (hub : en-tête + liste de concurrents surveillés).
 */
export default function CompetitorsLoading() {
  return (
    <AppShellSkeleton>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[920px] px-12 pb-16 pt-12">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="mt-3 h-9 w-64" />
          <Skeleton className="mt-3 h-3.5 w-80" />

          <div className="mt-10 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-lg border border-navy-700 bg-navy-900 p-5"
              >
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShellSkeleton>
  );
}
