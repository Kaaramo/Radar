# User Stories — Sprint 02 : Onboarding Deep Research

> Suite directe du Sprint 01. Karim Berrada vient de créer son compte. Le digest qu'il va recevoir demain matin n'existe pas encore : il faut d'abord apprendre à RADAR ce qu'est Marka Logistics et qui sont ses concurrents.

---

## Préambule narratif

**Karim Berrada**, 47 ans, fondateur et CEO de **Marka Logistics**. PME marocaine de logistique B2B basée à Casablanca, 35 salariés, 6 ans d'existence, 4 entrepôts (Casa, Tanger, Marrakech, Agadir). Karim a un MBA HEC Paris, dix ans chez DHL Maroc avant de monter sa boîte en 2020. Il dirige l'opérationnel autant que le commercial.

Lundi matin, 7h12. Karim vient de cliquer sur le lien de vérification email reçu il y a 2 minutes (Sprint 01). Le navigateur s'ouvre sur un écran qui dit « Bienvenue, Karim. ». Pas de tableau de bord encore : un wizard 3 étapes.

> _« Bon. On me demande deux trois infos pour démarrer. J'aime bien quand c'est court, mais j'aime aussi que la machine soit honnête : si elle me promet de chercher mes concurrents toute seule après, je veux voir le travail. »_

Karim a ouvert RADAR sur son MacBook Pro M3 16", écran Retina, sur Safari Technology Preview. La fenêtre fait 1440px de large. Il a son café dans une main, l'iPhone à côté qui sonnera dans 8 minutes pour le standup commercial.

---

## EPIC 1 — L'entreprise (Étape 1)

### US-O01 — Saisie minimale viable

**En tant que** dirigeant qui découvre RADAR
**Je veux** renseigner mon entreprise en deux champs (nom + site web)
**Afin de** démarrer la veille sans avoir à remplir un dossier RH de 20 questions

**Scénario** :

Karim arrive sur l'écran « Parlons de votre entreprise. ». Le titre est en gros (28px, bien clair). En dessous, un sous-titre lui explique que l'agent IA va analyser le web pour comprendre son activité — Karim apprécie l'honnêteté du verbe « analyser ». Il ne veut pas qu'on lui pose 15 questions sur son secteur, sa taille, son ICP : il sait que RADAR va aller chercher ça tout seul.

Le formulaire ne contient que **deux champs**. Il tape :

- Nom de votre entreprise : `Marka Logistics`
- Site internet : `https://www.markalogistics.ma`

Dès qu'il sort du second champ (blur), une coche verte apparaît à droite de chaque input. Le bouton « Suivant » (en bas à droite, sticky) devient actif (teal solide). Il y a un encart en bas du formulaire avec une icône Sparkles teal qui pulse doucement, et un texte qui dit :

> **Deep Research IA** — dès que vous passez à l'étape suivante, notre agent explore le web pour identifier votre secteur, vos concurrents potentiels, vos clients types et votre positionnement.

Karim sourit. Il s'attendait à devoir taper « logistique B2B Maroc » dans un champ « Secteur » et « 35 » dans un champ « Effectif ». Pas la peine, RADAR va le déduire.

**Critères d'acceptation testables** :

- [ ] Le formulaire ne contient que 2 champs (nom et site web)
- [ ] Une coche verte apparaît dans chaque input dès qu'il est rempli avec une valeur valide
- [ ] Le bouton Suivant est désactivé tant qu'au moins 1 champ est invalide
- [ ] Le banner Deep Research est visible sous les champs avec icône Sparkles pulsante teal
- [ ] Aucune saisie n'est demandée sur le secteur, l'ICP, la taille ou les mots-clés métier

---

### US-O02 — Erreurs visibles, message en français

**En tant que** dirigeant pressé
**Je veux** voir mes erreurs de validation directement sous chaque champ
**Afin de** corriger sans deviner ce qui cloche

**Scénario** :

Cas alternatif. Karim, distrait par le téléphone, tape « M » dans le nom et « markalogistics » dans le site (sans https). Il clique Suivant.

L'écran ne change pas, mais sous chaque champ apparaît un message rouge avec une icône AlertCircle 14px :

- Nom : « Le nom doit contenir au moins 2 caractères »
- Site : « Format d'URL invalide. Ex : https://www.exemple.ma »

Le focus saute sur le premier champ invalide (le nom), la border devient rouge, le ring rouge transparent (`rgba(239, 68, 68, 0.25)`) apparaît au focus.

Karim corrige (« Marka Logistics ») puis se rappelle qu'il faut le https (« https://www.markalogistics.ma »). Les coches vertes reviennent. Il clique Suivant.

**Critères d'acceptation testables** :

- [ ] Click Suivant sur un champ trop court (<2 chars) déclenche un message « Le nom doit contenir au moins 2 caractères »
- [ ] Click Suivant sur une URL sans protocole déclenche « Format d'URL invalide. Ex : https://www.exemple.ma »
- [ ] Le focus saute automatiquement sur le 1er champ invalide
- [ ] Les bordures et messages d'erreur sont en rouge `#EF4444`
- [ ] Une fois corrigés, les messages disparaissent immédiatement (validation onChange après le 1er submit)

---

### US-O03 — Toast « Deep Research lancé »

**En tant que** utilisateur après l'étape 1
**Je veux** un signal visuel que l'IA travaille pour moi en arrière-plan
**Afin de** sentir que je gagne du temps réel sans attendre

**Scénario** :

Karim clique Suivant après avoir saisi correctement. Pendant ~200 ms, un toast apparaît en haut à droite de la fenêtre (top: 88px, right: 24px) :

> ✦ Deep Research lancé...

Le toast a un fond `bg-bg-elevated`, une border-left teal 3px, l'icône Sparkles 14px teal à gauche du texte. Il glisse depuis le haut (translateY -6px → 0) en 200ms.

À la même seconde, l'écran transitionne vers l'étape 2. Le toast disparaît automatiquement après 2400ms (Karim ne le verra qu'à moitié, c'est voulu : c'est juste un accusé de réception). Pendant ce temps, côté serveur, une fonction `triggerDeepResearch(profilId)` a été appelée (fire-and-forget). En sprint 02 elle ne fait que logger ; en sprint 04 elle déclenchera réellement OpenClaw.

**Critères d'acceptation testables** :

- [ ] Le toast apparaît en haut à droite avec slide-down + fade-in 200ms
- [ ] La transition vers `/onboarding/step-2` se fait dans la même tick (pas d'attente bloquante)
- [ ] Le toast disparaît automatiquement après 2400ms même sans interaction
- [ ] Dans les logs serveur, `triggerDeepResearch(profilId)` est appelé (mock loggé en console.info)

---

## EPIC 2 — Les concurrents (Étape 2)

### US-O04 — Ajout inline d'un concurrent

**En tant que** dirigeant méthodique
**Je veux** ajouter mes concurrents un par un avec leur site web
**Afin de** suivre exactement ceux que je veux et non une liste auto-suggérée

**Scénario** :

Karim arrive sur l'étape 2. Le titre est « Quels concurrents surveiller ? », le sous-titre lui explique : « Ajoutez les entreprises que vous voulez garder à l'œil. Notre agent visitera leurs sites quotidiennement à 6h pour détecter leurs mouvements. »

L'écran est vide, avec une zone en grid : nom du concurrent, site web, et un bouton « + Ajouter ». En dessous, un empty state dashed : « Aucun concurrent ajouté. Commencez par ajouter ceux dont vous voulez suivre l'activité. »

Karim tape « Geodis Maroc » dans le nom, « https://www.geodis.com/ma » dans le site, et clique Ajouter. La card apparaît immédiatement avec une animation translateX (24px → 0) en 200ms : avatar lettre G, nom Geodis Maroc, site mono. Les inputs se vident, prêts pour le suivant.

Il continue : « Bolloré Logistics Maroc » + site, « SDV International Maroc » sans site (le placeholder devient italique tertiary « Pas de site renseigné »), « Damco Maroc » + site.

À 4 concurrents ajoutés, le compteur en pied de liste affiche en italique : « **4** concurrent(s) ajouté(s) (recommandé) », avec une coche verte CheckCircle2 14px. Karim sait qu'il est dans la zone idéale (3-5 concurrents recommandés).

**Critères d'acceptation testables** :

- [ ] La saisie inline se fait via 2 FormInputs + bouton Ajouter dans une grid `1fr 1fr auto`
- [ ] Click Ajouter avec un nom valide insère une card dans la liste avec animation `comp-in`
- [ ] Les inputs sont vidés après chaque ajout
- [ ] Le compteur affiche le nombre exact, et « (recommandé) » + coche verte dès N ≥ 3
- [ ] Un site web vide affiche « Pas de site renseigné » en italique gris

---

### US-O05 — Suggestions Maroc/Maghreb

**En tant que** utilisateur indécis ou pressé
**Je veux** voir des suggestions Maroc/Maghreb adaptées à mon contexte
**Afin de** gagner du temps sans avoir à connaître l'orthographe exacte

**Scénario** :

Cas alternatif. Karim hésite. Il a entendu parler d'autres acteurs mais ne se souvient pas exactement des noms. En dessous de l'empty state, une row de chips mono apparaît :

> Suggestions Maroc / Maghreb : `Roland Berger Maroc` `McKinsey Maroc` `Cabinet Mazars` `Wafa Salaf` `Inwi`

Les chips sont en mono (JetBrains Mono 13px), border `#334155`, hover teal. Karim clique sur « Wafa Salaf » : le nom se préremplit dans le champ Nom. Il tape ensuite le site web (ou pas) et clique Ajouter.

**Note design** : les suggestions sont en V1 hardcodées. En V2, elles viendront d'un endpoint OpenClaw qui a déjà fait son Deep Research basé sur le profil de l'étape 1.

**Critères d'acceptation testables** :

- [ ] Les chips de suggestions sont visibles uniquement quand `items.length === 0`
- [ ] Click sur un chip préremplit le champ Nom du concurrent
- [ ] Le focus saute sur le champ Site web après préremplissage
- [ ] Les chips ont un hover teal `#14B8A6` border + texte primary

---

### US-O06 — Erreur 0 concurrent (shake)

**En tant que** utilisateur ayant tapé 0 concurrent
**Je veux** comprendre que je dois en ajouter au moins 1 sans bloc d'erreur agressif
**Afin de** corriger sans frustration

**Scénario** :

Karim, dans un instant de distraction, clique Suivant en bas à droite alors que sa liste est vide. Le formulaire ne change pas d'écran : la zone d'ajout subit une animation `shake` (translateX -6px / +6px / -4px / +4px en 400ms ease-in-out). Sous la zone d'ajout, un message inline rouge s'affiche : icône AlertCircle 14px + « Ajoutez au moins 1 concurrent à surveiller. ».

Karim comprend. Il ajoute Geodis Maroc et reclique Suivant. Pas de re-shake, transition vers l'étape 3.

**Critères d'acceptation testables** :

- [ ] Click Suivant avec 0 concurrent déclenche le shake 400ms sur la add row
- [ ] Le message inline apparaît avec icône AlertCircle 14px en error
- [ ] Le focus saute sur le champ Nom
- [ ] Aucun message de blocage modal — feedback inline uniquement

---

### US-O07 — Suppression d'un concurrent (trash)

**En tant que** utilisateur ayant ajouté un concurrent par erreur
**Je veux** pouvoir le supprimer en un clic
**Afin de** corriger sans recommencer toute l'étape

**Scénario** :

Karim a ajouté « Damco Maroc » mais réfléchit : Damco a été racheté par Maersk et a disparu en 2017. Il survole la card Damco : la corbeille (icon trash 18px) à droite passe en rouge sur hover (color error, bg `bg-bg-elevated`). Il clique. La card disparaît immédiatement (la liste se réordonne sans animation pour éviter le jank). Le compteur passe de 4 à 3 (« (recommandé) » reste affiché).

**Critères d'acceptation testables** :

- [ ] Le bouton trash est visible à droite de chaque card
- [ ] Hover trash → color error rouge + bg `bg-bg-elevated`
- [ ] Click trash supprime la card immédiatement (server action `removeConcurrent`)
- [ ] Le compteur se met à jour automatiquement
- [ ] aria-label du bouton : `Supprimer {nom du concurrent}` (accessibilité)

---

## EPIC 3 — Les axes (Étape 3)

### US-O08 — Sélection multiple parmi 5 axes

**En tant que** dirigeant stratège
**Je veux** choisir mes axes de surveillance parmi 5 catégories par défaut
**Afin de** cibler la veille sur ce qui m'intéresse vraiment

**Scénario** :

Karim arrive sur l'étape 3. Titre : « Quels axes stratégiques surveiller ? ». Sous-titre : « Sélectionnez les types de mouvements que notre agent doit détecter chez vos concurrents. Vous pourrez ajuster à tout moment depuis Paramètres. »

Une grid 2 colonnes affiche **5 cards** (la 5ème en col-span 2 pour équilibrer). Chaque card a sa propre couleur de marque :

| Card                         | Couleur          | Ce qui parle à Karim                                                                                     |
| ---------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------- |
| Recrutements et RH           | Violet `#8B5CF6` | « Si Geodis recrute un Directeur Stratégie senior, je veux le savoir avant le LinkedIn de l'intéressé. » |
| Stratégie et direction       | Safran `#F59E0B` | « Levées de fonds, fusions, partenariats. Le pain quotidien. »                                           |
| Technologie et innovation    | Teal `#14B8A6`   | « Pas trop ma spécialité mais utile pour comprendre les disruptions. »                                   |
| Présence digitale            | Rose `#EC4899`   | « Marketing campaigns LinkedIn, refonte site. Effet de mode. »                                           |
| Réglementation et conformité | Vert `#10B981`   | « Certifications ISO, RGPD. Ennuyeux mais critique pour les marchés publics. »                           |

Chaque card affiche : un icône rond 36px en couleur brand sur fond axe-tint-strong, un titre 16px 600, une description 14px secondary, et un exemple en mono italique tertiary (« → "Cabinet X recrute un Directeur Stratégie senior" »).

Karim clique sur **Stratégie et direction** : la card s'allume :

- Background passe à axe-tint (couleur@10%)
- Border passe à 2px axe-color
- Box-shadow `0 0 24px axe-glow` apparaît
- Coin haut-droit : icône CheckCircle2 18px en couleur axe avec animation spring scale 0 → 1.1 → 1 en 300ms

Il clique aussi sur **Technologie et innovation** et **Recrutements et RH**. Compteur en pied : « **3** axe(s) sélectionné(s) (recommandé) » + coche verte.

**Critères d'acceptation testables** :

- [ ] Les 5 cards sont affichées avec les couleurs exactes spécifiées
- [ ] Click sur une card non sélectionnée → tint + border 2px + glow + check spring 300ms
- [ ] Click sur une card sélectionnée → désélection (état default)
- [ ] Le compteur affiche le nombre exact + « (recommandé) » dès N ≥ 3
- [ ] aria-checked à jour sur chaque card (role checkbox)

---

### US-O09 — Tout sélectionner / Tout désélectionner

**En tant que** utilisateur indécis
**Je veux** sélectionner les 5 axes en un clic
**Afin de** démarrer large et affiner plus tard

**Scénario** :

Au-dessus de la grid, à droite, Karim voit un lien teal 13px : « Tout sélectionner ». Il clique. Les 5 cards s'allument simultanément (chacune anime son check spring). Le lien devient « Tout désélectionner ». Le compteur passe à « **5** axe(s) sélectionné(s) (recommandé) ».

Karim hésite et reclique « Tout désélectionner » : les 5 cards reviennent à default, compteur passe à « Sélectionnez au moins 1 axe » en error. Il reclique « Tout sélectionner » : retour aux 5/5.

**Critères d'acceptation testables** :

- [ ] Le lien `Tout sélectionner` toggle entre les 2 libellés selon l'état
- [ ] Click déclenche les 5 animations check en parallèle (pas de cascade visible)
- [ ] Hover du lien : color teal-400 + underline avec offset 4px

---

### US-O10 — Erreur 0 axe (shake) + bouton « Armer le radar »

**En tant que** utilisateur ayant 0 axe
**Je veux** être averti que je dois en sélectionner au moins 1
**Afin de** ne pas armer un radar inutile

**Scénario** :

Karim, par jeu, désélectionne tout puis clique « Armer le radar » (le bouton primary en bas à droite, libellé spécifique à cette étape, avec icône `Check`). La grid subit le shake 400ms. Le compteur en pied passe en error rouge avec icône AlertCircle. Karim re-sélectionne 3 axes et reclique. Cette fois, transition vers `/onboarding/success`.

Côté serveur, `completeOnboarding({ axes: [...] })` est appelée :

1. Validation Zod du tableau d'axes (sous-ensemble non-vide des 5 clés)
2. `prisma.profilUtilisateur.update({ data: { axes, onboardingCompleteLe: new Date() } })`
3. Server-side redirect vers `/onboarding/success`

**Critères d'acceptation testables** :

- [ ] Le bouton CTA de l'étape 3 affiche « Armer le radar » + icône Check 16px (pas la flèche par défaut)
- [ ] Click avec 0 axe → shake 400ms sur la grid + compteur en error
- [ ] Click avec ≥1 axe → action serveur completeOnboarding + redirect vers /onboarding/success
- [ ] Après complétion, `prisma.profilUtilisateur.onboardingCompleteLe` est set sur le timestamp du moment

---

## EPIC 4 — Le succès

### US-O11 — Écran de succès animé + auto-redirect

**En tant que** utilisateur ayant fini les 3 étapes
**Je veux** voir un écran d'accueil élégant qui célèbre l'armement de mon radar
**Afin de** sentir que c'est lancé, pas être renvoyé brutalement sur le dashboard

**Scénario** :

Karim arrive sur `/onboarding/success`. Pendant les premières secondes, l'écran joue une séquence chorégraphiée :

- T+0 : la mark RADAR (64×64, dans un halo radial teal 18%) apparaît avec un pop spring (scale 0 → 1.1 → 1)
- T+200, +400, +600 ms : les 3 arcs de la mark se dessinent par stroke-dashoffset (cascade)
- T+800 : le dot safran de la mark blink 2 fois puis se stabilise
- T+600 : H1 « Votre radar est armé. » fade-up
- T+1000 : sub « Le premier cycle de veille démarre demain à 6h. Vous recevrez le digest à 7h. » fade-up
- T+1400 : 3 stats (4 concurrents safran / 3 axes teal / Deep Research violet « En cours ») fade-up en bloc
- T+2200 : CTA « Accéder au dashboard » fade-up
- T+2600 : note italique tertiary fade-up

En arrière-plan, 3 cercles concentriques teal (rayons 80, 160, 240) pulsent en cascade (6s par cycle, délais 0/2/4s).

Karim regarde l'animation pendant 3-4 secondes. Il pourrait cliquer le bouton, mais il observe. À T+6000, l'écran redirige automatiquement vers `/dashboard`.

> _« C'est joli. Ça respire. Ça donne le sentiment que la machine est prête. »_

**Critères d'acceptation testables** :

- [ ] La séquence d'animation suit exactement les délais spécifiés (0 / 200 / 400 / 600 / 800 / 600 / 1000 / 1400 / 2200 / 2600 ms)
- [ ] Les 3 cercles bg pulsent en cascade infinie (6s, délais 0/2/4)
- [ ] Le dot safran de la mark est visible et clignote 2 fois en 800ms
- [ ] Auto-redirect vers `/dashboard` à T+6000 ms (cleanup au unmount via clearTimeout)
- [ ] Click sur le CTA « Accéder au dashboard » court-circuite le timer et redirect immédiatement
- [ ] Stats : count exact des concurrents et axes, « En cours » pour Deep Research

---

### US-O12 — Garde dashboard si onboarding incomplet

**En tant que** utilisateur revenant le lendemain matin
**Je veux** accéder directement au dashboard
**Afin de** ne pas refaire l'onboarding ni voir une banderole intrusive

**Scénario** :

Karim ferme son ordi à 7h35. Il revient le mardi matin à 8h12 et tape `radar.example.ma` dans son navigateur. Better Auth a son cookie de session valable 7 jours. La page racine `/` redirige vers `/dashboard`. Le dashboard vérifie que `prisma.profilUtilisateur.findUnique({ where: { userId } })?.onboardingCompleteLe !== null` : c'est le cas. Le dashboard charge avec ses 4 concurrents et le digest du jour (qui n'existe pas encore en sprint 02 mais existera en sprint 04).

Cas alternatif. Si Karim avait quitté à mi-onboarding (par exemple après l'étape 1 mais avant l'étape 2) et revenu le lendemain, en visitant `/dashboard` il aurait été redirigé vers `/onboarding`, qui aurait calculé que `step-1 fait` + `step-2 manquant`, et redirigé vers `/onboarding/step-2`. Aucune saisie perdue.

**Critères d'acceptation testables** :

- [ ] Visite de `/dashboard` avec onboarding complet → page dashboard normalement chargée
- [ ] Visite de `/dashboard` sans profil OU sans concurrent OU sans axe → redirect vers `/onboarding`
- [ ] Visite de `/onboarding` avec étape 1 faite, étape 2 incomplète → redirect vers `/onboarding/step-2`
- [ ] Visite de `/onboarding` avec étapes 1 et 2 faites, étape 3 incomplète → redirect vers `/onboarding/step-3`
- [ ] Visite de `/onboarding` complet → redirect vers `/dashboard`
- [ ] Aucune donnée saisie n'est perdue entre 2 sessions (persistance Prisma progressive à chaque étape)

---

## Critères de validation globaux du sprint

- [ ] Karim peut compléter l'onboarding (3 étapes + succès) en moins de 90 secondes en tapant à vitesse normale
- [ ] L'animation de succès est continue (pas de jank) sur un MacBook M3 Safari TP
- [ ] Le wizard est accessible clavier de bout en bout : tab order logique, focus visible teal, Enter pour soumettre
- [ ] Les 13 artboards du design `RADAR Onboarding.html` sont reproduits pixel-perfect (tolérance ±2px sur les paddings, ±20ms sur les durées d'animation)
- [ ] Aucune erreur TypeScript ni ESLint, build Turbopack propre, type-check sur tous les workspaces

---

## Hors scope (rappel SPEC § 16)

- Vrai déclenchement OpenClaw (mocké en sprint 02, branché sprint 04)
- Édition profil/concurrents/axes après l'onboarding (sprint 09 — F7)
- Email de bienvenue Resend (sprint 03)
- Tests Playwright (sprint 10 ou en continu selon décision binôme)
- Per-competitor axis selection (V2)
