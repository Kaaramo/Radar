import { LiveStatusPill } from "./live-status-pill";
import { LiveMovementTicker } from "./live-movement-ticker";

export type AuthBrandingPanelProps = {
  variant?: "login" | "register";
};

/**
 * Panneau droit du split layout — direction « Console de veille en direct ».
 *
 * Composition épurée centrée :
 *   - Background : gradient mesh + grille radar + scan-line verticale
 *   - Centre vertical : status pill « EN DIRECT » + slogan éditorial + LiveMovementTicker
 */
export function AuthBrandingPanel({
  variant = "login",
}: AuthBrandingPanelProps) {
  return (
    <aside className="relative flex h-full flex-col overflow-hidden bg-navy-900">
      {/* ── Background layers ───────────────────────────────────────────── */}

      {/* Atmospheric gradient mesh */}
      <div
        className="pointer-events-none absolute inset-0 mesh-bg"
        aria-hidden="true"
      />

      {/* Subtle radar grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 radar-grid-bg"
        aria-hidden="true"
      />

      {/* Vertical scan line (descend lentement, effet radar scan) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 scan-line"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(34, 81, 255, 0.08) 50%, transparent 100%)",
        }}
      />

      {/* ── Content layers ──────────────────────────────────────────────── */}

      <div className="relative z-[2] flex h-full flex-col items-center justify-center p-12 xl:p-16">
        <div className="flex w-full max-w-[480px] flex-col">
          {/* Status pill */}
          <LiveStatusPill />

          {/* Slogan éditorial */}
          <div className="mt-8">
            {variant === "login" ? (
              <>
                <h2 className="m-0 text-[42px] font-bold leading-[1.05] tracking-[-0.02em] text-bone">
                  Vos concurrents
                </h2>
                <h2 className="m-0 text-[42px] font-bold leading-[1.05] tracking-[-0.02em] text-bone">
                  bougent.
                </h2>
                <h2 className="m-0 mt-2 text-[42px] font-bold leading-[1.05] tracking-[-0.02em] text-royal">
                  Radar vous le dit
                </h2>
                <h2 className="m-0 text-[42px] font-bold leading-[1.05] tracking-[-0.02em] text-royal">
                  avant tout le monde.
                </h2>
                <p className="mt-6 max-w-[420px] text-[15px] leading-[1.6] text-muted">
                  Agent IA de veille concurrentielle qui croise sources
                  publiques, applique la grille CRAAP, et génère SWOT et PESTEL.
                </p>
              </>
            ) : (
              <>
                <h2 className="m-0 text-[42px] font-bold leading-[1.05] tracking-[-0.02em] text-bone">
                  Aucun mouvement
                </h2>
                <h2 className="m-0 text-[42px] font-bold leading-[1.05] tracking-[-0.02em] text-bone">
                  concurrent ne devrait
                </h2>
                <h2 className="m-0 mt-2 text-[42px] font-bold leading-[1.05] tracking-[-0.02em] text-royal">
                  vous prendre par
                </h2>
                <h2 className="m-0 text-[42px] font-bold leading-[1.05] tracking-[-0.02em] text-royal">
                  surprise.
                </h2>
                <p className="mt-6 max-w-[420px] text-[15px] leading-[1.6] text-muted">
                  Agent IA, recoupement multi-sources, score CRAAP par source.
                  Le premier rapport méthodologique arrive dans votre boîte
                  demain matin à 7h.
                </p>
              </>
            )}
          </div>

          {/* Live ticker */}
          <div className="mt-10">
            <LiveMovementTicker />
          </div>
        </div>
      </div>
    </aside>
  );
}
