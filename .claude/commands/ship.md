---
name: ship
description: Stager, commiter et pousser sur la feature branch courante (workflow binome avec PR)
---

1. Verifier `git status` et `git diff`
2. Verifier la branche courante : `git branch --show-current`
3. Si on est sur `main` : ARRETER et demander a l'utilisateur de creer une feature branch (`git checkout -b feat/{topic}` ou `git checkout features-{prenom}`)
4. Faire `git add -A`
5. Rediger un message de commit conventionnel :
   - `<type>(<scope>): <description>`
   - Inclure `Co-Authored-By: Claude <noreply@anthropic.com>`
6. Commiter
7. Pousser la branche : `git push -u origin {branche-courante}` (le `-u` premiere fois, sans ensuite)
8. Verifier si une PR existe deja : `gh pr list --head {branche-courante}`
9. Si pas de PR : proposer d'en ouvrir une avec `gh pr create --base main --title "..." --body "..."`
10. Afficher un resume : message de commit + nombre de fichiers modifies + URL de la branche distante + URL de la PR si creee

Workflow binome RADAR : feature branch + PR avec review de l'autre membre. JAMAIS de push direct sur `main`. JAMAIS de force push. JAMAIS de `--no-verify`.
