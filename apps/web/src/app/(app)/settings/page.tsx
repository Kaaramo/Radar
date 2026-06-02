import { AppShell } from "@/components/dashboard/app-shell";
import { AxesSection } from "@/components/settings/axes-section";
import { DeepResearchSection } from "@/components/settings/deep-research-section";
import {
  SettingsNav,
  type SettingsNavStatus,
  type SettingsSection,
} from "@/components/settings/settings-nav";
import {
  ConcurrentsSection,
  NotificationsSection,
  ProfilSection,
} from "@/components/settings/stub-sections";
import type { AxeKey } from "@/lib/onboarding/axes";
import { AXES_KEYS } from "@/lib/onboarding/axes";
import { getOnboardingState } from "@/lib/onboarding/state";

export const metadata = {
  title: "RADAR · Paramètres",
};

const VALID_SECTIONS: SettingsSection[] = [
  "profil",
  "concurrents",
  "axes",
  "deep-research",
  "notifications",
];

function parseSection(raw: string | undefined): SettingsSection {
  if (raw && (VALID_SECTIONS as string[]).includes(raw)) {
    return raw as SettingsSection;
  }
  return "deep-research";
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; relaunched?: string }>;
}) {
  const params = await searchParams;
  const state = await getOnboardingState();
  const section = parseSection(params.section);
  const justRelaunched = params.relaunched === "1";

  const entrepriseName = state.profil?.nomEntreprise ?? "Marka Logistics";
  const selectedAxesRaw: string[] =
    (state.profil?.axes as string[] | undefined) ?? [];
  const isAxeKey = (v: string): v is AxeKey =>
    (AXES_KEYS as readonly string[]).includes(v);
  const selectedAxes: AxeKey[] = selectedAxesRaw.filter(isAxeKey);

  // ── Compute nav statuses ─────────────────────────────────────
  // Profil : ok si nom + site renseignés
  const profilOk = !!(state.profil?.nomEntreprise && state.profil?.siteWeb);
  // Concurrents : count si > 0
  const concurrentsCount = state.concurrents.length;
  // Axes : count si choisis
  const axesCount = selectedAxes.length;
  // Deep Research : source de vérité = enrichissementStatut DB
  const drStatut = state.profil?.enrichissementStatut ?? "IDLE";
  const drOk = drStatut === "SUCCESS";
  const drFailed = drStatut === "FAILED";
  const drInProgress = drStatut === "IN_PROGRESS";
  // Notifications : email présent = ok
  const notifOk = !!state.userEmail;

  const navStatuses: Partial<Record<SettingsSection, SettingsNavStatus>> = {
    profil: profilOk ? { kind: "ok" } : { kind: "idle" },
    concurrents:
      concurrentsCount > 0
        ? { kind: "count", value: concurrentsCount }
        : { kind: "idle" },
    axes:
      axesCount > 0 ? { kind: "count", value: axesCount } : { kind: "idle" },
    "deep-research":
      drInProgress || justRelaunched
        ? { kind: "warn" }
        : drOk
          ? { kind: "ok" }
          : drFailed
            ? { kind: "warn" }
            : { kind: "idle" },
    notifications: notifOk ? { kind: "ok" } : { kind: "idle" },
  };

  return (
    <AppShell
      briefBarProps={{
        entrepriseName,
        currentPage: "Paramètres",
        userName: state.userName,
        userEmail: state.userEmail,
      }}
      sidebarProps={{ active: "settings" }}
    >
      <div className="flex w-full overflow-hidden">
        <SettingsNav active={section} statuses={navStatuses} />
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[720px] px-12 pb-16 pt-12">
            {section === "deep-research" ? (
              <DeepResearchSection
                enrichissement={state.profil?.enrichissement ?? null}
                enrichissementLe={state.profil?.enrichissementLe ?? null}
                enrichissementVer={state.profil?.enrichissementVer ?? null}
                enrichissementStatut={
                  state.profil?.enrichissementStatut ?? "IDLE"
                }
                enrichissementErreur={
                  state.profil?.enrichissementErreur ?? null
                }
                onboardingCompleteLe={
                  state.profil?.onboardingCompleteLe ?? null
                }
                justRelaunched={justRelaunched}
                headerTitle="Profil business"
              />
            ) : section === "profil" ? (
              <ProfilSection
                profil={state.profil}
                userEmail={state.userEmail}
              />
            ) : section === "concurrents" ? (
              <ConcurrentsSection concurrents={state.concurrents} />
            ) : section === "axes" ? (
              <AxesSection initialSelectedAxes={selectedAxes} />
            ) : (
              <NotificationsSection userEmail={state.userEmail} />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
