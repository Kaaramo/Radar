import { redirect } from "next/navigation";

import { Step1Form } from "@/components/onboarding/step-1-form";
import { getOnboardingState } from "@/lib/onboarding/state";

export const metadata = {
  title: "RADAR · Étape 1 : Votre entreprise",
};

export default async function Step1Page() {
  const state = await getOnboardingState();

  // Si l'onboarding est déjà fini, on n'autorise pas le retour à l'étape 1.
  if (state.isComplete) redirect("/dashboard");

  return (
    <Step1Form
      defaultValues={{
        nomEntreprise: state.profil?.nomEntreprise ?? "",
        siteWeb: state.profil?.siteWeb ?? "",
      }}
    />
  );
}
