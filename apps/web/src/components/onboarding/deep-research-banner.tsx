import { Sparkles } from "lucide-react";

/**
 * Banner premium « AI Deep Research ».
 *
 * Composition :
 *   - Card surface élevée avec border-left en gradient teal → safran
 *   - Halo radial teal subtil en haut-droite (atmosphère)
 *   - Icône Sparkles dans un carré tinté teal avec ring (style Linear/Vercel)
 *   - Eyebrow mono uppercase « PROPULSÉ PAR IA » (signature premium)
 *   - Titre + description hiérarchisés
 *   - 3 mini-tags mono des artefacts produits (secteur · concurrents · positionnement)
 */
export function DeepResearchBanner() {
  return (
    <div
      role="note"
      className="relative overflow-hidden rounded-lg border border-navy-700 bg-navy-900 p-5"
    >
      {/* Bordure latérale gauche en gradient teal → safran */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[3px]"
        style={{
          background:
            "linear-gradient(to bottom, #2251FF 0%, rgba(34,81,255,0.4) 50%, #C77700 100%)",
        }}
      />

      {/* Halo radial teal — atmosphère premium */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-royal/10 blur-2xl"
      />

      <div className="relative flex gap-4">
        {/* Icône dans un carré tinté avec ring */}
        <div className="dr-pulse flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-royal/10 text-royal ring-1 ring-royal/20">
          <Sparkles size={18} strokeWidth={1.5} aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          {/* Titre */}
          <div className="text-[15px] font-semibold leading-[1.4] text-bone">
            AI Deep Research
          </div>

          {/* Description */}
          <p className="mt-1.5 text-[13.5px] leading-[1.55] text-muted">
            Dès que vous passez à l&apos;étape suivante, notre agent autonome
            explore le web pour reconstituer votre profil business — secteur,
            positionnement, concurrents implicites et signaux stratégiques
            récents.
          </p>

          {/* Mini-tags des artefacts produits */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              "Secteur",
              "Concurrents",
              "Positionnement",
              "Signaux récents",
            ].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-navy-700 bg-navy-800 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted-soft"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
