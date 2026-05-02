// Design tokens "Intel Dark" - source de vérité pour les couleurs/typo/espacements RADAR.
// Le fichier intel-dark.css expose ces mêmes tokens en CSS variables pour les apps.

export const colors = {
  bg: {
    base: '#0A0E14',
    raised: '#10151D',
    sunken: '#070A0F',
    overlay: '#161C25',
  },
  fg: {
    primary: '#E6EDF3',
    secondary: '#9DA7B3',
    muted: '#5C6773',
    inverse: '#0A0E14',
  },
  accent: {
    primary: '#0071C5',
    primaryHover: '#0090F0',
    secondary: '#00C7E0',
    success: '#3FB950',
    warning: '#D29922',
    danger: '#F85149',
  },
  border: {
    subtle: '#1F2730',
    default: '#2D3640',
    strong: '#3D4752',
  },
} as const;

export const typography = {
  fontFamily: {
    sans: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
} as const;

export const radius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const;

export type ColorScale = typeof colors;
export type TypographyScale = typeof typography;
