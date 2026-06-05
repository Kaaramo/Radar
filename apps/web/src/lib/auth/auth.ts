import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@radar/database";

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variable d'environnement ${name} manquante. Voir le fichier .env.example a la racine du projet`,
    );
  }
  return value;
};

/**
 * Configuration Better Auth pour RADAR.
 *
 * Source de vérité auth :
 *   - Email/password : géré par Better Auth (Argon2id natif)
 *   - Google OAuth : provider configuré, redirige vers /api/auth/callback/google
 *   - Sessions database-backed via Prisma (table session)
 *   - Verification non-bloquante (PRD § 7.2 critère 4)
 *
 * Routes auto-exposées par Better Auth sur /api/auth/* :
 *   POST /api/auth/sign-in/email
 *   POST /api/auth/sign-up/email
 *   POST /api/auth/sign-in/social (avec body { provider: "google" })
 *   POST /api/auth/sign-out
 *   POST /api/auth/forget-password
 *   POST /api/auth/reset-password
 *   GET  /api/auth/verify-email
 *   POST /api/auth/send-verification-email
 *   GET  /api/auth/session
 */
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: requireEnv("BETTER_AUTH_SECRET"),

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // PRD § 7.2 : la vérification email est non-bloquante.
    // L'utilisateur peut accéder au dashboard, une bannière l'invite à vérifier.
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      clientId: requireEnv("GOOGLE_CLIENT_ID"),
      clientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
    },
  },

  // Plugin Next.js : gère automatiquement les cookies sur les Server Actions.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
