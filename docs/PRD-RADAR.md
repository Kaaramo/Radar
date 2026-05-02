# PRD COMPLET · RADAR

> **Version** : 2.0 (refonte complète)
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

---

## TABLE DES MATIÈRES

1. [Contexte du projet](#1-contexte-du-projet)
2. [Vision produit](#2-vision-produit)
3. [Ancrage académique M244](#3-ancrage-académique-m244)
4. [Personas utilisateurs](#4-personas-utilisateurs)
5. [Parcours utilisateur](#5-parcours-utilisateur)
6. *Architecture du système (Engine OpenClaw) · à venir bloc 2*
7. *Spécifications fonctionnelles MVP (F1-F7) · à venir bloc 2*
8. *Architecture des données (Prisma + ERD) · à venir bloc 2*
9. *Endpoints API · à venir bloc 2*
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

> **Fin du Bloc 1 · Foundations.** Sections 1 à 5 livrées. Le bloc 2 couvrira l'architecture du système, les spécifications fonctionnelles MVP détaillées, l'architecture des données et les endpoints API. Section critique selon le skill, validation requise après livraison.

---
