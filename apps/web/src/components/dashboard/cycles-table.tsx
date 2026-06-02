"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { FileText, RotateCw, XCircle, Zap, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CycleAuditRow } from "@/lib/dashboard/types";
import { StatutBadge } from "@/components/dashboard/statut-badge";
import { CraapBadge } from "@/components/dashboard/craap-badge";
import { relancerRapport, marquerRapportEchec } from "@/lib/actions/dashboard";

/**
 * Audit trail des cycles (page /cycles). Une ligne par rapport, avec preuve
 * détaillée (sources, signaux, CRAAP, durée) et actions de reprise pour les
 * cycles interrompus / en échec. Transparence M244 exigée par le jury.
 */
export function CyclesTable({ rows }: { rows: CycleAuditRow[] }) {
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <CycleRow key={row.rapportId} row={row} />
      ))}
    </div>
  );
}

function CycleRow({ row }: { row: CycleAuditRow }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const canResume = row.statut === "INTERROMPU" || row.statut === "ECHEC";

  function run(action: () => Promise<{ success: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await action();
      if (!res.success) setError(res.error ?? "Échec de l'opération.");
    });
  }

  return (
    <div className="rounded-lg border border-line/50 bg-navy-800/40 p-4">
      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard?r=${row.rapportId}`}
          className="group flex min-w-0 flex-1 items-center gap-2"
        >
          <span className="truncate font-display text-base text-bone group-hover:text-royal">
            {row.concurrentNom}
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-fog group-hover:text-royal" />
        </Link>
        <StatutBadge statut={row.statut} />
      </div>

      {/* Progression si interrompu / en cours */}
      {(row.statut === "EN_COURS" || row.statut === "INTERROMPU") && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-fog">{row.etape ?? "—"}</span>
            <span className="font-mono text-royal">{row.progressionPct}%</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-navy-700">
            <div
              className={cn(
                "h-full transition-all",
                row.statut === "INTERROMPU" ? "bg-amber" : "bg-royal",
              )}
              style={{ width: `${row.progressionPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Métriques (preuve d'audit) */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fog">
        <span className="inline-flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" strokeWidth={1.5} />
          {row.sourceCount} sources
        </span>
        {row.signalCount > 0 && (
          <span className="inline-flex items-center gap-1 text-amber">
            <Zap className="h-3.5 w-3.5" strokeWidth={1.5} />
            {row.signalCount} signaux
          </span>
        )}
        {row.hasSwot && (
          <span className="rounded border border-line/50 px-1.5 py-0.5 font-mono uppercase">
            SWOT
          </span>
        )}
        {row.hasPestel && (
          <span className="rounded border border-line/50 px-1.5 py-0.5 font-mono uppercase">
            PESTEL
          </span>
        )}
        {row.craapMoyen !== null && (
          <span className="inline-flex items-center gap-1">
            CRAAP moyen <CraapBadge total={row.craapMoyen} />
          </span>
        )}
        <span className="ml-auto">
          {row.lanceLe}
          {row.duree ? ` · ${row.duree}` : ""}
        </span>
      </div>

      {/* Lecture du rapport Markdown */}
      {row.hasReport ? (
        <div className="mt-3 border-t border-line/40 pt-3">
          <Link
            href={`/reports/${row.rapportId}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-royal transition-colors hover:text-royal-light"
          >
            <FileText className="h-3.5 w-3.5" strokeWidth={1.6} />
            Lire le rapport
          </Link>
        </div>
      ) : null}

      {/* Actions de reprise */}
      {canResume && (
        <div className="mt-3 flex items-center gap-2 border-t border-line/40 pt-3">
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => relancerRapport(row.rapportId))}
            className="inline-flex items-center gap-1.5 rounded-md bg-royal px-3 py-1.5 text-xs font-medium text-bone transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <RotateCw
              className={cn("h-3.5 w-3.5", pending && "animate-spin")}
              strokeWidth={2}
            />
            Relancer
          </button>
          {row.statut === "INTERROMPU" && (
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => marquerRapportEchec(row.rapportId))}
              className="inline-flex items-center gap-1.5 rounded-md border border-line/50 px-3 py-1.5 text-xs font-medium text-fog transition-colors hover:text-bone disabled:opacity-50"
            >
              <XCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
              Clôturer
            </button>
          )}
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
      )}
    </div>
  );
}
