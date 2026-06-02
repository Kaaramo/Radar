import { ConcurrentsManager } from "@/components/competitors/concurrents-manager";
import { AppShell } from "@/components/dashboard/app-shell";
import { getOnboardingState } from "@/lib/onboarding/state";

export const metadata = {
  title: "RADAR · Concurrents",
};

/**
 * Hub Concurrents — gestion complète (ajout / édition / suppression).
 *
 * Les mutations revalident /competitors + /dashboard + /settings : les pages
 * liées (feed, paramètres) se mettent à jour automatiquement.
 */
export default async function CompetitorsPage() {
  const state = await getOnboardingState();
  const entrepriseName = state.profil?.nomEntreprise ?? "Votre entreprise";

  return (
    <AppShell
      briefBarProps={{
        entrepriseName,
        currentPage: "Concurrents",
        userName: state.userName,
        userEmail: state.userEmail,
      }}
      sidebarProps={{ active: "competitors" }}
    >
      <div className="flex w-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[920px] px-12 pb-16 pt-12">
            <ConcurrentsManager
              concurrents={state.concurrents.map((c) => ({
                id: c.id,
                nom: c.nom,
                secteur: c.secteur,
                siteWeb: c.siteWeb,
              }))}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
