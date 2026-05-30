"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, CheckCircle2, Compass } from "lucide-react";

import { completeOnboarding } from "@/lib/actions/onboarding";
import { AXES, type AxeKey } from "@/lib/onboarding/axes";

import { OnboardingShell } from "./onboarding-shell";
import { SectionHeader } from "./section-header";
import { AxisCard } from "./axis-card";

export type Step3FormProps = {
  initialAxes?: AxeKey[];
};

/**
 * Étape 3 : sélection multiple parmi 5 axes.
 * Click « Armer le radar » → completeOnboarding → redirect /onboarding/success.
 */
export function Step3Form({ initialAxes = [] }: Step3FormProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<AxeKey[]>(initialAxes);
  const [shake, setShake] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const allSelected = selected.length === AXES.length;
  const recommended = selected.length >= 3;

  const triggerShake = () => {
    setShake(false);
    requestAnimationFrame(() => setShake(true));
    setTimeout(() => setShake(false), 450);
  };

  const toggle = (key: AxeKey) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const toggleAll = () => {
    setSelected(allSelected ? [] : AXES.map((a) => a.key));
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      triggerShake();
      return;
    }
    setServerError(null);
    startTransition(async () => {
      const result = await completeOnboarding({ axes: selected });
      if (!result.success) {
        setServerError(
          result.details ??
            "Une erreur est survenue. Réessayez dans un instant.",
        );
        return;
      }
      router.push("/onboarding/success");
    });
  };

  return (
    <OnboardingShell
      step={3}
      backHref="/onboarding/step-2"
      onNext={handleSubmit}
      nextLabel="Armer le radar"
      nextIcon={<Check size={16} strokeWidth={1.8} />}
      isPending={isPending}
    >
      <SectionHeader
        icon={Compass}
        iconColor="#2251FF"
        title="Quels axes stratégiques surveiller ?"
        subtitle="Sélectionnez les types de mouvements que notre agent doit détecter chez vos concurrents. Vous pourrez ajuster à tout moment depuis Paramètres."
        subMaxWidth={540}
      />

      <div className="h-4" />

      {/* Toggle all */}
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={toggleAll}
          className="rounded px-1.5 py-1 text-[13px] font-medium text-royal transition-colors duration-150 ease-out hover:text-royal-light hover:underline hover:underline-offset-4"
        >
          {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
        </button>
      </div>

      {/* Grid 2 cols, dernière card en col-span 2 */}
      <div
        className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${
          shake ? "onb-shake" : ""
        }`}
      >
        {AXES.map((axe, i) => (
          <div
            key={axe.key}
            className={i === AXES.length - 1 ? "md:col-span-2" : undefined}
          >
            <AxisCard
              axe={axe}
              selected={selected.includes(axe.key)}
              onToggle={() => toggle(axe.key)}
            />
          </div>
        ))}
      </div>

      {/* Compteur */}
      <div
        className={`mt-4 flex w-full items-center justify-end gap-1.5 text-[13px] ${
          selected.length === 0 ? "text-error" : "text-muted-soft"
        }`}
      >
        {selected.length === 0 ? (
          <>
            <AlertCircle size={14} strokeWidth={1.5} aria-hidden="true" />
            <span>Sélectionnez au moins 1 axe</span>
          </>
        ) : (
          <>
            <CheckCircle2
              size={14}
              strokeWidth={1.5}
              style={{ color: "#0F8F65" }}
              aria-hidden="true"
            />
            <span>
              <strong className="font-semibold text-bone">
                {selected.length}
              </strong>{" "}
              axe(s) sélectionné(s)
              {recommended ? (
                <em className="ml-1 italic text-muted-soft">(recommandé)</em>
              ) : null}
            </span>
          </>
        )}
      </div>

      {serverError ? (
        <div
          role="alert"
          className="mt-6 rounded-md border border-error/30 border-l-[3px] border-l-error bg-error/10 px-4 py-3 text-[14px] leading-[1.45] text-error"
        >
          {serverError}
        </div>
      ) : null}
    </OnboardingShell>
  );
}
