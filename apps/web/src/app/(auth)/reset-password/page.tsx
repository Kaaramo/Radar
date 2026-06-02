"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";

import { AuthCard } from "@/components/auth/auth-card";
import { FormInput } from "@/components/auth/form-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { StatusCircle } from "@/components/auth/status-circle";
import { resetPasswordSchema } from "@/lib/validators/auth";
import { resetPasswordAction } from "@/lib/actions/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [stage, setStage] = useState<"form" | "success" | "expired">(() =>
    token === "expired" || !token ? "expired" : "form",
  );
  const [isPending, startTransition] = useTransition();

  const match = !!pw && !!confirm && pw === confirm;
  const mismatch = !!pw && !!confirm && pw !== confirm;
  const confirmErr = mismatch ? "Les mots de passe ne correspondent pas" : null;

  // Erreur sur le mot de passe principal seulement après submit
  const pwErr =
    submitted && pw && !/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw)
      ? "Min. 8 caractères, 1 majuscule, 1 chiffre"
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!token) return;

    const result = resetPasswordSchema.safeParse({
      token,
      password: pw,
      confirmPassword: confirm,
    });
    if (!result.success) return;

    startTransition(async () => {
      const res = await resetPasswordAction(result.data);
      if (res.success) {
        setStage("success");
      } else if (
        res.error === "TOKEN_EXPIRED" ||
        res.error === "TOKEN_INVALID"
      ) {
        setStage("expired");
      }
    });
  };

  if (stage === "success") {
    return (
      <AuthCard>
        <StatusCircle tone="success" icon={CheckCircle2} />
        <div className="h-6" />
        <h2 className="m-0 text-center text-[28px] font-semibold leading-[1.25] tracking-[-0.01em] text-bone">
          Mot de passe modifié
        </h2>
        <p className="m-0 mt-2 text-center text-[16px] leading-[1.55] text-muted">
          Votre mot de passe a été réinitialisé avec succès.
        </p>
        <div className="h-6" />
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="flex h-11 w-full items-center justify-center rounded-md bg-royal text-[15px] font-medium text-navy transition-colors duration-150 ease-out hover:bg-royal-dark"
        >
          Se connecter
        </button>
      </AuthCard>
    );
  }

  if (stage === "expired") {
    return (
      <AuthCard>
        <StatusCircle tone="error" icon={AlertTriangle} />
        <div className="h-6" />
        <h2 className="m-0 text-center text-[28px] font-semibold leading-[1.25] tracking-[-0.01em] text-bone">
          Lien expiré
        </h2>
        <p className="m-0 mt-2 text-center text-[16px] leading-[1.55] text-muted">
          Ce lien de réinitialisation a expiré ou est invalide.
        </p>
        <div className="h-6" />
        <button
          type="button"
          onClick={() => router.push("/forgot-password")}
          className="flex h-11 w-full items-center justify-center rounded-md bg-royal text-[15px] font-medium text-navy transition-colors duration-150 ease-out hover:bg-royal-dark"
        >
          Demander un nouveau lien
        </button>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} noValidate>
        <StatusCircle tone="teal" icon={ShieldCheck} />
        <div className="h-6" />
        <h2 className="m-0 text-center text-[28px] font-semibold leading-[1.25] tracking-[-0.01em] text-bone">
          Nouveau mot de passe
        </h2>
        <p className="m-0 mt-2 text-center text-[16px] leading-[1.55] text-muted">
          Choisissez un mot de passe sécurisé pour votre compte.
        </p>
        <div className="h-8" />
        <FormInput
          id="reset-pw"
          label="Nouveau mot de passe"
          type="password"
          placeholder="Min. 8 caractères"
          leadingIcon={Lock}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          error={pwErr}
          autoComplete="new-password"
        />
        <PasswordStrength password={pw} />
        <div className="h-4" />
        <FormInput
          id="reset-pw2"
          label="Confirmer le mot de passe"
          type="password"
          placeholder="Retapez votre mot de passe"
          leadingIcon={Lock}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          success={match}
          error={confirmErr}
          autoComplete="new-password"
        />
        <div className="h-6" />
        <button
          type="submit"
          disabled={isPending}
          className="flex h-11 w-full items-center justify-center rounded-md bg-royal text-[15px] font-medium text-navy transition-colors duration-150 ease-out hover:bg-royal-dark active:translate-y-[0.5px] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
        </button>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
