# Prompt à soumettre à Claude pour générer la présentation RADAR

> Copier-coller intégralement le bloc ci-dessous dans Claude (mode Artifact recommandé).
> Le fichier de contenu `M244-PRESENTATION-CONTRAT.md` doit être joint au message comme pièce jointe ou collé en annexe du prompt.

---

## ============== DÉBUT DU PROMPT À COPIER ==============

# Rôle

Tu es un **directeur artistique senior** spécialisé dans les présentations de conférence type Apple Keynote, Stripe Sessions, Linear product launches et keynotes McKinsey. Tu as 15 ans d'expérience à transformer du contenu dense en expériences visuelles cinématographiques où chaque slide raconte une histoire à plusieurs étapes, où la caméra zoome, dézoome, met en lumière, et où les éléments graphiques s'éveillent dans un ordre maîtrisé.

# Mission

Génère une **présentation web interactive de niveau keynote** pour le projet RADAR (veille concurrentielle automatisée par agent IA), à partir du contrat de slides fourni en annexe. Le résultat doit être un **artifact HTML autonome unique** (un seul fichier `.html` qui contient tout : CSS, JS, polices, sans dépendance externe à fetcher au runtime sauf CDN explicitement autorisés), navigable au clavier et projetable plein écran le jour de la soutenance.

Le contenu, la structure des 20 slides, la répartition de la parole et les notes orateur sont **non négociables** : ils sont définis dans le fichier `M244-PRESENTATION-CONTRAT.md` joint à ce message. Tu ne réinterprètes pas le contenu, tu le mets en scène.

Ton job exclusif : le **design**, les **animations** et la **mise en scène cinématographique**.

# Stack technique imposée

- **Format de livraison** : un seul fichier `index.html` autonome, prêt à ouvrir dans Chrome / Edge / Firefox plein écran (touche F11).
- **Framework d'animation** : **GSAP 3** (CDN officiel `https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js`) + **GSAP ScrollTrigger** et **GSAP Flip** pour les morphs d'éléments.
- **Rendu** : HTML / CSS3 pur, pas de React, pas de bundler. Le fichier doit tourner offline une fois ouvert (les CDN sont chargés au premier accès, ensuite cachés).
- **Polices** : Google Fonts (Fraunces, Inter, JetBrains Mono) chargées via `<link>` dans le `<head>`, avec fallback système.
- **Compatibilité** : Chromium 120+, Firefox 120+. Aucun shim, aucun polyfill IE.
- **Performance cible** : 60 fps garanti sur les animations, utilisation exclusive de `transform` et `opacity` (GPU-accelerated), aucun reflow sur les builds.

# Style d'animation attendu (le cœur de la demande)

La présentation doit ressembler à un **keynote Apple** ou à une **page produit Stripe** : chaque slide est une scène avec plusieurs étapes successives (`steps`), et la navigation au clavier déclenche l'étape suivante AVANT de passer à la slide suivante.

## Techniques d'animation obligatoires

1. **Build-step reveal** : chaque slide a 2 à 5 étapes internes. La touche `flèche droite` ou `barre espace` joue l'étape suivante. Quand toutes les étapes sont jouées, la pression suivante passe à la slide suivante. La touche `flèche gauche` rejoue l'étape précédente.

2. **Focus and zoom (caméra cinématographique)** : à certaines étapes d'une slide, la caméra zoome sur une zone précise (par exemple une cellule de tableau, un nœud d'architecture, un chiffre clé). Le reste de la slide est désaturé ou flouté en arrière-plan. À l'étape suivante, la caméra dézoome et re-zoome sur une autre zone, fluide, jamais brutal. Implémentation : `transform: scale()` et `transform-origin` animés par GSAP.

3. **Connected nodes animation** : sur la slide architecture (Slide 8) et sur tout schéma type organigramme, les **nœuds apparaissent un par un**, et les **lignes qui les connectent se tracent progressivement** (animation de `stroke-dashoffset` sur SVG). Quand un nœud est mis en avant à l'oral, ses connexions s'illuminent en royal blue, les autres s'éteignent en navy-700.

4. **Magic morph entre slides** : pour les éléments qui réapparaissent d'une slide à l'autre (exemple : le logo Radar, le slogan, les numéros de cycle), utiliser **GSAP Flip** pour transformer leur position et leur taille en transition. Aucune coupure brutale entre slides : tout transitionne en 600 à 800 ms ease-in-out.

5. **Number counters** : tous les chiffres clés (4 EUR/mois, 25 minutes, 100 USD, 6 à 30 minutes, 200K tokens, score CRAAP > 6/10) s'animent au compteur quand ils entrent dans le viewport. Police JetBrains Mono, tabular figures activées.

6. **Spotlight on data** : dans les tableaux comparatifs (Slide 7 positionnement, Slide 10 stack), les lignes apparaissent une par une de haut en bas. La ligne « Radar » s'illumine en royal-soft à la fin, avec un léger glow.

7. **Cinematic slide transitions** : entre deux slides, transition de 700 ms qui combine un fade-out de la slide sortante + un slide-in de la slide entrante + un déplacement de caméra (parallax léger sur le fond navy). Aucune transition « slide droite gauche » basique. Pas de transition 3D type cube.

8. **Parallax depth on hero text** : les titres Fraunces hero (slides 1, 2, 18, 19) ont une profondeur visuelle : le titre est en premier plan (translateZ avancé), le slogan en plan intermédiaire, le fond en arrière-plan. Sur déplacement de souris très subtil ou au scroll de présentation, parallax de 8 à 12px max.

9. **Timeline reveal** : sur la slide 14 (Planification et équipe) et la slide 17 (Roadmap), la timeline se dessine de gauche à droite (ou de haut en bas) en 1.5 seconde, avec les jalons qui pulse en arrivant.

10. **Progressive table fill** : tous les tableaux comparatifs ne sont JAMAIS affichés d'un bloc. Ils se remplissent ligne par ligne avec un délai de 120 ms entre chaque ligne.

## Techniques d'animation interdites

- Pas de rotation 3D type carrousel.
- Pas d'effet « flip de carte ».
- Pas de transition fade-to-black entre slides (trop brutal).
- Pas de gradients animés sur les fonds.
- Pas d'animation de couleur d'arrière-plan global.
- Pas de bruit/grain animé.
- Pas d'emojis ni d'illustrations génériques.

# Charte visuelle non négociable

- **Fond dominant** : navy `#051C2C`.
- **Surfaces élevées** : `#0A2540` pour les panels, `#133553` pour les cards, `#1F4868` pour les bordures sur fond dark.
- **Accent signature** : royal blue `#2251FF`, réservé aux CTA, KPI hero, focus, états validés. Plafonné à 10 % de la surface de chaque slide.
- **Hover royal blue** : `#4F73FF`. **Pressed** : `#1A3FCC`. **Background soft callout** : `#E5EBFF`.
- **Texte principal sur navy** : bone `#F5F1EB`.
- **Sous-titres et métadonnées** : muted `#8FA3B8`.
- **Captions et timestamps** : muted-soft `#6B7280`.
- **Sémantiques** : success `#0F8F65`, warning `#C77700`, error `#B42318`, info `#2251FF`.
- **PESTEL** : Politique `#B42318`, Économique `#C77700`, Social `#4A1D6E`, Technologique `#2251FF`, Environnemental `#0F8F65`, Légal `#1A3FCC`.
- **SWOT** : Strengths `#2251FF`, Weaknesses `#C77700`, Opportunities `#0F8F65`, Threats `#B42318`.

## Typographie

- **Display et titres hero** : Fraunces (Google Fonts), variable, light 300 sur les chiffres hero, regular 400 sur H1.
- **Corps et UI** : Inter (Google Fonts), variable, 400 sur le body, 600 sur H3 et eyebrow Bold.
- **Mono** : JetBrains Mono (Google Fonts), 400, **tabular figures activées** (`font-feature-settings: "tnum"`).
- **Hiérarchie** : Display 64pt / H1 40pt / H2 28pt / H3 Semibold 20pt / Body 16-18pt / Caption 12pt / Eyebrow Bold uppercase 11pt tracking +0.04em.

## Règles iconographie

- Si tu utilises des icônes, **Lucide outline 1.5px exclusivement**, en SVG inline, jamais filled, jamais duotone, jamais coloré sauf royal blue ou bone.
- Aucune illustration générique, aucune photo stock, aucune image générée par IA.

## Règles typographiques fines

- **Aucun tiret cadratin** dans le rendu final. Si le contrat de slides contient un tiret cadratin par erreur, le remplacer par deux-points, virgule ou parenthèses.
- Tabular figures activées partout où il y a des chiffres en colonne.
- Veuves et orphelines évitées : ne jamais laisser une ligne d'une phrase seule en bas de slide.
- Justification à gauche sur le corps de texte, jamais full-justified.

# Navigation et interactions

- **Flèche droite / Barre espace** : étape suivante (ou slide suivante si toutes les étapes sont jouées).
- **Flèche gauche** : étape précédente (ou slide précédente si on est à l'étape 1).
- **Flèche haut / Flèche bas** : passe à la slide précédente / suivante en ignorant les étapes.
- **Touche `Home`** : retour à la slide 1.
- **Touche `End`** : aller à la slide 20.
- **Touche `f` ou `F11`** : plein écran.
- **Touche `g`** : grille de toutes les slides (overview, façon Reveal.js).
- **Touche `s`** : mode notes orateur (deuxième fenêtre ou panel inférieur).
- **Touche `Escape`** : sortir du plein écran et fermer la grille.
- **Indicateur de progression** : barre fine royal blue en pied de slide, 2px de haut, qui se remplit selon l'index courant. Discret, jamais distrayant.
- **Numéro de slide** : en haut à droite, JetBrains Mono 11pt muted, format `09 / 20`.
- **Chronomètre optionnel** : touche `t` pour afficher un compteur, en haut à gauche, JetBrains Mono. Démarrage / pause / reset.

# Structure attendue du fichier `index.html`

```
index.html
├── <head>
│   ├── Meta utf-8, viewport
│   ├── Title : « RADAR · Soutenance M244 · ENSA Tétouan »
│   ├── Lien Google Fonts (Fraunces, Inter, JetBrains Mono)
│   ├── Lien GSAP + ScrollTrigger + Flip
│   └── <style> : tous les styles inline (tokens, layout, animations)
├── <body>
│   ├── <main id="deck">
│   │   ├── <section class="slide" data-slide="01" data-steps="N">…</section>
│   │   ├── ... 20 sections au total
│   ├── <nav> Indicateur de progression + numéro
│   ├── <aside> Panel notes orateur (caché par défaut, toggle 's')
│   └── <script> Logique de navigation, séquencement des steps, GSAP timelines
```

# Critères d'acceptation

- [ ] 20 slides au total, ordre et contenu strictement conformes à `M244-PRESENTATION-CONTRAT.md`.
- [ ] Chaque slide qui le justifie a au minimum 2 étapes internes (build steps) jouées au clavier.
- [ ] La slide 8 (Architecture) anime les 3 services et les 8 agents en cascade, avec lignes qui se tracent.
- [ ] La slide 9 (Démonstration) sert de bookend visuel : titre Fraunces géant, scénario démo en table progressive, transitions fluides vers / depuis cette slide.
- [ ] Les tableaux comparatifs (slides 3, 7, 10, 13, 15, 16, 17) se remplissent ligne par ligne.
- [ ] Les chiffres clés (4 EUR/mois, 25 min, 100 USD, 200K tokens, score CRAAP, 1 à 2h/jour économisées) sont animés au compteur.
- [ ] Les slides hero (1, 2, 18, 19) ont parallax léger et entrée cinématographique du titre Fraunces.
- [ ] La navigation clavier complète fonctionne (toutes les touches listées plus haut).
- [ ] Le mode overview (touche `g`) affiche les 20 slides en miniatures, cliquables.
- [ ] Le mode notes orateur (touche `s`) affiche les notes pour la slide courante.
- [ ] Aucun emoji, aucun gradient, aucun tiret cadratin, aucune photo stock, aucune illustration générique.
- [ ] Le fichier `index.html` ouvre sans erreur console, tourne à 60 fps sur un MacBook Air 2020 ou équivalent.
- [ ] Le rendu plein écran (F11) est cinématographique, type keynote, non bureautique.

# Pour bien commencer

1. **Lis intégralement le fichier `M244-PRESENTATION-CONTRAT.md` joint à ce message.**
2. Identifie pour chaque slide les **étapes internes** logiques (par exemple, sur la slide 7 Positionnement : étape 1 affiche les outils existants, étape 2 affiche la ligne Radar surlignée, étape 3 zoome sur la ligne tarif).
3. Construis un **plan de scène par slide** avant de coder : combien d'étapes, quelles animations, quelles zones de focus.
4. Code le fichier `index.html` complet en une seule passe, sans omettre les 20 slides.
5. Teste mentalement le déroulé : durée totale animations + lecture humaine cohérente avec les 25 minutes annoncées.

Ton livrable est un seul artifact HTML autonome. Ne demande pas de confirmation, ne demande pas si tu dois commencer : commence directement par poser le plan de scène par slide (en commentaire en tête de fichier), puis livre le HTML complet.

## ============== FIN DU PROMPT À COPIER ==============

---

## Comment l'utiliser

1. Ouvrir Claude.ai en mode chat.
2. **Joindre le fichier** `docs/M244-PRESENTATION-CONTRAT.md` au message (drag-and-drop dans le champ de saisie).
3. **Coller le bloc entre les délimiteurs `============== DÉBUT ==============` et `============== FIN ==============`** dans le même message.
4. Envoyer.
5. Claude produira un artifact HTML unique. Le télécharger, double-cliquer pour ouvrir dans le navigateur, presser F11 pour le mode plein écran.

## Si Claude refuse la longueur

Si Claude indique que la sortie est trop longue pour un seul artifact :

1. Demander dans un message de suivi : « Continue le fichier `index.html` à partir de la slide 11 jusqu'à la slide 20, sans répéter la partie déjà produite. »
2. Demander ensuite : « Donne-moi le HTML concaténé complet en un seul bloc copiable. »

## Si le rendu n'est pas assez cinématique

Itérer avec ce prompt de suivi :

> Le rendu manque de souffle cinématographique. Sur la slide [N], ajoute une étape de zoom-and-focus sur [élément précis], puis dézoome vers [autre élément]. Augmente la durée des transitions de 700 ms à 1100 ms. Ajoute un parallax plus prononcé sur le titre hero. Conserve tout le reste à l'identique.
