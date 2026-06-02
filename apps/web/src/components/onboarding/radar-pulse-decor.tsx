/**
 * Décor SVG pour l'écran Succès — 3 cercles concentriques teal qui pulsent en cascade.
 * Rayons 80, 160, 240px dans un viewBox -300 -300 600 600 (origine au centre).
 *
 * Source design : .tmp-design/onboarding/radar/project/onb-screens.jsx (RadarPulseDecor).
 */
export function RadarPulseDecor() {
  return (
    <svg
      viewBox="-300 -300 600 600"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <circle
        r="80"
        cx="0"
        cy="0"
        fill="none"
        stroke="#2251FF"
        strokeWidth="1.5"
        className="rpd-arc-1"
      />
      <circle
        r="160"
        cx="0"
        cy="0"
        fill="none"
        stroke="#2251FF"
        strokeWidth="1.5"
        className="rpd-arc-2"
      />
      <circle
        r="240"
        cx="0"
        cy="0"
        fill="none"
        stroke="#2251FF"
        strokeWidth="1.5"
        className="rpd-arc-3"
      />
    </svg>
  );
}
