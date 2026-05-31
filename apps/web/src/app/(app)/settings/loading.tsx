import { AppShellSkeleton } from "@/components/dashboard/app-shell-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton de /settings (rail de navigation interne + section de formulaire).
 */
export default function SettingsLoading() {
  return (
    <AppShellSkeleton>
      <div className="flex w-full overflow-hidden">
        {/* SettingsNav silhouette */}
        <aside className="hidden h-full w-[220px] shrink-0 border-r border-navy-700 px-3 py-6 lg:block">
          <Skeleton className="mb-4 ml-2.5 h-3 w-24" />
          <div className="flex flex-col gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </aside>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[720px] px-12 pb-16 pt-12">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-3 h-8 w-52" />
            <Skeleton className="mt-3 h-3.5 w-72" />

            <div className="mt-10 space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-navy-700 bg-navy-900 p-5"
                >
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="mt-3 h-9 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShellSkeleton>
  );
}
