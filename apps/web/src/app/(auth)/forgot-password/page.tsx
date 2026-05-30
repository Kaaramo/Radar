"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, KeyRound, MailCheck } from "lucide-react";

import { AuthCard } from "@/components/auth/auth-card";
import { FormInput } from "@/components/auth/form-input";
import { ResendCountdownButton } from "@/components/auth/resend-countdown-button";
import { StatusCircle } from "@/components/auth/status-circle";
import { forgotPasswordSchema } from "@/lib/validators/auth";
import { forgotPasswordAction } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<"form" | "sent">("form");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const parsed = submitted ? forgotPasswordSchema.safeParse({ email }) : null;
  const emailErr =
    parsed && !parsed.success
      ? (parsed.error.issues[0]?.message ?? null)
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) return;

    startTransition(async () => {
      const res = await forgotPasswordAction(result.data);
      if (res.success) {
        setStage("sent");
      }
    });
  };

  if (stage === "sent") {
    return (
      <AuthCard>
        <StatusCircle tone="success" icon={MailCheck} />
        <div className="h-6" />
        <h2 className="m-0 text-center text-[28px] font-semibold leading-[1.25] tracking-[-0.01em] text-bone">
          Email envoyé
        </h2>
        <p className="m-0 mt-2 text-center text-[16px] leading-[1.55] text-muted">
          Vérifiez votre boîte de réception à{" "}
          <strong className="font-semibold text-bone">{email}</strong>. Le lien
          expire dans 1 heure.
        </p>
        <div className="h-6" />
        <ResendCountdownButton initialSeconds={60} label="Renvoyer l'email" />
        <div className="h-4" />
        <Link
          href="/login"
          className="flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-royal transition-colors duration-150 ease-out hover:text-royal-light"
        >
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
          <span>Retour à la connexion</span>
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} noValidate>
        <StatusCircle tone="teal" icon={KeyRound} />
        <div className="h-6" />
        <h2 className="m-0 text-center text-[28px] font-semibold leading-[1.25] tracking-[-0.01em] text-bone">
          Mot de passe oublié ?
        </h2>
        <p className="m-0 mt-2 text-center text-[16px] leading-[1.55] text-muted">
          Entrez votre email, nous vous enverrons un lien de réinitialisation.
        </p>
        <div className="h-8" />
        <FormInput
          id="forgot-email"
          label="Email professionnel"
          type="email"
          placeholder="nom@entreprise.ma"
          leadingIcon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailErr}
          autoComplete="email"
        />
        <div className="h-6" />
        <button
          type="submit"
          disabled={isPending}
          className="flex h-11 w-full items-center justify-center rounded-md bg-royal text-[15px] font-medium text-navy transition-colors duration-150 ease-out hover:bg-royal-dark active:translate-y-[0.5px] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Envoi..." : "Envoyer le lien"}
        </button>
        <div className="h-6" />
        <Link
          href="/login"
          className="flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-royal transition-colors duration-150 ease-out hover:text-royal-light"
        >
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
          <span>Retour à la connexion</span>
        </Link>
      </form>
    </AuthCard>
  );
}
