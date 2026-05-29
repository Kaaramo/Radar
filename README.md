<div align="center">

# RADAR

### Vos concurrents bougent. Radar vous le dit avant tout le monde.

**Outil de veille concurrentielle propulsé par un agent IA autonome qui surveille quotidiennement le web, applique la méthodologie de veille stratégique du module M244, et livre des rapports actionnables sans intervention humaine.**

![Stack](https://img.shields.io/badge/stack-pnpm%20%2B%20Turborepo-22d3ee?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=next.js)
![Node](https://img.shields.io/badge/Node-24%20LTS-339933?style=flat-square&logo=node.js)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)
![DeepSeek](https://img.shields.io/badge/LLM-DeepSeek%20V4%20Pro-6366f1?style=flat-square)
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
  des besoins              (web_search + web_fetch)      (CRAAP + SWOT + PESTEL)
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

### Le pipeline OpenClaw : 8 agents spécialisés

| Agent | Mission |
|---|---|
| **Orchestrateur** | Coordonne le pipeline complet, délègue aux 7 sous-agents |
| **Deep Research** | Recherche et enrichit le profil de l'entreprise utilisateur (one-time, onboarding) |
| **Collecteur** | Recherche web + scraping des concurrents via Tavily (primaire) + web_fetch (fallback DuckDuckGo) |
| **Évaluateur CRAAP** | Note chaque source (Currency, Relevance, Authority, Accuracy, Purpose) |
| **Analyste SWOT** | Matrice SWOT avec profil utilisateur + données concurrents |
| **Analyste PESTEL** | Synthèse des 6 dimensions sectorielles |
| **Détecteur signaux faibles** | Croise les sources sur fenêtre glissante 30 jours |
| **Rédacteur** | Produit la synthèse finale structurée |

---

## Pour qui

### L'Étudiant Stratégiste

Master 2 ou cycle ingénieur, spécialisation stratégie, intelligence économique ou data. Cherche à démontrer la maîtrise des concepts M244 dans un projet livrable au jury.

### Le Dirigeant PME

Fondateur, DG ou directeur stratégie d'une PME 10 à 100 salariés. Veut être alerté dès qu'un concurrent bouge, dans la matinée, sans y consacrer deux heures par jour.

### Le Consultant indépendant

5 à 15 ans d'expérience, 3 à 8 missions actives en parallèle. Veut accélérer la phase de recherche concurrentielle et maintenir une veille continue.

---

## Architecture cible

```
radar/
├── apps/
│   ├── web/                    [Karamo] Next.js 16 (dashboard, auth, onboarding, API interne)
│   └── agent/                  [Bachirou] Skills OpenClaw (8 SKILL.md)
│       └── workspace/
│           └── skills/         8 agents en markdown (orchestrateur, deep-research, etc.)
│
├── packages/
│   ├── database/               schema Prisma + client Postgres
│   ├── api-contracts/          schemas Zod partagés
│   ├── ui/                     composants partagés (Intel Dark theme)
│   └── shared/                 logger, errors, dates utils
│
├── infra/
│   └── docker/
│       └── postgres-local/     docker-compose (postgres + openclaw + web)
│
└── docs/
    └── PRD-RADAR.md            Product Requirements Document complet
```

Le repo est volontairement vierge à ce stade : structure de dossiers posée, scaffolding non engagé. Les choix de stack sont arrêtés dans la note de cadrage et seront matérialisés au démarrage du sprint 1.

---

## Stack arrêtée

| Couche | Choix |
|---|---|
| Monorepo | pnpm 10 workspaces + Turborepo 2 |
| Web | Next.js 16 (App Router) + Tailwind 4 |
| Agent | OpenClaw (`ghcr.io/openclaw/openclaw:latest`, port 18789) |
| LLM | DeepSeek V4 Pro (`deepseek/deepseek-v4-pro`, thinking=medium) |
| Recherche web | Tavily (primaire, TAVILY_API_KEY) + DuckDuckGo (fallback) |
| Database | PostgreSQL 17 + Prisma 6 |
| Contracts | Zod 3 |
| UI | Tokens Intel Dark + composants typés |
| Infra | Docker Compose (3 services : postgres + openclaw + web) |

---

## Démarrage local

**Prérequis :** Docker Desktop, pnpm 10+.

```bash
# 1. Variables d'environnement
cp .env.example .env
# Remplir DEEPSEEK_API_KEY, TAVILY_API_KEY, OPENCLAW_INTERNAL_SECRET dans .env

# 2. Lancer les 3 services (postgres + openclaw + web)
docker compose -f infra/docker/stack-complet/docker-compose.yml --env-file .env up -d --build

# 3. Développement web uniquement (hors Docker)
pnpm install
pnpm dev
```

Web : http://localhost:3000 · OpenClaw : http://localhost:18789

### Scripts disponibles

| Commande | Description |
|---|---|
| `pnpm dev` | Lance le web en watch mode |
| `pnpm build` | Build production |
| `pnpm lint` | Lint tous les packages |
| `pnpm typecheck` | Typecheck TypeScript |
| `pnpm db:migrate` | Applique les migrations Prisma |
| `pnpm db:seed` | Seed la base |

---

## Documentation

- **[PRD complet](./docs/PRD-RADAR.md)** : contexte, vision, ancrage M244, personas, parcours utilisateur, architecture, données, API, spécifications fonctionnelles

---

## Répartition des responsabilités

| Auteur | Périmètre |
|---|---|
| **Karamo Sylla** | `apps/web` · `packages/database` · `packages/ui` · design Intel Dark |
| **Bachirou Konaté** | `apps/agent` (OpenClaw skills) · `infra/` · configuration Docker |

**Encadrant :** Pr. Younes Wadiai
**Cadre :** Module M244 (Veille Technologique), Cycle Ingénieur BDIA, ENSA Tétouan
**Session :** Printemps 2026
