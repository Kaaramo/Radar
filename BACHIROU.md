# Réponse à KARAMO.md — Ce que tu dois savoir avant de coder

> **Document M2** · Mai 2026
> Auteur : Karamo Sylla · Destinataire : Bachirou Konaté
> En réponse à `KARAMO.md` (PR #1, mergée dans `main` le 4 mai 2026)

---

## En une phrase

Ta PR #1 est mergée. J'ai adopté ta réorganisation OpenClaw, j'ai posé le squelette `apps/web` + `packages/database` + `packages/contracts`, et j'ai 4 points de vigilance à te faire valider **avant qu'on écrive la moindre ligne de code métier**.

---

## 1. Où j'ai pris le projet (états successifs de `main`)

| Commit    | Auteur   | Effet                                                                                                                                         |
| --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `e4ddbe1` | Karamo   | Reset sur structure 3 dossiers (`frontend/` + `backend/` + `database/`)                                                                       |
| `4af89c7` | Bachirou | Ta PR #1 : suppression de l'ancien `apps/agent/` Fastify, ajout de `KARAMO.md`, `infra/docker/postgres-local/`, `.claude/settings.local.json` |
| `76fa6f4` | Karamo   | Merge de ta PR #1 avec stratégie `theirs` sur 3 conflits modify/delete                                                                        |
| (HEAD)    | Karamo   | Bootstrap monorepo turborepo : `apps/web/` (Next.js 16), `packages/database/` (Prisma), `packages/contracts/` (Zod)                           |

J'ai supprimé le résidu `apps/agent/package.json` orphelin et les trois dossiers vides `frontend/`, `backend/`, `database/` qui contredisaient la structure que tu décrivais dans `KARAMO.md`. **On reste sur ta structure originale `apps/*` + `packages/*` + `infra/*`.**

---

## 2. Tes recommandations que j'ai acceptées telles quelles

| Recommandation                                                                                                                              | Pourquoi je suis OK                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **OpenClaw image officielle** au lieu d'un wrapper Fastify maison                                                                           | Zéro code à maintenir côté orchestration, scheduling/sessions natifs, gain de temps pour la soutenance. Bon arbitrage. |
| **Docker Compose 3 services** (postgres + openclaw + web)                                                                                   | Standard, propre, le réseau interne suffit pour l'auth machine-to-machine en V1.                                       |
| **8 endpoints callbacks `/api/internal/*`** côté Next.js                                                                                    | Granulaire et lisible. Je les ai matérialisés en Zod schemas typés (cf. point 3).                                      |
| **Modèle `ProfilUtilisateur`** alimenté par l'agent deep-research, passé en JSON dans le message à l'orchestrateur pour les cycles suivants | Pattern simple, pas de double round-trip à la base.                                                                    |

---

## 3. Améliorations que j'ai apportées sur tes recommandations

### 3.1 Schéma Prisma élargi (pas juste `ProfilUtilisateur`)

Tu demandais un seul modèle. J'ai posé les 9 entités dont les routes `/api/internal/*` ont besoin pour écrire :

| Entité                             | Justification                                                                                                                                                        |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `User`                             | Réceptacle d'identité (Better Auth peuplera Session/Account en plus en V2).                                                                                          |
| `ProfilUtilisateur`                | Tel que tu l'as spécifié, relation 1-1 avec `User`.                                                                                                                  |
| `Concurrent`                       | Sinon `Rapport` n'a pas de cible à pointer.                                                                                                                          |
| `Rapport` (+ enum `StatutRapport`) | Cycle = 1 rapport par concurrent. Champs `statut`, `progressionPct`, `etape`, `erreur`, `synthese` qui mappent exactement les payloads de `/api/internal/rapport/*`. |
| `Source`                           | Avec score CRAAP par dimension (currency/relevance/authority/accuracy/purpose + total). Cf. M244 chapitre 3.                                                         |
| `Swot`, `Pestel`                   | Relation 1-1 avec `Rapport`, champs en `String[]` pour matcher tes payloads.                                                                                         |
| `SignalFaible`                     | Relation N-1 avec `Rapport`, `scorePertinence` 0..100.                                                                                                               |

Fichier : [`packages/database/prisma/schema.prisma`](packages/database/prisma/schema.prisma).

### 3.2 Contrats Zod typés pour tes 8 endpoints

Le PRD dit "Contrats inter-services : Zod, partagés entre frontend et backend". Tu n'avais rien matérialisé. J'ai créé `@radar/contracts` avec 8 schemas validés :

```
packages/contracts/src/internal/
├── profil.ts      → ProfilEventSchema      (POST /api/internal/profil)
├── rapport.ts     → 3 schemas              (progresse / termine / echec)
├── sources.ts     → SourcesEventSchema     + SourceSchema (CRAAP par source)
├── swot.ts        → SwotEventSchema
├── pestel.ts      → PestelEventSchema
└── signaux.ts     → SignauxEventSchema     + SignalFaibleSchema
```

Chaque schema a un champ discriminant `type: z.literal("...")` pour qu'on puisse, en V2, les fusionner en union discriminée et n'exposer qu'un seul endpoint `/api/internal/event`. **Pour la V1 on garde tes 8 routes** (lisibilité > élégance).

Tu dois importer ces schemas côté `apps/agent/` pour typer tes payloads sortants. Sinon on retombe sur du JSON non-validé et on passera la moitié du temps à débugger des "champ manquant" silencieux.

```typescript
// Côté apps/agent (toi)
import { SwotEventSchema } from "@radar/contracts/internal";
const payload = SwotEventSchema.parse({
  type: "swot",
  rapportId,
  strengths,
  weaknesses,
  opportunities,
  threats,
});
await fetch("http://web:3000/api/internal/swot", {
  method: "POST",
  body: JSON.stringify(payload),
});
```

### 3.3 `tsconfig.base.json` partagé avec `noUncheckedIndexedAccess: true`

Force à check les accès tableau/objet (`arr[0]` retourne `T | undefined`). Tu auras à faire avec aussi côté agent. Plus chiant à coder, mais zéro accès indéfini en prod.

### 3.4 Workspace pnpm propre

`pnpm-workspace.yaml` couvre `apps/*` + `packages/*`. `turbo.json` orchestre `dev` / `build` / `lint` / `type-check` avec dépendances inter-packages respectées. Build vérifié OK : 5/5 tasks réussies.

---

## 4. Points de vigilance à régler ENSEMBLE avant que tu codes

Ces 4 points sont des **bombes à retardement** dans ta proposition initiale. Aucun ne bloque, tous doivent être tranchés.

### 4.1 Trigger en langage naturel — fragile

Dans `KARAMO.md` tu écris :

```typescript
content: `Lance la veille pour rapportId: ${rapportId}. Profil utilisateur: ${JSON.stringify(profil)}`;
```

Si moi côté Next.js je change la phrase d'un mot (ou si toi tu mets à jour le SKILL.md de l'orchestrateur), le parser de l'orchestrateur peut louper le `rapportId`. Pas de type-safety, pas de validation, premier bug en prod garanti.

**Proposition** : un format strict, type clé/valeur, qu'on documente une fois pour toutes. Par exemple :

```
EVENT: cycle.start
rapportId: <uuid>
profil: <json>
```

Ou mieux : on utilise la mécanique de **tool calls** d'OpenClaw (si elle expose ça via son API OpenAI-compatible). À toi de me dire ce que OpenClaw accepte.

### 4.2 Auth sur `/api/internal/*` — manquante

Tu écris dans `KARAMO.md` "réseau interne Docker, pas besoin d'auth". Vrai en V1 stricte. **Mais** : si demain un dev fait tourner `next dev` localement (port 3000 exposé sur localhost), n'importe quel process sur sa machine peut POST sur `/api/internal/swot` et corrompre des rapports.

**Proposition** : un header `X-Internal-Secret: <token>` partagé via env (`RADAR_INTERNAL_SECRET`). 5 lignes de middleware Next.js, valable dès la V1.

### 4.3 Idempotence et retry — non spécifiés

Si `POST /api/internal/swot` retourne 500 (Postgres down 30s, validation Zod foirée parce que toi tu as ajouté un champ que je n'ai pas dans le schema), qu'est-ce qui se passe ?

Trois questions à trancher :

1. **OpenClaw retry combien de fois** avant d'abandonner ?
2. Si retry, est-ce qu'il **renvoie le même payload** (idempotent côté Next.js, je dois UPSERT par `rapportId`) ?
3. Si abandon, est-ce que tu **POST `/api/internal/rapport/echec`** automatiquement ?

Sinon le `Rapport` reste en `EN_COURS` à 60% pour l'éternité.

**Proposition** : retry 3 fois avec backoff exponentiel, payloads idempotents (UPSERT côté Next.js sur tout sauf `Source` et `SignalFaible` qui sont append-only), `rapport/echec` automatique après 3 échecs.

### 4.4 Versioning des contrats

Si tu modifies un SKILL.md pour ajouter un champ dans le payload SWOT (ex: `recommandations: string[]`), Next.js le rejette parce que mon schema Zod ne le connaît pas. Dans l'autre sens, si je serre la validation Zod (max length, etc.), tes anciens cycles bloquent.

**Proposition** : `@radar/contracts` est la **source de vérité** des shapes. Toute modification y passe en PR. Toi et moi commitons dans le même fichier, on review l'un l'autre.

---

## 5. Ce qui t'attend côté `apps/agent/` et `packages/agent-prompts/`

Je n'ai **rien** créé dans ces deux dossiers — ce sont tes terres. À toi de :

- [ ] Créer `apps/agent/` avec le `Dockerfile` qui hérite de `ghcr.io/openclaw/openclaw:latest` + monte `apps/agent/workspace/skills/` comme volume
- [ ] Créer `packages/agent-prompts/` avec les 8 fichiers `SKILL.md` (orchestrateur, deep-research, collecteur, evaluateur, analyste-swot, analyste-pestel, detecteur-signaux-faibles, redacteur)
- [ ] Mettre à jour `infra/docker/postgres-local/docker-compose.yml` pour ajouter le service `openclaw` (port 18789, image officielle, volume agent-prompts)
- [ ] Importer `@radar/contracts/internal` dans tes scripts agent pour typer les payloads sortants

Quand tu seras prêt, ouvre une PR depuis une **branche dédiée** (`feat/agent-bootstrap` par exemple, **pas** `main` de ton fork — sinon on retombe dans le bordel de la PR #1). Je reviewe en moins de 24h.

---

## 6. Décisions à prendre ensemble cette semaine

| Décision                                                                       | Mon vote                                                     | À discuter                                                   |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Format du trigger Next.js → OpenClaw (langage naturel vs strict vs tool calls) | Strict ou tool calls                                         | Quel format OpenClaw supporte officiellement ?               |
| Auth sur `/api/internal/*` (rien vs shared secret vs réseau Docker only)       | Shared secret en V1                                          | OK pour toi ?                                                |
| Stratégie retry/idempotence                                                    | 3 retries backoff, UPSERT côté web, échec auto après abandon | Tu peux configurer ça dans OpenClaw ?                        |
| `.claude/settings.local.json` commité dans la PR #1                            | À retirer du repo et ajouter au `.gitignore`                 | OK ? (c'est ta config locale Claude Code, ça pollue le diff) |
| `KARAMO.md` (ton doc) qui parle encore de `apps/web` et `packages/database`    | OK car on a rebasculé sur cette structure                    | Toujours d'accord avec ta proposition ?                      |

---

## 7. État du repo à date

```
radar/  (commit HEAD)
├── apps/
│   └── web/                      ← @radar/web · Next.js 16, Tailwind 4, App Router
│       ├── src/app/
│       └── package.json
├── packages/
│   ├── database/                 ← @radar/database · Prisma 6 + 9 modèles
│   │   ├── prisma/schema.prisma
│   │   └── src/index.ts
│   └── contracts/                ← @radar/contracts · Zod (8 schemas)
│       └── src/internal/
├── docs/PRD-RADAR.md             ← v2.3 (mise à jour OpenClaw post-merge)
├── infra/docker/postgres-local/  ← (toi : à étendre avec openclaw)
├── KARAMO.md                     ← ton doc original
├── BACHIROU.md                   ← ce document (M2)
├── package.json                  ← root, scripts turbo
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── turbo.json
```

**Vérifs CI locales** :

- `pnpm install` : OK (386 paquets)
- `pnpm exec prisma generate` : OK (Prisma Client 6.19.3)
- `pnpm exec turbo run type-check` : **5/5 tasks successful**

---

## 8. Prochaine action côté toi

1. **Lis ce document de bout en bout** (15 min).
2. **Réponds aux 4 points de vigilance** (section 4) et aux 5 décisions (section 6) — par message ou en commit dans un `BACHIROU_REPONSE.md`.
3. **Démarre `apps/agent/`** dans une branche dédiée, en important les contrats Zod.

À toi.

— Karamo
