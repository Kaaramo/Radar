import { AppShell } from "@/components/dashboard/app-shell";
import { WeakSignalsView } from "@/components/dashboard/weak-signals-view";
import { getDashboardData, getWeakSignals } from "@/lib/dashboard/queries";
import { getOnboardingState } from "@/lib/onboarding/state";

export const metadata = {
  title: "RADAR · Signaux faibles",
};

/**
 * Page Signaux faibles — agrégation Prisma des SignalFaible du user.
 */
export default async function WeakSignalsPage() {
  const state = await getOnboardingState();
  const entrepriseName = state.profil?.nomEntreprise ?? "Votre entreprise";

  const [data, signals] = await Promise.all([
    getDashboardData(state.userId),
    getWeakSignals(state.userId),
  ]);

  return (
    <AppShell
      briefBarProps={{
        entrepriseName,
        currentPage: "Signaux faibles",
        cycleState: data.cycleState,
        userName: state.userName,
        userEmail: state.userEmail,
      }}
      sidebarProps={{
        active: "weak-signals",
        cycleState: data.cycleState,
        movementCount: data.rapportCount,
        weakSignalCount: data.signalCount,
      }}
    >
      <div className="flex w-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <WeakSignalsView signals={signals} />
        </div>
      </div>
    </AppShell>
  );
}
