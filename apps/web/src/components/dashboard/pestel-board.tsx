import {
  Banknote,
  Cpu,
  Gavel,
  Landmark,
  Leaf,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { RapportPestel } from "@/lib/dashboard/types";

/**
 * Board PESTEL pleine largeur (page /pestel).
 *
 * Les items de l'agent suivent le format :
 *   « Titre | Impact: positif | Intensité: fort | Description [Sources: …] »
 * On le parse pour un rendu lisible (titre + chips impact/intensité + texte).
 */
const AXES: {
  key: keyof NonNullable<RapportPestel>;
  label: string;
  Icon: LucideIcon;
}[] = [
  { key: "political", label: "Politique", Icon: Landmark },
  { key: "economic", label: "Économique", Icon: Banknote },
  { key: "social", label: "Social", Icon: Users },
  { key: "technological", label: "Technologique", Icon: Cpu },
  { key: "environmental", label: "Environnemental", Icon: Leaf },
  { key: "legal", label: "Légal", Icon: Gavel },
];

type ParsedItem = {
  titre: string;
  impact: string | null;
  intensite: string | null;
  description: string | null;
  sources: string | null;
};

function parseItem(raw: string): ParsedItem {
  const parts = raw.split("|").map((p) => p.trim());
  let titre = parts[0] ?? raw;
  let impact: string | null = null;
  let intensite: string | null = null;
  const descChunks: string[] = [];

  for (const p of parts.slice(1)) {
    const low = p.toLowerCase();
    if (low.startsWith("impact:")) {
      impact = p.slice(p.indexOf(":") + 1).trim();
    } else if (low.startsWith("intensité:") || low.startsWith("intensite:")) {
      intensite = p.slice(p.indexOf(":") + 1).trim();
    } else if (p.length > 0) {
      descChunks.push(p);
    }
  }

  let description = descChunks.join(" — ") || null;
  let sources: string | null = null;
  if (description) {
    const m = description.match(/\[Sources?\s*:\s*([^\]]+)\]/i);
    if (m) {
      sources = m[1]?.trim() ?? null;
      description = description.replace(m[0], "").trim();
    }
  }
  if (!titre) titre = raw;
  return { titre, impact, intensite, description, sources };
}

function impactClass(impact: string | null): string {
  if (!impact) return "bg-fog/10 text-fog";
  const v = impact.toLowerCase();
  if (v.includes("positif")) return "bg-emerald-500/15 text-emerald-400";
  if (v.includes("négatif") || v.includes("negatif"))
    return "bg-red-500/15 text-red-400";
  return "bg-royal/15 text-royal";
}

function intensiteClass(intensite: string | null): string {
  if (!intensite) return "bg-fog/10 text-fog";
  const v = intensite.toLowerCase();
  if (v.includes("fort")) return "bg-amber/20 text-amber";
  if (v.includes("faible")) return "bg-fog/10 text-fog";
  return "bg-royal/10 text-royal";
}

export function PestelBoard({
  pestel,
}: {
  pestel: NonNullable<RapportPestel>;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {AXES.map((axe) => {
        const items = (pestel[axe.key] ?? []).map(parseItem);
        return (
          <section
            key={axe.key}
            className="rounded-lg border border-line/50 bg-navy-800/40 p-4"
          >
            <div className="mb-3 flex items-center gap-2 border-b border-line/40 pb-3">
              <axe.Icon className="h-4 w-4 text-royal" strokeWidth={1.5} />
              <h2 className="font-display text-lg text-bone">{axe.label}</h2>
              <span className="ml-auto font-mono text-xs text-fog">
                {items.length}
              </span>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-fog">Aucun facteur détecté.</p>
            ) : (
              <ul className="space-y-4">
                {items.map((it, i) => (
                  <li key={i}>
                    <p className="text-sm font-medium leading-snug text-bone">
                      {it.titre}
                    </p>
                    {(it.impact || it.intensite) && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {it.impact && (
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                              impactClass(it.impact),
                            )}
                          >
                            {it.impact}
                          </span>
                        )}
                        {it.intensite && (
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                              intensiteClass(it.intensite),
                            )}
                          >
                            Intensité {it.intensite}
                          </span>
                        )}
                      </div>
                    )}
                    {it.description && (
                      <p className="mt-1.5 text-xs leading-relaxed text-mist">
                        {it.description}
                      </p>
                    )}
                    {it.sources && (
                      <p className="mt-1 text-[11px] text-fog">
                        Sources : {it.sources}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
