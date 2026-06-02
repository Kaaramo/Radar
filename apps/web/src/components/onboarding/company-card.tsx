"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

import { removeConcurrent } from "@/lib/actions/onboarding";

export type CompanyCardData = {
  id: string;
  nom: string;
  siteWeb: string | null;
};

/**
 * Card d'un concurrent ajouté : avatar lettre + nom + site mono + trash.
 * Animation `comp-in` au mount (slide-in 200ms ease-out).
 */
export function CompanyCard({ data }: { data: CompanyCardData }) {
  const [isPending, startTransition] = useTransition();
  const initial = data.nom.trim().charAt(0).toUpperCase();

  const handleRemove = () => {
    startTransition(async () => {
      await removeConcurrent(data.id);
    });
  };

  return (
    <div
      className="comp-in flex items-center gap-3 rounded-[12px] border border-navy-700 bg-navy-900 px-4 py-3.5"
      style={isPending ? { opacity: 0.5, pointerEvents: "none" } : undefined}
    >
      <div
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy-700 bg-navy-800 font-display text-[14px] font-medium text-bone"
      >
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[16px] font-medium text-bone">{data.nom}</div>
        {data.siteWeb ? (
          <div className="truncate font-mono text-[13px] text-muted">
            {data.siteWeb}
          </div>
        ) : (
          <div className="truncate font-mono text-[13px] italic text-muted-soft">
            Pas de site renseigné
          </div>
        )}
      </div>
      <button
        type="button"
        aria-label={`Supprimer ${data.nom}`}
        onClick={handleRemove}
        disabled={isPending}
        className="inline-flex shrink-0 rounded-md p-2 text-muted-soft transition-colors duration-150 ease-out hover:bg-navy-800 hover:text-error disabled:cursor-not-allowed"
      >
        <Trash2 size={18} strokeWidth={1.5} />
      </button>
    </div>
  );
}
