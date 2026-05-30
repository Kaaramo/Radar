"use client";

import { useEffect } from "react";
import { Search } from "lucide-react";

import { RadarLockupLight } from "@/components/brand/logo";

import { AvatarMenu } from "./avatar-menu";

export type BriefBarCycleState = "idle" | "running" | "completed";

export type BriefBarProps = {
  entrepriseName: string;
  /**
   * Titre de la page courante. Affiché dans le breadcrumb après le nom
   * entreprise : « Marka Logistics / Brief ».
   */
  currentPage: string;
  /**
   * Sous-page parente (optionnel). Pour les pages détail :
   * « Marka Logistics / Concurrents / Maroc Telecom ».
   */
  parentPage?: { label: string; href: string };
  /**
   * État du cycle de veille — affiché en permanence au centre.
   * Default 'completed' ('Veille active'). Sur /dashboard et /weak-signals on
   * passe la vraie valeur lue depuis `getDashboardData`.
   */
  cycleState?: BriefBarCycleState;
  userName: string;
  userEmail: string;
  /**
   * Handler d'ouverture de la palette ⌘K. Si absent, l'input search n'est
   * pas affiché (ex : pages où la palette n'a pas été câblée).
   */
  onCommandPalette?: () => void;
};

/**
 * Top bar permanente — 60px, structure « identité · contexte · système · actions ».
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │ [Logo] Entreprise / Page    [● Statut]    [🔍 Rechercher  ⌘K]  [👤] │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * 3 zones :
 *   - Gauche : logo + breadcrumb permanent (identité + contexte de page)
 *   - Centre : status pill du cycle de veille (système vivant)
 *   - Droite : ⌘K input-style 240px + avatar (actions + user)
 *
 * Raccourci ⌘K / Ctrl+K géré globalement via useEffect.
 */
export function BriefBar({
  entrepriseName,
  currentPage,
  parentPage,
  cycleState = "completed",
  userName,
  userEmail,
  onCommandPalette,
}: BriefBarProps) {
  // Raccourci ⌘K / Ctrl+K (global)
  useEffect(() => {
    if (!onCommandPalette) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onCommandPalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCommandPalette]);

  return (
    <header className="flex h-[60px] shrink-0 items-center gap-6 border-b border-navy-700 bg-navy px-6">
      {/* ── Gauche : logo + breadcrumb ─────────────────────── */}
      <Breadcrumb
        entrepriseName={entrepriseName}
        currentPage={currentPage}
        parentPage={parentPage}
      />

      {/* ── Spacer (laisse le status pill se centrer optiquement) ── */}
      <div className="flex-1" />

      {/* ── Centre : status cycle ──────────────────────────── */}
      <StatusPill state={cycleState} />

      {/* ── Spacer ─────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Droite : ⌘K input-style + avatar ───────────────── */}
      {onCommandPalette ? <SearchInput onOpen={onCommandPalette} /> : null}
      <AvatarMenu name={userName} email={userEmail} />
    </header>
  );
}

/* ── Breadcrumb (logo + entreprise / [parent /] page) ───────────── */

function Breadcrumb({
  entrepriseName,
  currentPage,
  parentPage,
}: {
  entrepriseName: string;
  currentPage: string;
  parentPage?: { label: string; href: string };
}) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <RadarLockupLight height={22} />
      <span aria-hidden="true" className="h-4 w-px bg-navy-700" />
      <nav
        aria-label="Fil d'Ariane"
        className="flex items-center gap-1.5 text-[13px]"
      >
        <span className="font-medium text-bone">{entrepriseName}</span>
        <Slash />
        {parentPage ? (
          <>
            <a
              href={parentPage.href}
              className="text-muted-soft transition-colors duration-150 ease-out hover:text-bone"
            >
              {parentPage.label}
            </a>
            <Slash />
          </>
        ) : null}
        <span className="text-muted">{currentPage}</span>
      </nav>
    </div>
  );
}

function Slash() {
  return (
    <span
      aria-hidden="true"
      className="select-none text-[13px] text-muted-soft/60"
    >
      /
    </span>
  );
}

/* ── Status pill (cycle de veille) ──────────────────────────────── */

const STATUS_META: Record<
  BriefBarCycleState,
  { label: string; dotColor: string; pulse: boolean; textColor: string }
> = {
  idle: {
    label: "Veille programmée · 6h",
    dotColor: "var(--color-muted-soft)",
    pulse: false,
    textColor: "text-muted",
  },
  running: {
    label: "Veille en cours",
    dotColor: "var(--color-royal)",
    pulse: true,
    textColor: "text-bone",
  },
  completed: {
    label: "Veille active",
    dotColor: "var(--color-success)",
    pulse: false,
    textColor: "text-bone",
  },
};

function StatusPill({ state }: { state: BriefBarCycleState }) {
  const meta = STATUS_META[state];
  return (
    <div className="flex h-7 shrink-0 items-center gap-2 rounded-md border border-navy-700 bg-navy-900/60 pl-2.5 pr-3">
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${meta.pulse ? "live-pulse" : ""}`}
        style={{ background: meta.dotColor }}
      />
      <span
        className={`font-mono text-[11px] font-medium tracking-[0.02em] ${meta.textColor}`}
      >
        {meta.label}
      </span>
    </div>
  );
}

/* ── Search input (⌘K trigger) ──────────────────────────────────── */

function SearchInput({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Ouvrir la palette de commandes"
      className="group flex h-9 w-[260px] shrink-0 items-center gap-2.5 rounded-md border border-navy-700 bg-navy-900/60 px-3 text-left transition-colors duration-150 ease-out hover:border-navy-700/80 hover:bg-navy-800/60"
    >
      <Search
        size={14}
        strokeWidth={1.6}
        className="shrink-0 text-muted-soft transition-colors duration-150 ease-out group-hover:text-muted"
      />
      <span className="flex-1 truncate text-[12.5px] text-muted-soft transition-colors duration-150 ease-out group-hover:text-muted">
        Rechercher concurrents, mouvements…
      </span>
      <kbd
        aria-hidden="true"
        className="flex h-5 shrink-0 items-center rounded border border-navy-700 bg-navy-800 px-1.5 font-mono text-[10px] text-muted-soft"
      >
        ⌘K
      </kbd>
    </button>
  );
}
