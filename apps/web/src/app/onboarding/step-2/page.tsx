import { redirect } from "next/navigation";

import { Step2Form } from "@/components/onboarding/step-2-form";
import type { CompanyCardData } from "@/components/onboarding/company-card";
import {
  extractConcurrentSuggestions,
  getOnboardingState,
} from "@/lib/onboarding/state";

export const metadata = {
  title: "RADAR · Étape 2 : Vos concurrents",
};

export default async function Step2Page() {
  const state = await getOnboardingState();

  if (state.isComplete) redirect("/dashboard");
  if (!state.profil) redirect("/onboarding/step-1");

  const initialItems: CompanyCardData[] = state.concurrents.map((c) => ({
    id: c.id,
    nom: c.nom,
    siteWeb: c.siteWeb ?? null,
  }));

  // Suggestions Deep Research dédupliquées contre les concurrents déjà ajoutés.
  // Vide si l'enrichment est en cours, FAILED, ou en raw-fallback — la section
  // n'apparaît simplement pas, pas de message d'attente intrusif.
  const existingNames = new Set(
    state.concurrents.map((c) => c.nom.trim().toLowerCase()),
  );
  const suggestions = extractConcurrentSuggestions(
    state.profil.enrichissement,
    existingNames,
  );

  return <Step2Form initialItems={initialItems} suggestions={suggestions} />;
}
