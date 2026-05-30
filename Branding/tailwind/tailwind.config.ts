/**
 * Config Tailwind compatibilité v3 — pour les outils tiers qui ne lisent pas
 * encore le @theme de Tailwind v4 (Storybook, plugins, etc.).
 *
 * En production sous apps/web (Next.js 16 + Tailwind 4), la SOURCE DE VÉRITÉ
 * est globals.css avec @theme. Ce fichier sert de fallback et peut être
 * supprimé si aucun outil ne l'exige.
 */
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0B0F14",
          surface: "#141A22",
          elevated: "#1C242F",
        },
        teal: {
          50: "#F0FDFA",
          200: "#99F6E4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
        },
        safran: {
          300: "#FCD34D",
          500: "#F59E0B",
          600: "#D97706",
        },
        text: {
          primary: "#E8EAED",
          secondary: "#94A3B8",
          tertiary: "#64748B",
          disabled: "#475569",
        },
        border: {
          subtle: "#1F2937",
          strong: "#334155",
        },
        semantic: {
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#3B82F6",
        },
        pestel: {
          political: "#EF4444",
          economic: "#F59E0B",
          social: "#8B5CF6",
          technological: "#14B8A6",
          environmental: "#10B981",
          legal: "#3B82F6",
        },
        swot: {
          strengths: "#14B8A6",
          weaknesses: "#F59E0B",
          opportunities: "#10B981",
          threats: "#EF4444",
        },
      },
      fontFamily: {
        display: [
          '"Outfit"',
          '"Inter"',
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        sans: [
          '"Outfit"',
          '"Inter"',
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: ['"JetBrains Mono"', '"Menlo"', '"Consolas"', "monospace"],
      },
      fontSize: {
        display: ["4.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        h1: ["3rem", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["2rem", { lineHeight: "1.3", fontWeight: "600" }],
        h3: ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }],
        "body-l": ["1.125rem", { lineHeight: "1.5", fontWeight: "400" }],
        body: ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["0.8125rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
      },
      spacing: {
        sidebar: "248px",
        header: "64px",
      },
      maxWidth: {
        content: "1280px",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
      },
      boxShadow: {
        sm: "0 2px 4px rgba(0, 0, 0, 0.30)",
        md: "0 4px 12px rgba(0, 0, 0, 0.35)",
        lg: "0 8px 24px rgba(0, 0, 0, 0.40)",
        xl: "0 16px 48px rgba(0, 0, 0, 0.50)",
      },
      keyframes: {
        "radar-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.15)" },
        },
      },
      animation: {
        "radar-pulse": "radar-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
