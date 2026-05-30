"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Building2, Globe } from "lucide-react";

import { FormInput } from "@/components/auth/form-input";
import { saveStep1 } from "@/lib/actions/onboarding";
import {
  step1EntrepriseSchema,
  type Step1EntrepriseInput,
} from "@/lib/validators/onboarding";

import { OnboardingShell } from "./onboarding-shell";
import { SectionHeader } from "./section-header";
import { DeepResearchBanner } from "./deep-research-banner";
import { DeepResearchToast } from "./deep-research-toast";

export type Step1FormProps = {
  defaultValues?: Partial<Step1EntrepriseInput>;
};

/**
 * Étape 1 : nom + site web. Validation Zod live, soumission via Server Action,
 * toast Deep Research au submit puis redirect vers /onboarding/step-2.
 */
export function Step1Form({ defaultValues }: Step1FormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toastVisible, setToastVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted, isValid },
    watch,
  } = useForm<Step1EntrepriseInput>({
    resolver: zodResolver(step1EntrepriseSchema),
    mode: "onBlur",
    defaultValues: {
      nomEntreprise: defaultValues?.nomEntreprise ?? "",
      siteWeb: defaultValues?.siteWeb ?? "",
    },
  });

  const nomValue = watch("nomEntreprise");
  const webValue = watch("siteWeb");

  const onSubmit = (data: Step1EntrepriseInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await saveStep1(data);
      if (!result.success) {
        setServerError(
          result.details ??
            "Une erreur est survenue. Réessayez dans un instant.",
        );
        return;
      }
      setToastVisible(true);
      // Le toast reste 800ms le temps que l'utilisateur le perçoive, puis on transitionne.
      setTimeout(() => {
        router.push("/onboarding/step-2");
      }, 800);
    });
  };

  // succès visuel inline : pas de checkmark si l'utilisateur n'a pas encore fini de taper.
  const nomOk =
    nomValue.trim().length >= 2 && !errors.nomEntreprise && !!nomValue;
  const webOk =
    /^https?:\/\/.+\..+/.test(webValue) && !errors.siteWeb && !!webValue;

  return (
    <OnboardingShell
      step={1}
      canGoBack={false}
      onNext={handleSubmit(onSubmit)}
      isPending={isPending}
      isNextDisabled={!isValid && isSubmitted}
      overlay={<DeepResearchToast visible={toastVisible} />}
    >
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        aria-label="Étape 1 : Votre entreprise"
      >
        <SectionHeader
          icon={Briefcase}
          iconColor="#2251FF"
          title="Parlons de votre entreprise."
        />

        <div className="h-8" />

        <FormInput
          id="onb-nom"
          label="Nom de votre entreprise"
          placeholder="Ex : Inwi"
          leadingIcon={Building2}
          autoComplete="organization"
          {...register("nomEntreprise")}
          error={errors.nomEntreprise?.message ?? null}
          success={nomOk}
        />

        <div className="h-4" />

        <FormInput
          id="onb-site"
          label="Site internet"
          placeholder="https://www.votresite.ma"
          leadingIcon={Globe}
          autoComplete="url"
          inputMode="url"
          {...register("siteWeb")}
          error={errors.siteWeb?.message ?? null}
          success={webOk}
        />

        <div className="h-8" />

        <DeepResearchBanner />

        {serverError ? (
          <div
            role="alert"
            className="mt-6 rounded-md border border-error/30 border-l-[3px] border-l-error bg-error/10 px-4 py-3 text-[14px] leading-[1.45] text-error"
          >
            {serverError}
          </div>
        ) : null}

        {/* Submit caché pour Enter dans les inputs */}
        <button type="submit" className="sr-only" tabIndex={-1}>
          Soumettre
        </button>
      </form>
    </OnboardingShell>
  );
}
