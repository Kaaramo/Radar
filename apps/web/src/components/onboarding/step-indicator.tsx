import { Fragment } from "react";
import { Check } from "lucide-react";

const STEP_LABELS = [
  "Votre entreprise",
  "Vos concurrents",
  "Vos axes",
] as const;

export type StepIndicatorProps = {
  current: 1 | 2 | 3;
};

/**
 * Stepper 3 étapes — pulse box-shadow sur l'étape active, connecteur teal pour les étapes complétées.
 * Labels masqués sous 768px (mobile compact).
 */
export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div
      role="progressbar"
      aria-label="Progression de l'onboarding"
      aria-valuemin={1}
      aria-valuemax={3}
      aria-valuenow={current}
      className="flex items-start justify-between gap-0"
    >
      {[1, 2, 3].map((n, i) => {
        const completed = n < current;
        const active = n === current;

        const circleClass = completed
          ? "border-0 bg-royal text-navy"
          : active
            ? "onb-pulse border-2 border-royal bg-navy-900 text-royal"
            : "border border-navy-700 bg-transparent text-muted-soft";

        const labelClass =
          completed || active ? "text-bone" : "text-muted-soft";

        return (
          <Fragment key={n}>
            <div
              className="flex w-[100px] shrink-0 flex-col items-center gap-2 max-md:w-8"
              aria-current={active ? "step" : undefined}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full font-display text-[14px] font-medium transition-all duration-200 ease-out ${circleClass}`}
              >
                {completed ? (
                  <Check size={16} strokeWidth={1.5} />
                ) : (
                  <span>{n}</span>
                )}
              </div>
              <div
                className={`text-[13px] font-medium transition-colors duration-200 ease-out max-md:hidden ${labelClass}`}
              >
                {STEP_LABELS[i]}
              </div>
            </div>
            {n < 3 ? (
              <div
                className={`mt-[15px] h-0.5 flex-1 rounded-full ${
                  n < current ? "bg-royal" : "bg-navy-700"
                }`}
                aria-hidden="true"
              />
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}
