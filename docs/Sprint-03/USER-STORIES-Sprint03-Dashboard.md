# User Stories — Sprint 03 : Dashboard de veille

> Suite directe des sprints 01-02. Karim Berrada vient de finir son onboarding. Le premier cycle de veille a tourné cette nuit. Il est 7h05, il vient de recevoir le digest email — son comportement les 30 prochaines secondes décide si RADAR survit dans son flux quotidien ou rejoint le cimetière des SaaS testés une fois.

---

## Préambule narratif

**Karim Berrada**, 47 ans, fondateur et CEO de **Marka Logistics**. PME marocaine de logistique B2B, Casablanca, 35 salariés, 6 ans, 4 entrepôts. MBA HEC Paris, dix ans chez DHL Maroc avant la création.

Mardi 14 mai 2026, 7h04. Karim termine son café, son iPhone vibre dans sa poche : email de **digest@radar.ma**. Sujet : « ☕️ 8 mouvements concurrents détectés cette nuit ». Il l'ouvre, scanne en diagonale les 8 lignes, voit deux titres qui le heurtent :

> **Inwi nomme un nouveau Directeur Stratégie pour piloter la transformation 5G**
> **Roland Berger Maroc rachète le cabinet Strategy & North Africa**

Il clique sur le bouton « Voir le rapport complet » du mail. Le navigateur s'ouvre sur RADAR. **Il est sur le dashboard pour la première fois.** Les 30 prochaines secondes décident si RADAR sera adopté ou abandonné.

> _« Bon, on me promet que je vais comprendre en 5 minutes ce qu'il s'est passé chez mes concurrents cette nuit. Voyons si c'est vrai. »_

Karim a son MacBook Pro M3 16", écran Retina, 1920×1200. Safari Technology Preview. Café (presque) fini. Standup commercial dans 12 minutes.

---

## EPIC 1 — Le premier digest (le moment AHA, J+1)

### US-D01 — Découverte du feed nominal

**En tant que** dirigeant qui ouvre RADAR pour la 1ʳᵉ fois en mode opérationnel
**Je veux** voir immédiatement les mouvements détectés cette nuit
**Afin de** convertir le digest email en compréhension actionnable

**Scénario** :

Karim atterrit sur `/dashboard`. Le dashboard se charge en 320 ms (Server Component, mocks → bientôt Prisma).

Sa première impression visuelle (haut → bas) :

1. **Sidebar gauche** (`#0B0F14` → légèrement plus foncé que le contenu) : logo RADAR teal, sections « VEILLE » et « CONFIGURATION », nav avec badges count (`Dashboard 8`, `Concurrents 5`, `Signaux faibles 3`), une **card cycle terminé** verte « **8 mouvements détectés** · Il y a 2h », et tout en bas son avatar.
2. **Header sticky** : titre « Dashboard », search input centré, bouton « Lancer un cycle » teal, cloche notifs (avec dot teal), avatar.
3. **Tabs** : « Feed (8) » actif, « Signaux faibles (3) » avec badge safran, « Cycles ».
4. **4 stat cards en row** :
   - `Mouvements ce matin : 12` (TrendingUp vert « +3 vs hier »)
   - `Sauvegardés (en analyse) : 4`
   - `Score CRAAP moyen 30j : 7.4 / 10` (TrendingUp « +0.3 vs mois dernier »)
   - `Concurrents suivis actifs : 5`
5. **FilterBar** : 5 dropdowns (Concurrent · Axe · Période · Score CRAAP min · Statut) dont 2 actifs en teal + chips actifs en dessous + bouton « Réinitialiser ».
6. **Header du feed** : « **8 mouvements** détectés sur la période » + sélecteur de tri à droite.
7. **Liste de cards mouvements** :
   - 1ʳᵉ card : axe `STRATÉGIE` safran, concurrent `Inwi`, dot NEW pulsant teal en haut-droite, titre H3, extrait 2 lignes, sources `medias24.com · leconomiste.com`, score `8.2/10` teal à droite — **border-left 3px teal** (mouvement validé + critique)
   - 2ème : Roland Berger STRATÉGIE, score 8.6/10, NEW
   - 3ème : Wafa Salaf TECH (rose), score 6.4/10, **VIEWED** (opacité 0.7)
   - 4ème : BMCE BOA DIGITAL, NEW, score 7.4/10
   - 5ème : Bank Al-Maghrib RÉGLEMENT., score 9.1/10, **SAVED** (bookmark filled safran)
   - etc.
8. **Pagination** : « Affichage 1–8 sur 8 ».

> _« OK je vois. Card propre, dense mais aérée. Les deux titres qui m'ont accroché dans l'email sont en haut. Je clique sur Inwi. »_

**Critères d'acceptation testables** :

- [ ] Le dashboard charge en moins de 500ms en local (Server Component + mocks)
- [ ] Sidebar fixe 248px, contenu scrollable, header sticky top
- [ ] 8 movement cards visibles, chacune avec axe/concurrent/title/extract/sources/CRAAP score visible
- [ ] Tri par défaut « Plus récents »
- [ ] Pagination affichée même si une seule page
- [ ] Hover sur une card : `transform: translateY(-2px)` + shadow-lg + actions à droite révélées (bookmark / check / X / arrow)

---

### US-D02 — Stats du jour en 3 secondes

**En tant que** dirigeant pressé
**Je veux** voir l'amplitude de la nuit en 3 secondes
**Afin de** décider si je creuse ou si je passe au standup

**Scénario** :

Karim lit la stat row sans scroller : « 12 mouvements · 4 sauvegardés · CRAAP 7.4/10 · 5 concurrents ». La 1ʳᵉ stat a un `+3 vs hier` en vert, la 3ème un `+0.3 vs mois dernier` en vert.

> _« Volume normal. Pas de pic anormal. Mais Inwi qui nomme un Directeur Stratégie, c'est pas anodin. »_

Le `+3 vs hier` signale un volume légèrement plus élevé. Le `+0.3 sur 30 jours` indique que la qualité moyenne des sources progresse (signal positif sur la maturité du système).

**Critères d'acceptation testables** :

- [ ] 4 stats en row, gap 16px, sur 1 ligne en desktop ≥ 1280px
- [ ] Chaque stat : icône carrée tinted + label caption + value 28px font-display + change row optionnelle (TrendingUp vert / TrendingDown rouge)
- [ ] Stats variantes J0 disponibles : valeurs à 0, sublabel « Premier cycle demain » sur la 1ʳᵉ card

---

## EPIC 2 — Filtrer et naviguer

### US-D03 — Filtrer par concurrent

**En tant que** utilisateur méthodique
**Je veux** filtrer le feed par concurrent
**Afin de** me concentrer sur Inwi et Roland Berger seulement

**Scénario** :

Karim clique sur le dropdown `Concurrent`. Un menu apparaît avec une liste de checkboxes (les 5 concurrents qu'il suit). Il coche `Inwi` et `Roland Berger`. Le dropdown se ferme.

L'URL devient `/dashboard?concurrent=Inwi&concurrent=Roland%20Berger`. Sous la filterbar, **2 chips actifs** apparaissent : `Concurrent : Inwi ×` et `Concurrent : Roland Berger ×`. Le dropdown `Concurrent` est maintenant en **bordure teal** avec sa value affichée « 2 sélectionnés ».

Le feed se met à jour : 2 cards visibles. Le compteur `FeedHeader` passe de « 8 mouvements » à « 2 mouvements ». Le bouton « Réinitialiser » apparaît à droite de la filterbar.

Karim copie l'URL. Il pourra la coller dans Slack pour partager avec son associé.

> _« L'URL contient le filtre. Bon point — je peux bookmark un dashboard filtré. »_

**Critères d'acceptation testables** :

- [ ] L'URL reflète l'état des filtres en temps réel (Nuqs)
- [ ] Le dropdown actif passe en bordure teal et affiche sa value
- [ ] Les chips actifs s'affichent dans une row sous la filterbar, fermables via X
- [ ] Le bouton « Réinitialiser » apparaît dès qu'au moins 1 filtre est actif
- [ ] Copier-coller l'URL filtrée dans un nouvel onglet restaure exactement le même état

---

### US-D04 — Distinguer les mouvements critiques

**En tant que** stratège
**Je veux** distinguer visuellement les mouvements critiques des standards
**Afin de** prioriser ma lecture sans avoir à tout lire

**Scénario** :

Karim a retiré ses filtres. Il scanne les 8 cards en 4 secondes. Les 2 premières (Inwi et Roland Berger) ont une **border-left 3px teal** : elles sont validées (≥2 sources) ET critiques (axes Stratégie ou Réglementation). L'œil les capte naturellement.

La carte Wafa Salaf (TECH, blog technique) a une border-left **fine** ou **transparente** : c'est un signal seul, source unique, à recouper. La carte Attijariwafa (Strategie mais source unique blog Medium) a aussi une border-left transparente + score CRAAP rouge `4.2/10` : c'est l'archétype du « mouvement à ignorer ».

> _« La hiérarchie visuelle fait le travail. En 4 secondes je sais quoi lire et quoi ignorer. »_

**Critères d'acceptation testables** :

- [ ] `valid: true && critique: true` → border-left 3px teal `#14B8A6`
- [ ] `valid: true && critique: false` → border-left 3px teal/40
- [ ] `valid: false` → pas de border-left, status visuellement en retrait
- [ ] Score CRAAP couleur :
  - ≥ 8 : teal
  - 6-8 : vert
  - 4-6 : safran
  - < 4 : rouge

---

## EPIC 3 — Décider et marquer (workflow utilisateur)

### US-D05 — Marquer comme sauvegardé / vu / ignoré

**En tant que** utilisateur méthodique
**Je veux** marquer chaque mouvement (sauvegardé, vu, ignoré)
**Afin de** tenir mon flux de travail jour après jour

**Scénario** :

Karim hover la card Inwi. Les 4 actions apparaissent à droite (avant elles étaient masquées). Il clique sur l'icône bookmark : la card s'allume avec un bookmark filled safran, le compteur « Sauvegardés (en analyse) » passe de 4 à 5. Server Action `markMovementSaved('mvt_01')` part en arrière-plan.

Sur la card Wafa Salaf (TECH, blog), il clique sur le check (« Marquer vu ») : la card prend une opacité réduite (0.7), le check devient vert, mais la card reste dans le feed (pour éviter le « disparait sous mes yeux »). Karim peut la re-démarquer si erreur.

Sur la card Attijariwafa (faible score 4.2, source unique blog), il clique sur la croix (« Ignorer ») : un tooltip apparaît brièvement « Mouvement masqué — Annuler », la card reste 2s puis disparaît avec un fade-out.

> _« Les actions sont à portée de main mais ne polluent pas la card au repos. Le hover réveille seulement ce qu'il faut. »_

**Critères d'acceptation testables** :

- [ ] Actions visibles uniquement au hover de la card (transition opacity 200ms)
- [ ] Click bookmark → toggle SAVED + persistance via Server Action + revalidatePath
- [ ] Click check → toggle VIEWED, opacité 0.7
- [ ] Click X → confirmation tooltip puis fade-out 2s
- [ ] L'action est annulable tant que la card est encore visible (re-clic = undo)

---

## EPIC 4 — Approfondir (drawer + page concurrent)

### US-D06 — Drawer détail mouvement

**En tant que** utilisateur curieux
**Je veux** cliquer sur un mouvement pour voir le détail
**Afin de** comprendre les sources et le scoring

**Scénario** :

Karim clique sur la card Inwi (n'importe où sur la card hors actions). L'URL passe à `/dashboard?mvt=mvt_01`. **Un drawer 540px slide-in depuis la droite en 280ms** (cubic-bezier(0.16, 1, 0.3, 1) — easing premium). Backdrop noir 60% derrière.

Contenu du drawer :

1. **Header** : axe `STRATÉGIE` safran + concurrent `Inwi` + H2 titre + meta mono « Détecté le 04 mai 2026 · Cycle #42 · Vu 0 fois » + **CraapScoreBadge `8.2/10` size lg** à droite (cercle 72px bordé teal + score 22px + 5 stars dont 4 filled teal) + bouton X close.
2. **Actions row** : `Sauvegarder` `Marquer vu` `Ignorer` (danger) — spacer — Share2, ExternalLink.
3. **Synthèse** (H3) : 2 paragraphes en 14px. Le mot **« Amine Benkirane »** (le nouveau CSO) est en strong dans le 1er paragraphe.
4. **Sources collectées (2)** (H3) : caption « Recoupement : 2 sources distinctes ont confirmé ce mouvement. » Liste avec :
   - `medias24.com` favicon Globe + titre + meta mono `medias24.com · 04 mai 2026 · 08:30` + CraapScoreBadge `8.4/10` size sm + ExternalLink.
   - `leconomiste.com` même format.
5. **Détail CRAAP — Médias24** (H3) : table 5 lignes
   - Currency `9/10` ████████░░ teal
   - Relevance `9/10` ████████░░ teal
   - Authority `8/10` ███████░░░ teal
   - Accuracy `8/10` ███████░░░ teal
   - Purpose `8/10` ███████░░░ teal
   - Total `42/50 → 8.4/10` en gras

Karim scrolle dans le drawer. La table CRAAP est exactement ce qui le rassure sur la rigueur méthodologique du système.

> _« Là je vois bien que ce n'est pas un LLM qui invente. La grille CRAAP est appliquée par dimension, sources réelles. »_

Il ferme le drawer en cliquant sur le backdrop. URL retombe à `/dashboard`. Drawer slide-out 280ms.

**Critères d'acceptation testables** :

- [ ] Click card → URL ajoute `?mvt=ID` → drawer slide-in 280ms cubic-bezier
- [ ] ESC ou click backdrop ou click X → drawer slide-out + URL retire `?mvt`
- [ ] Drawer 540px largeur, full-height, scroll interne si contenu long
- [ ] Table CRAAP avec barres de progression colorées (color-coded selon le score)
- [ ] Boutons d'action du drawer = même server actions que les actions de la card

---

### US-D07 — Détail CRAAP par dimension (M244 chap 3)

**En tant que** utilisateur technique / jury académique
**Je veux** voir le détail CRAAP par dimension
**Afin de** valider la rigueur méthodologique

**Scénario** :

Karim — comme un jury M244 le ferait — vérifie que le système ne se contente pas d'un score CRAAP global, mais l'**applique par dimension**. La table dans le drawer prouve que :

- Currency = fraicheur de la source (10/10 si <24h)
- Relevance = pertinence sur le sujet
- Authority = crédibilité de l'éditeur (medias24 = 8/10, blog medium = 4/10)
- Accuracy = recoupement
- Purpose = absence de biais commercial

Le total `42/50 → 8.4/10` montre qu'il s'agit d'une moyenne arithmétique simple (pas pondérée). Le système est **transparent**.

**Critères d'acceptation testables** :

- [ ] Table 5 lignes + 1 ligne total
- [ ] Chaque ligne : nom dimension + barre proportionnelle + score `N/10` mono
- [ ] Couleur de la barre conforme au score (teal ≥ 8, vert 6-8, safran 4-6, rouge < 4)
- [ ] Total visible : `XX/50 → Y.Z/10`

---

### US-D08 — Page concurrent + SWOT

**En tant que** stratège
**Je veux** accéder à la fiche complète d'un concurrent
**Afin de** voir sa SWOT et son historique 90 jours

**Scénario** :

Karim ferme le drawer. Il clique sur la **CompetitorBadge `Inwi`** dans la card. Navigation vers `/competitors/inwi-id`.

La page affiche :

1. **Breadcrumb** : « Concurrents / Inwi »
2. **Header riche** :
   - Avatar carré 96×96 « I » teal
   - Nom H1 « Inwi » + URL mono `https://www.inwi.ma`
   - Meta row : `Building2 Secteur : Télécommunications` · `MapPin Casablanca, Maroc` · `Users Taille : 1000–5000` · `CalendarDays Fondé en 2010`
   - Axes badges row : STRATÉGIE · TECH · DIGITAL · RH (les axes où Inwi a généré des mouvements ces 30 derniers jours)
   - Actions à droite : `Exporter en PDF` (primary), `Modifier` (secondary), `Retirer` (ghost danger)
3. **Tabs** : SWOT (actif) · Timeline 90j · Mouvements (badge 14) · Sources
4. **SwotGrid 2×2** :
   - Strengths — teal, ShieldCheck — `INTERNE / POSITIF` — 3 bullets (PDM 38% ANRT, 5G déployée 12 villes, partenariat Orange Business)
   - Weaknesses — safran, AlertTriangle — `INTERNE / NÉGATIF` — 3 bullets (image consumer en érosion, dépendance backbone, stack legacy SI billing)
   - Opportunities — vert, TrendingUp — `EXTERNE / POSITIF` — 3 bullets (vague open banking BAM Q3 2026, B2B IoT industriel +24%, baisse tarifaire ANRT)
   - Threats — rouge, Flame — `EXTERNE / NÉGATIF` — 3 bullets (4ème opérateur sous 18 mois, pression réglementaire roaming, acquisitions Roland Berger)
5. **Footer SWOT** : « Dernière mise à jour : 04 mai 2026 · Cycle #42 » + « Voir l'historique SWOT »

Karim lit les 4 quadrants en 90 secondes. Il sauvegarde mentalement deux items : (1) Inwi a un trou côté image consumer <25 ans (faiblesse exploitable s'il voulait vendre du B2C — non, il fait du B2B), (2) Inwi sera challenged par un 4ème opérateur sous 18 mois (menace).

> _« La SWOT est plus pertinente que ce que j'aurais écrit en 1h sur Notion. Et elle se met à jour toute seule chaque jour. »_

**Critères d'acceptation testables** :

- [ ] Page `/competitors/[id]` charge en moins de 500ms (Server Component)
- [ ] Header riche conforme : avatar 96×96, nom 32px, 4 meta items, axes row, 3 actions à droite
- [ ] Tabs : SWOT actif par défaut, autres tabs en stub « Bientôt disponible »
- [ ] SwotGrid 2×2 grid-cols-2 sur desktop, grid-cols-1 sur mobile
- [ ] Couleurs des 4 cells : Strengths teal, Weaknesses safran, Opportunities vert, Threats rouge — border-top 3px coloré
- [ ] Bullets avec puce ronde de la couleur du quadrant

---

## EPIC 5 — Signaux faibles (M244 chap 1)

### US-D09 — Vue groupée par intensité

**En tant que** stratège
**Je veux** consulter les signaux faibles groupés par intensité
**Afin de** détecter les tendances émergentes

**Scénario** :

Karim clique sur le tab `Signaux faibles` (badge 5 safran). Navigation vers `/dashboard?tab=weak-signals`. La page affiche :

1. **Page header** : icône Radar 24px safran + H2 « Signaux faibles » + sub explicatif (« Tendances émergentes détectées par croisement de sources mineures sur les 30 derniers jours. Cliquez sur un signal pour voir les sources qui le valident. »)
2. **FilterBar réduite** : Intensité · Concurrent · Période 30j
3. **3 sections par intensité** :
   - **Signaux forts** (rouge `#EF4444`, badge count 2) — 2 cards :
     - « Migration vers TypeScript détectée chez 3 concurrents en 2 semaines » — Wafa Salaf, Inwi, CIH Bank ont tous publié sur leurs blogs tech ou GitHub. Detecté il y a 12j · 7 sources · 3 axes.
     - « Recrutements simultanés de Chief Data Officers (4 postes en 30j) » — Maroc Telecom, BMCE BOA, Attijariwafa, CIH Bank. Indice fort d'une vague structurelle.
   - **Signaux moyens** (safran, badge 2) — 2 cards :
     - « Apparition récurrente du terme 'open banking' dans les pitchs investisseurs »
     - « Augmentation discrète des dépenses publicitaires LinkedIn (+85% trimestre) »
   - **Signaux faibles à surveiller** (gris, badge 1) — 1 card.

Chaque WeakSignalCard a :

- `border-top: 3px solid` couleur intensité
- Header : nom concurrent (« 3 concurrents ») + « Détecté il y a Xj » mono à droite
- H3 titre
- Description ~3 lignes
- Footer 3 meta : Flame + intensité label, Link + N sources, Network + N axes impliqués

> _« Le signal "Migration TypeScript chez 3 concurrents" — celui-là, je n'aurais jamais pu le détecter en lisant les blogs un par un. C'est exactement ce que le PRD promettait. »_

**Critères d'acceptation testables** :

- [ ] 3 sections distinctes avec titre coloré + count badge
- [ ] Chaque section affiche les WeakSignalCard correspondantes en grid 2 colonnes
- [ ] Border-top de la card = couleur de l'intensité
- [ ] FilterBar réduite à 3 dropdowns (Intensité / Concurrent / Période)

---

## EPIC 6 — Configuration jour 0

### US-D10 — Empty state J0 poétique

**En tant que** utilisateur jour 0 (vient de finir l'onboarding)
**Je veux** voir un empty state élégant avec countdown
**Afin de** savoir que je n'ai rien raté, juste à attendre

**Scénario** :

Karim — cas alternatif — vient de finir l'onboarding 22h32. Il atterrit sur `/dashboard`. Aucun cycle terminé existe.

Il voit :

1. **Sidebar** : cycle card état `idle` « **Prochain cycle · Demain à 06:00** · 6h 12min » mono
2. **Tabs** : Feed (0) · Signaux faibles (0) · Cycles
3. **Banner J0** sticky en haut : icône horloge 24px teal + 2 lignes (« Premier cycle de veille demain à 06:00 » / « Vous recevrez le digest avec les premiers mouvements détectés à 07:00 par email. ») + countdown mono à droite « 6h 12min · avant le démarrage » (qui décrémente chaque seconde côté client)
4. **Stats row** variante J0 : valeurs à 0, sublabels « Premier cycle demain » / « Pas encore de données »
5. **Empty state central** :
   - SVG radar 96×96 : 4 cercles concentriques teal pulsant en cascade (rayons 14/28/42 + dot 3px center) + dot safran à 78,32 qui clignote
   - H2 « Le radar tourne en sourdine. »
   - Sub : « Notre agent IA prépare votre premier rapport pour demain matin. Pendant ce temps, vous pouvez ajuster vos concurrents ou vos axes de surveillance. »
   - 2 boutons secondaires : « Ajouter des concurrents » + « Modifier mes axes »

> _« C'est beau. Le radar qui tourne en sourdine, ça pose le ton : l'IA travaille pour moi pendant que je dors. »_

**Critères d'acceptation testables** :

- [ ] Banner J0 sticky en haut du contenu, countdown live (`useEffect` + `setInterval(1000)`)
- [ ] SVG empty state avec 4 cercles + dot, animations CSS infinite
- [ ] Texte H2 + sub + 2 boutons secondaires CTA
- [ ] Cycle card sidebar en état idle avec « Demain à 06:00 »

---

### US-D11 — Modal config notifications J0

**En tant que** utilisateur jour 0
**Je veux** configurer mes notifications dans une modale guidée
**Afin de** régler le digest avant le 1er rapport

**Scénario** :

3 secondes après l'arrivée sur `/dashboard` J0, **une modale s'ouvre** au-dessus du contenu (backdrop noir 70%). Elle a :

- Icône Bell 28px teal en haut
- H2 « Comment voulez-vous recevoir vos rapports ? »
- Sub « Réglez vos préférences. Vous pourrez les ajuster à tout moment dans Paramètres. »
- **Section 1 — Fréquence du digest** : 3 radio cards horizontales :
  - `Sun (teal-400)` Quotidien · ★ Recommandé (sélectionné par défaut, fond teal/10)
  - `CalendarDays (gris)` Hebdomadaire
  - `BellOff (gris)` Jamais
- **Section 2 — Email destinataire** : input pré-rempli avec `karim@markalogistics.ma` (récupéré de Better Auth) + helper « Vous pouvez utiliser une autre adresse pour les digests. »
- **Section 3 — Toggle « Alertes critiques uniquement »** : titre + description « Email instantané si un mouvement urgent est détecté (axes Stratégie ou Réglementation) » + toggle ON par défaut
- Footer : `Plus tard` (ghost) + `Enregistrer` (primary)

Karim laisse les défauts (Quotidien, son email, alertes critiques ON) et clique Enregistrer. La modale se ferme avec un fade-out 200ms. Server Action `saveNotificationPreference` persiste l'objet.

**Critères d'acceptation testables** :

- [ ] Modale s'ouvre automatiquement à la 1ʳᵉ visite J0 (si `NotificationPreference.configuredAt` est null)
- [ ] 3 radio cards exclusives, état actif teal + check coin haut-droit
- [ ] Email input pré-rempli, validable
- [ ] Toggle natif ON/OFF
- [ ] Bouton Plus tard ferme la modale sans persister
- [ ] Bouton Enregistrer persiste + ferme + toast confirmation

---

## EPIC 7 — Cycle en cours (J+2 avant 7h)

### US-D12 — Banner cycle running

**En tant que** utilisateur jour 2 (revient avant 7h, le cycle tourne)
**Je veux** voir un banner « Cycle en cours · étape 3/5 »
**Afin de** comprendre que le rapport arrive

**Scénario** :

Karim ouvre RADAR le mercredi à 6h27 (avant 7h). Le cycle quotidien a démarré à 6h00 et est en cours d'exécution.

Il voit (différences vs nominal) :

- **Sidebar** : cycle card état `running` (animation refresh 360° infinite teal + label « Cycle en cours » teal + barre de progression teal 62% + step text « Étape 3/5 : Analyse SWOT »)
- **Header** : bouton « Lancer un cycle » désactivé `is-disabled` avec libellé alternatif « Disponible dans 2h »
- **Banner sticky** sous le header : icône RefreshCw qui tourne + titre « Cycle en cours » + meta « Étape 3/5 : Analyse SWOT » + barre de progression au centre `62%` + texte right « Le feed se rafraîchira automatiquement à 7h »
- **Feed** : affiche les mouvements du cycle de la veille (J+1) en attendant, polling 60s pour rafraîchir.

À 7h précises, le feed se rafraîchit automatiquement, le banner disparaît avec un fade-out, et un toast apparaît « Nouveau cycle terminé · 8 mouvements détectés ».

**Critères d'acceptation testables** :

- [ ] Sidebar cycle card 3 états : `idle` (countdown), `running` (spin + progress + step), `completed` (count + il y a Xh)
- [ ] CycleProgressBanner s'affiche quand `cycleState === 'running'`, avec progression % et step name
- [ ] Bouton « Lancer un cycle » du header désactivé pendant un cycle en cours
- [ ] Polling 60s du feed quand cycle en `running` (sprint 3.B uniquement)
- [ ] Animation rd-spin 1.5s linear infinite sur les RefreshCw

---

### US-D13 — Bannière email non vérifié

**En tant que** utilisateur revenu (dont l'email n'est pas encore vérifié)
**Je veux** un rappel discret pour vérifier mon email
**Afin de** sécuriser mon compte sans friction

**Scénario** :

Karim a laissé tomber la vérif email lors de l'inscription (cf sprint 01 : non-bloquant). 2 jours plus tard, il revient sur le dashboard.

En haut du contenu (sous le header), un **banner discret** apparaît :

- Fond `bg-bg-elevated` border-left 3px safran
- Icône AlertTriangle 16px safran
- Texte « Vérifiez votre adresse email pour sécuriser votre compte. »
- Bouton lien teal « Renvoyer le lien »
- Bouton X close à droite (close = dismiss session-level, réapparaît à la prochaine visite si toujours non vérifié)

Karim clique « Renvoyer le lien ». Toast : « Email envoyé à karim@markalogistics.ma ». Le banner reste affiché.

**Critères d'acceptation testables** :

- [ ] Banner s'affiche uniquement si `session.user.emailVerified === false`
- [ ] Click X dismiss le banner pour la session courante (sessionStorage)
- [ ] Click « Renvoyer le lien » → server action `resendVerificationAction` (existe déjà sprint 01)
- [ ] Toast confirmation après l'envoi

---

## Critères de validation globaux du sprint

### Sprint 3.A (UI + mocks — livrable jury)

- [ ] Karim peut naviguer **les 5 écrans** en moins de 5 minutes pendant la soutenance
- [ ] Les **données mock Maroc/Maghreb B2B** sont crédibles (Inwi, Roland Berger, Wafa Salaf, BMCE BOA, Bank Al-Maghrib, Maroc Telecom, CIH Bank, Attijariwafa)
- [ ] **22 composants** réutilisables livrés et propres
- [ ] **6 tables Prisma** créées et migrées sur Neon (vides en sprint 3.A)
- [ ] **Filtres URL** fonctionnels (copier-coller restaure l'état)
- [ ] **Drawer mouvement** s'ouvre via `?mvt=ID`, slide-in 280ms cubic-bezier
- [ ] **Modal config** s'affiche en J0, persistance via server action
- [ ] **Animations** : spin cycle, pulse 4 cercles J0, dot safran J0, slide-in drawer, hover translateY cards
- [ ] **Type-check, lint, build** propres
- [ ] Aucune régression sur les sprints 01-02 (auth + onboarding fonctionnent toujours)

### Sprint 3.B (différé)

- [ ] Lecture Prisma au lieu des mocks
- [ ] Server Actions persistent les actions user (savedAt, viewedAt, ignoredAt)
- [ ] Polling 60s rafraîchit le feed pendant un cycle en cours
- [ ] `launchCycle()` POST réel vers OpenClaw

---

## Hors scope (rappel SPEC § 15)

- Cycle réel OpenClaw (sprint 04)
- Digest emails Resend (sprint 04)
- Export PDF (sprint 05)
- Pages Settings CRUD (sprint 09)
- Tabs Timeline / Mouvements / Sources de la page concurrent (sprint 04)
- Recherche full-text + panel notifications in-app (sprint 04+)
- Tests Playwright (sprint 10 ou continu)
- Responsive mobile/tablette < 1024px (nice-to-have sprint 03, finalisé sprint 04)
