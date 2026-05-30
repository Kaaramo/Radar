import { redirect } from "next/navigation";

import { getOnboardingState } from "@/lib/onboarding/state";

/**
 * Routeur racine `/onboarding` — redirige vers l'étape la plus avancée
 * non encore complétée, ou vers `/dashboard` si l'onboarding est terminé.
 *
 * Aucune UI : ce Server Component se contente d'un `redirect()`.
 */
export default async function OnboardingRouterPage(): Promise<never> {
  const state = await getOnboardingState();

  switch (state.nextStep) {
    case "step-1":
      redirect("/onboarding/step-1");
    case "step-2":
      redirect("/onboarding/step-2");
    case "step-3":
      redirect("/onboarding/step-3");
    case "success":
      redirect("/onboarding/success");
    case "done":
    default:
      redirect("/dashboard");
  }
}
