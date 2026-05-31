import { Compass } from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { EmptyPageState } from "@/components/dashboard/empty-page-state";
import { CompetitorRail } from "@/components/dashboard/competitor-rail";
import { SprintDropdown } from "@/components/dashboard/sprint-dropdown";
import { SwotMatrix } from "@/components/dashboard/swot-matrix";
import { getCompetitorList, getSwotVersions } from "@/lib/dashboard/queries";
import { getOnboardingState } from "@/lib/onboarding/state";

export const metadata = {
  title: "RADAR · SWOT",
};

type SearchParams = { c?: string; w?: string };

/**
 * Page SWOT — concurrent-first + versionné par semaine.
 *
 * On choisit un concurrent, on voit sa dernière matrice SWOT, et on peut
 * remonter les sprints de veille pour comparer l'évolution.
 */
export default async function SwotPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [state, params] = await Promise.all([
    getOnboardingState(),
    searchParams,
  ]);
  const entrepriseName = state.profil?.nomEntreprise ?? "Votre entreprise";
  const competitors = await getCompetitorList(state.userId);

  const activeId =
    (params.c && competitors.some((c) => c.id === params.c)
      ? params.c
      : competitors[0]?.id) ?? null;
  const active = competitors.find((c) => c.id === activeId) ?? null;

  const versions = activeId
    ? await getSwotVersions(activeId, state.userId)
    : [];
  const activeVersion =
    versions.find((v) => v.rapportId === params.w) ?? versions[0] ?? null;

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
        {competitors.length === 0 ? (
          <div className="flex-1 overflow-y-auto">
            <EmptyPageState
              icon={Compass}
              eyebrow="Livrable M244 · Analyse SWOT"
              title="Aucun concurrent surveillé."
              description="Ajoutez des concurrents puis lancez une veille : la matrice SWOT (Forces, Faiblesses, Opportunités, Menaces) de chaque concurrent apparaîtra ici."
            />
          </div>
        ) : (
          <>
            <CompetitorRail items={competitors} activeId={activeId} />
            <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
              <header className="mb-6">
                <p className="font-display text-xs uppercase tracking-[0.2em] text-royal">
                  Analyse SWOT
                </p>
                <h1 className="mt-2 font-display text-3xl text-bone">
                  {active?.nom ?? "—"}
                </h1>
                {activeVersion ? (
                  <p className="mt-2 text-sm text-fog">
                    Généré le {activeVersion.genereLe}
                  </p>
                ) : null}
                {activeId && versions.length > 0 ? (
                  <div className="mt-4">
                    <SprintDropdown
                      concurrentId={activeId}
                      activeValue={activeVersion?.rapportId ?? ""}
                      options={versions.map((v) => ({
                        value: v.rapportId,
                        semaine: v.semaine,
                        date: v.genereLe,
                      }))}
                    />
                  </div>
                ) : null}
              </header>

              {activeVersion ? (
                <SwotMatrix swot={activeVersion.swot} />
              ) : (
                <div className="rounded-lg border border-dashed border-navy-700 bg-navy-900/40 px-5 py-10 text-center text-sm text-muted-soft">
                  Pas encore de SWOT pour ce concurrent. Lancez une veille pour
                  le générer.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
