/**
 * Radar lockup (mark + wordmark) — variante "light" (wordmark bone, mark royal blue).
 * Inline SVG pour permettre `currentColor` et la prop `height` sans surcharge `<Image>`.
 *
 * Source : Branding/logo/lockup-light.svg
 */
export type LogoProps = {
  height?: number;
  className?: string;
  ariaLabel?: string;
};

/**
 * Radar wordmark seul (texte « RADAR », sans le mark/icône) — variante "light"
 * (bone). Inline SVG pour la prop `height` sans surcharge `<Image>`.
 *
 * Source : Branding/logo/wordmark-light.svg
 */
export function RadarWordmarkLight({
  height = 36,
  className,
  ariaLabel = "RADAR",
}: LogoProps) {
  return (
    <svg
      height={height}
      viewBox="0 0 280 64"
      fill="none"
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={{ display: "block" }}
    >
      <text
        x="0"
        y="50"
        fontFamily="Inter, -apple-system, system-ui, sans-serif"
        fontSize="56"
        fontWeight="700"
        fill="#F5F1EB"
        letterSpacing="3"
      >
        RADAR
      </text>
    </svg>
  );
}

export function RadarLockupLight({
  height = 36,
  className,
  ariaLabel = "RADAR",
}: LogoProps) {
  return (
    <svg
      height={height}
      viewBox="0 0 360 64"
      fill="none"
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={{ display: "block" }}
    >
      <g>
        <circle cx="14" cy="50" r="3" fill="#2251FF" />
        <path
          d="M 14 38 A 12 12 0 0 1 26 50"
          stroke="#2251FF"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 14 26 A 24 24 0 0 1 38 50"
          stroke="#2251FF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 14 14 A 36 36 0 0 1 50 50"
          stroke="#2251FF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.3"
        />
        <circle cx="45" cy="22" r="2.5" fill="#4F73FF" />
      </g>
      <text
        x="80"
        y="50"
        fontFamily="Inter, -apple-system, system-ui, sans-serif"
        fontSize="56"
        fontWeight="700"
        fill="#F5F1EB"
        letterSpacing="3"
      >
        RADAR
      </text>
    </svg>
  );
}

/**
 * Variante dédiée aux pages auth (/login, /register).
 * Alignée sur Branding/logo/lockup-light.svg : royal blue + bone.
 */
export function RadarLockupAuth({
  height = 36,
  className,
  ariaLabel = "RADAR",
}: LogoProps) {
  return (
    <svg
      height={height}
      viewBox="0 0 360 64"
      fill="none"
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={{ display: "block" }}
    >
      <g>
        <circle cx="14" cy="50" r="3" fill="#2251FF" />
        <path
          d="M 14 38 A 12 12 0 0 1 26 50"
          stroke="#2251FF"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 14 26 A 24 24 0 0 1 38 50"
          stroke="#2251FF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 14 14 A 36 36 0 0 1 50 50"
          stroke="#2251FF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.3"
        />
        <circle cx="45" cy="22" r="2.5" fill="#4F73FF" />
      </g>
      <text
        x="80"
        y="50"
        fontFamily="Inter, -apple-system, system-ui, sans-serif"
        fontSize="56"
        fontWeight="700"
        fill="#F5F1EB"
        letterSpacing="3"
      >
        RADAR
      </text>
    </svg>
  );
}
