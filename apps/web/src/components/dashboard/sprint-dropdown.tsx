"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Calendar, Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Menu déroulant de sélection du sprint de veille (semaine), partagé par les
 * pages SWOT / PESTEL / Signaux faibles. Navigue vers `?c=<concurrent>&w=<id>`
 * en conservant le concurrent actif.
 *
 * L'option spéciale `value: "all"` (utilisée par Signaux) affiche tous les
 * sprints — le `w` est alors retiré de l'URL.
 */
export type SprintOption = {
  /** rapportId du sprint, ou "all" pour « tous les sprints ». */
  value: string;
  /** Libellé semaine, ex « Semaine du 26 mai ». */
  semaine: string;
  /** Date de génération lisible (optionnelle). */
  date?: string;
  /** Petit décompte affiché à droite (ex nb de signaux), optionnel. */
  count?: number;
};

export function SprintDropdown({
  concurrentId,
  options,
  activeValue,
}: {
  concurrentId: string;
  options: SprintOption[];
  activeValue: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  if (options.length === 0) return null;

  const active = options.find((o) => o.value === activeValue) ?? options[0];

  const select = (value: string) => {
    setOpen(false);
    const url =
      value === "all"
        ? `${pathname}?c=${concurrentId}`
        : `${pathname}?c=${concurrentId}&w=${value}`;
    router.push(url);
  };

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-md border bg-navy-900 px-3 text-[12.5px] font-medium transition-colors duration-150 ease-out",
          open
            ? "border-royal/50 text-bone"
            : "border-navy-700 text-muted hover:border-royal/40 hover:text-bone",
        )}
      >
        <Calendar size={13} strokeWidth={1.6} className="text-muted-soft" />
        <span className="tabular-nums">{active?.semaine ?? "Sprint"}</span>
        <ChevronDown
          size={14}
          strokeWidth={1.6}
          className={cn(
            "text-muted-soft transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute left-0 z-30 mt-1.5 max-h-[320px] min-w-[260px] overflow-y-auto rounded-md border border-navy-700 bg-navy-900 p-1 shadow-xl"
        >
          {options.map((o) => {
            const isActive = o.value === active?.value;
            return (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => select(o.value)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-[12.5px] transition-colors duration-150",
                    isActive
                      ? "bg-royal/10 text-bone"
                      : "text-muted hover:bg-navy-800 hover:text-bone",
                  )}
                >
                  <Check
                    size={13}
                    strokeWidth={2}
                    className={cn(
                      "shrink-0",
                      isActive ? "text-royal-light" : "text-transparent",
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {o.semaine}
                    {o.date ? (
                      <span className="ml-1.5 font-mono text-[10px] text-muted-soft">
                        {o.date}
                      </span>
                    ) : null}
                  </span>
                  {typeof o.count === "number" ? (
                    <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-soft">
                      {o.count}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
