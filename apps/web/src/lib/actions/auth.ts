"use server";

import { headers } from "next/headers";
import { APIError } from "better-auth/api";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@radar/database";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  emailSchema,
  type LoginInput,
  type RegisterInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/lib/validators/auth";

export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "EMAIL_NOT_VERIFIED"
  | "EMAIL_ALREADY_EXISTS"
  | "WEAK_PASSWORD"
  | "INVALID_EMAIL"
  | "ACCOUNT_NOT_FOUND"
  | "TOKEN_INVALID"
  | "TOKEN_EXPIRED"
  | "RATE_LIMITED"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR";

export type ActionResult<T = void> =
  | { success: true; data?: T; redirectTo?: string }
  | { success: false; error: AuthErrorCode; details?: string };

const mapApiError = (err: unknown): AuthErrorCode => {
  if (err instanceof APIError) {
    const code = err.body?.code ?? "";
    // Codes Better Auth 1.6.9 (cf. @better-auth/core BASE_ERROR_CODES)
    if (code === "INVALID_EMAIL_OR_PASSWORD") return "INVALID_CREDENTIALS";
    if (code === "EMAIL_NOT_VERIFIED") return "EMAIL_NOT_VERIFIED";
    if (
      code === "USER_ALREADY_EXISTS" ||
      code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
    )
      return "EMAIL_ALREADY_EXISTS";
    if (
      code === "INVALID_PASSWORD" ||
      code === "PASSWORD_TOO_SHORT" ||
      code === "PASSWORD_TOO_LONG"
    )
      return "WEAK_PASSWORD";
    if (code === "INVALID_EMAIL") return "INVALID_EMAIL";
    if (code === "INVALID_TOKEN") return "TOKEN_INVALID";
    if (code === "TOKEN_EXPIRED") return "TOKEN_EXPIRED";
    if (code === "TOO_MANY_REQUESTS") return "RATE_LIMITED";
    console.error("[auth] APIError non mappée:", {
      status: err.status,
      code,
      message: err.body?.message,
    });
    return "SERVER_ERROR";
  }
  console.error("[auth] Erreur non-APIError:", err);
  return "SERVER_ERROR";
};

/**
 * Connexion email/password via Better Auth.
 */
export async function loginAction(
  input: LoginInput,
): Promise<ActionResult<{ userId: string }>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "VALIDATION_ERROR" };
  }

  try {
    const result = await auth.api.signInEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
      headers: await headers(),
    });

    return {
      success: true,
      redirectTo: "/dashboard",
      data: { userId: result.user.id },
    };
  } catch (err) {
    return { success: false, error: mapApiError(err) };
  }
}

/**
 * Inscription email/password via Better Auth.
 * Auto-signin par défaut (configuré dans auth.ts).
 */
export async function registerAction(
  input: RegisterInput,
): Promise<ActionResult<{ userId: string }>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "VALIDATION_ERROR" };
  }

  try {
    const result = await auth.api.signUpEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
        name: parsed.data.name,
      },
      headers: await headers(),
    });

    // PRD § 5.1 : la vérification email est non-bloquante.
    // L'utilisateur est redirigé directement vers l'onboarding (sprint 2).
    // L'écran /verify-email reste accessible pour les liens reçus par email.
    return {
      success: true,
      redirectTo: "/onboarding",
      data: { userId: result.user.id },
    };
  } catch (err) {
    return { success: false, error: mapApiError(err) };
  }
}

/**
 * Demande d'envoi du lien de réinitialisation de mot de passe.
 * Sécurité : retourne TOUJOURS success même si l'email n'existe pas
 * (Better Auth gère ça nativement, ne pas leak l'existence du compte).
 */
export async function forgotPasswordAction(
  input: ForgotPasswordInput,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "VALIDATION_ERROR" };
  }

  try {
    await auth.api.requestPasswordReset({
      body: {
        email: parsed.data.email,
        redirectTo: "/reset-password",
      },
      headers: await headers(),
    });
    return { success: true };
  } catch {
    // Toujours retourner success côté UI (pas de leak)
    return { success: true };
  }
}

/**
 * Réinitialisation du mot de passe via token reçu par email.
 */
export async function resetPasswordAction(
  input: ResetPasswordInput,
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "VALIDATION_ERROR" };
  }

  try {
    await auth.api.resetPassword({
      body: {
        newPassword: parsed.data.password,
        token: parsed.data.token,
      },
      headers: await headers(),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: mapApiError(err) };
  }
}

/**
 * Renvoi de l'email de vérification.
 * Better Auth gère le rate-limiting natif.
 */
export async function resendVerificationAction(
  email: string,
): Promise<ActionResult> {
  try {
    await auth.api.sendVerificationEmail({
      body: { email, callbackURL: "/dashboard" },
      headers: await headers(),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: mapApiError(err) };
  }
}

/**
 * Vérification "email disponible" — appelée en debounce depuis le formulaire
 * d'inscription pour avertir l'utilisateur AVANT submission qu'un compte existe
 * déjà avec cet email. Retourne `{ available: boolean }` (jamais d'erreur côté UI).
 *
 * Compromis sécurité : on accepte le leak "cet email a un compte" car la page
 * de login retourne déjà la même information via "Email ou mot de passe incorrect"
 * vs "Email non vérifié". Le gain UX (pas de submit dans le vide) prime.
 */
export async function checkEmailAvailableAction(
  email: string,
): Promise<{ available: boolean }> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return { available: true };

  try {
    const existing = await prisma.user.findUnique({
      where: { email: parsed.data },
      select: { id: true },
    });
    return { available: !existing };
  } catch (err) {
    console.error("[auth] checkEmailAvailableAction failed:", err);
    return { available: true };
  }
}

/**
 * Déconnexion.
 */
export async function signOutAction(): Promise<ActionResult> {
  try {
    await auth.api.signOut({ headers: await headers() });
    return { success: true, redirectTo: "/login" };
  } catch (err) {
    return { success: false, error: mapApiError(err) };
  }
}
