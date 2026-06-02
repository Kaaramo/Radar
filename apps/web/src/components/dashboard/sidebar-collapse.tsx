"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PanelLeftOpen } from "lucide-react";

/**
 * État partagé du masquage de la sidebar (nav gauche).
 *
 * - Persisté en `localStorage` pour survivre aux navigations / reloads.
 * - Raccourci clavier ⌘B / Ctrl+B (⌘K est déjà pris par la palette).
 * - `ready` n'est `true` qu'après hydratation : on n'active les transitions
 *   qu'à ce moment-là pour éviter une animation parasite au premier paint
 *   quand l'utilisateur avait laissé la nav masquée.
 */

const STORAGE_KEY = "radar:sidebar-collapsed";

type SidebarCollapseValue = {
  collapsed: boolean;
  ready: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
};

const SidebarCollapseContext = createContext<SidebarCollapseValue | null>(null);

function persist(value: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    /* localStorage indisponible (mode privé) : on ignore silencieusement */
  }
}

export function SidebarCollapseProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsedState] = useState(false);
  const [ready, setReady] = useState(false);

  // Hydratation après montage (évite tout mismatch SSR : le serveur rend
  // toujours la nav ouverte).
  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") {
        setCollapsedState(true);
      }
    } catch {
      /* noop */
    }
    setReady(true);
  }, []);

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value);
    persist(value);
  }, []);

  const toggle = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev;
      persist(next);
      return next;
    });
  }, []);

  // Raccourci ⌘B / Ctrl+B
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const value = useMemo<SidebarCollapseValue>(
    () => ({ collapsed, ready, toggle, setCollapsed }),
    [collapsed, ready, toggle, setCollapsed],
  );

  return (
    <SidebarCollapseContext.Provider value={value}>
      {children}
    </SidebarCollapseContext.Provider>
  );
}

/**
 * Hook de consommation. Fallback no-op hors provider : permet à `AppSidebar`
 * de rester utilisable isolément (ex : tests, Storybook) sans planter.
 */
export function useSidebarCollapse(): SidebarCollapseValue {
  const ctx = useContext(SidebarCollapseContext);
  if (ctx) return ctx;
  return {
    collapsed: false,
    ready: false,
    toggle: () => {},
    setCollapsed: () => {},
  };
}

/**
 * Languette de réouverture — collée au bord gauche, à mi-hauteur. N'apparaît
 * (fade + slide) que lorsque la nav est masquée. Posée en `absolute` par
 * `AppShell` au-dessus de la colonne de contenu.
 */
export function SidebarReopenTab() {
  const { collapsed, ready, toggle } = useSidebarCollapse();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Afficher la navigation (⌘B)"
      title="Afficher la navigation (⌘B)"
      tabIndex={collapsed ? 0 : -1}
      className={`group absolute left-0 top-1/2 z-20 flex h-14 w-6 -translate-y-1/2 items-center justify-center rounded-r-md border border-l-0 border-navy-700 bg-navy-900/80 text-muted-soft backdrop-blur-sm ease-out hover:border-royal hover:text-bone motion-reduce:transition-none ${
        ready ? "transition-[opacity,transform] duration-200" : ""
      } ${
        collapsed
          ? "translate-x-0 opacity-100"
          : "pointer-events-none -translate-x-full opacity-0"
      }`}
    >
      <PanelLeftOpen
        size={15}
        strokeWidth={1.6}
        className="transition-transform duration-150 ease-out group-hover:translate-x-0.5"
      />
    </button>
  );
}
