import { AppShellSkeleton } from "@/components/dashboard/app-shell-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton de /reports/[id] (lecture d'une synthèse : titre + corps d'article).
 */
export default function ReportDetailLoading() {
  return (
    <AppShellSkeleton>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-4 h-10 w-3/4" />
          <div className="mt-4 flex items-center gap-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>

          <div className="mt-10 space-y-8">
            {Array.from({ length: 4 }).map((_, b) => (
              <div key={b}>
                <Skeleton className="h-5 w-52" />
                <div className="mt-4 space-y-2.5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton
                      key={`${b}-${i}`}
                      className="h-3"
                      style={{ width: `${100 - (i % 3) * 8}%` }}
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
