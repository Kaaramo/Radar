<div align="center">

# RADAR

### Vos concurrents bougent. Radar vous le dit avant tout le monde.

**Plateforme de veille concurrentielle propulsée par un agent IA autonome. Chaque semaine, Radar parcourt le web, applique la méthodologie de veille stratégique du module M244 (CRAAP, SWOT, PESTEL, signaux faibles) et livre un rapport actionnable, sans intervention humaine.**

![Stack](https://img.shields.io/badge/monorepo-pnpm%20%2B%20Turborepo-2251FF?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=next.js)
![Node](https://img.shields.io/badge/Node-24%20LTS-339933?style=flat-square&logo=node.js)
![Prisma](https://img.shields.io/badge/Prisma-6%20%2B%20PostgreSQL%2017-2D3748?style=flat-square&logo=prisma)
![LLM](https://img.shields.io/badge/LLM-DeepSeek%20V4%20Pro-2251FF?style=flat-square)
![M244](https://img.shields.io/badge/M244-Veille%20Technologique-051C2C?style=flat-square)
![ENSA](https://img.shields.io/badge/ENSA-Tétouan-051C2C?style=flat-square)

</div>

---

## Le problème

Dans une PME, personne n'a le temps de surveiller les concurrents chaque semaine, de recouper les informations, de les évaluer puis de les mettre en forme. La veille se résume souvent au bouche-à-oreille sectoriel et à ce qui remonte sur LinkedIn. Les mêmes faiblesses reviennent :

| Faiblesse                                     | Conséquence                                 |
| --------------------------------------------- | ------------------------------------------- |
| Découverte tardive des mouvements concurrents | Avantage temporel perdu                     |
| Sources non évaluées                          | Rumeurs et faits confirmés sur le même plan |
| Aucune synthèse SWOT ni PESTEL                | Décisions prises à l'intuition              |
| Signaux faibles ignorés                       | Tendances de fond manquées                  |
| Pas de mémoire centralisée                    | Chaque revue repart de zéro                 |

> Le problème n'est pas un manque d'information. C'est un manque de **méthode** et d'**automatisation**.

---

## La solution

Radar confie le cycle de veille M244 à un agent IA autonome (OpenClaw) qui le déroule de bout en bout.

```
                       CYCLE HEBDOMADAIRE · LUNDI 06:00
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
  Identification              Collecte                    Analyse & traitement
  des besoins            (Tavily + web_fetch,           (CRAAP + SWOT + PESTEL
   (onboarding +          7 derniers jours)              + détection signaux faibles
   Deep Research)                                        + recoupement multi-sources)
       │                                                          │
       └──────────────────────────────────────────────────────────┤
                                                                  ▼
                                                     Diffusion & exploitation
                                                     (dashboard + export PDF)
                                                                  │
                                                                  ▼
                                                         Mise à jour continue
                                                      (cycle hebdomadaire, signaux
                                                        faibles sur 30 jours glissants)
```

### Le moteur : un agent OpenClaw, huit compétences

Plutôt que huit agents distincts, Radar utilise **un seul agent qui charge huit compétences** au format `SKILL.md`. L'orchestrateur les enchaîne via des sous-sessions isolées (`sessions_spawn`).

| Compétence                    | Mission                                                                                   |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| **Orchestrateur**             | Coordonne le pipeline et propage les résultats d'une étape à l'autre                      |
| **Deep Research**             | Enrichit le profil de l'entreprise utilisatrice (une fois, à l'inscription)               |
| **Collecteur**                | Recherche web des concurrents via Tavily (DuckDuckGo en fallback)                         |
| **Évaluateur CRAAP**          | Note chaque source (Currency, Relevance, Authority, Accuracy, Purpose) sur 20             |
| **Analyste PESTEL**           | Six dimensions sectorielles (politique, économique, social, techno, environnement, légal) |
| **Analyste SWOT**             | Matrice forces / faiblesses / opportunités / menaces de l'entreprise utilisatrice         |
| **Détecteur signaux faibles** | Croise les sources sur une fenêtre glissante de 30 jours                                  |
| **Rédacteur**                 | Produit la synthèse narrative finale du cycle                                             |

---

## Pour qui

- **Dirigeant de PME.** Veut savoir chaque semaine ce que font ses concurrents, sans y passer deux heures par jour. Consulte son rapport dans le dashboard et l'exporte en PDF pour le comité de direction.
- **Consultant indépendant.** Plusieurs missions en parallèle ; veut accélérer la recherche concurrentielle et garder une veille continue.
- **Étudiant stratégiste.** Cherche à démontrer la maîtrise des concepts M244 sur un cas concret et livrable.

---

## Architecture

```
radar/
├── apps/
│   ├── web/                  [Karamo] Next.js 16 : dashboard, auth, onboarding,
│   │                                  routes internes /api/internal/*
│   └── agent/                [Bachirou] Service OpenClaw
│       └── workspace/skills/ 8 compétences SKILL.md (orchestrateur, collecteur, ...)
│
├── packages/
│   ├── database/             schema Prisma 6 + client (@radar/database)
│   ├── contracts/            schemas Zod inter-services (@radar/contracts)
│   └── ui/                   composants partagés (charte Radar Editorial)
│
├── infra/
│   └── docker/stack-complet/ docker-compose : postgres + openclaw + web
│
├── docs/
│   ├── PRD-RADAR.md          Product Requirements Document
│   └── Rapport/              rapport final M244 (LaTeX)
│
└── Branding/                 charte Radar Editorial, tokens, logo
```

Trois services Docker communiquent sur un réseau interne privé : l'application web (interface et persistance), le moteur OpenClaw (les huit compétences) et PostgreSQL. Le moteur n'est jamais exposé sur Internet ; il dialogue avec le web par les routes `/api/internal/*`.

---

## État du projet

Le pipeline agent et l'application web sont fonctionnels et connectés. Un premier test d'intégration de bout en bout a été mené le 30 mai 2026 sur un compte réel (entreprise **inwi**, concurrents Orange Maroc et Maroc Telecom) : deux rapports produits, persistés et affichés dans le dashboard, avec un score CRAAP moyen de 16,4 / 20. Les détails figurent dans le [rapport M244](./docs/Rapport/).

---

## Stack

| Couche        | Choix                                                                |
| ------------- | -------------------------------------------------------------------- |
| Monorepo      | pnpm 10 workspaces + Turborepo                                       |
| Web           | Next.js 16 (App Router) + React 19 + Tailwind CSS 4                  |
| Auth          | Better Auth (email/mot de passe Argon2id + Google OAuth)             |
| Agent         | OpenClaw (`ghcr.io/openclaw/openclaw:latest`, port interne 18789)    |
| LLM           | DeepSeek V4 Pro (compatible API OpenAI ; Claude Opus 4.7 visé en V2) |
| Recherche web | Tavily (primaire) + DuckDuckGo (fallback)                            |
| Base          | PostgreSQL 17 + Prisma 6                                             |
| Contrats      | Zod (`@radar/contracts`)                                             |
| Design        | Radar Editorial : Navy `#051C2C`, Royal Blue `#2251FF`, Bone         |
| Infra V1      | Docker Compose (postgres + openclaw + web), VPS Hetzner CX21         |

---

## Démarrage local

**Prérequis :** Docker Desktop, pnpm 10+, Node 24+.

```bash
# 1. Variables d'environnement (racine du projet)
cp .env.example .env
# Renseigner : DATABASE_URL, DEEPSEEK_API_KEY, TAVILY_API_KEY, OPENCLAW_INTERNAL_SECRET

# 2. Installer les dépendances
pnpm install

# 3. Lancer la stack Docker complète (postgres + openclaw + web)
cd infra/docker/stack-complet
docker compose --env-file "../../../.env" up -d
```

Pour développer l'application web seule (hors Docker) : `pnpm dev` puis http://localhost:3000.

### Scripts (racine, via Turborepo)

| Commande                                                | Description                  |
| ------------------------------------------------------- | ---------------------------- |
| `pnpm dev`                                              | Lance les apps en watch mode |
| `pnpm build`                                            | Build de production          |
| `pnpm lint`                                             | Lint de tous les packages    |
| `pnpm exec turbo run type-check`                        | Typecheck TypeScript         |
| `pnpm --filter @radar/database exec prisma migrate dev` | Migrations Prisma            |

---

## Documentation

- **[PRD complet](./docs/PRD-RADAR.md)** : vision, ancrage M244, personas, parcours, architecture, données, API.
- **[Rapport final M244](./docs/Rapport/)** : conception, architecture, implémentation, tests d'intégration, bilan.

---

## Équipe

| Auteur              | Périmètre                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| **Karamo Sylla**    | `apps/web` · `packages/database` · `packages/contracts` · `packages/ui` · charte Radar Editorial |
| **Bachirou Konaté** | `apps/agent` (compétences OpenClaw) · `infra/` · configuration Docker                            |

**Encadrant :** Pr. Younes Wadiai
**Cadre :** Module M244 (Veille Technologique), Cycle Ingénieur BDIA, ENSA Tétouan
**Session :** Printemps 2026
