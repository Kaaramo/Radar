import { Compass } from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { EmptyPageState } from "@/components/dashboard/empty-page-state";
import { getOnboardingState } from "@/lib/onboarding/state";

export const metadata = {
  title: "RADAR · SWOT",
};

/**
 * Page SWOT — analyse stratégique versionnée.
 *
 * V1 : placeholder éditorial. Sprint 04+ : dernière analyse SWOT générée par
 * l'agent OpenClaw (Forces / Faiblesses / Opportunités / Menaces) + diff vs
 * version précédente + historique versionné.
 */
export default async function SwotPage() {
  const state = await getOnboardingState();
  const entrepriseName = state.profil?.nomEntreprise ?? "Marka Logistics";

  return (
    <AppShell
      briefBarProps={{
        entrepriseName,
        currentPage: "SWOT",
        userName: state.userName,
        userEmail: state.userEmail,
      }}
      sidebarProps={{ active: "swot" }}
    >
      <div className="flex w-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <EmptyPageState
            icon={Compass}
            eyebrow="Livrable M244 · Sprint 04"
            title="Votre matrice SWOT arrive bientôt."
            description="L'agent générera votre SWOT à chaque cycle hebdo, en croisant les mouvements détectés chez vos concurrents avec votre profil business. Les versions seront comparables d'une semaine à l'autre."
          />
        </div>
      </div>
    </AppShell>
  );
}
