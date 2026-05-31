import { Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import type { WeakSignal } from "@/lib/dashboard/types";

/**
 * Carte « signal faible » premium et sobre. Accent latéral discret selon le
 * score de pertinence. Charte : surface navy, ambre réservé à l'accent signal.
 */
export function SignalCard({ signal }: { signal: WeakSignal }) {
  const score = signal.scorePertinence;
  const fort = score !== null && score >= 70;

  return (
    <article
      className={cn(
        "rounded-lg border border-navy-700 bg-navy-900 p-5 transition-colors duration-200 hover:border-warning/40",
        fort && "border-l-2 border-l-warning",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-warning/10 text-warning"
        >
          <Zap size={14} strokeWidth={1.6} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="m-0 text-[15px] font-semibold leading-snug text-bone">
            {signal.intitule}
          </h3>
          {signal.description ? (
            <p className="m-0 mt-2 text-[13px] leading-[1.6] text-muted">
              {signal.description}
            </p>
          ) : null}
          <div className="mt-3 flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.06em] text-muted-soft">
            <span>{signal.detecteLe}</span>
            {score !== null ? (
              <span
                className={cn(
                  "tabular-nums",
                  fort ? "text-warning" : "text-muted",
                )}
              >
                Pertinence {score}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
