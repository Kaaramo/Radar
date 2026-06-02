import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Sparkles,
  XCircle,
} from "lucide-react";

import { relaunchDeepResearch } from "@/lib/actions/settings";
import {
  deepResearchOutputSchema,
  type DeepResearchOutput,
} from "@/lib/skills/deep-research/schema";

import { DeepResearchPoller } from "./deep-research-poller";

export type EnrichissementStatut =
  | "IDLE"
  | "IN_PROGRESS"
  | "SUCCESS"
  | "FAILED";

export type DeepResearchSectionProps = {
  enrichissement: unknown;
  enrichissementLe: Date | null;
  enrichissementVer: string | null;
  enrichissementStatut: EnrichissementStatut;
  enrichissementErreur: string | null;
  onboardingCompleteLe: Date | null;
  /** Indication URL : l'utilisateur vient de cliquer Relancer (badge "nav") */
  justRelaunched?: boolean;
  /**
   * Affiche les CTA "Relancer" (header + EmptyView). Default true.
   * On passe false sur `/onboarding/success` : le user est en flow onboarding,
   * il ne doit pas être projeté vers /settings depuis cette page.
   */
  showRelaunchActions?: boolean;
  /**
   * Masque la section "Concurrents suggérés" du payload DR. Default false.
   * On passe true sur `/onboarding/success` : le user vient de faire son choix
   * de concurrents en step-2, ré-afficher les suggestions du DR (qui peuvent
   * doublonner avec ce qu'il a déjà ajouté, ex : "Orange Maroc" vs "Orange
   * Business Maroc") est redondant et confus. La section reste affichée sur
   * /settings où elle aide à découvrir de nouveaux concurrents.
   */
  hideSuggestedCompetitors?: boolean;
  /**
   * Titre du DataHeader (H1). Default "Deep Research" pour /settings.
   * Sur /onboarding/success on passe un libellé business ("Analyse de votre
   * entreprise") puisque le user ne connaît pas encore le nom de feature.
   */
  headerTitle?: string;
  /**
   * Cache complètement le sous-titre date dans le DataHeader. Default false.
   * On passe true sur /onboarding/success : la date d'analyse est forcément
   * aujourd'hui (le user vient juste de finir l'onboarding), info redondante
   * + risque de confusion avec une "date de création de l'entreprise".
   * Sur /settings, la date reste affichée pour la revisite.
   */
  hideDate?: boolean;
};

/**
 * Section Deep Research. Source de vérité : `enrichissementStatut` (DB).
 *
 * - IN_PROGRESS → EmptyView in-progress + Poller actif
 * - FAILED      → EmptyView failed + erreur lisible
 * - IDLE        → EmptyView never-ran (CTA Lancer)
 * - SUCCESS     → header + structured ou raw-fallback selon payload
 */
export function DeepResearchSection({
  enrichissement,
  enrichissementLe,
  enrichissementVer,
  enrichissementStatut,
  enrichissementErreur,
  onboardingCompleteLe,
  justRelaunched,
  showRelaunchActions = true,
  hideSuggestedCompetitors = false,
  headerTitle = "Deep Research",
  hideDate = false,
}: DeepResearchSectionProps) {
  // Statut IN_PROGRESS = polling actif, vue en cours
  if (enrichissementStatut === "IN_PROGRESS") {
    return (
      <>
        <DeepResearchPoller initialStatut="IN_PROGRESS" />
        <EmptyView
          variant="in-progress"
          showRelaunchActions={showRelaunchActions}
        />
      </>
    );
  }

  if (enrichissementStatut === "FAILED") {
    return (
      <EmptyView
        variant="failed"
        errorMessage={enrichissementErreur}
        showRelaunchActions={showRelaunchActions}
      />
    );
  }

  // SUCCESS sans payload (incohérence) ou IDLE
  if (enrichissementStatut === "IDLE" || !enrichissement) {
    const variant: EmptyVariant =
      enrichissementStatut === "IDLE" && !onboardingCompleteLe
        ? "never-ran"
        : "failed";
    return (
      <EmptyView variant={variant} showRelaunchActions={showRelaunchActions} />
    );
  }

  // SUCCESS avec payload
  const parsed = parseEnrichment(enrichissement);
  const isStale =
    enrichissementLe !== null &&
    Date.now() - enrichissementLe.getTime() > 30 * 24 * 60 * 60 * 1000;

  if (parsed.kind === "unknown")
    return <UnknownPayloadView showRelaunchActions={showRelaunchActions} />;

  return (
    <div className="flex flex-col gap-6">
      <DataHeader
        enrichissementLe={enrichissementLe}
        isStale={isStale}
        showRelaunchActions={showRelaunchActions}
        headerTitle={headerTitle}
        hideDate={hideDate}
      />

      {justRelaunched ? <RelaunchedBanner /> : null}

      {parsed.kind === "structured" ? (
        <StructuredView
          data={parsed.data}
          hideSuggestedCompetitors={hideSuggestedCompetitors}
        />
      ) : (
        <RawFallbackView
          finalAnalysis={parsed.finalAnalysis}
          sources={parsed.sources}
        />
      )}
    </div>
  );
}

/* ── Empty view (Apple-like) ────────────────────────────────────────── */

type EmptyVariant = "never-ran" | "failed" | "in-progress";

function EmptyView({
  variant,
  errorMessage,
  showRelaunchActions = true,
}: {
  variant: EmptyVariant;
  errorMessage?: string | null;
  showRelaunchActions?: boolean;
}) {
  const meta = emptyMeta(variant);
  const Icon = meta.icon;

  return (
    <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full ring-1 ${meta.iconClass}`}
      >
        <Icon size={20} strokeWidth={1.6} className={meta.iconColor} />
      </span>

      <h1 className="mt-6 max-w-[440px] font-display text-[26px] font-light leading-[1.2] tracking-[-0.015em] text-bone">
        {meta.title}
      </h1>

      {variant === "failed" && errorMessage ? (
        <p className="mt-3 max-w-[440px] text-[13px] leading-[1.5] text-muted">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-8">
        {variant === "in-progress" ? (
          <span className="inline-flex h-10 items-center gap-2 rounded-md border border-navy-700 bg-navy-900 px-5 text-[13px] font-medium text-muted">
            <RefreshCw
              size={13}
              strokeWidth={2}
              className="animate-spin-slow"
            />
            Mise à jour automatique…
          </span>
        ) : showRelaunchActions ? (
          <form action={relaunchDeepResearch}>
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-royal px-5 text-[13px] font-medium text-bone transition-colors duration-150 ease-out hover:bg-royal-light"
            >
              <Sparkles size={13} strokeWidth={2} />
              {meta.ctaLabel}
            </button>
          </form>
        ) : (
          <p className="max-w-[440px] text-[13px] leading-[1.5] text-muted-soft">
            Vous pourrez relancer l&apos;analyse depuis vos paramètres une fois
            sur le tableau de bord.
          </p>
        )}
      </div>
    </div>
  );
}

function emptyMeta(variant: EmptyVariant): {
  icon: typeof Sparkles;
  iconClass: string;
  iconColor: string;
  title: string;
  ctaLabel: string;
} {
  switch (variant) {
    case "never-ran":
      return {
        icon: Sparkles,
        iconClass: "bg-royal/10 ring-royal/30",
        iconColor: "text-royal",
        title: "Lancer le Deep Research",
        ctaLabel: "Lancer",
      };
    case "failed":
      return {
        icon: AlertTriangle,
        iconClass: "bg-warning/10 ring-warning/30",
        iconColor: "text-warning",
        title: "L'analyse n'a pas pu se terminer",
        ctaLabel: "Relancer",
      };
    case "in-progress":
      return {
        icon: Sparkles,
        iconClass: "bg-royal/10 ring-royal/30",
        iconColor: "dr-pulse text-royal",
        title: "Analyse en cours",
        ctaLabel: "Recharger",
      };
  }
}

/* ── Data header (mode avec données) ───────────────────────────────── */

function DataHeader({
  enrichissementLe,
  isStale,
  showRelaunchActions,
  headerTitle,
  hideDate,
}: {
  enrichissementLe: Date | null;
  isStale: boolean;
  showRelaunchActions: boolean;
  headerTitle: string;
  hideDate: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-navy-700/60 pb-4">
      <div>
        <h1 className="m-0 font-display text-[28px] font-light leading-[1.1] tracking-[-0.02em] text-bone">
          {headerTitle}
        </h1>
        {!hideDate && enrichissementLe ? (
          <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted-soft">
            {formatDate(enrichissementLe)}
            {isStale ? (
              <span className="ml-2 text-warning">· à actualiser</span>
            ) : null}
          </p>
        ) : null}
      </div>
      {showRelaunchActions ? (
        <form action={relaunchDeepResearch}>
          <button
            type="submit"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-navy-700 bg-navy-900 px-3 text-[12px] font-medium text-bone transition-colors duration-150 ease-out hover:border-royal hover:bg-navy-800"
          >
            <RefreshCw size={12} strokeWidth={2} />
            Relancer
          </button>
        </form>
      ) : null}
    </div>
  );
}

/* ── Relaunched banner ─────────────────────────────────────────────── */

function RelaunchedBanner() {
  return (
    <div className="flex items-center gap-2.5 rounded-md border border-royal/30 bg-royal/[0.06] px-4 py-2.5">
      <Sparkles
        size={13}
        strokeWidth={1.8}
        className="dr-pulse shrink-0 text-royal"
      />
      <p className="m-0 text-[12.5px] text-muted">
        <span className="font-medium text-bone">Analyse en cours.</span>{" "}
        Recharger dans 2-4 min pour la mise à jour.
      </p>
    </div>
  );
}

/* ── Raw fallback ───────────────────────────────────────────────────── */

function RawFallbackView({
  finalAnalysis,
  sources,
}: {
  finalAnalysis: string | null;
  sources: Array<{ url: string | null; titre: string | null }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      {finalAnalysis ? (
        <Card title="Analyse brute">
          <pre className="m-0 max-h-[440px] overflow-y-auto whitespace-pre-wrap rounded-md bg-navy/60 p-4 font-sans text-[12.5px] leading-[1.7] text-muted">
            {finalAnalysis}
          </pre>
        </Card>
      ) : null}

      {sources.length > 0 ? (
        <Card title={`${sources.length} sources`}>
          <SourceList sources={sources} />
        </Card>
      ) : null}
    </div>
  );
}

/* ── Structured view ────────────────────────────────────────────────── */

function StructuredView({
  data,
  hideSuggestedCompetitors,
}: {
  data: DeepResearchOutput;
  hideSuggestedCompetitors: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Card title="Profil business">
        <FieldGrid>
          <Field label="Secteur" value={data.secteur} />
          <Field label="Taille" value={data.taille} />
          <Field
            label="Description"
            value={data.description}
            multiline
            span={2}
          />
          <Field
            label="Positionnement"
            value={data.positionnement}
            multiline
            span={2}
          />
          <Field label="Client cible" value={data.icp} multiline span={2} />
        </FieldGrid>
      </Card>

      <Card title="Produits & marchés">
        <FieldGrid>
          <PillField label="Produits" pills={data.produits} />
          <PillField label="Marchés" pills={data.marches} />
          {data.motsClesMetier.length > 0 ? (
            <div className="col-span-2">
              <p className="m-0 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-soft">
                Mots-clés
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.motsClesMetier.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center rounded-full border border-navy-700 bg-navy/60 px-2.5 py-0.5 text-[11.5px] text-muted"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </FieldGrid>
      </Card>

      {!hideSuggestedCompetitors && data.concurrentsSuggeres.length > 0 ? (
        <Card title="Concurrents suggérés">
          <div className="flex flex-col gap-2">
            {data.concurrentsSuggeres.map((c) => (
              <div
                key={c.nom}
                className="flex items-start gap-3 rounded-md border border-navy-700 bg-navy/40 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-[13.5px] font-medium text-bone">
                    {c.nom}
                  </p>
                  <p className="m-0 mt-0.5 text-[12.5px] leading-[1.5] text-muted">
                    {c.raison}
                  </p>
                </div>
                {c.siteWeb ? (
                  <a
                    href={c.siteWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.06em] text-muted-soft transition-colors duration-150 ease-out hover:text-royal"
                  >
                    <ExternalLink size={11} strokeWidth={1.8} />
                    Site
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <Card title="Présence digitale">
        <div className="grid grid-cols-3 gap-3">
          <DigitalIndicator
            label="LinkedIn"
            state={data.presenceDigitale.linkedinActif}
          />
          <DigitalIndicator
            label="Blog"
            state={data.presenceDigitale.blogActif}
          />
          <VisibilityIndicator level={data.presenceDigitale.noteVisibilite} />
        </div>
      </Card>

      {data.sourcesUtilisees.length > 0 ? (
        <Card title={`Sources · ${data.sourcesUtilisees.length}`}>
          <SourceList
            sources={data.sourcesUtilisees.map((s) => ({
              url: s.url,
              titre: s.titre,
            }))}
          />
        </Card>
      ) : null}
    </div>
  );
}

function UnknownPayloadView({
  showRelaunchActions,
}: {
  showRelaunchActions: boolean;
}) {
  return (
    <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 ring-1 ring-error/30">
        <XCircle size={20} strokeWidth={1.6} className="text-error" />
      </span>
      <h1 className="mt-6 max-w-[440px] font-display text-[26px] font-light leading-[1.2] tracking-[-0.015em] text-bone">
        Format inconnu
      </h1>
      {showRelaunchActions ? (
        <form action={relaunchDeepResearch} className="mt-8">
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-royal px-5 text-[13px] font-medium text-bone transition-colors duration-150 ease-out hover:bg-royal-light"
          >
            <Sparkles size={13} strokeWidth={2} />
            Régénérer
          </button>
        </form>
      ) : (
        <p className="mt-8 max-w-[440px] text-[13px] leading-[1.5] text-muted-soft">
          Le payload reçu ne correspond à aucun format connu. Vous pourrez
          régénérer depuis vos paramètres.
        </p>
      )}
    </div>
  );
}

/* ── Building blocks ────────────────────────────────────────────────── */

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-navy-700 bg-navy-900/40 p-5">
      <h3 className="m-0 mb-4 font-display text-[16px] font-regular leading-[1.2] tracking-[-0.005em] text-bone">
        {title}
      </h3>
      {children}
    </section>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>;
}

function Field({
  label,
  value,
  multiline,
  span = 1,
}: {
  label: string;
  value: string | null;
  multiline?: boolean;
  span?: 1 | 2;
}) {
  return (
    <div className={span === 2 ? "col-span-2" : "col-span-1"}>
      <p className="m-0 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-soft">
        {label}
      </p>
      {value === null || value === "" ? (
        <p className="m-0 mt-1 text-[13px] italic text-muted-soft/60">
          non renseigné
        </p>
      ) : (
        <p
          className={`m-0 mt-1 text-[13.5px] text-bone ${
            multiline ? "leading-[1.6]" : ""
          }`}
        >
          {value}
        </p>
      )}
    </div>
  );
}

function PillField({ label, pills }: { label: string; pills: string[] }) {
  return (
    <div className="col-span-1">
      <p className="m-0 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-soft">
        {label}
      </p>
      {pills.length === 0 ? (
        <p className="m-0 mt-1 text-[13px] italic text-muted-soft/60">aucun</p>
      ) : (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {pills.map((p) => (
            <span
              key={p}
              className="inline-flex items-center rounded-md border border-navy-700 bg-navy-800 px-2 py-0.5 text-[12px] text-bone"
            >
              {p}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function DigitalIndicator({
  label,
  state,
}: {
  label: string;
  state: boolean | null;
}) {
  const valueText = state === null ? "inconnu" : state ? "actif" : "inactif";
  const dotColor =
    state === null
      ? "var(--color-muted-soft)"
      : state
        ? "var(--color-success)"
        : "var(--color-muted-soft)";
  const valueColor =
    state === null
      ? "text-muted-soft/60 italic"
      : state
        ? "text-bone"
        : "text-muted-soft";

  return (
    <div className="rounded-md border border-navy-700 bg-navy/40 p-3">
      <p className="m-0 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-soft">
        {label}
      </p>
      <div className="mt-1.5 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: dotColor }}
        />
        <span className={`text-[13.5px] ${valueColor}`}>{valueText}</span>
      </div>
    </div>
  );
}

function VisibilityIndicator({
  level,
}: {
  level: "fort" | "moyen" | "faible" | null;
}) {
  const segments =
    level === "fort" ? 3 : level === "moyen" ? 2 : level === "faible" ? 1 : 0;
  const valueColor =
    level === "fort"
      ? "text-success"
      : level === "moyen"
        ? "text-bone"
        : level === "faible"
          ? "text-warning"
          : "text-muted-soft/60 italic";

  return (
    <div className="rounded-md border border-navy-700 bg-navy/40 p-3">
      <p className="m-0 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-soft">
        Visibilité
      </p>
      <div className="mt-1.5 flex items-center gap-2">
        <span aria-hidden="true" className="flex gap-0.5">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-2.5 w-1 rounded-sm"
              style={{
                background:
                  i <= segments
                    ? level === "fort"
                      ? "var(--color-success)"
                      : level === "moyen"
                        ? "var(--color-royal)"
                        : "var(--color-warning)"
                    : "var(--color-navy-700)",
              }}
            />
          ))}
        </span>
        <span className={`text-[13.5px] ${valueColor}`}>
          {level ?? "inconnu"}
        </span>
      </div>
    </div>
  );
}

function SourceList({
  sources,
}: {
  sources: Array<{ url: string | null; titre: string | null }>;
}) {
  return (
    <ul className="m-0 list-none divide-y divide-navy-700/60 rounded-md border border-navy-700 bg-navy/40 p-0">
      {sources.map((s, i) => (
        <li key={i} className="flex items-baseline gap-3 px-3 py-2.5">
          <CheckCircle2
            size={11}
            strokeWidth={2}
            className="shrink-0 text-success/70"
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1 truncate text-[12.5px] text-bone">
            {s.titre ?? s.url ?? "(sans titre)"}
          </span>
          {s.url ? (
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.06em] text-muted-soft transition-colors duration-150 ease-out hover:text-royal"
            >
              <ExternalLink size={10} strokeWidth={1.8} />
              ouvrir
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/* ── Helpers ────────────────────────────────────────────────────────── */

type ParsedEnrichment =
  | { kind: "structured"; data: DeepResearchOutput }
  | {
      kind: "raw-fallback";
      finalAnalysis: string | null;
      sources: Array<{ url: string | null; titre: string | null }>;
    }
  | { kind: "unknown" };

function parseEnrichment(raw: unknown): ParsedEnrichment {
  if (typeof raw !== "object" || raw === null) return { kind: "unknown" };
  const obj = raw as Record<string, unknown>;

  if (obj.status === "structured") {
    const parsed = deepResearchOutputSchema.safeParse(obj);
    if (parsed.success) return { kind: "structured", data: parsed.data };
  }

  if (obj.status === "raw-fallback") {
    const sources = Array.isArray(obj.sources)
      ? (obj.sources as Array<Record<string, unknown>>).map((s) => ({
          url: typeof s.url === "string" ? s.url : null,
          titre: typeof s.titre === "string" ? s.titre : null,
        }))
      : [];
    return {
      kind: "raw-fallback",
      finalAnalysis:
        typeof obj.finalAnalysis === "string" ? obj.finalAnalysis : null,
      sources,
    };
  }

  const parsed = deepResearchOutputSchema.safeParse(obj);
  if (parsed.success) return { kind: "structured", data: parsed.data };

  return { kind: "unknown" };
}

const MONTHS_FR = [
  "janv.",
  "févr.",
  "mars",
  "avril",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
] as const;

function formatDate(d: Date): string {
  const time = d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()} · ${time}`;
}
