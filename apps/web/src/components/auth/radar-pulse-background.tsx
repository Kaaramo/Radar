import { SignalDot } from "./signal-dot";

/**
 * Fond animé du panneau branding (split layout) : 3 arcs concentriques teal
 * qui pulsent en cascade depuis l'origine (60, 540), avec rayons 100/220/360.
 * Le `SignalDot` safran apparaît périodiquement sur l'arc extérieur.
 *
 * Les animations sont définies en CSS dans globals.css :
 * - `.arc.arc-1`, `.arc.arc-2`, `.arc.arc-3` : pulse + opacity
 * - `.signal-dot`, `.signal-ring` : blink + ring expansion (2.4s)
 */
export function RadarPulseBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <svg
        viewBox="0 0 600 600"
        preserveAspectRatio="xMinYMax meet"
        className="absolute bottom-0 left-0 size-[720px] max-h-[110%] max-w-[110%]"
      >
        <defs>
          <clipPath id="radar-pulse-clip">
            <rect x="0" y="0" width="600" height="600" />
          </clipPath>
        </defs>
        <g clipPath="url(#radar-pulse-clip)">
          {/* Origine */}
          <circle cx="60" cy="540" r="6" fill="#2251FF" opacity="0.9" />
          {/* Arc 1 (innermost) — radius 100 */}
          <path
            className="arc arc-1"
            d="M 60 440 A 100 100 0 0 1 160 540"
            stroke="#2251FF"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Arc 2 — radius 220 */}
          <path
            className="arc arc-2"
            d="M 60 320 A 220 220 0 0 1 280 540"
            stroke="#2251FF"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Arc 3 (outermost) — radius 360 */}
          <path
            className="arc arc-3"
            d="M 60 180 A 360 360 0 0 1 420 540"
            stroke="#2251FF"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </svg>
      <SignalDot />
    </div>
  );
}
