import { createAuthClient } from "better-auth/react";

/**
 * Client Better Auth pour les composants React (Client Components).
 *
 * Usage typique :
 *   import { authClient } from "@/lib/auth/auth-client";
 *   await authClient.signIn.social({ provider: "google" });
 *   await authClient.signIn.email({ email, password });
 *   const { data: session } = authClient.useSession();
 *
 * Pour les actions password reset / email verify : passer par les Server Actions
 * de @/lib/actions/auth.ts (qui appellent auth.api.* côté serveur).
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = authClient;
