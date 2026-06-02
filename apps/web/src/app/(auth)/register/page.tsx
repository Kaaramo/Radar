import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/auth";

import { RegisterForm } from "./register-form";

/**
 * Server entry — bloque les utilisateurs déjà connectés (pas d'inscription
 * possible avec une session active). Routeur `/onboarding` aiguille ensuite.
 */
export default async function RegisterPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/onboarding");
  return <RegisterForm />;
}
