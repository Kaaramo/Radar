# Changement d'architecture - Ce que Karamo doit savoir

## Ce qui a change en 1 phrase

> Le serveur Fastify custom (`apps/agent/`) est remplace par **OpenClaw**, un agent IA open source qui orchestre les sous-agents, fait le scraping et le scheduling automatiquement.

---

## Avant vs Apres

```
AVANT
─────
Browser → apps/web (Next.js) → apps/agent (Fastify) → Anthropic API
                                      ↓
                                 PostgreSQL

APRES
─────
Browser → apps/web (Next.js) → OpenClaw Gateway → Anthropic API
                ↑                     ↓               ↓
                └──── POST /api/internal/* ←── Skills OpenClaw
                              ↓
                         PostgreSQL
```

---

## Architecture Docker finale

```
docker-compose.yml
┌─────────────────────────────────────────┐
│  postgres:17          port 5432         │
│  openclaw:latest      port 18789        │  ← NOUVEAU
│  web (Next.js)        port 3000         │
└─────────────────────────────────────────┘

Reseau interne Docker : les 3 services se parlent directement.
```

---

## Les 8 agents OpenClaw (pour comprendre le systeme)

| Agent | Role | Quand |
|---|---|---|
| **orchestrateur** | Coordonne tous les sous-agents, aucune tache propre | A chaque cycle de veille |
| **deep-research** | Recherche le profil de l'entreprise utilisateur | UNE SEULE FOIS a l'onboarding |
| collecteur | Scrape les sources concurrentes | Chaque cycle |
| evaluateur | Score CRAAP des sources | Chaque cycle |
| analyste-swot | Analyse SWOT avec profil utilisateur | Chaque cycle |
| analyste-pestel | Analyse PESTEL | Chaque cycle |
| detecteur-signaux-faibles | Signaux faibles | Chaque cycle |
| redacteur | Synthese finale | Chaque cycle |

---

## Schema Prisma : modele a ajouter

**Le schema actuel ne contient pas de modele pour le profil utilisateur.**
Tu dois ajouter ce modele dans `packages/database/prisma/schema.prisma` :

```prisma
model ProfilUtilisateur {
  id            String   @id @default(uuid())
  userId        String   @unique
  nomEntreprise String
  siteWeb       String?
  secteur       String?
  description   String?
  produits      String[]
  marches       String[]
  positionnement String?
  creeLe        DateTime @default(now())
  majLe         DateTime @updatedAt
}
```

Ce profil est cree une seule fois lors de l'onboarding et utilise par tous les cycles de veille suivants pour contextualiser le SWOT.

---

## Ce que TU dois creer (cote Next.js)

### Routes internes (OpenClaw → Next.js)

Les agents OpenClaw envoient leurs resultats vers des endpoints internes de ton app.
Tu dois creer ces routes dans `apps/web/app/api/internal/` :

| Endpoint | Quand | Ce qu'il recoit |
|---|---|---|
| `POST /api/internal/profil` | Fin de deep-research (onboarding) | `{ userId, nomEntreprise, siteWeb, secteur, description, produits[], marches[], positionnement }` |
| `POST /api/internal/rapport/progresse` | A chaque etape du cycle | `{ rapportId, statut, progressionPct, etape }` |
| `POST /api/internal/sources` | Apres collecte | `{ rapportId, sources[] }` |
| `POST /api/internal/swot` | Apres analyse SWOT | `{ rapportId, strengths[], weaknesses[], opportunities[], threats[] }` |
| `POST /api/internal/pestel` | Apres analyse PESTEL | `{ rapportId, political[], economic[], social[], technological[], environmental[], legal[] }` |
| `POST /api/internal/signaux` | Apres detection | `{ rapportId, signaux[] }` |
| `POST /api/internal/rapport/termine` | Fin du cycle | `{ rapportId, synthese }` |
| `POST /api/internal/rapport/echec` | En cas d'erreur | `{ rapportId, erreur }` |

Ces routes font juste **valider le JSON + ecrire en base via Prisma**.

---

## Comment Next.js declenche OpenClaw

### 1. Onboarding (une seule fois) - declenche deep-research

Apres que l'utilisateur a rempli son profil entreprise :

```typescript
// apps/web - onboarding termine, lancer deep-research
const response = await fetch('http://openclaw:18789/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'openclaw/default',
    messages: [{
      role: 'user',
      content: `Lance deep-research pour userId: ${userId}. Entreprise: ${nomEntreprise}. Site: ${siteWeb}`
    }]
  })
})
// Retour immediat 202 - OpenClaw travaille en arriere-plan
```

### 2. Cycle de veille (recurrent) - declenche l'orchestrateur

Quand l'utilisateur lance une veille (ou cron 6h00) :

```typescript
// apps/web - declencher un cycle de veille
const profil = await prisma.profilUtilisateur.findUnique({ where: { userId } })

const response = await fetch('http://openclaw:18789/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'openclaw/default',
    messages: [{
      role: 'user',
      content: `Lance la veille pour rapportId: ${rapportId}. Profil utilisateur: ${JSON.stringify(profil)}`
    }]
  })
})
// Retour immediat 202 - OpenClaw travaille en arriere-plan
```

Le profil est passe directement dans le message pour que l'orchestrateur le transmette aux sous-agents sans avoir a interroger la base.

---

## Ce que Bachirou gere (tu n'y touches pas)

- Les 8 `SKILL.md` (instructions des agents)
- La configuration OpenClaw (docker-compose, cron 6h00)
- La logique de scraping et d'analyse

## Ce que tu gardes exactement comme prevu

- Tout le dashboard (F4)
- L'authentification (F1)
- L'onboarding (F7) - a completer avec le declenchement de deep-research
- Les emails Resend (F5)
- L'export PDF (F6)
- Le schema Prisma - a completer avec le modele ProfilUtilisateur
