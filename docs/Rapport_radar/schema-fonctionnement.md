# RADAR - Schéma de fonctionnement du système

> Document destiné au rapport. Un schéma global, puis deux schémas de flux
> détaillés (onboarding et cycle de veille).

---

## SCHÉMA GLOBAL : vue d'ensemble du système

```
                         +-------------------+
                         |   UTILISATEUR     |
                         +---------+---------+
                                   |  navigateur (HTTPS)
                                   v
   +==============================================================================+
   |                        APP NEXT.JS   (port 3000)                             |
   |     Dashboard  .  Comptes  .  Formulaires  .  Cron 6h00  .  Diffusion         |
   +=====+=====================================+=========================+========+
         |                                     |                         |
  Prisma |                  POST /v1/chat/completions          DIFFUSION  |
  (lecture/                (declenche le moteur)                          v
   ecriture)                                   |              +---------------------+
         v                                     v              |  Email  .  PDF      |
   +===============+        +==========================================+============+
   |  PostgreSQL   |        |          OPENCLAW  -  moteur IA  (port 18789)         |
   |  base unique  |        |          LLM : DeepSeek V4 Pro                        |
   +===============+        |                                                      |
         ^                  |   +-----------------+                                |
         |                  |   |  ORCHESTRATEUR  |  coordonne (sessions_spawn)    |
         |                  |   +--------+--------+                                |
         |                  |            |                                         |
         |                  |   onboarding (1 fois) :  [ deep-research ]           |
         |                  |                                                      |
         |  POST            |   cycle quotidien (6 agents en chaine) :             |
         |  /api/internal/* |   collecteur > evaluateur > pestel >                 |
         +------------------+   signaux > swot > redacteur                         |
            (resultats          |                                                  |
             des agents)        +-----|--------------------------------------------+
                                      |  web_search / web_fetch
                                      v
                             +==========================+
                             |  RECHERCHE WEB           |
                             |  Tavily (+ DuckDuckGo)   |
                             +==========================+
```

**Lecture rapide :** l'utilisateur agit sur Next.js ; Next.js déclenche OpenClaw
et écrit dans PostgreSQL ; OpenClaw (cerveau DeepSeek) cherche sur le web via
Tavily, fait travailler ses agents, puis renvoie chaque résultat à Next.js ;
Next.js diffuse le rapport (dashboard, email, PDF).

---

## Les 3 briques du système

Avant les schémas, il faut retenir que RADAR repose sur trois composants qui
tournent ensemble (conteneurs Docker) et ne se parlent que de proche en proche :

| Brique | Rôle en une phrase |
|---|---|
| **APP Next.js** | L'application web (dashboard, comptes, formulaires). C'est elle qui parle à la base de données et déclenche le moteur IA. |
| **OpenClaw (moteur IA)** | Le cerveau autonome. Il héberge les 8 agents qui cherchent, analysent et rédigent. |
| **PostgreSQL** | La base de données, mémoire unique du système. Seul Next.js y écrit (via Prisma). |

Règle de communication : OpenClaw parle à Next.js (HTTP), Next.js parle à
PostgreSQL (Prisma), Next.js parle à l'utilisateur (dashboard et email). Chacun
ne dialogue qu'avec son voisin direct.

---

## SCHÉMA 1 : Onboarding (première utilisation)

Se produit **une seule fois par entreprise**, au moment où l'utilisateur crée
son profil. Objectif : construire la fiche d'identité de son entreprise.

```
ONBOARDING - Premiere utilisation (une seule fois)


  [ UTILISATEUR ]
       |
       |  (1) Saisit : nom de son entreprise + site web
       |             + ses concurrents + ses axes de surveillance
       v
  +=================================+
  |        APP NEXT.JS              |   (2) Enregistre un profil minimal,
  |        (dashboard web)          |       puis reveille le moteur IA
  +=================================+
       |
       |  POST /v1/chat/completions
       |  (le profil de depart est inclus dans le message)
       v
  +===================================================================+
  |        OPENCLAW  -  Agent "deep-research"                          |
  |                                                                   |
  |   (3) Cherche l'entreprise sur le web  ........  RECHERCHE WEB     |
  |                                                  (Tavily)          |
  |   (4) Enrichit automatiquement le profil :                        |
  |         . secteur d'activite                                      |
  |         . produits et services                                   |
  |         . marches et positionnement                              |
  |         . concurrents non cites par l'utilisateur                |
  +===================================================================+
       |
       |  POST /api/internal/profil
       |  (le profil enrichi complet)
       v
  +=================================+
  |        APP NEXT.JS              |   (5) Ecrit le profil definitif
  |                                |       en base via Prisma
  +=================================+
       |
       v
  +=================================+
  |        PostgreSQL              |   ProfilUtilisateur
  |        (base de donnees)       |   -> stockage PERMANENT,
  |                                |      reutilise a chaque cycle de veille
  +=================================+
```

**À retenir :** le deep-research ne tourne qu'une fois. Le profil qu'il produit
devient la mémoire de référence, réinjectée automatiquement dans chaque cycle
quotidien (schéma 2).

---

## SCHÉMA 2 : Cycle de veille quotidien (récurrent)

Se produit **chaque matin à 6h00**, automatiquement, pour chaque utilisateur
actif. C'est le cœur du produit : 6 agents se passent le relais pour produire
un rapport complet.

```
CYCLE DE VEILLE QUOTIDIEN - recurrent (chaque matin a 6h00)


  DECLENCHEUR
  +-------------------------------------+
  |  Cron 6h00 (gere par Next.js)       |
  |            OU                       |
  |  Bouton "Lancer" (utilisateur)      |
  +------------------+------------------+
                     |
                     v
  +=================================+
  |        APP NEXT.JS              |   Recupere le profil en base,
  |                                |   cree un identifiant de rapport,
  |                                |   reveille le moteur IA avec le profil
  +=================================+
       |
       |  POST /v1/chat/completions
       v
  +===========================================================================+
  |   OPENCLAW  -  Agent ORCHESTRATEUR                                         |
  |   (chef d'orchestre : il coordonne, il ne fait aucune analyse lui-meme)   |
  |                                                                           |
  |   Il lance les 6 sous-agents l'un apres l'autre, dans cet ordre :         |
  |                                                                           |
  |   (1) COLLECTEUR ........ cherche les actualites des concurrents          |
  |          |                sur le web (Tavily, DuckDuckGo en secours)      |
  |          v                                                                |
  |   (2) EVALUATEUR ........ note chaque source avec la grille CRAAP         |
  |          |                (fraicheur, pertinence, autorite, exactitude,   |
  |          v                 intention) et ecarte les sources faibles       |
  |   (3) ANALYSTE PESTEL ... analyse le secteur selon 6 facteurs :           |
  |          |                Politique, Economique, Social, Technologique,   |
  |          v                Environnemental, Legal                          |
  |   (4) DETECTEUR SIGNAUX . repere les tendances emergentes                 |
  |          |                (signaux faibles : intensite et horizon)        |
  |          v                                                                |
  |   (5) ANALYSTE SWOT ..... construit le SWOT (Forces, Faiblesses,          |
  |          |                Opportunites, Menaces)                          |
  |          |                <-- recoit le PESTEL + les signaux en entree    |
  |          v                                                                |
  |   (6) REDACTEUR ......... redige le rapport de synthese final             |
  +===========================================================================+
       |
       |  A CHAQUE etape, l'agent renvoie ses resultats a Next.js :
       |    . POST /api/internal/sources | pestel | signaux | swot
       |    . POST /api/internal/rapport/progresse  (avancement temps reel)
       |    . POST /api/internal/rapport/termine    (rapport final)
       |    . POST /api/internal/rapport/echec      (si une etape plante)
       v
  +=================================+
  |        APP NEXT.JS              |   Ecrit tout en base (Prisma)
  |                                |   et met a jour le dashboard en direct
  +=================================+
       |
       +---------------------------+----------------------------+
       v                                                        v
  +=========================+                       +========================+
  |     PostgreSQL          |                       |      DIFFUSION         |
  |     (base de donnees)   |                       |   . Dashboard web      |
  |   . Rapport             |                       |   . Digest email (7h)  |
  |   . Sources + CRAAP     |                       |   . Export PDF         |
  |   . SWOT / PESTEL       |                       +========================+
  |   . Signaux faibles     |
  +=========================+
```

**Point clé de l'ordre des agents :** le SWOT est produit **après** le PESTEL et
les signaux faibles, et non avant. Raison : il reçoit le contexte sectoriel
(PESTEL) et les tendances émergentes (signaux) pour bâtir des Opportunités et
des Menaces mieux fondées.

**Gestion des erreurs :** si un agent dépasse son temps ou échoue,
l'orchestrateur arrête le pipeline et signale l'échec
(`POST /api/internal/rapport/echec`). Les étapes déjà terminées restent
enregistrées en base : rien n'est perdu.

---

## Légende des flèches

| Symbole | Signification |
|---|---|
| `|` puis `v` | Sens du flux (qui appelle qui, dans l'ordre) |
| `POST /v1/chat/completions` | Next.js réveille le moteur OpenClaw |
| `POST /api/internal/...` | Un agent renvoie ses résultats à Next.js |
| `<--` | Donnée transmise en entrée à un agent (ex : PESTEL fourni au SWOT) |

---

## Correspondance avec le cycle de veille M244

Les deux schémas appliquent les 5 étapes du cycle de veille du cours :

| Étape M244 | Où dans RADAR |
|---|---|
| 1. Identification des besoins | Onboarding + deep-research (schéma 1) |
| 2. Collecte | Agent Collecteur (schéma 2, étape 1) |
| 3. Analyse et traitement | Évaluateur CRAAP + PESTEL + Signaux + SWOT (étapes 2 à 5) |
| 4. Diffusion et exploitation | Rédacteur + dashboard / email / PDF (étape 6 + diffusion) |
| 5. Mise à jour continue | Le cycle se relance chaque matin à 6h00 |
