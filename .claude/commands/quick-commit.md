---
name: quick-commit
description: Stager et commiter rapidement avec un message descriptif (pas de push)
---

1. Verifier la branche courante : `git branch --show-current`
2. Si on est sur `main`, ARRETER et demander a l'utilisateur de creer une feature branch
3. Faire `git add -A`
4. Analyser le diff stage pour comprendre la nature du changement
5. Rediger un message de commit conventionnel court et descriptif :
   - Format : `<type>(<scope>): <description>`
   - Types : `feat`, `fix`, `refactor`, `docs`, `chore`, `test`
   - Scopes possibles RADAR : `web`, `agent`, `database`, `contracts`, `branding`, `infra`, `docs`, `monorepo`
   - Exemple : `feat(web): ajouter la carte mouvement avec border-left teal`
6. Commiter avec `Co-Authored-By: Claude <noreply@anthropic.com>`

Pas de push, pas de PR. Juste un commit rapide sur la feature branch courante.
