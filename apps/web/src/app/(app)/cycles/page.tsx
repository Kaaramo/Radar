import { History } from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { EmptyPageState } from "@/components/dashboard/empty-page-state";
import { getOnboardingState } from "@/lib/onboarding/state";

export const metadata = {
  title: "RADAR · Cycles",
};

/**
 * Page Cycles — audit trail des runs de l'agent.
 *
 * V1 : placeholder éditorial. Sprint 04 : timeline détaillée de chaque cycle
 * (durée, sources visitées, mouvements détectés, validations CRAAP). Pour la
 * transparence M244 exigée par le jury : prouver que l'agent travaille bien.
 */
export default async function CyclesPage() {
  const state = await getOnboardingState();
  const entrepriseName = state.profil?.nomEntreprise ?? "Marka Logistics";

  return (
    <AppShell
      briefBarProps={{
        entrepriseName,
        currentPage: "Cycles",
        userName: state.userName,
        userEmail: state.userEmail,
      }}
      sidebarProps={{ active: "cycles" }}
    >
      <div className="flex w-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <EmptyPageState
            icon={History}
            eyebrow="Sprint 04 · Audit trail"
            title="L'historique de vos cycles arrive bientôt."
            description="Pour chaque run de l'agent : sources visitées, temps de calcul, mouvements détectés, scores CRAAP. La preuve par le détail que la veille tourne et que vous pouvez auditer chaque décision."
          />
        </div>
      </div>
    </AppShell>
  );
}
