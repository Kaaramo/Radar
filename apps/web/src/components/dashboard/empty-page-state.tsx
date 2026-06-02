import type { LucideIcon } from "lucide-react";

export type EmptyPageStateProps = {
  /** Icône Lucide outline stroke 1.5 dans le badge royal. */
  icon: LucideIcon;
  /** Eyebrow caps mono — ex : « ARRIVE SPRINT 04 » ou « LIVRABLE M244 ». */
  eyebrow: string;
  /** Titre Fraunces display — phrase courte affirmative. */
  title: string;
  /** Description 1-2 phrases : ce que la page apportera, pour qui, quand. */
  description: string;
};

/**
 * Empty state premium pour les pages V1 non encore livrées.
 *
 * Senior pattern : ne JAMAIS afficher juste « bientôt disponible » comme texte
 * lâché. Toujours valoriser la fonctionnalité future avec :
 *   - icône large dans badge royal (cohérent avec la marque)
 *   - eyebrow caps mono (contextualise le quand / le pourquoi)
 *   - titre Fraunces (donne la dignité d'une vraie page)
 *   - description orientée valeur (ce que ça apportera, pas une excuse)
 *
 * Utilisé pour /swot, /pestel, /reports, /cycles en V1 — sera remplacé par
 * du contenu réel à chaque sprint qui livre la feature correspondante.
 */
export function EmptyPageState({
  icon: Icon,
  eyebrow,
  title,
  description,
}: EmptyPageStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 py-20">
      <div className="flex max-w-[460px] flex-col items-center text-center">
        <span
          aria-hidden="true"
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-royal/10 ring-1 ring-royal/25"
        >
          <Icon size={24} strokeWidth={1.5} className="text-royal" />
        </span>
        <p className="mt-7 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-royal">
          {eyebrow}
        </p>
        <h1 className="m-0 mt-3 font-display text-[30px] font-light leading-[1.1] tracking-[-0.02em] text-bone">
          {title}
        </h1>
        <p className="m-0 mt-4 text-[14px] leading-[1.6] text-muted">
          {description}
        </p>
      </div>
    </div>
  );
}
