"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { getEnrichissementStatus } from "@/lib/actions/settings";

export type DeepResearchPollerProps = {
  /** Statut courant retourné par le Server Component parent. */
  initialStatut: "IDLE" | "IN_PROGRESS" | "SUCCESS" | "FAILED";
  /** Intervalle de polling en ms. Default 8s (assez réactif sans saturer Neon). */
  intervalMs?: number;
};

/**
 * Composant invisible : poll le statut d'enrichissement tant que `IN_PROGRESS`,
 * et déclenche un `router.refresh()` quand il change. Pas de state UI propre —
 * c'est le parent Server Component qui se re-rend avec la donnée fraîche.
 *
 * Stop conditions :
 *   - Statut ≠ IN_PROGRESS (SUCCESS / FAILED / IDLE)
 *   - Composant démonté (cleanup)
 *   - Page perd le focus (visibility hidden) → on met en pause le polling
 */
export function DeepResearchPoller({
  initialStatut,
  intervalMs = 8000,
}: DeepResearchPollerProps) {
  const router = useRouter();
  const lastStatutRef = useRef(initialStatut);

  useEffect(() => {
    if (initialStatut !== "IN_PROGRESS") return;

    let cancelled = false;

    const poll = async () => {
      if (cancelled) return;
      if (document.visibilityState === "hidden") return;

      const status = await getEnrichissementStatus();
      if (cancelled || !status) return;

      if (status.statut !== lastStatutRef.current) {
        lastStatutRef.current = status.statut;
        router.refresh();
      }
    };

    const timer = setInterval(poll, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [initialStatut, intervalMs, router]);

  return null;
}
