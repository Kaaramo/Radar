"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, CheckCircle2, AlertTriangle } from "lucide-react";

import { AuthCard } from "@/components/auth/auth-card";
import { ResendCountdownButton } from "@/components/auth/resend-countdown-button";
import { StatusCircle } from "@/components/auth/status-circle";
import { resendVerificationAction } from "@/lib/actions/auth";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  // Email récupéré par défaut pour la démo (sprint 1.5 : depuis la session)
  const email = searchParams.get("email") ?? "vous@entreprise.ma";

  // État dérivé du token
  const stage: "default" | "success" | "invalid" =
    token === "valid" ? "success" : token === "invalid" ? "invalid" : "default";

  if (stage === "success") {
    return (
      <AuthCard>
        <StatusCircle tone="success" icon={CheckCircle2} />
        <div className="h-6" />
        <h2 className="m-0 text-center text-[28px] font-semibold leading-[1.25] tracking-[-0.01em] text-bone">
          Email vérifié
        </h2>
        <p className="m-0 mt-2 text-center text-[16px] leading-[1.55] text-muted">
          Votre compte est désormais entièrement actif.
        </p>
        <div className="h-6" />
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="flex h-11 w-full items-center justify-center rounded-md bg-royal text-[15px] font-medium text-navy transition-colors duration-150 ease-out hover:bg-royal-dark"
        >
          Aller au dashboard
        </button>
      </AuthCard>
    );
  }

  if (stage === "invalid") {
    return (
      <AuthCard>
        <StatusCircle tone="error" icon={AlertTriangle} />
        <div className="h-6" />
        <h2 className="m-0 text-center text-[28px] font-semibold leading-[1.25] tracking-[-0.01em] text-bone">
          Lien invalide
        </h2>
        <p className="m-0 mt-2 text-center text-[16px] leading-[1.55] text-muted">
          Ce lien de vérification a expiré ou a déjà été utilisé.
        </p>
        <div className="h-6" />
        <ResendCountdownButton
          initialSeconds={60}
          label="Renvoyer un nouveau lien"
          onResend={() => {
            void resendVerificationAction(email);
          }}
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <StatusCircle tone="teal" icon={Mail} />
      <div className="h-6" />
      <h2 className="m-0 text-center text-[28px] font-semibold leading-[1.25] tracking-[-0.01em] text-bone">
        Vérifiez votre email
      </h2>
      <p className="m-0 mt-2 text-center text-[16px] leading-[1.55] text-muted">
        Nous avons envoyé un lien de confirmation à{" "}
        <strong className="font-semibold text-bone">{email}</strong>. Cliquez
        dessus pour valider votre compte.
      </p>
      <div className="h-6" />
      <ResendCountdownButton
        initialSeconds={60}
        label="Renvoyer l'email"
        onResend={() => {
          void resendVerificationAction(email);
        }}
      />
      <div className="h-3" />
      <Link
        href="/dashboard"
        className="block py-2.5 text-center text-[13px] text-muted transition-colors duration-150 ease-out hover:text-bone"
      >
        Continuer vers le dashboard sans vérifier
      </Link>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
