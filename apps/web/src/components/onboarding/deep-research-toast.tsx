"use client";

import { Sparkles } from "lucide-react";

export type DeepResearchToastProps = {
  visible: boolean;
};

/**
 * Toast en haut à droite (top:88px right:24px) — slide-down + fade-in 200ms ease-out.
 * Visible quand le prop `visible` passe à true. Contrôlé par le parent (auto-dismiss côté caller).
 */
export function DeepResearchToast({ visible }: DeepResearchToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none absolute right-6 top-[88px] z-20 inline-flex items-center gap-2 rounded-md border border-navy-700 border-l-[3px] border-l-royal bg-navy-800 px-4 py-3 text-[13px] text-bone shadow-lg transition-[opacity,transform] duration-200 ease-out ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-1.5 opacity-0"
      }`}
    >
      <span className="inline-flex text-royal">
        <Sparkles size={14} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <span>Deep Research lancé...</span>
    </div>
  );
}
