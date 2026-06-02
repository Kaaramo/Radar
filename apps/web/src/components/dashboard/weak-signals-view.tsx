import { Radar } from "lucide-react";

import { WeakSignalCard } from "@/components/dashboard/weak-signal-card";
import type { WeakSignal } from "@/lib/dashboard/types";

/**
 * Vue Signaux faibles — liste les SignalFaible détectés par OpenClaw sur
 * l'ensemble des rapports du user, triés par pertinence décroissante.
 */
export function WeakSignalsView({ signals }: { signals: WeakSignal[] }) {
  const sorted = [...signals].sort(
    (a, b) => (b.scorePertinence ?? 0) - (a.scorePertinence ?? 0),
  );

  return (
    <div className="flex w-full flex-col overflow-y-auto px-8 pb-12 pt-6">
      <header className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-warning/10 text-warning">
          <Radar size={20} strokeWidth={1.6} />
        </span>
        <div>
          <h1 className="m-0 text-[20px] font-semibold tracking-[-0.01em] text-bone">
            Signaux faibles
          </h1>
          <p className="m-0 mt-1 max-w-[640px] text-[12.5px] leading-[1.6] text-muted">
            Tendances émergentes détectées par croisement de sources mineures
            sur les rapports de veille.
          </p>
        </div>
      </header>

      {sorted.length === 0 ? (
        <div className="mt-10 rounded-md border border-dashed border-navy-700 bg-navy-900 px-6 py-14 text-center">
          <p className="m-0 text-[13.5px] text-muted">
            Aucun signal faible détecté pour l&apos;instant.
          </p>
          <p className="m-0 mt-1.5 text-[12.5px] text-muted-soft">
            Lancez un cycle de veille pour que l&apos;agent détecteur croise vos
            sources.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {sorted.map((s) => (
            <WeakSignalCard key={s.id} signal={s} />
          ))}
        </div>
      )}
    </div>
  );
}
