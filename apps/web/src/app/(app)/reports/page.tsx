import { FileText } from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { EmptyPageState } from "@/components/dashboard/empty-page-state";
import { getOnboardingState } from "@/lib/onboarding/state";

export const metadata = {
  title: "RADAR · Rapports",
};

/**
 * Page Rapports — bibliothèque des livrables exportables.
 *
 * V1 : placeholder éditorial. Sprint 05 : génération PDF/Markdown des briefs
 * quotidiens, briefs hebdo et rapports mensuels exec. Téléchargement direct.
 */
export default async function ReportsPage() {
  const state = await getOnboardingState();
  const entrepriseName = state.profil?.nomEntreprise ?? "Marka Logistics";

  return (
    <AppShell
      briefBarProps={{
        entrepriseName,
        currentPage: "Rapports",
        userName: state.userName,
        userEmail: state.userEmail,
      }}
      sidebarProps={{ active: "reports" }}
    >
      <div className="flex w-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <EmptyPageState
            icon={FileText}
            eyebrow="Sprint 05 · Export"
            title="Vos rapports exportables arrivent bientôt."
            description="Brief quotidien, synthèse hebdo, rapport mensuel exec : tout sera téléchargeable en PDF ou Markdown, prêt à transmettre à votre comité de direction ou à votre client."
          />
        </div>
      </div>
    </AppShell>
  );
}
