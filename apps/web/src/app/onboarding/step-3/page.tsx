import { redirect } from "next/navigation";

import { Step3Form } from "@/components/onboarding/step-3-form";
import { AXES_KEYS, type AxeKey } from "@/lib/onboarding/axes";
import { getOnboardingState } from "@/lib/onboarding/state";

export const metadata = {
  title: "RADAR · Étape 3 : Vos axes",
};

const isAxeKey = (v: string): v is AxeKey =>
  (AXES_KEYS as readonly string[]).includes(v);

export default async function Step3Page() {
  const state = await getOnboardingState();

  if (state.isComplete) redirect("/dashboard");
  if (!state.profil) redirect("/onboarding/step-1");
  if (state.concurrentsCount === 0) redirect("/onboarding/step-2");

  const initialAxes = (state.profil.axes ?? []).filter(isAxeKey);

  return <Step3Form initialAxes={initialAxes} />;
}
