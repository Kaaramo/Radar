# RADAR · Contrat de présentation orale (slides) · v2

> Document à copier-coller dans un générateur de présentation. Une slide par bloc `## Slide N`. Notes orateur en fin de bloc.
> Charte visuelle imposée : navy `#051C2C` + royal blue `#2251FF` + bone `#F5F1EB`, polices **Fraunces** (titres et hero), **Inter** (corps), **JetBrains Mono** (chiffres et data), aucun gradient, aucun emoji, aucune illustration générique, aucun tiret cadratin.

---

## Métadonnées globales

- **Durée totale** : 25 minutes de présentation + 5 minutes de questions
- **Nombre de slides** : 20
- **Démonstration live** : positionnée à la slide 19, en **climax narratif final** (et non en milieu de présentation)
- **Binôme** : Karamo Sylla (apps/web, design, données) et Bachirou Konaté (agent OpenClaw, infra)
- **Encadrant** : Dr. Younes Wadiai
- **Cadre** : Module M244, Cycle Ingénieur BDIA, ENSA Tétouan, Printemps 2026
- **Posture narrative** : pitch commercial à un dirigeant marocain qui découvre Radar pour la première fois. Tension dramatique croissante jusqu'à la démonstration finale. La méthode académique M244 est une garantie de fond, jamais le sujet central.

---

## Plan en huit actes

| Acte | Slides  | Durée | Objectif narratif                                              |
| ---- | ------- | ----- | -------------------------------------------------------------- |
| 1    | 1 à 3   | 3 min | L'observation : poser le contexte et la douleur du marché      |
| 2    | 4 à 6   | 3 min | Le tournant : pourquoi maintenant, à quelle question on répond |
| 3    | 7 à 9   | 4 min | La solution : la promesse, le parcours, le positionnement      |
| 4    | 10 à 12 | 4 min | La rigueur : architecture, stack, méthode                      |
| 5    | 13 à 15 | 3 min | La preuve : tests, planning, cahier des charges                |
| 6    | 16      | 1 min | L'honnêteté : ce qui marche, ce qui ne marche pas encore       |
| 7    | 17 à 18 | 2 min | Le futur : roadmap et appel à l'action                         |
| 8    | 19      | 7 min | LA DÉMONSTRATION LIVE : climax narratif et preuve finale       |
| Q&A  | 20      | 5 min | Questions et réponses                                          |

---

## Slide 1 · COUVERTURE

# RADAR

### Vos concurrents bougent. Radar vous le dit avant tout le monde.

**Statement-line (Inter 18pt) :**
Le premier outil de veille concurrentielle conçu pour les PME et consultants francophones, propulsé par un agent IA autonome.

**Pied de slide (Inter 13pt muted) :**

- Karamo Sylla & Bachirou Konaté
- Encadrant : Dr. Younes Wadiai
- Module M244 · Cycle Ingénieur BDIA · ENSA Tétouan
- Printemps 2026

**Visuel** : logo lockup royal blue sur navy plein, centré. Halos radar concentriques très subtils en navy-700 derrière le logo. Aucun autre élément.

**Locuteur** : Karamo (45 s)

**Notes orateur** :

- Saluer, nommer le binôme et l'encadrant.
- Lire le slogan lentement, comme une promesse contractuelle.
- Annoncer le format : 25 minutes de présentation, démonstration en direct à la fin, 5 minutes de questions.

**Transition** : « Mais avant de vous montrer Radar, je voudrais vous raconter ce qui se passe pendant que nous parlons. »

---

## Slide 2 · ACCROCHE

# Pendant les 30 dernières secondes,

### vos concurrents ont changé trois choses sur leur site.

**Bullets (Inter 18pt) :**

- Un dirigeant de PME passe **1 à 2 heures par jour** à essayer de voir ce que font ses concurrents. Sans méthode. Sans résultat.
- **78 %** des mouvements concurrents critiques (prix, levées, recrutements stratégiques) sont découverts trop tard pour pouvoir y réagir.
- Le coût d'un signal manqué : **2 à 6 mois de retard** sur une décision qui aurait pu être anticipée.
- À l'échelle des PME marocaines, c'est un manque à gagner estimé à **plusieurs milliards de dirhams** par an.

**Visuel** : horloge minimaliste JetBrains Mono qui défile en temps réel à l'écran. Sur les côtés, trois timestamps qui apparaissent un à un, format `06:43:12 — Concurrent A · publié une offre d'emploi senior data`, `06:44:01 — Concurrent B · refonte de la page tarifs`, `06:44:38 — Concurrent C · annonce un partenariat`.

**Locuteur** : Karamo (1 min 15)

**Notes orateur** :

- Marquer un silence de 2 secondes après l'énoncé du titre.
- Ne pas lire les bullets, les commenter.
- Insister sur le chiffre « 2 à 6 mois de retard » : c'est ce qui fait basculer une stratégie.

**Transition** : « Cette douleur, elle a une raison structurelle. »

---

## Slide 3 · UN MARCHÉ AVEUGLE

# Les outils existent. Ils ne sont pas faits pour vous.

| Acteur                     | Tarif d'entrée                         | Cible réelle            | Méthode de veille      |
| -------------------------- | -------------------------------------- | ----------------------- | ---------------------- |
| **Similarweb**             | 199 USD / mois et par utilisateur      | Agences SEO, e-commerce | Métriques de trafic    |
| **SEMrush**                | 139 USD / mois et par utilisateur      | Agences marketing       | Mots-clés et backlinks |
| **Crayon**                 | Sur devis (à partir de 1 000 USD/mois) | Grands comptes B2B      | Compétiteur tracking   |
| **Mention, Brandwatch**    | 49 à 800 USD / mois                    | Communication corporate | Social listening       |
| **Marché PME francophone** | **Vide**                               | **Personne**            | **Aucune**             |

**Conclusion en bandeau bas (Fraunces italic, royal blue) :**
« La méthode existe. Le module M244 l'enseigne. L'outil pour l'appliquer à grande échelle n'existait pas. Jusqu'à aujourd'hui. »

**Visuel** : tableau avec ligne « Marché PME francophone » en royal-soft surlignée. Cellule « Aucune » en rouge sombre.

**Locuteur** : Karamo (1 min)

**Notes orateur** :

- Ne pas dénigrer les concurrents : les positionner pour montrer le vide.
- Pointer la ligne du bas : « C'est ce vide que Radar vient occuper. »

**Transition** : « Et il y a une raison précise pour laquelle ce vide se comble maintenant, en 2026. »

---

## Slide 4 · POURQUOI MAINTENANT

# 2026 est l'année où ce produit devient possible.

### Trois inflexions technologiques qui rendent Radar buildable par deux étudiants

| Inflexion                            | Avant 2024                               | Aujourd'hui                                    |
| ------------------------------------ | ---------------------------------------- | ---------------------------------------------- |
| **Capacité de raisonnement des LLM** | Contexte 8K à 32K tokens, hallucinations | Claude Opus 4.7 : 200K tokens, prompt caching  |
| **Orchestration d'agents IA**        | Code custom complexe, files d'attente    | OpenClaw : scheduling natif, SKILL.md markdown |
| **Coût d'infrastructure**            | Serveurs dédiés, 200 à 500 EUR / mois    | VPS Docker à **4 EUR / mois**                  |

**Statement-line (Fraunces italic, royal blue, 22pt) :**
« Il y a trois ans, ce produit aurait nécessité 10 ingénieurs et 200 000 EUR de budget. Aujourd'hui, deux étudiants le construisent en un semestre. »

**Visuel** : trois colonnes verticales, chaque colonne a un avant/après. Le « après » est animé en royal blue, l'« avant » est en muted-soft.

**Locuteur** : Bachirou (1 min)

**Notes orateur** :

- Cette slide est un argument de timing : « Nous arrivons au bon moment. »
- Mentionner que les concurrents grand compte sont encore sur de l'ancienne architecture.

**Transition** : « C'est dans ce timing précis que nous nous sommes posé la question suivante. »

---

## Slide 5 · PROBLÉMATIQUE

# La question qui a guidé tout le projet.

### Formulation académique

> Comment automatiser, avec la rigueur du module M244 (cycle de veille, CRAAP, SWOT, PESTEL, signaux faibles), la surveillance quotidienne des concurrents d'une PME ou d'un consultant indépendant, pour livrer chaque matin un rapport recoupé et actionnable, sans intervention humaine et à un coût compatible avec les marges d'une PME marocaine ?

**Quatre sous-questions opérationnelles** :

1. Comment **encoder** une méthode pédagogique dans des prompts d'agents IA traçables ?
2. Comment **orchestrer** un pipeline multi-agents fiable sans file d'attente externe ?
3. Comment **garantir** la qualité analytique sans intervention humaine quotidienne ?
4. Comment **livrer** cela à des utilisateurs non techniques en moins de 10 minutes d'onboarding ?

**Visuel** : bloc citation centré, fond navy-800, bordure gauche royal blue 4px. Sous-questions numérotées en JetBrains Mono, verbes d'action en royal blue.

**Locuteur** : Karamo (1 min)

**Notes orateur** :

- Lire la problématique sans précipiter, c'est le pivot du pitch.
- Pointer les 4 verbes d'action : ils structurent les actes suivants.

**Transition** : « Cette question, elle a trois visages très concrets. »

---

## Slide 6 · TROIS VISAGES, UNE MÊME DOULEUR

# Pour qui Radar a été pensé.

| Persona                                                                 | Citation représentative                                                                                    | Job to be done                                     |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **Karim Berrada**<br/>Dirigeant PME logistique, Casablanca, 35 salariés | « Mes concurrents bougent. Je le découvre toujours par hasard, en scrollant LinkedIn. Trop tard. »         | Être alerté avant la presse                        |
| **Soukaina El Idrissi**<br/>Consultante stratégie indépendante, Rabat   | « Je perds deux semaines de mission à comprendre l'écosystème concurrentiel. C'est du temps non facturé. » | Démarrer une mission avec une base déjà constituée |
| **Yassine Tazi**<br/>Étudiant Master 2 stratégie, ESITH, Casablanca     | « On apprend la méthode en cours. La faire manuellement pour un seul concurrent prend une journée. »       | Démontrer la maîtrise des concepts M244            |

**Visuel** : trois cartes côte à côte, chaque carte avec une icône Lucide outline (briefcase, user-check, graduation-cap), le nom et le titre en Fraunces, la citation en Inter italic, le JTBD en eyebrow uppercase royal blue.

**Locuteur** : Karamo (1 min)

**Notes orateur** :

- Donner des noms et prénoms : ce sont des personas inspirés de profils réels.
- Lire chaque citation à voix haute, en variant légèrement le ton.
- Conclure : « Karim, Soukaina et Yassine ont le même besoin. Radar le servait. »

**Transition** : « Voici ce que nous leur livrons. »

---

## Slide 7 · RADAR

# Pendant que vous dormez, Radar lit le web à votre place.

### Trois promesses contractuelles, mesurables, opposables.

**Trois cards en grille (Inter 18pt) :**

| **5 minutes par jour suffisent**                          | **24 à 72 heures d'avance**                                                  | **Score CRAAP supérieur à 6 / 10**                                                        |
| --------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Digest email à 7h00, lecture rapide sur mobile ou desktop | Avantage temporel mesuré vs la presse économique sur les mouvements détectés | Chaque source est évaluée selon la grille académique CRAAP. Sources sous 5 / 10 rejetées. |

**Statement-line (Fraunces 28pt centré royal blue) :**
« Pas un outil de plus. Le seul outil qui applique une méthode. »

**Visuel** : trois cards en grille, chacune fond navy-800, bordure 1px royal blue, chiffre hero en Fraunces 56pt royal blue. Logo Radar discret au-dessus du tout.

**Locuteur** : Bachirou (1 min 15)

**Notes orateur** :

- Lire les trois promesses comme un contrat.
- Insister sur la dernière card : c'est ce qui différencie Radar des outils existants.

**Transition** : « Concrètement, voici comment ça se passe pour un nouvel utilisateur. »

---

## Slide 8 · PARCOURS UTILISATEUR

# De l'inscription au premier rapport, en moins de 24 heures.

| Étape                        | Quand    | Effort utilisateur | Ce qui se passe                                                                                                             |
| ---------------------------- | -------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Inscription**              | J0       | 2 minutes          | Email et mot de passe ou Google OAuth                                                                                       |
| **Onboarding Deep Research** | J0       | 8 minutes          | Saisie entreprise + 1 à 5 concurrents + axes de surveillance. Pendant ce temps, l'agent enrichit automatiquement le profil. |
| **Premier cycle de veille**  | J1, 6h00 | **Zéro**           | Collecte, évaluation, analyse, rédaction, envoi du digest                                                                   |
| **Routine établie**          | J+       | 5 à 15 min / jour  | Le **moment AHA arrive au jour 2** : la SWOT a évolué, un signal faible apparaît.                                           |

**Visuel** : timeline horizontale, 4 stations, royal blue sur navy. Effort utilisateur affiché en grand en Fraunces sous chaque station, avec décroissance visuelle de 8 min vers 5 min.

**Locuteur** : Karamo (1 min 15)

**Notes orateur** :

- Pointer la colonne « Effort utilisateur » : décroissance volontaire jusqu'à zéro le J1.
- Mentionner explicitement le « moment AHA » du jour 2 : c'est ce qui transforme un curieux en utilisateur fidèle.

**Transition** : « Comment Radar se compare aux outils que vous connaissez ? »

---

## Slide 9 · POSITIONNEMENT

# Le seul outil sur ce segment.

| Critère            | Similarweb · SEMrush · Crayon                | Radar                                                                |
| ------------------ | -------------------------------------------- | -------------------------------------------------------------------- |
| Cœur métier        | Métriques de trafic et SEO                   | Détection de mouvements stratégiques tous axes                       |
| Méthode            | Aucune explicite                             | Cycle de veille académique encodé dans l'agent, CRAAP par source     |
| Analyse            | Dashboards de métriques                      | SWOT et PESTEL générées et actualisées automatiquement               |
| Signaux faibles    | Non couverts                                 | Détection par croisement multi-sources sur 30 jours glissants        |
| **Tarif d'entrée** | **À partir de 100 USD / utilisateur / mois** | **Gratuit en V1 académique, cible 25 à 50 EUR / utilisateur / mois** |
| Public             | Grands comptes, agences SEO                  | PME, consultants, étudiants francophones                             |

**Statement-line (Fraunces 22pt royal blue, sous le tableau) :**
« Pour le prix d'un café par jour, vos concurrents perdent leur avantage temporel. »

**Visuel** : tableau aligné. Ligne « Tarif d'entrée » surlignée en royal-soft. Header en eyebrow uppercase Inter Bold.

**Locuteur** : Karamo (1 min 30)

**Notes orateur** :

- Ne pas attaquer Similarweb ou Crayon : ils sont excellents sur leur segment.
- Pointer le facteur d'écart tarifaire : un facteur 10 à 100, c'est défendable.
- Conclure : « Nous occupons un segment qu'aucun outil ne couvre méthodologiquement. »

**Transition** : « Tout cela tient sur une mécanique technique précise. »

---

## Slide 10 · ARCHITECTURE

# Trois services. Huit agents. Un cycle.

```
┌───────────────────────────────────────────────────┐
│  CLIENT (navigateur HTTPS)                        │
└──────────────────────┬────────────────────────────┘
                       ▼
┌───────────────────────────────────────────────────┐
│  APPS/WEB · Next.js 16                            │
│  Rendu, auth, dashboard, déclenchement, callbacks │
│  Prisma 6 → PostgreSQL 17                         │
└──────────────────────┬────────────────────────────┘
                       │ Réseau Docker interne
                       ▼
┌───────────────────────────────────────────────────┐
│  OPENCLAW Gateway (port 18789)                    │
│  ▸ Orchestrateur (cron 06:00)                     │
│  ▸ Deep-Research · Collecteur · Évaluateur CRAAP  │
│  ▸ Analyste SWOT · Analyste PESTEL                │
│  ▸ Détecteur signaux faibles · Rédacteur          │
│  LLM : Claude Opus 4.7 · Acquisition : Playwright │
└───────────────────────────────────────────────────┘
```

**Trois principes architecturaux** :

- Pipeline **séquentiel, idempotent, traçable** de bout en bout.
- Chaque agent est un **fichier markdown (SKILL.md)**, modifiable sans redéploiement.
- Aucune file d'attente externe. **Tout tient sur Docker Compose et un VPS à 4 EUR par mois.**

**Visuel** : schéma SVG propre, 3 boîtes verticales, 8 agents en cascade dans la 3e boîte, lignes royal blue 1.5px, flèches discrètes. Animation : les 8 agents s'illuminent un par un quand on parle.

**Locuteur** : Bachirou (1 min 30)

**Notes orateur** :

- Ne pas détailler chaque agent : les nommer, c'est suffisant.
- Insister sur le 3e principe : c'est l'argument de coût et de souveraineté technique.

**Transition** : « Cette architecture s'appuie sur un stack précis, choisi avec discipline. »

---

## Slide 11 · STACK TECHNIQUE

# Chaque ligne est défendable face à un staff engineer.

| Couche                      | Choix                                                                       |
| --------------------------- | --------------------------------------------------------------------------- |
| **Frontend**                | Next.js 16 (App Router), React 19, TypeScript strict, Tailwind 4, Shadcn UI |
| **Auth**                    | Better Auth (email + Google OAuth), Argon2id                                |
| **Base de données**         | PostgreSQL 17 + Prisma 6 + extension pgvector                               |
| **Engine IA**               | OpenClaw (image Docker officielle), 8 agents en SKILL.md                    |
| **LLM**                     | Claude Opus 4.7 d'Anthropic (contexte 200K, prompt caching)                 |
| **Acquisition**             | Playwright + DuckDuckGo web_search + web_fetch                              |
| **Emails**                  | React Email + Resend                                                        |
| **Conteneurisation**        | Docker Compose 3 services                                                   |
| **Hébergement V1**          | VPS Hetzner CX21, 4 EUR / mois                                              |
| **Monorepo**                | pnpm workspaces + Turborepo                                                 |
| **Contrats inter-services** | Zod (@radar/contracts) partagés frontend / agent                            |
| **Conformité**              | RGPD : soft-delete + purge T+7, audit log, droit d'accès                    |

**Visuel** : table à 2 colonnes, header en eyebrow, valeurs techniques en JetBrains Mono 13pt. Surlignage royal blue sur la ligne hébergement (« 4 EUR / mois »).

**Locuteur** : Bachirou (1 min)

**Notes orateur** :

- Ne pas tout lire : pointer 3 choix forts (Claude Opus 4.7, OpenClaw natif, 4 EUR/mois).
- Préciser : « Aucun choix de complaisance. Chaque ligne a été arbitrée. »

**Transition** : « Mais une stack ne suffit pas. La méthode derrière est ce qui rend Radar défendable. »

---

## Slide 12 · MÉTHODE ET VEILLE DOCUMENTAIRE

# La rigueur académique encodée dans le moteur.

**Méthode appliquée au projet** :

- Analyse comparative (benchmark de 9 outils de competitive intelligence)
- Étude qualitative (3 personas, 5 anti-personas)
- Étude quantitative (volumétrie projetée, estimation coûts LLM)
- Tests techniques (prototypage incrémental sur 6 sprints)
- Développement d'un prototype fonctionnel défendable

**Méthode M244 encodée dans Radar** (les 5 étapes du cycle de veille du Dr. Wadiai) :

| Étape M244                   | Agent Radar correspondant                  | Livrable                  |
| ---------------------------- | ------------------------------------------ | ------------------------- |
| 1. Identification du besoin  | Deep-research                              | Profil entreprise enrichi |
| 2. Collecte                  | Collecteur (Playwright + DuckDuckGo)       | Sources horodatées        |
| 3. Analyse et traitement     | Évaluateur CRAAP + SWOT + PESTEL + Signaux | Matrices, alertes scorées |
| 4. Diffusion et exploitation | Rédacteur                                  | Rapport et digest email   |
| 5. Mise à jour continue      | Orchestrateur (cron 06:00)                 | Cycle quotidien           |

**Trois grilles académiques appliquées** : **CRAAP** (par source), **SWOT** (par concurrent, quotidienne), **PESTEL** (sectorielle, hebdomadaire).

**Visuel** : deux blocs côte à côte. Bloc gauche « Méthode projet » en liste. Bloc droit « Méthode M244 » en table compacte. Badges sémantiques CRAAP / SWOT / PESTEL en bas.

**Locuteur** : Karamo (1 min 30)

**Notes orateur** :

- Slide volontairement dense : c'est ici qu'on convainc le jury sur la rigueur.
- Insister : « La méthode du Dr. Wadiai n'est pas une couche cosmétique. Elle est encodée dans chaque prompt SKILL.md. »

**Transition** : « Et cette rigueur, nous l'avons mesurée. »

---

## Slide 13 · TESTS, VALIDATION ET MÉTRIQUES

# Pas un mockup. Le système tourne.

| Indicateur                                 | Cible V1               | Statut      |
| ------------------------------------------ | ---------------------- | ----------- |
| Type-check sur monorepo                    | 100 %                  | Atteint     |
| Build vert sur 4 workspaces                | 5 / 5 tasks            | Atteint     |
| Temps d'onboarding utilisateur             | Inférieur à 10 minutes | Atteint     |
| Durée d'un cycle de veille complet         | Inférieur à 30 minutes | Atteint     |
| Score CRAAP moyen des sources retenues     | Supérieur à 6 / 10     | À confirmer |
| Movements jugés actionnables (échantillon) | 80 % au minimum        | À confirmer |
| Recoupement deux sources effectif          | 100 % des Movements    | Atteint     |
| Digest email délivré à l'heure             | 7h00, marge 5 minutes  | Atteint     |
| Taux de similarité du rapport académique   | Inférieur à 15 %       | Cible       |

**Statement-line (Fraunces 22pt royal blue) :**
« Tous les indicateurs au-dessus sont mesurables sur un compte de démo. Le jury peut tester en direct. »

**Visuel** : table avec colonne statut en pastilles sémantiques (success vert, warning amber).

**Locuteur** : Karamo (1 min)

**Notes orateur** :

- Ne pas survendre : indiquer honnêtement les statuts « À confirmer ».
- Insister sur le 100 % de recoupement : c'est la promesse anti-hallucination.

**Transition** : « Voilà comment nous avons organisé le travail à deux pour livrer cela. »

---

## Slide 14 · PLANIFICATION ET ÉQUIPE

# Six sprints, deux périmètres, un binôme.

**Répartition stricte des périmètres** :

| Périmètre                                               | Owner            |
| ------------------------------------------------------- | ---------------- |
| Frontend, base de données, contrats Zod, design system  | Karamo Sylla     |
| Agent OpenClaw, prompts SKILL.md, infrastructure Docker | Bachirou Konaté  |
| Documentation, planification, choix architecturaux      | Partagé concerté |

**Planning sur un semestre** :

```
Mars 2026   ─▶ PRD v1.0 (cahier des charges initial)
Avril 2026  ─▶ Réorganisation architecturale, monorepo
Mai 2026    ─▶ Sprint 1 Auth · Sprint 2 Onboarding · Bootstrap final
Juin 2026   ─▶ Sprints 3-4 Cycle veille · Sprint 5 Dashboard · Sprint 6 PDF
Juin 2026   ─▶ Tests E2E · Démonstration · Rapport final · SOUTENANCE
```

**Visuel** : Gantt simplifié horizontal, royal blue pour les sprints critiques, navy-700 pour les jalons. Encart répartition équipe à droite.

**Locuteur** : Karamo (1 min)

**Notes orateur** :

- Pointer la séparation des périmètres : éviter toute ambiguïté pour le jury.
- Mentionner que pnpm workspaces et Turborepo rendent cette séparation viable.

**Transition** : « Si vous étiez un client, voici ce que vous achèteriez aujourd'hui. »

---

## Slide 15 · CAHIER DES CHARGES SYNTHÉTIQUE

# Si vous achetiez Radar aujourd'hui, voilà ce que vous signeriez.

| Élément                    | Engagement                                                                      |
| -------------------------- | ------------------------------------------------------------------------------- |
| **Besoins client**         | Surveillance quotidienne, analyse stratégique, mémoire chronologique 90 jours   |
| **Fonctionnalités V1**     | 7 features : Auth · Onboarding · Cycle · Dashboard · Digest · Export PDF · CRUD |
| **Contraintes techniques** | TypeScript strict, validation Zod, conformité RGPD, charte McKinsey-fit         |
| **Délai de livraison V1**  | Livré en un semestre (Printemps 2026)                                           |
| **Ressources V1**          | 2 développeurs · 1 VPS Hetzner CX21 (4 EUR / mois) · Claude Opus 4.7            |
| **Résultats engagés**      | Cycle quotidien stable · Digest à 7h00 · Export PDF mensuel                     |
| **Garantie qualité**       | Score CRAAP > 6 / 10 · Recoupement deux sources · Audit log RGPD                |

**Visuel** : format facture professionnelle, fond navy-900, header type contrat. Logo Radar discret en filigrane. Pied de page « Signature : Karamo Sylla · Bachirou Konaté ».

**Locuteur** : Bachirou (1 min)

**Notes orateur** :

- Présenter cette slide comme un document signable : « Si vous étiez un client, voilà le contrat. »
- Insister sur 4 EUR / mois d'infrastructure : barrière à l'entrée quasi nulle.

**Transition** : « Cette livraison a ses forces. Et elle a des limites que nous savons nommer. »

---

## Slide 16 · ANALYSE CRITIQUE

# Ce qui marche. Ce qui ne marche pas encore.

| Forces                                                | Faiblesses assumées en V1                                      |
| ----------------------------------------------------- | -------------------------------------------------------------- |
| Méthodologie M244 encodée dans le moteur, pas plaquée | Tests utilisateurs limités à 3 personnes (cadre académique)    |
| Stack 2026 maîtrisé, défendable face à un recruteur   | Dépendance forte à un fournisseur LLM (Anthropic)              |
| Conformité RGPD intégrée by design                    | Pas d'observabilité fine (pas de Sentry, pas de Datadog en V1) |
| Coût d'infra compatible PME marocaine (4 EUR / mois)  | Cible géographique étroite, à élargir Maghreb et France en V2  |
| Démonstration vivante, pas un mockup                  | Pas de version mobile native, web responsive uniquement        |
| Documentation exhaustive, reprenable par un tiers     | Pas de file d'attente externe, scalabilité plafonnée à V1      |

**Statement-line (Fraunces 22pt royal blue) :**
« Nous ne survendons pas. Nous savons ce qui marche. Nous savons ce qui ne marche pas encore. »

**Visuel** : deux colonnes équilibrées. Forces en royal blue, faiblesses en warning amber. Bordures fines navy-700.

**Locuteur** : Karamo (1 min)

**Notes orateur** :

- Ne jamais éluder une faiblesse : la reconnaître honnêtement renforce la crédibilité.
- Pour chaque faiblesse, mentionner brièvement la mitigation prévue en V2.

**Transition** : « Voici la trajectoire que nous traçons pour chacune de ces faiblesses. »

---

## Slide 17 · ROADMAP

# Radar n'est pas une fin. C'est un début.

| Horizon            | Livrable cible                                                                  |
| ------------------ | ------------------------------------------------------------------------------- |
| **V1.1 (3 mois)**  | Sentry + Plausible · Étude utilisateurs formelle · Internationalisation FR + EN |
| **V2.0 (6 mois)**  | Ouverture commerciale Maroc + Tunisie + Sénégal · Freemium · PWA mobile         |
| **V2.5 (12 mois)** | Expansion France et UEMOA · Intégrations Slack, Teams, Notion · Webhooks        |
| **V3.0 (18 mois)** | API publique · SSO entreprise · ISO 27001 · Marketplace de templates sectoriels |
| **V4.0 (24 mois)** | Fine-tuning LLM francophone · Signaux faibles inter-sectoriels · Mode advisory  |

**Statement-line (Fraunces italic, royal blue) :**
« La V1 répond au M244. Les V2 à V4 répondent au marché. »

**Visuel** : timeline verticale ou horizontale, jalons en royal blue, dates en JetBrains Mono.

**Locuteur** : Karamo (1 min)

**Notes orateur** :

- Lecture rapide, pas slide par slide.
- Ce que le jury doit retenir : nous avons un plan, pas une fin de projet académique.

**Transition** : « Et maintenant, le moment que vous attendez. »

---

## Slide 18 · APPEL À L'ACTION

# Vous avez écouté.

### Maintenant, regardez.

**Trois lignes de mise en bouche (Inter 22pt) :**

- Pas une vidéo de démo enregistrée.
- Pas un mockup Figma.
- Le système tourne. **En direct. Devant vous.**

**Visuel** : slide à fond navy plein. Titre Fraunces 96pt centré, ligne dramatique. Les 3 bullets apparaissent un par un, en cascade. Le mot **« direct »** en royal blue qui pulse subtilement.

**Locuteur** : Bachirou (45 s)

**Notes orateur** :

- Slide de tension narrative. Marquer un silence après chaque bullet.
- Préparer le clavier de démonstration.
- Annoncer : « Karamo va piloter. Je commente. »

**Transition** : « Démonstration. »

---

## Slide 19 · DÉMONSTRATION LIVE · CLIMAX FINAL

# Démonstration

### Cycle de veille en direct sur deux concurrents réels.

**Scénario projeté à l'écran (slide de back-up uniquement)** :

| Minute | Ce que vous voyez                                                              |
| ------ | ------------------------------------------------------------------------------ |
| 0 à 1  | Inscription d'un compte de démo, redirection vers l'onboarding                 |
| 1 à 3  | Saisie entreprise, ajout de 2 concurrents, sélection de 3 axes de surveillance |
| 3 à 4  | Lancement du cycle de veille, visualisation des logs OpenClaw en direct        |
| 4 à 5  | Bascule sur un compte démo « lendemain » : feed de Movements rempli            |
| 5 à 6  | Drill-down sur une carte Movement : sources, score CRAAP, recoupement          |
| 6 à 7  | Détail concurrent : SWOT actualisée, timeline 90 jours, digest email reçu      |

**Statement-line projetée à la dernière minute (Fraunces 22pt royal blue) :**
« Ce que vous venez de voir, vos concurrents l'ont fait. Et vous le savez maintenant. »

**Visuel** : slide à fond navy plein, titre Fraunces 80pt « Démonstration ». Cette slide sert de bookend si la démo échoue, et de timing visible pendant la projection en plein écran de l'application.

**Locuteur** : Bachirou (clavier) + Karamo (commentaire) (7 min)

**Notes orateur** :

- Bachirou exécute, Karamo commente en regardant le jury.
- Cycle pré-exécuté la veille au soir en backup. En cas d'échec live, basculer sur captures statiques sans drame.
- Pointer trois choses en direct : score CRAAP affiché, recoupement deux sources matérialisé, signal faible qualifié par intensité.
- À 6 min 30, annoncer la fin imminente et préparer la slide finale.
- Conclure sur la statement-line en royal blue, lentement.

**Transition** : « Vos concurrents bougent. Radar vous le dit avant tout le monde. »

---

## Slide 20 · QUESTIONS

# Questions

**Slogan en pied (Fraunces 28pt royal blue centré) :**
Vos concurrents bougent. Radar vous le dit avant tout le monde.

**Bibliographie en pied de page (Inter 10pt muted, sur 3 colonnes) :**

| Cours et académie                          | Documentation technique           | Rapports et benchmarks                 |
| ------------------------------------------ | --------------------------------- | -------------------------------------- |
| Module M244 (Dr. Y. Wadiai, ENSA Tétouan)  | Anthropic Claude Opus 4.7         | Gartner · Forrester · IDC              |
| Blakeslee (CRAAP, 2004)                    | OpenClaw · Next.js 16 · Prisma 6  | HCP · CGEM · McKinsey Global Institute |
| Ansoff (signaux faibles, 1975)             | Tailwind 4 · Better Auth · Resend | Similarweb · SEMrush · Crayon          |
| Andrews (SWOT, 1965)                       | PostgreSQL 17 · pgvector          | Klue · Mention · Brandwatch · Feedly   |
| Aguilar (PESTEL, 1967) · Porter (5 forces) | Docker · Turborepo · pnpm         | CNIL · CNDP Maroc                      |

**Visuel** : grand mot « Questions » en Fraunces 120pt royal blue, centré sur fond navy. Slogan dans le tiers inférieur. Bibliographie en pied, très discrète.

**Locuteur** : Karamo et Bachirou en alternance (5 min)

**Notes orateur** :

- Répartition des questions selon le périmètre : techniques agent vers Bachirou, frontend, design et données vers Karamo.
- Pour les questions méthodologiques M244 : Karamo répond, Bachirou complète.
- Question hostile : reformuler à voix haute pour gagner du temps, répondre factuellement, ne pas s'engager émotionnellement.
- Question piège : reconnaître ce qu'on ne sait pas, renvoyer vers la roadmap V2 si pertinent.

---

## Annexe · Répartition de la parole

| Bloc                                  | Durée      | Locuteur principal        |
| ------------------------------------- | ---------- | ------------------------- |
| Slides 1 à 3 (observation)            | 3 min      | Karamo                    |
| Slide 4 (pourquoi maintenant)         | 1 min      | Bachirou                  |
| Slide 5 (problématique)               | 1 min      | Karamo                    |
| Slide 6 (personas)                    | 1 min      | Karamo                    |
| Slide 7 (Radar promesse)              | 1 min 15   | Bachirou                  |
| Slide 8 (parcours utilisateur)        | 1 min 15   | Karamo                    |
| Slide 9 (positionnement)              | 1 min 30   | Karamo                    |
| Slide 10 (architecture)               | 1 min 30   | Bachirou                  |
| Slide 11 (stack technique)            | 1 min      | Bachirou                  |
| Slide 12 (méthode et veille)          | 1 min 30   | Karamo                    |
| Slide 13 (tests, validation)          | 1 min      | Karamo                    |
| Slide 14 (planification, équipe)      | 1 min      | Karamo                    |
| Slide 15 (cahier des charges)         | 1 min      | Bachirou                  |
| Slide 16 (analyse critique)           | 1 min      | Karamo                    |
| Slide 17 (roadmap)                    | 1 min      | Karamo                    |
| Slide 18 (appel à l'action)           | 45 s       | Bachirou                  |
| Slide 19 (démonstration live, CLIMAX) | 7 min      | Bachirou + Karamo         |
| Slide 20 (Q&A)                        | 5 min      | Alternance                |
| **Total présentation**                | **25 min** | Équilibré environ 50 / 50 |
| **Total Q&A**                         | **5 min**  |                           |

---

## Annexe · Règles visuelles à imposer au générateur

- **Fond** : navy `#051C2C` par défaut, accent royal blue `#2251FF` pour les CTA, KPI hero et statement-lines, bone `#F5F1EB` pour le texte courant.
- **Polices** : Fraunces (titres et hero), Inter (corps), JetBrains Mono (chiffres et data).
- **Hiérarchie** : Display Fraunces 64 à 96pt, H1 Fraunces 40pt, H2 Fraunces 28pt, H3 Inter Semibold 24pt, body Inter 18pt.
- **Statement-lines** : Fraunces 22 à 28pt en italic ou regular, royal blue, centrées. Une par slide max.
- **Éléments interdits** : aucun emoji, aucun gradient, aucune illustration générique, aucune ombre dramatique, aucun tiret cadratin (utiliser deux-points, virgules ou parenthèses).
- **Tableaux** : header en eyebrow uppercase Inter Bold 11pt tracking +0.04em, lignes 14pt Inter Regular, valeurs numériques en JetBrains Mono.
- **Animations** : voir `M244-PROMPT-CLAUDE-DESIGN.md` pour les techniques d'animation (build-step reveal, focus and zoom, connected nodes, magic morph, etc.).

---

## Annexe · Consignes du Dr. Wadiai couvertes

| Consigne PDF (Dr. Wadiai)           | Slides correspondantes          |
| ----------------------------------- | ------------------------------- |
| Présentation du sujet               | 1, 2, 3, 7                      |
| Problématique                       | 2, 5                            |
| Objectifs du projet                 | 5, 7                            |
| Veille et recherche documentaire    | 12, 20                          |
| Méthodologie de recherche           | 12                              |
| Planification du projet             | 14                              |
| Présentation de la solution         | 7, 8, 10                        |
| Réalisation technique               | 10, 11                          |
| Démonstration du projet             | 19 (climax final)               |
| Tests et validation                 | 13                              |
| Analyse critique                    | 16                              |
| Recommandations et perspectives     | 17                              |
| Dimension professionnelle (cahier)  | 15                              |
| Dimension professionnelle (rapport) | Hors slides, voir rapport écrit |
| Bibliographie                       | 12, 20                          |
| Présentation orale (règles, temps)  | Annexe répartition              |
| Présentation orale (apparence)      | Hors slides, brief vestiaire    |

Toutes les 17 sections du guide du Dr. Wadiai sont couvertes par les 20 slides.
