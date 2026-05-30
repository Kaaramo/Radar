import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

export type InlineAlertProps = {
  tone?: "error" | "warn";
  children: ReactNode;
};

/**
 * Bandeau d'alerte affiché en haut d'un formulaire (au-dessus du Google OAuth).
 * Border-left 3px qui code la sévérité (rouge / safran).
 */
export function InlineAlert({ tone = "error", children }: InlineAlertProps) {
  const borderClass = tone === "warn" ? "border-l-warning" : "border-l-error";
  const iconClass = tone === "warn" ? "text-warning" : "text-error";

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-md border border-navy-700 border-l-[3px] ${borderClass} bg-navy-800 px-4 py-3 text-[14px] leading-[1.45] text-bone`}
    >
      <span className={`flex shrink-0 pt-px ${iconClass}`} aria-hidden="true">
        <AlertTriangle size={16} strokeWidth={1.5} />
      </span>
      <span>{children}</span>
    </div>
  );
}
