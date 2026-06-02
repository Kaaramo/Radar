import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  ExternalLink,
  Globe,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { SwotMatrix } from "@/components/dashboard/swot-matrix";
import { craapColor } from "@/lib/dashboard/axe-tokens";
import {
  getCompetitor,
  getCompetitorLatestRapport,
} from "@/lib/dashboard/queries";
import type { RapportDetail } from "@/lib/dashboard/types";
import { getOnboardingState } from "@/lib/onboarding/state";

export const metadata = {
  title: "RADAR · Concurrent",
};

type SearchParams = { tab?: string };

const TABS = [
  { id: "synthese", label: "Synthèse", hint: null },
  { id: "swot", label: "SWOT", hint: null },
  { id: "sources", label: "Sources", hint: null },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default async function CompetitorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const state = await getOnboardingState();

  const competitor = await getCompetitor(id, state.userId);
  if (!competitor) notFound();

  const rapport = await getCompetitorLatestRapport(id, state.userId);
  const entrepriseName = state.profil?.nomEntreprise ?? "Votre entreprise";

  const activeTab: TabId =
    sp.tab === "swot" || sp.tab === "sources" ? sp.tab : "synthese";

  const siteHost = competitor.siteWeb
    ? competitor.siteWeb.replace(/^https?:\/\//, "")
    : null;

  return (
    <AppShell
      briefBarProps={{
        entrepriseName,
        currentPage: competitor.nom,
        parentPage: { label: "Concurrents", href: "/competitors" },
        userName: state.userName,
        userEmail: state.userEmail,
      }}
      sidebarProps={{ active: "competitors" }}
    >
      <div className="flex w-full flex-col overflow-y-auto">
        {/* Header concurrent */}
        <div className="border-b border-navy-700 px-8 pb-6 pt-6">
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-navy-700 bg-navy-900 text-[20px] font-semibold text-royal">
              {competitor.nom.trim()[0]?.toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="m-0 text-[24px] font-semibold tracking-[-0.01em] text-bone">
                {competitor.nom}
              </h1>
              {competitor.siteWeb && siteHost ? (
                <a
                  href={competitor.siteWeb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 font-mono text-[12px] text-royal transition-colors duration-150 ease-out hover:underline"
                >
                  {siteHost}
                  <ExternalLink size={11} strokeWidth={1.6} />
                </a>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-muted-soft">
                {competitor.secteur ? (
                  <Meta icon={Globe} label={competitor.secteur} />
                ) : null}
                {competitor.ville ? (
                  <Meta icon={MapPin} label={competitor.ville} />
                ) : null}
                {competitor.taille ? (
                  <Meta icon={Users} label={competitor.taille} />
                ) : null}
                {competitor.fondeeEn ? (
                  <Meta
                    icon={CalendarDays}
                    label={`Fondé en ${competitor.fondeeEn}`}
                  />
                ) : null}
              </div>
            </div>
          </div>

          {/* Stats du dernier rapport */}
          <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-navy-700 bg-navy-700">
            <Stat
              value={rapport ? String(rapport.sourceCount) : "—"}
              label="Sources"
              tone="neutral"
            />
            <Stat
              value={rapport ? String(rapport.signalCount) : "—"}
              label="Signaux faibles"
              tone={rapport && rapport.signalCount > 0 ? "safran" : "neutral"}
            />
            <Stat
              value={rapport?.hasSwot ? "Oui" : "—"}
              label="SWOT"
              tone={rapport?.hasSwot ? "teal" : "neutral"}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-navy-700 px-8">
          <div className="flex items-center gap-px">
            {TABS.map((t) => (
              <Link
                key={t.id}
                href={`/competitors/${competitor.id}${t.id === "synthese" ? "" : `?tab=${t.id}`}`}
                className={`-mb-px inline-flex h-10 items-center gap-2 border-b-2 px-3 text-[12.5px] font-medium transition-colors duration-150 ease-out ${
                  activeTab === t.id
                    ? "border-royal text-bone"
                    : "border-transparent text-muted-soft hover:text-muted"
                }`}
              >
                <span>{t.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {!rapport ? (
            <TabStub label="Aucun rapport pour ce concurrent. Lancez un cycle de veille depuis le Brief." />
          ) : activeTab === "synthese" ? (
            <SyntheseTab rapport={rapport} />
          ) : activeTab === "swot" ? (
            <SwotTab rapport={rapport} />
          ) : (
            <SourcesTab rapport={rapport} />
          )}
        </div>
      </div>
    </AppShell>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function Meta({ icon: Icon, label }: { icon: typeof Globe; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon size={12} strokeWidth={1.6} className="text-muted-soft" />
      <span>{label}</span>
    </span>
  );
}

function Stat({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: "teal" | "safran" | "neutral";
}) {
  const color =
    tone === "teal"
      ? "text-royal"
      : tone === "safran"
        ? "text-warning"
        : "text-bone";
  return (
    <div className="flex flex-col gap-0.5 bg-navy px-4 py-3">
      <span
        className={`font-mono text-[20px] font-semibold leading-none tabular-nums ${color}`}
      >
        {value}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-soft">
        {label}
      </span>
    </div>
  );
}

function SyntheseTab({ rapport }: { rapport: RapportDetail }) {
  if (!rapport.synthese) {
    return (
      <TabStub label="Synthèse en attente : le cycle est en cours ou n'a pas encore produit de résumé." />
    );
  }
  return (
    <div className="max-w-[760px] rounded-md border border-navy-700 bg-navy-900 p-6">
      <p className="m-0 whitespace-pre-line text-[14px] leading-[1.7] text-muted">
        {rapport.synthese}
      </p>
    </div>
  );
}

function SwotTab({ rapport }: { rapport: RapportDetail }) {
  if (!rapport.swot) {
    return (
      <TabStub label="Aucune SWOT générée pour ce concurrent. Le cycle est peut-être encore en cours." />
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-soft">
        <ShieldCheck size={11} strokeWidth={1.6} />
        <span>Synthèse SWOT · {rapport.termineLe ?? rapport.createdAt}</span>
      </div>
      <SwotMatrix swot={rapport.swot} />
    </div>
  );
}

function SourcesTab({ rapport }: { rapport: RapportDetail }) {
  if (rapport.sources.length === 0) {
    return <TabStub label="Aucune source collectée pour ce rapport." />;
  }
  return (
    <div className="overflow-hidden rounded-md border border-navy-700 bg-navy">
      {rapport.sources.map((s) => (
        <a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-11 items-center gap-3 border-b border-navy-700 px-4 transition-colors duration-150 ease-out last:border-b-0 hover:bg-navy-900"
        >
          <Globe
            size={13}
            strokeWidth={1.6}
            className="shrink-0 text-muted-soft"
          />
          <span className="min-w-0 flex-1 truncate text-[13px] text-bone">
            {s.titre ?? s.domain}
          </span>
          <span className="shrink-0 truncate font-mono text-[10.5px] text-muted-soft">
            {s.domain}
          </span>
          {s.craapTotal !== null ? (
            <span
              className="w-10 shrink-0 text-right font-mono text-[12.5px] font-semibold tabular-nums"
              style={{ color: craapColor(s.craapTotal) }}
            >
              {s.craapTotal.toFixed(1)}
            </span>
          ) : null}
        </a>
      ))}
    </div>
  );
}

function TabStub({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-dashed border-navy-700 bg-navy-900 px-6 py-12 text-center">
      <p className="text-[13px] text-muted">{label}</p>
    </div>
  );
}
