import { History } from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { EmptyPageState } from "@/components/dashboard/empty-page-state";
import { CyclesTable } from "@/components/dashboard/cycles-table";
import { getCyclesAuditTrail } from "@/lib/dashboard/queries";
import type { CycleAuditRow } from "@/lib/dashboard/types";
import { getOnboardingState } from "@/lib/onboarding/state";

export const metadata = {
  title: "RADAR · Cycles",
};

/**
 * Page Cycles — audit trail des runs de l'agent, en timeline par sprint.
 *
 * Transparence M244 : pour chaque cycle, la preuve détaillée (sources, signaux,
 * CRAAP moyen, durée, livrables) + reprise des cycles interrompus, le tout
 * regroupé par semaine de veille.
 */
export default async function CyclesPage() {
  const state = await getOnboardingState();
  const entrepriseName = state.profil?.nomEntreprise ?? "Votre entreprise";
  const rows = await getCyclesAuditTrail(state.userId);

  const termines = rows.filter((r) => r.statut === "TERMINE").length;
  const actifs = rows.filter(
    (r) => r.statut === "EN_COURS" || r.statut === "EN_ATTENTE",
  ).length;
  const interrompus = rows.filter((r) => r.statut === "INTERROMPU").length;

  // Regroupement par sprint (semaine), ordre déjà desc depuis la query.
  const sprints: { semaine: string; rows: CycleAuditRow[] }[] = [];
  for (const r of rows) {
    const last = sprints[sprints.length - 1];
    if (last && last.semaine === r.semaine) last.rows.push(r);
    else sprints.push({ semaine: r.semaine, rows: [r] });
  }

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
          {rows.length === 0 ? (
            <EmptyPageState
              icon={History}
              eyebrow="Sprint 04 · Audit trail"
              title="Aucun cycle exécuté pour l'instant."
              description="Chaque run de l'agent apparaîtra ici avec sa preuve détaillée : sources visitées, scores CRAAP, livrables produits et durée. La transparence qui prouve que la veille tourne."
            />
          ) : (
            <div className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
              <header className="mb-8">
                <p className="font-display text-xs uppercase tracking-[0.2em] text-royal">
                  Sprint 04 · Audit trail
                </p>
                <h1 className="mt-2 font-display text-4xl text-bone">
                  Cycles de veille
                </h1>
                <p className="mt-2 text-sm text-fog">
                  {rows.length} cycle{rows.length > 1 ? "s" : ""}
                  {" · "}
                  <span className="text-emerald-400">
                    {termines} terminé{termines > 1 ? "s" : ""}
                  </span>
                  {actifs > 0 ? (
                    <>
                      {" · "}
                      <span className="text-royal">
                        {actifs} actif{actifs > 1 ? "s" : ""}
                      </span>
                    </>
                  ) : null}
                  {interrompus > 0 ? (
                    <>
                      {" · "}
                      <span className="text-amber">
                        {interrompus} interrompu{interrompus > 1 ? "s" : ""}
                      </span>
                    </>
                  ) : null}
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
                      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-soft">
                        {sprint.rows.length} cycle
                        {sprint.rows.length > 1 ? "s" : ""}
                      </span>
                      <span className="h-px flex-1 bg-navy-700" />
                    </div>
                    <CyclesTable rows={sprint.rows} />
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
