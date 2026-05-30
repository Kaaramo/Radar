---
name: test-and-fix
description: Lancer les verifications du monorepo et corriger tous les echecs en boucle
---

Boucler jusqu'a ce que tout passe :

1. `pnpm exec turbo run type-check` - corriger toutes les erreurs TypeScript dans tous les workspaces
2. `pnpm exec turbo run lint` - corriger toutes les erreurs ESLint
3. `pnpm exec turbo run build` - corriger toutes les erreurs de compilation Next.js et tsc
4. `pnpm --filter @radar/database exec prisma validate` - corriger les erreurs de schema Prisma
5. `pnpm exec turbo run test` (si la tache existe) - corriger les tests en echec

Pour chaque erreur :

- Identifier la cause racine (pas un correctif de surface)
- Corriger
- Relancer la commande qui a echoue

Continuer jusqu'a 0 erreur sur les 5 verifications. Afficher un resume final avec :

- Nombre de fichiers modifies pour chaque correction
- Duree totale du run final
- Statut de chaque verification (vert)
