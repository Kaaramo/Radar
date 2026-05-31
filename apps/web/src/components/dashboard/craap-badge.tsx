import { cn } from "@/lib/utils";

/**
 * Badge de score CRAAP (grille M244, chapitre 3).
 *
 * CRAAP = 5 critères de crédibilité d'une source, chacun noté /10 :
 *   Currency (actualité), Relevance (pertinence), Authority (autorité),
 *   Accuracy (exactitude), Purpose (intention).
 * Le total affiché est la somme, sur 50. Seuils : ≥40 fiable, 30-39 modéré,
 * < 30 à vérifier.
 */
export function craapNiveau(total: number): {
  label: string;
  className: string;
} {
  if (total >= 40) return { label: "Fiable", className: "text-emerald-400" };
  if (total >= 30) return { label: "Modéré", className: "text-royal" };
  return { label: "À vérifier", className: "text-amber" };
}

export function CraapBadge({
  total,
  className,
}: {
  total: number | null;
  className?: string;
}) {
  if (total === null) {
    return <span className="font-mono text-xs text-fog">—</span>;
  }
  const { className: color } = craapNiveau(total);
  return (
    <span
      title={`Score CRAAP ${total}/50 (Currency · Relevance · Authority · Accuracy · Purpose)`}
      className={cn("font-mono text-xs tabular-nums", color, className)}
    >
      {total}
      <span className="text-fog">/50</span>
    </span>
  );
}

/**
 * Petite légende explicative du score CRAAP, à poser sous une liste de sources.
 */
export function CraapLegend() {
  return (
    <p className="mt-3 text-[11px] leading-relaxed text-fog">
      <span className="font-mono text-royal">CRAAP /50</span> = crédibilité de
      la source (Currency, Relevance, Authority, Accuracy, Purpose, chacun /10).
      Méthode M244, chapitre 3.
    </p>
  );
}
