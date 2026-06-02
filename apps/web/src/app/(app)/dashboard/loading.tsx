import { AppShellSkeleton } from "@/components/dashboard/app-shell-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

const COLUMNS = ["À lire", "En analyse", "Consultés"] as const;

/**
 * Skeleton de /dashboard (vue Brief = Kanban 3 colonnes).
 */
export default function DashboardLoading() {
  return (
    <AppShellSkeleton>
      <div className="flex w-full gap-4 overflow-hidden px-6 py-6">
        {COLUMNS.map((col, c) => (
          <div key={col} className="flex flex-1 flex-col gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-5" />
            </div>
            {Array.from({ length: 4 - c }).map((_, i) => (
              <div
                key={`${col}-${i}`}
                className="rounded-lg border border-navy-700 bg-navy-900 p-4"
              >
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="mt-3 h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-4/5" />
                <div className="mt-4 flex items-center gap-2">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </AppShellSkeleton>
  );
}
