import { getKanbanData, getRapportDetail } from "@/lib/dashboard/queries";
import { getOnboardingState } from "@/lib/onboarding/state";

import { DashboardClient } from "./dashboard-client";

type SearchParams = {
  r?: string;
};

export const metadata = {
  title: "RADAR · Brief",
};

/**
 * Page principale du dashboard = vue Brief.
 *
 * Server Component : charge l'utilisateur + le dernier rapport par concurrent
 * (monde « Rapport », 100% Prisma). Si un rapport est ouvert (`?r=<id>`), on
 * charge son détail complet pour le panneau de droite.
 */
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const state = await getOnboardingState();

  const openRapportId = typeof params.r === "string" ? params.r : null;

  const [data, openRapport] = await Promise.all([
    getKanbanData(state.userId),
    openRapportId ? getRapportDetail(openRapportId, state.userId) : null,
  ]);

  const entrepriseName = state.profil?.nomEntreprise ?? "Votre entreprise";

  return (
    <DashboardClient
      data={data}
      openRapport={openRapport}
      userName={state.userName}
      userEmail={state.userEmail}
      entrepriseName={entrepriseName}
      userConcurrents={state.concurrents.map((c) => ({
        id: c.id,
        nom: c.nom,
        secteur: c.secteur,
      }))}
    />
  );
}
