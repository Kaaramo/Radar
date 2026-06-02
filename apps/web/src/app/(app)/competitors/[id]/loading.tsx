import { AppShellSkeleton } from "@/components/dashboard/app-shell-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton de /competitors/[id] (fiche concurrent : en-tête + blocs d'analyse).
 */
export default function CompetitorDetailLoading() {
  return (
    <AppShellSkeleton>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[920px] px-12 pb-16 pt-12">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-navy-700 bg-navy-900 p-5"
              >
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="mt-4 h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-5/6" />
                <Skeleton className="mt-2 h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShellSkeleton>
  );
}
