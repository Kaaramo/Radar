import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { auth } from "@/lib/auth/auth";

/**
 * Layout group `/onboarding/*` — garde session.
 * Le wrapper visuel (header + stepper + footer) est porté par `OnboardingShell`
 * dans chaque page client, pour que chaque étape contrôle sa propre stepper.
 */
export default async function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  return <>{children}</>;
}
