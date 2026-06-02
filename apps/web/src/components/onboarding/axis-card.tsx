"use client";

import type { CSSProperties } from "react";
import { CheckCircle2 } from "lucide-react";

import type { Axe } from "@/lib/onboarding/axes";

export type AxisCardProps = {
  axe: Axe;
  selected: boolean;
  onToggle: () => void;
};

/**
 * Card d'axe toggleable. Lorsque sélectionnée :
 *   - bg = axe.color@10%, border 2px axe.color, glow box-shadow axe.color@1F
 *   - check coin haut-droit avec animation spring `axis-check-in` 300ms
 *
 * Source design : .tmp-design/onboarding/radar/project/onb-screens.jsx (AxisCard).
 */
export function AxisCard({ axe, selected, onToggle }: AxisCardProps) {
  const Icon = axe.icon;

  // CSS variables pour le tinting et le glow (consommées par les classes ci-dessous).
  const styleVars = {
    "--axis-color": axe.color,
    "--axis-tint": `${axe.color}1A`, // 10%
    "--axis-tint-strong": `${axe.color}29`, // 16%
    "--axis-glow": `${axe.color}1F`, // 12%
  } as CSSProperties;

  const baseClass =
    "relative flex w-full flex-col gap-3 rounded-[12px] text-left transition-[transform,border-color,box-shadow,background-color] duration-200 ease-out cursor-pointer";

  const stateClass = selected
    ? "border-2 p-[19px] hover:-translate-y-0.5"
    : "border border-navy-700 bg-navy-900 p-5 hover:-translate-y-0.5";

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className={`${baseClass} ${stateClass}`}
      style={{
        ...styleVars,
        ...(selected
          ? {
              background: "var(--axis-tint)",
              borderColor: "var(--axis-color)",
              boxShadow: "0 0 24px var(--axis-glow)",
            }
          : undefined),
      }}
    >
      {selected ? (
        <span
          aria-hidden="true"
          className="axis-check-in absolute right-3.5 top-3.5 inline-flex"
          style={{ color: "var(--axis-color)" }}
        >
          <CheckCircle2 size={18} strokeWidth={1.5} />
        </span>
      ) : null}

      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{
            background: "var(--axis-tint-strong)",
            color: "var(--axis-color)",
          }}
        >
          <Icon size={18} strokeWidth={1.5} />
        </div>
        <div className="text-[16px] font-semibold text-bone">{axe.title}</div>
      </div>
      <div className="m-0 text-[14px] leading-[1.5] text-muted">
        {axe.description}
      </div>
      <div className="font-mono text-[13px] italic text-muted-soft">
        → {axe.example}
      </div>
    </button>
  );
}
