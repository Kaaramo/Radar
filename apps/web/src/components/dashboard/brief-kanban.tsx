"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Loader2,
  Radar as RadarIcon,
  RotateCw,
  Sparkles,
  UserPlus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type {
  BriefCard,
  KanbanColumn,
  KanbanData,
} from "@/lib/dashboard/types";
import { StatutBadge } from "@/components/dashboard/statut-badge";
import { titleAndExcerpt } from "@/lib/dashboard/md-text";
import { launchCycle, relancerRapport } from "@/lib/actions/dashboard";

/**
 * Brief Kanban — vision d'ensemble de la veille (page /dashboard).
 *
 * 4 colonnes = étapes du cycle hebdomadaire. Une carte = le brief hebdo d'un
 * concurrent, qui avance de « Programmé » à « Consultés ». Design sobre, charte
 * Radar Editorial : navy en surface, neutres pour le texte, royal/ambre/emerald
 * en accents discrets seulement.
 */

const COLUMNS: {
  key: KanbanColumn;
  label: string;
  /** Couleur d'accent SOBRE de la pastille d'en-tête. */
  dot: string;
  hint: string;
}[] = [
  {
    key: "PROGRAMME",
    label: "Programmé",
    dot: "bg-muted-soft",
    hint: "En file pour cette semaine",
  },
  {
    key: "EN_ANALYSE",
    label: "En analyse",
    dot: "bg-royal",
    hint: "L'agent travaille",
  },
  {
    key: "A_LIRE",
    label: "À lire",
    dot: "bg-royal-light",
    hint: "Briefs frais, non consultés",
  },
  {
    key: "CONSULTES",
    label: "Consultés",
    dot: "bg-success",
    hint: "Déjà lus / semaines passées",
  },
];

export function BriefKanban({
  data,
  competitorCount,
}: {
  data: KanbanData;
  competitorCount: number;
}) {
  const router = useRouter();

  const openBrief = (id: string) => {
    router.push(`/dashboard?r=${id}`);
  };

  return (
    <div className="flex w-full flex-col overflow-hidden">
      {/* En-tête : date + lancer la veille */}
      <div className="border-b border-navy-700 px-6 pb-5 pt-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="m-0 font-display text-[32px] font-light leading-[1.05] tracking-[-0.02em] text-bone">
              {dateHero()}
            </h1>
            <p className="mt-2 text-[12.5px] tabular-nums text-muted-soft">
              <span className="text-bone">{competitorCount}</span> concurrent
              {competitorCount > 1 ? "s" : ""} sous surveillance · veille
              hebdomadaire
            </p>
          </div>
          <LaunchButton compact />
        </div>
      </div>

      {/* Board */}
      {!data.hasAnyRapport ? (
        <EmptyBoard competitorCount={competitorCount} />
      ) : (
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-5">
          <div className="flex h-full min-w-[920px] gap-4">
            {COLUMNS.map((col) => (
              <Column
                key={col.key}
                col={col}
                cards={data.columns[col.key]}
                onOpen={openBrief}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Colonne ──────────────────────────────────────────────────────────────── */

function Column({
  col,
  cards,
  onOpen,
}: {
  col: (typeof COLUMNS)[number];
  cards: BriefCard[];
  onOpen: (id: string) => void;
}) {
  return (
    <section className="flex h-full min-w-0 flex-1 flex-col rounded-lg border border-navy-700 bg-navy/40">
      <header className="flex items-center gap-2 border-b border-navy-700 px-4 py-3">
        <span className={cn("h-1.5 w-1.5 rounded-full", col.dot)} />
        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
          {col.label}
        </h2>
        <span className="ml-auto font-mono text-[11px] tabular-nums text-muted-soft">
          {cards.length}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-3">
        {cards.length === 0 ? (
          <p className="px-1 py-6 text-center text-[11.5px] leading-relaxed text-muted-soft">
            {col.hint}
          </p>
        ) : (
          cards.map((card) => (
            <BriefCardView key={card.id} card={card} onOpen={onOpen} />
          ))
        )}
      </div>
    </section>
  );
}

/* ── Carte ────────────────────────────────────────────────────────────────── */

function BriefCardView({
  card: c,
  onOpen,
}: {
  card: BriefCard;
  onOpen: (id: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  const isRunning = c.statut === "EN_COURS" || c.statut === "EN_ATTENTE";
  const canResume = c.statut === "INTERROMPU" || c.statut === "ECHEC";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(c.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(c.id);
        }
      }}
      className="group cursor-pointer rounded-md border border-navy-700 bg-navy-900 p-3.5 text-left transition-colors duration-200 ease-out hover:border-royal/40"
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/competitors/${c.concurrentId}`}
          onClick={(e) => e.stopPropagation()}
          className="min-w-0 truncate text-[14px] font-semibold tracking-[-0.01em] text-bone hover:text-royal-light"
        >
          {c.concurrentNom}
        </Link>
        <StatutBadge statut={c.statut} />
      </div>

      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-soft">
        {c.semaine}
      </p>

      {/* Progression si en cours */}
      {isRunning ? (
        <div className="mt-3">
          <div className="flex items-center justify-between font-mono text-[10.5px] text-muted-soft">
            <span className="truncate">{c.etape ?? "Initialisation"}</span>
            <span className="tabular-nums">{c.progressionPct}%</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-navy-800">
            <div
              className="h-full rounded-full bg-royal transition-all duration-500 ease-out"
              style={{ width: `${Math.max(4, c.progressionPct)}%` }}
            />
          </div>
        </div>
      ) : c.synthese ? (
        <SyntheseExtrait synthese={c.synthese} />
      ) : canResume ? (
        <p className="mt-2 text-[12px] italic leading-[1.5] text-warning">
          Interrompu à {c.progressionPct}%.
        </p>
      ) : null}

      {/* Footer métriques */}
      <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-navy-700 pt-2.5 font-mono text-[10px] text-muted-soft">
        <span className="inline-flex items-center gap-1">
          <FileText size={11} strokeWidth={1.6} />
          {c.sourceCount}
        </span>
        {c.hasSwot ? <Chip label="SWOT" /> : null}
        {c.hasPestel ? <Chip label="PESTEL" /> : null}
        {c.signalCount > 0 ? (
          <span className="inline-flex items-center gap-1 text-warning">
            <Sparkles size={11} strokeWidth={1.6} />
            {c.signalCount}
          </span>
        ) : null}
      </div>

      {/* Reprise si interrompu / échec */}
      {canResume ? (
        <button
          type="button"
          disabled={pending}
          onClick={(e) => {
            e.stopPropagation();
            startTransition(async () => {
              await relancerRapport(c.id);
            });
          }}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-royal/40 bg-royal/10 px-2.5 py-1 text-[11px] font-medium text-royal-light transition-colors hover:bg-royal/20 disabled:opacity-50"
        >
          <RotateCw
            size={12}
            strokeWidth={1.8}
            className={cn(pending && "animate-spin")}
          />
          Relancer
        </button>
      ) : null}
    </article>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded border border-navy-700 bg-navy-800 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.08em] text-muted">
      {label}
    </span>
  );
}

/**
 * Aperçu de la synthèse sur la carte Kanban : titre du rapport + amorce de la
 * synthèse exécutive, en TEXTE BRUT (Markdown retiré). Le rendu Markdown complet
 * reste dans le panneau de détail et la page Rapports.
 */
function SyntheseExtrait({ synthese }: { synthese: string }) {
  const { title, excerpt } = titleAndExcerpt(synthese, 160);
  if (!title && !excerpt) return null;
  return (
    <div className="mt-2">
      {title ? (
        <p className="line-clamp-2 text-[13px] font-medium leading-[1.4] text-bone">
          {title}
        </p>
      ) : null}
      {excerpt ? (
        <p className="mt-1 line-clamp-2 text-[12px] leading-[1.5] text-muted">
          {excerpt}
        </p>
      ) : null}
    </div>
  );
}

/* ── Board vide (aucun rapport encore) ────────────────────────────────────── */

function EmptyBoard({ competitorCount }: { competitorCount: number }) {
  return (
    <div className="flex flex-1 items-center justify-center px-8 py-16">
      <div className="flex max-w-[440px] flex-col items-center text-center">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-royal/10 ring-1 ring-royal/25"
        >
          <RadarIcon size={22} strokeWidth={1.5} className="text-royal" />
        </span>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-royal">
          Première veille
        </p>
        <h2 className="mt-3 font-display text-[26px] font-light leading-[1.1] tracking-[-0.02em] text-bone">
          {competitorCount > 0
            ? "Votre radar est prêt."
            : "Ajoutez un concurrent pour commencer."}
        </h2>
        <p className="mt-3 text-[13.5px] leading-[1.6] text-muted">
          {competitorCount > 0
            ? "Lancez la veille hebdomadaire : l'agent traite vos concurrents un par un et remplit le tableau, de « Programmé » à « À lire »."
            : "RADAR surveille un concurrent à la fois, chaque semaine. Commencez par en ajouter dans vos paramètres."}
        </p>
        <div className="mt-6">
          {competitorCount > 0 ? (
            <LaunchButton />
          ) : (
            <Link
              href="/settings"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-royal px-5 text-[13px] font-semibold text-bone transition-colors hover:bg-royal-light"
            >
              <UserPlus size={15} strokeWidth={1.8} />
              Ajouter un concurrent
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Bouton « Lancer la veille » ──────────────────────────────────────────── */

function LaunchButton({ compact = false }: { compact?: boolean }) {
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
        setFeedback({ tone: "ok", text: res.message ?? "Veille lancée." });
        router.refresh();
      } else {
        setFeedback({ tone: "err", text: res.error });
      }
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        compact ? "items-end" : "items-center",
      )}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={cn(
          "inline-flex items-center gap-2 rounded-md font-semibold transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60",
          compact
            ? "h-8 border border-royal/40 bg-royal/10 px-3 text-[12px] text-royal-light hover:bg-royal/20"
            : "h-10 bg-royal px-5 text-[13px] text-bone hover:bg-royal-light",
        )}
      >
        {pending ? (
          <Loader2
            size={compact ? 13 : 15}
            strokeWidth={1.8}
            className="animate-spin"
          />
        ) : (
          <RadarIcon size={compact ? 13 : 15} strokeWidth={1.8} />
        )}
        {pending ? "Lancement…" : "Lancer la veille"}
      </button>
      {feedback ? (
        <p
          className={cn(
            "max-w-[320px] text-[11px] leading-[1.4]",
            compact ? "text-right" : "text-center",
            feedback.tone === "ok" ? "text-success" : "text-error",
          )}
        >
          {feedback.text}
        </p>
      ) : null}
    </div>
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
