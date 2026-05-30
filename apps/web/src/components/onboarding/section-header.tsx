import type { LucideIcon } from "lucide-react";

export type SectionHeaderProps = {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  subtitle?: string;
  subMaxWidth?: number;
};

/**
 * Bloc d'introduction d'une étape : icône carrée 48px + H2 28px + sous-titre 16px.
 * Source design : .tmp-design/onboarding/radar/project/onb-chrome.jsx (SectionHeader).
 */
export function SectionHeader({
  icon: Icon,
  iconColor = "#2251FF",
  title,
  subtitle,
  subMaxWidth = 480,
}: SectionHeaderProps) {
  return (
    <div className="text-left">
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-[12px] border border-navy-700 bg-navy-800"
        style={{ color: iconColor }}
      >
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <h2 className="m-0 text-[28px] font-semibold leading-[1.25] tracking-[-0.01em] text-bone">
        {title}
      </h2>
      {subtitle ? (
        <p
          className="m-0 mt-2 text-[16px] leading-[1.55] text-muted"
          style={{ maxWidth: subMaxWidth }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
