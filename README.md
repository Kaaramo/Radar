<div align="center">

# RADAR

### Vos concurrents bougent. Radar vous le dit avant tout le monde.

**Outil de veille concurrentielle propulsé par un agent IA autonome qui surveille quotidiennement le web, applique la méthodologie de veille stratégique du module M244, et livre des rapports actionnables sans intervention humaine.**

![Stack](https://img.shields.io/badge/stack-pnpm%20%2B%20Turborepo-22d3ee?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=next.js)
![Node](https://img.shields.io/badge/Node-24%20LTS-339933?style=flat-square&logo=node.js)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)
![Anthropic](https://img.shields.io/badge/LLM-Claude%20Opus%204.7-D97706?style=flat-square)
![M244](https://img.shields.io/badge/M244-Veille%20Technologique-0071c5?style=flat-square)
![ENSA](https://img.shields.io/badge/ENSA-Tétouan-7c3aed?style=flat-square)

</div>

---

## Le problème

Les entreprises surveillent leurs concurrents de manière manuelle et fragmentée. La direction stratégie consacre une à deux heures par jour à scroller LinkedIn, lire la presse en diagonale, et consigner ce qu'elle retient dans un Google Doc sans structure analytique.

| Défaillance | Conséquence business |
|---|---|
| Découverte tardive des mouvements concurrents | Perte d'avantage temporel |
| Aucune méthode d'évaluation des sources | Mélange d'infos fiables et de rumeurs |
| Pas de synthèse SWOT ni PESTEL | Décisions à l'intuition |
| Signaux faibles ignorés | Tendances émergentes manquées |
| Pas de mémoire chronologique | Reconstruction laborieuse de l'historique |

> Le problème n'est pas un manque d'information. C'est un manque de **méthode** et d'**automatisation**.

---

## La solution

Radar déploie un agent IA autonome (OpenClaw) qui prend en charge **les 5 étapes du cycle de veille M244** :

```
                          CYCLE QUOTIDIEN · 06:00
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
  Identification              Collecte                    Analyse & traitement
  des besoins              (Playwright + LLM)            (CRAAP + SWOT + PESTEL)
   (Onboarding                                          + détection signaux faibles
   Deep Research)                                      + recoupement multi-sources
       │                                                          │
       └──────────────────────────────────────────────────────────┤
                                                                  ▼
                                                     Diffusion & exploitation
                                                     (Dashboard + email + PDF)
                                                                  │
                                                                  ▼
                                                         Mise à jour continue
                                                          (cycle quotidien,
                                                          PESTEL hebdo, signaux
                                                          faibles 30j glissants)
```

### Le pipeline OpenClaw : 5 sous-agents spécialisés

| Agent | Mission |
|---|---|
| **Collecteur** | Génère les requêtes diversifiées et explore les sites concurrents quotidiennement à 6h |
| **Évaluateur CRAAP** | Note chaque source sur Currency, Relevance, Authority, Accuracy, Purpose. Rejette les sources faibles |
| **Analyste SWOT** | Met à jour la matrice par concurrent à chaque cycle |
| **Analyste PESTEL** | Synthétise les 6 dimensions sectorielles chaque lundi |
| **Détecteur signaux faibles** | Croise les sources mineures et majeures sur fenêtre glissante de 30 jours |
| **Rédacteur** | Produit la synthèse finale structurée selon le format académique du Chapitre 2 |

---

## Pour qui

### L'Étudiant Stratégiste

Master 2 ou cycle ingénieur, spécialisation stratégie, intelligence économique ou data. Cherche à démontrer la maîtrise des concepts M244 dans un projet livrable au jury, et à se constituer une pièce de portfolio défendable en entretien.

### Le Dirigeant PME

Fondateur, DG ou directeur stratégie d'une PME 10 à 100 salariés. Veut être alerté dès qu'un concurrent bouge, dans la matinée, sans y consacrer deux heures par jour.

### Le Consultant indépendant

5 à 15 ans d'expérience, 3 à 8 missions actives en parallèle. Veut accélérer la phase de recherche concurrentielle (20 à 30% du temps non facturable) et maintenir une veille continue sur ses comptes en retainer.

### Anti-personas (V1)

Radar n'est volontairement **pas** conçu pour les acheteurs grands comptes (ISO, SSO entreprise), les agences SEO/SEM (Similarweb couvre), les VC en scouting (Crunchbase couvre), la veille brevet (Espacenet couvre), ni la communication corporate (Mention couvre).

---

## Méthodologie M244 intégrée

Radar n'est pas un projet d'ingénierie auquel on a ajouté du vocabulaire de veille a posteriori. La méthodologie du Pr. Younes Wadiai est **codée dans les prompts de l'agent**.

| Concept M244 | Intégration dans Radar |
|---|---|
| Cycle de veille en 5 étapes (Ch. 1) | Pipeline OpenClaw aligné phase par phase |
| Grille CRAAP (Ch. 3) | Score calculé programmatiquement à chaque source |
| Recoupement multi-sources (Ch. 3) | Aucune alerte sans 2 sources indépendantes |
| Analyse SWOT (Ch. 2) | Grille générée par concurrent, MAJ quotidienne |
| Analyse PESTEL (Ch. 2) | 6 dimensions, MAJ hebdomadaire sectorielle |
| Signaux faibles (Ch. 1) | Détection algorithmique, fenêtre 30 jours |
| Structure du rapport (Ch. 2) | Synthèse, Méthodologie, Analyse, Résultats, Recommandations |
| Diffusion structurée (Ch. 3) | Dashboard, digest email, export PDF |

---

## Différenciation

| Aspect | Outils existants (Similarweb, SEMrush, Crayon) | **Radar** |
|---|---|---|
| Cœur métier | Trafic et SEO | **Mouvements stratégiques tous axes** |
| Méthodologie | Aucune | **Cycle M244, grille CRAAP par source** |
| Analyse | Tableaux de métriques | **SWOT + PESTEL générés et MAJ auto** |
| Signaux faibles | Non détectés | **Détection algorithmique multi-sources** |
| Tarif | À partir de 100 USD / mois / utilisateur | **Gratuit (V1 académique)** |
| Cible | Grands comptes, agences SEO | **PME, étudiants, consultants** |

---

## North Star Metric

> **Nombre de mouvements concurrents détectés et validés par utilisateur actif et par semaine.**

| Cible | Valeur |
|---|---|
| V1 (académique) | 10 mouvements validés / utilisateur / semaine |
| V2 (commerciale) | 20 mouvements validés / utilisateur / semaine, score CRAAP moyen ≥ 7/10 |

---

## Architecture cible

```
radar/
├── frontend/                   [Karamo] Next.js (App Router), UI, emails, dashboard
├── backend/                    [Bachirou] OpenClaw, sous-agents, acquisition, orchestration
├── database/                   [Karamo] schéma Prisma, contrats partagés, Postgres local
└── docs/                       PRD, note de cadrage, supports académiques
```

Le repo est volontairement vierge à ce stade : structure de dossiers posée, scaffolding non engagé. Les choix de stack sont arrêtés dans la note de cadrage et seront matérialisés au démarrage du sprint 1.

---

## Stack arrêtée

| Couche | Choix |
|---|---|
| Frontend | Next.js (App Router), TypeScript strict, Tailwind, Shadcn UI, Motion.dev |
| State et formulaires | Zustand, TanStack Query, Nuqs, React Hook Form + Zod |
| Auth | Better Auth (email/password + Google OAuth) |
| Visualisation | Recharts |
| Emails | React Email + Resend |
| Backend | Node.js + TypeScript, OpenClaw, Anthropic Claude (Opus / Haiku) |
| Acquisition | Playwright + extraction LLM |
| Orchestration | Cron (quotidien 6h, hebdo PESTEL), file de tâches |
| Cache et rate limit | Upstash Redis |
| Database | PostgreSQL 17 (Neon serverless en V2), Prisma ORM |
| Contrats inter-services | Zod, partagés entre frontend et backend |
| Infra V1 | Docker + Caddy reverse proxy (VPS) |
| Déploiement V2 | Frontend sur Vercel, backend conteneurisé, base sur Neon |

---

## Documentation

- **[PRD RADAR](./docs/PRD-RADAR.md)** : contexte, vision, ancrage M244, personas, parcours utilisateur, architecture, données, API, UI/UX, règles métier, coûts, phasage, indicateurs de succès.
- **[Note de cadrage v1](./Note_de_cadrage_RADAR_v1.pdf)** : arbitrage technique interne du binôme, répartition des responsabilités, décisions tranchées avant le sprint 1.

---

## Répartition des responsabilités

| Auteur | Périmètre |
|---|---|
| **Karamo Sylla** | `frontend/` · `database/` · UX/UI · design system · templates email · export PDF |
| **Bachirou Konaté** | `backend/` · agents IA · acquisition · orchestration · conteneurisation |

**Encadrant :** Pr. Younes Wadiai
**Cadre :** Module M244 (Veille Technologique), Cycle Ingénieur BDIA, ENSA Tétouan
**Session :** Printemps 2026
