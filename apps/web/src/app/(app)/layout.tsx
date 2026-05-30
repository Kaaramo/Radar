import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getOnboardingState } from "@/lib/onboarding/state";

/**
 * Layout group `(app)` — toutes les routes authentifiées + onboardées (dashboard, competitors, settings).
 * Garde session + onboarding complet. Le shell visuel (sidebar + header) est porté
 * par chaque page via `AppShell` pour permettre des variations (drawer, modals).
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const state = await getOnboardingState();
  if (!state.isComplete) redirect("/onboarding");
  return <>{children}</>;
}
