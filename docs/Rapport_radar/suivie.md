# Suivi de la rédaction du rapport RADAR

> Fichier de suivi de la progression. On coche les cases au fur et à mesure.
> Format : un seul fichier `main.tex` (compilation Overleaf) + dossier `images/`.
> Style : hybride sobre et professionnel (Latin Modern + titres bleu ENSA).

## Règles de travail (engagement)

- Mise à jour de ce fichier après chaque section terminée, sans qu'on me le demande
- Passage systématique de chaque section au skill `humanizer` avant validation (détection des marqueurs IA : em dashes, rule of three, vocabulaire IA, voix passive, formulations promotionnelles, etc.)
- Réécriture intégrale (pas de copie du PRD), objectif similarité < 15%
- Pas d'utilisation du symbole "—" dans le rapport

---

## ÉTAPE 0 - Mise en place du fichier main.tex

- [x] Écrire le préambule (classe `report`, encodage, babel français, polices, couleurs, packages)
- [x] Définir les commandes personnalisées (encadrés, couleurs ENSA, etc.)
- [x] Configurer les en-têtes de page (fancyhdr)
- [ ] Tester la compilation initiale sur Overleaf (squelette vide compilable)

---

## ÉTAPE 1 - Pages liminaires (front matter)

- [x] Page de garde (logos ENSA + UAE, titre, auteurs, encadrant, année universitaire)
- [x] Remerciements (1 paragraphe, 1 page, dédiée au Pr Wadiai)
- [x] Résumé en français
- [x] Abstract en anglais
- [x] Liste des acronymes (LLM, CRAAP, SWOT, PESTEL, API, ORM, etc.)

> Note : table des matières, liste des figures et liste des tableaux sont générées automatiquement par LaTeX.

---

## ÉTAPE 2 - Chapitre 1 : Introduction et vue d'ensemble

- [x] 1.1 Introduction générale (cadre académique M244, ENSA, équipe BDIA, mise en contexte)
- [x] 1.2 Problématique et besoin identifié
- [x] 1.3 Objectif et solution
- [x] 1.4 Méthodologie projet (démarche itérative, outils, répartition équipe)
- [x] 1.5 Cahier des charges synthétique (besoins client, contraintes, livrables, KPI)

---

## ÉTAPE 3 - Chapitre 2 : État de l'art (bref et concis)

- [x] 2.1 Concepts fondateurs de la veille stratégique
- [x] 2.2 Panorama des outils existants
- [x] 2.3 Évolution des agents IA autonomes
- [x] 2.4 Positionnement de RADAR

---

## ÉTAPE 4 - Chapitre 3 : Architecture de RADAR

- [x] 3.1 Schéma global du système (placeholder, figure TikZ à insérer plus tard)
- [x] 3.2 Choix d'architecture clés (5 décisions en encadrés)
- [x] 3.3 Stack technique justifiée
- [x] 3.4 Sécurité et isolation des sessions utilisateur

---

## ÉTAPE 5 - Chapitre 4 : Implémentation du moteur Agent (Bachirou)

- [x] 4.1 Infrastructure Docker (compose, override, mock-api de test)
- [x] 4.2 Configuration OpenClaw (gateway, runtime, cron, auth-profiles)
- [x] 4.3 Architecture skills vs agents (la décision clé)
- [x] 4.4 Les 8 SKILL.md
  - [x] 4.4.1 Orchestrateur
  - [x] 4.4.2 Deep Research
  - [x] 4.4.3 Collecteur (stratégie Tavily/DuckDuckGo)
  - [x] 4.4.4 Évaluateur (CRAAP, batch de 5)
  - [x] 4.4.5 Analyste SWOT
  - [x] 4.4.6 Analyste PESTEL
  - [x] 4.4.7 Détecteur de signaux faibles
  - [x] 4.4.8 Rédacteur
- [x] 4.5 Intégration DeepSeek V4 Pro (vs GPT-4o écarté)
- [x] 4.6 Intégration Tavily (vs DuckDuckGo bot detection)
- [x] 4.7 Communication agent vers web (POST /api/internal/*)
- [x] 4.8 Gestion des timeouts et fiabilité du pipeline

---

## ÉTAPE 6 - Chapitre 5 : Implémentation de l'application web (Karamo)

- [x] Trame proposée transmise à Karamo (placeholder structuré 5.1 à 5.6 inclus dans main.tex)
- [ ] 5.1 Stack Next.js 16 + React 19 + Tailwind (Karamo)
- [ ] 5.2 Authentification Better-Auth, Google OAuth (Karamo)
- [ ] 5.3 Onboarding et UI dashboard (Karamo)
- [ ] 5.4 Routes API internes (Karamo)
- [ ] 5.5 Modèle de données Prisma + PostgreSQL (Karamo)
- [ ] 5.6 Génération PDF et envoi email Resend (Karamo)
- [ ] Intégration du Chp 5 finalisé dans le rapport

---

## ÉTAPE 7 - Chapitre 6 : Tests et validation du système

- [x] 6.1 Tests de fonctionnement (état actuel)
  - [x] Stratégie de tests (mock-api, tests d'intégration par phase)
  - [x] Résultats : cas Marjane, rapport-test-005
  - [x] Métriques CRAAP, durée, qualité (tableau complet)
  - [x] Cas d'échec et corrections appliquées (rapport-test-003, 004)
- [x] 6.2 Tests finaux du système intégré (placeholder en attente Karamo)
  - [ ] Tests end-to-end UI + agent (à compléter)
  - [ ] Tests de charge et performance (à compléter)
  - [ ] Tests utilisateur (à compléter)

---

## ÉTAPE 8 - Chapitre 7 : Bilan et perspectives

- [x] 7.1 Analyse critique
  - [x] 7.1.1 Forces du projet
  - [x] 7.1.2 Faiblesses et limites V1
  - [x] 7.1.3 Difficultés rencontrées et solutions (tableau des problèmes/solutions)
- [x] 7.2 Apports du projet
  - [x] 7.2.1 Apports pédagogiques (validation M244)
  - [x] 7.2.2 Apports professionnels (portfolio, compétences)
- [x] 7.3 Conclusion générale
- [x] 7.4 Perspectives d'évolution (court, moyen, long terme)

---

## ÉTAPE 9 - Chapitre 8 : Bibliographie et références

- [x] Catégorie 1 : Cours et supports académiques (3 entrées)
- [x] Catégorie 2 : Ouvrages et articles sur la veille stratégique (8 entrées)
- [x] Catégorie 3 : Modèles de langage et frameworks d'agents (8 entrées)
- [x] Catégorie 4 : Recherche web et collecte de données (3 entrées)
- [x] Catégorie 5 : Application web et persistance (7 entrées)
- [x] Catégorie 6 : Infrastructure et déploiement (6 entrées)
- [x] Catégorie 7 : Outils de développement et qualité (7 entrées)
- [x] Catégorie 8 : Outils de veille concurrentielle, benchmark (8 entrées)
- [x] Mise en page deux colonnes avec multicol
- [x] Séparateur " : " utilisé à la place de "—" (respect règle anti em dash)

---

## ÉTAPE 10 - Finalisation

- [ ] Création des figures TikZ (architecture, Gantt, pipeline) [Gantt déjà fait, architecture en placeholder]
- [ ] Insertion des captures d'écran dans `images/`
- [ ] Intégration du Chapitre 5 finalisé par Karamo
- [ ] Section 6.2 (tests finaux) à compléter après finalisation Karamo
- [ ] Relecture intégrale et corrections orthographe/style
- [ ] Vérification du taux de similarité (objectif < 15%)
- [ ] Compilation finale LaTeX sur Overleaf
- [ ] Export PDF
- [ ] Remise au Pr Wadiai

---

## NOTES DE TRAVAIL

| Date | Note |
|------|------|
| 2026-05-28 | Plan validé. Structure mono-fichier `main.tex` confirmée (Overleaf). Style hybride retenu. Engagement humanisation manuelle. Prêt à démarrer Étape 0. |
| 2026-05-28 | Passe 1 terminée : préambule complet + pages liminaires + Chapitre 1 (5 sections). Diagramme Gantt en TikZ inclus. Skill humanizer appliqué : corrections sur affirmations spéculatives, rule of three, tournures promotionnelles. Passage à la Passe 2 (Chp 2 + Chp 3). |
| 2026-05-28 | Passe 2 terminée : Chapitre 2 (4 sections, état de l'art bref) + Chapitre 3 (4 sections avec 5 encadrés de décisions techniques). Humanisation : suppression rule of four, parallélismes négatifs, listes mécaniques. Passage à la Passe 3 (Chp 4 : moteur agent, la plus longue). |
| 2026-05-28 | Passe 3 terminée : Chapitre 4 (8 sections + 8 sous-sections pour les SKILL.md). Détail technique poussé sur Docker, OpenClaw, DeepSeek, Tavily, communication HTTP interne, timeouts. Code samples inclus. Humanisation : rule of three explicite ("Trois leviers / Trois problèmes") remplacée par enchaînement naturel. Passage à la Passe 4 (Chp 5 placeholder Karamo + Chp 6 tests). |
| 2026-05-28 | Passe 4 terminée : Chapitre 5 placeholder structuré (6 sections vides avec mention "À compléter par Karamo") + Chapitre 6 (2 sections : tests actuels avec tableau de résultats rapport-test-005, et placeholder tests finaux). Passage à la Passe 5 (Chp 7 bilan). |
| 2026-05-28 | Passe 5 terminée : Chapitre 7 (4 sections : analyse critique avec tableau des difficultés/solutions, apports pédagogiques et professionnels, conclusion générale, perspectives court/moyen/long terme). Humanisation : rule of four "force / seconde force / troisième force" remplacée par enchaînement naturel. Passage à la Passe 6 (Chp 8 bibliographie). |
| 2026-05-28 | Passe 6 terminée : Chapitre 8 (bibliographie en 2 colonnes via multicol, 8 catégories thématiques, ~50 références avec liens cliquables). Séparateur " : " utilisé pour respecter règle anti em dash. Document fermé proprement par \\end{document}. Rapport intégral terminé hors partie Karamo et finalisation. |
| 2026-05-28 | Modifications post-rédaction : (1) Abstract anglais supprimé, (2) Diagramme de Gantt remplacé par un tableau synthétique des 6 phases (gain compilation), (3) Package pgfgantt retiré du préambule, (4) Titres de chapitres alignés à gauche (raggedright au lieu de filleft/filright). |
| 2026-05-28 | Suppression complète de la partie planning : tableau des 6 phases retiré, section 1.4 renommée "Méthodologie projet" (sans le "et planification"). |
| 2026-05-28 | Résumé réécrit pour être accessible à un lecteur non technique : suppression de tout vocabulaire technique (OpenClaw, DeepSeek, Tavily, Docker, Next.js, CRAAP, SWOT, PESTEL, pipeline, agent, etc.), explication concrète du parcours utilisateur et du livrable matinal. Mots-clés simplifiés. |
| 2026-05-28 | Anonymisation des contributions individuelles : toutes les mentions "Bachirou Konate" et "Karamo Sylla" dans le corps du rapport sont remplacées par "pole moteur agent" et "pole application web" (équipe collective). Seuls le crédit d'auteurs en page de garde et la métadonnée PDF gardent les deux noms (crédit collectif, pas d'attribution de tâche). |
| 2026-05-28 | Mise à jour page de garde : (1) logo_ensa.png affiché via \\includegraphics (était un placeholder fbox), (2) "Tetouan, Maroc" supprimé, (3) noms étudiants à gauche / encadrant à droite via minipage, (4) ligne "Semestre" supprimée. Année universitaire conservée en bas de page. |
