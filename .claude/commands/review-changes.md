---
name: review-changes
description: Passer en revue les changements non commites du monorepo
---

1. Lancer `git status` pour voir l'etat global
2. Lancer `git diff` pour voir les changements non stages
3. Lancer `git diff --staged` pour voir les changements stages
4. Pour chaque fichier modifie, examiner :
   - **Correction** : le code fait-il ce qu'il est cense faire selon le PRD ou la SPEC ?
   - **Cas limites** : y a-t-il des inputs non geres ?
   - **Style** : le code respecte-t-il les conventions RADAR (charte Intel Dark, classes Tailwind avec tokens, pas de hex hardcode) ?
   - **Bugs potentiels** : race conditions, null checks manquants, types incorrects, oublis de `await`
   - **Securite** : donnees sensibles exposees, header `X-Internal-Secret` present sur les routes `/api/internal/*`
   - **Workspace** : Karamo ne devrait pas modifier `apps/agent/`, et inversement
5. Lister les problemes : fichier, ligne, nature, correction suggeree
6. Si aucun probleme : « Revue propre, pret a commiter. »
