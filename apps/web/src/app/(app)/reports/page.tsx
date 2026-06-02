import Link from "next/link";
import { ArrowRight, FileText, Zap } from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { EmptyPageState } from "@/components/dashboard/empty-page-state";
import { getReportsList } from "@/lib/dashboard/queries";
import type { ReportCard } from "@/lib/dashboard/types";
import { getOnboardingState } from "@/lib/onboarding/state";

export const metadata = {
  title: "RADAR · Rapports",
};

/**
 * Page Rapports — bibliothèque des synthèses Markdown produites par l'agent
 * rédacteur. Regroupées par sprint de veille, chaque rapport s'ouvre en lecture
 * dans l'app (/reports/[id]).
 */
export default async function ReportsPage() {
  const state = await getOnboardingState();
  const entrepriseName = state.profil?.nomEntreprise ?? "Votre entreprise";
  const reports = await getReportsList(state.userId);

  // Regroupement par sprint (déjà triés desc).
  const sprints: { semaine: string; items: ReportCard[] }[] = [];
  for (const r of reports) {
    const last = sprints[sprints.length - 1];
    if (last && last.semaine === r.semaine) last.items.push(r);
    else sprints.push({ semaine: r.semaine, items: [r] });
  }

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
          {reports.length === 0 ? (
            <EmptyPageState
              icon={FileText}
              eyebrow="Livrable M244 · Rapports"
              title="Aucun rapport pour l'instant."
              description="Dès qu'un cycle de veille se termine, la synthèse rédigée par l'agent apparaît ici, lisible dans l'app et exportable en Markdown."
            />
          ) : (
            <div className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
              <header className="mb-8">
                <p className="font-display text-xs uppercase tracking-[0.2em] text-royal">
                  Bibliothèque · M244
                </p>
                <h1 className="mt-2 font-display text-4xl text-bone">
                  Rapports
                </h1>
                <p className="mt-2 text-sm text-fog">
                  {reports.length} synthèse{reports.length > 1 ? "s" : ""} de
                  veille. Cliquez pour ouvrir le rapport complet.
                </p>
              </header>

              <div className="space-y-8">
                {sprints.map((sprint) => (
                  <section key={sprint.semaine}>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-royal" />
                      <h2 className="font-display text-lg text-bone">
                        {sprint.semaine}
                      </h2>
                      <span className="h-px flex-1 bg-navy-700" />
                    </div>
                    <div className="space-y-3">
                      {sprint.items.map((r) => (
                        <Link
                          key={r.rapportId}
                          href={`/reports/${r.rapportId}`}
                          className="group block rounded-lg border border-navy-700 bg-navy-900 p-5 transition-colors duration-200 hover:border-royal/40"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-display text-xl text-bone group-hover:text-royal-light">
                              {r.concurrentNom}
                            </h3>
                            <ArrowRight
                              size={16}
                              strokeWidth={1.6}
                              className="mt-1 shrink-0 text-muted-soft transition-transform group-hover:translate-x-0.5 group-hover:text-royal-light"
                            />
                          </div>
                          <p className="mt-2 line-clamp-2 text-[13.5px] leading-[1.6] text-muted">
                            {r.extrait}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-navy-700 pt-3 font-mono text-[10.5px] text-muted-soft">
                            <span className="inline-flex items-center gap-1">
                              <FileText size={11} strokeWidth={1.6} />
                              {r.sourceCount} sources
                            </span>
                            {r.hasSwot ? <Chip label="SWOT" /> : null}
                            {r.hasPestel ? <Chip label="PESTEL" /> : null}
                            {r.signalCount > 0 ? (
                              <span className="inline-flex items-center gap-1 text-warning">
                                <Zap size={11} strokeWidth={1.6} />
                                {r.signalCount}
                              </span>
                            ) : null}
                            <span className="ml-auto">{r.genereLe}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded border border-navy-700 bg-navy-800 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.08em] text-muted">
      {label}
    </span>
  );
}
