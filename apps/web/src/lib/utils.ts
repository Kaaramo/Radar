/**
 * Concatène des classes conditionnelles (style `clsx` minimal, sans dépendance).
 * Filtre les valeurs falsy et joint par un espace.
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
