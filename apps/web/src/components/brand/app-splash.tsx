"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import { RadarWordmarkLight } from "@/components/brand/logo";

/**
 * Splash de démarrage RADAR.
 *
 * Affiché en overlay plein écran à la PREMIÈRE ouverture de la session
 * (mémorisé via sessionStorage : non rejoué en navigation ni en refresh de
 * la même session). Logo Radar centré + barre de chargement épurée qui se
 * remplit (scaleX, GPU), puis fondu de sortie (opacity) qui révèle l'app.
 *
 * Le routing (connecté → /dashboard, sinon → /login, onboarding incomplet →
 * /onboarding) est déjà géré côté serveur (page.tsx + (app)/layout.tsx). Ce
 * composant est une couche purement visuelle par-dessus ce boot.
 */
const STORAGE_KEY = "radar:splash-shown";

// useLayoutEffect côté client (masquage avant peinture, pas de flash), useEffect
// au rendu serveur pour éviter le warning React.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Phase = "boot" | "leaving" | "done";

export function AppSplash() {
  const [phase, setPhase] = useState<Phase>("boot");

  // Déjà vu cette session → on masque instantanément (avant peinture).
  useIsomorphicLayoutEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) setPhase("done");
  }, []);

  if (phase === "done") return null;

  return (
    <div
      role="status"
      aria-label="Chargement de RADAR"
      onTransitionEnd={() => {
        if (phase !== "leaving") return;
        sessionStorage.setItem(STORAGE_KEY, "1");
        setPhase("done");
      }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy transition-opacity duration-300 ease-out ${
        phase === "leaving" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-7">
        <RadarWordmarkLight className="h-auto w-[min(72vw,620px)]" />
        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-muted-soft">
          Veille concurrentielle
        </p>
      </div>

      <div className="absolute bottom-[12vh] left-1/2 w-[200px] -translate-x-1/2">
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-navy-700">
          <div
            className="animate-splash-bar h-full w-full bg-royal"
            onAnimationEnd={() => setPhase("leaving")}
          />
        </div>
      </div>
    </div>
  );
}
