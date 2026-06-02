import { redirect } from "next/navigation";

import { OnboardingSuccessClient } from "@/components/onboarding/onboarding-success-client";
import { Robot3DSection } from "@/components/onboarding/robot-3d-section";
import { DeepResearchSection } from "@/components/settings/deep-research-section";
import { getOnboardingState } from "@/lib/onboarding/state";

export const metadata = {
  title: "RADAR · Radar armé",
};

/**
 * Page récap onboarding.
 *
 * Affiche en haut le hero « Radar armé » (animations premium + 3 stats), puis
 * dessous le résultat du Deep Research (profil business détecté, concurrents,
 * insights, sources). Si l'enrichissement est encore IN_PROGRESS quand le
 * user arrive, le composant `DeepResearchSection` affiche un état "Analyse en
 * cours" + `DeepResearchPoller` qui auto-refresh quand le statut change.
 *
 * Bouton CTA non-bloquant : le user peut accéder au dashboard à tout moment,
 * même si l'analyse n'est pas finie (le résultat restera consultable dans
 * /settings?section=deep-research).
 */
export default async function OnboardingSuccessPage() {
  const state = await getOnboardingState();

  // Garde-fou : on n'arrive ici qu'après completeOnboarding (sinon onboardingCompleteLe est null).
  if (!state.profil?.onboardingCompleteLe) redirect("/onboarding");

  const profil = state.profil;
  const enrichissementStatut = profil.enrichissementStatut ?? "IDLE";

  return (
    <>
      {/* Robot 3D Spline en haut de page — interactif (drag, hover). */}
      <Robot3DSection />

      <OnboardingSuccessClient
        concurrentsCount={state.concurrentsCount}
        axesCount={profil.axes.length}
        deepResearchStatut={enrichissementStatut}
      />

      {/* Section profil business — réutilise le composant déjà utilisé sur /settings */}
      <section className="mx-auto w-full max-w-[920px] px-6 py-16">
        <DeepResearchSection
          enrichissement={profil.enrichissement}
          enrichissementLe={profil.enrichissementLe}
          enrichissementVer={profil.enrichissementVer}
          enrichissementStatut={enrichissementStatut}
          enrichissementErreur={profil.enrichissementErreur}
          onboardingCompleteLe={profil.onboardingCompleteLe}
          showRelaunchActions={false}
          hideSuggestedCompetitors={true}
          headerTitle="Analyse de votre entreprise"
          hideDate={true}
        />
      </section>
    </>
  );
}
