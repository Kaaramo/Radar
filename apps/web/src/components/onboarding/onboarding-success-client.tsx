"use client";

import Link from "next/link";
import { ArrowRight, Building2, Compass } from "lucide-react";

export type DeepResearchStatutHero =
  | "IN_PROGRESS"
  | "SUCCESS"
  | "FAILED"
  | "IDLE";

export type OnboardingSuccessClientProps = {
  concurrentsCount: number;
  axesCount: number;
  /** Statut réel de l'enrichissement (utilisé pour le hint scroll sous le CTA). */
  deepResearchStatut: DeepResearchStatutHero;
};

/**
 * Hero d'arrivée onboarding — version épurée (post-feedback user) :
 *  - Plus de mark RADAR ni de cercles pulsants (le robot 3D au-dessus suffit
 *    à incarner l'identité visuelle de la page).
 *  - Plus d'eyebrow « Cycle activé » ni de sous-titre engagement « cycle 6h ».
 *  - Reste : H1 « Votre radar est armé. » + 2 stats + CTA + hint scroll.
 *
 * Pas d'auto-redirect : le user lit le résultat Deep Research (rendu sous ce
 * hero par le Server Component parent) puis clique le CTA quand il est prêt.
 *
 * Cascade d'animation conservée :
 *   T+0    : H1 fade-up
 *   T+200  : divider hairline draw (scaleX 0 → 1)
 *   T+400  : stats grid fade-up
 *   T+700  : CTA fade-up
 */
export function OnboardingSuccessClient({
  concurrentsCount,
  axesCount,
  deepResearchStatut,
}: OnboardingSuccessClientProps) {
  return (
    <div className="relative flex min-h-[60dvh] w-full items-center justify-center overflow-hidden bg-navy px-6 py-16">
      {/* ── Background atmospherics ─────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mesh-bg"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 radar-grid-bg opacity-60"
      />

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="relative z-[2] flex w-full max-w-[560px] flex-col items-center text-center">
        {/* Title */}
        <h1 className="success-h1 m-0 text-[44px] font-bold leading-[1.08] tracking-[-0.022em] text-bone">
          Votre radar est armé.
        </h1>

        {/* Hairline divider — fade gradient au centre */}
        <div
          aria-hidden="true"
          className="success-divider mt-8 h-px w-[280px] origin-center bg-gradient-to-r from-transparent via-royal/40 to-transparent"
        />

        {/* Stats avec dividers verticaux */}
        <div className="success-stats mt-10 grid w-full max-w-[360px] grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-border-subtle">
          <Stat
            icon={Building2}
            color="#C77700"
            value={concurrentsCount}
            label="concurrents"
            sublabel="surveillés"
          />
          <Stat
            icon={Compass}
            color="#2251FF"
            value={axesCount}
            label="axes"
            sublabel="activés"
          />
        </div>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="success-cta group mt-12 inline-flex h-[52px] items-center justify-center gap-2.5 rounded-md bg-royal px-8 text-[16px] font-semibold text-navy shadow-[0_8px_24px_-8px_rgba(34,81,255,0.5)] ring-1 ring-royal-light/40 transition-all duration-200 ease-out hover:bg-royal-light hover:shadow-[0_12px_32px_-8px_rgba(34,81,255,0.6)]"
        >
          <span>Accéder au tableau de bord</span>
          <ArrowRight
            size={18}
            strokeWidth={1.8}
            className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
          />
        </Link>

        {/* Hint scroll cohérent selon le statut réel de l'analyse */}
        <p className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-soft">
          {scrollHintFor(deepResearchStatut)}
        </p>
      </div>
    </div>
  );
}

/* ── Sous-composant Stat ─────────────────────────────────────────── */
type StatProps = {
  icon: typeof Building2;
  color: string;
  value?: number;
  valueText?: string;
  label: string;
  sublabel: string;
  pulsing?: boolean;
};

function Stat({
  icon: Icon,
  color,
  value,
  valueText,
  label,
  sublabel,
  pulsing,
}: StatProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-3 py-2">
      <span
        className={`inline-flex ${pulsing ? "dr-pulse" : ""}`}
        style={{ color }}
        aria-hidden="true"
      >
        <Icon size={22} strokeWidth={1.5} />
      </span>
      <div className="font-display text-[28px] font-bold leading-[1] text-bone">
        {valueText ?? value}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-[0.12em] leading-[1.3] text-muted-soft">
        {label}
        <br />
        {sublabel}
      </div>
    </div>
  );
}

/* ── Hint scroll cohérent selon statut DR ───────────────────────── */
function scrollHintFor(statut: DeepResearchStatutHero): string {
  switch (statut) {
    case "IN_PROGRESS":
      return "Analyse business en cours · résultat affiché ci-dessous dès qu'il est prêt";
    case "SUCCESS":
      return "Votre profil business est détaillé ci-dessous";
    case "FAILED":
      return "L'analyse n'a pas abouti · vous pourrez la relancer depuis vos paramètres";
    case "IDLE":
      return "Analyse non lancée · vous pourrez la déclencher depuis vos paramètres";
  }
}
