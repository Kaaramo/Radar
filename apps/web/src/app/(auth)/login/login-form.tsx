"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader } from "lucide-react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthBrandingPanel } from "@/components/auth/auth-branding-panel";
import { AuthDivider } from "@/components/auth/auth-divider";
import { FormInput } from "@/components/auth/form-input";
import { GoogleOAuthButton } from "@/components/auth/google-oauth-button";
import { InlineAlert } from "@/components/auth/inline-alert";
import { RadarLockupAuth } from "@/components/brand/logo";
import { loginSchema } from "@/lib/validators/auth";
import { loginAction } from "@/lib/actions/auth";
import { authClient } from "@/lib/auth/auth-client";

type AuthError =
  | "validation"
  | "invalid"
  | "unverified"
  | "rate"
  | "server"
  | null;

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [authError, setAuthError] = useState<AuthError>(null);
  const [isPending, startTransition] = useTransition();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const parsed = submitted ? loginSchema.safeParse({ email, password }) : null;
  const fieldErrors =
    parsed && !parsed.success
      ? Object.fromEntries(
          parsed.error.issues.map((issue) => [issue.path[0], issue.message]),
        )
      : {};
  const emailErr = fieldErrors.email ?? null;
  const passwordErr = fieldErrors.password ?? null;

  const focusFirstInvalid = () => {
    const target = emailErr
      ? emailRef.current
      : passwordErr
        ? passwordRef.current
        : null;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.focus({ preventScroll: true });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setAuthError(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setAuthError("validation");
      requestAnimationFrame(focusFirstInvalid);
      return;
    }

    startTransition(async () => {
      const res = await loginAction(result.data);
      if (res.success) {
        router.push(res.redirectTo ?? "/dashboard");
      } else if (res.error === "INVALID_CREDENTIALS") {
        setAuthError("invalid");
      } else if (res.error === "EMAIL_NOT_VERIFIED") {
        setAuthError("unverified");
      } else if (res.error === "RATE_LIMITED") {
        setAuthError("rate");
      } else {
        setAuthError("server");
      }
    });
  };

  return (
    <AuthLayout
      panel={<AuthBrandingPanel variant="login" />}
      form={
        <form onSubmit={handleSubmit} noValidate>
          <RadarLockupAuth height={36} />
          <div className="h-12" />
          <h1 className="m-0 text-[40px] font-bold leading-[1.15] tracking-[-0.01em] text-bone">
            Bon retour.
          </h1>
          <p className="mt-2 text-[16px] leading-[1.5] text-muted">
            Connectez-vous pour reprendre la veille.
          </p>
          <div className="h-8" />

          {authError === "invalid" && (
            <>
              <InlineAlert tone="error">
                Email ou mot de passe incorrect
              </InlineAlert>
              <div className="h-4" />
            </>
          )}
          {authError === "unverified" && (
            <>
              <InlineAlert tone="warn">
                Vérifiez d&apos;abord votre email.{" "}
                <Link
                  href="#"
                  className="font-medium text-royal hover:text-royal-light hover:underline hover:underline-offset-4"
                >
                  Renvoyer le lien
                </Link>
              </InlineAlert>
              <div className="h-4" />
            </>
          )}
          {authError === "validation" && (
            <>
              <InlineAlert tone="warn">
                Veuillez vérifier les informations saisies ci-dessous.
              </InlineAlert>
              <div className="h-4" />
            </>
          )}
          {authError === "rate" && (
            <>
              <InlineAlert tone="warn">
                Trop de tentatives. Réessayez dans quelques minutes.
              </InlineAlert>
              <div className="h-4" />
            </>
          )}
          {authError === "server" && (
            <>
              <InlineAlert tone="error">
                Connexion impossible pour le moment. Vérifiez votre connexion et
                réessayez.
              </InlineAlert>
              <div className="h-4" />
            </>
          )}

          <GoogleOAuthButton
            label="Continuer avec Google"
            onClick={() => {
              void authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
              });
            }}
          />
          <div className="h-6" />
          <AuthDivider />
          <div className="h-6" />

          <FormInput
            ref={emailRef}
            id="login-email"
            label="Email professionnel"
            type="email"
            placeholder="nom@entreprise.ma"
            leadingIcon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailErr}
            autoComplete="email"
          />
          <div className="h-4" />
          <FormInput
            ref={passwordRef}
            id="login-pw"
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            leadingIcon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordErr}
            autoComplete="current-password"
          />
          <div className="mt-2.5 flex justify-end">
            <Link
              href="/forgot-password"
              className="text-[13px] font-medium text-royal transition-colors duration-150 ease-out hover:text-royal-light hover:underline hover:underline-offset-4"
            >
              Mot de Passe Oublié ?
            </Link>
          </div>

          <div className="h-6" />
          <button
            type="submit"
            disabled={isPending}
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-md bg-royal text-[15px] font-medium text-navy transition-colors duration-150 ease-out hover:bg-royal-dark active:translate-y-[0.5px] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending && (
              <span className="animate-spin-slow">
                <Loader size={16} strokeWidth={1.5} />
              </span>
            )}
            <span>{isPending ? "Connexion..." : "Se connecter"}</span>
          </button>

          <div className="h-8" />
          <p className="text-center text-[13px] font-medium text-muted">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="font-medium text-royal transition-colors duration-150 ease-out hover:text-royal-light hover:underline hover:underline-offset-4"
            >
              Créer un compte
            </Link>
          </p>
        </form>
      }
    />
  );
}
