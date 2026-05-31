import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * Bloc skeleton générique.
 *
 * Animation = pulse d'opacité uniquement (charte RADAR : transform/opacity,
 * aucun shimmer-gradient). Surface `bg-navy-800` lisible sur fond `navy`.
 */
export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-navy-800", className)}
      {...props}
    />
  );
}
