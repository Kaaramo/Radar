import {
  CheckCircle2,
  CircleDashed,
  Loader2,
  OctagonX,
  PauseCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { RapportStatut } from "@/lib/dashboard/types";

/**
 * Badge de statut UNIQUE et cohérent dans toute l'app.
 *
 * Source de vérité : le statut EFFECTIF calculé côté serveur (`queries.ts`),
 * qui transforme un `EN_COURS` figé en `INTERROMPU`. Plus aucun « ça tourne »
 * fantôme : chaque état correspond à la réalité.
 */
const CONFIG: Record<
  RapportStatut,
  { label: string; className: string; Icon: typeof Loader2; spin?: boolean }
> = {
  EN_ATTENTE: {
    label: "En attente",
    className: "bg-fog/10 text-fog",
    Icon: CircleDashed,
  },
  EN_COURS: {
    label: "En cours",
    className: "bg-royal/15 text-royal",
    Icon: Loader2,
    spin: true,
  },
  TERMINE: {
    label: "Terminé",
    className: "bg-emerald-500/15 text-emerald-400",
    Icon: CheckCircle2,
  },
  INTERROMPU: {
    label: "Interrompu",
    className: "bg-amber/15 text-amber",
    Icon: PauseCircle,
  },
  ECHEC: {
    label: "Échec",
    className: "bg-red-500/15 text-red-400",
    Icon: OctagonX,
  },
};

export function StatutBadge({
  statut,
  className,
}: {
  statut: RapportStatut;
  className?: string;
}) {
  const { label, className: cls, Icon, spin } = CONFIG[statut];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        cls,
        className,
      )}
    >
      <Icon className={cn("h-3 w-3", spin && "animate-spin")} strokeWidth={2} />
      {label}
    </span>
  );
}
