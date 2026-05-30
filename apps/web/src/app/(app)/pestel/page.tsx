import { Globe2 } from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { EmptyPageState } from "@/components/dashboard/empty-page-state";
import { getOnboardingState } from "@/lib/onboarding/state";

export const metadata = {
  title: "RADAR · PESTEL",
};

/**
 * Page PESTEL — analyse macro hebdomadaire.
 *
 * V1 : placeholder éditorial. Sprint 04+ : dernière analyse PESTEL générée
 * tous les lundis par l'agent OpenClaw (Politique, Économique, Social,
 * Technologique, Environnemental, Légal) sur le secteur de l'utilisateur.
 */
export default async function PestelPage() {
  const state = await getOnboardingState();
  const entrepriseName = state.profil?.nomEntreprise ?? "Marka Logistics";

  return (
    <AppShell
      briefBarProps={{
        entrepriseName,
        currentPage: "PESTEL",
        userName: state.userName,
        userEmail: state.userEmail,
      }}
      sidebarProps={{ active: "pestel" }}
    >
      <div className="flex w-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <EmptyPageState
            icon={Globe2}
            eyebrow="Livrable M244 · Sprint 04"
            title="Votre analyse PESTEL sectorielle arrive bientôt."
            description="Chaque lundi, l'agent croisera les signaux macro (politique, économique, social, tech, environnemental, légal) qui touchent votre secteur. Vous aurez le pouls de votre marché en 1 minute de lecture."
          />
        </div>
      </div>
    </AppShell>
  );
}
