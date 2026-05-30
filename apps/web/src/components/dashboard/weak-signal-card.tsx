import { Flame } from "lucide-react";

import type { WeakSignal } from "@/lib/dashboard/types";

export type WeakSignalCardProps = {
  signal: WeakSignal;
};

/** Couleur d'intensité dérivée du score de pertinence (0-10). */
function toneFor(score: number | null): { color: string; label: string } {
  const s = score ?? 0;
  if (s >= 7) return { color: "#B42318", label: "Fort" };
  if (s >= 4) return { color: "#C77700", label: "Moyen" };
  return { color: "#8FA3B8", label: "Faible" };
}

/**
 * Card d'un signal faible — border-top coloré selon le score de pertinence.
 */
export function WeakSignalCard({ signal }: WeakSignalCardProps) {
  const tone = toneFor(signal.scorePertinence);

  return (
    <article
      className="rounded-lg border border-navy-700 bg-navy-900 p-5 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg"
      style={{ borderTop: `3px solid ${tone.color}` }}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[12.5px] font-medium text-bone">
          {signal.concurrentNom}
        </span>
        <span className="font-mono text-[11px] text-muted-soft">
          {signal.detecteLe}
        </span>
      </div>

      <h3 className="mb-2 text-[15px] font-semibold leading-[1.4] text-bone">
        {signal.intitule}
      </h3>
      {signal.description ? (
        <p className="mb-4 text-[13px] leading-[1.55] text-muted">
          {signal.description}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 border-t border-navy-700 pt-3 text-[12px]">
        <span
          className="inline-flex items-center gap-1.5"
          style={{ color: tone.color }}
        >
          <Flame size={14} strokeWidth={1.6} />
          <strong className="font-semibold">{tone.label}</strong>
        </span>
        {signal.scorePertinence !== null ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-muted-soft">
            <strong className="font-semibold tabular-nums text-muted">
              {signal.scorePertinence}/10
            </strong>
            pertinence
          </span>
        ) : null}
      </div>
    </article>
  );
}
