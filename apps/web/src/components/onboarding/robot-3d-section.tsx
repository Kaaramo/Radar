"use client";

import { InteractiveRobotSpline } from "./interactive-3d-robot";

const ROBOT_SCENE_URL =
  "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

/**
 * Section robot 3D affichée en haut de `/onboarding/success`.
 *
 * - Hauteur fixe (420px desktop, 320px mobile) pour que le robot soit visible
 *   en entier sans troncature en haut.
 * - Background navy (cohérent avec le hero juste en dessous).
 * - Masque dégradé en bas pour fondre visuellement avec le hero `OnboardingSuccessClient`.
 * - `pointer-events-auto` sur le canvas Spline : le user peut interagir avec le robot
 *   (drag / hover), mais le masque dégradé n'intercepte pas les clics.
 *
 * Note de perf : le canvas WebGL Spline pèse ~300-500 KB de runtime + scène
 * chargée depuis prod.spline.design. Premier render attendu ~1-3 s sur
 * connexion moyenne. Lazy + Suspense géré par `InteractiveRobotSpline`.
 */
export function Robot3DSection() {
  return (
    <section
      aria-hidden="true"
      className="relative w-full h-[320px] md:h-[420px] overflow-hidden bg-navy"
    >
      <InteractiveRobotSpline
        scene={ROBOT_SCENE_URL}
        className="absolute inset-0 h-full w-full"
      />
      {/* Masque dégradé en bas : transition douce vers le hero navy */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-navy"
      />
      {/* Cache le watermark « Built with Spline » (plan gratuit Spline) :
          il apparaît en bas-droite du canvas, taille ~140x36px. On le couvre
          avec un rectangle bg-navy aux dimensions adéquates pour rester
          cohérent avec la charte (aucun logo tiers visible). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-12 w-44 bg-navy"
      />
    </section>
  );
}
