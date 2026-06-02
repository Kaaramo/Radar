import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/auth";

/**
 * Route handler unique qui expose tous les endpoints Better Auth sur /api/auth/*.
 * Couvre : sign-in/email, sign-up/email, sign-in/social, sign-out,
 *          forget-password, reset-password, verify-email, send-verification-email,
 *          session, callback/google, etc.
 */
export const { GET, POST } = toNextJsHandler(auth);
