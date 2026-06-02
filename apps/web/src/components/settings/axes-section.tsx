"use client";

import { useState, useTransition } from "react";

import { updateAxes } from "@/lib/actions/settings";
import { AXES, type AxeKey } from "@/lib/onboarding/axes";

export type AxesSectionProps = {
  /** Axes initialement actifs (Server Component parent les charge depuis la BDD). */
  initialSelectedAxes: AxeKey[];
};

/**
 * Section Axes interactive — toggle Apple-style par axe + persistance temps réel.
 *
 * Flow d'un toggle :
 *   1. Click → state local change instantanément (optimistic).
 *   2. `useTransition` déclenche `updateAxes()` Server Action en arrière-plan.
 *   3. Pendant la transition, le toggle est légèrement dimmé (pointer-events ok,
 *      le user peut toggle un autre axe ; chaque action est indépendante).
 *   4. Si l'action échoue (rare : payload invalide ou session perdue), on
 *      rollback le state local et on remet l'axe dans son ancien état.
 *
 * Pas de toast (Apple-like, silencieux) : l'animation du switch suffit comme
 * feedback. En cas d'erreur, rollback visuel = signal naturel.
 */
export function AxesSection({ initialSelectedAxes }: AxesSectionProps) {
  const [selectedAxes, setSelectedAxes] =
    useState<AxeKey[]>(initialSelectedAxes);
  const [, startTransition] = useTransition();

  const toggle = (key: AxeKey) => {
    const wasActive = selectedAxes.includes(key);
    const next = wasActive
      ? selectedAxes.filter((k) => k !== key)
      : [...selectedAxes, key];

    // Optimistic update : on bouge le switch tout de suite
    setSelectedAxes(next);

    // Persistance backend en arrière-plan
    startTransition(async () => {
      const result = await updateAxes({ axes: next });
      if (!result.success) {
        // Rollback silencieux : on remet l'ancien état
        setSelectedAxes(
          wasActive ? [...next, key] : next.filter((k) => k !== key),
        );
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="m-0 font-display text-[28px] font-light leading-[1.1] tracking-[-0.02em] text-bone">
          Axes de surveillance
        </h1>
        <p className="m-0 mt-1.5 text-[13px] leading-[1.55] text-muted-soft">
          Choisissez les axes que votre radar doit surveiller. Les changements
          sont enregistrés instantanément.
        </p>
      </header>

      <section className="overflow-hidden rounded-xl border border-navy-700 bg-navy-900/60">
        {AXES.map((axe, i) => {
          const isActive = selectedAxes.includes(axe.key);
          const Icon = axe.icon;
          return (
            <div
              key={axe.key}
              className={`flex items-center gap-3 px-5 py-4 ${
                i < AXES.length - 1 ? "border-b border-navy-700/40" : ""
              }`}
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors duration-200 ease-out"
                style={{
                  background: isActive ? `${axe.color}20` : "transparent",
                  color: isActive ? axe.color : "var(--color-muted-soft)",
                }}
              >
                <Icon size={14} strokeWidth={1.6} />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`m-0 text-[13.5px] font-medium transition-colors duration-200 ease-out ${
                    isActive ? "text-bone" : "text-muted-soft"
                  }`}
                >
                  {axe.title}
                </p>
                <p className="m-0 mt-0.5 text-[12px] leading-[1.45] text-muted-soft">
                  {axe.description}
                </p>
              </div>
              <ToggleSwitch
                checked={isActive}
                onToggle={() => toggle(axe.key)}
                label={`Activer ${axe.title}`}
                activeColor={axe.color}
              />
            </div>
          );
        })}
      </section>
    </div>
  );
}

/* ── Toggle iOS-style premium ─────────────────────────────────────── */

type ToggleSwitchProps = {
  checked: boolean;
  onToggle: () => void;
  label: string;
  /** Couleur de l'axe : utilisée comme accent en background ON. */
  activeColor: string;
};

/**
 * Toggle iOS-style — proportions exactes : 50×30px pill, thumb 26px, padding 2px.
 *
 * - OFF : background `navy-700` + inset shadow subtle pour suggérer une concavité.
 *         Thumb à gauche (translateX 0).
 * - ON  : background = couleur de l'axe (pleinement saturée, pas d'opacité).
 *         Thumb à droite (translateX 20px).
 * - Thumb : blanc pur avec ombre 2 couches + ring 1px noir 5% pour définir
 *           proprement le bord même sur fond clair.
 * - Transition spring (cubic-bezier 0.34, 1.56, 0.64, 1) sur 280ms = sensation
 *   physique iOS où le thumb "rebondit" très légèrement à la fin.
 * - Focus visible : ring royal blue + offset navy pour contraste max.
 *
 * Touch target : 50×30px = au-dessus du minimum WCAG (24×24) et confortable
 * sur mobile (le pill seul + sa zone d'interaction = ~44×44 effectif).
 */
function ToggleSwitch({
  checked,
  onToggle,
  label,
  activeColor,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className="relative inline-flex h-[30px] w-[50px] shrink-0 cursor-pointer items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
      style={{
        background: checked ? activeColor : "var(--color-navy-700)",
        boxShadow: checked
          ? `0 0 0 1px ${activeColor}, inset 0 0 0 1px rgba(255,255,255,0.06)`
          : "inset 0 1px 2px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)",
        transition:
          "background-color 280ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 280ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <span
        aria-hidden="true"
        className="block h-[26px] w-[26px] rounded-full bg-white"
        style={{
          transform: checked ? "translateX(22px)" : "translateX(2px)",
          boxShadow:
            "0 2px 4px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2), inset 0 0 0 0.5px rgba(0,0,0,0.04)",
          transition: "transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      />
    </button>
  );
}
