"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Globe,
  Plus,
  Sparkles,
  Target,
} from "lucide-react";

import { FormInput } from "@/components/auth/form-input";
import { addConcurrent } from "@/lib/actions/onboarding";
import type { ConcurrentSuggestion } from "@/lib/onboarding/state";
import { step2ConcurrentSchema } from "@/lib/validators/onboarding";

import { OnboardingShell } from "./onboarding-shell";
import { SectionHeader } from "./section-header";
import { CompanyCard, type CompanyCardData } from "./company-card";

export type Step2FormProps = {
  initialItems: CompanyCardData[];
  /**
   * Concurrents suggérés par le Deep Research (vide si pas encore prêt ou si
   * en raw-fallback). Le user peut les ajouter en 1 clic.
   */
  suggestions?: ConcurrentSuggestion[];
};

/**
 * Étape 2 : ajout inline de concurrents + suggestions Deep Research.
 *  - Section "Suggestions Deep Research" en haut si DR a renvoyé des matches
 *  - Add row (nom + site + bouton)
 *  - Empty state si liste vide
 *  - Liste de cards si ≥ 1 item
 *  - Shake si click Suivant avec 0 item
 */
export function Step2Form({ initialItems, suggestions = [] }: Step2FormProps) {
  const router = useRouter();
  const [items, setItems] = useState<CompanyCardData[]>(initialItems);
  const [localSuggestions, setLocalSuggestions] =
    useState<ConcurrentSuggestion[]>(suggestions);
  const [nom, setNom] = useState("");
  const [siteWeb, setSiteWeb] = useState("");
  const [nomError, setNomError] = useState<string | null>(null);
  const [siteWebError, setSiteWebError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [emptyError, setEmptyError] = useState(false);
  const [isAddPending, startAddTransition] = useTransition();
  const [pendingSuggestionKey, setPendingSuggestionKey] = useState<
    string | null
  >(null);
  const [isNextPending, startNextTransition] = useTransition();

  const recommended = items.length >= 3;
  const showEmptyState = items.length === 0;

  const triggerShake = () => {
    setShake(false);
    requestAnimationFrame(() => setShake(true));
    setTimeout(() => setShake(false), 450);
  };

  const handleAdd = () => {
    const parsed = step2ConcurrentSchema.safeParse({
      nom: nom.trim(),
      siteWeb: siteWeb.trim() ? siteWeb.trim() : undefined,
    });

    if (!parsed.success) {
      const issues = parsed.error.flatten().fieldErrors;
      setNomError(issues.nom?.[0] ?? null);
      setSiteWebError(issues.siteWeb?.[0] ?? null);
      return;
    }

    setNomError(null);
    setSiteWebError(null);

    startAddTransition(async () => {
      const result = await addConcurrent({
        nom: parsed.data.nom,
        siteWeb: parsed.data.siteWeb,
      });
      if (!result.success || !result.data) {
        setNomError("Échec de l'ajout. Réessayez.");
        return;
      }
      setItems((current) => [
        ...current,
        {
          id: result.data!.id,
          nom: parsed.data.nom,
          siteWeb: parsed.data.siteWeb ?? null,
        },
      ]);
      // Si on vient d'ajouter un nom qui était suggéré, on le retire de la liste
      // (sécurité au cas où le user tape manuellement un nom déjà suggéré).
      setLocalSuggestions((current) =>
        current.filter(
          (s) => s.nom.trim().toLowerCase() !== parsed.data.nom.toLowerCase(),
        ),
      );
      setNom("");
      setSiteWeb("");
      setEmptyError(false);
    });
  };

  const handleAddSuggestion = (suggestion: ConcurrentSuggestion) => {
    const key = suggestion.nom.toLowerCase();
    setPendingSuggestionKey(key);

    // Server action via startTransition pour bénéficier du pending state
    void (async () => {
      try {
        const payload = step2ConcurrentSchema.safeParse({
          nom: suggestion.nom,
          siteWeb: suggestion.siteWeb ?? undefined,
        });
        if (!payload.success) {
          // Si la suggestion ne passe pas le Zod (rare : nom trop long, URL
          // mal formée), on retire silencieusement de la liste — le user peut
          // la ressaisir manuellement.
          setLocalSuggestions((current) =>
            current.filter((s) => s.nom.toLowerCase() !== key),
          );
          return;
        }
        const result = await addConcurrent({
          nom: payload.data.nom,
          siteWeb: payload.data.siteWeb,
        });
        if (!result.success || !result.data) return;
        setItems((current) => [
          ...current,
          {
            id: result.data!.id,
            nom: payload.data.nom,
            siteWeb: payload.data.siteWeb ?? null,
          },
        ]);
        setLocalSuggestions((current) =>
          current.filter((s) => s.nom.toLowerCase() !== key),
        );
        setEmptyError(false);
      } finally {
        setPendingSuggestionKey(null);
      }
    })();
  };

  const handleNext = () => {
    if (items.length === 0) {
      setEmptyError(true);
      triggerShake();
      return;
    }
    startNextTransition(() => {
      router.push("/onboarding/step-3");
    });
  };

  return (
    <OnboardingShell
      step={2}
      backHref="/onboarding/step-1"
      onNext={handleNext}
      isPending={isNextPending}
    >
      <SectionHeader
        icon={Target}
        iconColor="#C77700"
        title="Quels concurrents surveiller ?"
        subtitle="Ajoutez les entreprises que vous voulez garder à l'œil. Notre agent visitera leurs sites quotidiennement pour détecter leurs mouvements."
        subMaxWidth={520}
      />

      <div className="h-8" />

      {/* Suggestions Deep Research — visibles seulement si DR a renvoyé des matches */}
      {localSuggestions.length > 0 ? (
        <SuggestionsSection
          suggestions={localSuggestions}
          pendingKey={pendingSuggestionKey}
          onAdd={handleAddSuggestion}
        />
      ) : null}

      {/* Inline add row */}
      <div
        className={`grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_1fr_auto] ${
          shake ? "onb-shake" : ""
        }`}
      >
        <FormInput
          id="conc-nom"
          label="Nom du concurrent"
          placeholder="Ex : CIH"
          leadingIcon={Building2}
          autoComplete="off"
          value={nom}
          onChange={(e) => {
            setNom(e.target.value);
            if (nomError) setNomError(null);
            if (emptyError) setEmptyError(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          error={nomError}
        />
        <FormInput
          id="conc-site"
          label="Site internet"
          placeholder="https://..."
          leadingIcon={Globe}
          autoComplete="off"
          inputMode="url"
          value={siteWeb}
          onChange={(e) => {
            setSiteWeb(e.target.value);
            if (siteWebError) setSiteWebError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          error={siteWebError}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={isAddPending}
          className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-royal px-[18px] text-[15px] font-medium text-navy transition-colors duration-150 ease-out hover:bg-royal-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} strokeWidth={1.8} />
          <span>Ajouter</span>
        </button>
      </div>

      {emptyError ? (
        <div className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-error">
          <AlertCircle size={14} strokeWidth={1.5} aria-hidden="true" />
          <span>Ajoutez au moins 1 concurrent à surveiller.</span>
        </div>
      ) : null}

      {/* Empty state */}
      {showEmptyState ? (
        <>
          <div className="h-6" />
          <div className="rounded-[12px] border border-dashed border-navy-700 bg-navy-900 p-8 text-center">
            <div className="mb-3 flex justify-center text-muted-soft">
              <Target size={32} strokeWidth={1.5} />
            </div>
            <div className="mb-1.5 text-[16px] text-muted">
              Aucun concurrent ajouté
            </div>
            <div className="text-[13px] text-muted-soft">
              Commencez par ajouter ceux dont vous voulez suivre
              l&apos;activité.
            </div>
          </div>
        </>
      ) : null}

      {/* Liste de cards */}
      {items.length > 0 ? (
        <>
          <div className="h-6" />
          <div className="flex flex-col gap-2">
            {items.map((c) => (
              <CompanyCard key={c.id} data={c} />
            ))}
          </div>
          <div className="mt-4 flex w-full items-center justify-end gap-1.5 text-[13px] text-muted-soft">
            {recommended ? (
              <CheckCircle2
                size={14}
                strokeWidth={1.5}
                style={{ color: "#0F8F65" }}
                aria-hidden="true"
              />
            ) : null}
            <span>
              <strong className="font-semibold text-bone">
                {items.length}
              </strong>{" "}
              concurrent(s) ajouté(s)
              {recommended ? (
                <em className="ml-1 not-italic text-muted-soft italic">
                  (recommandé)
                </em>
              ) : null}
            </span>
          </div>
        </>
      ) : null}
    </OnboardingShell>
  );
}

/* ── Section Suggestions Deep Research ──────────────────────────── */
function SuggestionsSection({
  suggestions,
  pendingKey,
  onAdd,
}: {
  suggestions: ConcurrentSuggestion[];
  pendingKey: string | null;
  onAdd: (s: ConcurrentSuggestion) => void;
}) {
  return (
    <div className="mb-8 rounded-[12px] border border-royal/25 bg-royal/[0.04] p-5">
      <div className="mb-1 flex items-center gap-2">
        <Sparkles size={14} strokeWidth={1.6} className="text-royal" />
        <h3 className="m-0 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-royal">
          Suggestions Deep Research
        </h3>
      </div>
      <p className="mb-4 text-[13px] leading-[1.55] text-muted">
        Identifiés à partir de votre site web. Ajoutez-les en un clic.
      </p>
      <div className="flex flex-col gap-2">
        {suggestions.map((s) => {
          const key = s.nom.toLowerCase();
          const pending = pendingKey === key;
          const initial = s.nom.trim().charAt(0).toUpperCase();
          return (
            <div
              key={key}
              className="comp-in flex items-center gap-3 rounded-[10px] border border-navy-700 bg-navy-900/60 px-4 py-3"
              style={
                pending ? { opacity: 0.5, pointerEvents: "none" } : undefined
              }
            >
              <div
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-navy-700 bg-navy-800 font-display text-[13px] font-medium text-bone"
              >
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="truncate text-[14.5px] font-medium text-bone">
                    {s.nom}
                  </span>
                  {s.siteWeb ? (
                    <span className="truncate font-mono text-[11.5px] text-muted-soft">
                      {extractDomain(s.siteWeb)}
                    </span>
                  ) : null}
                </div>
                {s.raison ? (
                  <p className="m-0 mt-0.5 line-clamp-2 text-[12.5px] leading-[1.5] text-muted">
                    {s.raison}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onAdd(s)}
                disabled={pending}
                aria-label={`Ajouter ${s.nom}`}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-royal/40 bg-royal/10 px-3 text-[12.5px] font-medium text-royal transition-colors duration-150 ease-out hover:border-royal hover:bg-royal/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={13} strokeWidth={2} />
                <span>Ajouter</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Extrait le domaine lisible d'une URL (sans https://www.). */
function extractDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
