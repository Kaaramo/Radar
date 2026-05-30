# Branding RADAR

Tous les assets de marque, design tokens et configurations frontend du projet RADAR.

> Direction artistique : **Radar Editorial** (McKinsey-fit)
> Navy `#051C2C` · Royal Blue `#2251FF` · Bone `#F5F1EB`
> Polices : Fraunces (display) + Inter (body) + JetBrains Mono (data)

---

## Index

```
Branding/
├── CHARTE_GRAPHIQUE_RADAR.md         Charte graphique complète (markdown — source de vérité)
├── CHARTE_GRAPHIQUE_RADAR.pdf        Version éditoriale PDF (régénérée depuis le .md)
├── _generate-charte-pdf.js           Pipeline marked → Chrome headless → PDF
│
├── logo/                             Logo RADAR — SVG vectoriels (royal blue sur navy)
│   ├── mark.svg                       Mark (icône) — royal blue
│   ├── mark-mono.svg                  Mark — currentColor (CSS-driven)
│   ├── wordmark.svg                   "RADAR" en Inter Bold — navy
│   ├── wordmark-light.svg             "RADAR" — bone pour fond navy
│   ├── wordmark-mono.svg              "RADAR" — currentColor
│   ├── lockup.svg                     Mark + wordmark — navy
│   ├── lockup-light.svg               Mark + wordmark — bone pour fond navy
│   └── lockup-mono.svg                Mark + wordmark — currentColor
│
├── favicons/                         Favicons multi-formats (royal blue)
│   ├── favicon.svg                    Vectoriel (modern browsers)
│   ├── favicon.ico                    Multi-tailles 16/32/48 (legacy)
│   ├── favicon-{16,32,48,64,96,180,192,512}.png
│   ├── apple-touch-icon.png           180×180 (iOS)
│   ├── manifest.json                  PWA manifest (theme_color, icons)
│   └── _generate-favicons.py          Script PIL régénérable
│
├── assets/fonts/                     Polices auto-hébergées
│   ├── JetBrainsMono/                 TTF Regular + Medium (mono, données)
│   ├── fonts.css                      @font-face hors-Next (Word, Figma, claude.ai)
│   └── README.md                      Doc fonts (Fraunces+Inter via next/font, Mono local)
│
├── tokens/
│   └── radar-tokens.json             Design Tokens W3C — interopérable
│                                      Style Dictionary, Tokens Studio Figma
│
└── tailwind/                         Config frontend prête à brancher
    ├── globals.css                    Tailwind v4 — @theme + reset RADAR
    └── tailwind.config.ts             Compat v3 (Storybook, plugins)
```

---

## Comment utiliser ces assets

### 1. Branding visuel (logo, favicons)

Les favicons sont déjà copiés dans `apps/web/public/` (lors de la régénération) :

```powershell
Copy-Item -Path 'Branding/favicons/*.png','Branding/favicons/*.ico' -Destination 'apps/web/public/' -Force
Copy-Item -Path 'Branding/logo/*.svg' -Destination 'apps/web/public/logos/' -Force
```

Dans `apps/web/src/app/layout.tsx` :

```tsx
export const metadata = {
  title: "RADAR — Veille concurrentielle",
  description:
    "Vos concurrents bougent. Radar vous le dit avant tout le monde.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#051C2C",
  colorScheme: "dark",
};
```

### 2. Tailwind v4 globals.css

`apps/web/src/app/globals.css` consomme déjà les tokens via le bloc `@theme`. La référence canonique est `Branding/tailwind/globals.css`.

```tsx
<button className="bg-royal hover:bg-royal-light text-bone rounded-md h-10 px-4">
  Voir le détail
</button>

<div className="bg-navy-900 border border-navy-700 rounded-md p-6">
  Card RADAR
</div>

<span className="font-display text-h2 text-bone">Titre éditorial</span>
<p className="font-sans text-body text-muted">Paragraphe de body</p>
<code className="font-mono text-mono">CRAAP 8.2/10</code>
```

### 3. Design tokens

`tokens/radar-tokens.json` est la source de vérité au format W3C. Utilisable avec :

- **Style Dictionary** (génération de variables CSS / iOS / Android multi-cibles)
- **Tokens Studio for Figma** (import direct)
- **Cobalt UI** (transformations TypeScript / Swift / Kotlin)

### 4. Logo dans le code

**Mark seul (icône, navigation) :**

```tsx
<img src="/logos/mark.svg" alt="RADAR" className="w-8 h-8" />
```

**Lockup (header, page de connexion) :**

```tsx
<img src="/logos/lockup-light.svg" alt="RADAR" className="h-8" />
```

**Version monochrome (currentColor) :**

```tsx
import { RadarLockupLight } from "@/components/brand/logo";
<RadarLockupLight height={36} className="text-bone" />;
```

---

## Régénérer les assets

### Charte (PDF)

```powershell
node Branding/_generate-charte-pdf.js
```

Pipeline : `marked` (md→HTML avec CSS éditoriale embarquée) + Chrome headless (HTML→PDF). Aucune dépendance lourde, aucun téléchargement Chromium.

> Pré-requis : Chrome **ou** Edge installé (les deux paths Windows standards sont auto-détectés). Le script installe `marked` localement à la première exécution.

### Favicons (PNG + .ico)

```powershell
$env:PYTHONIOENCODING='utf-8'; python Branding/favicons/_generate-favicons.py
```

Régénère toutes les tailles depuis les coordonnées du mark RADAR.

> Pour modifier le mark, éditer **à la fois** `Branding/logo/mark.svg` et le bloc de constantes en haut de `_generate-favicons.py` pour que SVG et PNG restent identiques.

---

## Conventions

- **Aucun PNG du logo** : seulement des SVG (vectoriel = scalable). Les seuls PNG sont les favicons (contrainte technique navigateur).
- **Logo monochrome via `currentColor`** : permet à n'importe quel composant de choisir la couleur via CSS, sans dupliquer 5 versions.
- **Tailwind v4 CSS-first** : `globals.css` (avec `@theme`) est la source. `tailwind.config.ts` est uniquement un fallback pour les outils tiers qui ne lisent pas encore la config CSS.
- **Couleurs métier groupées par usage** : `pestel.*`, `swot.*`, `category.*` séparés des sémantiques générales pour éviter les collisions.
- **Règle 60/30/10** : navy 60%, neutres 30%, royal blue 10% max. Le royal blue n'apparaît que sur les CTA, focus, KPI hero, signaux validés.

---

## Roadmap branding (pas encore implémenté)

| Item                                            | Priorité | Effort |
| ----------------------------------------------- | -------- | ------ |
| `voice-and-tone.md` (guidelines éditoriales FR) | Haute    | 1h     |
| `og-image.png` (1200×630 partage social)        | Haute    | 30 min |
| `accessibility-audit.md` (ratios WCAG calculés) | Haute    | 1h     |
| Mockups écrans clés (Excalidraw ou code)        | Moyenne  | 2-3h   |
| Pitch deck soutenance M244 (MARP markdown)      | Moyenne  | 3h     |
| Email templates React Email skeleton            | Basse    | 2h     |

---

**Maintenu par** : Karamo Sylla (`apps/web`, `packages/database`, branding)
**Cadre académique** : Module M244 · ENSA Tétouan · Cycle Ingénieur BDIA · Mai 2026
