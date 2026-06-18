# Charte Graphique · RADAR

> **Radar Editorial · Design System**
> Direction artistique : **navy + royal blue**, codes éditoriaux inspirés des cabinets de stratégie (McKinsey & Company, BCG, Bain).
> _Vos concurrents bougent. Radar vous le dit avant tout le monde._

|                          |                                                       |
| ------------------------ | ----------------------------------------------------- |
| **Projet**               | RADAR — Veille concurrentielle propulsée par OpenClaw |
| **Cadre académique**     | Module M244 · ENSA Tétouan · Cycle Ingénieur BDIA     |
| **Auteurs**              | Karamo Sylla & Bachirou Konaté                        |
| **Encadrant**            | Pr. Younes Wadiai                                     |
| **Direction artistique** | Cabinets de stratégie _(référence visuelle)_          |
| **Date**                 | Mai 2026                                              |

---

## Sommaire

| #   | Section                                           | Sujet                                                            |
| --- | ------------------------------------------------- | ---------------------------------------------------------------- |
| 01  | [Direction Artistique](#01--direction-artistique) | Mantra, principes, attributs                                     |
| 02  | [Palette de Couleurs](#02--palette-de-couleurs)   | Navy, royal blue, neutres, sémantiques, PESTEL, SWOT, catégories |
| 03  | [Typographie](#03--typographie)                   | Fraunces, Inter, JetBrains Mono, hiérarchie éditoriale           |
| 04  | [Iconographie](#04--iconographie)                 | Lucide Icons et 15 icônes signatures                             |
| 05  | [Espacements & Layout](#05--espacements--layout)  | Système 4px, sidebar, breakpoints                                |
| 06  | [Composants UI](#06--composants-ui)               | Boutons, cards, inputs, badges, composants signatures            |
| 07  | [Variables CSS](#07--variables-css)               | Tokens prêts à brancher dans Tailwind v4                         |

---

## 01 · Direction Artistique

> _« Cartographier les mouvements concurrents avec la rigueur d'un cabinet de stratégie. Radar mesure, qualifie, hiérarchise — sans dramatiser. »_

### Positionnement

Radar est un outil de veille concurrentielle premium et méthodologique : un agent IA autonome qui surveille quotidiennement le web, applique le cycle de veille du module M244 (CRAAP, SWOT, PESTEL, signaux faibles), et livre des rapports actionnables sans intervention humaine.

L'identité visuelle reproduit les codes des cabinets de stratégie : navy profond en fond dominant, royal blue électrique en accent strict, serif éditorial sur les titres et chiffres hero, grotesque institutionnelle sur le corps de texte. Aucun gradient, aucun halo décoratif, aucune illustration générique. La promesse : porter une autorité immédiate auprès des dirigeants PME, consultants indépendants et étudiants en stratégie qui constituent la cible V1 (Maroc et Maghreb francophone).

### Principes directeurs

**01 · Autorité éditoriale**
Hiérarchie typographique forte, serif Display sur les titres et KPI hero, justification soignée. Chaque écran et chaque rapport PDF doit pouvoir être lu comme une publication de référence.

**02 · Sobriété radicale**
Aucune ombre dramatique, aucun gradient, aucune illustration. Le contenu — chiffres, courbes, citations — porte le sens. La couleur n'apparaît que quand elle communique un état, un score ou une action. Plus l'écran est sobre, plus un mouvement détecté ressort comme signal.

**03 · Densité assumée côté analyste, respiration côté décideur**
Le dashboard est un outil dense pour analyste qui consacre une heure quotidienne à sa veille. Les rapports hebdomadaires et les pages publiques (méthode, à propos) s'aèrent pour respecter le lecteur institutionnel. Deux rythmes typographiques pour deux usages.

**04 · Méthodologie visible**
Le cycle CRAAP, les matrices SWOT et PESTEL, les signaux faibles : tous les artefacts du module M244 sont lisibles en un coup d'œil. Disclaimers automatiques sur les sources rejetées, indication systématique de la date de dernière mise à jour, badges de confiance d'extraction visibles. La transparence est un élément graphique à part entière.

### Attributs de marque

|       01       |        02        |      03       |    04     |     05      |
| :------------: | :--------------: | :-----------: | :-------: | :---------: |
| **Méthodique** | **Anticipateur** | **Rigoureux** | **Calme** | **Premium** |

`INSTITUTIONNEL` · `ÉDITORIAL` · `SOBRE` · `RIGOUREUX` · `ANTICIPATEUR`

---

## 02 · Palette de Couleurs

La palette Radar repose sur le couple **navy + royal blue**, signature des cabinets de stratégie. Les neutres (bone, cream, ink, muted) calibrent le contraste typographique. Les couleurs sémantiques restent sobres. Aucune couleur de marque secondaire (plus de safran, plus de teal pulse) : la discipline 60/30/10 garantit que le royal blue reste perçu comme un point d'exclamation visuel.

**Répartition recommandée — 60 / 30 / 10**
60% Navy `#051C2C` (surfaces, fonds) · 30% Bone / Muted (texte, séparateurs) · 10% Royal Blue `#2251FF` (CTA, focus, accent strict).

### Surfaces · Navy

Système dark-first à quatre niveaux. La hiérarchie visuelle se construit par contraste de surface, pas par bordure ou ombre.

| Token      | Hex       | Usage                                                            |
| ---------- | --------- | ---------------------------------------------------------------- |
| `navy`     | `#051C2C` | Background dominant — body, sections, page de couverture rapport |
| `navy-900` | `#0A2540` | Surface élevée — sidebar, header, panels secondaires             |
| `navy-800` | `#133553` | Cards, modals, blocs de données                                  |
| `navy-700` | `#1F4868` | Bordures sur fond dark, séparateurs, hover state subtil          |

### Brand · Royal Blue — `#2251FF`

> **Couleur signature de Radar.**
> Réservée aux éléments d'action (boutons primaires, liens), aux états validés (signal recoupé, score CRAAP supérieur à 7/10), au focus accessibilité, et aux KPI hero. Plafonnée à 10% de la surface d'un écran. Si le royal blue envahit, le signal devient bruit.

| Token         | Hex       | Usage                                                                 |
| ------------- | --------- | --------------------------------------------------------------------- |
| `royal`       | `#2251FF` | **PRIMARY** — CTA, liens, valeurs hero KPI, focus state               |
| `royal-light` | `#4F73FF` | Hover button, badges actifs, highlight ligne dans tables              |
| `royal-dark`  | `#1A3FCC` | Pressed state, charts comparatifs, séparateurs accentués              |
| `royal-soft`  | `#E5EBFF` | Backgrounds informatifs, chips, callouts méthodologiques (mode light) |

### Neutres et texte

Quatre nuances calibrées pour la lecture longue en mode sombre, alignées sur les codes éditoriaux des cabinets de stratégie.

| Token        | Hex       | Usage                                                    |
| ------------ | --------- | -------------------------------------------------------- |
| `bone`       | `#F5F1EB` | Texte principal sur fond navy — titres, corps, valeurs   |
| `cream`      | `#FAF8F3` | Surface light alternative — pages méthode publiques (V2) |
| `ink`        | `#1A1A1A` | Texte principal sur fond clair — rapports imprimés       |
| `ink-soft`   | `#4A4A4A` | Sous-titres, paragraphes secondaires en mode light       |
| `muted`      | `#8FA3B8` | Métadonnées, sous-titres sur fond navy, légendes         |
| `muted-soft` | `#6B7280` | Captions, timestamps, footers, labels axes graphiques    |

### Bordures

| Token           | Hex       | Usage                                                      |
| --------------- | --------- | ---------------------------------------------------------- |
| `border`        | `#1F4868` | Bordures par défaut (cards, inputs, tables) — = `navy-700` |
| `border-strong` | `#2251FF` | Focus rings (2px), séparateurs accentués — = `royal`       |

### Sémantiques

Couleurs de système réservées aux feedbacks fonctionnels. Calibrées pour respecter la sobriété éditoriale (pas de néons saturés).

| Token     | Hex       | Usage                                                       |
| --------- | --------- | ----------------------------------------------------------- |
| `success` | `#0F8F65` | Confirmation d'action, validation, source recoupée          |
| `warning` | `#C77700` | Alerte non-bloquante, source à vérifier, échantillon faible |
| `error`   | `#B42318` | Échec critique, source rejetée, CRAAP < 4/10                |
| `info`    | `#2251FF` | Information neutre, callout méthodologique (= `royal`)      |

### Couleurs métier · PESTEL

Six couleurs distinctes recalibrées pour cohérence McKinsey-fit. Choisies pour rester lisibles sur navy comme sur fond clair, sans recourir à l'arc-en-ciel.

| Dimension           | Hex       | Domaine                                                 |
| ------------------- | --------- | ------------------------------------------------------- |
| **Politique**       | `#B42318` | Réglementations, élections, géopolitique                |
| **Économique**      | `#C77700` | Inflation, taux, conjoncture, levées de fonds           |
| **Social**          | `#4A1D6E` | Démographie, consommation, RSE                          |
| **Technologique**   | `#2251FF` | Innovations, brevets, transformation digitale (= royal) |
| **Environnemental** | `#0F8F65` | Climat, normes vertes, économie circulaire              |
| **Légal**           | `#1A3FCC` | Lois, jurisprudence, conformité (RGPD)                  |

### Couleurs métier · SWOT

Quatre couleurs calibrées sur les sémantiques pour une lecture immédiate.

| Cadran            | Hex       | Sens                                                  |
| ----------------- | --------- | ----------------------------------------------------- |
| **Strengths**     | `#2251FF` | Forces du concurrent (interne, positif) — royal       |
| **Weaknesses**    | `#C77700` | Faiblesses du concurrent (interne, négatif) — warning |
| **Opportunities** | `#0F8F65` | Opportunités de marché (externe, positif) — success   |
| **Threats**       | `#B42318` | Menaces concurrentielles (externe, négatif) — error   |

### Catégories de mouvement (composant `MovementRow`)

Cinq catégories signature pour qualifier un mouvement détecté. Palette McKinsey-fit, pas d'arc-en-ciel : on s'appuie sur royal + neutres + sémantiques.

| Catégorie           | Hex       | Sens                                               |
| ------------------- | --------- | -------------------------------------------------- |
| **Pricing**         | `#C77700` | Changement de tarif, promotion, refonte abonnement |
| **Produit**         | `#2251FF` | Nouvelle feature, refonte, lancement               |
| **Recrutement**     | `#4A1D6E` | Hiring spree, profils stratégiques, départs clés   |
| **Levée / Finance** | `#0F8F65` | Levée de fonds, M&A, résultats financiers          |
| **Communication**   | `#8FA3B8` | Campagne, partenariat, PR, présence salon          |

### Règle de répartition 60 / 30 / 10

Pour chaque écran, la répartition des couleurs doit suivre cette règle :

- **60%** — Surfaces navy (`navy` + `navy-900`).
- **30%** — Texte (`bone` + `muted`), bordures (`navy-700`), surfaces élevées (`navy-800`).
- **10%** — Royal blue + sémantiques. Si on dépasse 10%, on bruite l'écran et on perd le signal.

---

## 03 · Typographie

La typographie de Radar reproduit l'autorité éditoriale des cabinets de stratégie. Trois polices, chacune avec un rôle précis — pas de chevauchement, pas de fantaisie. Toutes open source (SIL OFL), disponibles via Google Fonts ou auto-hébergées dans `apps/web/public/fonts/` pour zéro dépendance externe en production.

### Polices retenues

| Rôle          | Police                       | Sens éditorial                                                                                                                                 |
| ------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Display**   | **Fraunces** (Variable, OFL) | Serif éditorial contemporain — titres de section, KPI hero, citations méthodologiques. Évoque l'autorité de Bower (McKinsey) ou Tiempos (BCG). |
| **Body / UI** | **Inter** (Variable, OFL)    | Grotesque neutre institutionnelle — paragraphes, valeurs UI, formulaires, tables. Équivalent libre de McKinsey Sans / Theinhardt.              |
| **Mono**      | **JetBrains Mono** (OFL)     | Chiffres tabular figures, codes pays, hex de couleurs, scores CRAAP, blocs de code.                                                            |

### Hiérarchie typographique

| Niveau      | Taille / poids                                 | Police         | Usage                                                                  |
| ----------- | ---------------------------------------------- | -------------- | ---------------------------------------------------------------------- |
| **Display** | 64px / Light (300)                             | Fraunces       | Numéro hero d'un KPI (BriefBar dashboard), titre de couverture rapport |
| **H1**      | 40px / Regular (400)                           | Fraunces       | Titre principal de page (Dashboard, Concurrents, Reports)              |
| **H2**      | 28px / Regular (400)                           | Fraunces       | Titre de section (« Mouvements détectés »), titre de card              |
| **H3**      | 20px / Semibold (600)                          | Inter          | Sous-section, label de groupe de filtres, titre de drawer              |
| **Body L**  | 16px / Regular (400), line 1.6                 | Inter          | Lecture longue, synthèse de rapport                                    |
| **Body**    | 14px / Regular (400), line 1.6                 | Inter          | Texte UI standard, valeurs de formulaires, contenu de table            |
| **Body S**  | 12px / Regular (400), line 1.5                 | Inter          | Captions, légendes, footers, disclaimers méthodologiques               |
| **Eyebrow** | 11px / Bold (700), UPPERCASE, tracking +0.04em | Inter          | Étiquette de section, kicker de card, label de chart                   |
| **Mono**    | 13px / Regular (400), tabular figures          | JetBrains Mono | Chiffres tabular, codes pays, hex, scores CRAAP                        |

### Règles typographiques

- **Tabular figures activées par défaut** sur tous les chiffres affichant des séries (`font-feature-settings: "tnum"`) — alignement vertical impeccable des colonnes numériques.
- **Aucun titre tout-capitales hors eyebrows** — les capitales sont réservées aux labels de moins de 30 caractères.
- **Italique réservé** aux citations méthodologiques et aux noms d'institutions étrangères ; jamais pour l'emphase.
- **Letter-spacing** : -0.02em pour les titres Display et H1 (resserré pour densité), -0.01em pour H2-H3, 0 pour Body, +0.04em pour Eyebrows.
- **Line-height** : 1.05 pour Display, 1.2 pour H1-H2, 1.4 pour H3, 1.6 pour Body, 1.5 pour Body S.
- **Veuves et orphelins évitées** dans les rapports PDF — utiliser `keep-with-next` pour les titres et `keep-together` pour les tableaux.
- **Maximum 80 caractères par ligne** en lecture longue (`max-width: 65ch`).

---

## 04 · Iconographie

Radar utilise exclusivement **Lucide Icons** ([lucide.dev](https://lucide.dev)), bibliothèque MIT, libre, parfaitement intégrée à React et Next.js. Le style outline + stroke 1.5px reproduit la légèreté éditoriale Inter+Fraunces.

### Bibliothèque et style

| Spécification | Valeur                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------- |
| Bibliothèque  | Lucide Icons — https://lucide.dev                                                              |
| Package npm   | `lucide-react@latest`                                                                          |
| Style         | Outline (jamais filled, jamais duotone)                                                        |
| Stroke width  | 1.5px (par défaut) — jamais 2, jamais 1                                                        |
| Couleur       | `currentColor` (hérite du contexte parent)                                                     |
| Animation     | Aucune par défaut. Animations CSS à la carte (rotate pour loaders, pulse pour signal en cours) |

### Tailles standards

| Taille | Pixels | Usage                                                                    |
| ------ | ------ | ------------------------------------------------------------------------ |
| `xs`   | 14px   | Inline avec Body S — captions, labels de chart, indicateurs status badge |
| `sm`   | 16px   | Inline avec Body — items de menu, inputs avec icon prefix/suffix         |
| `md`   | 20px   | Boutons standard, headers de card, action bar                            |
| `lg`   | 24px   | Sidebar, navigation principale, pages de détail                          |
| `xl`   | 32px   | Empty states, illustrations éditoriales, KPI hero                        |

### Icônes clés du projet

Mapping des concepts métier de Radar vers les icônes Lucide. Cette correspondance doit être respectée pour que l'utilisateur reconnaisse les concepts d'un écran à l'autre.

| Concept         | Icône Lucide     | Couleur par défaut                                           |
| --------------- | ---------------- | ------------------------------------------------------------ |
| Concurrent      | `Building2`      | `bone`                                                       |
| Source          | `Link`           | `muted`                                                      |
| Mouvement       | `ActivitySquare` | `royal`                                                      |
| SWOT            | `Compass`        | `bone`                                                       |
| PESTEL          | `Globe2`         | `bone`                                                       |
| Signal Faible   | `Radar`          | `warning`                                                    |
| Cycle de veille | `RefreshCw`      | `royal-light`                                                |
| Score CRAAP     | `ShieldCheck`    | `royal` (validé) / `warning` (à vérifier) / `error` (rejeté) |
| Rapport         | `FileText`       | `bone`                                                       |
| Export PDF      | `Download`       | `bone`                                                       |
| Alerte critique | `AlertTriangle`  | `error`                                                      |
| Validation      | `CheckCircle2`   | `success`                                                    |
| Email digest    | `Mail`           | `bone`                                                       |
| Onboarding      | `Sparkles`       | `royal-light`                                                |
| Recherche       | `Search`         | `muted`                                                      |

---

## 05 · Espacements & Layout

Radar applique un système de spacing à base **4px** (`0.25rem`). Toute valeur d'espacement, de padding, de margin ou de gap est un multiple de 4. Cette contrainte garantit le rythme visuel et facilite l'implémentation sous Tailwind v4.

### Tokens de spacing

| Token      | Valeur | rem       | Usage typique                                                      |
| ---------- | ------ | --------- | ------------------------------------------------------------------ |
| `space-1`  | 4px    | `0.25rem` | Gap inline minimal (icône + texte serré)                           |
| `space-2`  | 8px    | `0.5rem`  | Padding interne de badge, gap inline standard                      |
| `space-3`  | 12px   | `0.75rem` | Padding ligne de table, gap dans liste de filtres                  |
| `space-4`  | 16px   | `1rem`    | Padding standard input/button, marge entre paragraphes             |
| `space-5`  | 24px   | `1.5rem`  | Padding interne card, marge entre sections de card                 |
| `space-6`  | 32px   | `2rem`    | Marge entre sections d'une page, padding panneau latéral           |
| `space-7`  | 48px   | `3rem`    | Espace au-dessus d'un titre H2, gap entre rangées de cards         |
| `space-8`  | 64px   | `4rem`    | Marge entre blocs majeurs, header de section                       |
| `space-9`  | 96px   | `6rem`    | Espace au-dessus d'un titre H1 dans rapports                       |
| `space-10` | 128px  | `8rem`    | Réserves éditoriales — page de couverture, transitions de chapitre |

### Layout principal — Dashboard Next.js

| Élément            | Spécification                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Sidebar            | Largeur fixe **264px**, position sticky, `bg = navy-900`, border-right 1px `navy-700`. Collapsable à 72px sur tablette. |
| Header             | Hauteur fixe **64px**, position sticky top-0, `bg = navy/90` + backdrop-blur 8px                                        |
| Content max-width  | **1440px** (xl), padding horizontal `space-6` (32px)                                                                    |
| Page padding       | Top `space-7` (48px), bottom `space-8` (64px)                                                                           |
| Card padding       | **24px** (`space-5`) — padding interne card standard                                                                    |
| Card border-radius | **6px** — éditorial, jamais arrondi excessif                                                                            |
| Modal max-width    | **720px** — formulaires QC, configuration notifications                                                                 |
| Form field spacing | Vertical : `space-5` (24px) entre champs, `space-2` (8px) entre label et input                                          |

### Breakpoints responsive

Radar est pensé desktop-first (cible : dashboard utilisé sur écran de travail), les breakpoints respectent la convention Tailwind.

| Breakpoint | min-width | Usage                        | Comportement Radar                         |
| ---------- | --------- | ---------------------------- | ------------------------------------------ |
| `sm`       | 640px     | Mobile portrait large        | Sidebar masquée, navigation drawer         |
| `md`       | 768px     | Tablette portrait            | Sidebar collapsée à 72px (icônes seules)   |
| `lg`       | 1024px    | Tablette paysage / desktop S | Sidebar 264px, content full                |
| `xl`       | 1280px    | Desktop standard             | Layout cible (max-width activé)            |
| `2xl`      | 1536px    | Large desktop                | Padding latéral augmenté, contenu inchangé |

---

## 06 · Composants UI

Les composants Radar sont construits à partir de **Shadcn/ui**, customisés avec les tokens de la charte. Chaque composant respecte les principes : padding multiple de 4, radius 6px par défaut, transitions 150-200ms ease-out, **aucune box-shadow décorative**, accentuation par bordure plutôt que par élévation.

### Boutons

Cinq variantes principales. La hauteur 40px est la cible cliquable WCAG AA pour desktop ; 44px pour mobile.

| Variante        | Hauteur | Background  | Spécifications complètes                                               |
| --------------- | ------- | ----------- | ---------------------------------------------------------------------- |
| **Primary**     | 40px    | `royal`     | `text bone`, radius 6px, hover `royal-light`, font 500, padding-x 16px |
| **Secondary**   | 40px    | transparent | border 1px `navy-700`, text `bone`, hover bg `navy-800`                |
| **Ghost**       | 40px    | transparent | text `bone`, hover bg `navy-800`, no border, items menu                |
| **Destructive** | 40px    | `error`     | text white, hover `error` darker, padding-x 16px                       |
| **CTA Hero**    | 52px    | `royal`     | font 600 16px, padding-x 32px, radius 6px (page d'accueil, onboarding) |
| **CTA Dark**    | 40px    | `bone`      | text `navy`, sur fond navy — bouton hero des pages méthode             |
| **Icon only**   | 40×40   | transparent | Padding 0, radius 6px, hover bg `navy-800`                             |

### Cards

Le composant principal de l'interface. Chaque mouvement détecté, chaque rapport, chaque concurrent est rendu dans une card.

| Propriété         | Valeur                                                  |
| ----------------- | ------------------------------------------------------- |
| Background        | `navy-900` (mode dark) ou `cream` (mode light, exports) |
| Border            | 1px solid `navy-700` (dark) ou `border` (light)         |
| Radius            | **6px** — éditorial, pas de cards trop arrondies        |
| Padding           | **24px** (`space-5`)                                    |
| Shadow par défaut | **Aucune**                                              |
| Hover state       | border `royal` (accentuation, **pas d'élévation**)      |
| Transition        | `border-color 150ms ease-out`                           |

### Inputs

| Propriété     | Valeur                                     |
| ------------- | ------------------------------------------ |
| Hauteur       | 40px (cohérent avec boutons primary)       |
| Background    | `navy-900` (dark) ou `cream` (light)       |
| Border        | 1px solid `navy-700` au repos              |
| Radius        | **6px**                                    |
| Padding       | 10px 14px                                  |
| Focus         | border `royal` (2px) + ring 2px `royal/30` |
| Placeholder   | `muted-soft`                               |
| État error    | border `error` + ring 2px `error/20`       |
| État success  | border `success` + checkmark icon trailing |
| État disabled | bg `navy`, text `muted/50`, opacity 0.6    |

### Badges & Pills

Hauteur fixe 24px, semi-transparents (15% d'opacité sur le fond) pour rester subtils en mode dark.

| Variante  | Background   | Texte         | Usage                                             |
| --------- | ------------ | ------------- | ------------------------------------------------- |
| `success` | `success/15` | `success`     | « Validé », « Cycle terminé », source recoupée    |
| `warning` | `warning/15` | `warning`     | « À vérifier », « CRAAP < 4 », faible échantillon |
| `error`   | `error/15`   | `error`       | « Échec », « Source rejetée »                     |
| `info`    | `royal/15`   | `royal-light` | « En cours », « Nouveau », signal validé          |
| `neutral` | `navy-800`   | `muted`       | Catégorie neutre, label simple                    |

### Composants Radar signatures

Liste des composants métier propres à Radar, qui synthétisent les principes de la charte.

| Composant           | Tokens / Variantes                                                                          | Rôle                                                      |
| ------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `<MovementRow>`     | Card / border-left 3px (royal validé, warning à vérifier, error rejeté) / Fraunces titre H3 | Ligne de mouvement détecté dans le feed dashboard         |
| `<BriefBar>`        | Display 64px Light Fraunces / royal accent / icône TrendingUp                               | KPI hero du dashboard — chiffre + delta + sparkline       |
| `<KPICard>`         | Card / Fraunces 40px / muted eyebrow / royal accent                                         | Card de métrique — count, ratio, tendance                 |
| `<WeakSignalCard>`  | Card / icône Radar warning / border-left warning                                            | Signal faible détecté — événement isolé à surveiller      |
| `<SwotGrid>`        | 4 quadrants / couleurs SWOT / Fraunces H2                                                   | Matrice SWOT par concurrent                               |
| `<PestelGrid>`      | 6 dimensions / couleurs PESTEL / Fraunces H2                                                | Matrice PESTEL hebdomadaire sectorielle                   |
| `<ConfidenceBadge>` | Score 0-1 / `success` (>0.85), `warning` (0.7-0.85), `error` (<0.7)                         | Confiance d'extraction LLM (Pydantic AI)                  |
| `<SourceStatus>`    | Dot 8px / `success`/`warning`/`error`                                                       | Statut source — last scraped, count, ok/erreur            |
| `<CRAAPScore>`      | Bar visuelle 100% / seuils 4 et 7                                                           | Score CRAAP par source — vert, ambre, rouge               |
| `<FiltersBar>`      | Header 64 / `navy-900` / icônes Lucide M                                                    | Barre globale de filtres — concurrent, période, catégorie |
| `<DataTable>`       | TanStack Table / tabular figures / mono hex                                                 | Tables QC, listes concurrents, listes sources             |
| `<RechartsChart>`   | Wrapper / palette PESTEL/SWOT + royal accent                                                | Bar, pie, line, area — visualisations principales         |
| `<ReportCard>`      | Card / preview thumbnail / Download icon                                                    | Card de rapport généré — preview + bouton télécharger     |

### Exemple — `<MovementRow>` (mode dark)

```
┌──────────────────────────────────────────────────────────────────┐
│ ▎ PRICING  ·  CONCURRENT X  ·  IL Y A 2H                          │
│ ▎                                                                 │
│ ▎ Hausse de tarif Pro de 19€ à 24€/mois                           │
│ ▎ Source recoupée par 2 sites — landing + page tarifs publique    │
│ ▎                                                                 │
│ ▎ CRAAP 8.2/10  ·  3 catégories impactées  ·  [Voir détail →]     │
└──────────────────────────────────────────────────────────────────┘
   bg #0A2540  ·  text #F5F1EB  ·  border-left 3px #2251FF
```

---

## 07 · Variables CSS

Bloc `:root` ci-dessous matérialise la totalité de la charte. Prêt à brancher dans **Next.js 16 + Tailwind v4** via le bloc `@theme` de `apps/web/src/app/globals.css`. Le mode dark est par défaut ; un `[data-theme="light"]` est provisionné pour les exports PDF futurs (V2+).

```css
:root {
  /* ─── Surfaces · Navy ──────────────────────────────────── */
  --color-navy: #051c2c;
  --color-navy-900: #0a2540;
  --color-navy-800: #133553;
  --color-navy-700: #1f4868;

  /* ─── Brand · Royal Blue ───────────────────────────────── */
  --color-royal: #2251ff;
  --color-royal-light: #4f73ff;
  --color-royal-dark: #1a3fcc;
  --color-royal-soft: #e5ebff;

  /* ─── Neutres ──────────────────────────────────────────── */
  --color-bone: #f5f1eb;
  --color-cream: #faf8f3;
  --color-ink: #1a1a1a;
  --color-ink-soft: #4a4a4a;
  --color-muted: #8fa3b8;
  --color-muted-soft: #6b7280;

  /* ─── Bordures ─────────────────────────────────────────── */
  --color-border: #1f4868; /* = navy-700 */
  --color-border-strong: #2251ff; /* = royal — focus rings */

  /* ─── Sémantiques ──────────────────────────────────────── */
  --color-success: #0f8f65;
  --color-warning: #c77700;
  --color-error: #b42318;
  --color-info: #2251ff;

  /* ─── PESTEL ───────────────────────────────────────────── */
  --color-pestel-political: #b42318;
  --color-pestel-economic: #c77700;
  --color-pestel-social: #4a1d6e;
  --color-pestel-technological: #2251ff;
  --color-pestel-environmental: #0f8f65;
  --color-pestel-legal: #1a3fcc;

  /* ─── SWOT ─────────────────────────────────────────────── */
  --color-swot-strengths: #2251ff;
  --color-swot-weaknesses: #c77700;
  --color-swot-opportunities: #0f8f65;
  --color-swot-threats: #b42318;

  /* ─── Catégories de mouvement ──────────────────────────── */
  --color-cat-pricing: #c77700;
  --color-cat-product: #2251ff;
  --color-cat-hiring: #4a1d6e;
  --color-cat-funding: #0f8f65;
  --color-cat-communication: #8fa3b8;

  /* ─── Typographie ──────────────────────────────────────── */
  --font-display: "Fraunces", "Times New Roman", serif;
  --font-sans: "Inter", -apple-system, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", "Menlo", "Consolas", monospace;

  --text-display: 4rem; /* 64px */
  --text-h1: 2.5rem; /* 40px */
  --text-h2: 1.75rem; /* 28px */
  --text-h3: 1.25rem; /* 20px */
  --text-body-l: 1rem; /* 16px */
  --text-body: 0.875rem; /* 14px */
  --text-body-s: 0.75rem; /* 12px */
  --text-eyebrow: 0.6875rem; /* 11px */
  --text-mono: 0.8125rem; /* 13px */

  /* ─── Spacing — base 4px ───────────────────────────────── */
  --space-1: 0.25rem; /* 4   */
  --space-2: 0.5rem; /* 8   */
  --space-3: 0.75rem; /* 12  */
  --space-4: 1rem; /* 16  */
  --space-5: 1.5rem; /* 24  */
  --space-6: 2rem; /* 32  */
  --space-7: 3rem; /* 48  */
  --space-8: 4rem; /* 64  */
  --space-9: 6rem; /* 96  */
  --space-10: 8rem; /* 128 */

  /* ─── Radius ───────────────────────────────────────────── */
  --radius-sm: 4px;
  --radius: 6px;
  --radius-lg: 8px;
  --radius-pill: 9999px;

  /* ─── Layout ───────────────────────────────────────────── */
  --sidebar-width: 264px;
  --header-height: 64px;
  --content-max: 1440px;

  /* ─── Animations ───────────────────────────────────────── */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;

  /* ─── Mode dark — defaults (actifs en V1) ──────────────── */
  --bg: var(--color-navy);
  --surface: var(--color-navy-900);
  --surface-2: var(--color-navy-800);
  --text: var(--color-bone);
  --text-muted: var(--color-muted);
  --border-color: var(--color-navy-700);
  --accent: var(--color-royal);
}

/* ─── Mode light — provisionné pour exports PDF (V2+) ──── */
[data-theme="light"] {
  --bg: var(--color-cream);
  --surface: var(--color-bone);
  --surface-2: #ffffff;
  --text: var(--color-ink);
  --text-muted: var(--color-muted-soft);
  --border-color: #e5e7eb;
  --accent: var(--color-royal);
}
```

Pour intégration Tailwind v4, transposer ce bloc dans le fichier `@theme` de `apps/web/src/app/globals.css`. Les utilitaires Tailwind générés (`bg-navy`, `bg-royal`, `text-bone`, `border-navy-700`, etc.) sont l'API publique de la charte.

---

> **RADAR**
> _Vos concurrents bougent. Radar vous le dit avant tout le monde._
>
> Référence design officielle · **Radar Editorial**
> Module M244 · ENSA Tétouan · Cycle Ingénieur BDIA
> Karamo Sylla & Bachirou Konaté · Mai 2026
