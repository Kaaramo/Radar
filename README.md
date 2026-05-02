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

## Architecture du monorepo

```
radar/
├── apps/
│   ├── web/                    [Karamo] application Next.js (dashboard, API)
│   └── agent/                  [Bachirou] OpenClaw orchestrateur + 5 sous-agents
│
├── packages/
│   ├── database/               schema Prisma + client Postgres
│   ├── api-contracts/          schemas Zod, payloads webhooks
│   ├── agent-prompts/          prompts M244 codés (1 par agent)
│   ├── ui/                     composants partagés (Intel Dark theme)
│   └── shared/                 logger, errors, dates utils
│
├── infra/
│   ├── docker/                 Dockerfile agent, compose Postgres local
│   ├── caddy/                  reverse proxy SSL self-hosted
│   └── scripts/                deploy, backup
│
├── docs/
│   └── PRD-RADAR-v2.0.md       Product Requirements Document complet
│
└── .github/                    workflows CI, templates issues / PR
```

---

## Stack technique

| Couche | Choix |
|---|---|
| Monorepo | pnpm 10 workspaces + Turborepo 2 |
| Web | Next.js 16 (App Router) + Tailwind 4 |
| Agent | Node.js 24 + Fastify 5 + Anthropic SDK (Claude Opus 4.7) |
| Database | PostgreSQL 17 + Prisma 6 |
| Contracts | Zod 3 |
| UI | Tokens Intel Dark + composants typés |
| Infra | Docker + Caddy (SSL automatique Let's Encrypt) |
| CI | GitHub Actions (typecheck, lint, build, test) |

---

## Démarrage local

**Prérequis :** Node 24+, pnpm 10+, Docker Desktop.

```bash
# 1. Installation
pnpm install
cp .env.example .env

# 2. Postgres local
docker compose -f infra/docker/postgres-local/docker-compose.yml up -d

# 3. Migrations + seed
pnpm db:migrate
pnpm db:seed

# 4. Lancement web + agent en parallèle
pnpm dev
```

Web : http://localhost:3000 · Agent : http://localhost:4000

### Scripts disponibles

| Commande | Description |
|---|---|
| `pnpm dev` | Lance web + agent en watch |
| `pnpm build` | Build production de tous les apps |
| `pnpm lint` | Lint tous les packages |
| `pnpm typecheck` | Typecheck TypeScript |
| `pnpm test` | Tests unitaires |
| `pnpm db:migrate` | Applique les migrations Prisma |
| `pnpm db:seed` | Seed la base |

---

## Documentation

- **[PRD complet (v2.0)](./docs/PRD-RADAR-v2.0.md)** : contexte, vision, ancrage M244, personas, parcours utilisateur, architecture, données, API, UI/UX, règles métier, coûts, phasage, indicateurs de succès, roadmap V2+

---

## Auteurs

| | |
|---|---|
| **Karamo Sylla** | `apps/web` · `packages/database` · `packages/ui` · design Intel Dark |
| **Bachirou Konaté** | `apps/agent` · `packages/agent-prompts` · `infra/` |

**Encadrant :** Pr. Younes Wadiai
**Cadre :** Module M244 (Veille Technologique), Cycle Ingénieur BDIA, ENSA Tétouan
**Session :** Printemps 2026
