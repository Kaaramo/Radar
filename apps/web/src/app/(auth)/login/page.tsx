import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/auth";

import { LoginForm } from "./login-form";

/**
 * Server entry — bloque les utilisateurs déjà connectés.
 * Routeur `/onboarding` se charge d'aiguiller vers la bonne étape (ou /dashboard).
 */
export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/onboarding");
  return <LoginForm />;
}
