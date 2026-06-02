import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Compass, FileDown, Globe2, Zap } from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { MarkdownView } from "@/components/dashboard/markdown-view";
import { getReport } from "@/lib/dashboard/queries";
import { getOnboardingState } from "@/lib/onboarding/state";

type Params = { id: string };

export const metadata = {
  title: "RADAR · Rapport",
};

/**
 * Lecture d'un rapport Markdown DANS l'app : la synthèse rédacteur rendue
 * proprement (charte Radar) + export .md + liens vers les autres livrables du
 * concurrent (SWOT, PESTEL, signaux).
 */
export default async function ReportDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const [state, { id }] = await Promise.all([getOnboardingState(), params]);
  const entrepriseName = state.profil?.nomEntreprise ?? "Votre entreprise";
  const report = await getReport(id, state.userId);

  if (!report) notFound();

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
          <div className="mx-auto max-w-[760px] px-6 py-8 lg:px-10">
            {/* Fil d'ariane + actions */}
            <div className="mb-6 flex items-center justify-between gap-3">
              <Link
                href="/reports"
                className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-soft transition-colors hover:text-bone"
              >
                <ArrowLeft size={14} strokeWidth={1.6} />
                Tous les rapports
              </Link>
              <Link
                href={`/reports/${report.rapportId}/print`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-md bg-royal px-4 text-[12.5px] font-semibold text-bone transition-colors hover:bg-royal-light"
              >
                <FileDown size={14} strokeWidth={1.8} />
                Télécharger en PDF
              </Link>
            </div>

            {/* En-tête du rapport */}
            <header className="mb-8 border-b border-navy-700 pb-6">
              <p className="font-display text-xs uppercase tracking-[0.2em] text-royal">
                Synthèse de veille · {report.semaine}
              </p>
              <h1 className="mt-2 font-display text-4xl leading-tight text-bone">
                {report.concurrentNom}
              </h1>
              <p className="mt-2 text-sm text-fog">
                Généré le {report.genereLe} · {report.sourceCount} sources
                {report.signalCount > 0
                  ? ` · ${report.signalCount} signaux`
                  : ""}
              </p>

              {/* Liens vers les autres livrables du concurrent */}
              <div className="mt-4 flex flex-wrap gap-2">
                {report.hasSwot ? (
                  <LivrableLink
                    href={`/swot?c=${report.concurrentId}`}
                    icon={<Compass size={13} strokeWidth={1.6} />}
                    label="SWOT"
                  />
                ) : null}
                {report.hasPestel ? (
                  <LivrableLink
                    href={`/pestel?c=${report.concurrentId}`}
                    icon={<Globe2 size={13} strokeWidth={1.6} />}
                    label="PESTEL"
                  />
                ) : null}
                {report.signalCount > 0 ? (
                  <LivrableLink
                    href={`/weak-signals?c=${report.concurrentId}`}
                    icon={<Zap size={13} strokeWidth={1.6} />}
                    label="Signaux faibles"
                  />
                ) : null}
              </div>
            </header>

            {/* Corps Markdown */}
            <article>
              <MarkdownView markdown={report.synthese} />
            </article>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function LivrableLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-md border border-navy-700 px-2.5 py-1 text-[11.5px] font-medium text-muted transition-colors hover:border-royal/40 hover:text-bone"
    >
      {icon}
      {label}
    </Link>
  );
}
