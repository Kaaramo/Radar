"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/dashboard/app-shell";
import type { BriefBarProps } from "@/components/dashboard/brief-bar";
import { BriefKanban } from "@/components/dashboard/brief-kanban";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { ContextPanel } from "@/components/dashboard/context-panel";
import type {
  CycleState,
  KanbanData,
  RapportDetail,
} from "@/lib/dashboard/types";

export type DashboardClientProps = {
  data: KanbanData;
  openRapport: RapportDetail | null;
  userName: string;
  userEmail: string;
  entrepriseName: string;
  userConcurrents: { id: string; nom: string; secteur?: string | null }[];
};

/**
 * Vue Brief = page /dashboard, en Kanban (monde « Rapport », data 100% réelle).
 *
 * 4 colonnes (Programmé / En analyse / À lire / Consultés). Clic sur une carte
 * → panneau de détail (synthèse, sources CRAAP, SWOT, PESTEL, signaux).
 */
export function DashboardClient({
  data,
  openRapport,
  userName,
  userEmail,
  entrepriseName,
  userConcurrents,
}: DashboardClientProps) {
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const closeContext = () => router.push("/dashboard");

  const termines = data.columns.A_LIRE.length + data.columns.CONSULTES.length;
  const enAnalyse = data.columns.EN_ANALYSE.length;
  const cycleState: CycleState =
    enAnalyse > 0 ? "running" : termines > 0 ? "completed" : "idle";

  const briefBarProps: BriefBarProps = {
    entrepriseName,
    currentPage: "Brief",
    cycleState,
    userName,
    userEmail,
    onCommandPalette: () => setPaletteOpen(true),
  };

  return (
    <AppShell
      briefBarProps={briefBarProps}
      sidebarProps={{
        active: "brief",
        cycleState,
        movementCount: termines,
        weakSignalCount: data.signalCount,
      }}
      contextPanel={
        <ContextPanel rapport={openRapport} onClose={closeContext} />
      }
      overlay={
        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          concurrents={userConcurrents}
        />
      }
    >
      <BriefKanban data={data} competitorCount={data.competitorCount} />
    </AppShell>
  );
}
