/**
 * Ligne horizontale 1px avec « ou » centré.
 * Le texte est sur fond bg-primary par défaut. À l'intérieur d'une AuthCard,
 * forcer `bgVariant="surface"` pour cacher la ligne sous le mot.
 */
export type AuthDividerProps = {
  bgVariant?: "primary" | "surface";
};

export function AuthDivider({ bgVariant = "primary" }: AuthDividerProps) {
  const bgClass = bgVariant === "surface" ? "bg-navy-900" : "bg-navy";
  return (
    <div
      className="relative h-px bg-navy-700"
      role="separator"
      aria-orientation="horizontal"
    >
      <span
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-[13px] tracking-[0.02em] text-muted-soft ${bgClass}`}
      >
        ou
      </span>
    </div>
  );
}
