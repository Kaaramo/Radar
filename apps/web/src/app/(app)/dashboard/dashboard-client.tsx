"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Layers,
  Loader2,
  Radar as RadarIcon,
  Sparkles,
} from "lucide-react";

import { launchCycle } from "@/lib/actions/dashboard";
import { AppShell } from "@/components/dashboard/app-shell";
import type { BriefBarProps } from "@/components/dashboard/brief-bar";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { ContextPanel } from "@/components/dashboard/context-panel";
import type {
  DashboardData,
  RapportCard,
  RapportDetail,
  RapportStatut,
} from "@/lib/dashboard/types";

export type DashboardClientProps = {
  data: DashboardData;
  openRapport: RapportDetail | null;
  userName: string;
  userEmail: string;
  entrepriseName: string;
  userConcurrents: { id: string; nom: string; secteur?: string | null }[];
};

/**
 * Vue Brief = page /dashboard (monde « Rapport »).
 *
 * Feed = 1 carte par concurrent (dernier rapport). Clic → panneau de détail
 * (synthèse, sources CRAAP, SWOT, PESTEL, signaux). Données 100% réelles.
 */
export function DashboardClient({
  data,
  openRapport,
  userName,
  userEmail,
  entrepriseName,
  userConcurrents,
}: DashboardClientProps) {
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openRapportCard = (id: string) => router.push(`/dashboard?r=${id}`);
  const closeContext = () => router.push("/dashboard");

  const briefBarProps: BriefBarProps = {
    entrepriseName,
    currentPage: "Brief",
    cycleState: data.cycleState,
    userName,
    userEmail,
    onCommandPalette: () => setPaletteOpen(true),
  };

  return (
    <AppShell
      briefBarProps={briefBarProps}
      sidebarProps={{
        active: "brief",
        cycleState: data.cycleState,
        movementCount: data.rapportCount,
        weakSignalCount: data.signalCount,
      }}
      contextPanel={
        <ContextPanel rapport={openRapport} onClose={closeContext} />
      }
      overlay={
        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          concurrents={userConcurrents}
        />
      }
    >
      <div className="flex w-full flex-col overflow-hidden">
        <FeedView data={data} onOpenRapport={openRapportCard} />
      </div>
    </AppShell>
  );
}

/* ── Feed ─────────────────────────────────────────────────────────────────── */

function FeedView({
  data,
  onOpenRapport,
}: {
  data: DashboardData;
  onOpenRapport: (id: string) => void;
}) {
  if (data.cycleState === "idle") {
    return <DayZeroView competitorCount={data.competitorCount} />;
  }

  return (
    <div className="flex w-full flex-col overflow-hidden">
      {/* En-tête éditorial : date + lancer un cycle + métriques */}
      <div className="border-b border-navy-700 px-6 pb-5 pt-7">
        <div className="flex items-start justify-between gap-4">
          <h1 className="m-0 font-display text-[36px] font-light leading-[1.05] tracking-[-0.02em] text-bone">
            {dateHero()}
          </h1>
          <LaunchCycleButton compact />
        </div>
        <p className="mt-2.5 text-[12.5px] tabular-nums text-muted-soft">
          <span className="text-bone">{data.competitorCount}</span> concurrent
          {data.competitorCount > 1 ? "s" : ""} surveillé
          {data.competitorCount > 1 ? "s" : ""}
          {data.rapportCount > 0 ? (
            <>
              {" · "}
              <span className="text-success">{data.rapportCount}</span> rapport
              {data.rapportCount > 1 ? "s" : ""} terminé
              {data.rapportCount > 1 ? "s" : ""}
            </>
          ) : null}
          {data.runningCount > 0 ? (
            <>
              {" · "}
              <span className="text-royal-light">{data.runningCount}</span> en
              cours
            </>
          ) : null}
          {data.signalCount > 0 ? (
            <>
              {" · "}
              <span className="text-warning">{data.signalCount}</span> signal
              {data.signalCount > 1 ? "aux" : ""}
            </>
          ) : null}
        </p>
      </div>

      {/* Grille des rapports par concurrent */}
      <div className="flex-1 overflow-y-auto px-6 pb-12 pt-5">
        {data.rapports.length === 0 ? (
          <EmptyRapportsState />
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            }}
          >
            {data.rapports.map((r) => (
              <RapportCardView
                key={r.id}
                rapport={r}
                onOpen={() => onOpenRapport(r.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Carte rapport (1 par concurrent) ─────────────────────────────────────── */

const STATUT_META: Record<
  RapportStatut,
  { label: string; color: string; bg: string }
> = {
  EN_ATTENTE: {
    label: "En file",
    color: "var(--color-muted-soft)",
    bg: "rgba(143,163,184,0.12)",
  },
  EN_COURS: {
    label: "En cours",
    color: "var(--color-royal-light)",
    bg: "rgba(34,81,255,0.14)",
  },
  TERMINE: {
    label: "Terminé",
    color: "var(--color-success)",
    bg: "rgba(15,143,101,0.14)",
  },
  ECHEC: {
    label: "Échec",
    color: "var(--color-error)",
    bg: "rgba(180,35,24,0.14)",
  },
};

function RapportCardView({
  rapport: r,
  onOpen,
}: {
  rapport: RapportCard;
  onOpen: () => void;
}) {
  const st = STATUT_META[r.statut];
  const running = r.statut === "EN_COURS" || r.statut === "EN_ATTENTE";

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col rounded-md border border-navy-700 bg-navy-900 p-5 text-left transition-colors duration-200 ease-out hover:border-royal/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="m-0 truncate text-[15.5px] font-semibold tracking-[-0.01em] text-bone">
            {r.concurrentNom}
          </h3>
          {r.concurrentSecteur ? (
            <p className="m-0 mt-0.5 truncate font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted-soft">
              {r.concurrentSecteur}
            </p>
          ) : null}
        </div>
        <span
          className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em]"
          style={{ color: st.color, background: st.bg }}
        >
          {running ? (
            <Loader2 size={9} strokeWidth={2} className="animate-spin" />
          ) : null}
          {st.label}
        </span>
      </div>

      {/* Progression si en cours */}
      {running ? (
        <div className="mt-4">
          <div className="flex items-center justify-between font-mono text-[10.5px] text-muted-soft">
            <span>{r.etape ?? "Initialisation"}</span>
            <span className="tabular-nums">{r.progressionPct}%</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-navy-800">
            <div
              className="h-full rounded-full bg-royal transition-all duration-500 ease-out"
              style={{ width: `${Math.max(4, r.progressionPct)}%` }}
            />
          </div>
        </div>
      ) : r.synthese ? (
        <p className="mt-3 line-clamp-3 text-[13px] leading-[1.55] text-muted">
          {r.synthese}
        </p>
      ) : (
        <p className="mt-3 text-[13px] italic leading-[1.55] text-muted-soft">
          {r.statut === "ECHEC"
            ? "Le cycle a échoué pour ce concurrent."
            : "Synthèse en attente."}
        </p>
      )}

      {/* Footer métriques */}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-navy-700 pt-3 font-mono text-[10.5px] text-muted-soft">
        <span className="inline-flex items-center gap-1">
          <FileText size={11} strokeWidth={1.6} />
          {r.sourceCount} source{r.sourceCount > 1 ? "s" : ""}
        </span>
        {r.hasSwot ? <Chip label="SWOT" /> : null}
        {r.hasPestel ? <Chip label="PESTEL" /> : null}
        {r.signalCount > 0 ? (
          <span className="inline-flex items-center gap-1 text-warning">
            <Sparkles size={11} strokeWidth={1.6} />
            {r.signalCount} signal{r.signalCount > 1 ? "aux" : ""}
          </span>
        ) : null}
        <span className="flex-1" />
        <span>{r.termineLe ?? r.createdAt}</span>
      </div>
    </button>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded border border-navy-700 bg-navy-800 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.08em] text-muted">
      {label}
    </span>
  );
}

/* ── États vides ──────────────────────────────────────────────────────────── */

function EmptyRapportsState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-navy-700 bg-navy-900 text-muted-soft">
        <Layers size={20} strokeWidth={1.6} />
      </span>
      <p className="mt-5 text-[13.5px] text-muted">
        Aucun rapport pour l&apos;instant.
      </p>
      <div className="mt-5">
        <LaunchCycleButton />
      </div>
    </div>
  );
}

function DayZeroView({ competitorCount }: { competitorCount: number }) {
  return (
    <div className="flex flex-1 items-center justify-center px-8 py-16">
      <div className="flex max-w-[460px] flex-col items-center text-center">
        <RadarPulseSvg />
        <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.16em] text-royal">
          J0 · Calibrage du radar
        </p>
        <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.01em] text-bone">
          Votre radar est armé.
        </h2>
        <p className="mt-3 text-[13.5px] leading-[1.6] text-muted">
          {competitorCount > 0
            ? `${competitorCount} concurrent${competitorCount > 1 ? "s sont" : " est"} sous surveillance. Lancez un premier cycle dès maintenant : notre agent IA collecte, évalue (CRAAP), et produit SWOT, PESTEL et signaux faibles en arrière-plan.`
            : "Ajoutez des concurrents dans vos paramètres, puis lancez un cycle de veille."}
        </p>
        {competitorCount > 0 ? (
          <div className="mt-7">
            <LaunchCycleButton />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ── Bouton « Lancer un cycle » ───────────────────────────────────────────── */

function LaunchCycleButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    tone: "ok" | "err";
    text: string;
  } | null>(null);

  const onClick = () => {
    setFeedback(null);
    startTransition(async () => {
      const res = await launchCycle();
      if (res.success) {
        setFeedback({
          tone: "ok",
          text: res.message ?? "Cycle lancé en arrière-plan.",
        });
        router.refresh();
      } else {
        setFeedback({ tone: "err", text: res.error });
      }
    });
  };

  if (compact) {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <button
          type="button"
          onClick={onClick}
          disabled={pending}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-royal/40 bg-royal/10 px-3 text-[12px] font-semibold text-royal-light transition-all duration-200 ease-out hover:bg-royal/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <Loader2 size={13} strokeWidth={1.8} className="animate-spin" />
          ) : (
            <RadarIcon size={13} strokeWidth={1.8} />
          )}
          {pending ? "Lancement…" : "Lancer un cycle"}
        </button>
        {feedback ? (
          <p
            className={`max-w-[300px] text-right text-[11px] leading-[1.4] ${
              feedback.tone === "ok" ? "text-success" : "text-error"
            }`}
          >
            {feedback.text}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="inline-flex h-10 items-center gap-2 rounded-md bg-royal px-5 text-[13px] font-semibold text-bone transition-all duration-200 ease-out hover:bg-royal-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <Loader2 size={15} strokeWidth={1.8} className="animate-spin" />
        ) : (
          <RadarIcon size={15} strokeWidth={1.8} />
        )}
        {pending ? "Lancement en cours…" : "Lancer un cycle maintenant"}
      </button>
      {feedback ? (
        <p
          className={`max-w-[360px] text-center text-[12px] leading-[1.5] ${
            feedback.tone === "ok" ? "text-success" : "text-error"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}
    </div>
  );
}

/* ── Décor radar (J0) ─────────────────────────────────────────────────────── */

function RadarPulseSvg() {
  return (
    <svg
      viewBox="0 0 96 96"
      width="84"
      height="84"
      aria-hidden="true"
      className="overflow-visible"
    >
      <circle cx="48" cy="48" r="3" fill="#2251FF" className="rd-pulse-1" />
      <circle
        cx="48"
        cy="48"
        r="14"
        fill="none"
        stroke="#2251FF"
        strokeWidth="1.5"
        opacity="0.6"
        className="rd-pulse-2"
      />
      <circle
        cx="48"
        cy="48"
        r="28"
        fill="none"
        stroke="#2251FF"
        strokeWidth="1.5"
        opacity="0.3"
        className="rd-pulse-3"
      />
      <circle
        cx="48"
        cy="48"
        r="42"
        fill="none"
        stroke="#2251FF"
        strokeWidth="1.5"
        opacity="0.15"
        className="rd-pulse-4"
      />
      <circle cx="78" cy="32" r="2.5" fill="#C77700" className="rd-pulse-dot" />
    </svg>
  );
}

/* ── Date helper ──────────────────────────────────────────────────────────── */

function dateHero(): string {
  const d = new Date();
  const days = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}
