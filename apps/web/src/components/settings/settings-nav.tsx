import Link from "next/link";
import {
  Bell,
  Building2,
  Compass,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

export type SettingsSection =
  | "profil"
  | "concurrents"
  | "axes"
  | "deep-research"
  | "notifications";

/**
 * État visuel d'une section dans la nav :
 *   - 'ok'    → ✓ tiret success (configuré)
 *   - 'warn'  → ◉ point warning pulsant (action requise)
 *   - 'count' → chiffre tabulaire muted (count > 0)
 *   - 'idle'  → rien (par défaut)
 */
export type SettingsNavStatus =
  | { kind: "ok" }
  | { kind: "warn" }
  | { kind: "count"; value: number }
  | { kind: "idle" };

type Item = {
  key: SettingsSection;
  label: string;
  icon: LucideIcon;
};

const ITEMS: Item[] = [
  { key: "profil", label: "Profil", icon: Building2 },
  { key: "concurrents", label: "Concurrents", icon: Users },
  { key: "axes", label: "Axes", icon: Compass },
  { key: "deep-research", label: "Profil business", icon: Sparkles },
  { key: "notifications", label: "Notifications", icon: Bell },
];

export type SettingsNavProps = {
  active: SettingsSection;
  /** Statuts par section pour les pastilles à droite */
  statuses?: Partial<Record<SettingsSection, SettingsNavStatus>>;
};

/**
 * Nav verticale 220px — Apple-like : 1 ligne par section, icône + label + statut.
 * Active : barre royal vertical 2px à gauche + bg subtle + texte bone.
 */
export function SettingsNav({ active, statuses = {} }: SettingsNavProps) {
  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-navy-700 bg-navy/30 px-3 py-8">
      <nav className="flex flex-col gap-px">
        {ITEMS.map((item) => {
          const isActive = item.key === active;
          const Icon = item.icon;
          const status = statuses[item.key] ?? { kind: "idle" as const };
          return (
            <Link
              key={item.key}
              href={`/settings?section=${item.key}`}
              className={`group relative flex h-9 items-center gap-3 rounded-md px-3 transition-colors duration-150 ease-out ${
                isActive ? "bg-navy-800" : "hover:bg-navy-900"
              }`}
            >
              {isActive ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-royal"
                />
              ) : null}
              <Icon
                size={15}
                strokeWidth={1.6}
                className={
                  isActive
                    ? "text-royal"
                    : "text-muted-soft group-hover:text-muted"
                }
              />
              <span
                className={`flex-1 truncate text-[13px] ${
                  isActive
                    ? "font-medium text-bone"
                    : "text-muted group-hover:text-bone"
                }`}
              >
                {item.label}
              </span>
              <StatusPip status={status} />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function StatusPip({ status }: { status: SettingsNavStatus }) {
  if (status.kind === "idle") return null;
  if (status.kind === "ok") {
    return (
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-success"
      />
    );
  }
  if (status.kind === "warn") {
    return (
      <span
        aria-hidden="true"
        className="live-pulse h-1.5 w-1.5 rounded-full bg-warning"
      />
    );
  }
  return (
    <span className="font-mono text-[10.5px] tabular-nums text-muted-soft">
      {status.value}
    </span>
  );
}
