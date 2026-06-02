"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Search } from "lucide-react";

export type CommandPaletteConcurrent = {
  id: string;
  nom: string;
  secteur?: string | null;
};

export type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  concurrents: CommandPaletteConcurrent[];
};

/**
 * Palette de commandes — recherche d'un concurrent (⌘K).
 * Action : Concurrent → `/competitors/<id>`.
 */
export function CommandPalette({
  open,
  onClose,
  concurrents,
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return concurrents;
    return concurrents.filter(
      (c) =>
        c.nom.toLowerCase().includes(q) ||
        (c.secteur?.toLowerCase().includes(q) ?? false),
    );
  }, [concurrents, query]);

  useEffect(() => {
    setHighlight(0);
  }, [query, open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlight(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => Math.min(filtered.length - 1, h + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => Math.max(0, h - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[highlight];
        if (item) {
          router.push(`/competitors/${item.id}`);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, highlight, onClose, router]);

  if (!open) return null;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className="backdrop-fade-in fixed inset-0 z-40 bg-navy/70 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Recherche"
        className="fade-mount fixed left-1/2 top-[20vh] z-50 w-full max-w-[560px] -translate-x-1/2 overflow-hidden rounded-lg border border-navy-700 bg-navy-900 shadow-lg"
      >
        <div className="flex h-12 items-center gap-3 border-b border-navy-700 px-4">
          <Search size={16} strokeWidth={1.6} className="text-muted-soft" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un concurrent..."
            className="flex-1 border-0 bg-transparent text-[14px] text-bone outline-none placeholder:text-muted-soft"
          />
          <kbd className="rounded border border-navy-700 bg-navy-800 px-1.5 py-0.5 font-mono text-[10px] text-muted-soft">
            ESC
          </kbd>
        </div>

        <div className="max-h-[480px] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="m-0 text-[13px] text-muted">
                Aucun concurrent pour «&nbsp;{query}&nbsp;»
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 px-4 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-soft">
                <span>{query ? "Concurrents" : "Vos concurrents"}</span>
                <span aria-hidden="true" className="text-muted-soft/40">
                  ·
                </span>
                <span className="tabular-nums">{filtered.length}</span>
              </div>
              {filtered.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  onMouseMove={() => setHighlight(idx)}
                  onClick={() => {
                    router.push(`/competitors/${c.id}`);
                    onClose();
                  }}
                  className={`flex h-9 w-full items-center gap-3 px-4 text-left text-[13px] transition-colors duration-100 ease-out ${
                    idx === highlight ? "bg-navy-800 text-bone" : "text-muted"
                  }`}
                >
                  <Building2
                    size={14}
                    strokeWidth={1.6}
                    className={
                      idx === highlight ? "text-royal" : "text-muted-soft"
                    }
                  />
                  <span className="flex-1 truncate">{c.nom}</span>
                  {c.secteur ? (
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-muted-soft">
                      {c.secteur}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-navy-700 bg-navy px-4 py-2 font-mono text-[10px] text-muted-soft">
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-navy-700 bg-navy-800 px-1 py-0.5 text-[9px]">
              ↑↓
            </kbd>
            naviguer
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-navy-700 bg-navy-800 px-1 py-0.5 text-[9px]">
              ↵
            </kbd>
            ouvrir
          </span>
          <span className="flex-1" />
          <span className="tabular-nums">{filtered.length}</span>
        </div>
      </div>
    </>
  );
}
