# SPEC — Sprint 02 : Onboarding Deep Research

**Projet** : RADAR — Outil de veille concurrentielle propulsé par OpenClaw
**Version** : 1.0
**Priorité** : Critique (Must V1, F2 du PRD § 7.3)
**Responsable spec** : Karamo Sylla
**Responsable implémentation** : Claude Code
**Date** : Mai 2026
**Cadre académique** : Module M244 (Veille Technologique), ENSA Tétouan
**Persona principal** : Karim Berrada, fondateur de Marka Logistics (continuité Sprint 01)

---

## 1. Objectif

Implémenter le parcours d'onboarding RADAR : capturer en moins de 10 minutes le contexte business minimum vital de l'utilisateur (entreprise, 1 à 10 concurrents prioritaires, 1 à 5 axes de surveillance) pour que le **premier cycle de veille puisse démarrer la nuit suivante à 6h**. Toute donnée lourde (secteur, taille, ICP, sites concurrents enrichis, mots-clés métier) est déléguée à l'agent **Deep Research d'OpenClaw** lancé en arrière-plan dès la sortie de l'étape 1.

Ce sprint produit le **wizard 3 étapes + écran de succès** pixel-perfect, aligné sur le design `RADAR Onboarding.html` livré par l'équipe design dans `.tmp-design/onboarding/radar/project/onb-*.jsx|css`. La validation Zod, la persistance progressive Prisma (`ProfilUtilisateur`, `Concurrent`, axes) et la mécanique de garde (middleware + redirect d'`/onboarding` vers la prochaine étape incomplète) sont **dans le scope**. Le déclenchement réel de l'agent Deep Research d'OpenClaw est **mocké** (toast UI + log côté serveur) et sera branché au sprint 04 quand l'API `POST /v1/chat/completions` d'OpenClaw sera disponible (cf. PRD § 6.3 et `KARAMO.md` du binôme).

---

## 2. User Stories (résumé)

| #      | En tant que...                          | Je veux...                                                                                              | Afin de...                                                            |
| ------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| US-O01 | Nouvel inscrit                          | renseigner mon entreprise en 30 secondes                                                                | démarrer sans avoir à remplir 20 champs administratifs                |
| US-O02 | Dirigeant pressé                        | voir mes erreurs de validation directement sous chaque champ                                            | corriger sans deviner ce qui cloche                                   |
| US-O03 | Utilisateur après l'étape 1             | recevoir un signal visuel que l'IA travaille pour moi en arrière-plan                                   | sentir que je gagne du temps réel                                     |
| US-O04 | Utilisateur méthodique                  | ajouter mes concurrents un par un avec leur site web                                                    | suivre exactement ceux que je veux                                    |
| US-O05 | Utilisateur indécis                     | voir des suggestions Maroc/Maghreb adaptées à mon contexte                                              | gagner du temps sans connaître l'orthographe exacte                   |
| US-O06 | Utilisateur ayant tapé 0 concurrent     | comprendre que je dois en ajouter au moins 1 sans bloc d'erreur agressif                                | corriger sans frustration                                             |
| US-O07 | Utilisateur ayant ajouté 4 concurrents  | voir un compteur visuel « (recommandé) »                                                                | savoir que je suis dans la fourchette idéale (3-5)                    |
| US-O08 | Utilisateur stratège                    | choisir mes axes parmi 5 catégories couvertes par défaut (RH, Stratégie, Tech, Digital, Réglementation) | cibler la veille sur ce qui m'intéresse vraiment                      |
| US-O09 | Utilisateur indécis                     | sélectionner les 5 axes en un clic via « Tout sélectionner »                                            | démarrer large et affiner plus tard                                   |
| US-O10 | Utilisateur impatient                   | revenir à l'étape précédente sans perdre mes saisies                                                    | corriger une erreur sans tout retaper                                 |
| US-O11 | Utilisateur ayant fini les 3 étapes     | voir un écran d'accueil élégant qui célèbre l'armement de mon radar                                     | sentir que c'est lancé, pas être renvoyé brutalement sur le dashboard |
| US-O12 | Utilisateur revenant le lendemain matin | accéder directement au dashboard                                                                        | ne pas refaire l'onboarding ni voir une banderole intrusive           |

Le cahier de stories détaillé : [`USER-STORIES-Sprint02-Onboarding.md`](./USER-STORIES-Sprint02-Onboarding.md).

---

## 3. Écrans concernés

| #   | Écran                      | Route                 | Auth | Layout                                                          |
| --- | -------------------------- | --------------------- | ---- | --------------------------------------------------------------- |
| 1   | Étape 1 — Votre entreprise | `/onboarding/step-1`  | Oui  | Single-column 640px max + header + footer nav                   |
| 2   | Étape 2 — Vos concurrents  | `/onboarding/step-2`  | Oui  | Idem + grid input row + liste cards                             |
| 3   | Étape 3 — Vos axes         | `/onboarding/step-3`  | Oui  | Idem + grid 2 colonnes (5 cards d'axes, dernière en col-span 2) |
| 4   | Succès — Radar armé        | `/onboarding/success` | Oui  | Plein écran centré avec arcs radar animés + auto-redirect 6s    |

Toutes les routes sont **protégées** : sans session Better Auth, le visiteur est redirigé vers `/login`. La route racine `/onboarding` est un **router serveur** qui redirige vers la prochaine étape incomplète (calculée à partir des données persistées en BDD), ou vers `/dashboard` si l'onboarding est terminé.

**Source de vérité design** : `.tmp-design/onboarding/radar/project/`

- `onb-styles.css` — feuille de styles complète (stepper, section header, deep-research banner, axis cards, success screen)
- `onb-chrome.jsx` — composants chrome (`OnboardingLayout`, `StepIndicator`, `SectionHeader`, `DeepResearchBanner`, `DeepResearchToast`, catalogue `AXES`)
- `onb-screens.jsx` — 3 steps + `SuccessScreen` avec `RadarPulseDecor` (arcs SVG) + `RadarMarkBoot` (mark animée)
- `onb-icons.jsx` — 13 icônes outline 1.5px (Building2, Globe, Sparkles, Target, Compass, UsersRound, Cpu, Megaphone, Shield, Plus, Trash, ArrowRight, Check, CheckCircle2)

À **réimplémenter en TSX/Tailwind v4** sous `apps/web/`. Coordonnées SVG, durées d'animation et textes UI doivent être préservés à l'identique. Le copy français (titres, sous-titres, exemples d'axes, suggestions Maroc/Maghreb) est figé.

---

## 4. Livrables techniques

| #    | Livrable                     | Fichier(s)                                      | Description                                                                                                                   |
| ---- | ---------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 4.1  | Migration Prisma             | `packages/database/prisma/schema.prisma`        | Ajouter `axes String[]` et `onboardingCompleteLe DateTime?` sur `ProfilUtilisateur`                                           |
| 4.2  | Validation Zod               | `apps/web/src/lib/validators/onboarding.ts`     | 4 schémas (step1Entreprise, step2Concurrent, step2Concurrents, step3Axes)                                                     |
| 4.3  | Server Actions               | `apps/web/src/lib/actions/onboarding.ts`        | 5 actions (`saveStep1`, `addConcurrent`, `removeConcurrent`, `saveStep3`, `completeOnboarding`) + helper `getOnboardingState` |
| 4.4  | Mock Deep Research           | `apps/web/src/lib/agents/deep-research.mock.ts` | Stub `triggerDeepResearch(profilId)` qui log et retourne after 800ms — TODO sprint 4 : appeler OpenClaw                       |
| 4.5  | Catalogue axes               | `apps/web/src/lib/onboarding/axes.ts`           | Constante `AXES` typée (5 axes : RH violet, Stratégie safran, Tech teal, Digital rose, Réglementation vert)                   |
| 4.6  | Page racine onboarding       | `apps/web/src/app/onboarding/page.tsx`          | Server Component : redirige vers la prochaine étape incomplète ou vers `/dashboard`                                           |
| 4.7  | Layout group onboarding      | `apps/web/src/app/onboarding/layout.tsx`        | Garde session + wrapper minimal (`min-h-dvh bg-bg-primary`)                                                                   |
| 4.8  | Page Étape 1                 | `apps/web/src/app/onboarding/step-1/page.tsx`   | Client Component avec RHF + Zod, 4 états (default, filled, validation, toast)                                                 |
| 4.9  | Page Étape 2                 | `apps/web/src/app/onboarding/step-2/page.tsx`   | Client Component avec liste dynamique, suggestions, 3 états (default, empty-error, with-list)                                 |
| 4.10 | Page Étape 3                 | `apps/web/src/app/onboarding/step-3/page.tsx`   | Client Component avec 5 cards toggleables, 4 états (default, two-selected, all-selected, empty-error)                         |
| 4.11 | Page Succès                  | `apps/web/src/app/onboarding/success/page.tsx`  | Server Component avec données réelles + composant client `SuccessAnimated` pour la séquence d'animation                       |
| 4.12 | Garde dashboard              | `apps/web/src/app/dashboard/page.tsx`           | Ajouter check `onboardingCompleteLe IS NOT NULL`, sinon redirect `/onboarding`                                                |
| 4.13 | Composants chrome onboarding | `apps/web/src/components/onboarding/*.tsx`      | 6 composants (voir § 6)                                                                                                       |
| 4.14 | Composants steps             | `apps/web/src/components/onboarding/*.tsx`      | 4 composants (voir § 6)                                                                                                       |
| 4.15 | Keyframes onboarding         | `apps/web/src/app/globals.css`                  | Ajouter `onb-pulse`, `onb-shake`, `comp-in`, `axis-check-in`, `dr-pulse`, `rpd-pulse`, `boot-draw`, `boot-dot`, `success-pop` |

---

## 5. Comportements attendus

### 5.1 Page racine `/onboarding` (Server Component, redirection)

**Logique de redirection** (calculée à partir de la BDD, sans aucun JS client) :

```ts
// pseudocode dans page.tsx
const session = await auth.api.getSession({ headers: await headers() });
if (!session) redirect("/login");

const profil = await prisma.profilUtilisateur.findUnique({
  where: { userId: session.user.id },
  include: { _count: { select: { user: { include: { concurrents: true } } } } },
});
const concurrents = await prisma.concurrent.count({
  where: { userId: session.user.id },
});

if (profil?.onboardingCompleteLe) redirect("/dashboard");
if (!profil) redirect("/onboarding/step-1");
if (concurrents === 0) redirect("/onboarding/step-2");
if (!profil.axes?.length) redirect("/onboarding/step-3");
redirect("/onboarding/success"); // état terminal théorique, completeOnboarding aurait dû fixer onboardingCompleteLe
```

**Garde** : présence de la session uniquement. Toutes les autres pages sous `/onboarding/*` héritent du layout group qui re-vérifie la session.

### 5.2 Page Étape 1 — Votre entreprise (`/onboarding/step-1`)

**Layout** :

- Header sticky (top:0, z:5) : logo `RadarLockupLight` height 28px centré dans une bande 640px max + stepper 3 étapes 24px sous le logo (étape 1 = active, 2 et 3 = pending)
- Main flex-1 overflow-auto : padding-top 24px, padding-bottom 24px, contenu max-w 640px centré
- Footer sticky (bottom:0) : border-top `#1F2937`, ligne avec bouton « Retour » désactivé (`canGoBack=false` à l'étape 1) à gauche et bouton « Suivant » à droite (h 44px, padding-x 18px, min-w 120px)

**Contenu (de haut en bas dans le main)** :

1. **Section header** :
   - Icône `Building2` 24px dans un carré 48×48 `bg-bg-elevated` border `#1F2937` rounded 12px, color teal `#14B8A6`
   - H2 « Parlons de votre entreprise. » (28px, Outfit 600, color text-primary, line-height 1.25, letter-spacing -0.01em)
   - Sous-titre (16px, color text-secondary, max-w 480px, line-height 1.55) : « Notre agent IA va analyser le web pour comprendre votre activité, identifier votre secteur et suggérer des concurrents. »
2. Spacer 32px
3. **FormInput** « Nom de votre entreprise »
   - leadingIcon `Building2`
   - placeholder « Ex : AI5D Consulting » (le persona Karim verra « Ex : Marka Logistics »)
   - validation client (Zod) : `min(2, "Le nom doit contenir au moins 2 caractères").max(120)`
4. Spacer 16px
5. **FormInput** « Site internet »
   - leadingIcon `Globe`
   - placeholder « https://www.votresite.ma »
   - validation client : `regex(/^https?:\/\/.+\..+/)` avec message « Format d'URL invalide. Ex : https://www.exemple.ma »
6. Spacer 32px
7. **DeepResearchBanner** :
   - bg `bg-bg-surface`, border 1px subtle, rounded 8px, padding 16px 20px
   - Bordure latérale gauche 3px en gradient vertical teal (top) → safran (bottom)
   - Icône `Sparkles` 20px teal pulsante (animation `dr-pulse 2s ease-in-out infinite`, opacity 1 → 0.6 → 1)
   - Texte 14px : `<strong>Deep Research IA</strong> — dès que vous passez à l'étape suivante, notre agent explore le web pour identifier votre secteur, vos concurrents potentiels, vos clients types et votre positionnement.`
   - Caption en pied : « Résultats disponibles dans Paramètres en 30 minutes environ. »

**États** :

| État         | Trigger                             | Comportement                                                                                                                                                                    |
| ------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default`    | Au mount, aucune donnée             | Champs vides, succès non affichés, banner visible, bouton Suivant disabled tant qu'aucun champ valide                                                                           |
| `filled`     | Saisie valide dans les 2 champs     | Checkmark vert dans chaque FormInput (`success` prop), bouton Suivant enabled                                                                                                   |
| `validation` | Click Suivant avec champs invalides | Border error rouge sur les champs invalides, message d'erreur sous chaque champ, focus sur le 1er champ invalide                                                                |
| `toast`      | Submit valide                       | Toast `DeepResearchToast` apparaît top:88px right:24px (slide-down + fade-in 200ms ease-out), texte « Deep Research lancé... », auto-dismiss après 2.4s, transition vers step-2 |

**Soumission** :

- Server Action `saveStep1({ nomEntreprise, siteWeb })`
- Persiste : `prisma.profilUtilisateur.upsert({ where: { userId }, create: {...}, update: {...} })`
- Déclenche `triggerDeepResearch(profilId)` (mock, fire-and-forget, ne bloque pas la transition)
- Redirect côté serveur (`router.push("/onboarding/step-2")`) après affichage du toast 800ms côté client

### 5.3 Page Étape 2 — Vos concurrents (`/onboarding/step-2`)

**Layout** : identique à l'étape 1 (header + main + footer). Stepper : étape 1 complétée (check teal), étape 2 active.

**Contenu** :

1. **Section header** :
   - Icône `Target` 24px safran `#F59E0B` dans le carré 48×48
   - H2 « Quels concurrents surveiller ? »
   - Sous-titre max-w 520px : « Ajoutez les entreprises que vous voulez garder à l'œil. Notre agent visitera leurs sites quotidiennement à 6h pour détecter leurs mouvements. »
2. Spacer 32px
3. **Inline add row** : grid `1fr 1fr auto` gap 12px align-items end (mobile : grid-template-columns 1fr)
   - FormInput « Nom du concurrent » leadingIcon `Building2` placeholder « Ex : Roland Berger Maroc »
   - FormInput « Site internet » leadingIcon `Globe` placeholder « https://... » (optionnel)
   - Bouton « Ajouter » (PrimaryButton variant compact : h 44px, padding-x 18px, white-space nowrap, icon `Plus` 16px)
4. (si erreur ou liste vide) :
   - **Empty state** card dashed border 1px subtle rounded 12px padding 32px centré avec icône `Target` 32px disabled, titre « Aucun concurrent ajouté » (16px secondary), sous-titre « Commencez par ajouter ceux dont vous voulez suivre l'activité. » (caption tertiary)
   - **Suggestions Maroc/Maghreb** : caption « Suggestions Maroc / Maghreb : » + row de chips (5 par défaut : Roland Berger Maroc, McKinsey Maroc, Cabinet Mazars, Wafa Salaf, Inwi). Click sur un chip → préremplit l'input nom.
5. (si liste non vide) :
   - **Liste de cards** `comp-card` (gap 8px) :
     - Avatar 36px rounded-full bg-bg-elevated border subtle, lettre 14px Outfit 500
     - Body : nom (16px text-primary 500) + site mono 13px text-secondary (italique tertiary si vide « Pas de site renseigné »)
     - Bouton trash icon 18px, hover error rouge bg-bg-elevated
     - Animation à l'ajout : `comp-in 200ms ease-out` (translateX 24px → 0 + opacity 0 → 1)
   - **Compteur** caption à droite : « **N** concurrent(s) ajouté(s) » + icône `CheckCircle2` 14px vert si N ≥ 3 + label italique tertiary « (recommandé) » si N ≥ 3

**États** :

| État          | Trigger                           | Comportement                                                                                                                         |
| ------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `default`     | Au mount sans concurrent persisté | Empty state + suggestions visibles                                                                                                   |
| `empty-error` | Click Suivant avec 0 concurrent   | Animation `shake` 400ms sur la add row + message inline `IconAlertCircle` 14px error « Ajoutez au moins 1 concurrent à surveiller. » |
| `with-list`   | ≥ 1 concurrent                    | Empty state + suggestions masqués, liste affichée, compteur visible                                                                  |

**Soumission inline** :

- Click « Ajouter » (ou Enter dans un des inputs) → Server Action `addConcurrent({ nom, siteWeb })`
- Validation Zod : `nom min(2)`, `siteWeb optional + regex URL`
- Refresh des données via `revalidatePath("/onboarding/step-2")` ou `useTransition + router.refresh()`
- Trash → `removeConcurrent({ id })` + revalidation
- Click Suivant → vérifie `count(concurrents) ≥ 1`, sinon set `empty-error` ; sinon `router.push("/onboarding/step-3")`

### 5.4 Page Étape 3 — Vos axes (`/onboarding/step-3`)

**Layout** : identique. Stepper : étapes 1 et 2 complétées, étape 3 active. Bouton Suivant : libellé « Armer le radar » avec icône `Check` 16px (pas la flèche par défaut).

**Contenu** :

1. **Section header** :
   - Icône `Compass` 24px teal dans le carré 48×48
   - H2 « Quels axes stratégiques surveiller ? »
   - Sous-titre max-w 540px : « Sélectionnez les types de mouvements que notre agent doit détecter chez vos concurrents. Vous pourrez ajuster à tout moment depuis Paramètres. »
2. Spacer 16px
3. **Toggle all** aligné à droite : lien teal 13px 500, hover teal-400 underline offset 4px : « Tout sélectionner » ↔ « Tout désélectionner »
4. **Grid 2 colonnes** gap 16px (mobile : 1 colonne) :
   - 4 cards en grid `1fr 1fr` + 1 card en `col-span 2` (dernière, Réglementation, pour équilibrer)
5. **Card axe** :

| Clé                         | Titre                        | Couleur            | Icône      | Description                                                            | Exemple (mono italique)                                     |
| --------------------------- | ---------------------------- | ------------------ | ---------- | ---------------------------------------------------------------------- | ----------------------------------------------------------- |
| `RECRUTEMENT_RH`            | Recrutements et RH           | `#8B5CF6` (violet) | UsersRound | Embauches stratégiques, pages carrières actives, offres d'emploi clés. | « Cabinet X recrute un Directeur Stratégie senior »         |
| `STRATEGIE_DIRECTION`       | Stratégie et direction       | `#F59E0B` (safran) | Compass    | Levées de fonds, fusions, nominations, partenariats stratégiques.      | « Concurrent Y annonce une levée de 5 M USD »               |
| `TECHNOLOGIE_INNOVATION`    | Technologie et innovation    | `#14B8A6` (teal)   | Cpu        | Stack technique exposée, brevets, R&D, blogs techniques.               | « Concurrent Z migre vers une stack TypeScript full-stack » |
| `PRESENCE_DIGITALE`         | Présence digitale            | `#EC4899` (rose)   | Megaphone  | Refonte site, campagnes marketing, présence réseaux sociaux.           | « Concurrent W lance une campagne LinkedIn ciblée »         |
| `REGLEMENTATION_CONFORMITE` | Réglementation et conformité | `#10B981` (vert)   | Shield     | Certifications obtenues, litiges, registres légaux, RGPD.              | « Concurrent V obtient sa certification ISO 27001 »         |

**Mécanique de la card** :

- Default : `bg-bg-surface`, `border 1px subtle`, `rounded 12px`, `padding 20px`
- Hover non sélectionné : `border-color: color-mix(axis-color 50%, transparent)`, `transform translateY(-2px)`
- Sélectionné : `bg: axis-tint` (axis-color@10%), `border 2px axis-color`, `padding 19px` (compense la border 2px), `box-shadow: 0 0 24px axis-glow` (axis-color@1F)
- Coin haut droit (top:14, right:14) : icône `CheckCircle2` 18px en couleur axis-color avec animation `axis-check-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1)` (scale 0 → 1.1 → 1, effet spring)
- Layout interne : row icon 36×36 rounded-full bg axis-tint-strong (axis-color@26%) + titre 16px 600, puis description 14px line-height 1.5, puis exemple mono italique tertiary

**États** :

| État           | Trigger                                        | Comportement                                                                                                         |
| -------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `default`      | Au mount sans axe persisté                     | Grille intacte, compteur en pied caption error (sans shake) « Sélectionnez au moins 1 axe » avec icône `AlertCircle` |
| `two-selected` | 2 axes cochés                                  | Compteur caption tertiary « **2** axe(s) sélectionné(s) » sans recommandé                                            |
| `all-selected` | 5 axes cochés (ou click sur Tout sélectionner) | Compteur « **5** axe(s) sélectionné(s) (recommandé) », bouton « Tout désélectionner » remplace                       |
| `empty-error`  | Click Armer avec 0 axe                         | Animation `shake 400ms` sur la grid + compteur en error                                                              |

**Soumission** :

- Click Armer → Server Action `completeOnboarding({ axes: string[] })`
- Validation : `axes` doit être un sous-ensemble non vide des 5 clés du catalogue
- Persiste : `prisma.profilUtilisateur.update({ data: { axes, onboardingCompleteLe: new Date() } })`
- Redirect serveur vers `/onboarding/success`

### 5.5 Page Succès — Radar armé (`/onboarding/success`)

**Layout** : plein écran (100dvh, 100vw), `bg-bg-primary`, flex center center, padding 32px 24px, position relative overflow hidden.

**Calques** :

1. **Background** : 3 cercles SVG concentriques (rayons 80, 160, 240px) dans un viewBox `-300 -300 600 600`, position absolute inset 0, stroke teal 1.5px, opacities 0.05 / 0.03 / 0.02, animation `rpd-pulse 6s ease-in-out infinite` (scale 1 → 1.08 → 1) avec délais 0s / 2s / 4s pour l'effet cascade
2. **Content** position relative z:2 max-w 560px centré flex-col items-center text-center :
   - **Icon wrap** 96×96 relative : background radial gradient teal@18% center → transparent 70% + `RadarMarkBoot` 64×64 (mark animée au boot : 3 arcs `boot-arc` qui se dessinent par stroke-dashoffset, dot safran qui blink, séquence cumulée 800ms)
   - Titre H1 « Votre radar est armé. » (40px, 700, line-height 1.15)
   - Sous-titre 18px max-w 480px text-secondary line-height 1.5 marge top 16px : « Le premier cycle de veille démarre demain à 6h. Vous recevrez le digest à 7h. »
   - **Stats grid** 3 colonnes gap 32px marge top 40px (mobile 1 col gap 16px) :
     - Concurrents : icône `Building2` 24px safran + nombre 28px Outfit 700 + eyebrow 12px caption « concurrents surveillés »
     - Axes : icône `Compass` 24px teal + nombre + « axes activés »
     - Deep Research : icône `Sparkles` 24px violet `#A855F7` + texte 22px « En cours » + « Deep Research »
   - Bouton primary CTA marge top 32px : h 52px padding 0 32px font 17px 600 « Accéder au dashboard » + icône `ArrowRight` 18px → `router.push("/dashboard")`
   - Note italique caption tertiary marge top 32px max-w 440px : « Vous pourrez ajouter ou retirer des concurrents et axes à tout moment depuis Paramètres. »

**Animation au montage** (variant `animated=true` par défaut) :

| Élément    | Animation                                 | Délai  | Durée |
| ---------- | ----------------------------------------- | ------ | ----- |
| icon-wrap  | `success-pop` (scale 0 → 1.1 → 1, spring) | 0ms    | 500ms |
| boot-arc-1 | `boot-draw` (stroke-dashoffset 80 → 0)    | 200ms  | 600ms |
| boot-arc-2 | idem                                      | 400ms  | 600ms |
| boot-arc-3 | idem                                      | 600ms  | 600ms |
| boot-dot   | `boot-dot` (clignote 2 fois puis stable)  | 800ms  | 800ms |
| h1         | `fade-up`                                 | 600ms  | 400ms |
| sub        | `fade-up`                                 | 1000ms | 400ms |
| stats      | `fade-up`                                 | 1400ms | 400ms |
| cta        | `fade-up`                                 | 2200ms | 400ms |
| note       | `fade-up`                                 | 2600ms | 400ms |

**Auto-redirect** : `setTimeout(() => router.push("/dashboard"), 6000)` (cleanup au unmount).

---

## 6. Composants réutilisables

| #    | Composant                 | Fichier                                               | Description                                                                                                                                  |
| ---- | ------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 6.1  | `OnboardingShell`         | `components/onboarding/onboarding-shell.tsx`          | Layout flex-col header sticky + main scrollable + footer sticky avec props (step, canGoBack, onBack, onNext, nextLabel, nextIcon, isPending) |
| 6.2  | `StepIndicator`           | `components/onboarding/step-indicator.tsx`            | Stepper 3 étapes avec circle 32px (pulse box-shadow sur active), connector teal pour completed, labels masqués <768px                        |
| 6.3  | `SectionHeader`           | `components/onboarding/section-header.tsx`            | Bloc icône 48×48 + H2 + sous-titre avec props (icon: LucideIcon, iconColor, title, subtitle, subMaxWidth)                                    |
| 6.4  | `DeepResearchBanner`      | `components/onboarding/deep-research-banner.tsx`      | Banner statique avec gradient border-left teal → safran et icône Sparkles pulsante                                                           |
| 6.5  | `DeepResearchToast`       | `components/onboarding/deep-research-toast.tsx`       | Toast position absolute top-right avec `is-visible` controlled prop                                                                          |
| 6.6  | `CompanyCard`             | `components/onboarding/company-card.tsx`              | Card concurrent avec avatar lettre + nom + site + trash, animation `comp-in`                                                                 |
| 6.7  | `CompanySuggestionChip`   | `components/onboarding/company-suggestion-chip.tsx`   | Chip mono rounded-full hover teal pour les suggestions Maroc/Maghreb                                                                         |
| 6.8  | `AxisCard`                | `components/onboarding/axis-card.tsx`                 | Card axe toggleable avec props (axe, selected, onToggle), inline style CSS variables (axis-color, axis-tint, axis-tint-strong, axis-glow)    |
| 6.9  | `AxisGrid`                | `components/onboarding/axis-grid.tsx`                 | Wrapper grid 2 col (1 col mobile) avec dernière card en col-span 2 + animation shake                                                         |
| 6.10 | `RadarPulseDecor`         | `components/onboarding/radar-pulse-decor.tsx`         | SVG 3 cercles concentriques pour le background du success screen                                                                             |
| 6.11 | `RadarMarkBoot`           | `components/onboarding/radar-mark-boot.tsx`           | SVG 64×64 mark animée au boot (3 arcs draw + dot safran blink)                                                                               |
| 6.12 | `OnboardingSuccessClient` | `components/onboarding/onboarding-success-client.tsx` | Wrapper Client qui orchestre l'auto-redirect 6s vers `/dashboard`                                                                            |

---

## 7. Schémas Zod

```ts
// apps/web/src/lib/validators/onboarding.ts
import { z } from "zod";

export const urlSchema = z
  .string({ required_error: "Site internet requis" })
  .url({ message: "Format d'URL invalide. Ex : https://www.exemple.ma" })
  .refine((u) => /^https?:\/\/.+\..+/.test(u), {
    message: "Format d'URL invalide. Ex : https://www.exemple.ma",
  });

export const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => !v || /^https?:\/\/.+\..+/.test(v), {
    message: "Format d'URL invalide. Ex : https://www.exemple.ma",
  });

export const step1EntrepriseSchema = z.object({
  nomEntreprise: z
    .string({ required_error: "Nom d'entreprise requis" })
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(120, "Le nom ne peut pas dépasser 120 caractères"),
  siteWeb: urlSchema,
});

export const step2ConcurrentSchema = z.object({
  nom: z
    .string({ required_error: "Nom du concurrent requis" })
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(120),
  siteWeb: optionalUrlSchema,
});

export const AXES_KEYS = [
  "RECRUTEMENT_RH",
  "STRATEGIE_DIRECTION",
  "TECHNOLOGIE_INNOVATION",
  "PRESENCE_DIGITALE",
  "REGLEMENTATION_CONFORMITE",
] as const;
export type AxeKey = (typeof AXES_KEYS)[number];

export const step3AxesSchema = z.object({
  axes: z.array(z.enum(AXES_KEYS)).min(1, "Sélectionnez au moins 1 axe").max(5),
});

export type Step1EntrepriseInput = z.infer<typeof step1EntrepriseSchema>;
export type Step2ConcurrentInput = z.infer<typeof step2ConcurrentSchema>;
export type Step3AxesInput = z.infer<typeof step3AxesSchema>;
```

---

## 8. Server Actions

```ts
// apps/web/src/lib/actions/onboarding.ts
"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@radar/database";
import { auth } from "@/lib/auth/auth";
import { triggerDeepResearch } from "@/lib/agents/deep-research.mock";
import {
  step1EntrepriseSchema,
  step2ConcurrentSchema,
  step3AxesSchema,
  type Step1EntrepriseInput,
  type Step2ConcurrentInput,
  type Step3AxesInput,
} from "@/lib/validators/onboarding";

type OnboardingError = "VALIDATION_ERROR" | "UNAUTHENTICATED" | "SERVER_ERROR";
type Result<T = void> =
  | { success: true; data?: T }
  | { success: false; error: OnboardingError; details?: string };

async function requireUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  return session.user.id;
}

export async function saveStep1(input: Step1EntrepriseInput): Promise<Result> {
  /* upsert ProfilUtilisateur + triggerDeepResearch fire-and-forget */
}
export async function addConcurrent(
  input: Step2ConcurrentInput,
): Promise<Result> {
  /* create Concurrent + revalidatePath */
}
export async function removeConcurrent(id: string): Promise<Result> {
  /* delete Concurrent (vérifier ownership) + revalidatePath */
}
export async function completeOnboarding(
  input: Step3AxesInput,
): Promise<Result> {
  /* update ProfilUtilisateur (axes + onboardingCompleteLe) */
}
export async function getOnboardingState(): Promise<{
  profil: ProfilUtilisateur | null;
  concurrentsCount: number;
}> {
  /* Server-only helper */
}
```

**Sécurité** :

- Toutes les actions appellent `requireUserId()` en première ligne (rejet 307 → /login si pas de session)
- `removeConcurrent` vérifie `concurrent.userId === userId` avant `delete`
- Aucun secret exposé côté client (toute logique BDD reste serveur)

---

## 9. Migration Prisma (sprint 02)

```prisma
// packages/database/prisma/schema.prisma — diff sur ProfilUtilisateur

model ProfilUtilisateur {
  id             String   @id @default(uuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  nomEntreprise  String
  siteWeb        String?
  secteur        String?
  description    String?  @db.Text
  produits       String[]
  marches        String[]
  positionnement String?  @db.Text

  // ── AJOUT Sprint 02 ──
  axes                String[]   // ex: ["RECRUTEMENT_RH", "STRATEGIE_DIRECTION", ...]
  onboardingCompleteLe DateTime?

  creeLe         DateTime @default(now())
  majLe          DateTime @updatedAt
}
```

**Commande** :

```bash
pnpm --filter @radar/database db:migrate -- --name onboarding_axes_completion
```

---

## 10. Animations (récap chiffré)

| #   | Animation                                 | Cible                           | Durée  | Easing                                        | Itération |
| --- | ----------------------------------------- | ------------------------------- | ------ | --------------------------------------------- | --------- |
| A1  | `onb-pulse` (stepper actif)               | step-circle border + box-shadow | 2400ms | ease-in-out                                   | infinite  |
| A2  | `dr-pulse` (banner Deep Research)         | sparkles icon opacity           | 2000ms | ease-in-out                                   | infinite  |
| A3  | `onb-shake` (erreurs étape 2 et 3)        | row / grid translateX           | 400ms  | ease-in-out                                   | 1         |
| A4  | `comp-in` (card concurrent ajoutée)       | translateX 24px → 0 + opacity   | 200ms  | ease-out                                      | 1         |
| A5  | `axis-check-in` (check coin de la card)   | scale 0 → 1.1 → 1               | 300ms  | cubic-bezier(0.34, 1.56, 0.64, 1) (spring)    | 1         |
| A6  | `rpd-pulse` (arcs success bg)             | scale 1 → 1.08 → 1              | 6000ms | ease-in-out (cascade 0s/2s/4s)                | infinite  |
| A7  | `success-pop` (icon-wrap success)         | scale 0 → 1.1 → 1               | 500ms  | cubic-bezier(0.34, 1.56, 0.64, 1)             | 1         |
| A8  | `boot-draw` (3 arcs mark)                 | stroke-dashoffset 80 → 0        | 600ms  | ease-out (cascade 200ms/400ms/600ms)          | 1         |
| A9  | `boot-dot` (dot safran mark)              | opacity blink x2                | 800ms  | ease-out                                      | 1         |
| A10 | `fade-up` (success H1/sub/stats/cta/note) | translateY 8px + opacity        | 400ms  | ease-out (cascade 600/1000/1400/2200/2600 ms) | 1         |

Tous transform/opacity uniquement (GPU friendly). Aucun layout thrashing.

---

## 11. Responsive

| Breakpoint          | Comportement                                                                                                                                               |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop ≥ 1024px    | 640px max-w centré, footer sticky avec back/next horizontal, axis grid 2 colonnes (5e en col-span 2), success stats grid 3 colonnes                        |
| Tablette 768-1023px | Identique desktop, paddings ajustés (24px → 20px)                                                                                                          |
| Mobile < 768px      | Stepper labels masqués (juste les cercles 32px), inline add row stack en 1 colonne, axis grid 1 colonne (col-span désactivé), success stats grid 1 colonne |

Respect strict de la charte : aucun layout horizontal scrollable, aucun débordement, focus visible teal 2px partout.

---

## 12. Stack imposée (rappel)

- **Next.js 16** (App Router, Turbopack, RSC + Server Actions). `apps/web/AGENTS.md` rappelle de lire les guides locaux dans `node_modules/next/dist/docs/` avant tout changement
- **React 19**, TypeScript strict + `noUncheckedIndexedAccess`
- **Tailwind 4** (CSS-first via `@theme` block dans `globals.css`)
- **Better Auth 1.6+** pour la session (déjà branché sprint 01)
- **Prisma 6** (workspace `@radar/database`)
- **Zod 3** + **React Hook Form** (formulaires)
- **Lucide React** (icônes outline 1.5px exclusivement)
- **next/font/local** Outfit + JetBrains Mono (déjà configuré sprint 01)

---

## 13. Arborescence cible (delta sprint 02)

```
apps/web/src/
├── app/
│   ├── onboarding/
│   │   ├── page.tsx                  ← redirige vers la prochaine étape incomplète
│   │   ├── layout.tsx                ← garde session
│   │   ├── step-1/page.tsx           ← Étape 1 entreprise
│   │   ├── step-2/page.tsx           ← Étape 2 concurrents
│   │   ├── step-3/page.tsx           ← Étape 3 axes
│   │   └── success/page.tsx          ← Succès animé
│   └── dashboard/page.tsx            ← garde onboardingCompleteLe
├── components/onboarding/
│   ├── onboarding-shell.tsx
│   ├── step-indicator.tsx
│   ├── section-header.tsx
│   ├── deep-research-banner.tsx
│   ├── deep-research-toast.tsx
│   ├── company-card.tsx
│   ├── company-suggestion-chip.tsx
│   ├── axis-card.tsx
│   ├── axis-grid.tsx
│   ├── radar-pulse-decor.tsx
│   ├── radar-mark-boot.tsx
│   ├── onboarding-success-client.tsx
│   └── step-1-form.tsx | step-2-form.tsx | step-3-form.tsx (containers Client)
├── lib/
│   ├── actions/onboarding.ts
│   ├── agents/deep-research.mock.ts
│   ├── onboarding/axes.ts
│   └── validators/onboarding.ts
packages/database/prisma/schema.prisma  ← + axes String[], onboardingCompleteLe DateTime?
```

---

## 14. Variables d'environnement

Aucune nouvelle variable. Sprint 04 ajoutera `OPENCLAW_BASE_URL` et `RADAR_INTERNAL_SECRET` pour le vrai Deep Research.

---

## 15. Critères d'acceptation

- [ ] **15.1** L'utilisateur sans onboarding complet est redirigé vers `/onboarding/step-1` à toute tentative d'accès `/dashboard`
- [ ] **15.2** L'utilisateur visitant `/onboarding` est redirigé vers la prochaine étape incomplète (step-1 si pas de profil, step-2 si pas de concurrent, step-3 si pas d'axe, sinon `/dashboard`)
- [ ] **15.3** Step-1 valide les 2 champs avec Zod, affiche le toast Deep Research, persiste le profil et redirige vers step-2
- [ ] **15.4** Step-2 permet d'ajouter inline des concurrents (≥1 requis), affiche les suggestions Maroc/Maghreb, supporte le shake error, persiste chaque ajout/suppression progressivement
- [ ] **15.5** Step-3 affiche les 5 cards d'axes selon les codes couleurs (violet, safran, teal, rose, vert), supporte la sélection multiple avec animation de check, valide ≥1 axe
- [ ] **15.6** Success screen affiche les stats réelles (count concurrents + count axes), exécute la séquence d'animation, auto-redirige vers `/dashboard` après 6s
- [ ] **15.7** Stepper animé : étape active pulse, étapes complétées teal solide avec icône Check, connectors teal entre les étapes complétées
- [ ] **15.8** Toutes les pages chargent en moins de 200 ms en local (Server Component + données pré-chargées Prisma)
- [ ] **15.9** Tous les formulaires sont accessibles clavier : tab order logique, focus visible, aria-invalid, aria-describedby
- [ ] **15.10** Aucune erreur TypeScript ni ESLint, build Turbopack propre
- [ ] **15.11** Mobile <768px : stepper compact, grids stacked, footer touch-friendly (h ≥ 44px)

---

## 16. Hors scope (différé sprints ultérieurs)

- **Vrai Deep Research OpenClaw** (sprint 04) : appel `POST http://openclaw:18789/v1/chat/completions` avec le profil partiel, callback `/api/internal/profil` qui enrichit `ProfilUtilisateur` et `Concurrent`. Pour sprint 02, mock fire-and-forget.
- **Edition profil + concurrents post-onboarding** (sprint 09 — F7 du PRD) : pages `/settings/company`, `/settings/competitors`, `/settings/axes` avec CRUD complet et soft-delete.
- **Templates email** (sprint 03) : email de bienvenue à la fin de l'onboarding via Resend.
- **Tests Playwright** : `tests/e2e/onboarding.spec.ts` qui couvre les 4 écrans + les états d'erreur.
- **Per-competitor axis selection** : pour V1, les axes sont au niveau du profil (mêmes axes appliqués à tous les concurrents). PRD § 7.3 prévoit `CompetitorAxis` en V2.
- **Limite concurrents** : la limite max 10 concurrents par utilisateur (PRD § 7.3) sera enforced au sprint 09 (settings) — au sprint 02, la liste est libre car le user n'aura jamais 10 concurrents dans le flow happy path.

---

## 17. Dépendances

Aucune nouvelle dépendance npm. Tout est déjà installé au sprint 01 (`zod`, `react-hook-form`, `@hookform/resolvers`, `lucide-react`).

---

## 18. Références

- PRD § 5.3 (Phase 2 : Onboarding Deep Research)
- PRD § 7.3 (F2 : Onboarding Deep Research, dépendances, scope)
- Charte graphique : `Branding/CHARTE_GRAPHIQUE_RADAR.md`
- Design source de vérité : `.tmp-design/onboarding/radar/project/`
  - `RADAR Onboarding.html` (canvas avec 13 artboards)
  - `onb-styles.css` + `onb-chrome.jsx` + `onb-screens.jsx` + `onb-icons.jsx`
- Sprint 01 : `docs/Sprint-01/SPEC-Sprint01-Authentification.md` (continuité persona Karim Berrada)
- KARAMO.md (décisions architecturales binôme : OpenClaw image + endpoints `/api/internal/*`)
