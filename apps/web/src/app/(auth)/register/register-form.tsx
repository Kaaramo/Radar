"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Loader } from "lucide-react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthBrandingPanel } from "@/components/auth/auth-branding-panel";
import { AuthDivider } from "@/components/auth/auth-divider";
import { FormInput } from "@/components/auth/form-input";
import { GoogleOAuthButton } from "@/components/auth/google-oauth-button";
import { InlineAlert } from "@/components/auth/inline-alert";
import { PasswordStrength } from "@/components/auth/password-strength";
import { RadarLockupAuth } from "@/components/brand/logo";
import { registerSchema } from "@/lib/validators/auth";
import { registerAction, checkEmailAvailableAction } from "@/lib/actions/auth";
import { authClient } from "@/lib/auth/auth-client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PW = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

type GlobalError =
  | "validation"
  | "exists"
  | "weak_password"
  | "rate"
  | "server"
  | null;

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [globalError, setGlobalError] = useState<GlobalError>(null);
  const [emailTaken, setEmailTaken] = useState(false);
  const [isPending, startTransition] = useTransition();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const nameOk = name.trim().length >= 2;
  const emailOk = EMAIL_RE.test(email);
  const pwOk = STRONG_PW.test(password);

  // Vérification live "email disponible" (debounce 400ms).
  // On ne lance la requête qu'une fois l'email syntaxiquement valide pour
  // éviter de spammer le serveur à chaque keystroke.
  useEffect(() => {
    if (!emailOk) {
      setEmailTaken(false);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      const { available } = await checkEmailAvailableAction(email);
      if (!cancelled) setEmailTaken(!available);
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [email, emailOk]);

  const nameErr =
    submitted && !nameOk ? "Nom complet requis (min. 2 caractères)" : null;
  const emailErr = submitted
    ? !emailOk
      ? "Format d'email invalide"
      : emailTaken
        ? "Cet email a déjà un compte"
        : null
    : emailTaken
      ? "Cet email a déjà un compte"
      : null;
  const pwErr =
    submitted && !pwOk ? "Min. 8 caractères, 1 majuscule, 1 chiffre" : null;

  const focusFirstInvalid = () => {
    const target = !nameOk
      ? nameRef.current
      : !emailOk
        ? emailRef.current
        : !pwOk
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
    setGlobalError(null);

    const result = registerSchema.safeParse({ name, email, password });
    if (!result.success) {
      setGlobalError("validation");
      requestAnimationFrame(focusFirstInvalid);
      return;
    }

    if (emailTaken) {
      setGlobalError("exists");
      requestAnimationFrame(() => {
        emailRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        emailRef.current?.focus({ preventScroll: true });
      });
      return;
    }

    startTransition(async () => {
      const res = await registerAction(result.data);
      if (res.success) {
        router.push(res.redirectTo ?? "/verify-email");
        return;
      }
      if (res.error === "EMAIL_ALREADY_EXISTS") {
        setEmailTaken(true);
        setGlobalError("exists");
        requestAnimationFrame(() => {
          emailRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          emailRef.current?.focus({ preventScroll: true });
        });
      } else if (res.error === "WEAK_PASSWORD") {
        setGlobalError("weak_password");
        requestAnimationFrame(() => {
          passwordRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          passwordRef.current?.focus({ preventScroll: true });
        });
      } else if (res.error === "RATE_LIMITED") {
        setGlobalError("rate");
      } else {
        setGlobalError("server");
      }
    });
  };

  return (
    <AuthLayout
      panel={<AuthBrandingPanel variant="register" />}
      form={
        <form onSubmit={handleSubmit} noValidate>
          <RadarLockupAuth height={36} />
          <div className="h-12" />
          <h1 className="m-0 text-[40px] font-bold leading-[1.15] tracking-[-0.01em] text-bone">
            Démarrez votre veille.
          </h1>
          <p className="mt-2 text-[16px] leading-[1.5] text-muted">
            Créez votre compte. Le premier mouvement détecté arrive demain
            matin.
          </p>
          <div className="h-8" />

          {globalError === "exists" && (
            <>
              <InlineAlert tone="warn">
                Cet email est déjà utilisé.{" "}
                <Link
                  href={`/login?email=${encodeURIComponent(email)}`}
                  className="font-medium text-royal hover:text-royal-light hover:underline hover:underline-offset-4"
                >
                  Se connecter ?
                </Link>
              </InlineAlert>
              <div className="h-4" />
            </>
          )}
          {globalError === "validation" && (
            <>
              <InlineAlert tone="warn">
                Veuillez vérifier les informations saisies ci-dessous.
              </InlineAlert>
              <div className="h-4" />
            </>
          )}
          {globalError === "weak_password" && (
            <>
              <InlineAlert tone="warn">
                Mot de passe trop faible : minimum 8 caractères, 1 majuscule et
                1 chiffre.
              </InlineAlert>
              <div className="h-4" />
            </>
          )}
          {globalError === "rate" && (
            <>
              <InlineAlert tone="warn">
                Trop de tentatives. Réessayez dans quelques minutes.
              </InlineAlert>
              <div className="h-4" />
            </>
          )}
          {globalError === "server" && (
            <>
              <InlineAlert tone="error">
                Impossible de créer le compte pour le moment. Vérifiez votre
                connexion et réessayez.
              </InlineAlert>
              <div className="h-4" />
            </>
          )}

          <GoogleOAuthButton
            label="S'inscrire avec Google"
            onClick={() => {
              void authClient.signIn.social({
                provider: "google",
                callbackURL: "/onboarding",
              });
            }}
          />
          <div className="h-6" />
          <AuthDivider />
          <div className="h-6" />

          <FormInput
            ref={nameRef}
            id="reg-name"
            label="Nom complet"
            placeholder="Karim Berrada"
            leadingIcon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
            success={nameOk && name.length > 0}
            error={nameErr}
            autoComplete="name"
          />
          <div className="h-4" />
          <FormInput
            ref={emailRef}
            id="reg-email"
            label="Email professionnel"
            type="email"
            placeholder="nom@entreprise.ma"
            leadingIcon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            success={emailOk && !emailTaken}
            error={emailErr}
            autoComplete="email"
          />
          <div className="h-4" />
          <FormInput
            ref={passwordRef}
            id="reg-pw"
            label="Mot de passe"
            type="password"
            placeholder="Min. 8 caractères"
            leadingIcon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={pwErr}
            autoComplete="new-password"
          />
          <PasswordStrength password={password} />

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
            <span>
              {isPending ? "Création du compte..." : "Créer mon compte"}
            </span>
          </button>

          <div className="h-4" />
          <p className="text-center text-[12.5px] leading-[1.55] text-muted-soft">
            En créant un compte, vous acceptez nos{" "}
            <Link href="#" className="font-medium text-royal hover:underline">
              Conditions d&apos;utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="#" className="font-medium text-royal hover:underline">
              Politique de confidentialité
            </Link>
            .
          </p>

          <div className="h-6" />
          <p className="text-center text-[13px] font-medium text-muted">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-medium text-royal transition-colors duration-150 ease-out hover:text-royal-light hover:underline hover:underline-offset-4"
            >
              Se connecter
            </Link>
          </p>
        </form>
      }
    />
  );
}
