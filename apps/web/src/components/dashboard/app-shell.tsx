import type { ReactNode } from "react";

import { AppSidebar, type AppSidebarProps } from "./app-sidebar";
import { BriefBar, type BriefBarProps } from "./brief-bar";

export type AppShellProps = {
  children: ReactNode;
  /** Props du brief bar (top, full-width) */
  briefBarProps: BriefBarProps;
  /** Props du sidebar gauche */
  sidebarProps?: AppSidebarProps;
  /** Panneau droit (380px). Optionnel : si absent, pas de colonne droite. */
  contextPanel?: ReactNode;
  /** Overlay rendu à la racine (command palette, modal). */
  overlay?: ReactNode;
};

/**
 * Layout shell :
 * ┌────────────────────────────────────────────────────────────────┐
 * │ BriefBar (56px, full-width, sticky)                            │
 * ├──────────┬───────────────────────────┬─────────────────────────┤
 * │ Sidebar  │ Main scrollable           │ Context panel (opt)     │
 * │ 220px    │ flex-1                    │ 380px                   │
 * └──────────┴───────────────────────────┴─────────────────────────┘
 */
export function AppShell({
  children,
  briefBarProps,
  sidebarProps,
  contextPanel,
  overlay,
}: AppShellProps) {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-navy">
      <BriefBar {...briefBarProps} />
      <div className="flex min-h-0 flex-1">
        <AppSidebar {...sidebarProps} />
        <main className="flex min-w-0 flex-1 overflow-hidden">{children}</main>
        {contextPanel}
      </div>
      {overlay}
    </div>
  );
}
