export type AvatarProps = {
  name: string;
  size?: number;
  bg?: string;
};

/** Avatar carré rounded-full avec les initiales (max 2 lettres). */
export function Avatar({ name, size = 32, bg = "#133553" }: AvatarProps) {
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <div
      className="inline-flex shrink-0 items-center justify-center rounded-full font-display font-medium text-bone"
      style={{
        width: size,
        height: size,
        background: bg,
        fontSize: Math.round(size * 0.36),
      }}
    >
      {initials}
    </div>
  );
}
