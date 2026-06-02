"use client";

import { useEffect, useState } from "react";

/**
 * Dot safran qui apparaît périodiquement (toutes les 2.4s) à un angle aléatoire
 * sur l'arc extérieur (rayon 360, origine 60,540).
 * Anime via les classes CSS `signal-dot` (blink) et `signal-ring` (ring expansion).
 *
 * La key change à chaque tick pour forcer le remount des éléments SVG et relancer
 * les animations CSS depuis le début.
 */
export function SignalDot() {
  const [pos, setPos] = useState<{ x: number; y: number; k: number }>({
    x: 0,
    y: 0,
    k: 0,
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      // Angle aléatoire entre 200° et 265° (quadrant haut-gauche depuis l'origine)
      const angleDeg = 200 + Math.random() * 65;
      const a = (angleDeg * Math.PI) / 180;
      const x = 60 + 360 * Math.cos(a);
      const y = 540 + 360 * Math.sin(a);
      setPos((p) => ({ x, y, k: p.k + 1 }));
      timeoutId = setTimeout(tick, 2400);
    };

    tick();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <svg
      viewBox="0 0 600 600"
      preserveAspectRatio="xMinYMax meet"
      className="absolute bottom-0 left-0 z-[2] size-[720px] max-h-[110%] max-w-[110%]"
      aria-hidden="true"
    >
      <circle
        key={pos.k}
        cx={pos.x}
        cy={pos.y}
        r="5"
        fill="#C77700"
        className="signal-dot"
      />
      <circle
        key={`r-${pos.k}`}
        cx={pos.x}
        cy={pos.y}
        r="5"
        fill="none"
        stroke="#C77700"
        strokeWidth="1.5"
        className="signal-ring"
      />
    </svg>
  );
}
