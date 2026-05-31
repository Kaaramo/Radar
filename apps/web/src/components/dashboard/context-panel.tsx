"use client";

import {
  SquareArrowOutUpRight as ExternalLink,
  FileText,
  Globe,
  MousePointerClick,
  X,
} from "lucide-react";

import Link from "next/link";

import { SwotAccordion } from "@/components/dashboard/swot-accordion";
import { CraapBadge, CraapLegend } from "@/components/dashboard/craap-badge";
import { MarkdownView } from "@/components/dashboard/markdown-view";
import type { RapportDetail, RapportStatut } from "@/lib/dashboard/types";

export type ContextPanelProps = {
  rapport: RapportDetail | null;
  onClose: () => void;
};

const STATUT_LABEL: Record<RapportStatut, { label: string; color: string }> = {
  EN_ATTENTE: { label: "En file", color: "var(--color-muted-soft)" },
  EN_COURS: { label: "En cours", color: "var(--color-royal-light)" },
  TERMINE: { label: "Terminé", color: "var(--color-success)" },
  INTERROMPU: { label: "Interrompu", color: "var(--color-warning)" },
  ECHEC: { label: "Échec", color: "var(--color-error)" },
};

/**
 * Panneau droit fixe (380px) — détail du rapport sélectionné (monde Rapport).
 */
export function ContextPanel({ rapport, onClose }: ContextPanelProps) {
  if (!rapport) return <EmptyState />;
  return <SelectedState rapport={rapport} onClose={onClose} />;
}

function EmptyState() {
  return (
    <aside className="flex h-full w-[380px] shrink-0 flex-col items-center justify-center border-l border-navy-700 bg-navy px-8 text-center">
      <span
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-full border border-navy-700 bg-navy-900 text-muted-soft"
      >
        <MousePointerClick size={20} strokeWidth={1.6} />
      </span>
      <p className="mt-5 max-w-[220px] text-[13px] leading-[1.6] text-muted">
        Sélectionnez un concurrent pour voir la synthèse, les sources et les
        analyses SWOT / PESTEL.
      </p>
    </aside>
  );
}

function SelectedState({
  rapport: r,
  onClose,
}: {
  rapport: RapportDetail;
  onClose: () => void;
}) {
  const st = STATUT_LABEL[r.statut];

  return (
    <aside className="flex h-full w-[380px] shrink-0 flex-col overflow-y-auto border-l border-navy-700 bg-navy">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-navy-700 px-5">
        <span
          className="font-mono text-[10px] font-medium uppercase tracking-[0.12em]"
          style={{ color: st.color }}
        >
          {st.label}
        </span>
        <span className="font-mono text-[10.5px] text-muted-soft">
          · {r.createdAt}
        </span>
        <span className="flex-1" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le panneau de détail"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-soft transition-colors duration-150 ease-out hover:bg-navy-900 hover:text-bone"
        >
          <X size={14} strokeWidth={1.6} />
        </button>
      </div>

      {/* Titre concurrent */}
      <div className="border-b border-navy-700 px-5 py-5">
        <h2 className="m-0 text-[19px] font-semibold leading-[1.3] tracking-[-0.01em] text-bone">
          {r.concurrentNom}
        </h2>
        {r.concurrentSecteur ? (
          <p className="m-0 mt-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted-soft">
            {r.concurrentSecteur}
          </p>
        ) : null}

        {/* Progression si en cours */}
        {r.statut === "EN_COURS" || r.statut === "EN_ATTENTE" ? (
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
        ) : null}
      </div>

      {/* Synthèse (rendu Markdown) */}
      {r.synthese ? (
        <Section label="Synthèse">
          <MarkdownView markdown={r.synthese} />
          <Link
            href={`/reports/${r.id}`}
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-royal transition-colors hover:text-royal-light"
          >
            Ouvrir le rapport complet →
          </Link>
        </Section>
      ) : null}

      {/* Sources */}
      {r.sources.length > 0 ? (
        <Section label={`Sources collectées · ${r.sources.length}`}>
          <div className="flex flex-col gap-1.5">
            {r.sources.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 rounded-md border border-navy-700 bg-navy-900 px-3 py-2 transition-colors duration-150 ease-out hover:border-royal/40"
              >
                <Globe
                  size={13}
                  strokeWidth={1.6}
                  className="shrink-0 text-muted-soft"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-medium text-bone">
                    {s.titre ?? s.domain}
                  </div>
                  <div className="truncate font-mono text-[10.5px] text-muted-soft">
                    {s.domain}
                  </div>
                </div>
                <CraapBadge total={s.craapTotal} />
                <ExternalLink
                  size={12}
                  strokeWidth={1.6}
                  className="shrink-0 text-muted-soft"
                />
              </a>
            ))}
          </div>
          <CraapLegend />
        </Section>
      ) : null}

      {/* SWOT — accordéon déroulant (panneau étroit) */}
      {r.swot ? (
        <Section label="Analyse SWOT">
          <SwotAccordion swot={r.swot} />
        </Section>
      ) : null}

      {/* PESTEL */}
      {r.pestel ? (
        <Section label="Analyse PESTEL">
          <PestelList pestel={r.pestel} />
        </Section>
      ) : null}

      {/* Signaux faibles */}
      {r.signaux.length > 0 ? (
        <Section label={`Signaux faibles · ${r.signaux.length}`} last>
          <div className="flex flex-col gap-2.5">
            {r.signaux.map((s) => (
              <div
                key={s.id}
                className="rounded-md border border-navy-700 bg-navy-900 px-3 py-2.5"
              >
                <div className="flex items-start gap-2">
                  <FileText
                    size={12}
                    strokeWidth={1.6}
                    className="mt-0.5 shrink-0 text-warning"
                  />
                  <div className="min-w-0">
                    <p className="m-0 text-[12.5px] font-medium text-bone">
                      {s.intitule}
                    </p>
                    {s.description ? (
                      <p className="m-0 mt-1 text-[12px] leading-[1.5] text-muted">
                        {s.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Rien encore (rapport vide / en cours) */}
      {!r.synthese &&
      r.sources.length === 0 &&
      !r.swot &&
      !r.pestel &&
      r.signaux.length === 0 ? (
        <div className="px-5 py-8 text-center text-[12.5px] text-muted-soft">
          Les résultats apparaîtront ici au fur et à mesure de la collecte.
        </div>
      ) : null}
    </aside>
  );
}

function Section({
  label,
  children,
  last,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`px-5 py-4 ${last ? "" : "border-b border-navy-700"}`}>
      <h3 className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-soft">
        {label}
      </h3>
      {children}
    </div>
  );
}

function PestelList({
  pestel,
}: {
  pestel: NonNullable<RapportDetail["pestel"]>;
}) {
  const dims: Array<[string, string[]]> = [
    ["Politique", pestel.political],
    ["Économique", pestel.economic],
    ["Social", pestel.social],
    ["Technologique", pestel.technological],
    ["Environnemental", pestel.environmental],
    ["Légal", pestel.legal],
  ];
  return (
    <div className="flex flex-col gap-3">
      {dims
        .filter(([, items]) => items.length > 0)
        .map(([label, items]) => (
          <div key={label}>
            <p className="m-0 mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-soft">
              {label}
            </p>
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {items.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-[12.5px] leading-[1.5] text-muted"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-royal"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}
