import { Zap } from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { EmptyPageState } from "@/components/dashboard/empty-page-state";
import { CompetitorRail } from "@/components/dashboard/competitor-rail";
import { SprintDropdown } from "@/components/dashboard/sprint-dropdown";
import { SignalCard } from "@/components/dashboard/signal-card";
import {
  getCompetitorList,
  getCompetitorSignalsBySprint,
} from "@/lib/dashboard/queries";
import { getOnboardingState } from "@/lib/onboarding/state";

export const metadata = {
  title: "RADAR · Signaux faibles",
};

type SearchParams = { c?: string; w?: string };

/**
 * Page Signaux faibles — concurrent-first, regroupés par sprint de veille.
 *
 * On choisit un concurrent dans le rail, on voit SES signaux faibles classés
 * par semaine (sprint) puis par temps. Tout est lié au concurrent (M244).
 */
export default async function WeakSignalsPage({
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
  const allSprints = activeId
    ? await getCompetitorSignalsBySprint(activeId, state.userId)
    : [];

  // Filtre par sprint si `?w=` désigne un sprint précis (sinon : tous).
  const selected =
    params.w && allSprints.some((s) => s.rapportId === params.w)
      ? params.w
      : "all";
  const sprints =
    selected === "all"
      ? allSprints
      : allSprints.filter((s) => s.rapportId === selected);
  const total = sprints.reduce((n, s) => n + s.signaux.length, 0);

  return (
    <AppShell
      briefBarProps={{
        entrepriseName,
        currentPage: "Signaux faibles",
        userName: state.userName,
        userEmail: state.userEmail,
      }}
      sidebarProps={{ active: "weak-signals" }}
    >
      <div className="flex w-full overflow-hidden">
        {competitors.length === 0 ? (
          <div className="flex-1 overflow-y-auto">
            <EmptyPageState
              icon={Zap}
              eyebrow="Livrable M244 · Signaux faibles"
              title="Aucun concurrent surveillé."
              description="Ajoutez des concurrents puis lancez une veille : les signaux faibles détectés apparaîtront ici, classés par concurrent et par sprint."
            />
          </div>
        ) : (
          <>
            <CompetitorRail items={competitors} activeId={activeId} />
            <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
              <header className="mb-8">
                <p className="font-display text-xs uppercase tracking-[0.2em] text-royal">
                  Signaux faibles
                </p>
                <h1 className="mt-2 font-display text-3xl text-bone">
                  {active?.nom ?? "—"}
                </h1>
                <p className="mt-2 text-sm text-fog">
                  {total} signal{total > 1 ? "aux" : ""} faible
                  {total > 1 ? "s" : ""}
                  {selected === "all"
                    ? ` sur ${allSprints.length} sprint${allSprints.length > 1 ? "s" : ""} de veille`
                    : ""}
                  .
                </p>
                {activeId && allSprints.length > 0 ? (
                  <div className="mt-4">
                    <SprintDropdown
                      concurrentId={activeId}
                      activeValue={selected}
                      options={[
                        {
                          value: "all",
                          semaine: "Tous les sprints",
                          count: allSprints.reduce(
                            (n, s) => n + s.signaux.length,
                            0,
                          ),
                        },
                        ...allSprints.map((s) => ({
                          value: s.rapportId,
                          semaine: s.semaine,
                          date: s.date,
                          count: s.signaux.length,
                        })),
                      ]}
                    />
                  </div>
                ) : null}
              </header>

              {total === 0 ? (
                <div className="rounded-lg border border-dashed border-navy-700 bg-navy-900/40 px-5 py-10 text-center text-sm text-muted-soft">
                  Aucun signal faible pour ce concurrent pour l'instant. Lancez
                  une veille pour en détecter.
                </div>
              ) : (
                <div className="space-y-10">
                  {sprints.map((sprint) => (
                    <section key={sprint.rapportId}>
                      <div className="mb-4 flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-royal" />
                        <h2 className="font-display text-lg text-bone">
                          {sprint.semaine}
                        </h2>
                        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-soft">
                          {sprint.date} · {sprint.signaux.length} signal
                          {sprint.signaux.length > 1 ? "aux" : ""}
                        </span>
                        <span className="h-px flex-1 bg-navy-700" />
                      </div>
                      <div className="grid gap-3 lg:grid-cols-2">
                        {sprint.signaux.map((s) => (
                          <SignalCard key={s.id} signal={s} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
