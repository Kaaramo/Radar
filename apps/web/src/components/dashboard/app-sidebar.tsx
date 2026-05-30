import Link from "next/link";
import {
  Building2,
  Compass,
  FileText,
  Globe2,
  History,
  LayoutDashboard,
  Radar,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import type { CycleState } from "@/lib/dashboard/queries";

/**
 * Item actif de la sidebar — supporte les 8 pages + paramètres.
 *
 * Note : `competitors` couvre à la fois `/competitors` (liste hub) et
 * `/competitors/[id]` (détail). La page détail passe `activeConcurrentId` pour
 * highlight (V2 quand la sidebar listera les concurrents en sous-items).
 */
export type AppActiveKey =
  | "brief"
  | "weak-signals"
  | "competitors"
  | "swot"
  | "pestel"
  | "reports"
  | "cycles"
  | "settings";

/**
 * @deprecated Compatibilité legacy : ancien nommage utilisé par `dashboard-client.tsx`.
 * Sera supprimé après refacto complet du dashboard.
 */
export type LegacyActiveKey = "dashboard" | "competitors" | "settings";

export type SidebarConcurrent = {
  id: string;
  nom: string;
  count: number;
  hasCritique?: boolean;
};

export type AppSidebarProps = {
  /** Page active. Accepte le nouveau nommage + legacy pour transition. */
  active?: AppActiveKey | LegacyActiveKey;
  /** @deprecated Plus utilisé — chaque vue a maintenant sa propre route. */
  subActive?: "feed" | "weak-signals" | "cycles" | "reports";
  cycleState?: CycleState;
  movementCount?: number;
  weakSignalCount?: number;
  /** @deprecated Section Concurrents retirée de la sidebar. */
  concurrents?: SidebarConcurrent[];
  /** @deprecated voir `concurrents`. */
  activeConcurrentId?: string;
};

type NavItemProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  count?: number;
  countTone?: "teal" | "safran" | "neutral";
  italic?: string | null;
};

function NavItem({
  href,
  icon: Icon,
  label,
  isActive,
  count,
  countTone = "neutral",
  italic,
}: NavItemProps) {
  const countColor =
    countTone === "safran"
      ? "text-warning"
      : countTone === "teal"
        ? "text-royal"
        : "text-muted-soft";

  return (
    <Link
      href={href}
      className={`group flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] transition-colors duration-150 ease-out ${
        isActive
          ? "bg-navy-800 text-bone"
          : "text-muted hover:bg-navy-900 hover:text-bone"
      }`}
    >
      <Icon
        size={15}
        strokeWidth={1.6}
        className={
          isActive ? "text-royal" : "text-muted-soft group-hover:text-muted"
        }
      />
      <span className="flex-1 truncate">{label}</span>
      {italic ? (
        <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-royal">
          {italic}
        </span>
      ) : count !== undefined && count > 0 ? (
        <span className={`font-mono text-[11px] ${countColor}`}>{count}</span>
      ) : null}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1 mt-5 px-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-soft/80">
      {children}
    </div>
  );
}

/**
 * Sidebar dashboard — 220px, Linear-style, 3 groupes sémantiques.
 *
 *  AUJOURD'HUI : Brief (24h) + Signaux faibles (à arbitrer)
 *  ANALYSE     : Concurrents (hub) + SWOT + PESTEL (livrables stratégiques M244)
 *  LIVRABLES   : Rapports (export) + Cycles (audit trail)
 *
 *  Paramètres en bas, séparé visuellement par un divider hairline.
 */
export function AppSidebar({
  active = "brief",
  cycleState = "completed",
  movementCount = 0,
  weakSignalCount = 0,
}: AppSidebarProps) {
  // Normalisation des clés legacy → nouvelles clés
  const normalizedActive: AppActiveKey =
    active === "dashboard" ? "brief" : (active as AppActiveKey);

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col overflow-y-auto border-r border-navy-700 bg-navy py-4">
      <div className="flex-1 px-3">
        {/* AUJOURD'HUI — le quotidien actionnable */}
        <SectionLabel>Aujourd&apos;hui</SectionLabel>
        <nav className="flex flex-col gap-px">
          <NavItem
            href="/dashboard"
            icon={LayoutDashboard}
            label="Brief"
            isActive={normalizedActive === "brief"}
            count={movementCount}
            countTone="teal"
          />
          <NavItem
            href="/weak-signals"
            icon={Radar}
            label="Signaux faibles"
            isActive={normalizedActive === "weak-signals"}
            count={weakSignalCount}
            countTone="safran"
          />
        </nav>

        {/* ANALYSE — exploration profonde */}
        <SectionLabel>Analyse</SectionLabel>
        <nav className="flex flex-col gap-px">
          <NavItem
            href="/competitors"
            icon={Building2}
            label="Concurrents"
            isActive={normalizedActive === "competitors"}
          />
          <NavItem
            href="/swot"
            icon={Compass}
            label="SWOT"
            isActive={normalizedActive === "swot"}
          />
          <NavItem
            href="/pestel"
            icon={Globe2}
            label="PESTEL"
            isActive={normalizedActive === "pestel"}
          />
        </nav>

        {/* LIVRABLES — ce qu'on extrait du produit */}
        <SectionLabel>Livrables</SectionLabel>
        <nav className="flex flex-col gap-px">
          <NavItem
            href="/reports"
            icon={FileText}
            label="Rapports"
            isActive={normalizedActive === "reports"}
          />
          <NavItem
            href="/cycles"
            icon={History}
            label="Cycles"
            isActive={normalizedActive === "cycles"}
            italic={cycleState === "running" ? "En cours" : null}
          />
        </nav>
      </div>

      {/* Paramètres — divider hairline + item */}
      <div className="px-3 pb-1">
        <div className="my-3 h-px bg-navy-700" />
        <NavItem
          href="/settings"
          icon={Settings}
          label="Paramètres"
          isActive={normalizedActive === "settings"}
        />
      </div>

      {/* Avoid unused import warning */}
      <span aria-hidden="true" className="hidden">
        <ShieldCheck size={0} />
      </span>
    </aside>
  );
}
