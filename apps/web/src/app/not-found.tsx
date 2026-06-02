import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Robot3DSection } from "@/components/onboarding/robot-3d-section";

export const metadata = {
  title: "Page introuvable",
};

/**
 * Page 404 globale (App Router : `not-found.tsx` à la racine `app/`).
 *
 * Réutilise le robot Spline de fin d'onboarding pour rester cohérent avec
 * l'identité de marque, puis propose un retour au dashboard.
 *
 * Le bouton pointe vers `/dashboard`, route protégée par `(app)/layout.tsx` :
 *   1. `getOnboardingState()` redirige vers `/login` si pas de session ;
 *   2. le layout redirige vers `/onboarding` si l'onboarding n'est pas terminé ;
 *   3. sinon le dashboard s'affiche.
 * La vérification « connecté puis onboarding fait » est donc garantie au clic,
 * sans logique dupliquée ici.
 */
export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-navy px-6 text-center">
      {/* Robot Spline en fond */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-90">
        <Robot3DSection />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-royal-light">
          Erreur 404
        </p>
        <h1 className="font-display text-5xl font-light leading-[1.05] tracking-[-0.02em] text-bone">
          Cette page est hors radar.
        </h1>
        <p className="max-w-md text-[15px] leading-relaxed text-mist">
          La page que vous cherchez n&apos;existe pas ou a été déplacée. Revenez
          à votre tableau de bord pour reprendre votre veille.
        </p>
        <Link
          href="/dashboard"
          className="mt-1 inline-flex items-center gap-2 rounded-md bg-royal px-5 py-2.5 text-sm font-semibold text-bone transition-colors hover:bg-royal-light"
        >
          Retour au dashboard
          <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
        </Link>
      </div>
    </div>
  );
}
