export type ConcurrentGroupHeaderProps = {
  nom: string;
  secteur?: string;
  count: number;
  critiqueCount?: number;
};

/**
 * Header sticky qui groupe les mouvements par concurrent.
 *
 * Disposition Apple-like : nom + secteur à gauche, indicateur critique unique
 * à droite (seulement si critiqueCount > 0). Aucun compteur "X mvt" — la
 * densité de l'information est portée par les rows et leurs scores.
 *
 * Sticky avec backdrop-blur translucide (signature Apple).
 */
export function ConcurrentGroupHeader({
  nom,
  secteur,
  critiqueCount = 0,
}: ConcurrentGroupHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex h-8 items-center gap-2 border-b border-navy-700/60 bg-navy/85 px-4 backdrop-blur-md">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-bone">
        {nom}
      </span>
      {secteur ? (
        <>
          <span aria-hidden="true" className="text-muted-soft/50">
            ·
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-soft">
            {secteur}
          </span>
        </>
      ) : null}

      <span className="flex-1" />

      {critiqueCount > 0 ? (
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-warning">
          <span
            aria-hidden="true"
            className="live-pulse h-1.5 w-1.5 rounded-full bg-warning"
          />
          {critiqueCount > 1 ? `${critiqueCount} critiques` : "Critique"}
        </span>
      ) : null}
    </div>
  );
}
