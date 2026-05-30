# SPEC — Sprint 03 : Dashboard de veille

**Projet** : RADAR — Outil de veille concurrentielle propulsé par OpenClaw
**Version** : 1.0
**Priorité** : Critique (Must V1, F4 du PRD § 7.5)
**Responsable spec** : Karamo Sylla
**Responsable implémentation** : Claude Code
**Date** : Mai 2026
**Cadre académique** : Module M244 (Veille Technologique), ENSA Tétouan
**Persona principal** : Karim Berrada, fondateur de Marka Logistics (continuité sprints 01-02)

---

## 1. Objectif

Implémenter le **dashboard de veille** RADAR : la vue principale post-login que l'utilisateur consultera tous les matins après réception du digest. C'est **le livrable visible** qui prouve la valeur du produit au jury M244 et au persona Dirigeant PME.

Le sprint produit **5 écrans pixel-perfect** alignés sur le design `RADAR Dashboard.html` (`.tmp-design/dashboard/radar/project/dash-*.jsx|css`) :

1. **Dashboard nominal** — feed des mouvements détectés du dernier cycle, filtres, stats, pagination
2. **Dashboard J0** — empty state « Le radar tourne en sourdine » + banner countdown vers le premier cycle + modal config notifs
3. **Signaux faibles** — vue tabulaire groupée par intensité (forte / moyenne / faible)
4. **Détail concurrent** (`/competitors/[id]`) — header riche, tabs SWOT/Timeline/Mouvements/Sources, grille SWOT 2×2 colorée
5. **Drawer mouvement** — drawer latéral 540px slide-in avec synthèse, sources collectées, table CRAAP par dimension

Le sprint est **découpé en 2 sous-phases** :

- **3.A — UI + mocks (livrable principal jury)** : les 5 écrans avec données mockées en TypeScript. Composants réutilisables, schéma Prisma complet, Server Actions stubs. Ce qu'on présente en soutenance.
- **3.B — Branchement données réelles (différé)** : lecture Prisma, polling 60s pendant un cycle, persistance des actions user (save/view/ignore). À faire quand Bachirou aura câblé le premier cycle OpenClaw.

Au terme du sprint 3.A, l'utilisateur peut **naviguer dans les 5 écrans avec des données crédibles Maroc/Maghreb B2B**, démontrer la mécanique au jury, et le branchement réel devient une simple substitution de la couche data.

---

## 2. User Stories (résumé)

| #      | En tant que...                 | Je veux...                                                                         | Afin de...                                      |
| ------ | ------------------------------ | ---------------------------------------------------------------------------------- | ----------------------------------------------- |
| US-D01 | Utilisateur jour 1 (matin AHA) | voir le feed des mouvements détectés cette nuit                                    | constater la valeur produit dès le 1er digest   |
| US-D02 | Utilisateur pressé             | voir les stats du jour en haut du dashboard                                        | comprendre l'amplitude de la nuit en 3 secondes |
| US-D03 | Utilisateur méthodique         | filtrer le feed par concurrent / axe / score CRAAP / statut / période              | me concentrer sur ce qui m'intéresse            |
| US-D04 | Utilisateur stratège           | distinguer les mouvements **critiques** (border-left teal/safran) des standards    | prioriser ma lecture                            |
| US-D05 | Utilisateur méthodique         | marquer chaque mouvement (sauvegarder, vu, ignorer)                                | tenir mon flux de travail                       |
| US-D06 | Utilisateur curieux            | cliquer sur un mouvement pour voir le détail dans un drawer                        | comprendre les sources et le scoring CRAAP      |
| US-D07 | Utilisateur technique          | voir le détail CRAAP par dimension (Currency/Relevance/Authority/Accuracy/Purpose) | valider la rigueur méthodologique M244          |
| US-D08 | Utilisateur stratège           | accéder à la fiche complète d'un concurrent                                        | voir sa SWOT et son historique 90 jours         |
| US-D09 | Utilisateur stratège           | consulter les signaux faibles groupés par intensité                                | détecter les tendances émergentes (M244 chap 1) |
| US-D10 | Utilisateur jour 0             | voir un empty state poétique avec countdown vers le 1er cycle                      | savoir que je n'ai rien raté, juste à attendre  |
| US-D11 | Utilisateur jour 0             | configurer mes notifications dans une modale guidée                                | régler le digest avant le 1er rapport           |
| US-D12 | Utilisateur jour 2 (avant 7h)  | voir un banner « Cycle en cours · étape 3/5 »                                      | comprendre que le rapport arrive                |
| US-D13 | Utilisateur revenu             | recevoir un rappel discret pour vérifier mon email                                 | sécuriser mon compte sans friction              |

Le cahier détaillé : [`USER-STORIES-Sprint03-Dashboard.md`](./USER-STORIES-Sprint03-Dashboard.md).

---

## 3. Écrans concernés

| #   | Écran                    | Route                                        | Auth                     | Layout                                           |
| --- | ------------------------ | -------------------------------------------- | ------------------------ | ------------------------------------------------ |
| 1   | Dashboard nominal (Feed) | `/dashboard` (tab `feed`)                    | Oui + onboarding complet | Sidebar 248px + main scrollable                  |
| 2   | Dashboard J0             | `/dashboard` (cycleState=idle)               | Oui                      | Idem + empty state radar SVG + modal optionnelle |
| 3   | Signaux faibles          | `/dashboard/signals` (tab `weak`)            | Oui                      | Idem + grid 2 colonnes                           |
| 4   | Détail concurrent        | `/competitors/[id]` (tab SWOT par défaut)    | Oui                      | Idem + header riche + tabs                       |
| 5   | Détail mouvement         | overlay drawer 540px sur `/dashboard?mvt=ID` | Oui                      | Drawer slide-in droite + backdrop                |

**Source de vérité design** : `.tmp-design/dashboard/radar/project/`

- `dash-styles.css` (348 lignes) — feuille de styles complète (sidebar, header, cards, drawer, modal, animations)
- `dash-chrome.jsx` (208 lignes) — Sidebar, Header, 3 banderoles (J0, cycle progress, email verif)
- `dash-components.jsx` (148 lignes) — `CraapScoreBadge`, `AxisBadge`, `CompetitorBadge`, `StatCard`, `FilterDropdown`, `FilterChip`, `MovementCard`
- `dash-screens.jsx` (456 lignes) — 5 écrans + sous-composants `DashboardTabs`, `StatsRow`, `FilterBar`, `FeedHeader`, `Pagination`, `WeakSignalCard`, `SwotCell`, `MovementDrawer`, `NotifConfigModal`
- `dash-icons.jsx` (74 lignes) — 40+ icônes Lucide-style + tokens AXES (5 axes avec leurs couleurs et icônes)
- `dash-mock.jsx` (138 lignes) — données mock Maroc/Maghreb B2B : 8 mouvements, 5 signaux faibles, 2 sources, 1 SWOT (Inwi)

À **réimplémenter en TSX/Tailwind v4** sous `apps/web/`. Le copy français, les couleurs hex, les coordonnées SVG et les durées d'animation doivent être préservés à l'identique.

---

## 4. Livrables techniques

### 4.1 Schéma Prisma — nouvelles entités (préparation pour sprint 04)

| Table                    | Champs principaux                                                                                                                                                                                                                                                        | Notes                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `VeilleCycle`            | `id`, `userId`, `startedAt`, `endedAt?`, `status` (`'pending'\|'running'\|'completed'\|'failed'`), `currentStep?`, `progressionPct`                                                                                                                                      | 1 cycle par jour, créé à 06:00 par cron OpenClaw au sprint 04. `@@index([userId, startedAt desc])` |
| `Movement`               | `id`, `cycleId`, `competitorId`, `axis` (enum), `title`, `extract` Text, `sources` String[] (URLs), `craapScore` Float, `status` (`'NEW'\|'VIEWED'\|'SAVED'\|'IGNORED'`), `valid` Bool (≥2 sources), `critique` Bool, `viewedAt?`, `savedAt?`, `ignoredAt?`, `createdAt` | Le coeur du dashboard. `@@index([cycleId, axis])`, `@@index([competitorId, createdAt desc])`       |
| `Source`                 | `id`, `movementId`, `url`, `domain`, `title`, `extract?` Text, `publishedAt?`, `craapTotal` Float, `craapCurrency`, `craapRelevance`, `craapAuthority`, `craapAccuracy`, `craapPurpose` (Int 1-10)                                                                       | 1-N par Movement. La grille CRAAP M244 chap 3.                                                     |
| `SWOTSnapshot`           | `id`, `competitorId`, `cycleId`, `snapshotDate`, `strengths` String[], `weaknesses` String[], `opportunities` String[], `threats` String[]                                                                                                                               | 1 par concurrent par cycle. `@@index([competitorId, snapshotDate desc])`                           |
| `WeakSignal`             | `id`, `userId`, `intitule`, `description` Text, `intensity` (`'strong'\|'medium'\|'weak'`), `horizon` (`'short'\|'medium'\|'long'`), `competitorIds` String[], `sourceCount` Int, `axesImpliques` String[], `detecteLe`, `expireLe?` (auto +30j)                         | Détecté par sous-agent #7 OpenClaw. Expire à T+30j sans renouvellement.                            |
| `NotificationPreference` | `id`, `userId @unique`, `digestFrequency` (`'daily'\|'weekly'\|'never'`), `emailDigest`, `criticalAlertsOnly` Bool, `configuredAt?`                                                                                                                                      | Réglé via la modale J0. Persisté pour Resend (sprint 04).                                          |

Migration : `pnpm --filter @radar/database exec prisma db push`. Pas de migration formelle pour le sprint 02, on push direct sur Neon.

### 4.2 Couche data (mocks + Server Actions stubs)

| Fichier                                 | Contenu                                                                                                                                                                                                                                                         |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web/src/lib/dashboard/mocks.ts`   | Réplique de `dash-mock.jsx` typée TypeScript (Movement, WeakSignal, Source, SWOT). Données Maroc/Maghreb B2B : 8 mouvements (Inwi, Roland Berger, Wafa Salaf, BMCE BOA, Bank Al-Maghrib, Maroc Telecom, CIH Bank, Attijariwafa), 5 signaux faibles, 1 SWOT Inwi |
| `apps/web/src/lib/dashboard/queries.ts` | Server-only helpers `getDashboardData(userId)`, `getMovements(userId, filters)`, `getCompetitor(id)`, `getWeakSignals(userId)`. Sprint 3.A : retourne les mocks. Sprint 3.B : lit Prisma.                                                                       |
| `apps/web/src/lib/actions/dashboard.ts` | Server Actions : `markMovementViewed(id)`, `markMovementSaved(id)`, `markMovementIgnored(id)`, `launchCycle()`, `saveNotificationPreference(input)`. Sprint 3.A : log + revalidatePath. Sprint 3.B : update Prisma.                                             |
| `apps/web/src/lib/dashboard/filters.ts` | Types et helpers pour les filtres URL (Nuqs) : `MovementFilters` (concurrent[], axis[], periode, craapMin, statut[], sortBy)                                                                                                                                    |

### 4.3 Pages Next.js

| Route                | Fichier                                            | Type                                                                                                                           |
| -------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `/dashboard`         | `apps/web/src/app/(app)/dashboard/page.tsx`        | Server Component, garde onboarding + état J0/nominal selon présence de cycles, branche selon `?tab=feed\|weak-signals\|cycles` |
| `/dashboard/signals` | (alias `/dashboard?tab=weak-signals`)              | Idem, force le tab `weak-signals`                                                                                              |
| `/competitors/[id]`  | `apps/web/src/app/(app)/competitors/[id]/page.tsx` | Server Component, charge le concurrent + son SWOT + ses mouvements 90j                                                         |
| Layout group `(app)` | `apps/web/src/app/(app)/layout.tsx`                | Garde session + onboarding + wrapper sidebar + header                                                                          |

### 4.4 Composants chrome (sidebar, header, banners) — 8 fichiers

| #     | Composant                                                           | Fichier                                                           |
| ----- | ------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 4.4.1 | `AppShell`                                                          | `apps/web/src/components/dashboard/app-shell.tsx`                 |
| 4.4.2 | `AppSidebar` (250px, 4 nav items + cycle card + user)               | `apps/web/src/components/dashboard/app-sidebar.tsx`               |
| 4.4.3 | `AppHeader` (titre/breadcrumb + search + cycle btn + bell + avatar) | `apps/web/src/components/dashboard/app-header.tsx`                |
| 4.4.4 | `SidebarCycleCard` (3 états : idle, running, completed)             | `apps/web/src/components/dashboard/sidebar-cycle-card.tsx`        |
| 4.4.5 | `EmailVerificationBanner`                                           | `apps/web/src/components/dashboard/email-verification-banner.tsx` |
| 4.4.6 | `CycleProgressBanner` (étape 3/5, % progress, message refresh 7h)   | `apps/web/src/components/dashboard/cycle-progress-banner.tsx`     |
| 4.4.7 | `DayZeroBanner` (countdown vers 06:00 du lendemain)                 | `apps/web/src/components/dashboard/day-zero-banner.tsx`           |
| 4.4.8 | `Avatar` (initiales, taille variable)                               | `apps/web/src/components/dashboard/avatar.tsx`                    |

### 4.5 Composants réutilisables (cards, badges) — 8 fichiers

| #     | Composant                    | Fichier                 | Description                                                                                                                     |
| ----- | ---------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 4.5.1 | `CraapScoreBadge` (sm/md/lg) | `craap-score-badge.tsx` | Cercle bordé color-coded + score + 5 stars                                                                                      |
| 4.5.2 | `AxisBadge`                  | `axis-badge.tsx`        | Pill couleur axe avec icône + label                                                                                             |
| 4.5.3 | `CompetitorBadge`            | `competitor-badge.tsx`  | Avatar 18px lettre + nom                                                                                                        |
| 4.5.4 | `StatCard`                   | `stat-card.tsx`         | Icône colorée + label + value + change (TrendingUp/Down)                                                                        |
| 4.5.5 | `FilterDropdown`             | `filter-dropdown.tsx`   | Trigger button avec label + value + chevron, état actif coloré                                                                  |
| 4.5.6 | `FilterChip`                 | `filter-chip.tsx`       | Chip retirable avec X                                                                                                           |
| 4.5.7 | `MovementCard`               | `movement-card.tsx`     | LE composant central : axe + concurrent + time + title + extract + sources + actions + craap, variantes critical/valid/standard |
| 4.5.8 | `WeakSignalCard`             | `weak-signal-card.tsx`  | Border-top color intensity, title, desc, footer flame/sources/axes                                                              |

### 4.6 Composants des écrans — 6 fichiers

| #     | Composant                                 | Fichier                  | Description                                                                       |
| ----- | ----------------------------------------- | ------------------------ | --------------------------------------------------------------------------------- |
| 4.6.1 | `DashboardTabs` (Feed / Signaux / Cycles) | `dashboard-tabs.tsx`     | Tabs avec count badges                                                            |
| 4.6.2 | `StatsRow` (4 stat cards)                 | `stats-row.tsx`          | Variantes nominal et J0                                                           |
| 4.6.3 | `FilterBar`                               | `filter-bar.tsx`         | 5 dropdowns + reset + chips actifs                                                |
| 4.6.4 | `MovementDrawer` (overlay 540px)          | `movement-drawer.tsx`    | Drawer slide-in droite avec synthèse + sources + craap                            |
| 4.6.5 | `SwotGrid` (4 cells colorées)             | `swot-grid.tsx`          | Grille 2×2 (Strengths teal, Weaknesses safran, Opportunities vert, Threats rouge) |
| 4.6.6 | `NotifConfigModal`                        | `notif-config-modal.tsx` | Modale J0 avec radio cards + email input + toggle alertes critiques               |

### 4.7 État URL (filtres + drawer ouvert)

Installer **`nuqs`** (`pnpm add nuqs`) pour piloter l'état des filtres + drawer ouvert via les query params. Permet :

- `/dashboard?tab=feed&concurrent=Inwi,Roland+Berger&craapMin=6&mvt=mvt_01`
- Bookmarking et partage d'un dashboard filtré
- Pas d'état React local pour les filtres → URL = source de vérité

### 4.8 Animations + tokens CSS

Ajouter dans `globals.css` :

| Animation          | Description                                                             |
| ------------------ | ----------------------------------------------------------------------- |
| `rd-spin`          | Rotation 360° infinite (refreshCw du cycle running)                     |
| `rd-pulse-1/2/3/4` | Empty state radar — 4 cercles concentriques pulsant en cascade (J0 SVG) |
| `rd-pulse-dot`     | Dot safran qui clignote (J0 SVG)                                        |
| `drawer-slide-in`  | Drawer slide-in 280ms cubic-bezier(0.16, 1, 0.3, 1)                     |
| `backdrop-fade-in` | Backdrop fade-in 200ms ease-out                                         |
| `mvt-newdot-pulse` | Dot teal pulsant sur les Movement statut NEW                            |

Tokens existants (déjà dans `globals.css` sprint 01-02) : `--color-teal-*`, `--color-safran-*`, axes colors hardcodés (cf `lib/onboarding/axes.ts`).

### 4.9 Dépendances à installer

```bash
pnpm --filter @radar/web add nuqs
```

C'est la seule nouvelle dépendance. `recharts` et `react-email` sont reportés au sprint 04.

---

## 5. Comportements attendus (par écran)

### 5.1 Dashboard nominal (`/dashboard?tab=feed`)

**Précondition** : utilisateur authentifié, onboarding complet, **au moins 1 cycle terminé** existe (`cycleState='completed'`). En sprint 3.A, on simule via `?demo=nominal` ou par défaut.

**Layout (1440×1024 desktop)** :

- **Sidebar 248px gauche** : logo top, section labels « VEILLE » + nav (Dashboard / Concurrents / Signaux faibles / Cycles) avec badges count + section labels « CONFIGURATION » + nav (Paramètres) + `SidebarCycleCard` état `completed` + spacer + user card bas
- **Main column** :
  - `AppHeader` sticky : titre « Dashboard » + search input 320px + bouton « Lancer un cycle » + bell + avatar
  - Contenu scrollable :
    1. `DashboardTabs` (Feed actif, badges 8 / 3 / —)
    2. `StatsRow` 4 cards : `Mouvements ce matin: 12 (+3 vs hier)`, `Sauvegardés: 4`, `CRAAP moyen 30j: 7.4/10 (+0.3)`, `Concurrents suivis: 5`
    3. `FilterBar` : 5 dropdowns + chips actifs (« Concurrent: Inwi », « Concurrent: Roland Berger », « Score: ≥ 6.0 ») + bouton reset
    4. `FeedHeader` : « **8 mouvements** détectés sur la période » + tri « Plus récents »
    5. **Liste de `MovementCard`** (8 cards mock) avec différents états :
       - `critique=true valid=true` (border-left 3px teal pour valid+critique safran ?) → cards Inwi et Roland Berger
       - `valid=true critique=false` (border-left teal) → BMCE BOA, Bank Al-Maghrib, etc.
       - `valid=false` (border-left transparent) → Wafa Salaf, Attijariwafa
       - status `NEW` → dot teal pulsant en coin haut-droit
       - status `VIEWED` → opacity légèrement réduite
       - status `SAVED` → bookmark filled safran
       - status `IGNORED` → strikethrough sur le titre
    6. `Pagination` : « Affichage 1–8 sur 8 mouvements », précédent/suivant disabled

**Interactions Movement card** :

- Hover : `transform: translateY(-2px)` + shadow-lg + dévoile les actions à droite
- Click sur card → ouvre le drawer mouvement (`?mvt=ID` URL state)
- Click bookmark → toggle SAVED, server action `markMovementSaved`
- Click check → toggle VIEWED, server action `markMovementViewed`
- Click X → confirmation tooltip, server action `markMovementIgnored`
- Click flèche → idem que click card (ouvre drawer)

### 5.2 Dashboard J0 (`/dashboard` sans cycle complété)

**Précondition** : utilisateur fraîchement onboardé, aucun cycle terminé.

**Différences vs nominal** :

- Sidebar : `SidebarCycleCard` état `idle` (« Prochain cycle · Demain à 06:00 · 6h 12min »)
- Tabs : badges à 0
- En haut du contenu : `DayZeroBanner` (icône horloge 24px + texte 2 lignes + countdown mono « 6h 12min · avant le démarrage »)
- `StatsRow` variante J0 : valeurs à 0 et `— / 10` avec sublabel « Premier cycle demain »
- Au lieu du feed : `EmptyJ0` :
  - SVG radar 96×96 avec 4 cercles concentriques pulsants en cascade + dot safran clignotant
  - H2 « Le radar tourne en sourdine. »
  - Sub « Notre agent IA prépare votre premier rapport pour demain matin. Pendant ce temps, vous pouvez ajuster vos concurrents ou vos axes de surveillance. »
  - 2 boutons secondaires : « Ajouter des concurrents » + « Modifier mes axes » (liens vers `/settings/competitors` et `/settings/axes` — pages stubs sprint 03)
- **Modal `NotifConfigModal`** : s'affiche automatiquement à la première visite J0 (si `NotificationPreference.configuredAt` est null). Composition :
  - Backdrop noir 70% opacity
  - Card centrée 480px : icône Bell 28px teal en haut + titre + sub
  - Section 1 : « Fréquence du digest » avec 3 radio cards (Quotidien ★ Recommandé / Hebdomadaire / Jamais)
  - Section 2 : « Email destinataire » input email pré-rempli avec l'email du user
  - Section 3 : Toggle « Alertes critiques uniquement »
  - Footer : bouton ghost « Plus tard » + primary « Enregistrer »
  - Au submit : `saveNotificationPreference()` + close modale + toast confirmation

### 5.3 Signaux faibles (`/dashboard?tab=weak-signals` ou `/dashboard/signals`)

**Layout** :

- Sidebar identique
- Header titre « Dashboard » (le tab `weak-signals` est actif)
- `DashboardTabs` (Signaux faibles actif, badge 5 safran)
- En haut du contenu :
  - Page header : icône Radar 24px safran + H2 « Signaux faibles » + sub explicatif (« Tendances émergentes détectées par croisement de sources mineures sur les 30 derniers jours. Cliquez sur un signal pour voir les sources qui le valident. »)
  - `FilterBar` réduite : Intensité / Concurrent / Période
- **3 sections** une par intensité, chacune avec son titre coloré :
  - « Signaux forts » rouge (`#EF4444`) — 2 cards
  - « Signaux moyens » safran (`#F59E0B`) — 2 cards
  - « Signaux faibles à surveiller » gris (`#94A3B8`) — 1 card
- **`WeakSignalCard`** : grid 2 colonnes, chaque card avec :
  - `border-top: 3px solid` couleur intensité
  - Header : nom concurrent ou groupe + « Détecté il y a Xj » mono à droite
  - H3 titre
  - Description ~3 lignes
  - Footer 3 meta : Flame + intensité label, Link + N sources, Network + N axes impliqués

### 5.4 Détail concurrent (`/competitors/[id]`)

**Layout** :

- Sidebar : `Concurrents` actif
- Header : breadcrumb « Concurrents / Inwi »
- Contenu :
  - **Header riche du concurrent** :
    - Avatar 96×96 carré rounded (lettre « I » teal sur bg-elevated avec gradient subtil)
    - À droite : nom H1 « Inwi » + URL mono cliquable + meta row (4 items avec icône : secteur Télécommunications, MapPin Casablanca, Users Taille 1000-5000, CalendarDays Fondé en 2010) + axes badges row
    - Actions row à droite : `Exporter en PDF` (primary) + `Modifier` + `Retirer` (danger ghost)
  - **Tabs du concurrent** : SWOT (actif) / Timeline 90j / Mouvements (badge 14) / Sources
  - **Tab SWOT actif** :
    - Grid 2×2 `SwotCell` :
      - Strengths (teal, ShieldCheck, sublabel mono « INTERNE / POSITIF », 3 items)
      - Weaknesses (safran, AlertTriangle, « INTERNE / NÉGATIF »)
      - Opportunities (vert, TrendingUp, « EXTERNE / POSITIF »)
      - Threats (rouge, Flame, « EXTERNE / NÉGATIF »)
    - Footer SWOT : « Dernière mise à jour : 04 mai 2026 · Cycle #42 » + bouton ghost « Voir l'historique SWOT »

**Tabs Timeline / Mouvements / Sources** : stubs sprint 3.A (afficher « Bientôt disponible » + skeleton). Branchés sprint 3.B.

### 5.5 Détail mouvement — Drawer (`?mvt=ID`)

**Trigger** : click sur une `MovementCard` dans le feed → ajoute `?mvt=mvt_01` à l'URL → drawer s'ouvre.

**Layout drawer** :

- Backdrop noir 60% opacity, click ferme le drawer
- Drawer 540px slide-in droite (animation 280ms cubic-bezier(0.16, 1, 0.3, 1))
- Header drawer : axe badge + concurrent badge + H2 titre + meta mono « Détecté le 04 mai 2026 · Cycle #42 · Vu 0 fois » + `CraapScoreBadge size=lg` à droite + bouton X close
- Actions row : `Sauvegarder` / `Marquer vu` / `Ignorer` (danger) + spacer + Share2 + ExternalLink
- **Section 1 — Synthèse** : H3 + 2 paragraphes (le titre est en strong dans le 1er paragraphe pour mise en évidence)
- **Section 2 — Sources collectées** : H3 + caption « Recoupement : 2 sources distinctes ont confirmé ce mouvement. » + liste de `source-row` (favicon Globe + titre + meta domain·date mono + `CraapScoreBadge size=sm` + ExternalLink)
- **Section 3 — Détail CRAAP par dimension** : H3 + table avec 5 lignes (Currency/Relevance/Authority/Accuracy/Purpose) + barre de progression colorée + score `N/10` mono + ligne total `42/50 → 8.4/10`

---

## 6. Composants réutilisables (rappel synthétique)

22 composants au total, répartis dans :

```
apps/web/src/components/dashboard/
├── app-shell.tsx              ← layout sidebar + main
├── app-sidebar.tsx
├── app-header.tsx
├── sidebar-cycle-card.tsx
├── email-verification-banner.tsx
├── cycle-progress-banner.tsx
├── day-zero-banner.tsx
├── avatar.tsx
├── craap-score-badge.tsx
├── axis-badge.tsx
├── competitor-badge.tsx
├── stat-card.tsx
├── filter-dropdown.tsx
├── filter-chip.tsx
├── movement-card.tsx          ← LE composant central
├── weak-signal-card.tsx
├── dashboard-tabs.tsx
├── stats-row.tsx
├── filter-bar.tsx
├── movement-drawer.tsx
├── swot-grid.tsx
└── notif-config-modal.tsx
```

---

## 7. Filtres URL (Nuqs)

```ts
// apps/web/src/lib/dashboard/filters.ts
import {
  parseAsString,
  parseAsArrayOf,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs/server";

export const tabParser = parseAsStringEnum([
  "feed",
  "weak-signals",
  "cycles",
]).withDefault("feed");
export const concurrentParser = parseAsArrayOf(parseAsString).withDefault([]);
export const axeParser = parseAsArrayOf(parseAsString).withDefault([]);
export const periodeParser = parseAsStringEnum([
  "7d",
  "30d",
  "90d",
  "all",
]).withDefault("7d");
export const craapMinParser = parseAsInteger.withDefault(0);
export const statutParser = parseAsArrayOf(parseAsString).withDefault([]);
export const sortParser = parseAsStringEnum([
  "recent",
  "craap",
  "axe",
]).withDefault("recent");
export const mvtParser = parseAsString; // ID du Movement ouvert dans le drawer
```

URL exemple : `/dashboard?tab=feed&concurrent=Inwi&concurrent=Roland%20Berger&craapMin=6&mvt=mvt_01`

---

## 8. Server Actions (stubs sprint 3.A)

```ts
"use server";
// apps/web/src/lib/actions/dashboard.ts

export async function markMovementViewed(id: string): Promise<ActionResult> {
  // Sprint 3.A : log + revalidatePath
  // Sprint 3.B : prisma.movement.update({ where: { id }, data: { status: 'VIEWED', viewedAt: new Date() }})
}

export async function markMovementSaved(id: string): Promise<ActionResult> {
  /* idem SAVED */
}
export async function markMovementIgnored(id: string): Promise<ActionResult> {
  /* idem IGNORED */
}
export async function launchCycle(): Promise<ActionResult> {
  // Sprint 3.A : log "Cycle demandé"
  // Sprint 3.B : POST /api/internal/cycle/start vers OpenClaw, met VeilleCycle en running
}
export async function saveNotificationPreference(
  input: NotifPrefInput,
): Promise<ActionResult> {
  /* upsert */
}
```

---

## 9. Animations (récap chiffré)

| #   | Animation             | Cible                            | Durée                                          | Easing                                |
| --- | --------------------- | -------------------------------- | ---------------------------------------------- | ------------------------------------- |
| A1  | `rd-spin`             | RefreshCw du cycle running       | 1500ms                                         | linear infinite                       |
| A2  | `rd-pulse-1/2/3/4`    | 4 cercles concentriques empty J0 | 4s ease-in-out infinite (cascade 0/0.5/1/1.5s) | ease-in-out                           |
| A3  | `rd-pulse-dot`        | Dot safran J0                    | 2.4s ease-out infinite                         | ease-out                              |
| A4  | `drawer-slide-in`     | translateX 100% → 0              | 280ms                                          | cubic-bezier(0.16, 1, 0.3, 1)         |
| A5  | `backdrop-fade-in`    | opacity 0 → 1                    | 200ms                                          | ease-out                              |
| A6  | `mvt-newdot-pulse`    | Dot NEW pulsant                  | 1.8s ease-out infinite                         | ease-out                              |
| A7  | `mvt-card-hover`      | translateY(-2px) + shadow        | 200ms                                          | ease-out                              |
| A8  | `cycle-progress-fill` | width 0 → N%                     | 600ms                                          | ease-out (sur changement de progress) |

GPU-friendly : transform et opacity uniquement.

---

## 10. Responsive

| Breakpoint           | Comportement                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------- |
| Desktop ≥ 1280px     | Layout cible 1440×1024 ; sidebar 248px fixe + main fluide                                   |
| Tablette 1024-1279px | Sidebar collapse 64px (icônes seules), tooltip au hover ; main pleine largeur               |
| Tablette 768-1023px  | Sidebar overlay (toggle via menu burger header)                                             |
| Mobile < 768px       | Sidebar overlay ; stats grid 1 colonne ; FilterBar accordéon ; drawer mouvement plein écran |

Sprint 3.A se concentre sur **desktop ≥ 1280px** (parité jury). Le responsive mobile/tablette est un nice-to-have, à parfaire au sprint 04.

---

## 11. Stack imposée (rappel)

- Next.js 16 (App Router, Turbopack, RSC + Server Actions)
- React 19, TypeScript strict + `noUncheckedIndexedAccess`
- Tailwind 4 (CSS-first via `@theme` block)
- Better Auth (déjà branché sprint 01)
- Prisma 6 (workspace `@radar/database`)
- Lucide React (icônes outline 1.5px)
- next/font/local Outfit + JetBrains Mono (déjà configuré)
- **Nouveau** : Nuqs pour l'état URL des filtres + drawer

---

## 12. Arborescence cible (delta sprint 03)

```
apps/web/src/
├── app/
│   ├── (app)/                       ← layout group authentifié + onboardé
│   │   ├── layout.tsx               ← garde session + onboarding + sidebar/header shell
│   │   ├── dashboard/
│   │   │   ├── page.tsx             ← dispatch tab feed | weak-signals | cycles
│   │   │   └── signals/page.tsx     ← alias direct vers tab weak-signals
│   │   └── competitors/
│   │       └── [id]/page.tsx        ← détail concurrent + tabs
│   └── ...                          ← autres routes existantes
├── components/dashboard/             ← 22 composants (cf § 6)
└── lib/
    ├── dashboard/
    │   ├── mocks.ts                 ← données Maroc/Maghreb B2B
    │   ├── queries.ts                ← getDashboardData, getMovements, getCompetitor
    │   └── filters.ts                ← parsers Nuqs typés
    └── actions/
        └── dashboard.ts              ← markMovementViewed/Saved/Ignored, launchCycle, saveNotifPref

packages/database/prisma/schema.prisma  ← + 6 nouvelles entités (cf § 4.1)
```

---

## 13. Variables d'environnement

Aucune nouvelle variable. Au sprint 04, on ajoutera `RESEND_API_KEY` (digest) et `RADAR_INTERNAL_SECRET` (callbacks OpenClaw).

---

## 14. Critères d'acceptation

### Sprint 3.A (UI + mocks)

- [ ] **14.1** Les 5 écrans du design sont reproduits pixel-perfect (tolérance ±2px paddings, ±20ms animations) — comparaison avec `RADAR Dashboard.html` ouvert en parallèle
- [ ] **14.2** Sidebar 248px : 4 nav items VEILLE + cycle card état `completed`/`running`/`idle` + user card. Hover et active states fonctionnels.
- [ ] **14.3** Header : titre / breadcrumb + search input + bouton « Lancer un cycle » (rate-limited si cycle <2h ago) + bell + avatar
- [ ] **14.4** Dashboard nominal : tabs + 4 stats + filterbar + chips actifs + 8 movement cards de différents statuts/variantes + pagination
- [ ] **14.5** Movement card : 4 actions visibles au hover (bookmark/check/X/arrow) + click sur card ouvre le drawer (`?mvt=ID`)
- [ ] **14.6** Dashboard J0 : empty state SVG radar avec 4 cercles pulsants + countdown live (mise à jour chaque seconde) + modal config notifs déclenchable
- [ ] **14.7** Modal config : 3 radio cards + email input + toggle alertes critiques + Plus tard / Enregistrer
- [ ] **14.8** Signaux faibles : 3 sections par intensité (forte rouge / moyenne safran / faible gris) avec WeakSignalCard correctement colorées
- [ ] **14.9** Détail concurrent : header riche avec 4 meta + axes + 3 actions, tabs SWOT/Timeline/Mouvements/Sources, grid SWOT 2×2 colorée
- [ ] **14.10** Drawer mouvement : slide-in 280ms, synthèse + sources + table CRAAP 5 dimensions
- [ ] **14.11** Filtres URL via Nuqs : copier-coller l'URL filtrée la restaure
- [ ] **14.12** Server Actions stubs : log côté serveur + revalidatePath. UI optimiste mockée.
- [ ] **14.13** Type-check, build, lint propres
- [ ] **14.14** Schéma Prisma migré sur Neon (`db push`) — nouvelles tables vides

### Sprint 3.B (différé, branchement données réelles)

- [ ] **14.15** `getDashboardData()` lit Prisma au lieu des mocks
- [ ] **14.16** Server Actions persistent réellement (status, viewedAt, savedAt, ignoredAt)
- [ ] **14.17** Polling 60s sur `/dashboard` quand un `VeilleCycle` est en `running`, refresh du feed
- [ ] **14.18** `launchCycle()` POST vers OpenClaw `/v1/chat/completions` (cycle on-demand)

---

## 15. Hors scope (différé sprints ultérieurs)

- **Cycle réel OpenClaw** (sprint 04 — F3 du PRD § 7.4) : exécution des 5 sous-agents, callbacks `/api/internal/*`, persistance des Movement / Source / SWOT / WeakSignal
- **Digest email** (sprint 04 — F5 du PRD § 7.6) : templates React Email, envoi via Resend à 7h après chaque cycle
- **Export PDF** (sprint 05) : génération PDF du rapport quotidien et de la SWOT
- **Pages Settings** (sprint 09 — F7 du PRD § 7.8) : édition profil, CRUD concurrents, axes
- **Tabs Timeline / Mouvements / Sources** sur le détail concurrent : stubs en sprint 03, branchés sprint 04
- **Recherche full-text** dans le header search input : stub (input visible, pas de logique)
- **Notifications in-app** (bell) : stub (cloche visible, pas de panel)
- **Tests Playwright** : sprint 10 ou continu binôme
- **Responsive mobile/tablette < 1024px** : nice-to-have sprint 03, à finaliser sprint 04

---

## 16. Dépendances

```bash
pnpm --filter @radar/web add nuqs
```

Tout le reste est déjà installé (sprints 01-02). Pas d'ajout au sprint 3.A.

Sprint 3.B ajoutera : (rien de plus côté apps/web ; OpenClaw côté Bachirou).
Sprint 04 ajoutera : `resend`, `react-email` pour le digest. Sprint 05 ajoutera `@react-pdf/renderer` ou équivalent.

---

## 17. Références

- PRD § 5.4 (Phase 3 : Premier cycle de veille)
- PRD § 5.5 (Phase 4 : Routine établie)
- PRD § 5.6 (Le moment AHA — moment de bascule J+1 → J+2)
- PRD § 7.4 (F3 : Cycle de veille quotidien)
- PRD § 7.5 (F4 : Dashboard et feed d'alertes)
- PRD § 8 (Modèle de données — VeilleCycle, Movement, Source, SWOTSnapshot, WeakSignal)
- Charte graphique : `Branding/CHARTE_GRAPHIQUE_RADAR.md`
- Design source de vérité : `.tmp-design/dashboard/radar/project/` (RADAR Dashboard.html + 6 fichiers JSX/CSS)
- Sprint 02 (continuité) : `docs/Sprint-02/SPEC-Sprint02-Onboarding.md`
- KARAMO.md (architecture binôme : OpenClaw image, endpoints `/api/internal/*`)
