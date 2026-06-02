"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

import { MarkdownView } from "@/components/dashboard/markdown-view";

/**
 * Vue d'impression PDF d'un rapport de veille — premium, dark, charte Radar.
 *
 * Page standalone (sans AppShell) : une page de garde navy de marque + le corps
 * Markdown rendu. Au montage, ouvre automatiquement la boîte d'impression du
 * navigateur (« Enregistrer en PDF »). Une barre flottante (écran uniquement,
 * masquée à l'impression) permet de relancer l'impression ou de revenir.
 *
 * Le rendu PDF respecte les fonds (print-color-adjust: exact) pour conserver le
 * navy de marque, et la page de garde occupe une page entière (break-after).
 */
export function ReportPrint({
  entreprise,
  concurrentNom,
  concurrentSecteur,
  semaine,
  genereLe,
  sourceCount,
  signalCount,
  synthese,
  rapportId,
}: {
  entreprise: string;
  concurrentNom: string;
  concurrentSecteur: string | null;
  semaine: string;
  genereLe: string;
  sourceCount: number;
  signalCount: number;
  synthese: string;
  rapportId: string;
}) {
  useEffect(() => {
    // Laisse les fonts + le layout se stabiliser avant d'ouvrir le dialogue.
    const t = setTimeout(() => window.print(), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="report-print min-h-screen bg-navy text-bone">
      <style>{PRINT_CSS}</style>

      {/* Barre d'action (écran uniquement) */}
      <div className="no-print sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-navy-700 bg-navy/95 px-6 py-3 backdrop-blur">
        <Link
          href={`/reports/${rapportId}`}
          className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-soft transition-colors hover:text-bone"
        >
          <ArrowLeft size={14} strokeWidth={1.6} />
          Retour au rapport
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-royal px-4 text-[12.5px] font-semibold text-bone transition-colors hover:bg-royal-light"
        >
          <Printer size={14} strokeWidth={1.8} />
          Enregistrer en PDF
        </button>
      </div>

      {/* ── Page de garde ──────────────────────────────────────────────── */}
      <section className="pdf-cover relative flex min-h-screen flex-col justify-between overflow-hidden px-[18mm] py-[20mm]">
        {/* Filigrane radar discret */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-[460px] w-[460px] rounded-full border border-royal/15" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-[320px] w-[320px] rounded-full border border-royal/10" />
        <div className="pointer-events-none absolute -right-8 -top-8 h-[180px] w-[180px] rounded-full border border-royal/10" />

        {/* En-tête de marque */}
        <div className="relative flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-royal">
            <span className="h-2 w-2 rounded-full bg-bone" />
          </span>
          <span className="font-display text-[20px] font-semibold tracking-[0.18em] text-bone">
            RADAR
          </span>
        </div>

        {/* Bloc central */}
        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-royal-light">
            Veille concurrentielle · Module M244
          </p>
          <h1 className="mt-5 font-display text-[56px] font-light leading-[1.02] tracking-[-0.02em] text-bone">
            {concurrentNom}
          </h1>
          {concurrentSecteur ? (
            <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-soft">
              {concurrentSecteur}
            </p>
          ) : null}

          <div className="mt-10 h-px w-24 bg-royal" />

          <p className="mt-8 text-[15px] leading-relaxed text-muted">
            Analyse stratégique préparée pour
          </p>
          <p className="mt-1 font-display text-[26px] text-bone">
            {entreprise}
          </p>
        </div>

        {/* Pied de page de garde */}
        <div className="relative flex items-end justify-between border-t border-navy-700 pt-5">
          <div className="flex flex-col gap-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-soft">
            <span>{semaine}</span>
            <span>Généré le {genereLe}</span>
          </div>
          <div className="flex gap-6 font-mono text-[11px] text-muted-soft">
            <span>
              <span className="text-bone">{sourceCount}</span> sources
            </span>
            {signalCount > 0 ? (
              <span>
                <span className="text-bone">{signalCount}</span> signaux
              </span>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── Corps du rapport ───────────────────────────────────────────── */}
      <section className="pdf-content px-[18mm] py-[16mm]">
        <div className="mb-8 flex items-center justify-between border-b border-navy-700 pb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-royal-light">
            Synthèse de veille · {concurrentNom}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-soft">
            {entreprise}
          </span>
        </div>

        <MarkdownView markdown={synthese} />

        <div className="mt-12 border-t border-navy-700 pt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-soft">
          RADAR · Document confidentiel · {entreprise} · {genereLe}
        </div>
      </section>
    </div>
  );
}

const PRINT_CSS = `
.report-print {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
@media print {
  @page { size: A4; margin: 0; }
  html, body {
    background: #051C2C !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .no-print { display: none !important; }
  .pdf-cover {
    min-height: 297mm;
    break-after: page;
    page-break-after: always;
  }
  .pdf-content { min-height: 0; }
}
`;
