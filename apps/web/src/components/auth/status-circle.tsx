import type { LucideIcon } from "lucide-react";

const TONE_COLORS = {
  teal: "#2251FF",
  success: "#0F8F65",
  error: "#B42318",
} as const;

export type StatusCircleProps = {
  tone?: keyof typeof TONE_COLORS;
  icon: LucideIcon;
};

/**
 * Cercle 64px avec icône colorée (utilisé en haut des AuthCard de
 * forgot/reset/verify pour signaler le contexte).
 */
export function StatusCircle({ tone = "teal", icon: Icon }: StatusCircleProps) {
  const color = TONE_COLORS[tone];
  return (
    <div className="flex justify-center" aria-hidden="true">
      <div className="flex size-16 items-center justify-center rounded-full border border-navy-700 bg-navy-800">
        <span style={{ color }}>
          <Icon size={24} strokeWidth={1.5} />
        </span>
      </div>
    </div>
  );
}
