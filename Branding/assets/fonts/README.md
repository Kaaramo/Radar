# Polices RADAR

Charte **Radar Editorial** (McKinsey-fit) — trois polices, trois rôles distincts.

| Rôle                                             | Police                       | Source                                                            |
| ------------------------------------------------ | ---------------------------- | ----------------------------------------------------------------- |
| **Display** (titres, KPI hero, citations)        | **Fraunces** (Variable, OFL) | Chargée via `next/font/google` dans `apps/web/src/app/layout.tsx` |
| **Body / UI** (paragraphes, formulaires, tables) | **Inter** (Variable, OFL)    | Chargée via `next/font/google` dans `apps/web/src/app/layout.tsx` |
| **Mono** (chiffres tabular, hex, scores, codes)  | **JetBrains Mono** (OFL)     | TTF auto-hébergées ici                                            |

Seule **JetBrains Mono** est physiquement présente dans ce dossier. Fraunces et Inter sont gérées par Next.js (téléchargées et servies localement au build, zéro requête tierce en production).

```
fonts/
├── JetBrainsMono/
│   ├── JetBrainsMono-Regular.ttf  (400)
│   ├── JetBrainsMono-Medium.ttf   (500)
│   └── OFL.txt                    (licence SIL Open Font License 1.1)
├── fonts.css                  @font-face self-hosted pour usage hors-Next
└── README.md                  ce fichier
```

---

## 📤 Pour uploader dans claude.ai « Set up your design system »

Clic sur **Upload fonts** → multi-sélection des fichiers TTF :

- **Fraunces** : télécharger depuis [fonts.google.com/specimen/Fraunces](https://fonts.google.com/specimen/Fraunces) (Light 300, Regular 400, Semibold 600, Bold 700)
- **Inter** : télécharger depuis [fonts.google.com/specimen/Inter](https://fonts.google.com/specimen/Inter) (Regular 400, Medium 500, Semibold 600, Bold 700)
- **JetBrains Mono** : multi-sélection des 2 TTF dans `JetBrainsMono/` ci-dessus

> ✅ Glisse-dépose direct depuis l'explorateur Windows : multi-sélection avec Ctrl+clic.

---

## 🌐 Pour `apps/web`

La méthode officielle est `next/font` (chargement optimisé Next.js + zéro requête tierce). Cf. `apps/web/src/app/layout.tsx` :

```tsx
import { Fraunces, Inter } from "next/font/google";
import localFont from "next/font/local";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = localFont({
  src: [
    {
      path: "../../public/fonts/JetBrainsMono/JetBrainsMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/JetBrainsMono/JetBrainsMono-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
```

Les variables CSS `--font-fraunces`, `--font-inter`, `--font-jetbrains-mono` sont consommées par le bloc `@theme` de `apps/web/src/app/globals.css` qui mappe `--font-display`, `--font-sans`, `--font-mono`.

---

## 📜 Licences

| Police             | Licence                                                  | Origine                                                               |
| ------------------ | -------------------------------------------------------- | --------------------------------------------------------------------- |
| **Fraunces**       | SIL Open Font License 1.1                                | [undercase-type/Fraunces](https://github.com/undercase-type/Fraunces) |
| **Inter**          | SIL Open Font License 1.1                                | [rsms/inter](https://github.com/rsms/inter)                           |
| **JetBrains Mono** | SIL Open Font License 1.1 — voir `JetBrainsMono/OFL.txt` | [JetBrains/JetBrainsMono](https://github.com/JetBrains/JetBrainsMono) |

Les trois licences autorisent l'utilisation commerciale, la modification et la redistribution. Conserver le fichier `OFL.txt` à côté des polices si tu redistribues.
