# M244 : Consignes du Pr. Wadiai et Réponses RADAR

> **Document maître pour la préparation de la soutenance et du rapport final**
>
> **Source des consignes** : `M244 Consignes Techniques de veille.pdf` (Dr. Younes Wadiai, ENSA Tétouan, 20 pages)
> **Sources de réponses croisées** : `docs/PRD-RADAR.md` (v2.3), `Branding/CHARTE_GRAPHIQUE_RADAR.md`, `KARAMO.md`, `BACHIROU.md`, `CLAUDE.md`, `docs/Sprint-01/`, `docs/Sprint-02/`, `docs/Sprint-03/`
> **Cadre académique** : Module M244 (Veille Technologique), Cycle Ingénieur BDIA, ENSA Tétouan, Université Abdelmalek Essaâdi
> **Année universitaire** : 2025/2026, semestre Printemps 2026
> **Encadrant** : Dr. Younes Wadiai (Professeur de cybersécurité, y.wadiai@uae.ac.ma)
> **Binôme** : Karamo Sylla et Bachirou Konaté
> **Projet** : RADAR, outil de veille concurrentielle propulsé par un agent IA autonome (OpenClaw)
> **Slogan** : « Vos concurrents bougent. Radar vous le dit avant tout le monde. »

---

## Mode d'emploi de ce document

Ce document est la **source unique de vérité** pour préparer la soutenance orale (25 min de présentation + 5 min de questions) et le rapport final M244 (taux de similarité maximal toléré : 15%).

Pour chaque section du guide officiel de soumission du Pr. Wadiai, deux blocs sont fournis :

1. **Consigne du professeur** : reproduction fidèle du contenu attendu, des questions à traiter et des conseils énoncés dans le PDF.
2. **Réponse RADAR** : réponse argumentée, chiffrée, sourcée, tirée du PRD v2.3 et des artefacts produits par le binôme.

Le document suit l'ordre exact des 20 diapositives du PDF de consignes.

---

## Table des matières

| #   | Section du PDF                          | Contenu attendu (résumé)                                         |
| --- | --------------------------------------- | ---------------------------------------------------------------- |
| 01  | Page de garde                           | Identification module, professeur, université                    |
| 02  | Objectif du guide                       | Présentation pro, analyse critique, structure, défense           |
| 03  | Présentation du sujet                   | Thème, contexte, importance, domaine, impact attendu             |
| 04  | Problématique                           | Formulation, besoin, difficultés, enjeux                         |
| 05  | Objectifs du projet                     | Principal, secondaires, résultats attendus                       |
| 06  | Veille et recherche documentaire        | Sources, articles, sites, rapports, outils                       |
| 07  | Méthodologie de recherche               | Méthode, démarche, étapes, outils logiciels                      |
| 08  | Planification du projet                 | Organisation, tâches, calendrier, Gantt                          |
| 09  | Présentation de la solution             | Description, fonctionnement, architecture, valeur ajoutée        |
| 10  | Réalisation technique                   | Développement, outils, technologies, étapes                      |
| 11  | Démonstration du projet                 | Présentation pratique, cas d'utilisation, résultats observables  |
| 12  | Tests et validation                     | Tests, méthodes, résultats, corrections                          |
| 13  | Analyse critique                        | Résultats, forces, faiblesses, difficultés                       |
| 14  | Recommandations                         | Améliorations, techniques, organisationnelles, perspectives      |
| 15  | Dimension professionnelle (cahier)      | Besoins client, fonctionnalités, contraintes, délais, ressources |
| 16  | Dimension professionnelle (rapport)     | Rapport pro, structuré, propre, convaincant                      |
| 17  | Consignes importantes pour le rapport   | Style pro, introduction, conclusion, visuels, similarité max 15% |
| 18  | Bibliographie et ressources             | Articles, sites, livres, rapports, citations cohérentes          |
| 19  | Conseils présentation orale (règles)    | Sans lecture, tous participent, 25 min + 5 min                   |
| 20  | Conseils présentation orale (apparence) | Tenue professionnelle, crédibilité, confiance                    |

---

## 01 · Page de garde

### Consigne du professeur

Page de couverture officielle du module :

- Université Abdelmalek Essaâdi, École Nationale des Sciences Appliquées, Tétouan
- Cycle Ingénieur, Module M122 / M244 (Veille Technologique)
- Sous-titre : « Les Techniques de Veille »
- Année universitaire 2025/2026, Semestre Printemps 2026
- Encadrant : Dr. Younes Wadiai, Professeur de cybersécurité (`y.wadiai@uae.ac.ma`)

### Réponse RADAR

Page de garde du rapport et de la présentation orale :

| Champ              | Valeur                                                                     |
| ------------------ | -------------------------------------------------------------------------- |
| Université         | Université Abdelmalek Essaâdi                                              |
| École              | École Nationale des Sciences Appliquées de Tétouan (ENSA Tétouan)          |
| Cycle              | Cycle Ingénieur, filière Big Data et Intelligence Artificielle (BDIA)      |
| Module             | M244 : Veille Technologique                                                |
| Semestre           | Printemps 2026 (année universitaire 2025/2026)                             |
| Titre du projet    | RADAR : outil de veille concurrentielle propulsé par un agent IA autonome  |
| Slogan             | Vos concurrents bougent. Radar vous le dit avant tout le monde.            |
| Auteurs            | Karamo Sylla et Bachirou Konaté                                            |
| Encadrant          | Dr. Younes Wadiai                                                          |
| Date de soutenance | Fin de semestre Printemps 2026                                             |
| Identité visuelle  | Logo RADAR royal blue sur fond navy, charte Radar Editorial (McKinsey-fit) |

Le logo officiel (lockup royal blue sur navy) est fourni en SVG dans `Branding/logo/` (mark, wordmark, lockup en versions color/light/mono).

---

## 02 · Objectif du guide

### Consigne du professeur

Cette présentation vise à guider le binôme afin de :

- Réaliser une présentation professionnelle
- Analyser les informations de manière critique
- Présenter les résultats de façon claire et structurée
- Défendre efficacement le projet devant un public (jury et invités)

### Réponse RADAR

Le projet RADAR a été conçu dès l'origine pour répondre à ces quatre objectifs simultanément :

1. **Présentation professionnelle** : la charte graphique Radar Editorial (McKinsey-fit, navy `#051C2C` + royal blue `#2251FF` + Fraunces + Inter + JetBrains Mono) est calquée sur les codes visuels des cabinets de conseil internationaux. Chaque écran, chaque rapport généré et chaque support de présentation porte une autorité immédiate auprès du jury.
2. **Analyse critique** : la méthodologie de veille du module M244 est codée dans le moteur du produit. Chaque source remontée est évaluée selon la grille CRAAP (Currency, Relevance, Authority, Accuracy, Purpose), chaque alerte est validée par au moins deux sources indépendantes, et le score CRAAP global est affiché dans le rapport. La capacité critique du binôme se prouve par la rigueur du produit lui-même.
3. **Présentation claire et structurée** : le rapport académique suit la structure imposée du Chapitre 2 du cours (Synthèse exécutive, Méthodologie, Analyse, Résultats, Recommandations). La présentation orale suivra le même fil narratif pour faciliter la lecture du jury.
4. **Défense efficace** : la démonstration vivante d'un cycle de veille de bout en bout (cron 06h00, collecte, CRAAP, SWOT, PESTEL, signaux faibles, rédaction, digest email) sera exécutée en direct devant le jury. Cette preuve par l'exécution vaut plus que toute description écrite (PRD § 3.5.4).

---

## 03 · Présentation du sujet

### Consigne du professeur

**Contenu attendu** :

- Présentation générale du thème
- Contexte du projet
- Importance du sujet
- Domaine concerné

**Questions à traiter** :

1. Pourquoi ce sujet est-il important ?
2. Quel problème cherchez-vous à résoudre ?
3. Quel est l'impact attendu ?

### Réponse RADAR

#### 3.1 Présentation générale du thème

Le thème de notre projet est la **veille concurrentielle stratégique automatisée par intelligence artificielle**. Plus précisément, nous concevons et développons RADAR, un outil SaaS qui déploie un agent IA autonome (OpenClaw) pour surveiller quotidiennement les concurrents d'une entreprise, naviguer sur le web comme un humain le ferait, évaluer la fiabilité des sources, produire des analyses stratégiques structurées (SWOT, PESTEL, signaux faibles) et livrer des rapports actionnables sans intervention humaine.

RADAR n'est pas un projet de génie logiciel auquel on aurait ajouté a posteriori une couche de vocabulaire de veille. La méthodologie enseignée dans le module M244 par le Pr. Wadiai est le **moteur du produit** : le cycle de veille en 5 étapes (Chapitre 1), la grille d'évaluation CRAAP (Chapitre 3), les grilles SWOT et PESTEL (Chapitre 2), la détection de signaux faibles (Chapitre 1) et la diffusion structurée (Chapitre 3) sont codés dans les prompts de l'agent et structurent chaque rapport généré (PRD § 3.1, § 3.2).

#### 3.2 Contexte du projet

Le projet s'inscrit dans le cadre du module M244 (Veille Technologique) du Cycle Ingénieur BDIA à l'ENSA Tétouan, session Printemps 2026, encadré par le Pr. Younes Wadiai. La cible géographique V1 est le Maroc et le Maghreb francophone, ce qui aligne le périmètre du projet avec le contexte de l'école et les opportunités économiques régionales accessibles aux étudiants.

Sur le plan technologique, le projet s'appuie sur la dernière génération d'outils du marché : Next.js 16 avec React 19 et App Router, TypeScript strict, Tailwind 4, Prisma 6 sur PostgreSQL 17, Better Auth, React Email + Resend, monorepo pnpm + Turborepo, et surtout **OpenClaw** (image Docker officielle `ghcr.io/openclaw/openclaw:latest`) qui orchestre 8 sous-agents IA déclarés en SKILL.md (markdown), eux-mêmes propulsés par Claude Opus 4.7 d'Anthropic (PRD § 6).

Sur le plan métier, le contexte est celui d'un marché de la veille concurrentielle dominé par des outils internationaux coûteux (Similarweb, SEMrush, Crayon à partir de 100 USD par mois et par utilisateur) et orientés grands comptes, qui laissent un vide sur le segment des PME marocaines, des consultants indépendants et des étudiants en stratégie (PRD § 1.5).

#### 3.3 Importance du sujet

Le sujet est important pour cinq raisons cumulatives :

1. **Importance économique** : les PME marocaines représentent plus de 90 % du tissu entrepreneurial national. Leur capacité à anticiper les mouvements concurrentiels conditionne leur survie face à des acteurs internationaux mieux outillés. Démocratiser l'accès à une veille stratégique méthodologique est un levier de compétitivité directe.
2. **Importance pédagogique** : le module M244 enseigne des concepts puissants (cycle de veille, CRAAP, SWOT, PESTEL, signaux faibles) que les étudiants peinent à mettre en pratique faute de temps et d'outils. RADAR est la preuve qu'un cours académique peut devenir un produit fonctionnel utilisable au-delà de la salle de classe.
3. **Importance scientifique** : le projet matérialise l'application des grands modèles de langage (Claude Opus 4.7) à un cycle d'intelligence stratégique. Il documente, à travers son architecture, comment un agent IA orchestré (8 sous-agents en SKILL.md) peut automatiser un processus cognitif jusqu'ici réservé à des analystes humains.
4. **Importance temporelle** : 2026 est l'année où les agents IA autonomes deviennent industriels (outillage natif comme OpenClaw, contextes 200 K tokens, prompt caching mature). Le projet capte cette inflexion technologique au bon moment, ni trop tôt (avant la maturité des outils) ni trop tard (après la commoditisation).
5. **Importance professionnelle** : le projet constitue une pièce de portfolio défendable face aux recruteurs en stratégie, data ou IA appliquée, en particulier pour Karamo Sylla et Bachirou Konaté qui sortent du Cycle Ingénieur BDIA (PRD § 3.1).

#### 3.4 Domaine concerné

Le projet recouvre quatre domaines techniques et méthodologiques croisés :

| Domaine                     | Périmètre couvert dans RADAR                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Veille stratégique          | Cycle en 5 étapes du M244, grilles CRAAP / SWOT / PESTEL, détection de signaux faibles, diffusion structurée              |
| Intelligence artificielle   | Grand modèle de langage (Claude Opus 4.7), agents IA autonomes orchestrés, prompt engineering en SKILL.md                 |
| Ingénierie logicielle web   | Architecture monorepo, full TypeScript strict, Next.js 16 App Router, Prisma 6, Tailwind 4, design system propriétaire    |
| Cybersécurité et conformité | Authentification Better Auth (Argon2id), réseau Docker interne, header `X-Internal-Secret`, conformité RGPD (suppression) |

Le projet est volontairement **agnostique du secteur d'activité** des entreprises surveillées : le moteur de veille ne dépend pas du secteur, seuls les concurrents et axes de surveillance changent (PRD § 1.4).

#### 3.5 Pourquoi ce sujet est-il important ?

Trois raisons qui résistent à la contradiction du jury :

1. **Parce que l'information concurrentielle est publique mais inexploitée**. Le problème des PME et des consultants n'est pas l'absence d'information, c'est l'absence de méthode pour la traiter. RADAR transforme une matière première abondante (le web public) en une matière première raffinée (rapports SWOT et PESTEL recoupés, signaux faibles qualifiés).
2. **Parce que la méthodologie du module M244 mérite d'être incarnée dans un produit**. Sans incarnation, une méthode reste un objet pédagogique. Une fois codée dans les prompts d'un agent IA, elle devient un patrimoine reproductible, transmissible et améliorable. Le projet pérennise l'enseignement du Pr. Wadiai au-delà du semestre.
3. **Parce que 2026 est le moment exact où ce projet devient faisable**. Avant Claude Opus 4.7 (contexte 200 K, prompt caching, raisonnement multi-étapes), il aurait fallu plusieurs ingénieurs et des dizaines de milliers d'euros de coûts API pour produire un agent équivalent. Aujourd'hui, deux étudiants peuvent le construire en un semestre avec un coût d'infrastructure inférieur à 5 EUR par mois (VPS Hetzner CX21).

#### 3.6 Quel problème cherchez-vous à résoudre ?

Le problème opérationnel observé chez les utilisateurs cibles (dirigeants PME, consultants indépendants, étudiants en stratégie) est documenté dans le PRD § 1.2. Cinq défaillances structurelles cumulatives :

| Défaillance                                                                            | Conséquence business                                                                    |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Découverte tardive des mouvements concurrents (souvent par la presse, après les faits) | Perte d'avantage temporel sur les décisions de pricing, positionnement, recrutement     |
| Absence de méthode d'évaluation des sources                                            | Mélange d'informations fiables et de rumeurs, biais de confirmation                     |
| Pas de synthèse structurée (ni SWOT, ni PESTEL)                                        | Impossibilité de raisonner sur les axes stratégiques, décisions à l'intuition           |
| Signaux faibles ignorés par manque de temps et de croisement                           | Tendances émergentes manquées (un concurrent prépare un pivot, on ne le voit pas venir) |
| Pas de mémoire centralisée et chronologique                                            | Reconstruction laborieuse de l'historique d'un concurrent à chaque revue stratégique    |

**Formulation synthétique** : comment automatiser, avec la rigueur méthodologique du module M244, le cycle de veille concurrentielle d'une PME ou d'un consultant indépendant, afin de produire chaque matin un rapport structuré, recoupé, scoré et actionnable, sans intervention humaine au quotidien ?

#### 3.7 Quel est l'impact attendu ?

L'impact attendu se mesure sur trois horizons et selon des indicateurs précis.

**Impact opérationnel pour l'utilisateur final** :

- Réduction de 1 à 2 heures par jour de temps de veille manuelle à 5 à 15 minutes de consultation dirigée
- Découverte des mouvements concurrents avec un avantage temporel de 24 à 72 heures par rapport à la presse économique
- Production automatisée d'analyses SWOT et PESTEL mises à jour quotidiennement (SWOT) et hebdomadairement (PESTEL)
- North Star Metric V1 (PRD § 2.3) : 10 mouvements concurrents validés (deux sources minimum) par utilisateur actif et par semaine

**Impact pédagogique pour le module M244** :

- Démonstration vivante que le cycle de veille en 5 étapes peut être automatisé de bout en bout
- Production d'un livrable défendable face au jury qui prouve la maîtrise des concepts du cours
- Création d'un patrimoine pédagogique réutilisable pour les promotions futures (le projet est documenté en français, dans un monorepo public)

**Impact professionnel pour le binôme** :

- Constitution d'une pièce de portfolio pour les entretiens en cabinet de conseil, en startup ou en équipe data des grands groupes
- Acquisition opérationnelle des stacks modernes : Next.js 16, React 19, Prisma 6, Anthropic Claude, OpenClaw, Docker, monorepo Turborepo
- Maîtrise pratique de la coordination d'agents IA (8 sous-agents orchestrés, gestion du contexte LLM, prompt engineering en SKILL.md)

---

## 04 · Problématique

### Consigne du professeur

**Contenu attendu** :

- Formulation claire de la problématique
- Identification du besoin
- Difficultés observées
- Enjeux du projet

**Conseils** :

- La problématique doit être précise
- Éviter les formulations vagues
- Montrer le lien avec le monde professionnel

### Réponse RADAR

#### 4.1 Formulation claire de la problématique

**Énoncé principal** :

> Comment automatiser, avec la rigueur méthodologique du module M244 (cycle en 5 étapes, grille CRAAP, SWOT, PESTEL, signaux faibles), la veille concurrentielle quotidienne d'une PME ou d'un consultant indépendant, en s'appuyant sur un agent IA autonome capable de naviguer le web, évaluer la fiabilité des sources, produire des analyses stratégiques structurées et livrer des rapports actionnables, sans intervention humaine et avec un coût d'infrastructure compatible avec les marges d'une PME ?

Cette problématique se décompose en quatre sous-questions opérationnelles :

1. Comment encoder la méthodologie M244 dans des prompts d'agents IA de manière à ce que chaque étape du cycle soit traçable, défendable et reproductible ?
2. Comment orchestrer un pipeline multi-agents (collecte, évaluation, analyse, rédaction) sur une infrastructure Docker à trois conteneurs, fiable et idempotente, sans introduire de file d'attente externe ?
3. Comment garantir la qualité analytique des rapports générés (recoupement deux sources, score CRAAP, déduplication) pour qu'ils soient utilisables tels quels en comité de direction ou en livrable client ?
4. Comment livrer ce produit à des utilisateurs non techniques (dirigeants PME, étudiants) avec un onboarding inférieur à 10 minutes effectives ?

#### 4.2 Identification du besoin

Trois besoins utilisateurs ont été identifiés à partir des trois personas définis dans le PRD § 4 :

| Persona                            | Besoin formulé                                                                                                                                            |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Étudiant Stratégiste (PRD § 4.1)   | Démontrer la maîtrise des concepts M244 dans un projet livrable, gagner du temps sur la collecte pour se concentrer sur l'interprétation                  |
| Dirigeant PME (PRD § 4.2)          | Être alerté dès qu'un concurrent bouge, avoir une vue synthétique sans se perdre dans le détail, prendre des décisions informées sur des données fraîches |
| Consultant indépendant (PRD § 4.3) | Accélérer la phase d'audit concurrentiel facturée (20 à 30 % du temps non facturable), maintenir une veille continue sur 3 ou 4 comptes en retainer       |

Le besoin commun aux trois personas est la **production continue, structurée et fiable d'intelligence concurrentielle**, sans investir le temps humain nécessaire à la collecte et à la mise en forme.

#### 4.3 Difficultés observées

Cinq difficultés concrètes ont été observées lors de la phase de cadrage du projet :

1. **Difficulté méthodologique** : la grille CRAAP du Chapitre 3 du cours est définie pour une évaluation humaine. La transformer en algorithme calculable par un LLM nécessite de coder chaque dimension (Currency, Relevance, Authority, Accuracy, Purpose) en critères opérables sur un texte brut récupéré du web. Solution : prompt structuré dans `evaluateur/SKILL.md` (cf. PRD § 6.3 agent #4).
2. **Difficulté technique d'orchestration** : un cycle de veille complet enchaîne 5 sous-agents séquentiels et nécessite environ 30 minutes par concurrent. Cette durée est incompatible avec le timeout serverless typique (10 s à 5 min). Solution : service Node dédié (`apps/agent` initialement, remplacé par OpenClaw en architecture finale), cycle asynchrone, callbacks `/api/internal/*` (PRD § 6.10).
3. **Difficulté de coût LLM** : un cycle quotidien sur 5 concurrents avec 7 agents qui consomment chacun 8 à 16 KB de contexte peut générer des coûts API significatifs si mal optimisé. Solution : pipeline séquentiel (l'orchestrateur ne cumule que les résultats de l'étape courante, pas la totalité), prompt caching natif Claude, modèle Opus 4.7 réservé aux étapes d'analyse, modèle plus léger envisageable pour la collecte en V2.
4. **Difficulté de qualité** : un LLM peut halluciner des sources. Solution : recoupement obligatoire (au moins deux sources indépendantes par alerte), score CRAAP affiché à côté de chaque source, alerte rejetée si CRAAP global inférieur à 5/10 (`evaluateur/SKILL.md`).
5. **Difficulté de gouvernance des contrats inter-services** : Next.js et OpenClaw communiquent par 8 endpoints `/api/internal/*`. Sans typage partagé, un champ ajouté côté agent et inconnu côté web devient un bug silencieux. Solution : `packages/contracts` avec 8 schemas Zod typés, importés des deux côtés (KARAMO.md § 3.2, BACHIROU.md § 3.2).

#### 4.4 Enjeux du projet

Cinq enjeux structurent la livraison du projet :

| Enjeu              | Description                                                                                                                            |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Enjeu pédagogique  | Valider le module M244 avec un livrable qui démontre la maîtrise opérationnelle des concepts du cours                                  |
| Enjeu produit      | Livrer un MVP utilisable que les trois personas peuvent réellement déployer pour leur veille                                           |
| Enjeu d'ingénierie | Démontrer la maîtrise d'un stack 2026 complet (Next.js 16, React 19, Prisma 6, Anthropic Claude, OpenClaw, Docker, monorepo Turborepo) |
| Enjeu de portfolio | Constituer une pièce défendable face aux recruteurs en stratégie, data ou IA appliquée                                                 |
| Enjeu de pérennité | Documenter le projet de bout en bout (PRD v2.3 + charte graphique + specs sprints) pour qu'il survive à la soutenance                  |

#### 4.5 Lien avec le monde professionnel

Le lien avec le monde professionnel est porté par trois preuves concrètes :

1. **Architecture orientée production**, pas démonstrateur jetable : `docker-compose.yml` à 3 services, conformité RGPD (soft-delete + purge à T+7), audit log sur toutes les mutations utilisateur, validation Zod end-to-end, observabilité native, rate-limiting Postgres-backed (PRD § 8.7, § 9.3).
2. **Personas utilisateurs réels et adressables** : Dirigeants de PME marocaines, consultants indépendants à Casablanca, Rabat, Tunis, Dakar, étudiants en Master 2 stratégie. Le PRD § 4 ne décrit pas des personae fictives mais des segments économiques observés.
3. **Différenciation tarifaire et de positionnement face aux concurrents** : Similarweb, SEMrush et Crayon facturent à partir de 100 USD par mois et par utilisateur. RADAR est gratuit en V1 (académique) et peut être commercialisé en V2 sur un segment laissé vacant : la veille concurrentielle stratégique méthodologique destinée aux PME et indépendants francophones.

---

## 05 · Objectifs du projet

### Consigne du professeur

**Contenu attendu** :

- Objectif principal
- Objectifs secondaires
- Résultats attendus

**Exemple donné par le professeur** :

- Améliorer un processus
- Créer une solution innovante
- Optimiser une méthode existante
- Répondre à un besoin utilisateur

### Réponse RADAR

#### 5.1 Objectif principal

**Concevoir, développer et livrer RADAR**, un MVP fonctionnel de plateforme SaaS de veille concurrentielle automatisée, qui implémente intégralement le cycle de veille du module M244 dans un agent IA autonome (OpenClaw), et qui produit chaque matin à 6h00 (heure du Maroc) un rapport structuré, recoupé et actionnable pour chaque utilisateur actif, sans intervention humaine, à un coût d'infrastructure compatible avec les marges d'une PME.

L'objectif principal est mesurable par trois critères de réussite cumulatifs (PRD § 3.5) :

1. Le MVP V1 livre les 7 fonctionnalités obligatoires (F1 à F7, MoSCoW Must, sauf F6 en Should) qui couvrent l'intégralité du parcours utilisateur du PRD § 5.
2. Un cycle de veille de bout en bout (cron, collecte, CRAAP, SWOT, PESTEL, signaux, rédaction, digest) s'exécute en direct devant le jury sur deux ou trois concurrents réels.
3. La méthodologie M244 est lisible dans le produit : chaque rapport affiche le score CRAAP de ses sources, la grille SWOT et la grille PESTEL sont générées et datées, les signaux faibles sont qualifiés par intensité et horizon.

#### 5.2 Objectifs secondaires

Sept objectifs secondaires, articulés autour des 4 verbes du professeur (améliorer, créer, optimiser, répondre) :

| #   | Verbe     | Objectif secondaire                                                                                                                    |
| --- | --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Créer     | Concevoir une charte graphique propriétaire (Radar Editorial, McKinsey-fit) avec navy + royal blue, calquée sur les codes des cabinets |
| 2   | Créer     | Bâtir un monorepo modulaire (pnpm + Turborepo) avec 4 packages réutilisables (`database`, `contracts`, `agent-prompts`, `ui`)          |
| 3   | Optimiser | Implémenter le pipeline OpenClaw sans file d'attente externe (pas de pg-boss, pas de BullMQ, scheduling natif OpenClaw)                |
| 4   | Optimiser | Réduire les hallucinations LLM par recoupement deux sources et score CRAAP avec rejet automatique des sources sous 5/10                |
| 5   | Améliorer | Améliorer l'expérience d'onboarding par un Deep Research automatique (l'utilisateur fournit nom et site, l'agent enrichit le profil)   |
| 6   | Répondre  | Répondre au besoin RGPD du droit à l'oubli (soft-delete immédiat + purge dure à T+7 jours, export JSON des données utilisateur)        |
| 7   | Répondre  | Répondre au besoin de défense académique par une documentation exhaustive (PRD 1100+ lignes, charte 800+ lignes, specs par sprint)     |

#### 5.3 Résultats attendus

Les résultats attendus sont organisés en trois familles : livrables techniques, livrables académiques, livrables business.

**Livrables techniques (V1, soutenance Printemps 2026)** :

- 1 repository Git public avec monorepo Turborepo opérationnel
- 7 fonctionnalités MVP (F1 à F7) du PRD § 7
- 8 sous-agents OpenClaw en SKILL.md (orchestrateur, deep-research, collecteur, evaluateur, analyste-swot, analyste-pestel, detecteur-signaux-faibles, redacteur)
- 1 schéma Prisma à 20 entités (V2 cible), version simplifiée 9 entités en V1 (KARAMO.md § 3.1)
- 8 endpoints `/api/internal/*` validés par Zod via `@radar/contracts`
- 1 `docker-compose.yml` à 3 services (postgres + openclaw + web) prêt à déployer sur VPS Hetzner CX21 (4 EUR/mois)
- 1 cycle de veille fonctionnel de bout en bout sur un domaine de démonstration

**Livrables académiques (M244, soutenance et rapport)** :

- 1 rapport final structuré comme un cahier des charges professionnel (consignes Pr. Wadiai § 15 et § 16), similarité inférieure à 15 %
- 1 présentation orale de 25 minutes avec démonstration en direct du cycle de veille
- 1 bibliographie complète couvrant les sources du cours M244 et les références techniques (Anthropic, OpenClaw, Next.js, etc.)
- 1 PDF charte graphique (`Branding/CHARTE_GRAPHIQUE_RADAR.md`) en annexe

**Livrables business (positionnement V2)** :

- 1 proposition de valeur formulée (« Vos concurrents bougent. Radar vous le dit avant tout le monde. ») et défendue dans le PRD § 2
- 3 personas adressables documentés avec citations représentatives et Jobs to Be Done (PRD § 4)
- 1 anti-vision claire (PRD § 2.4) qui protège la cohérence produit en V1
- 1 North Star Metric défini avec cibles V1 et V2 (PRD § 2.3)

---

## 06 · Veille et recherche documentaire

### Consigne du professeur

**Contenu attendu** :

- Sources consultées
- Articles scientifiques
- Sites professionnels
- Rapports et études
- Outils de veille utilisés

**La veille doit être** :

- Fiable
- Récente
- Pertinente
- Variée

**Conseil** : toujours vérifier la crédibilité des sources.

### Réponse RADAR

#### 6.1 Sources consultées

La veille documentaire pour le projet RADAR a mobilisé six catégories de sources, toutes filtrées sur les critères Fiabilité, Récence, Pertinence, Variété énoncés par le professeur. Méta-méthodologie : nous avons appliqué la grille CRAAP du Chapitre 3 du cours M244 à notre propre veille documentaire (cohérence méthodologique avec le sujet du projet).

| Catégorie de source                | Exemples mobilisés dans le projet                                                                                                                                                                                                                          |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cours et supports académiques      | Module M244 (Pr. Y. Wadiai, ENSA Tétouan, Printemps 2026) : Chapitre 1 (cycle de veille), Chapitre 2 (SWOT, PESTEL), Chapitre 3 (CRAAP, diffusion)                                                                                                         |
| Articles scientifiques             | Travaux sur le cycle d'intelligence économique, sur la grille CRAAP en sciences de l'information, sur la détection de signaux faibles par croisement multi-sources                                                                                         |
| Documentation technique officielle | Anthropic (`docs.anthropic.com` : Claude Opus 4.7, prompt caching, context 200K), OpenClaw (`github.com/openclaw`), Next.js 16 (`nextjs.org/docs`), Prisma 6 (`prisma.io/docs`), React 19, Tailwind 4 (`tailwindcss.com`), Better Auth (`better-auth.com`) |
| Sites professionnels et benchmarks | Sites des concurrents directs (Similarweb, SEMrush, Crayon, Klue, Kompyte, Visualping, Mention, Brandwatch, Feedly), pages produits et tarifs                                                                                                              |
| Rapports et études de marché       | Études Gartner et Forrester sur Competitive Intelligence Tools, rapports Statista sur le marché du SaaS B2B, données HCP sur le tissu PME au Maroc                                                                                                         |
| Blogs et publications expertes     | Blog Anthropic (releases Claude 4.x), Vercel Blog (Next.js 15 et 16), articles Indie Hackers / Y Combinator sur les SaaS B2B en émergence                                                                                                                  |

Toutes les sources mobilisées sont datées de 2024 à 2026 pour respecter le critère de récence du professeur.

#### 6.2 Articles scientifiques mobilisés

Les principaux corpus scientifiques mobilisés couvrent quatre champs :

1. **Sciences de l'information et de la documentation** : grille CRAAP (S. Blakeslee, Meriam Library, California State University Chico, 2004 et révisions ultérieures), modèles d'évaluation de la crédibilité des sources web.
2. **Intelligence économique et veille stratégique** : modèle du cycle d'intelligence (Kent, 1949, repris par les écoles françaises d'IE), travaux sur la détection de signaux faibles (Ansoff, 1975, et révisions ultérieures par Lesca).
3. **Stratégie d'entreprise** : matrice SWOT (Andrews, Learned, 1965), modèle PESTEL (extension du PEST de Aguilar, 1967), cinq forces de Porter (1979) pour la lecture concurrentielle.
4. **Intelligence artificielle générative** : publications Anthropic 2024 à 2026 sur Claude, papier OpenAI sur les agents LLM (function calling, tool use), littérature émergente sur les architectures multi-agents et l'orchestration.

#### 6.3 Sites professionnels consultés

Pour la phase de benchmark concurrentiel (PRD § 1.5) :

- `similarweb.com`, `semrush.com`, `crayon.co`, `klue.com`, `kompyte.com`, `visualping.io`, `mention.com`, `brandwatch.com`, `feedly.com`
- Pour le contexte marchéd Maroc et Maghreb : `hcp.ma` (Haut-Commissariat au Plan), `cgem.ma` (Confédération Générale des Entreprises du Maroc), `medias24.com`, `lavieeco.com`
- Pour les outils techniques : pages produit officielles de chaque dépendance retenue (Next.js, Prisma, Tailwind, Anthropic, OpenClaw, Better Auth, React Email, Resend, Recharts, Upstash)

#### 6.4 Rapports et études

| Rapport / étude                                                                | Usage dans RADAR                                                                     |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Études marché Competitive Intelligence (Gartner, Forrester, IDC)               | Cadrage du segment, validation de l'existence d'un marché et estimation de sa taille |
| Études sur l'adoption des SaaS B2B au Maroc et au Maghreb (CGEM, McKinsey MGI) | Validation de l'opportunité géographique V1                                          |
| Documentation RGPD CNIL et CNDP (Maroc)                                        | Conformité du soft-delete, du droit à l'oubli, du droit d'accès (PRD § 8.7)          |
| Cours M244 du Pr. Wadiai (chapitres 1, 2, 3)                                   | Source de vérité méthodologique encodée dans l'agent (PRD § 3)                       |
| Rapports OpenAI / Anthropic sur les agents LLM (2024 à 2026)                   | Choix d'architecture multi-agents, gestion du contexte 200K, prompt caching          |

#### 6.5 Outils de veille utilisés pour conduire ce projet

Pour mener notre propre veille tout au long du projet :

| Outil                                    | Usage                                                                                  |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| Google Search avec opérateurs avancés    | Recherche ciblée par site, par date, par type de fichier                               |
| DuckDuckGo                               | Recherche sans tracking (et provider natif d'OpenClaw, cohérence avec le produit)      |
| Documentation officielle des dépendances | Source primaire pour chaque librairie technique (Next.js, Prisma, Anthropic, OpenClaw) |
| GitHub                                   | Veille sur les repos OpenClaw, exemples d'usage, issues, releases                      |
| Discord / X (Twitter)                    | Veille communautaire sur les releases Next.js 16, React 19, Anthropic Opus 4.7         |
| Anthropic Claude (Opus 4.7)              | Assistant de raisonnement pour la conception, l'évaluation des sources et la rédaction |
| ChatGPT / Codex CLI                      | Contre-opinion (« second opinion ») sur certains arbitrages techniques                 |

#### 6.6 Technologies de veille mobilisées dans le produit RADAR lui-même

Dans le moteur de RADAR (par opposition à la veille faite pour produire le projet) :

| Technologie                                | Rôle dans le pipeline de veille                                                            |
| ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| OpenClaw (`ghcr.io/openclaw/openclaw`)     | Gateway OpenAI-compatible, orchestrateur natif, scheduling cron natif, sessions persistées |
| DuckDuckGo (intégré OpenClaw `web_search`) | Provider de recherche web gratuit, sans clé API, cohérent avec la cible PME                |
| `web_fetch` (intégré OpenClaw)             | Scraping HTTP des pages cibles, suivi des redirections                                     |
| Playwright (intégré OpenClaw `browser`)    | Rendu JS pour les sites concurrents qui exigent un navigateur                              |
| Claude Opus 4.7 (Anthropic API)            | Grand modèle de langage pour extraction structurée, CRAAP, SWOT, PESTEL, rédaction         |
| pgvector (Postgres extension)              | Déduplication sémantique des `Movement` détectés (PRD § 8.3)                               |

#### 6.7 Vérification de la crédibilité des sources

La vérification de la crédibilité des sources suit la grille CRAAP du Chapitre 3 du module M244, appliquée à toutes les sources mobilisées dans le projet :

| Critère   | Application dans notre veille                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------- |
| Currency  | Sources datant de 2024 à 2026 exclusivement pour les choix techniques (le stack évolue vite)            |
| Relevance | Filtre sur la pertinence directe au scope (veille concurrentielle, agents LLM, Next.js, Maroc)          |
| Authority | Sources primaires (Anthropic, Vercel, Microsoft, ENSA) privilégiées sur les agrégateurs anonymes        |
| Accuracy  | Recoupement systématique sur 2 sources indépendantes pour toute affirmation technique structurante      |
| Purpose   | Identification explicite de l'intention de la source (marketing produit, documentation neutre, opinion) |

---

## 07 · Méthodologie de recherche

### Consigne du professeur

**Contenu attendu** :

- Méthode utilisée
- Démarche suivie
- Étapes du travail
- Outils et logiciels utilisés

**Exemple donné par le professeur** :

- Analyse comparative
- Étude qualitative
- Étude quantitative
- Tests techniques
- Développement d'un prototype

### Réponse RADAR

#### 7.1 Méthode utilisée

La méthode retenue est une **démarche d'ingénierie produit** combinant cinq approches méthodologiques que le professeur cite en exemple :

1. **Analyse comparative** : benchmark des outils existants (Similarweb, SEMrush, Crayon, Klue, Visualping, Mention, Brandwatch, Feedly) pour identifier les vides du marché et positionner RADAR sur un segment distinct (PRD § 1.5, § 2.4).
2. **Étude qualitative** : construction de 3 personas adressables (Étudiant Stratégiste, Dirigeant PME, Consultant indépendant) avec citations représentatives et Jobs to Be Done, plus 5 anti-personas pour protéger la cohérence produit (PRD § 4).
3. **Étude quantitative** : volumétrie des données projetée (PRD § 8.8 : 90 000 sources, 9 000 mouvements en V1 sur 10 utilisateurs et 6 mois), estimation des coûts d'infrastructure (4 EUR/mois VPS Hetzner CX21), estimation des coûts LLM Claude Opus 4.7.
4. **Tests techniques** : prototypage incrémental sur 6 sprints, validation de la chaîne complète (Postgres + OpenClaw + Next.js) en environnement Docker local, vérification `pnpm exec turbo run type-check` et `pnpm exec turbo run build` à chaque commit (CLAUDE.md § Vérification).
5. **Développement d'un prototype** : MVP V1 (7 features F1 à F7) défendable face au jury, démonstration en direct d'un cycle de veille de bout en bout.

#### 7.2 Démarche suivie

La démarche est inspirée du Lean Startup adapté au cadre académique. Trois phases enchaînées :

**Phase 1 : Cadrage et conception (Mars à Mai 2026)** :

- Rédaction du PRD initial v1.0 (cahier des charges 9 pages, Mars 2026)
- Refonte vers PRD ingénieur v2.0 (Mai 2026) : architecture, données, API, UI/UX, règles métier, coûts, phasage
- Livraison du PRD v2.1 (sections 6 à 9 ajoutées), puis v2.2 (refonte architecture OpenClaw), puis v2.3 (bootstrap monorepo)
- Production de la charte graphique propriétaire (`Branding/CHARTE_GRAPHIQUE_RADAR.md`)
- Échange documenté entre Bachirou et Karamo (`KARAMO.md` puis `BACHIROU.md`) pour valider l'architecture inter-services

**Phase 2 : Implémentation par sprints (Mai à Juin 2026)** :

- Sprint 1 : Authentification (F1, Karamo)
- Sprint 2 : Onboarding (F2 + F7, Karamo + Bachirou)
- Sprints 3 et 4 : Cycle de veille (F3, Bachirou)
- Sprint 5 : Dashboard et Digest (F4 + F5, Karamo)
- Sprint 6 : Export PDF (F6, Karamo)

**Phase 3 : Validation et soutenance (fin Juin 2026)** :

- Tests end-to-end sur 2 ou 3 concurrents réels
- Préparation de la démonstration live
- Rédaction du rapport final (taux de similarité inférieur à 15 %)
- Préparation de la présentation orale (25 min + 5 min Q&A)

#### 7.3 Étapes du travail

Le travail s'est structuré autour de 7 étapes opérationnelles enchaînées :

| #   | Étape                                      | Livrable                                                                 | Statut   |
| --- | ------------------------------------------ | ------------------------------------------------------------------------ | -------- |
| 1   | Définition de la vision produit            | PRD v1.0, slogan, North Star Metric, personas                            | Livré    |
| 2   | Étude de marché et analyse concurrentielle | PRD § 1.5 (table comparative outils), PRD § 4.4 (anti-personas)          | Livré    |
| 3   | Conception de l'architecture technique     | PRD § 6 (Engine OpenClaw, 8 sous-agents, callbacks `/api/internal/*`)    | Livré    |
| 4   | Conception du modèle de données            | PRD § 8 (Prisma 9 entités V1, 20 entités V2), seed et migration strategy | Livré    |
| 5   | Production de la charte graphique          | `Branding/CHARTE_GRAPHIQUE_RADAR.md`, tokens W3C, logos SVG, polices     | Livré    |
| 6   | Implémentation MVP par sprints             | 6 sprints, 7 fonctionnalités F1 à F7                                     | En cours |
| 7   | Préparation de la soutenance et du rapport | Présentation orale, démo live, rapport final, bibliographie              | À venir  |

#### 7.4 Outils et logiciels utilisés

| Catégorie              | Outils retenus                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------ |
| Gestion de code        | Git, GitHub (compte personnel `Kaaramo`, fork `IngenieurKonate/Radar` pour Bachirou) |
| IDE                    | VS Code, JetBrains, Claude Code (CLI), Cursor                                        |
| Monorepo               | pnpm workspaces + Turborepo (`turbo.json`)                                           |
| Langage                | TypeScript strict (`tsconfig.base.json`, `noUncheckedIndexedAccess: true`)           |
| Framework UI           | Next.js 16 (App Router), React 19, Tailwind 4, Shadcn UI                             |
| State                  | Zustand (global), TanStack Query (serveur), Nuqs (URL), React Hook Form + Zod        |
| ORM et DB              | Prisma 6 + PostgreSQL 17 (extension pgvector)                                        |
| Auth                   | Better Auth (email/password + Google OAuth)                                          |
| Email                  | React Email + Resend                                                                 |
| Agent IA               | OpenClaw (image Docker officielle) + Claude Opus 4.7 (Anthropic API)                 |
| Scraping et navigation | Playwright (intégré OpenClaw), web_search DuckDuckGo, web_fetch                      |
| Visualisation          | Recharts (graphiques dashboard, timeline 90 jours)                                   |
| Conteneurisation       | Docker, Docker Compose                                                               |
| Reverse proxy          | Caddy (suppression V1) ou direct sur VPS                                             |
| Hébergement V1         | VPS Hetzner CX21 (~4 EUR/mois)                                                       |
| Hébergement V2         | Vercel (web) + VPS dédié (OpenClaw) + Neon (Postgres)                                |
| Cache et rate-limit    | Upstash Redis (V2 uniquement)                                                        |
| Documentation          | Markdown dans le repo, PRD, charte, KARAMO.md, BACHIROU.md, specs Sprints            |
| Communication          | Slack, Discord, Notion (suivi des tâches `tasks/todo.md`)                            |
| Conception graphique   | Figma (maquettes), `Branding/tokens/radar-tokens.json` (W3C interop)                 |

---

## 08 · Planification du projet

### Consigne du professeur

**Contenu attendu** :

- Organisation du travail
- Répartition des tâches
- Calendrier
- Étapes importantes

**Conseils** :

- Présenter un diagramme de Gantt si possible
- Montrer l'organisation de l'équipe
- Expliquer la gestion du temps

### Réponse RADAR

#### 8.1 Organisation du travail

Le projet est conduit en binôme par **Karamo Sylla** et **Bachirou Konaté**, étudiants du Cycle Ingénieur BDIA à l'ENSA Tétouan. L'organisation est strictement **modulaire et asynchrone** : chaque membre a un périmètre de responsabilité défini, qui correspond à un sous-arbre du monorepo (CLAUDE.md § Répartition binôme).

| Membre           | Périmètre exclusif                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| Karamo Sylla     | `apps/web/`, `packages/database/`, `packages/contracts/`, `packages/ui/`, `Branding/`                 |
| Bachirou Konaté  | `apps/agent/`, `packages/agent-prompts/`, `infra/docker/`                                             |
| Partagé concerté | `docs/`, `README.md`, `tasks/`, racine du monorepo (lecture pour les deux, écriture concertée par PR) |

Cette modularité s'appuie sur les contrats Zod partagés (`@radar/contracts`) qui garantissent que les deux périmètres se parlent sans casser : un schema Zod est la source de vérité, importé à la fois par `apps/web` et `apps/agent` (KARAMO.md § 3.2, BACHIROU.md § 4.4).

#### 8.2 Répartition des tâches par fonctionnalité MVP

| ID  | Nom                                            | Priorité | Sprint cible | Owner             |
| --- | ---------------------------------------------- | -------- | ------------ | ----------------- |
| F1  | Authentification et gestion compte             | Must     | 1            | Karamo            |
| F2  | Onboarding Deep Research                       | Must     | 2            | Karamo + Bachirou |
| F3  | Cycle de veille quotidien automatique          | Must     | 3-4          | Bachirou          |
| F4  | Dashboard et feed d'alertes                    | Must     | 5            | Karamo            |
| F5  | Digest email quotidien et hebdomadaire         | Must     | 5            | Karamo            |
| F6  | Export PDF d'un rapport                        | Should   | 6            | Karamo            |
| F7  | Gestion entreprise / concurrents / axes (CRUD) | Must     | 1-2          | Karamo            |

#### 8.3 Calendrier (Gantt textuel)

```
2026 :
Mars         | Cadrage v1.0 PRD (cahier de charges 9 pages)
Avril        | Réorganisation architecturale (commit 4af89c7) + structure 3 dossiers initial
Mai          | PR #1 Bachirou (OpenClaw) + Bootstrap monorepo Karamo
             | PRD v2.0, v2.1, v2.2, v2.3 (refonte complète)
             | Charte graphique livrée
             | Specs Sprints 1, 2, 3 rédigées
Mai à Juin   | Sprint 1 : Auth (Karamo)
             | Sprint 2 : Onboarding (Karamo + Bachirou)
             | Sprints 3-4 : Cycle veille (Bachirou)
             | Sprint 5 : Dashboard + Digest (Karamo)
             | Sprint 6 : Export PDF (Karamo, si temps)
Juin (fin)   | Tests end-to-end, démo, rédaction rapport final
Juin (fin)   | SOUTENANCE M244 devant Pr. Wadiai
```

Diagramme de Gantt visuel à produire pour la soutenance (recommandation du professeur § 8 « Présenter un diagramme de Gantt si possible »). Outil envisagé : Mermaid intégré au rapport, ou export Figma.

#### 8.4 Étapes importantes (jalons)

| Jalon | Date estimée | Livrable associé                                                           |
| ----- | ------------ | -------------------------------------------------------------------------- |
| J1    | Mars 2026    | PRD v1.0 livré (cahier des charges initial)                                |
| J2    | Avril 2026   | Réorganisation architecturale, structure monorepo posée                    |
| J3    | Mai 2026     | PR #1 Bachirou (OpenClaw) mergée dans `main` (commit `76fa6f4`)            |
| J4    | Mai 2026     | PRD v2.3 livré (bootstrap monorepo, section 9 réalignée OpenClaw)          |
| J5    | Mai 2026     | Charte graphique RADAR Editorial livrée et tokens W3C produits             |
| J6    | Mai 2026     | Specs Sprint 1 (Auth), Sprint 2 (Onboarding), Sprint 3 (Dashboard) écrites |
| J7    | Juin 2026    | MVP V1 fonctionnel (7 fonctionnalités F1 à F7)                             |
| J8    | Juin 2026    | Tests end-to-end et démonstration cycle veille complète                    |
| J9    | Juin 2026    | Rapport final livré (similarité inférieure à 15 %)                         |
| J10   | Juin 2026    | Soutenance orale (25 min + 5 min Q&A) devant Pr. Wadiai                    |

#### 8.5 Gestion du temps

La gestion du temps suit cinq principes opérationnels (CLAUDE.md § Principes fondamentaux) :

1. **Mode plan par défaut** : activer le mode plan pour toute tâche non triviale (3 étapes ou plus), lire la section pertinente du PRD avant de coder.
2. **Stratégie de sous-agents** : utiliser les sous-agents Claude pour la recherche, l'exploration de code et l'analyse parallèle.
3. **Boucle d'auto-amélioration** : après toute correction utilisateur, mettre à jour `tasks/lessons.md` pour empêcher la même erreur.
4. **Vérification avant conclusion** : `pnpm exec turbo run type-check` et `pnpm exec turbo run build` à chaque PR, comparaison avec les critères d'acceptation du PRD.
5. **Correction autonome des bugs** : pointer logs, erreurs, tests en échec, puis résoudre directement.

Outil de suivi : `tasks/todo.md` avec éléments cochables, `tasks/lessons.md` pour les apprentissages capitalisés.

#### 8.6 Workflow Git

- Branches : `features-{prenom}` (branche perso longue durée) ou `feat/{topic}` (branche éphémère par sujet)
- PRs vers `main` avec review obligatoire du binôme
- Commits conventionnels : `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`
- Co-authoring `Co-Authored-By: Claude` quand un commit est assisté par IA
- Pas de force push sur `main`, pas de `--no-verify` sur les hooks

---

## 09 · Présentation de la solution

### Consigne du professeur

**Contenu attendu** :

- Description de la solution proposée
- Fonctionnement général
- Architecture ou structure
- Valeur ajoutée

**Important** : la solution doit répondre directement à la problématique.

### Réponse RADAR

#### 9.1 Description de la solution proposée

RADAR est une plateforme SaaS de veille concurrentielle stratégique propulsée par un agent IA autonome (OpenClaw). L'utilisateur inscrit son entreprise et ses 3 à 5 concurrents prioritaires en moins de 10 minutes effectives, et reçoit dès le lendemain matin à 7h00 (heure du Maroc) un rapport structuré incluant :

- la liste des **mouvements concurrents détectés** dans les 24 dernières heures, qualifiés par axe (recrutement, stratégie, technologie, présence digitale, conformité), recoupés sur deux sources minimum et scorés selon la grille CRAAP du module M244 ;
- une **grille SWOT mise à jour quotidiennement** pour chaque concurrent ;
- une **grille PESTEL sectorielle** mise à jour hebdomadairement (le lundi) ;
- la liste des **signaux faibles** détectés par accumulation sur une fenêtre glissante de 30 jours ;
- un **digest email** envoyé à 7h00, avec lien direct vers le dashboard.

L'utilisateur consacre 5 à 15 minutes par jour à la consultation, exporte en PDF un rapport mensuel pour son comité de direction ou son livrable client, et peut revenir sur 90 jours d'historique grâce à la timeline du concurrent.

#### 9.2 Fonctionnement général

Le cycle de fonctionnement nominal est documenté dans le PRD § 5.1. Quatre phases :

```
INSCRIPTION (J0, 2 minutes)
  Email + mot de passe ou Google OAuth, vérification email non bloquante
       │
       ▼
ONBOARDING DEEP RESEARCH (J0, 10 min utilisateur, 30 min agent en arrière-plan)
  Étape 1 : entreprise + site web
  Étape 2 : 1 à 5 concurrents prioritaires
  Étape 3 : axes de surveillance retenus parmi 5 par défaut
       │
       ▼
PREMIER CYCLE DE VEILLE (J1, 6h, automatique)
  OpenClaw lance les 5 sous-agents (Collecte, CRAAP, SWOT, PESTEL, Rédaction)
  Génération du premier rapport
  Envoi du digest email à 7h
       │
       ▼
ROUTINE ÉTABLIE (J+, indéfiniment)
  Cycle quotidien 6h, digest 7h
  MAJ hebdomadaire PESTEL le lundi
  Consultation 5 à 15 min par jour
  Export PDF mensuel
```

Le **moment AHA** (PRD § 5.6) est précisément le jour 2 : l'utilisateur reçoit son second digest et constate que les alertes enrichissent celles de la veille (déduplication fonctionne), que la SWOT a évolué (continuité analytique), et qu'un signal faible apparaît, croisé sur deux jours, qu'il n'aurait jamais repéré seul.

#### 9.3 Architecture

L'architecture (PRD § 6.1) repose sur trois conteneurs Docker collaborant sur un réseau interne :

```
┌──────────────────────────────────────────┐
│       CLIENT (NAVIGATEUR)                │
└──────────────┬───────────────────────────┘
               │ HTTPS
               ▼
┌──────────────────────────────────────────┐
│   APPS/WEB  Next.js 16 (port 3000)       │
│   App Router, RSC, Server Actions        │
│   Prisma 6 → PostgreSQL 17               │
└──────────────┬───────────────────────────┘
               │ Docker internal
               ▼
┌──────────────────────────────────────────┐
│   OPENCLAW (port 18789)                  │
│   ghcr.io/openclaw/openclaw:latest       │
│   8 SKILL.md : orchestrateur, deep-      │
│   research, collecteur, evaluateur,      │
│   analyste-swot, analyste-pestel,        │
│   detecteur-signaux-faibles, redacteur   │
│   Outils natifs : web_search (DDG),      │
│   web_fetch, browser (Playwright)        │
│   Cron natif : 06:00 Africa/Casablanca   │
│   LLM : Claude Opus 4.7                  │
└──────────────────────────────────────────┘
```

Trois communications structurent l'architecture :

1. **Next.js → OpenClaw** : `POST http://openclaw:18789/v1/chat/completions` (API OpenAI-compatible standard). Retour immédiat 202, traitement asynchrone.
2. **OpenClaw → Next.js** : chaque sous-agent POST ses résultats sur `/api/internal/*` (8 endpoints typés Zod via `@radar/contracts`). Authentification par header `X-Internal-Secret: <token>` partagé via env `RADAR_INTERNAL_SECRET`.
3. **Next.js ↔ PostgreSQL** : via Prisma exclusivement. OpenClaw n'a pas accès direct à la base.

#### 9.4 Valeur ajoutée

La valeur ajoutée de RADAR se mesure sur cinq axes (PRD § 2.2 et § 1.5) :

| Aspect          | Outils existants (Similarweb, SEMrush, Crayon)  | RADAR                                                                      |
| --------------- | ----------------------------------------------- | -------------------------------------------------------------------------- |
| Cœur métier     | Métriques de trafic web et SEO                  | Détection de mouvements stratégiques tous axes                             |
| Méthodologie    | Aucune méthodologie de veille explicite         | Cycle de veille M244 codé dans l'agent, grille CRAAP par source            |
| Analyse         | Tableaux de bord de métriques                   | Analyses SWOT et PESTEL générées et mises à jour automatiquement           |
| Signaux faibles | Non détectés                                    | Détection algorithmique par croisement multi-sources sur fenêtre glissante |
| Tarif           | À partir de 100 USD par mois et par utilisateur | Gratuit (V1 académique), tarification PME-friendly prévue en V2            |

**Réponse directe à la problématique** : la problématique demande « comment automatiser, avec la rigueur méthodologique du module M244, la veille concurrentielle quotidienne d'une PME ou d'un consultant ». RADAR répond ainsi : (1) chaque étape du cycle M244 est un sous-agent OpenClaw distinct et testable, (2) la grille CRAAP est calculée programmatiquement à chaque source collectée, (3) le cycle s'exécute automatiquement à 6h chaque matin sans intervention, (4) l'infrastructure tient sur un VPS à 4 EUR par mois (V1), ce qui est compatible avec la marge d'une PME.

---

## 10 · Réalisation technique

### Consigne du professeur

**Contenu attendu** :

- Développement réalisé
- Outils utilisés
- Technologies utilisées
- Étapes de réalisation

**Conseils** :

- Utiliser des captures d'écran
- Montrer les fonctionnalités principales
- Illustrer les différentes étapes

### Réponse RADAR

#### 10.1 Développement réalisé

Le développement couvre 7 fonctionnalités (F1 à F7), réparties sur 6 sprints (PRD § 7.1) :

| ID  | Nom                                            | État livraison V1                                                                        |
| --- | ---------------------------------------------- | ---------------------------------------------------------------------------------------- |
| F1  | Authentification (Better Auth, email + Google) | Sprint 1, 5 écrans Auth pixel-perfect, Zod validators, Server Actions                    |
| F2  | Onboarding Deep Research                       | Sprint 2, 3 étapes (entreprise, concurrents, axes), déclenchement agent en arrière-plan  |
| F3  | Cycle de veille quotidien automatique          | Sprints 3 et 4, pipeline OpenClaw 5 sous-agents, cron 06:00, callbacks `/api/internal/*` |
| F4  | Dashboard et feed d'alertes                    | Sprint 5, feed chronologique des Movements, filtres par concurrent / axe / sévérité      |
| F5  | Digest email                                   | Sprint 5, templates React Email, envoi via Resend, désabonnement 1 clic                  |
| F6  | Export PDF                                     | Sprint 6, Playwright print-to-PDF, structure rapport académique M244                     |
| F7  | CRUD entreprise / concurrents / axes           | Sprints 1 et 2, pages `/settings/*`, audit log                                           |

#### 10.2 Outils utilisés

| Catégorie             | Outils                                                                           |
| --------------------- | -------------------------------------------------------------------------------- |
| Versioning            | Git, GitHub                                                                      |
| IDE                   | VS Code, JetBrains, Claude Code (CLI Anthropic)                                  |
| Monorepo              | pnpm workspaces + Turborepo                                                      |
| Package manager       | pnpm UNIQUEMENT (jamais npm ni yarn, CLAUDE.md § Code)                           |
| Conteneurisation      | Docker, Docker Compose                                                           |
| Build et type-check   | `pnpm exec turbo run build`, `pnpm exec turbo run type-check`                    |
| Linting et formatting | ESLint, Prettier (formatters automatiques)                                       |
| Génération de schemas | `prisma generate` (Prisma Client 6.19.3)                                         |
| Documentation         | Markdown dans le repo (`docs/`, `Branding/`, racine)                             |
| Conception graphique  | Figma (maquettes Sprint 1, 2, 3), tokens W3C `Branding/tokens/radar-tokens.json` |
| Tests                 | Vitest (unitaires), Playwright (E2E, partagé avec OpenClaw)                      |

#### 10.3 Technologies utilisées

Le stack technique complet est documenté dans `CLAUDE.md` § Stack :

| Couche                  | Technologie                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| Frontend                | Next.js 16 (App Router), React 19, TypeScript strict, Tailwind 4, Shadcn UI                       |
| State management        | Zustand (global), TanStack Query (serveur), Nuqs (URL state), React Hook Form + Zod (formulaires) |
| Auth                    | Better Auth (email/password + Google OAuth), Argon2id (memory 64 MB, iterations 3, parallelism 1) |
| Database                | PostgreSQL 17 + Prisma 6 (workspace `packages/database`)                                          |
| Contrats inter-services | Zod, exposés via `packages/contracts` (importé par `apps/web` et `apps/agent`)                    |
| Engine IA               | OpenClaw (image officielle `ghcr.io/openclaw/openclaw:latest`), 8 sous-agents en SKILL.md         |
| LLM                     | Claude Opus 4.7 (Anthropic API, contexte 200K, prompt caching, ANTHROPIC_API_KEY)                 |
| Acquisition             | Playwright (natif OpenClaw) + DuckDuckGo web_search + web_fetch                                   |
| Orchestration           | Cron natif OpenClaw (cycle quotidien 06:00, PESTEL hebdo le lundi)                                |
| Emails                  | React Email + Resend (templates dans `apps/web/emails/`)                                          |
| Visualisation           | Recharts                                                                                          |
| Cache et rate-limit V2  | Upstash Redis                                                                                     |
| Infra V1                | Docker Compose 3 services (postgres + openclaw + web), VPS Hetzner CX21                           |
| Infra V2                | Vercel (web), VPS dédié (openclaw), Neon (postgres)                                               |
| Design system           | Radar Editorial (McKinsey-fit), Navy `#051C2C`, Royal Blue `#2251FF`, Bone `#F5F1EB`              |
| Polices                 | Fraunces (display), Inter (body), JetBrains Mono (data)                                           |

#### 10.4 Étapes de réalisation

| Étape                           | Description                                                                             | Owner             |
| ------------------------------- | --------------------------------------------------------------------------------------- | ----------------- |
| Étape 1 : Bootstrap monorepo    | Init pnpm workspaces + Turborepo + tsconfig.base.json                                   | Karamo            |
| Étape 2 : Schéma Prisma         | 9 entités V1 (User, ProfilUtilisateur, Concurrent, Rapport, Source, Swot, Pestel, etc.) | Karamo            |
| Étape 3 : Contrats Zod          | 8 schemas Zod typés dans `packages/contracts/src/internal/`                             | Karamo            |
| Étape 4 : Charte graphique      | Tokens W3C, polices, logo SVG, charte 800+ lignes                                       | Karamo (+ design) |
| Étape 5 : 8 SKILL.md OpenClaw   | Orchestrateur, deep-research, collecteur, evaluateur, analyste-swot, etc.               | Bachirou          |
| Étape 6 : Dockerfile et compose | `infra/docker/docker-compose.yml` à 3 services (postgres + openclaw + web)              | Bachirou          |
| Étape 7 : F1 Auth               | 5 écrans `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`  | Karamo            |
| Étape 8 : F2 Onboarding         | 3 étapes (entreprise, concurrents, axes) + déclenchement deep-research                  | Karamo + Bachirou |
| Étape 9 : F3 Cycle veille       | Pipeline complet de bout en bout, callbacks `/api/internal/*`                           | Bachirou          |
| Étape 10 : F4 Dashboard         | Feed `/dashboard`, page `/competitors/[id]`, page `/movements/[id]`                     | Karamo            |
| Étape 11 : F5 Digest email      | Templates React Email, job `email.digest`, webhooks Resend                              | Karamo            |
| Étape 12 : F6 Export PDF        | Page `/exports/competitor/[id]`, Playwright print-to-PDF                                | Karamo            |
| Étape 13 : Tests E2E            | Scénario complet : signup → onboarding → cycle → dashboard → digest                     | Karamo + Bachirou |

#### 10.5 Captures d'écran à présenter pendant la soutenance

Recommandation Pr. Wadiai § 10 : utiliser des captures d'écran pour illustrer les fonctionnalités. Liste minimale à préparer (1 capture par item) :

1. Écran `/login` (charte Radar Editorial, royal blue sur navy)
2. Étape 1 d'onboarding (entreprise + site)
3. Étape 2 d'onboarding (ajout itératif de concurrents)
4. Étape 3 d'onboarding (sélection des axes)
5. Dashboard `/dashboard` avec feed de Movements (cas réel sur 2 concurrents)
6. Card `Movement` avec score CRAAP affiché
7. Page `/competitors/[id]` avec SWOT et timeline 90 jours
8. Onglet « Signaux faibles » avec intensité et horizon
9. Grille PESTEL sectorielle hebdomadaire
10. Digest email reçu (rendu Resend)
11. Export PDF d'un rapport mensuel
12. Page Settings `/settings/competitors` (CRUD)

---

## 11 · Démonstration du projet

### Consigne du professeur

**Contenu attendu** :

- Présentation pratique
- Démonstration du fonctionnement
- Cas d'utilisation
- Résultats observables

**Important** : préparer la démonstration à l'avance pour éviter les problèmes techniques.

### Réponse RADAR

#### 11.1 Présentation pratique

La démonstration en direct est l'épine dorsale de la défense. Conformément au PRD § 3.5.4 (« démonstration vivante »), un MVP fonctionnel qui surveille réellement deux ou trois concurrents et produit un rapport en direct devant le jury vaut plus que toute description écrite.

**Mise en scène recommandée** :

1. Ouverture par Karamo : présentation du problème et du parcours utilisateur (3 minutes).
2. Démonstration partagée : Bachirou lance un cycle de veille manuel depuis le dashboard (`POST /api/v1/cycles/run`) sur un compte de démo pré-configuré.
3. Pendant que le cycle tourne (environ 30 minutes en réel, donc pré-enregistré ou rejoué depuis un cycle précédent), Karamo montre les écrans figés (login, onboarding, dashboard vide).
4. Bachirou présente l'architecture OpenClaw et les 8 SKILL.md (2 minutes).
5. Karamo revient sur le dashboard avec le cycle terminé : Movements affichés, SWOT actualisée, signaux faibles détectés.
6. Conclusion : digest email reçu sur la boîte de démo, export PDF généré.

**Préparation technique anti-incident** (Pr. Wadiai § 11) :

- Cycle de veille pré-exécuté la veille au soir sur 2 concurrents témoins (Cabinet Roland Berger Maroc, Cabinet Mazars Maroc) pour avoir des données réelles à montrer si le cycle live échoue.
- Compte de démo seedé avec données représentatives (`packages/database/seed/index.ts`, flag `RADAR_SEED_DEV=1`).
- Captures d'écran statiques de chaque étape, prêtes à projeter en cas de panne Internet ou de cycle qui dépasse le timing.
- Connexion mobile 4G en backup pour le wifi de l'école.
- VPS Hetzner CX21 vérifié 12h avant la soutenance (postgres up, openclaw up, web up, logs cleanés).

#### 11.2 Démonstration du fonctionnement

Scénario de démonstration nominal (durée cible : 12 minutes sur les 25 de présentation) :

| Minute  | Action démontrée                                                           | Écran visible               |
| ------- | -------------------------------------------------------------------------- | --------------------------- |
| 0 à 1   | Présentation du compte démo nouvellement créé                              | `/login` puis redirection   |
| 1 à 3   | Onboarding : étape 1 (entreprise), étape 2 (3 concurrents), étape 3 (axes) | `/onboarding` 3 étapes      |
| 3 à 5   | Dashboard vide avec banderole « Premier rapport demain matin à 6h »        | `/dashboard` état vide      |
| 5 à 7   | Architecture OpenClaw, schéma Docker 3 services, pipeline 8 SKILL.md       | Slide architecture          |
| 7 à 9   | Bascule sur compte démo « lendemain » : dashboard rempli                   | `/dashboard` avec Movements |
| 9 à 10  | Drill-down sur une card Movement : sources, score CRAAP, axe               | `/movements/[id]`           |
| 10 à 11 | Détail d'un concurrent : SWOT et timeline 90 jours                         | `/competitors/[id]`         |
| 11 à 12 | Digest email reçu + export PDF généré                                      | Inbox + PDF                 |

#### 11.3 Cas d'utilisation

Trois cas d'usage à dérouler pour matérialiser les trois personas du PRD § 4 :

**Cas 1 : Karim Berrada, dirigeant de Marka Logistics (PME Casablanca, 35 salariés)**

Karim surveille 3 concurrents historiques et 2 nouveaux entrants sur le marché de la logistique B2B au Maroc. Chaque matin à 7h, il reçoit son digest email avec les mouvements détectés (un concurrent vient de lever 5 M USD, un autre a publié 4 offres d'emploi pour des profils data). En 5 minutes, il marque les alertes pertinentes comme « sauvegardées » et programme un point équipe à 10h.

**Cas 2 : Soukaina, consultante stratégie indépendante (Casablanca)**

Soukaina ouvre une mission d'audit concurrentiel pour un nouveau client. Elle ajoute 5 concurrents dans RADAR depuis `/settings/competitors`. En 48h, RADAR a constitué une base complète : SWOT pour chaque concurrent, PESTEL sectoriel, signaux faibles, 200 sources évaluées. Soukaina exporte un PDF de 30 pages et le livre à son client. Gain estimé : 8 jours de recherche manuelle économisés sur une mission de 3 semaines.

**Cas 3 : Yassine, étudiant Master 2 stratégie à l'ESITH**

Yassine doit produire pour son cours de stratégie une analyse comparative de 4 acteurs du textile au Maroc. Il s'inscrit gratuitement sur RADAR (V1 académique), ajoute les 4 concurrents, et reçoit en 48h un dossier complet. Il interprète les SWOT et PESTEL, ajoute son analyse personnelle, et soumet un livrable de qualité professionnelle.

#### 11.4 Résultats observables

Résultats observables pendant la démonstration et mesurables par le jury :

| Résultat                                        | Mode d'observation                                                                  |
| ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| Temps d'onboarding inférieur à 10 minutes       | Chronomètre live pendant les 3 étapes (Pr. Wadiai peut chronométrer lui-même)       |
| Cycle de veille complet exécuté de bout en bout | Logs OpenClaw projetés en temps réel + revalidation Next.js du dashboard            |
| Score CRAAP affiché pour chaque source          | Cliquer sur une card Movement, drill-down jusqu'aux sources individuelles           |
| Recoupement deux sources matérialisé            | Une card Movement liste obligatoirement au moins 2 sources distinctes               |
| SWOT générée et datée                           | Onglet `/competitors/[id]` avec snapshot du jour                                    |
| PESTEL hebdomadaire générée                     | Onglet PESTEL avec horodatage du dernier dimanche soir                              |
| Signaux faibles détectés                        | Onglet dédié avec intensité (low/medium/high) et horizon (court/moyen/long)         |
| Digest email reçu sur la boîte démo             | Inbox accessible projetée                                                           |
| Export PDF structuré académique                 | PDF affiché avec couverture, synthèse, méthodologie, SWOT, PESTEL, sources, signaux |
| Conformité RGPD                                 | `DELETE /api/v1/account` → confirmation purge T+7                                   |

---

## 12 · Tests et validation

### Consigne du professeur

**Contenu attendu** :

- Tests effectués
- Méthodes de validation
- Résultats obtenus
- Corrections apportées

**Conseils** :

- Présenter des tableaux ou graphiques
- Montrer les améliorations obtenues
- Expliquer les limites rencontrées

### Réponse RADAR

#### 12.1 Tests effectués

Cinq familles de tests structurent la validation du projet :

| Famille                    | Périmètre                                                                           | Outil                            |
| -------------------------- | ----------------------------------------------------------------------------------- | -------------------------------- |
| Type-checking              | Vérification statique TypeScript strict sur tout le monorepo                        | `pnpm exec turbo run type-check` |
| Build                      | Compilation Next.js + Prisma + packages                                             | `pnpm exec turbo run build`      |
| Tests unitaires            | Fonctions pures (validators Zod, utilitaires CRAAP, formatters)                     | Vitest                           |
| Tests d'intégration        | Routes API `/api/v1/*` et `/api/internal/*` avec base de données réelle             | Vitest + Prisma test database    |
| Tests end-to-end (E2E)     | Parcours utilisateur complet : signup → onboarding → cycle → dashboard → digest     | Playwright                       |
| Tests manuels (validation) | Démonstration live sur 2 ou 3 concurrents réels, qualité analytique des sorties LLM | Jugement humain                  |

#### 12.2 Méthodes de validation

**Validation des contrats inter-services** : tous les payloads échangés entre Next.js et OpenClaw passent par les schemas Zod de `@radar/contracts`. Un payload mal formé est rejeté côté Next.js avec 422, ce qui force OpenClaw à corriger ou à retry (3 fois avec backoff exponentiel, cf. BACHIROU.md § 4.3).

**Validation de la qualité analytique** : chaque cycle produit un échantillon de 5 Movements aléatoires qui sont relus manuellement par le binôme et notés sur 4 critères (pertinence, exactitude, recoupement effectif, score CRAAP cohérent). Objectif : 8 Movements sur 10 jugés « actionnables » selon les standards M244.

**Validation par les personas** : un test utilisateur informel a été conduit sur 3 testeurs représentatifs (1 dirigeant PME, 1 consultante indépendante, 1 étudiant). Mesures : temps d'onboarding réel, compréhension du dashboard, utilité perçue des Movements.

**Validation académique** : ce document de réponse aux consignes du Pr. Wadiai est lui-même un livrable de validation, qui prouve que chaque exigence formelle du guide a été adressée explicitement.

#### 12.3 Résultats obtenus

Résultats attendus en fin de Sprint 6 (à confirmer au moment de la soutenance) :

| Indicateur                                    | Cible V1                                 | Méthode de mesure                        |
| --------------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| Couverture `type-check` sur monorepo          | 100 % (zéro `any`, zéro `as` injustifié) | `pnpm exec turbo run type-check`         |
| Build vert sur les 4 workspaces               | 5/5 tasks successful                     | `pnpm exec turbo run build`              |
| Onboarding utilisateur réussi sous 10 minutes | 100 % des testeurs                       | Chronomètre + observation                |
| Cycle de veille complet                       | Inférieur à 30 minutes                   | Logs `cycle.started` à `cycle.completed` |
| Score CRAAP moyen des sources retenues        | Supérieur à 6/10                         | Calcul agrégé sur la table `SourceCRAAP` |
| Movements jugés actionnables                  | 80 % au moins                            | Échantillon manuel de 50 Movements       |
| Recoupement deux sources effectif             | 100 % des Movements                      | Requête SQL `MovementSource` count >= 2  |
| Digest email délivré à l'heure                | 7h00 +/- 5 min                           | `EmailDigest.sentAt`                     |
| Taux de similarité du rapport académique      | Inférieur à 15 %                         | Outil de détection imposé par l'école    |

#### 12.4 Corrections apportées au fil du projet

Plusieurs corrections majeures ont été appliquées au fil de l'élaboration, documentées dans le CHANGELOG du PRD :

| Version PRD | Correction apportée                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| v2.0        | Alignement du cycle de veille v1 (6 étapes) sur les 5 étapes officielles du cours M244                  |
| v2.1        | Réalignement du modèle de données sur le produit « monitoring continu » au lieu de « rapport one-shot » |
| v2.2        | Suppression du wrapper Fastify custom au profit d'OpenClaw (image Docker officielle)                    |
| v2.2        | Migration des 8 agents de modules TypeScript vers fichiers SKILL.md (markdown)                          |
| v2.2        | Suppression de pg-boss, node-cron, Tavily (remplacés par OpenClaw natif et DuckDuckGo)                  |
| v2.2        | Communication HTTP interne Docker à la place des webhooks HMAC signés                                   |
| v2.3        | Refonte de la section 9 (élimination de toutes les références résiduelles à Fastify)                    |
| v2.3        | Section 9.5 réécrite : OpenAI-compatible API au lieu d'API custom                                       |

Sur le plan applicatif, les corrections sont tracées dans `tasks/lessons.md` (CLAUDE.md § Boucle d'auto-amélioration).

#### 12.5 Limites rencontrées

Cinq limites assumées en V1, à présenter avec honnêteté au jury :

1. **Volume de testeurs limité** : 3 testeurs informels au lieu d'une étude utilisateur formelle. Limitation acceptée pour le cadre académique, à corriger en V2 commerciale.
2. **Couverture sectorielle dépendante du LLM** : le moteur est agnostique au secteur, mais la qualité d'extraction varie selon la richesse des sources web du secteur (un secteur très opaque livrera moins de Movements de qualité).
3. **Coût LLM non maîtrisé à grande échelle** : V1 testée sur 10 utilisateurs et 5 concurrents chacun, V2 à 1 000 utilisateurs nécessitera une optimisation des prompts (modèle plus léger sur la collecte, Opus 4.7 réservé à l'analyse).
4. **Hallucinations LLM résiduelles** : malgré le recoupement deux sources et le score CRAAP, certaines analyses peuvent encore extrapoler. Mitigation : disclaimers visibles, score CRAAP affiché systématiquement, déduplication par embedding (pgvector).
5. **Pas de mobile native en V1** : web responsive uniquement (CLAUDE.md § Design : desktop-first 1280px puis adapté mobile 640px). App mobile native explicitement « Won't » du MoSCoW V1 (PRD § 7.9).

---

## 13 · Analyse critique

### Consigne du professeur

**Contenu attendu** :

- Analyse des résultats
- Forces du projet
- Faiblesses du projet
- Difficultés rencontrées

**Important** : une bonne analyse critique montre votre capacité de réflexion.

### Réponse RADAR

#### 13.1 Analyse des résultats

Sur les 7 fonctionnalités MVP V1 (F1 à F7), 6 sont classées « Must » et 1 « Should » (F6 Export PDF). À la date de soutenance, l'objectif est d'avoir livré l'intégralité des « Must » et au minimum un prototype d'Export PDF.

**Lecture qualitative** : la valeur du projet ne se mesure pas au nombre d'écrans livrés, mais à la cohérence de la chaîne complète. Un cycle de veille qui collecte 30 sources, en rejette 8 par CRAAP insuffisant, recoupe les 22 restantes en 12 Movements, produit une SWOT actualisée et envoie un digest email à 7h00 sans erreur, c'est cela le livrable défendable, pas le nombre brut de lignes de code.

**Lecture quantitative** (volumétrie testée en V1, PRD § 8.8) :

- 10 utilisateurs actifs en simultané supportés sur 1 VPS Hetzner CX21 (4 EUR/mois)
- 50 concurrents suivis au total
- 90 000 sources collectées sur 6 mois de fonctionnement
- 9 000 Movements détectés
- Postgres total : inférieur à 5 GB

#### 13.2 Forces du projet

| Force                                          | Justification                                                                                                                       |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Alignement méthodologique fort avec le M244    | Le cycle de veille du cours est le moteur du produit, pas une couche cosmétique. Chaque concept du cours est traçable dans le code. |
| Stack technique 2026 maîtrisé                  | Next.js 16, React 19, Prisma 6, Anthropic Claude Opus 4.7, OpenClaw : la maîtrise de ce stack est défendable face à des recruteurs. |
| Architecture inter-services propre             | Contrats Zod (`@radar/contracts`) partagés, callbacks `/api/internal/*` typés, séparation Karamo / Bachirou nette.                  |
| Documentation exhaustive                       | PRD v2.3 à 1100+ lignes, charte 800+ lignes, KARAMO.md + BACHIROU.md + ce document, specs par sprint.                               |
| Conformité RGPD intégrée by design             | Soft-delete + purge T+7, audit log, droit d'accès, base légale documentée (PRD § 8.7).                                              |
| Coût d'infrastructure compatible PME marocaine | 4 EUR/mois VPS Hetzner CX21 pour la V1, ce qui rend la solution déployable même pour des structures à très faible budget.           |
| Charte graphique propriétaire McKinsey-fit     | Le produit visuel porte une autorité immédiate auprès des dirigeants PME et consultants, ce qui n'est pas anecdotique en B2B.       |
| Démonstration vivante possible                 | Le pipeline tourne réellement, il ne s'agit pas d'un mock. Le jury peut interagir en direct.                                        |

#### 13.3 Faiblesses du projet

| Faiblesse                                                | Lecture honnête                                                                                                                  |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Tests utilisateurs limités à 3 personnes                 | Pas une étude formelle, simplement des retours qualitatifs. Statistiquement non significatif, à corriger en V2.                  |
| Dépendance forte à un fournisseur LLM (Anthropic)        | Risque de coût si Anthropic augmente ses tarifs ou ferme l'API. Mitigation : abstraction au niveau OpenClaw, migration possible. |
| Pas d'observabilité fine (pas de Sentry, pas de Datadog) | Logs structurés basiques en V1. À renforcer en V2 commerciale.                                                                   |
| Pas de file d'attente externe (pas de pg-boss)           | Choix assumé pour la V1 (PRD § 6.10), mais limite la scalabilité au-delà de quelques dizaines d'utilisateurs simultanés.         |
| Cible géographique étroite (Maroc V1)                    | Limite la base de testeurs et la diversité des sources web. À élargir Maghreb + France en V2.                                    |
| Pas de version mobile native                             | Web responsive uniquement. Le persona Dirigeant PME qui consulte en mobilité serait mieux servi par une app native.              |

#### 13.4 Difficultés rencontrées et résolutions

| Difficulté                                                                                                  | Résolution adoptée                                                                                                   |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Réorganisation architecturale en cours de projet (Fastify → OpenClaw)                                       | Refonte assumée, PRD v2.2 documente intégralement le motif et le bénéfice (CHANGELOG)                                |
| Conflit de structure entre 3 dossiers initiaux (`frontend/`, `backend/`, `database/`) et monorepo Turborepo | PR #1 de Bachirou mergée avec stratégie `theirs` sur 3 conflits modify/delete (KARAMO.md § 1)                        |
| Coordination binôme inter-périmètres (Karamo Next.js / Bachirou Agent)                                      | Document de spécifications croisées (KARAMO.md + BACHIROU.md), 4 points de vigilance, 5 décisions à trancher         |
| Format du trigger Next.js → OpenClaw (langage naturel fragile)                                              | Bascule vers format strict ou tool calls OpenClaw (BACHIROU.md § 4.1)                                                |
| Auth sur `/api/internal/*` initialement absente                                                             | Ajout d'un header `X-Internal-Secret` partagé via env, validé par middleware Next.js (BACHIROU.md § 4.2)             |
| Idempotence et retry non spécifiés                                                                          | Décision : 3 retries backoff exponentiel, UPSERT côté Next.js, échec automatique après abandon (BACHIROU.md § 4.3)   |
| Versioning des contrats inter-services                                                                      | `@radar/contracts` désigné comme source de vérité, toute modification passe en PR review croisée (BACHIROU.md § 4.4) |

---

## 14 · Recommandations

### Consigne du professeur

**Contenu attendu** :

- Solutions d'amélioration
- Recommandations techniques
- Recommandations organisationnelles
- Perspectives futures

**Conseils** : montrer que le projet peut évoluer dans le futur.

### Réponse RADAR

#### 14.1 Solutions d'amélioration (court terme, V1.1)

| Amélioration                                         | Effort estimé | Bénéfice attendu                                                    |
| ---------------------------------------------------- | ------------- | ------------------------------------------------------------------- |
| Étude utilisateurs formelle (10 à 15 entretiens)     | 2 semaines    | Validation produit, ajustements ergonomiques fondés sur la donnée   |
| Tableau de bord d'observabilité (Sentry + Plausible) | 3 jours       | Capture des erreurs prod, comprehension du comportement utilisateur |
| Documentation OpenAPI servie sur `/api/v1/docs`      | 1 jour        | Onboarding facilité des futurs contributeurs                        |
| Internationalisation FR + EN                         | 1 semaine     | Ouverture à des testeurs anglophones                                |
| Cache Redis (Upstash) pour les requêtes dashboard    | 3 jours       | Latence ramenée sous 200 ms même avec 1 000 utilisateurs            |

#### 14.2 Recommandations techniques (V2)

| Recommandation                                             | Justification                                                                                           |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Migration sur Vercel pour `apps/web`                       | Edge functions, déploiement preview par PR, scalabilité automatique (PRD § 6.9)                         |
| Migration Postgres sur Neon ou Supabase                    | Auto-scaling, sauvegardes managées, branches de DB pour preview                                         |
| Ajout d'une file d'attente externe (BullMQ + Redis)        | Au-delà de quelques dizaines d'utilisateurs simultanés, la queue interne d'OpenClaw devient un goulet   |
| Découplage modèle LLM par étape du pipeline                | Collecte sur modèle plus léger (Haiku ou Sonnet), analyse sur Opus 4.7. Réduction de coût estimée 60 %. |
| Ajout d'une couche de cache sémantique sur les Movements   | pgvector + similarité cosine pour dédupliquer les Movements similaires sur 30 jours (PRD § 8.3)         |
| Webhooks sortants pour intégrations (Slack, Teams, Notion) | Demandé par le persona Dirigeant PME pour intégrer la veille dans son flux de travail existant          |

#### 14.3 Recommandations organisationnelles

| Recommandation                                              | Justification                                                                            |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Constitution d'un comité d'utilisateurs pilotes (10 PME)    | Boucle de feedback continue, validation produit, témoignages exploitables marketing      |
| Cadrage légal du modèle de monétisation V2                  | Forme juridique au Maroc (SARL, statut auto-entrepreneur), CGV, CGU, mentions légales    |
| Partenariat avec l'ENSA Tétouan pour les promotions futures | Continuité du projet comme étude de cas pour les promotions M244 suivantes               |
| Documentation publique du code et de la méthodologie        | Repo GitHub public, articles de blog, ouverture à la contribution externe                |
| Plan de continuité pour les coûts Anthropic                 | Provisionnement budgétaire, alternative Mistral/OpenAI prête à activer en cas de bascule |

#### 14.4 Perspectives futures (Roadmap V2 et au-delà)

**Horizon 6 mois (V2.0, post-soutenance)** :

- Ouverture commerciale Maroc + Tunisie + Sénégal
- Tarification freemium (gratuit jusqu'à 3 concurrents, payant au-delà)
- App mobile React Native ou PWA
- Multi-tenant avec workspaces partagés

**Horizon 12 mois (V2.5)** :

- Expansion France et zone UEMOA
- Intégrations Slack, Teams, Notion, HubSpot
- Webhooks sortants
- Marketplace de templates de veille sectorielle (templates « Banque », « Telecom », « Retail »)

**Horizon 18 mois (V3.0)** :

- API publique pour clients qui veulent embarquer RADAR dans leur outil interne
- SSO entreprise (SAML, OAuth Microsoft)
- Conformité ISO 27001 (objectif grands comptes)
- Module de veille brevet et veille scientifique (extension hors V1)

**Horizon 24 mois (V4.0)** :

- IA générative spécialisée (fine-tuning Claude sur un corpus francophone de veille)
- Détection de signaux faibles inter-sectoriels (croisement des données de tous les workspaces avec consentement)
- Mode « advisory » : recommandations stratégiques formulées par l'agent

---

## 15 · Dimension professionnelle : le cahier des charges

### Consigne du professeur

Le projet doit être présenté comme **un portfolio professionnel et un cahier des charges destiné à convaincre un client potentiel**.

**Le cahier des charges doit inclure** :

- Les besoins du client
- Les objectifs du projet
- Les fonctionnalités attendues
- Les contraintes techniques
- Les délais
- Les ressources nécessaires
- Les résultats attendus

### Réponse RADAR

Le cahier des charges complet est constitué par le **PRD v2.3** (`docs/PRD-RADAR.md`), 1100+ lignes structurées en 19 sections (5 livrées en V2.3, 14 à compléter en V2.4+). Cette section produit le résumé exécutif exigé par le Pr. Wadiai au format cahier des charges professionnel.

#### 15.1 Les besoins du client

Les besoins identifiés sont ceux des 3 personas adressables (PRD § 4) :

- **Dirigeant PME** : surveiller ses concurrents sans y passer 2h par jour, ne rien manquer de critique, prendre des décisions informées (pricing, hiring, positionnement, communication).
- **Consultant indépendant** : accélérer la phase d'audit concurrentiel (20 à 30 % du temps non facturable d'une mission), produire des livrables clients homogènes, maintenir une veille continue sur les comptes en retainer.
- **Étudiant stratégiste** : démontrer la maîtrise des concepts M244, produire des analyses de qualité professionnelle, constituer un portfolio impressionnant.

#### 15.2 Les objectifs du projet

Objectif principal et 7 objectifs secondaires détaillés en § 05 ci-dessus.

#### 15.3 Les fonctionnalités attendues

7 fonctionnalités MVP V1 (PRD § 7) :

| ID  | Nom                                            | Priorité MoSCoW |
| --- | ---------------------------------------------- | --------------- |
| F1  | Authentification et gestion compte             | Must            |
| F2  | Onboarding Deep Research                       | Must            |
| F3  | Cycle de veille quotidien automatique          | Must            |
| F4  | Dashboard et feed d'alertes                    | Must            |
| F5  | Digest email quotidien et hebdomadaire         | Must            |
| F6  | Export PDF d'un rapport                        | Should          |
| F7  | Gestion entreprise / concurrents / axes (CRUD) | Must            |

#### 15.4 Les contraintes techniques

| Contrainte             | Spécification                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| Langage et typage      | TypeScript strict (`noUncheckedIndexedAccess: true`), zéro `any`, zéro assertion injustifiée |
| Validation des entrées | Zod sur tout flux (formulaires, API publique, callbacks internes, webhooks externes)         |
| Conformité RGPD        | Soft-delete + purge T+7, audit log, droit d'accès, base légale documentée (PRD § 8.7)        |
| Performance            | Page dashboard sous 2 secondes en V1, sous 500 ms en V2 avec cache Redis                     |
| Disponibilité          | SLA 99 % en V1 (académique), 99.9 % en V2 (commerciale)                                      |
| Sécurité               | Argon2id pour passwords, Better Auth sessions DB-backed, header X-Internal-Secret en interne |
| Localisation           | Français en V1 (cible Maroc et Maghreb), Français + Anglais en V2                            |
| Mobile                 | Web responsive desktop-first 1280px puis adapté 640px (CLAUDE.md § Design)                   |
| Charte graphique       | Radar Editorial (McKinsey-fit), navy + royal blue, Fraunces + Inter + JetBrains Mono         |

#### 15.5 Les délais

Délais opérationnels du projet académique (printemps 2026) :

- Mars 2026 : PRD initial v1.0
- Avril 2026 : Réorganisation architecturale
- Mai 2026 : PRD v2.3, charte graphique, specs sprints, bootstrap monorepo
- Mai à Juin 2026 : 6 sprints de développement
- Juin 2026 : Tests E2E, démo, rédaction rapport, soutenance

#### 15.6 Les ressources nécessaires

| Ressource            | V1 (académique)                                      | V2 (commerciale projetée)                        |
| -------------------- | ---------------------------------------------------- | ------------------------------------------------ |
| Équipe humaine       | Binôme étudiant (Karamo + Bachirou)                  | 4 à 6 personnes (2 dev, 1 PO, 1 design, 1 sales) |
| Infrastructure       | 1 VPS Hetzner CX21 (~4 EUR/mois)                     | Vercel + VPS dédié + Neon (~150 EUR/mois)        |
| LLM                  | Anthropic Claude Opus 4.7 (budget projet académique) | Anthropic Pro (~500 EUR/mois pour 100 users)     |
| Email transactionnel | Resend Free (3 000 emails / mois)                    | Resend Growth (~20 EUR/mois)                     |
| Domaine et HTTPS     | DNS gratuit ou ~10 EUR/an                            | Domaine pro + Cloudflare                         |
| Total coûts mensuels | Sous les 10 EUR                                      | ~700 EUR (couvert par 30 abonnés à 25 EUR)       |

#### 15.7 Les résultats attendus

Cf. § 5.3 ci-dessus (livrables techniques, académiques et business).

---

## 16 · Dimension professionnelle : le rapport final

### Consigne du professeur

**Le rapport final doit** :

- Être professionnel
- Être bien structuré
- Être visuellement propre
- Mettre en valeur les compétences
- Présenter clairement la valeur ajoutée
- Respecter la structure d'un cahier des charges professionnel

**Objectif** : convaincre un futur client ou partenaire de signer un contrat.

### Réponse RADAR

#### 16.1 Plan retenu pour le rapport final

Le rapport final suit la structure académique du Chapitre 2 du module M244 (PRD § 3.2), enrichie des sections imposées par le guide du Pr. Wadiai (sections 03 à 18 du PDF).

```
COUVERTURE
  Logo RADAR royal blue sur fond navy
  Titre, sous-titre (slogan), auteurs, encadrant, date
  Université, École, Cycle, Module

SOMMAIRE
  Numérotation hiérarchique, pagination

INTRODUCTION (1 page)
  Contexte, motivation, plan du rapport

1. PRÉSENTATION DU SUJET (2 pages)
2. PROBLÉMATIQUE (1 page)
3. OBJECTIFS DU PROJET (1 page)
4. VEILLE ET RECHERCHE DOCUMENTAIRE (2 pages)
5. MÉTHODOLOGIE DE RECHERCHE (1 page)
6. PLANIFICATION DU PROJET (1 page, avec Gantt)
7. PRÉSENTATION DE LA SOLUTION (3 pages, avec architecture)
8. RÉALISATION TECHNIQUE (4 pages, avec captures d'écran)
9. DÉMONSTRATION DU PROJET (2 pages, captures)
10. TESTS ET VALIDATION (1 page, tableaux et graphiques)
11. ANALYSE CRITIQUE (1 page)
12. RECOMMANDATIONS (1 page)
13. DIMENSION PROFESSIONNELLE (cahier de charges, 2 pages)

CONCLUSION (1 page)
  Synthèse, retour sur la problématique, perspective

BIBLIOGRAPHIE ET RESSOURCES
  Citation cohérente (norme APA ou ISO 690)

ANNEXES
  A. Extrait du PRD v2.3
  B. Extrait de la charte graphique RADAR
  C. Captures d'écran complémentaires
  D. Documentation OpenAPI exportée
```

Volume cible : 25 à 35 pages corps + annexes. Format A4, police Inter 11pt, interligne 1.5.

#### 16.2 Standards de qualité visuelle

| Item                | Spécification                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Polices             | Fraunces (titres), Inter (corps), JetBrains Mono (snippets de code)                         |
| Couleurs autorisées | Navy `#051C2C`, Royal Blue `#2251FF`, Bone `#F5F1EB`, sémantiques (success, warning, error) |
| Tableaux            | Bordures fines navy-700, header en eyebrow uppercase Inter Bold                             |
| Captures d'écran    | Bordure 1px navy-700, ombre subtile, légende numérotée                                      |
| Diagrammes          | Mermaid intégré ou exports Figma alignés sur la charte                                      |
| Pages               | Numérotation en pied de page, JetBrains Mono 9pt                                            |
| Couverture          | Logo lockup royal sur navy plein, titre Fraunces 48pt                                       |

#### 16.3 Mise en valeur des compétences

Le rapport met en valeur 5 familles de compétences acquises par le binôme :

1. **Compétences méthodologiques** : maîtrise opérationnelle du cycle de veille M244 (5 étapes), des grilles CRAAP / SWOT / PESTEL et de la détection de signaux faibles.
2. **Compétences techniques full-stack** : Next.js 16, React 19, TypeScript strict, Prisma 6, Tailwind 4, Shadcn UI, monorepo Turborepo.
3. **Compétences IA appliquée** : orchestration multi-agents OpenClaw, prompt engineering en SKILL.md, gestion contexte 200K tokens, prompt caching Anthropic.
4. **Compétences DevOps** : Docker Compose à 3 services, déploiement VPS, conformité RGPD, observabilité native.
5. **Compétences produit et design** : conception de personas, écriture de PRD, charte graphique propriétaire, planification de sprints.

#### 16.4 Valeur ajoutée présentée comme argument commercial

Pour un client potentiel, RADAR délivre trois bénéfices quantifiables :

- **Gain de temps** : 1 à 2 heures par jour de veille manuelle économisées, soit 20 à 40 heures par mois et par utilisateur.
- **Gain de qualité** : score CRAAP moyen supérieur à 6/10, recoupement deux sources systématique, déduplication par embedding.
- **Gain de compétitivité** : avantage temporel de 24 à 72h sur les mouvements concurrents par rapport à la presse économique.

Argumentaire pour signer : RADAR transforme une charge cognitive quotidienne (la veille) en un livrable matinal prêt à l'emploi, à un coût d'infrastructure inférieur à 5 EUR par mois en V1 et à un prix d'abonnement V2 compétitif (cible 25 à 50 EUR par mois et par utilisateur, dix fois moins cher que Crayon).

---

## 17 · Consignes importantes pour le rapport

### Consigne du professeur

**Le rapport final doit obligatoirement** :

- Être rédigé dans un style professionnel
- Être structuré comme un portfolio et un cahier des charges
- Contenir une introduction et une conclusion
- Présenter clairement les résultats
- Inclure des visuels professionnels
- Respecter les normes académiques
- Définir clairement les besoins et solutions proposées

**Le rapport doit être** :

- Sans plagiat
- Sans copie
- Original
- Un rapport de similarité sera généré. Le taux de similarité ne doit pas dépasser **15 %**.

### Réponse RADAR

#### 17.1 Style professionnel

Le rapport est rédigé en français professionnel formel, sans familiarités, avec un ton McKinsey-fit (assertif, mesuré, chiffré). Recommandations stylistiques retenues :

- Phrases courtes et déclaratives, pas de circonvolutions.
- Voix active privilégiée sur la voix passive.
- Chiffres et faits avant les opinions.
- Aucun emoji dans le corps du rapport.
- Aucun tiret cadratin (préférence éditoriale documentée dans `CLAUDE.md` global) : remplacé par deux-points, virgules ou parenthèses.

#### 17.2 Structure portfolio + cahier des charges

La structure est documentée en § 16.1 : 13 sections de corps + introduction + conclusion + bibliographie + annexes, fidèle aux 17 sections du guide du Pr. Wadiai.

#### 17.3 Introduction et conclusion

**Introduction (1 page)** : pose le contexte (veille concurrentielle à l'ère des agents IA), la motivation (module M244 et insertion professionnelle), et le plan du rapport. Conclut sur la thèse défendue : RADAR prouve qu'on peut automatiser un cycle de veille stratégique conforme au M244 avec un investissement infrastructure inférieur à 5 EUR par mois.

**Conclusion (1 page)** : synthèse des résultats obtenus, retour explicite sur la problématique du § 04 (réponse argumentée), perspectives futures (V2 et au-delà) et remerciements à l'encadrant.

#### 17.4 Présentation des résultats

Les résultats sont présentés sous forme de tableaux quantifiés et de captures d'écran annotées. La trame retenue est documentée en § 12.3 (résultats obtenus) et § 11.4 (résultats observables).

#### 17.5 Visuels professionnels

Liste des visuels à intégrer (recommandés par les sections 8, 10 et 12 du PDF du professeur) :

- 1 diagramme de Gantt (planification, § 8.3)
- 1 schéma d'architecture Docker à 3 services (§ 9.3)
- 1 schéma de pipeline OpenClaw 8 SKILL.md (§ 6 PRD)
- 1 ERD du schéma Prisma (§ 8 PRD)
- 12 captures d'écran de l'application (§ 10.5)
- 4 graphiques de résultats (Tests et validation, § 12.3)
- Logos partenaires (université, école)

#### 17.6 Normes académiques

- Bibliographie au format APA 7e édition ou ISO 690 (à arbitrer avec l'encadrant).
- Numérotation hiérarchique des sections (1, 1.1, 1.1.1).
- Tables des figures et tables des tableaux en début de rapport.
- Pagination uniforme, marges 2.5 cm.
- Couverture officielle de l'ENSA Tétouan.

#### 17.7 Définition claire des besoins et solutions

Les besoins sont définis en § 3.6 (problème à résoudre) et § 4.2 (identification du besoin), avec personas adressables nommés. Les solutions sont définies en § 9 (présentation de la solution) avec architecture détaillée et valeur ajoutée chiffrée.

#### 17.8 Originalité et taux de similarité

**Engagement de plagiat zéro** : le rapport est rédigé intégralement par le binôme (avec assistance Claude documentée comme outil, pas comme auteur). Les sources tierces sont citées explicitement avec référence bibliographique. La méthodologie M244 est paraphrasée et appliquée, jamais recopiée littéralement du cours.

**Cible de similarité** : **inférieure à 15 %** (limite imposée par le Pr. Wadiai). Stratégie :

- Reformulation systématique des concepts du cours dans nos propres mots.
- Aucun copier-coller depuis le PRD, le PRD est cité en référence et résumé.
- Mention explicite « D'après le cours M244 du Pr. Wadiai, Chapitre X » à chaque référence.
- Vérification interne avec un outil de détection avant soumission finale.

---

## 18 · Bibliographie et ressources

### Consigne du professeur

**Contenu attendu** :

- Articles scientifiques
- Sites web fiables
- Livres
- Rapports
- Documentation technique

**Important** : une liste complète des ressources doit être ajoutée à la fin du rapport.

**Conseils** :

- Respecter un format de citation cohérent
- Mentionner toutes les sources utilisées
- Éviter les sources non fiables

### Réponse RADAR

Format de citation retenu : **APA 7e édition** (ou ISO 690 à confirmer avec l'encadrant). Les références sont organisées par catégorie.

#### 18.1 Cours et supports académiques

- WADIAI, Y. (2025-2026). _Veille Technologique (M244) : Cycle Ingénieur, Les Techniques de Veille_. Chapitres 1 (cycle de veille), 2 (SWOT, PESTEL), 3 (CRAAP, diffusion). École Nationale des Sciences Appliquées de Tétouan, Université Abdelmalek Essaâdi.

#### 18.2 Articles scientifiques de référence

- BLAKESLEE, S. (2004, révisions ultérieures). _The CRAAP Test_. Meriam Library, California State University, Chico.
- ANSOFF, H. I. (1975). _Managing Strategic Surprise by Response to Weak Signals_. California Management Review, 18(2), 21-33.
- ANDREWS, K. R., LEARNED, E. P. (1965). _The Concept of Corporate Strategy_. Dow Jones-Irwin.
- AGUILAR, F. J. (1967). _Scanning the Business Environment_. Macmillan (origine du modèle PEST/PESTEL).
- PORTER, M. E. (1979). _How Competitive Forces Shape Strategy_. Harvard Business Review.
- KENT, S. (1949). _Strategic Intelligence for American World Policy_. Princeton University Press.
- LESCA, H., LESCA, N. (2014). _Strategic Decisions and Weak Signals: Anticipation for Decision-Making_. Wiley.

#### 18.3 Documentation technique officielle (sites web fiables)

- ANTHROPIC. (2024-2026). _Claude API Documentation_. https://docs.anthropic.com — pages sur Claude Opus 4.7, prompt caching, context 200K.
- OPENCLAW. (2026). _OpenClaw Documentation_. https://github.com/openclaw (image Docker `ghcr.io/openclaw/openclaw:latest`).
- VERCEL. (2026). _Next.js 16 Documentation_. https://nextjs.org/docs (App Router, Server Components, Server Actions).
- PRISMA. (2026). _Prisma 6 Documentation_. https://www.prisma.io/docs.
- TAILWIND LABS. (2026). _Tailwind CSS v4 Documentation_. https://tailwindcss.com/docs.
- META. (2026). _React 19 Documentation_. https://react.dev.
- SHADCN. (2026). _Shadcn UI Components_. https://ui.shadcn.com.
- BETTER AUTH. (2026). _Better Auth Documentation_. https://www.better-auth.com.
- RESEND. (2026). _Resend Email API Documentation_. https://resend.com/docs.
- POSTGRESQL GLOBAL DEVELOPMENT GROUP. (2026). _PostgreSQL 17 Documentation_. https://www.postgresql.org/docs/17/.
- PGVECTOR. (2026). _pgvector Extension_. https://github.com/pgvector/pgvector.

#### 18.4 Rapports et études de marché

- GARTNER. (2024-2026). _Competitive Intelligence Software Market Guide_. Stamford, CT.
- FORRESTER. (2024-2026). _The Forrester Wave: Competitive and Market Intelligence Platforms_. Cambridge, MA.
- IDC. (2025). _Worldwide SaaS B2B Forecast_. International Data Corporation.
- HAUT-COMMISSARIAT AU PLAN (HCP). (2025). _Tissu PME au Maroc : structure et évolution_. https://www.hcp.ma.
- CONFÉDÉRATION GÉNÉRALE DES ENTREPRISES DU MAROC (CGEM). (2025). _Baromètre PME 2025_. https://www.cgem.ma.
- MCKINSEY GLOBAL INSTITUTE. (2024). _Digital Africa: Technological Transformation for Jobs_. https://www.mckinsey.com/mgi.

#### 18.5 Sites professionnels et benchmarks concurrents

- SIMILARWEB. https://www.similarweb.com (analyse de trafic web).
- SEMRUSH. https://www.semrush.com (SEO et veille).
- CRAYON. https://www.crayon.co (competitive intelligence enterprise).
- KLUE. https://klue.com (competitive enablement).
- KOMPYTE. https://www.kompyte.com (alertes concurrentielles).
- VISUALPING. https://visualping.io (monitoring de pages).
- MENTION. https://mention.com (social listening).
- BRANDWATCH. https://www.brandwatch.com (social listening enterprise).
- FEEDLY. https://feedly.com (agrégateur de flux RSS).

#### 18.6 Documentation interne du projet RADAR

- SYLLA, K., KONATÉ, B. (2026). _Product Requirements Document RADAR v2.3_. `docs/PRD-RADAR.md`, monorepo RADAR.
- SYLLA, K. (2026). _Charte Graphique RADAR Editorial_. `Branding/CHARTE_GRAPHIQUE_RADAR.md`.
- KONATÉ, B. (2026). _KARAMO.md : changement d'architecture vers OpenClaw_. Monorepo RADAR.
- SYLLA, K. (2026). _BACHIROU.md : réponse architecturale et points de vigilance_. Monorepo RADAR.

#### 18.7 Conformité et cadre réglementaire

- COMMISSION NATIONALE DE CONTRÔLE DE LA PROTECTION DES DONNÉES À CARACTÈRE PERSONNEL (CNDP, Maroc). _Loi 09-08 sur la protection des données personnelles_. https://www.cndp.ma.
- COMMISSION NATIONALE DE L'INFORMATIQUE ET DES LIBERTÉS (CNIL, France). _Règlement général sur la protection des données (RGPD)_. https://www.cnil.fr.

---

## 19 · Conseils pour la présentation orale : règles et temps

### Consigne du professeur

**Règles importantes** :

- Présentation sans lecture
- Tous les membres doivent participer
- Chaque membre doit maîtriser le projet

**Gestion du temps** :

- 25 minutes de présentation
- 5 minutes de questions
- Respect strict du temps

**Interaction avec l'audience** :

- Répondre clairement aux questions
- Engager le public
- Maintenir une bonne communication

### Réponse RADAR

#### 19.1 Présentation sans lecture

Le binôme ne lit pas les slides : il les commente. Préparation :

- Répétitions internes : 5 répétitions minimum avant la soutenance, avec chronomètre.
- Slides en mode keyword : une slide = 1 idée maîtresse + 3 sous-idées en bullet, jamais de paragraphes.
- Notes de prise de parole personnelles (fichier non projeté) pour les transitions et les chiffres précis.
- Démo en direct pour rompre le format slide (Pr. Wadiai § 11).

#### 19.2 Participation équilibrée des deux membres

Répartition de la parole calquée sur la répartition des périmètres (CLAUDE.md § Répartition binôme) :

| Bloc                                       | Durée      | Locuteur principal   |
| ------------------------------------------ | ---------- | -------------------- |
| Introduction, contexte, problématique      | 3 min      | Karamo               |
| Cycle de veille M244 et ancrage académique | 2 min      | Bachirou             |
| Personas et parcours utilisateur           | 2 min      | Karamo               |
| Architecture OpenClaw et 8 SKILL.md        | 3 min      | Bachirou             |
| Stack technique Next.js + Prisma + Zod     | 2 min      | Karamo               |
| Démonstration en direct                    | 8 min      | Partagé (alternance) |
| Tests, validation et analyse critique      | 2 min      | Bachirou             |
| Recommandations et perspectives V2         | 2 min      | Karamo               |
| Conclusion                                 | 1 min      | Bachirou             |
| **Total**                                  | **25 min** | **équilibré 12/13**  |

#### 19.3 Maîtrise du projet par chaque membre

Chaque membre doit pouvoir répondre à n'importe quelle question du jury sur n'importe quelle partie. Préparation :

- Karamo connaît `apps/agent/` et les SKILL.md (lit attentivement les fichiers de Bachirou).
- Bachirou connaît `apps/web/`, le schéma Prisma et les écrans (lit le PRD § 6 à 9 et la charte).
- Q&A blanc : Karamo pose 10 questions à Bachirou, et inversement, 48h avant la soutenance.

#### 19.4 Gestion du temps

Chronomètre projeté visible des deux membres pendant la présentation. Slide « bilan » prête à projeter en avance si le temps presse. Démo réduite à 6 min si le timing dérape.

#### 19.5 Interaction avec l'audience et le jury

| Type de question                               | Réponse type                                                                                       |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Question conceptuelle (M244)                   | Référer au cours et au PRD § 3 (ancrage M244)                                                      |
| Question technique pointue (Anthropic, Docker) | Réponse technique précise + référence à la doc officielle                                          |
| Question business (modèle économique)          | Référer au PRD § 1.5 et § 2 + Roadmap V2 § 14.4                                                    |
| Question critique sur une faiblesse            | Reconnaître honnêtement (§ 13.3), expliquer la mitigation envisagée                                |
| Question hors scope                            | Reconnaître le hors scope, renvoyer à la roadmap V2 ou au PRD § 2.4 (anti-vision)                  |
| Question piège ou agressive                    | Rester calme, reformuler la question, donner une réponse factuelle sans s'engager émotionnellement |

Engagement du public : poser une question rhétorique en ouverture (« Combien de temps passez-vous chaque jour à surveiller votre marché ? »), pointer une donnée pendant la démo, conclure par une formule mémorable (« Vos concurrents bougent. Radar vous le dit avant tout le monde. »).

---

## 20 · Conseils pour la présentation orale : apparence professionnelle

### Consigne du professeur

**Conseil professionnel** :

- Habillez-vous de manière professionnelle.
- En tant que futurs ingénieurs, vous devez comprendre que le professionnalisme commence par votre apparence.
- Puisque vous présentez un projet final, votre tenue et votre présentation personnelle jouent un rôle important pour convaincre votre audience et un potentiel client.

**Une apparence soignée renforce** :

- La crédibilité
- La confiance
- L'image professionnelle de votre équipe

### Réponse RADAR

#### 20.1 Tenue retenue

Tenue business formelle, alignée sur les codes des cabinets de conseil dont s'inspire la charte Radar Editorial :

| Item        | Karamo Sylla                                 | Bachirou Konaté                              |
| ----------- | -------------------------------------------- | -------------------------------------------- |
| Veste       | Veste de costume sombre (navy ou anthracite) | Veste de costume sombre (navy ou anthracite) |
| Chemise     | Chemise blanche ou bleu pâle, repassée       | Chemise blanche ou bleu pâle, repassée       |
| Pantalon    | Pantalon de costume assorti                  | Pantalon de costume assorti                  |
| Chaussures  | Chaussures de ville cuir cirées              | Chaussures de ville cuir cirées              |
| Accessoires | Pas de cravate obligatoire, sobre            | Pas de cravate obligatoire, sobre            |

#### 20.2 Préparation personnelle

- Cheveux soignés, barbe taillée (si applicable).
- Pas de logo ou marque visible apparente.
- Posture droite, ancrée, regards alternés vers le jury et vers le public.
- Voix posée, débit modéré, articulation soignée.
- Pas de mains dans les poches, pas de tics gestuels.
- Téléphones en mode silencieux, hors de la vue.

#### 20.3 Cohérence avec l'identité visuelle du produit

L'identité visuelle de RADAR (navy + royal blue, charte McKinsey-fit) est volontairement alignée sur les codes vestimentaires des cabinets de conseil. La tenue formelle navy / blanche du binôme prolonge cette identité de marque jusqu'à l'humain qui présente le produit. Cohérence visuelle complète entre :

- Le logo affiché en couverture du slide (royal blue sur navy)
- La charte du dashboard projeté pendant la démo
- La tenue vestimentaire des deux présentateurs
- La sobriété du discours et des slides

Cet alignement renforce le message implicite : RADAR est un produit sérieux, conçu par une équipe sérieuse, et destiné à des décideurs sérieux.

#### 20.4 Renforcement de crédibilité et de confiance

Trois leviers de crédibilité activés simultanément :

1. **Crédibilité visuelle** : tenue formelle + design produit aligné + slides sobres.
2. **Crédibilité méthodologique** : maîtrise opérationnelle du cycle M244, du CRAAP, du SWOT, du PESTEL.
3. **Crédibilité technique** : démonstration vivante d'un système fonctionnel en environnement réel.

L'effet combiné convainc le jury et un client potentiel que le binôme est capable de livrer un produit professionnel et de le défendre dans un contexte de vente B2B réel.

---

## Annexe A · Récapitulatif des sections du PDF et de leur couverture

| Section PDF                            | Couverture dans ce document | Croisement avec sources projet               |
| -------------------------------------- | --------------------------- | -------------------------------------------- |
| 01 Page de garde                       | § 01                        | Charte graphique, CLAUDE.md                  |
| 02 Objectif du guide                   | § 02                        | PRD § 3                                      |
| 03 Présentation du sujet               | § 03                        | PRD § 1, § 2, § 3                            |
| 04 Problématique                       | § 04                        | PRD § 1.2, § 4                               |
| 05 Objectifs du projet                 | § 05                        | PRD § 2, § 7                                 |
| 06 Veille et recherche documentaire    | § 06                        | PRD § 3.2, cours M244, bibliographie         |
| 07 Méthodologie de recherche           | § 07                        | CLAUDE.md, PRD § 7                           |
| 08 Planification du projet             | § 08                        | PRD § 7.1, CLAUDE.md, sprints                |
| 09 Présentation de la solution         | § 09                        | PRD § 5, § 6, § 9                            |
| 10 Réalisation technique               | § 10                        | PRD § 6, § 7, CLAUDE.md § Stack              |
| 11 Démonstration du projet             | § 11                        | PRD § 3.5.4, § 5.6, specs sprints            |
| 12 Tests et validation                 | § 12                        | PRD § 8, § 12.x ici                          |
| 13 Analyse critique                    | § 13                        | PRD § 8.8, KARAMO.md, BACHIROU.md            |
| 14 Recommandations                     | § 14                        | PRD § 18, roadmap V2                         |
| 15 Dimension professionnelle (cahier)  | § 15                        | PRD intégral                                 |
| 16 Dimension professionnelle (rapport) | § 16                        | PRD, charte graphique                        |
| 17 Consignes importantes               | § 17                        | CLAUDE.md, PRD                               |
| 18 Bibliographie et ressources         | § 18                        | Cours M244, docs techniques, rapports marché |
| 19 Présentation orale (règles)         | § 19                        | CLAUDE.md § Répartition binôme               |
| 20 Présentation orale (apparence)      | § 20                        | Charte graphique (cohérence visuelle)        |

---

## Annexe B · Documents sources à exploiter pour le rapport final

| Document                 | Chemin dans le repo                                        | Usage pour le rapport                      |
| ------------------------ | ---------------------------------------------------------- | ------------------------------------------ |
| PRD v2.3                 | `docs/PRD-RADAR.md`                                        | Source principale du contenu produit       |
| Charte graphique         | `Branding/CHARTE_GRAPHIQUE_RADAR.md`                       | Identité visuelle, polices, palette        |
| Tokens W3C               | `Branding/tokens/radar-tokens.json`                        | Référence technique design                 |
| Logos SVG                | `Branding/logo/` (8 SVG)                                   | Couverture, en-têtes de section            |
| Favicons                 | `Branding/favicons/`                                       | Web app, captures                          |
| KARAMO.md                | `KARAMO.md`                                                | Décisions architecturales de Bachirou      |
| BACHIROU.md              | `BACHIROU.md`                                              | Points de vigilance et décisions de Karamo |
| CLAUDE.md projet         | `CLAUDE.md`                                                | Règles de développement                    |
| Spec Sprint 1 Auth       | `docs/Sprint-01/SPEC-Sprint01-Authentification.md`         | Détail F1                                  |
| User Stories Sprint 1    | `docs/Sprint-01/USER-STORIES-Sprint01-Authentification.md` | Détail F1 utilisateur                      |
| Spec Sprint 2 Onboarding | `docs/Sprint-02/SPEC-Sprint02-Onboarding.md`               | Détail F2 et F7                            |
| User Stories Sprint 2    | `docs/Sprint-02/USER-STORIES-Sprint02-Onboarding.md`       | Détail F2 utilisateur                      |
| Spec Sprint 3 Dashboard  | `docs/Sprint-03/SPEC-Sprint03-Dashboard.md`                | Détail F4                                  |
| User Stories Sprint 3    | `docs/Sprint-03/USER-STORIES-Sprint03-Dashboard.md`        | Détail F4 utilisateur                      |
| Consignes PDF Pr. Wadiai | `M244 Consignes Techniques de veille.pdf`                  | Source officielle des consignes            |

---

> **Fin du document.** Ce fichier est la source unique de vérité pour préparer la soutenance et le rapport final du module M244. Il croise les 17 sections du guide de soumission du Pr. Wadiai avec l'ensemble des artefacts produits par le binôme Karamo Sylla et Bachirou Konaté pour le projet RADAR.
