# PRD COMPLET · RADAR

> **Version** : 2.1 (Bloc 2 livré)
> **Statut** : En cours de rédaction, blocs en cours de validation
> **Date** : Mai 2026
> **Projet** : Module M244 (Veille Technologique), ENSA Tétouan, Cycle Ingénieur BDIA
> **Auteurs** : Karamo Sylla & Bachirou Konaté
> **Encadrant** : Pr. Younes Wadiai
> **Session** : Printemps 2026

---

## CHANGELOG

| Version | Date | Changement | Détail |
|---------|------|------------|--------|
| v1.0 | Mars 2026 | Création initiale | Cahier des charges 9 pages : contexte, vision, ancrage M244, personas, fonctionnalités MVP, stack |
| v2.0 | Mai 2026 | Refonte complète | Élargissement du périmètre vers PRD ingénieur complet : architecture, données, API, UI/UX, règles métier, coûts, phasage. Cycle de veille aligné sur le cours (5 étapes vs 6). Persona consultant ajouté. |
| v2.1 | Mai 2026 | Bloc 2 livré | Sections 6 à 9 ajoutées : architecture du système OpenClaw (orchestrateur, sous-agents, queue, cron, observabilité), spécifications fonctionnelles MVP F1 à F7, modèle de données Prisma complet (20 entités) et catalogue d'endpoints API REST. Réalignement explicite du modèle de données sur le produit "monitoring continu" (vs ancien scaffold "rapport one-shot"). |
| v2.2 | Mai 2026 | Refonte architecture moteur agent | OpenClaw utilisé comme service autonome (image Docker officielle) a la place d'un wrapper Fastify custom. Les 8 agents sont des SKILL.md (markdown) et non des modules TypeScript. Suppression de pg-boss, node-cron, Tavily, Playwright. Communication agent → web via POST /api/internal/* (HTTP interne Docker) a la place des webhooks HMAC. DuckDuckGo comme provider web_search natif. Ajout d'un 8e agent : orchestrateur (coordonne le pipeline, ne fait aucune tache propre). Section 6 mise a jour en consequence. |

---

## TABLE DES MATIÈRES

1. [Contexte du projet](#1-contexte-du-projet)
2. [Vision produit](#2-vision-produit)
3. [Ancrage académique M244](#3-ancrage-académique-m244)
4. [Personas utilisateurs](#4-personas-utilisateurs)
5. [Parcours utilisateur](#5-parcours-utilisateur)
6. [Architecture du système (Engine OpenClaw)](#6-architecture-du-système-engine-openclaw)
7. [Spécifications fonctionnelles MVP (F1-F7)](#7-spécifications-fonctionnelles-mvp-f1-f7)
8. [Architecture des données (Prisma + ERD)](#8-architecture-des-données-prisma--erd)
9. [Endpoints API](#9-endpoints-api)
10. *Exigences UI/UX (Intel Dark) · à venir bloc 3*
11. *Authentification & autorisations · à venir bloc 3*
12. *Règles métier · à venir bloc 3*
13. *Contraintes techniques · à venir bloc 3*
14. *Stack technique (avec alternatives rejetées) · à venir bloc 4*
15. *Estimation des coûts · à venir bloc 4*
16. *Phasage de l'implémentation · à venir bloc 4*
17. *Indicateurs de succès · à venir bloc 4*
18. *Roadmap V2+ · à venir bloc 4*
19. *Checklist pré-implémentation · à venir bloc 5*

---

## 1. CONTEXTE DU PROJET

### 1.1 Résumé exécutif

**Radar** est un outil de veille concurrentielle propulsé par un agent IA autonome (OpenClaw) qui surveille quotidiennement les concurrents d'une entreprise, explore le web, et détecte les mouvements stratégiques (changements de prix, lancements produits, recrutements, levées de fonds, campagnes marketing) pour les transformer en rapports de veille actionnables enrichis d'analyses stratégiques automatisées (SWOT, PESTEL, signaux faibles).

Contrairement aux outils de veille classiques qui se contentent d'agréger des actualités publiées, Radar s'appuie sur un moteur d'agent IA complet capable de naviguer, comprendre et analyser le web comme un humain le ferait, avec la puissance d'analyse d'un grand modèle de langage. La méthodologie de veille enseignée dans le module M244 est codée directement dans les prompts de l'agent et structure chaque rapport généré, ce qui transforme un cours académique en un produit fonctionnel.

### 1.2 Problème à résoudre

Les entreprises surveillent leurs concurrents de manière manuelle et fragmentée. La direction générale ou le responsable stratégie consacre une heure ou deux par jour à :

- naviguer sur les sites concurrents (pages produit, presse, équipe, carrières),
- scroller LinkedIn et Twitter sans méthodologie structurée,
- lire la presse économique et les blogs sectoriels en diagonale,
- recevoir des alertes Google Alerts trop bruyantes pour être actionnables,
- consigner ce qu'il en retient dans un fichier Excel ou un Google Doc sans structure analytique.

Ce dispositif présente cinq défaillances opérationnelles documentées :

| Défaillance | Conséquence business |
|---|---|
| Découverte tardive des mouvements concurrents (souvent via la presse, après les faits) | Perte d'avantage temporel sur la décision (pricing, positionnement, recrutement) |
| Absence de méthode d'évaluation des sources | Mélange d'informations fiables et de rumeurs, biais de confirmation |
| Pas de synthèse structurée (ni SWOT, ni PESTEL) | Impossibilité de raisonner sur les axes stratégiques, décisions à l'intuition |
| Signaux faibles ignorés par manque de temps et de croisement | Tendances émergentes manquées (un concurrent prépare un pivot, on ne le voit pas venir) |
| Pas de mémoire centralisée et chronologique | Reconstruction laborieuse de l'historique d'un concurrent à chaque revue stratégique |

Le problème fondamental n'est pas un manque d'information. L'information est publique et abondante. Le problème est un **manque de méthode et d'automatisation**. Personne dans une PME n'a le temps de collecter, recouper, analyser et synthétiser quotidiennement ce que font cinq ou dix concurrents.

### 1.3 Solution proposée

Radar déploie un agent IA autonome qui prend en charge l'intégralité du cycle de veille :

- **Comprend le contexte business de l'utilisateur** via un Deep Research automatique à l'onboarding (l'utilisateur fournit nom et site web, l'agent explore le web pour enrichir le profil).
- **Surveille activement les concurrents** chaque matin à 6h : exploration des sites concurrents (actualités, produits, carrières, pricing, équipe), réseaux sociaux pertinents, presse économique sectorielle.
- **Évalue chaque source** selon la grille CRAAP (Currency, Relevance, Authority, Accuracy, Purpose) avant d'intégrer l'information dans un rapport.
- **Recoupe l'information** : aucune alerte ne remonte sans validation par au minimum deux sources indépendantes.
- **Génère des analyses stratégiques structurées** : grille SWOT par concurrent mise à jour quotidiennement, grille PESTEL sectorielle mise à jour hebdomadairement, détection de signaux faibles par accumulation glissante sur 30 jours.
- **Livre des rapports actionnables** dans un dashboard avec scoring de pertinence, timeline 90 jours, et digest email quotidien ou hebdomadaire.

### 1.4 Marché cible et positionnement

| Critère | Valeur |
|---|---|
| Géographie V1 | Maroc (cohérent avec le contexte ENSA Tétouan, cible PME locales) |
| Géographie V2 | Maghreb francophone, expansion UEMOA puis France |
| Segments prioritaires | PME 10 à 100 salariés, startups en levée, cabinets de conseil indépendants, étudiants en stratégie |
| Secteurs | Agnostique (le moteur ne dépend pas du secteur, seuls les concurrents et axes de surveillance changent) |
| Utilisateurs types | Dirigeants, responsables stratégie, business developers, consultants, étudiants Master en stratégie |

### 1.5 Différenciation versus alternatives

Le marché de la veille concurrentielle est dominé par des outils internationaux coûteux et orientés grands comptes. Radar se positionne sur trois différenciateurs structurels.

| Aspect | Outils existants (Similarweb, SEMrush, Crayon) | Radar |
|---|---|---|
| Cœur métier | Métriques de trafic web et SEO | Détection de mouvements stratégiques tous axes |
| Méthodologie | Aucune méthodologie de veille explicite | Cycle de veille M244 codé dans l'agent, grille CRAAP par source |
| Analyse | Tableaux de bord de métriques | Analyses SWOT et PESTEL générées et mises à jour automatiquement |
| Signaux faibles | Non détectés | Détection algorithmique par croisement multi-sources sur fenêtre glissante |
| Tarif | À partir de 100 USD par mois et par utilisateur | Gratuit (projet académique, pas de monetization V1) |
| Cible | Grands comptes, agences SEO | PME, étudiants, consultants indépendants |

Radar ne se positionne pas comme un substitut à Similarweb ou SEMrush sur le SEO. Il occupe un segment distinct : la **veille concurrentielle stratégique méthodologique**, c'est-à-dire la production automatisée de rapports utilisables tels quels en comité de direction ou en livrable de mission de conseil.

---

## 2. VISION PRODUIT

### 2.1 Proposition de valeur

> **Vos concurrents bougent. Radar vous le dit avant tout le monde.**

Radar déploie un agent IA qui surveille quotidiennement vos concurrents (leurs sites web, leurs actualités, leurs recrutements, leurs prix) et vous livre chaque matin un rapport de veille structuré avec des analyses SWOT et PESTEL générées automatiquement, des signaux faibles identifiés et des recommandations d'action.

**Formule canonique :** Nous aidons les entreprises à anticiper les mouvements de leurs concurrents en déployant un agent IA autonome qui surveille quotidiennement le web, applique la méthodologie de veille stratégique, et livre des rapports actionnables sans intervention humaine.

### 2.2 Bénéfices clés

| Bénéfice | Description |
|---|---|
| Anticiper plutôt que réagir | L'agent détecte les mouvements concurrents avant qu'ils ne soient relayés par la presse |
| Zéro effort de configuration | Saisie du nom et du site web suffisent, le Deep Research enrichit le reste automatiquement |
| Analyses stratégiques automatiques | SWOT et PESTEL générés par l'IA pour chaque concurrent et secteur, mis à jour à chaque cycle |
| Méthodologie académique intégrée | Le cycle de veille du module M244 est le moteur du produit, pas une couche cosmétique |
| Signaux faibles détectés | L'IA identifie les tendances émergentes que la veille manuelle rate par manque de temps |
| Traçabilité par CRAAP | Chaque information remontée s'appuie sur des sources évaluées et recoupées, pas sur des rumeurs |

### 2.3 North Star Metric

La métrique unique qui capture la valeur livrée par Radar est le **nombre de mouvements concurrents détectés et validés (deux sources minimum) par utilisateur actif et par semaine**. Cette métrique reflète à la fois la qualité de la couverture (assez de mouvements détectés), la rigueur méthodologique (validés par recoupement) et la fidélité de l'utilisateur (consultation hebdomadaire).

Cible V1 (académique) : 10 mouvements validés par utilisateur actif et par semaine.
Cible V2 (commerciale) : 20 mouvements validés par utilisateur actif et par semaine, avec score CRAAP moyen supérieur à 7 sur 10.

### 2.4 Anti-vision

Pour éviter les dérives produit, voici ce que **Radar n'est pas** et ne deviendra pas en V1 :

- **Pas un outil de SEO ou d'analyse de trafic web.** Similarweb et SEMrush couvrent ce besoin.
- **Pas un CRM ni un outil de prospection commerciale.** Détecteur (projet sœur IA5D) couvre la veille commerciale ciblée par signaux business.
- **Pas un agrégateur de flux RSS.** Feedly couvre ce besoin.
- **Pas un outil de social listening pur.** Mention et Brandwatch couvrent ce besoin.
- **Pas un outil de veille brevet ou veille scientifique.** Espacenet et Google Scholar couvrent ces besoins.
- **Pas un outil de veille sectorielle généraliste.** Le périmètre est strictement la surveillance des concurrents nommés par l'utilisateur.

---

## 3. ANCRAGE ACADÉMIQUE M244

### 3.1 Positionnement pédagogique

Radar n'est pas un projet de génie logiciel auquel on aurait ajouté a posteriori une couche de vocabulaire de veille. La méthodologie enseignée dans le module M244 (Veille Technologique) du Pr. Younes Wadiai est le **moteur du produit**. Elle est codée dans les prompts de l'agent IA, elle structure chaque rapport généré, elle conditionne le comportement de l'orchestrateur de cycles. Sans cette méthodologie, Radar ne serait qu'un scraper de sites concurrents. Avec elle, Radar devient un **dispositif de veille opérationnel**, au sens du Chapitre 1 du cours.

Le projet est conçu pour servir trois objectifs simultanément :

1. Valider le module M244 par la production d'un livrable qui démontre la maîtrise des concepts du cours (cycle de veille, grilles d'analyse, évaluation des sources, détection de signaux faibles).
2. Produire un outil utilisable que les étudiants en stratégie, les dirigeants de PME et les consultants peuvent réellement déployer pour leur veille.
3. Constituer une pièce de portfolio défendable pour les auteurs (Karamo Sylla et Bachirou Konaté), pertinente pour les recruteurs en stratégie, en data ou en IA appliquée.

### 3.2 Concepts M244 intégrés

| Concept M244 (référence cours) | Intégration dans Radar |
|---|---|
| Cycle de veille en 5 étapes (Chapitre 1) | Chaque cycle quotidien suit les 5 étapes du cours : identification des besoins, collecte, analyse et traitement, diffusion et exploitation, mise à jour continue |
| Évaluation des sources, grille CRAAP (Chapitre 3) | Score CRAAP (Currency, Relevance, Authority, Accuracy, Purpose) calculé par l'agent et affiché à côté de chaque source dans les rapports |
| Détection de signaux faibles (Chapitre 1) | L'agent croise les sources mineures (forums, blogs, offres d'emploi) avec les sources majeures sur une fenêtre glissante de 30 jours pour identifier des tendances naissantes |
| Recoupement multi-sources (Chapitre 3) | Chaque alerte remontée à l'utilisateur est validée par au moins deux sources indépendantes avant publication |
| Analyse SWOT (Chapitre 2) | Grille SWOT générée pour chaque concurrent, mise à jour à chaque cycle de veille quotidien |
| Analyse PESTEL (Chapitre 2) | Six dimensions (Politique, Économique, Sociologique, Technologique, Environnemental, Légal) analysées par l'IA hebdomadairement à l'échelle sectorielle |
| Structure d'un rapport de veille (Chapitre 2) | Chaque rapport suit la structure académique : Synthèse exécutive, Méthodologie et collecte, Analyse, Résultats, Recommandations |
| Diffusion structurée (Chapitre 3) | Trois canaux de diffusion alignés : dashboard temps réel, digest email quotidien ou hebdomadaire, export PDF des rapports |

### 3.3 Cycle de veille : 5 étapes appliquées à Radar

Le cours du Pr. Wadiai (Chapitre 1) structure le cycle de veille en cinq étapes. Radar implémente chaque étape comme une phase distincte du pipeline d'OpenClaw, ce qui rend le mapping entre le cours et le produit immédiat et défendable face au jury.

| Étape M244 | Implémentation dans Radar |
|---|---|
| 1. Identification des besoins | Onboarding par Deep Research : l'utilisateur fournit nom et site, l'agent en déduit secteur, ICP, axes de surveillance pertinents. Consigné dans la table CompanyProfile. |
| 2. Collecte | Agent Collecteur d'OpenClaw : exploration quotidienne à 6h des sites concurrents (Playwright), extraction structurée des contenus pertinents (LLM extracteur), stockage des sources horodatées en base. |
| 3. Analyse et traitement | Agent Évaluateur (CRAAP par source) puis Agent Analyste SWOT et Agent Analyste PESTEL. Recoupement multi-sources, classification par axe stratégique, scoring de pertinence. |
| 4. Diffusion et exploitation | Trois canaux : dashboard avec feed d'alertes, digest email Resend, export PDF. Chaque rapport suit la structure académique du Chapitre 2. |
| 5. Mise à jour continue | Cycle quotidien automatique à 6h, MAJ hebdomadaire de la grille PESTEL, détection de signaux faibles par accumulation 30 jours. La veille n'est jamais figée, elle est itérée chaque jour. |

> **Note sur la divergence v1 vs v2 du PRD.** La version 1 du cahier des charges énonçait un cycle en 6 étapes (avec "synthèse" et "décision" séparées). La version 2 ramène cela aux 5 étapes du cours du Pr. Wadiai pour aligner le vocabulaire. La synthèse est intégrée dans l'étape Analyse et traitement (étape 3), et la décision est externalisée à l'utilisateur (étape 4 Diffusion et exploitation, par construction l'étape qui livre les éléments de décision).

### 3.4 Radar comme illustration vivante du cours

Pour un étudiant qui suit le module M244, Radar est la preuve que les concepts de veille stratégique enseignés ne sont pas seulement théoriques. Le produit montre concrètement :

- comment le **cycle de veille** peut être automatisé de bout en bout par un agent IA orchestré,
- comment la **grille CRAAP** peut être calculée programmatiquement à chaque collecte plutôt que renseignée à la main,
- comment les **analyses SWOT et PESTEL** peuvent être générées par un grand modèle de langage et mises à jour en continu sans dégradation de qualité,
- comment les **signaux faibles** peuvent être détectés algorithmiquement par croisement de sources sur une fenêtre temporelle,
- comment la **diffusion** peut être structurée et adaptée au canal (dashboard, email, PDF) sans perte d'information ni rupture méthodologique.

### 3.5 Critères d'évaluation alignés sur le module

La rédaction de ce PRD, le développement du MVP et la soutenance orale sont conçus pour répondre à quatre critères d'évaluation que le jury peut raisonnablement attendre :

1. **Maîtrise des concepts M244** : chaque fonctionnalité du produit doit pouvoir être justifiée par référence à un concept du cours. Aucune fonctionnalité gratuite, aucun gadget technique sans ancrage méthodologique.
2. **Rigueur méthodologique** : la qualité des sources, le recoupement, la traçabilité du score CRAAP, la structure des rapports doivent résister à un examen critique du jury.
3. **Capacité à défendre les choix techniques par référence au cours** : chaque décision technique majeure doit être justifiée doublement, du point de vue ingénieur (performance, coût, maintenabilité) et du point de vue veille (alignement avec le cycle, conformité aux grilles).
4. **Démonstration vivante** : un MVP fonctionnel qui surveille réellement deux ou trois concurrents et produit un rapport en direct devant le jury vaut plus que toute description écrite.

---

## 4. PERSONAS UTILISATEURS

### 4.1 Persona 1 : L'Étudiant Stratégiste

| Attribut | Valeur |
|---|---|
| Profil | Étudiant en Master 2 ou cycle ingénieur, spécialisation stratégie, intelligence économique ou data |
| Contexte | Module de veille stratégique avec projet de fin de module nécessitant un livrable opérationnel |
| Localisation | Maroc (ENSA Tétouan, ESITH, ISCAE), expansion vers les écoles francophones du Maghreb en V2 |
| Compétences techniques | Intermédiaires : sait utiliser un SaaS, lire un dashboard, exporter un PDF, mais ne développe pas |
| Budget | Zéro (étudiant) |

> *Citation représentative :* « On a appris les concepts de veille en cours : cycle, SWOT, PESTEL, signaux faibles. Mais en pratique, faire tout ça manuellement pour un seul concurrent prend une journée entière. Si un outil le faisait automatiquement, on pourrait se concentrer sur l'interprétation et les recommandations. »

**Jobs to Be Done :**

1. Démontrer la maîtrise des concepts M244 dans un projet concret livrable au jury.
2. Produire des analyses concurrentielles de qualité professionnelle utilisables comme cas d'étude.
3. Gagner du temps sur la collecte et la mise en forme pour se concentrer sur l'analyse stratégique.
4. Avoir un projet de portfolio impressionnant pour les premiers entretiens en cabinet de conseil ou en startup.

### 4.2 Persona 2 : Le Dirigeant PME

| Attribut | Valeur |
|---|---|
| Poste | Fondateur, Directeur général, Directeur stratégie |
| Entreprise | PME 10 à 100 salariés |
| Secteur | Variable (Radar est agnostique) |
| Localisation | Maroc, expansion Maghreb francophone en V2 |
| Compétences techniques | Faibles à moyennes : maîtrise les outils SaaS courants (CRM, email, suite Office), pas développeur |
| Objectif | Surveiller ses concurrents sans y passer deux heures par jour, et sans rien manquer de critique |

> *Citation représentative :* « Je sais que mes concurrents bougent : ils changent leurs prix, recrutent, lancent des produits. Mais je le découvre toujours trop tard, par hasard, en scrollant LinkedIn. J'ai besoin d'un radar qui me dit chaque matin ce qui a changé chez eux. »

**Jobs to Be Done :**

1. Être alerté dès que quelque chose change chez un concurrent suivi, dans la matinée et pas trois semaines après.
2. Avoir une vue d'ensemble synthétique des stratégies concurrentielles, sans se perdre dans le détail.
3. Prendre des décisions informées (pricing, hiring, positionnement, communication) basées sur des données fraîches et recoupées.
4. Ne pas dépendre de sa mémoire ni du bouche-à-oreille, mais d'un historique consultable.

### 4.3 Persona 3 : Le Consultant indépendant

| Attribut | Valeur |
|---|---|
| Poste | Consultant en stratégie, indépendant ou en cabinet de moins de 10 personnes |
| Profil | 5 à 15 ans d'expérience, ex-grand cabinet ou ex-corporate stratégie, aujourd'hui à son compte |
| Mission type | Audit concurrentiel, étude de positionnement, business plan d'entrée sur un marché |
| Localisation | Casablanca, Rabat, Tunis, Dakar, Paris (cible francophone élargie en V2) |
| Compétences techniques | Moyennes : Notion, Slack, suites bureautiques, lecture de dashboards, export et retouche de slides |
| Volume de missions | 3 à 8 missions actives en parallèle, durée 2 à 6 semaines chacune |

> *Citation représentative :* « Pour chaque mission, je passe les deux premières semaines à comprendre l'écosystème concurrentiel du client. C'est du temps non facturé qui pèse sur ma marge. Si un outil me livre cette base en 48h, je peux soit gagner du temps, soit prendre plus de missions. »

**Jobs to Be Done :**

1. Accélérer la phase de recherche concurrentielle sur chaque nouvelle mission, qui représente aujourd'hui 20 à 30 pour cent du temps facturable.
2. Produire des livrables clients de qualité homogène, sans dépendre de la disponibilité d'un junior pour la collecte.
3. Maintenir une veille continue sur trois ou quatre comptes clients récurrents (retainer), sans y consacrer une journée par mois.
4. Avoir un historique structuré et exportable des analyses pour pouvoir répondre rapidement aux questions de suivi des clients.

### 4.4 Anti-personas

Radar n'est **pas conçu** pour les profils suivants. Concevoir contre eux protège la cohérence du produit en V1.

| Anti-persona | Pourquoi pas en V1 |
|---|---|
| Acheteur grand compte (CAC 40, OPCVM, multinationale) | Besoin de SLA, conformité ISO, intégrations SSO entreprise. Hors portée d'un MVP académique. |
| Agence SEO / SEM | Cherche des métriques de trafic, positionnement de mots-clés, backlinks. Similarweb et SEMrush couvrent ce besoin, Radar ne se positionne pas dessus. |
| Investisseur en capital risque | Besoin de scouting de startups, de tracking de levées et de signaux deal flow. Pitchbook, Crunchbase, Dealroom couvrent ce besoin. |
| Veille brevets et veille scientifique | Besoin de bases spécialisées (Espacenet, Web of Science), pas de scraping web généraliste. |
| Communication corporate / RP | Besoin de social listening (mentions, sentiment, viralité). Mention, Talkwalker, Brandwatch couvrent ce besoin. |

---

## 5. PARCOURS UTILISATEUR

### 5.1 Vue d'ensemble du parcours principal

Le parcours nominal d'un utilisateur Radar, du premier contact à la routine établie, se décompose en quatre phases.

```
INSCRIPTION (J0, 2 minutes)
  Email + mot de passe, ou Google OAuth
  Vérification email non bloquante
       │
       ▼
ONBOARDING DEEP RESEARCH (J0, 5 à 10 minutes effectives, 30 minutes en arrière-plan)
  Étape 1 : nom de votre entreprise + site web
  Étape 2 : nom de vos 1 à 5 concurrents prioritaires + sites web
  Étape 3 : axes de surveillance retenus parmi les 5 par défaut
       │
       ▼ (en parallèle, en arrière-plan, asynchrone)
DEEP RESEARCH OPENCLAW (30 minutes)
  Enrichissement profil entreprise utilisateur
  Validation et enrichissement des concurrents
  Suggestion d'axes de surveillance pertinents
       │
       ▼
DASHBOARD VIDE AVEC ÉTAT D'ATTENTE (J0)
  Banderole "Premier rapport demain matin à 6h"
  Configuration des notifications email (modal)
       │
       ▼
PREMIER CYCLE DE VEILLE (J1, 6h, automatique)
  OpenClaw lance les 5 sous-agents
  Collecte → Évaluation CRAAP → Analyse SWOT → Analyse PESTEL → Rédaction
  Génération du premier rapport
  Envoi du digest email à 7h
       │
       ▼
PREMIÈRE CONSULTATION (J1, 7h à 9h, moment AHA)
  L'utilisateur reçoit l'email
  Ouvre le dashboard
  Découvre les premiers mouvements détectés et la grille SWOT
       │
       ▼
ROUTINE ÉTABLIE (J+, indéfiniment)
  Cycle quotidien 6h, digest 7h
  MAJ hebdomadaire PESTEL le lundi
  Consultation 5 à 15 minutes par jour
  Export PDF mensuel pour comité de direction ou livrable client
```

### 5.2 Phase 1 : Inscription (J0)

| Champ | Type | Obligatoire | Validation |
|---|---|---|---|
| Nom complet | Texte | Oui | Minimum 2 caractères |
| Email | Email | Oui | Format email valide, unicité dans la base |
| Mot de passe | Password | Oui (sauf OAuth) | Minimum 8 caractères, 1 majuscule, 1 chiffre |
| Bouton Google OAuth | Action | Alternative | Délègue la création de compte à Google |

**Vérification email** : non bloquante. L'utilisateur accède directement à l'onboarding. Une banderole persistante en haut du dashboard demande de vérifier l'email tant que ce n'est pas fait. L'email de vérification est envoyé automatiquement à l'inscription via Resend.

### 5.3 Phase 2 : Onboarding Deep Research (J0, 3 étapes)

L'objectif de l'onboarding est de capturer le contexte business de l'utilisateur en moins de 10 minutes effectives, en déléguant le gros du travail d'enrichissement à l'agent Deep Research d'OpenClaw qui s'exécute en arrière-plan.

**Étape 1, Votre entreprise (obligatoire)**

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Nom de l'entreprise | Texte | Oui | Exemple : "AI5D Consulting" |
| Site internet | URL | Oui en V1 | Exemple : "https://ai5d.consulting" |

Au submit, les données sont stockées en base (CompanyProfile), un agent OpenClaw Deep Research est lancé en arrière-plan pour enrichir le profil (secteur, taille, ville, produits, ICP, mots-clés métier, concurrents potentiellement non listés par l'utilisateur), et l'utilisateur passe immédiatement à l'étape 2 sans attendre.

**Étape 2, Vos concurrents (obligatoire, minimum 1, recommandé 3 à 5)**

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Nom du concurrent | Texte | Oui | Exemple : "Cabinet Roland Berger Maroc" |
| Site internet | URL | Oui en V1 | Exemple : "https://rolandberger.com/ma" |

Interface : formulaire avec bouton "Ajouter un concurrent". Chaque concurrent ajouté apparaît sous forme de card supprimable. Pas de limite supérieure en V1 (on observera l'usage avant de fixer un quota).

**Étape 3, Axes de surveillance (obligatoire, minimum 1, recommandé 3 à 5)**

L'utilisateur sélectionne les axes stratégiques qui l'intéressent parmi les cinq axes par défaut couverts par Radar.

| Axe | Description | Exemples de mouvements détectés |
|---|---|---|
| Recrutements et RH | Embauches stratégiques, pages carrières actives, offres d'emploi | "Cabinet X recrute un Directeur Stratégie senior" |
| Stratégie et direction | Levées de fonds, fusions, nominations, partenariats | "Concurrent Y annonce une levée de 5 M USD" |
| Technologie et innovation | Stack technique exposée, brevets, R&D, blogs techniques | "Concurrent Z migre vers une stack TypeScript full-stack" |
| Présence digitale | Refonte site, campagnes marketing, présence réseaux sociaux | "Concurrent W lance une campagne LinkedIn ciblée" |
| Réglementation et conformité | Certifications obtenues, litiges, registres légaux | "Concurrent V obtient sa certification ISO 27001" |

Interface : grille de cinq cards toggleables on/off, chaque card affiche le nom de l'axe, une icône, une couleur et un exemple. Minimum un axe sélectionné requis.

### 5.4 Phase 3 : Premier cycle de veille (J1, 6h, automatique)

Le premier cycle de veille s'exécute automatiquement la nuit suivant l'onboarding. Aucune action utilisateur n'est requise. Le pipeline OpenClaw orchestré par les sous-agents spécialisés produit, en moins de 30 minutes par concurrent en moyenne, le premier rapport structuré.

| Heure | Étape | Acteur |
|---|---|---|
| 06:00 | Lancement du cron, OpenClaw réveille les 5 sous-agents | Orchestrateur |
| 06:00 à 06:15 | Collecte des sites concurrents et des sources web | Agent Collecteur |
| 06:15 à 06:25 | Évaluation CRAAP par source, filtrage, recoupement | Agent Évaluateur |
| 06:25 à 06:35 | Génération SWOT par concurrent | Agent Analyste SWOT |
| 06:35 à 06:45 | Génération PESTEL sectoriel (le lundi seulement) | Agent Analyste PESTEL |
| 06:45 à 06:55 | Rédaction du rapport structuré (Synthèse, Méthodo, Résultats, Recommandations) | Agent Rédacteur |
| 07:00 | Envoi du digest email via Resend, alertes critiques notifiées | Resend, Webhook OpenClaw |

### 5.5 Phase 4 : Routine établie (J+1 et au-delà)

Une fois le premier rapport reçu et consulté, l'utilisateur entre dans une routine d'utilisation continue.

| Cadence | Action utilisateur | Action système |
|---|---|---|
| Quotidien (matin) | Lecture du digest email, ouverture du dashboard si une alerte critique l'attire | Cycle de veille à 6h, digest à 7h |
| Quotidien (5 à 15 min) | Consultation du feed d'alertes, marquage Sauvegardé / Ignoré, prise de notes | MAJ statuts en base |
| Hebdomadaire (lundi matin) | Consultation de la MAJ PESTEL et de la timeline 90 jours | MAJ PESTEL le dimanche soir |
| Mensuel (selon besoin) | Export PDF d'un rapport ou d'une timeline pour comité de direction ou livrable client | Génération PDF à la demande |
| Trimestriel | Revue des concurrents suivis, ajout / suppression, ajustement des axes | Modification CompanyProfile et liste Competitor |

### 5.6 Le moment "aha"

Le moment où la valeur de Radar devient évidente pour l'utilisateur n'est ni l'inscription, ni l'onboarding, ni même le premier rapport reçu par email. Le moment **aha** est très précisément le second jour d'utilisation, quand l'utilisateur reçoit son deuxième digest et constate que :

- les alertes du jour 2 enrichissent celles du jour 1 sans les répéter (la déduplication fonctionne),
- la grille SWOT a évolué légèrement par rapport à la veille (il y a une vraie continuité analytique),
- un signal faible apparaît, croisé sur deux jours, qu'il n'aurait jamais repéré seul (un concurrent prépare quelque chose).

C'est ce moment précis qui transforme un utilisateur curieux en utilisateur engagé. Le design du parcours, du dashboard et du digest doit converger vers la mise en évidence de cette continuité analytique entre J1 et J2.

---

> **Fin du Bloc 1 · Foundations.** Sections 1 à 5 livrées.

---

## 6. ARCHITECTURE DU SYSTÈME (ENGINE OPENCLAW)

> **Note v2.2** : Cette section a été entièrement mise à jour suite au choix d'utiliser OpenClaw comme service Docker autonome (image officielle `ghcr.io/openclaw/openclaw:latest`) à la place d'un wrapper Fastify custom. Les agents sont désormais des fichiers SKILL.md (markdown), pas des modules TypeScript.

### 6.1 Vue d'ensemble

Radar est composé de trois services Docker qui collaborent pour livrer le cycle de veille.

```
┌────────────────────────────────────────────────────────┐
│                   CLIENT (NAVIGATEUR)                  │
└────────────────────────┬───────────────────────────────┘
                         │ HTTPS
                         ▼
┌────────────────────────────────────────────────────────┐
│              APPS/WEB · NEXT.JS 16 (port 3000)         │
│                                                        │
│  Server Components · API Routes · Server Actions       │
│                                                        │
│  POST /v1/chat/completions ──────────────────────────► │──┐
│  ◄── POST /api/internal/*  (résultats agents)          │  │
│                                                        │  │
│  Prisma ──► PostgreSQL 17                              │  │
└────────────────────────────────────────────────────────┘  │
                                                            │ HTTP interne Docker
┌───────────────────────────────────────────────────────────▼────────┐
│              OPENCLAW GATEWAY (port 18789)                         │
│              ghcr.io/openclaw/openclaw:latest                      │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  workspace/skills/                                          │   │
│  │    orchestrateur/SKILL.md   ← déclenché par Next.js        │   │
│  │         │ sessions_spawn                                    │   │
│  │         ├──► deep-research/SKILL.md  (onboarding only)     │   │
│  │         ├──► collecteur/SKILL.md                           │   │
│  │         ├──► evaluateur/SKILL.md                           │   │
│  │         ├──► analyste-swot/SKILL.md                        │   │
│  │         ├──► analyste-pestel/SKILL.md                      │   │
│  │         ├──► detecteur-signaux-faibles/SKILL.md            │   │
│  │         └──► redacteur/SKILL.md                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  Outils natifs : web_search (DuckDuckGo) · web_fetch · browser    │
│  Cron natif : 06:00 Africa/Casablanca                              │
│  LLM : Claude Opus 4.7 via ANTHROPIC_API_KEY                       │
└────────────────────────────────────────────────────────────────────┘
```

### 6.2 Composants

| Composant | Tech | Responsabilité |
|---|---|---|
| `apps/web` | Next.js 16, React 19, Tailwind 4 | Rendu UI, API publique, auth, déclenchement OpenClaw, routes internes `/api/internal/*` |
| `openclaw` | `ghcr.io/openclaw/openclaw:latest` (port 18789) | Gateway OpenAI-compatible, orchestration des skills, scheduling cron natif, outils web natifs |
| `PostgreSQL 17` | Self-hosted Docker | Source unique de vérité, ecrite par Next.js via Prisma |

### 6.3 Les 8 agents (SKILL.md)

Chaque agent est un fichier `SKILL.md` (markdown + YAML frontmatter) dans `apps/agent/workspace/skills/`. OpenClaw les découvre automatiquement au démarrage.

| # | Agent | Declencheur | Role |
|---|---|---|---|
| 1 | **orchestrateur** | Next.js (cron ou bouton) | Coordonne le pipeline de veille, ne fait aucune tache propre, délègue via `sessions_spawn` |
| 2 | **deep-research** | Next.js (onboarding, une seule fois) | Recherche le profil de l'entreprise utilisateur, POST /api/internal/profil |
| 3 | **collecteur** | Via orchestrateur | `web_search` DuckDuckGo + `web_fetch` sur les concurrents, POST /api/internal/sources |
| 4 | **evaluateur** | Via orchestrateur | Scoring CRAAP de chaque source, POST /api/internal/sources (mise à jour) |
| 5 | **analyste-swot** | Via orchestrateur | SWOT avec profil utilisateur + sources évaluées, POST /api/internal/swot |
| 6 | **analyste-pestel** | Via orchestrateur | PESTEL sectoriel, POST /api/internal/pestel |
| 7 | **detecteur-signaux-faibles** | Via orchestrateur | Signaux faibles (intensité, horizon), POST /api/internal/signaux |
| 8 | **redacteur** | Via orchestrateur | Synthèse narrative finale, POST /api/internal/rapport/termine |

### 6.4 Pipeline du cycle quotidien

```
06:00 ─ Cron OpenClaw déclenche l'orchestrateur
        │
06:00 ─ Next.js peut aussi déclencher via bouton :
        │   POST http://openclaw:18789/v1/chat/completions
        │   { model: "openclaw/default", messages: [{ role: "user",
        │     content: "Lance la veille pour rapportId: X. Profil: {...}" }] }
        │   → Retour immédiat 202, OpenClaw travaille en arrière-plan
        │
06:00 ─ Orchestrateur reçoit le profil utilisateur dans le message
        │
06:00 ─ ÉTAPE 1 : Collecte
        │   sessions_spawn(collecteur, { profil, concurrents })
        │   → web_search DuckDuckGo + web_fetch
        │   → POST /api/internal/sources + POST /api/internal/rapport/progresse
        │   → retourne sources[] à l'orchestrateur
        │
06:15 ─ ÉTAPE 2 : Évaluation CRAAP
        │   sessions_spawn(evaluateur, { sources })
        │   → Score CRAAP, marque rejetée si global < 5/10
        │   → POST /api/internal/sources + POST /api/internal/rapport/progresse
        │   → retourne sourcesEvaluees[] à l'orchestrateur
        │
06:25 ─ ÉTAPE 3 : Analyses
        │   sessions_spawn(analyste-swot, { sourcesEvaluees, profil })
        │   → POST /api/internal/swot + POST /api/internal/rapport/progresse
        │   sessions_spawn(analyste-pestel, { sourcesEvaluees })
        │   → POST /api/internal/pestel
        │   sessions_spawn(detecteur-signaux-faibles, { sourcesEvaluees })
        │   → POST /api/internal/signaux
        │
06:45 ─ ÉTAPE 4 : Rédaction
        │   sessions_spawn(redacteur, { swot, pestel, signaux, sources })
        │   → POST /api/internal/rapport/termine { rapportId, synthese }
        │
        └── En cas d'erreur à toute étape :
            POST /api/internal/rapport/echec { rapportId, erreur }
```

### 6.5 Communications inter-composants

**Next.js → OpenClaw** : HTTP POST sur `http://openclaw:18789/v1/chat/completions` (API OpenAI-compatible). Réseau interne Docker. Retour immédiat 202, traitement asynchrone.

**OpenClaw → Next.js** : Chaque sous-agent POST directement sur les routes internes `http://web:3000/api/internal/*`. Réseau interne Docker. Pas de HMAC, pas de secret (réseau privé).

**Next.js ↔ PostgreSQL** : Via Prisma exclusivement. OpenClaw n'a pas accès direct à la base.

**OpenClaw ↔ Anthropic** : API Anthropic via `ANTHROPIC_API_KEY`. Géré nativement par OpenClaw.

**OpenClaw ↔ Web (recherche)** : Outil natif `web_search` (DuckDuckGo, gratuit, sans clé API) + `web_fetch` pour scraping de pages.

### 6.6 Gestion du contexte LLM et budget tokens

| Agent | Contexte input typique | Output typique |
|---|---|---|
| Deep Research | profil partiel + URL | profil enrichi 8 KB |
| Collecteur | sujet + concurrents | sources[] 8-15 KB |
| Évaluateur CRAAP | 1 source | scores CRAAP 1 KB |
| Analyste SWOT | sources évaluées + profil | matrice SWOT 4 KB |
| Analyste PESTEL | sources évaluées + secteur | matrice PESTEL 6 KB |
| Détecteur signaux faibles | sources 30j | signaux[] 8 KB |
| Rédacteur | tous les outputs | synthèse 16 KB |

Claude Opus 4.7 dispose d'un contexte 200K tokens. Le pipeline séquentiel garantit que l'orchestrateur ne cumule que les résultats de l'étape courante, pas la totalité.

### 6.7 Fiabilité

- **Timeout par sous-agent** : géré nativement par OpenClaw (configurable dans SKILL.md).
- **Erreur** : l'orchestrateur intercepte les erreurs de `sessions_spawn` et appelle `POST /api/internal/rapport/echec`.
- **Idempotence** : chaque `rapportId` est unique (UUID généré par Next.js). Un double déclenchement sur le même `rapportId` est géré côté base (upsert).
- **Sauvegarde progressive** : chaque sous-agent POST ses résultats dès qu'il finit. En cas de crash tardif, les étapes précédentes sont déjà persistées.

### 6.8 Observabilité

| Aspect | Outil V1 |
|---|---|
| Logs structurés | `@radar/shared` logger (Next.js) + logs natifs OpenClaw |
| Progression temps réel | `POST /api/internal/rapport/progresse` après chaque étape |
| Erreurs | `POST /api/internal/rapport/echec` + logs |

### 6.9 Topologie de déploiement

**Développement local** : Docker Compose avec 3 services (postgres + openclaw + web). `apps/agent/workspace/` monté comme volume dans le container OpenClaw.

**Production V1 (self-hosted VPS)** : Même `docker-compose.yml`, 1 VPS Hetzner CX21 (~4 EUR/mois). Les 3 containers sur le même réseau Docker interne.

**Production V2** : `apps/web` sur Vercel, OpenClaw sur un VPS dédié, Postgres sur Neon.

### 6.10 Pourquoi ce choix d'architecture

| Décision | Alternative écartée | Raison |
|---|---|---|
| OpenClaw image officielle | Wrapper Fastify custom | Zero code à maintenir, scheduling/orchestration/sessions_spawn natifs, gain de temps pour la soutenance |
| SKILL.md (markdown) | Modules TypeScript agents | Plus lisible pour jury M244, pas de compilation, modifiable sans redéploiement |
| DuckDuckGo | Tavily | Gratuit, sans clé API, suffisant pour démarrer. Remplacable par Tavily si performances insuffisantes |
| POST /api/internal/* | Webhooks HMAC | Réseau Docker interne = pas besoin de signature. Karamo utilise Prisma directement, pas de couche intermédiaire |
| Pas de pg-boss | pg-boss | OpenClaw gère le cron et la persistance des sessions nativement. Ajouter pg-boss = complexité sans gain |

| Décision | Alternative écartée | Raison |
|---|---|---|
| Agent dans un service séparé (`apps/agent`) | Tout dans Next.js avec Server Actions | Cycles de 30 minutes incompatibles avec le timeout serverless typique. Service Node dédié, scalable indépendamment, isolé des plantages web. |
| Queue `pg-boss` (Postgres) | BullMQ + Redis | V1 mono-VPS : ajouter Redis = 1 service de plus à opérer pour zéro gain. `pg-boss` fait 90% du job sans nouvelle dépendance. Migration BullMQ possible en V2 si volumétrie l'exige. |
| 7 sous-agents discrets | 1 méga-prompt avec function calling | Traçabilité : chaque sous-agent est testable et évaluable isolément (critique pour la soutenance M244). Coût : un méga-prompt aurait un contexte explosif et un debugging cauchemardesque. |
| Webhooks signés HMAC | gRPC ou tRPC entre web et agent | HTTP + JSON est universel, debuggable avec curl, pas de génération de stubs. HMAC suffit pour V1 (pas multi-tenant). tRPC envisageable plus tard si besoin de typage cross-service end-to-end. |
| Postgres comme stockage des jobs ET du métier | Stockage métier + queue Redis séparés | Une seule transaction possible entre métier et job (ex : créer un Cycle et enqueuer son job atomiquement). Simplification ops majeure en V1. |
| Anthropic Claude (pas OpenAI ni Mistral) | GPT-4.1 / Mistral Large | Opus 4.7 supérieur sur tâches d'analyse longue (contexte 200K), prompt caching mature, budgétairement compétitif sur cette charge. Cours M244 et grilles d'analyse francophones bien gérés. |

---

## 7. SPÉCIFICATIONS FONCTIONNELLES MVP (F1-F7)

### 7.1 Vue d'ensemble

Le MVP V1 livre 7 fonctionnalités. Elles couvrent l'intégralité du parcours décrit en section 5 et constituent la **surface minimale défendable** devant le jury M244.

| ID | Nom | Priorité | Sprint cible | Owner |
|---|---|---|---|---|
| F1 | Authentification et gestion compte | Must | 1 | Karamo |
| F2 | Onboarding Deep Research | Must | 2 | Karamo + Bachirou |
| F3 | Cycle de veille quotidien automatique | Must | 3-4 | Bachirou |
| F4 | Dashboard et feed d'alertes | Must | 5 | Karamo |
| F5 | Digest email quotidien et hebdomadaire | Must | 5 | Karamo |
| F6 | Export PDF d'un rapport | Should | 6 | Karamo |
| F7 | Gestion entreprise / concurrents / axes (CRUD) | Must | 1-2 | Karamo |

### 7.2 F1 : Authentification et gestion compte

**Description.** Permettre à un utilisateur de créer un compte (email + mot de passe ou Google OAuth), de se connecter, de réinitialiser son mot de passe, de vérifier son email et de supprimer son compte (RGPD).

**User stories.**
- En tant que visiteur, je peux créer un compte en moins de 30 secondes pour accéder à Radar.
- En tant qu'utilisateur, je peux me connecter via Google en un clic pour éviter le mot de passe.
- En tant qu'utilisateur, je peux réinitialiser mon mot de passe oublié via un lien email.
- En tant qu'utilisateur, je peux supprimer mon compte et toutes mes données associées en moins de 7 jours (conformité RGPD).

**Critères d'acceptation.**
- Inscription email + password : validation côté client (Zod) + serveur (Zod). Mot de passe ≥ 8 caractères avec 1 majuscule et 1 chiffre. Hash Argon2id (memory 64 MB, iterations 3, parallelism 1).
- Google OAuth : provider configuré via `NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID` et secret côté serveur.
- Email de vérification envoyé via Resend dans la minute suivant l'inscription. Lien valable 24h.
- Vérification email **non bloquante** : l'utilisateur accède à l'onboarding sans avoir cliqué le lien. Une banderole persistante l'invite à le faire tant que `User.emailVerifiedAt` est null.
- Reset password : token random 256 bits, valable 1h, à usage unique, stocké hashé en BD.
- Suppression compte : soft-delete immédiat (`User.deletedAt`), purge dure des données dans un job `user.purge` exécuté à T+7 jours (fenêtre de retour en arrière).

**Dépendances.** Schéma `User`, `Account`, `Session`, `VerificationToken` (section 8). Lib auth : `Better-Auth` (choisi pour son support natif Next.js 16 App Router, OAuth simple, sessions DB-backed sans cookie d'opacité).

### 7.3 F2 : Onboarding Deep Research

**Description.** Capturer le contexte business de l'utilisateur en 3 étapes (entreprise, concurrents, axes) en moins de 10 minutes, et déclencher en arrière-plan un Deep Research d'enrichissement qui livre un profil exploitable au premier cycle.

**User stories.**
- En tant que nouvel utilisateur, je veux saisir mon entreprise et mes 3 à 5 concurrents en quelques minutes pour démarrer la veille.
- En tant que nouvel utilisateur, je veux que Radar enrichisse automatiquement mon profil et celui des concurrents (secteur, ICP, mots-clés) sans que je le saisisse manuellement.
- En tant que nouvel utilisateur, je veux pouvoir choisir mes axes de surveillance parmi des options recommandées.

**Critères d'acceptation.**
- Étape 1 : formulaire `name + url` validé (Zod URL), persisté en `CompanyProfile`. Au submit, job `deep-research.company` enqueué. UI passe à l'étape 2 sans attendre.
- Étape 2 : ajout itératif de concurrents (cards). Min 1, max 10 en V1 (limite explicite). Chaque ajout enqueue un job `deep-research.competitor`. URL validée. Suppression d'un concurrent en V1 = soft-delete (`Competitor.deletedAt`).
- Étape 3 : grille de 5 cards toggleables (les 5 axes par défaut). Min 1 axe actif requis. Sélection persistée en `CompetitorAxis` pour chaque concurrent (par défaut tous les axes activés sont appliqués à tous les concurrents).
- Le Deep Research enrichit `CompanyProfile` (sector, sizeBand, ICP, keywords, suggestedCompetitors[]) et chaque `Competitor` (sector, sizeBand, foundedYear, headquartersCity, primaryProducts[]). Les champs sont nullables : si l'agent ne trouve rien, le champ reste vide sans bloquer.
- Au terme du Deep Research, un toast UX informe l'utilisateur : "Profil enrichi automatiquement, premier rapport demain à 6h".
- Si le Deep Research échoue (timeout 5min, erreur LLM), l'onboarding **n'est pas bloqué** : le profil reste minimal, le cycle quotidien fonctionne avec ce qu'il a, un retry automatique est planifié à H+6.

**Dépendances.** F1 (auth), F7 (CRUD entités), agent Deep Research (section 6.3 #1).

### 7.4 F3 : Cycle de veille quotidien automatique

**Description.** Exécuter chaque jour à 06:00 le pipeline complet (Collecte → Évaluation → Analyses → Rédaction → Diffusion) pour chaque utilisateur actif, et persister les résultats dans le modèle de données pour consultation web et email.

**User stories.**
- En tant qu'utilisateur, je veux qu'un rapport frais soit prêt chaque matin à 7h sans aucune action de ma part.
- En tant qu'utilisateur, je veux que le rapport couvre tous mes concurrents et tous mes axes activés.
- En tant qu'utilisateur, je veux pouvoir voir l'état d'avancement d'un cycle en cours si je consulte le dashboard avant 7h.
- En tant qu'utilisateur (ou admin), je veux pouvoir relancer un cycle manuellement pour test ou récupération.

**Critères d'acceptation.**
- Cron déclenché à 06:00 UTC+1 (Maroc). Configurable via env `CYCLE_CRON_EXPR` pour tests.
- Chaque utilisateur actif (User non soft-deleted, ayant ≥ 1 Competitor non supprimé) génère 1 `VeilleCycle`.
- Un cycle traite tous les concurrents en parallèle, et toutes les sources d'un concurrent en parallèle (concurrence configurable via env, défaut 5).
- Statut du cycle suivi en temps réel : `pending → collecting → evaluating → analyzing → writing → completed | partial_success | failed`.
- Au terme, le webhook `cycle.completed` notifie le web qui invalide les caches (revalidation Next.js par tag `cycle:userId`).
- Cycle hebdomadaire PESTEL : déclenché le dimanche à 23:00 (avant le cycle quotidien du lundi) pour que le PESTEL soit prêt à 06:00 lundi.
- Bouton "Lancer un cycle maintenant" disponible dans Settings (rate-limit : 1 par 4h pour éviter abus / coût).
- Logs structurés émis à chaque étape : `cycle.started`, `cycle.step.collect.done{durationMs, sourceCount}`, etc.

**Dépendances.** F2 (CompanyProfile et Competitor existants), agents 2 à 7 (section 6.3), schéma `VeilleCycle`, `Source`, `SourceCRAAP`, `SWOTSnapshot`, `PESTELSnapshot`, `WeakSignal`, `Movement`.

### 7.5 F4 : Dashboard et feed d'alertes

**Description.** Vue principale post-login : feed chronologique des `Movement` détectés, filtrables par concurrent, axe, sévérité, date. Cards riches avec extrait, source(s), score CRAAP, statut (nouveau / vu / sauvegardé / ignoré).

**User stories.**
- En tant qu'utilisateur, je veux voir en 1 coup d'œil les nouveautés du jour quand j'ouvre Radar.
- En tant qu'utilisateur, je veux filtrer le feed par concurrent ou par axe pour me concentrer sur ce qui m'intéresse.
- En tant qu'utilisateur, je veux marquer une alerte comme "sauvegardée" ou "ignorée" pour curer mon suivi.
- En tant qu'utilisateur, je veux accéder au détail d'un concurrent (sa SWOT, son historique 90 jours).
- En tant qu'utilisateur, je veux voir les signaux faibles regroupés dans un onglet dédié.

**Critères d'acceptation.**
- Page `/dashboard` : 3 zones (header avec stats du jour, feed central avec cards `Movement`, sidebar avec filtres).
- Card `Movement` : titre, extrait (≤ 200 chars), concurrent, axe, date, badge sévérité, score CRAAP moyen des sources, lien vers détail.
- Filtres persistés en URL (querystring `?competitor=X&axis=Y&since=Z`) pour partage et bookmarking.
- Marquage statut : optimistic UI, mutation server action, persistance `MovementUserState{movementId, userId, status}`.
- Pagination cursor-based (50 par page), tri `createdAt desc` par défaut.
- Onglet "Signaux faibles" : liste des `WeakSignal` actifs (détectés dans les 30 derniers jours, non expirés), groupés par intensité.
- Page `/competitors/[id]` : profil concurrent + dernière SWOT + timeline 90 jours des Movement.
- Page `/movements/[id]` : détail complet avec liste des sources, scores CRAAP individuels, contenu extrait.
- Polling 60s sur le dashboard pour rafraîchir le feed pendant un cycle en cours (badge "Cycle en cours" affiché).

**Dépendances.** F3 (production des `Movement`), composants `@radar/ui`.

### 7.6 F5 : Digest email quotidien et hebdomadaire

**Description.** Envoi automatique d'un email récapitulatif des `Movement` du dernier cycle, formaté React Email, livré via Resend, avec lien direct vers chaque alerte dans le dashboard.

**User stories.**
- En tant qu'utilisateur, je veux recevoir un email chaque matin à 7h avec les nouveautés du jour.
- En tant qu'utilisateur, je veux pouvoir choisir entre digest quotidien et digest hebdomadaire.
- En tant qu'utilisateur, je veux pouvoir me désabonner facilement (1 clic).

**Critères d'acceptation.**
- Templates React Email dans `apps/web/emails/` (au moins : `daily-digest.tsx`, `weekly-digest.tsx`, `verify-email.tsx`, `reset-password.tsx`).
- Job `email.digest{userId, period}` enqueué à 07:00 (quotidien) et lundi 07:00 (hebdomadaire).
- Contenu : header (date, count), section par concurrent avec top 3 Movement, footer (lien dashboard, désabonnement).
- Lien désabonnement signé (token JWT court 7 jours). Désabonnement met `Setting.digestFrequency = 'never'`.
- Tracking des bounces et complaints via webhooks Resend (`apps/web/api/webhooks/resend`). Si 3 bounces consécutifs : `digestFrequency = 'paused'`, email d'alerte au support.
- Persistance `EmailDigest{userId, period, sentAt, messageId, status, movementCount}`.

**Dépendances.** F1 (User), F3 (Movement), Resend account configuré.

### 7.7 F6 : Export PDF d'un rapport

**Description.** Permettre à l'utilisateur d'exporter en PDF un rapport pour un concurrent ou pour une période (ex : tous les Movement du dernier mois), formaté selon la structure académique du Chapitre 2 du cours M244.

**User stories.**
- En tant que consultant, je veux exporter un rapport PDF d'un concurrent pour le joindre à un livrable client.
- En tant qu'étudiant, je veux exporter un rapport mensuel pour mon dossier de soutenance.

**Critères d'acceptation.**
- Bouton "Exporter PDF" présent sur `/competitors/[id]` et sur `/dashboard`.
- Génération côté serveur (Playwright print-to-PDF d'une page Next.js dédiée `/exports/competitor/[id]?period=30d&token=...`).
- PDF structuré : couverture (logo Radar, nom concurrent, période, date génération), Synthèse exécutive, Méthodologie (cycle M244, sources collectées, score CRAAP moyen), Analyse SWOT, Analyse PESTEL si disponible, Liste des Movement avec sources, Signaux faibles associés, Annexe (URL des sources avec score CRAAP individuel).
- Génération asynchrone (job `export.pdf`), email envoyé à l'utilisateur quand prêt avec lien de téléchargement signé valable 24h.
- Stockage du PDF : Vercel Blob en V2, `/var/lib/radar/exports` sur le VPS en V1, cleanup après 30 jours.

**Dépendances.** F4 (composants UI réutilisés), Playwright (déjà dans `apps/agent` pour la collecte).

### 7.8 F7 : Gestion entreprise / concurrents / axes (CRUD)

**Description.** Pages Settings pour modifier le profil entreprise, ajouter/supprimer des concurrents, activer/désactiver des axes, configurer notifications.

**User stories.**
- En tant qu'utilisateur, je veux ajouter un nouveau concurrent à tout moment.
- En tant qu'utilisateur, je veux retirer un concurrent que je ne suis plus.
- En tant qu'utilisateur, je veux modifier les axes activés sans devoir refaire l'onboarding.
- En tant qu'utilisateur, je veux changer la fréquence de mes emails.

**Critères d'acceptation.**
- Page `/settings/company` : édition `CompanyProfile` (nom, site, secteur, ICP).
- Page `/settings/competitors` : table avec colonnes (nom, site, secteur, axes actifs, dernière collecte, actions). CRUD complet. Ajout déclenche un `deep-research.competitor` job.
- Page `/settings/axes` : grille toggleable, application bulk ou par concurrent.
- Page `/settings/notifications` : `digestFrequency` (daily / weekly / never), `notificationEmail` (différent du compte), `criticalAlertsOnly` (bool).
- Page `/settings/account` : email, mot de passe, session active list, suppression compte.
- Toutes les modifications loggées dans `AuditLog{userId, action, target, beforeJson, afterJson, at}` (RGPD).

**Dépendances.** F1, F2, schéma complet.

### 7.9 Matrice MoSCoW

| Priorité | Features | Justification |
|---|---|---|
| Must (V1 sans ça pas de soutenance) | F1, F2, F3, F4, F5, F7 | Sans auth, onboarding, cycle, dashboard, digest et CRUD, le produit ne fait pas une boucle d'usage complète. |
| Should (V1 si temps) | F6 (Export PDF) | L'export PDF est attendu par les personas Consultant et Étudiant mais peut être rattrapé en post-soutenance si le sprint 6 dérape. |
| Could (V1+) | Notifications push, intégration Slack, webhooks sortants | Demandé par le persona Dirigeant PME en V2 commerciale. |
| Won't (jamais V1) | Multi-tenant entreprise, SSO SAML, conformité ISO 27001, app mobile native | Hors portée d'un MVP académique. |

---

## 8. ARCHITECTURE DES DONNÉES (PRISMA + ERD)

### 8.1 Principes de modélisation

1. **Source unique de vérité** : Postgres. Pas de cache Redis en V1, pas d'event sourcing, pas de CQRS.
2. **UUID v7** pour toutes les clés primaires (Postgres-natif via `gen_random_uuid()`, ordonné dans le temps, idéal pour les index).
3. **Soft-delete** systématique sur les entités sensibles (`User`, `Competitor`, `CompanyProfile`) via colonne `deletedAt`. Hard-delete uniquement par job `*.purge` exécuté à T+7 jours pour conformité RGPD.
4. **Snapshots immuables** pour les analyses (`SWOTSnapshot`, `PESTELSnapshot`) : on ne modifie jamais une analyse passée, on en crée une nouvelle. Permet la timeline 90 jours et l'audit.
5. **Audit log** sur toutes les mutations de données utilisateur (table `AuditLog` JSONB).
6. **Indexation pragmatique** : indices sur les FKs systématiquement, indices composites sur les requêtes du feed (`(userId, createdAt desc)` partout où c'est utile).
7. **Cascades explicites** : `onDelete: Cascade` sur les relations de composition (ex : `Competitor → CompetitorAxis`), `onDelete: Restrict` sur les relations référentielles (ex : `Movement → Competitor`).
8. **Pas de logique métier en BD** : pas de triggers, pas de fonctions PL/pgSQL. Toute la logique reste en TypeScript pour rester testable et debuggable.

### 8.2 ERD complet (vue logique)

```
                              ┌──────────────┐
                              │     User     │
                              └──────┬───────┘
                                     │ 1
              ┌──────────────────────┼──────────────────────────┐
              │ N                    │ 1                        │ N
        ┌─────▼──────┐       ┌───────▼──────────┐         ┌─────▼──────┐
        │  Account   │       │  CompanyProfile  │         │  Setting   │
        │  (OAuth)   │       └───────┬──────────┘         └────────────┘
        └────────────┘               │ 1
                                     │
              ┌──────────────────────┼──────────────────────┐
              │ N                    │ N                    │ N
        ┌─────▼──────┐         ┌─────▼────────┐       ┌─────▼─────────┐
        │ Competitor │         │ VeilleCycle  │       │ EmailDigest   │
        └─────┬──────┘         └─────┬────────┘       └───────────────┘
              │                      │
              │ N (via               │ 1
              │  CompetitorAxis)     │
              │                      ▼
        ┌─────▼─────────────┐   ┌──────────────────────────────────────┐
        │ SurveillanceAxis  │   │ AgentRun                             │
        │ (catalogue)       │   │ (1 par appel d'agent dans le cycle)  │
        └───────────────────┘   └──────────────────────────────────────┘
              │                      │
              │                      │ 1
              │                      ▼
              │                 ┌──────────────┐ N
              │              ┌──┤    Source    │────────┐
              │              │  └──────┬───────┘        │
              │              │ 1       │ 1              │
              │              │         ▼                │
              │              │  ┌──────────────┐        │
              │              │  │ SourceCRAAP  │        │
              │              │  └──────────────┘        │
              │              │                          │
              │      ┌───────▼────┐              ┌──────▼──────────┐
              │      │  Movement  │              │  WeakSignal     │
              │      │  (alerte)  │              │  (signal faible)│
              │      └─────┬──────┘              └─────────────────┘
              │            │ N
              │            ▼
              │      ┌──────────────────┐
              │      │ MovementSource   │
              │      └──────────────────┘
              │
              │      ┌──────────────────┐  ┌──────────────────┐
              └─────▶│  SWOTSnapshot    │  │  PESTELSnapshot  │
                     │  (par concurrent)│  │  (par secteur)   │
                     └──────────────────┘  └──────────────────┘

                              ┌──────────────┐
                              │   AuditLog   │
                              │   (transv.)  │
                              └──────────────┘
```

### 8.3 Détail des modèles

#### Authentification

| Modèle | Champs clés | Notes |
|---|---|---|
| `User` | `id` UUID PK, `email` unique, `name`, `passwordHash?`, `emailVerifiedAt?`, `image?`, `createdAt`, `updatedAt`, `deletedAt?` | `passwordHash` nullable pour comptes OAuth-only |
| `Account` | `id` PK, `userId` FK→User, `provider` ('google'\|'github'), `providerAccountId`, `accessToken?`, `refreshToken?`, `expiresAt?` | Multi-provider possible par User |
| `Session` | `id` PK, `userId` FK→User, `token` unique, `expiresAt`, `userAgent?`, `ipAddress?` | Sessions DB-backed Better-Auth |
| `VerificationToken` | `id` PK, `identifier` (email), `token` unique hashé, `purpose` ('email_verify'\|'password_reset'), `expiresAt`, `usedAt?` | Single-use, courte durée |

#### Profil business

| Modèle | Champs clés | Notes |
|---|---|---|
| `CompanyProfile` | `id` PK, `userId` FK→User unique, `name`, `website`, `sector?`, `sizeBand?` (`'1-10'`\|`'11-50'`\|...), `country` default 'MA', `icp?`, `keywords` String[], `enrichedAt?`, `createdAt`, `updatedAt` | Relation 1-1 avec User en V1 (1 user = 1 entreprise) |
| `Competitor` | `id` PK, `companyProfileId` FK→CompanyProfile, `name`, `website`, `sector?`, `sizeBand?`, `foundedYear?`, `headquartersCity?`, `primaryProducts` String[], `enrichedAt?`, `lastCollectedAt?`, `createdAt`, `updatedAt`, `deletedAt?` | N par CompanyProfile, soft-delete |
| `SurveillanceAxis` | `id` PK, `slug` unique (`'recruiting'`\|`'strategy'`\|`'tech'`\|`'digital'`\|`'compliance'`), `nameI18n` JSONB (`{fr, en}`), `description`, `icon`, `colorToken` | Catalogue statique seedé |
| `CompetitorAxis` | `competitorId` FK→Competitor, `axisId` FK→SurveillanceAxis, `enabled` bool, `priority` int default 0 | PK composite (competitorId, axisId) |

#### Cycle de veille et exécution

| Modèle | Champs clés | Notes |
|---|---|---|
| `VeilleCycle` | `id` PK, `userId` FK→User, `cycleDate` Date, `kind` (`'daily'`\|`'weekly_pestel'`\|`'manual'`), `status` (`'pending'`\|`'running'`\|`'completed'`\|`'partial_success'`\|`'failed'`), `startedAt?`, `endedAt?`, `errorMessage?`, `tokensInTotal` int default 0, `tokensOutTotal` int default 0, `costUsdTotal` Decimal default 0, `createdAt` | Index unique `(userId, cycleDate, kind)` (idempotence) |
| `AgentRun` | `id` PK, `cycleId` FK→VeilleCycle, `agentName` (`'deep_research'`\|`'collector'`\|...), `competitorId?` FK→Competitor (optionnel selon agent), `status` (`'success'`\|`'failed'`\|`'timeout'`), `model` (`'claude-opus-4-7'`\|...), `startedAt`, `endedAt?`, `tokensIn?`, `tokensOut?`, `costUsd?`, `inputJson` JSONB, `outputJson?` JSONB, `errorMessage?` | Index `(cycleId, agentName)`. JSONB pour rejouer / debugger |

#### Données collectées

| Modèle | Champs clés | Notes |
|---|---|---|
| `Source` | `id` PK, `cycleId` FK→VeilleCycle, `competitorId` FK→Competitor, `axisId?` FK→SurveillanceAxis, `url` Text, `urlNormalized` Text (sans tracking params, lowercased), `domain`, `title`, `publishedAt?`, `collectedAt`, `language` Char(2), `rawContent` Text, `summary?`, `contentHash` Char(64) (SHA-256 du `rawContent`) | Index unique `(competitorId, urlNormalized)` (déduplication intra-concurrent), index `(contentHash)` (déduplication globale) |
| `SourceCRAAP` | `sourceId` FK→Source PK, `currency` Float, `relevance` Float, `authority` Float, `accuracy` Float, `purpose` Float, `global` Float, `justification` Text, `rejected` bool, `evaluatedAt` | 1-1 avec Source |

#### Sortie utilisateur

| Modèle | Champs clés | Notes |
|---|---|---|
| `Movement` | `id` PK, `cycleId` FK→VeilleCycle, `competitorId` FK→Competitor, `axisId` FK→SurveillanceAxis, `title`, `summary` Text, `severity` (`'low'`\|`'medium'`\|`'high'`\|`'critical'`), `craapAvg` Float, `dedupHash` Char(64) (hash sémantique pour dédup inter-cycle), `embeddingVector` Vector(1536) (pgvector pour dédup), `createdAt` | Index `(competitorId, createdAt desc)`, `(cycleId, severity)`, `dedupHash` |
| `MovementSource` | `movementId` FK→Movement, `sourceId` FK→Source, `weight` Float | PK composite, sources qui supportent un Movement |
| `MovementUserState` | `movementId` FK→Movement, `userId` FK→User, `status` (`'new'`\|`'seen'`\|`'saved'`\|`'ignored'`), `notes?` Text, `updatedAt` | PK composite (movementId, userId). Sépare les `Movement` (immuables) du statut user (mutable). |
| `SWOTSnapshot` | `id` PK, `competitorId` FK→Competitor, `cycleId` FK→VeilleCycle, `snapshotDate` Date, `strengths` String[], `weaknesses` String[], `opportunities` String[], `threats` String[], `createdAt` | Index `(competitorId, snapshotDate desc)`. Immuable. |
| `PESTELSnapshot` | `id` PK, `companyProfileId` FK→CompanyProfile, `cycleId` FK→VeilleCycle, `snapshotDate` Date, `political` String[], `economic` String[], `social` String[], `technological` String[], `environmental` String[], `legal` String[], `createdAt` | Index `(companyProfileId, snapshotDate desc)` |
| `WeakSignal` | `id` PK, `companyProfileId` FK→CompanyProfile, `description` Text, `intensity` (`'low'`\|`'medium'`\|`'high'`), `horizon` (`'short'`\|`'medium'`\|`'long'`), `detectedAt`, `expiredAt?`, `firstSeenSourceId?` FK→Source | Expire après 30 jours sans renouvellement |
| `WeakSignalSource` | `weakSignalId` FK→WeakSignal, `sourceId` FK→Source | PK composite |

#### Communications et préférences

| Modèle | Champs clés | Notes |
|---|---|---|
| `EmailDigest` | `id` PK, `userId` FK→User, `period` (`'daily'`\|`'weekly'`), `sentAt`, `messageId` (Resend), `status` (`'sent'`\|`'bounced'`\|`'complained'`\|`'opened'`), `movementCount` int, `cycleIds` String[] | Historique envois |
| `Setting` | `userId` FK→User PK, `digestFrequency` (`'daily'`\|`'weekly'`\|`'never'`\|`'paused'`), `notificationEmail?` (différent du compte), `criticalAlertsOnly` bool default false, `timezone` default 'Africa/Casablanca', `language` (`'fr'`\|`'en'`) default 'fr', `updatedAt` | Préférences utilisateur |

#### Transversal

| Modèle | Champs clés | Notes |
|---|---|---|
| `AuditLog` | `id` PK, `userId?` FK→User, `actor` (`'user'`\|`'system'`\|`'admin'`), `action` Text, `targetType?` Text, `targetId?` Text, `beforeJson?` JSONB, `afterJson?` JSONB, `ipAddress?`, `userAgent?`, `at` | Index `(userId, at desc)`. Append-only. |

### 8.4 Stratégie d'indexation

| Index | Justification |
|---|---|
| `Source(competitorId, urlNormalized)` UNIQUE | Évite collecter 2x la même URL pour un concurrent dans une même cycle |
| `Source(contentHash)` | Détection de réplication de contenu inter-concurrents |
| `Movement(competitorId, createdAt desc)` | Feed concurrent, requête dominante |
| `Movement(dedupHash)` | Dédup au moment du `Movement` insert |
| `MovementUserState(userId, status)` | Filtre "Sauvegardé / Ignoré" |
| `VeilleCycle(userId, cycleDate, kind)` UNIQUE | Idempotence cycle |
| `AgentRun(cycleId, agentName)` | Vue d'avancement cycle |
| `EmailDigest(userId, sentAt desc)` | Historique digest |
| `AuditLog(userId, at desc)` | Affichage audit utilisateur |

Extension Postgres requise : `pgvector` pour `Movement.embeddingVector` (dédup par similarité). Installable simplement sur Postgres 17.

### 8.5 Cascades et intégrité référentielle

| Relation | onDelete | Raison |
|---|---|---|
| `Account → User`, `Session → User`, `Setting → User` | Cascade | Données auth dépendantes du compte |
| `CompanyProfile → User` | Cascade | 1-1 lié au compte |
| `Competitor → CompanyProfile` | Cascade | Composition |
| `CompetitorAxis → Competitor`, `CompetitorAxis → SurveillanceAxis` | Cascade / Restrict | Cascade côté Competitor (suppression concurrent), Restrict côté Axis (catalogue protégé) |
| `Source → VeilleCycle`, `Source → Competitor` | Restrict | Une source historique ne disparaît pas si on supprime le cycle parent (cycle conservé en read-only) |
| `Movement → Competitor` | Restrict | Mêmes raisons : audit historique |
| `MovementSource → Movement`, `MovementSource → Source` | Cascade | Lien |
| `MovementUserState → Movement`, `MovementUserState → User` | Cascade | État éphémère |
| `SWOTSnapshot → Competitor` | Restrict | Historique conservé |
| `WeakSignalSource → WeakSignal`, `→ Source` | Cascade | Lien |
| `AuditLog → User` | Set Null | Audit conservé même si user purgé (anonymisation) |

### 8.6 Migration et seed strategy

- **Migrations** : `prisma migrate dev` en local, `prisma migrate deploy` en CI déploiement. Pas de DDL manuel.
- **Seed** dans `packages/database/seed/index.ts` :
  - 5 `SurveillanceAxis` du catalogue (recruiting, strategy, tech, digital, compliance)
  - 1 `User` admin de test (DEV uniquement, derrière flag `RADAR_SEED_DEV=1`)
  - 1 `CompanyProfile` + 3 `Competitor` exemples pour démo soutenance
- **Migration de l'ancien scaffold** : la première migration v2.1 doit DROP les anciennes tables (`Rapport`, `Source` v1, `SWOT`, `PESTEL`, `SignalFaible`, `EvenementRapport`) et créer le nouveau schéma. Comme aucune donnée prod n'existe, c'est non-destructif.

### 8.7 Considérations RGPD

- **Données collectées** : email user, mot de passe hashé, données entreprises tierces (concurrents publics).
- **Base légale traitement données concurrents** : intérêt légitime (veille publique, sources accessibles librement, pas de scraping de données personnelles concurrentes).
- **Droit à l'oubli** : suppression compte = soft-delete immédiat + purge dure à T+7 jours via job `user.purge`. Cascade sur `CompanyProfile`, `Competitor`, `Movement`, `Source`, etc. `AuditLog` anonymisé (userId nullé).
- **Droit d'accès** : page `/settings/account/data-export` génère un dump JSON de toutes les données du user (job `user.export`, lien email). Format machine-lisible.
- **Stockage** : Postgres VPS Maroc (V1) ou région Europe (V2 Neon Frankfurt). Pas de transfert hors UE/Maroc.
- **Sous-traitants** : Anthropic (US, DPA signé), Resend (US, DPA signé), Tavily (US, DPA si dispo, sinon hash des requêtes). À documenter en annexe.

### 8.8 Volumétrie estimée

| Entité | Volume V1 (10 users actifs, 5 concurrents chacun, 6 mois) | Volume V2 cible (1 000 users actifs) |
|---|---|---|
| `User` | 10 | 1 000 |
| `Competitor` | 50 | 5 000 |
| `VeilleCycle` | ~1 800 (10 users × 180 jours) | 180 000 |
| `AgentRun` | ~12 600 (7 agents × 1 800) | 1.26 M |
| `Source` | ~90 000 (50 concurrents × 10 sources × 180 jours) | 9 M |
| `Movement` | ~9 000 (50 × 1 mvt/concurrent/jour) | 900 K |
| `SWOTSnapshot` | ~9 000 (50 × 180) | 900 K |
| Total Postgres | < 5 GB | ~50 GB |

Postgres 17 sur VPS 4 GB tient confortablement la V1. La V2 nécessitera Postgres managé (Neon ou Supabase) avec auto-scaling.

---

## 9. ENDPOINTS API

### 9.1 Conventions générales

- **Style** : REST sur HTTP/1.1 (HTTP/2 via reverse proxy). Pas de tRPC en V1 pour préserver la simplicité de debug et l'interopérabilité avec l'agent (Fastify pur).
- **Préfixe** : `/api/v1/...` pour le web public, `/v1/...` pour l'agent (`agent.radar.example`).
- **Format** : JSON (`Content-Type: application/json`). UTF-8 strict.
- **Validation** : Zod côté serveur (les schémas vivent dans `packages/api-contracts`).
- **Authentification utilisateur** : cookie de session HttpOnly + SameSite=Lax (Better-Auth). Pas de JWT côté client.
- **Authentification machine-to-machine** (web ↔ agent) : header `X-Radar-Signature: t=<unix_ts>,v1=<hmac_sha256>`. Le secret est partagé via env (`RADAR_HMAC_SECRET`). Tolérance `t` ± 5 min pour éviter replays. Header `X-Radar-Nonce` (UUID) check de réutilisation sur 10 min via Postgres.

### 9.2 Format de réponse standard

**Succès** :
```json
{ "data": <payload>, "meta": { "requestId": "uuid" } }
```

**Erreur** :
```json
{
  "error": {
    "code": "VALIDATION_ERROR" | "UNAUTHORIZED" | "NOT_FOUND" | ...,
    "message": "human-readable",
    "details": { ... } | null,
    "requestId": "uuid"
  }
}
```

Codes HTTP utilisés : 200, 201, 202 (cycle async accepté), 204, 400, 401, 403, 404, 409 (conflit), 422 (validation), 429 (rate limit), 500, 502 (agent down), 503.

### 9.3 Rate limiting

| Surface | Limite V1 | Stratégie |
|---|---|---|
| `/api/v1/auth/*` (login, signup) | 10 req / IP / minute | Postgres-backed (`RateLimitBucket` table, simple) |
| `/api/v1/cycles/run` (déclenchement manuel) | 1 req / user / 4h | Métadonnée user |
| `/api/v1/exports/pdf` | 5 req / user / heure | Métadonnée user |
| Webhooks `/api/webhooks/*` | 100 req / minute / source | Suffisant pour Resend / agent V1 |
| Tout le reste | 60 req / IP / minute | Soft limit |

### 9.4 Endpoints publics (web)

#### Auth (F1)

| Méthode | Endpoint | Body | Réponse |
|---|---|---|---|
| POST | `/api/v1/auth/signup` | `{ name, email, password }` | 201 `{ user, sessionToken }` |
| POST | `/api/v1/auth/login` | `{ email, password }` | 200 `{ user, sessionToken }` |
| POST | `/api/v1/auth/logout` |  | 204 |
| POST | `/api/v1/auth/oauth/google` | `{ code, state }` | 200 `{ user, sessionToken }` |
| POST | `/api/v1/auth/password-reset/request` | `{ email }` | 204 (no leak) |
| POST | `/api/v1/auth/password-reset/confirm` | `{ token, newPassword }` | 200 |
| POST | `/api/v1/auth/email/verify` | `{ token }` | 200 |
| POST | `/api/v1/auth/email/verify/resend` | (auth) | 204 |
| GET | `/api/v1/auth/me` | (auth) | 200 `{ user, settings }` |

#### CompanyProfile et Competitor (F7, F2)

| Méthode | Endpoint | Body | Réponse |
|---|---|---|---|
| GET | `/api/v1/company` |  | 200 `{ companyProfile }` |
| PUT | `/api/v1/company` | `{ name?, website?, sector?, sizeBand?, icp?, keywords? }` | 200 |
| POST | `/api/v1/company/onboard` | `{ name, website }` | 201 (lance Deep Research) |
| GET | `/api/v1/competitors` | (query : `includeDeleted=0`) | 200 `{ competitors[] }` |
| POST | `/api/v1/competitors` | `{ name, website }` | 201 `{ competitor }` (lance Deep Research) |
| GET | `/api/v1/competitors/:id` |  | 200 `{ competitor, latestSwot, recentMovements }` |
| PUT | `/api/v1/competitors/:id` | `{ name?, website?, sector? }` | 200 |
| DELETE | `/api/v1/competitors/:id` |  | 204 (soft-delete) |

#### Axes de surveillance (F2, F7)

| Méthode | Endpoint | Body | Réponse |
|---|---|---|---|
| GET | `/api/v1/axes` |  | 200 `{ axes[] }` (catalogue) |
| GET | `/api/v1/competitors/:id/axes` |  | 200 `{ axes[] }` (avec `enabled`) |
| PUT | `/api/v1/competitors/:id/axes` | `{ axisIds: string[] }` | 200 (sync : enabled = true pour les listés, false pour les autres) |

#### Cycles et Movements (F3, F4)

| Méthode | Endpoint | Body | Réponse |
|---|---|---|---|
| GET | `/api/v1/cycles` | (query : `limit=20&since=...`) | 200 `{ cycles[] }` |
| GET | `/api/v1/cycles/:id` |  | 200 `{ cycle, agentRuns[], movementCount }` |
| POST | `/api/v1/cycles/run` | `{ kind: 'manual' }` | 202 `{ cycleId }` (rate-limited 1/4h) |
| GET | `/api/v1/movements` | (query : `competitorId?, axisId?, severity?, status?, since?, cursor?, limit=50`) | 200 `{ movements[], nextCursor? }` |
| GET | `/api/v1/movements/:id` |  | 200 `{ movement, sources[], userState }` |
| PATCH | `/api/v1/movements/:id` | `{ status: 'seen'\|'saved'\|'ignored', notes? }` | 200 |

#### Analyses (F4)

| Méthode | Endpoint | Body | Réponse |
|---|---|---|---|
| GET | `/api/v1/competitors/:id/swot` | (query : `at=date`) | 200 `{ snapshot }` (latest si pas de `at`) |
| GET | `/api/v1/competitors/:id/swot/history` | (query : `from, to`) | 200 `{ snapshots[] }` |
| GET | `/api/v1/pestel` | (query : `at=date`) | 200 `{ snapshot }` |
| GET | `/api/v1/weak-signals` | (query : `intensity?, horizon?`) | 200 `{ weakSignals[] }` |
| GET | `/api/v1/weak-signals/:id` |  | 200 `{ weakSignal, sources[] }` |

#### Settings et notifications (F5, F7)

| Méthode | Endpoint | Body | Réponse |
|---|---|---|---|
| GET | `/api/v1/settings` |  | 200 `{ settings }` |
| PUT | `/api/v1/settings` | `{ digestFrequency?, notificationEmail?, criticalAlertsOnly?, timezone?, language? }` | 200 |
| POST | `/api/v1/settings/digest/preview` |  | 200 `{ html, text }` (rendu Resend test) |
| GET | `/api/v1/settings/digest/unsubscribe?token=...` |  | 200 (page HTML, pas JSON) |

#### Exports (F6)

| Méthode | Endpoint | Body | Réponse |
|---|---|---|---|
| POST | `/api/v1/exports/pdf` | `{ type: 'competitor'\|'period', competitorId?, from?, to? }` | 202 `{ exportId }` (job async) |
| GET | `/api/v1/exports/:id` |  | 200 `{ export, downloadUrl? }` |

#### Compte et RGPD

| Méthode | Endpoint | Body | Réponse |
|---|---|---|---|
| DELETE | `/api/v1/account` | `{ confirmEmail }` | 202 (soft-delete + purge job +7j) |
| POST | `/api/v1/account/data-export` |  | 202 `{ exportId }` (email à venir) |
| GET | `/api/v1/account/audit-log` | (query : `cursor?, limit=50`) | 200 `{ entries[], nextCursor? }` |

### 9.5 Endpoints internes (agent)

L'agent expose une API minimale, **non publique**, accessible via reverse proxy interne ou via réseau privé Docker. Toutes les requêtes signées HMAC.

| Méthode | Endpoint | Body | Réponse |
|---|---|---|---|
| GET | `/v1/health` |  | 200 `{ ok, ts, uptime, queueDepth }` |
| POST | `/v1/run` | `{ jobName: 'cycle.daily'\|'cycle.weekly_pestel'\|'deep-research.company'\|'deep-research.competitor'\|'export.pdf', payload: {...} }` | 202 `{ jobId }` |
| GET | `/v1/jobs/:id` |  | 200 `{ job, attempts[], lastError? }` |
| POST | `/v1/jobs/:id/retry` | (admin) | 202 |

### 9.6 Webhooks entrants (web → écouteur de tiers et agent → web)

| Méthode | Endpoint | Source | Body |
|---|---|---|---|
| POST | `/api/webhooks/agent` | apps/agent | `{ event: 'cycle.completed'\|'cycle.failed'\|'deep-research.completed'\|'export.ready', payload }` (signé HMAC) |
| POST | `/api/webhooks/resend` | Resend | Format Resend (signé via `RESEND_WEBHOOK_SECRET`) |

### 9.7 Documentation OpenAPI

- Génération automatique à partir des schémas Zod via `zod-to-openapi`.
- Servi sur `/api/v1/openapi.json` et UI Swagger sur `/api/v1/docs` (protégé par session admin en V1).
- Inclus dans le rapport académique en annexe.

---

> **Fin du Bloc 2 · Architecture et spécifications.** Sections 6 à 9 livrées. Le Bloc 3 couvrira les exigences UI/UX (mockups Intel Dark des 10 écrans), l'authentification et autorisations détaillées (lib choisie, flows complets), les règles métier formalisées (formules CRAAP, dédup, recoupement) et les contraintes techniques (RGPD, SLA, conformité).

---
