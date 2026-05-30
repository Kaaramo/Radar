"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { RadarLockupLight } from "@/components/brand/logo";

import { StepIndicator } from "./step-indicator";

export type OnboardingShellProps = {
  step: 1 | 2 | 3;
  canGoBack?: boolean;
  backHref?: string;
  onNext?: () => void | Promise<void>;
  nextLabel?: string;
  nextIcon?: ReactNode;
  isPending?: boolean;
  isNextDisabled?: boolean;
  children: ReactNode;
  /** rendu au-dessus du main, hors flow (utile pour les toasts position absolute) */
  overlay?: ReactNode;
};

/**
 * Layout commun aux 3 étapes du wizard onboarding :
 *  - Header sticky : logo (centré 640px max) + stepper
 *  - Main scrollable : contenu max-w 640px centré
 *  - Footer sticky : back / next (back désactivé à l'étape 1)
 *
 * Source design : `.tmp-design/onboarding/radar/project/onb-chrome.jsx` (OnboardingLayout).
 */
export function OnboardingShell({
  step,
  canGoBack = true,
  backHref,
  onNext,
  nextLabel = "Suivant",
  nextIcon,
  isPending = false,
  isNextDisabled = false,
  children,
  overlay,
}: OnboardingShellProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) router.push(backHref);
    else router.back();
  };

  const handleNext = () => {
    if (isPending || isNextDisabled) return;
    void onNext?.();
  };

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-navy">
      {overlay}

      {/* Subtil radar-grid en bg pour donner de la matière premium sans distraire */}
      <div
        className="radar-grid-bg pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
      />

      <header className="relative z-[5] bg-gradient-to-b from-bg-primary via-bg-primary/85 to-transparent px-6 pb-4 pt-6">
        <div className="mx-auto max-w-[640px]">
          <RadarLockupLight height={28} />
        </div>
        <div className="mx-auto mt-6 max-w-[640px]">
          <StepIndicator current={step} />
        </div>
      </header>

      <main className="relative z-[1] flex-1 overflow-y-auto px-6 pb-8 pt-2">
        <div className="mx-auto max-w-[640px] py-6">{children}</div>
      </main>

      <footer className="relative z-[5] border-t border-navy-700 bg-navy px-6 py-4">
        <div className="mx-auto flex max-w-[640px] items-center justify-between gap-3">
          <div>
            {canGoBack ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isPending}
                className="inline-flex h-11 min-w-[120px] items-center justify-center gap-2 rounded-md border border-navy-700 bg-transparent px-[18px] text-[15px] font-medium text-bone transition-colors duration-150 ease-out hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft size={16} strokeWidth={1.5} />
                <span>Retour</span>
              </button>
            ) : (
              <div />
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={handleNext}
              disabled={isPending || isNextDisabled}
              className="inline-flex h-11 min-w-[120px] items-center justify-center gap-2 rounded-md bg-royal px-[18px] text-[15px] font-medium text-navy transition-colors duration-150 ease-out hover:bg-royal-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>{nextLabel}</span>
              {nextIcon ?? <ArrowRight size={16} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
