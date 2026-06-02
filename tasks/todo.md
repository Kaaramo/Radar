# TODO — Finalisation dashboard RADAR (état réel + pages manquantes)

Contexte : 1er cycle réel (orange Maroc) en DB pour `ingenieurkaramo@gmail.com`.
État : 15 sources (CRAAP), 18 signaux, PESTEL riche, **SWOT manquant**, synthèse
vide, rapport figé `EN_COURS 90%` depuis ~12h (zombie).

## Phase 1 — Logique d'état & données (backend)

- [ ] 1.1 Détection des cycles « zombie » : statut effectif `INTERROMPU` quand
      `EN_COURS` + `updatedAt` trop vieux (seuil 20 min). Compteurs corrigés.
- [ ] 1.2 Score CRAAP cohérent : recalcul déterministe `craapTotal` = somme des 5
      dimensions (/50) à l'ingestion (`/api/internal/sources`) + backfill des
      sources existantes.
- [ ] 1.3 Nouvelles queries : SWOT par concurrent, dernier PESTEL, audit trail
      des cycles (pour les 3 pages).
- [ ] 1.4 Server action `relancerRapport` / `marquerInterrompu`.

## Phase 2 — Pages réelles (frontend)

- [ ] 2.1 Page `/swot` : dernière matrice SWOT par concurrent (4 quadrants).
- [ ] 2.2 Page `/pestel` : dernière analyse PESTEL (6 axes).
- [ ] 2.3 Page `/cycles` : audit trail (statut, sources, signaux, CRAAP, timing).
- [ ] 2.4 `context-panel` : gestion SWOT vide (message clair) + score CRAAP /50
      lisible avec légende explicative.
- [ ] 2.5 Badge de statut clair partout (En cours / Terminé / Interrompu / Échec).

## Phase 3 — Générer la data manquante (OpenClaw)

- [ ] 3.1 Reprendre le cycle figé : générer le SWOT manquant + la synthèse
      rédacteur (DeepSeek v4 flash) pour le rapport orange Maroc.
- [ ] 3.2 Si OpenClaw indispo : marquer le rapport proprement + bouton relancer.

## Phase 4 — Tests

- [ ] 4.1 `pnpm exec turbo run type-check`
- [ ] 4.2 `pnpm exec turbo run build`
- [ ] 4.3 Playwright : parcours dashboard + /swot + /pestel + /cycles.

## Bilan

(à remplir)
