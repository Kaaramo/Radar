/**
 * Mark RADAR animée au boot : 3 arcs teal qui se dessinent en cascade
 * (stroke-dashoffset 80 → 0, délais 200/400/600 ms) puis dot safran qui blink 2 fois.
 *
 * Variant `animated` (défaut true) : déclenche l'animation au mount.
 * Variant `animated=false` : état final figé (utile pour SSR ou variantes statiques).
 *
 * Source design : .tmp-design/onboarding/radar/project/onb-screens.jsx (RadarMarkBoot).
 */
export function RadarMarkBoot({ animated = true }: { animated?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="relative z-[1] h-16 w-16"
      aria-hidden="true"
    >
      <circle cx="14" cy="50" r="3" fill="#2251FF" />
      <path
        d="M 14 38 A 12 12 0 0 1 26 50"
        stroke="#2251FF"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        className={animated ? "boot-arc boot-arc-1" : undefined}
      />
      <path
        d="M 14 26 A 24 24 0 0 1 38 50"
        stroke="#2251FF"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.65"
        className={animated ? "boot-arc boot-arc-2" : undefined}
      />
      <path
        d="M 14 14 A 36 36 0 0 1 50 50"
        stroke="#2251FF"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
        className={animated ? "boot-arc boot-arc-3" : undefined}
      />
      <circle
        cx="45"
        cy="22"
        r="3"
        fill="#C77700"
        className={animated ? "boot-dot" : undefined}
      />
    </svg>
  );
}
