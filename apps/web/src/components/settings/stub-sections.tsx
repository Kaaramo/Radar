import type { Concurrent, ProfilUtilisateur } from "@radar/database";
import { ExternalLink } from "lucide-react";

/**
 * Sections "lecture seule" : profil / concurrents / notifications.
 *
 * Direction : Apple System Preferences, mais "passé à un autre niveau"
 * (feedback user senior design) — chaque page a un header identité fort qui
 * met le contenu au premier plan :
 *   - ProfilSection : avatar initiale royal + nom display + lien site → "ce
 *     profil c'est VOUS"
 *   - ConcurrentsSection : count en eyebrow + avatars initiale colorés par
 *     concurrent → "voici la liste de qui vous surveillez"
 *   - NotificationsSection : sous-titre explicatif pour contextualiser
 *
 * Style commun :
 *   - Headers en Fraunces (display light, tracking serré)
 *   - Sub-titres en muted-soft, font-mono petite caps pour eyebrow
 *   - Cards groupées (rounded-xl, bg navy-900/60)
 *   - Rows label-gauche / value-droite, hairline entre
 *
 * Note : `AxesSection` est un Client Component séparé (`axes-section.tsx`)
 * avec toggles Apple-style et persistance temps réel.
 */

/* ── Profil ────────────────────────────────────────────────────────── */

export function ProfilSection({
  profil,
  userEmail,
}: {
  profil: ProfilUtilisateur | null;
  userEmail: string;
}) {
  if (profil === null) {
    return (
      <PageLayout
        title="Profil"
        subtitle="Les informations de votre entreprise telles que renseignées à l'inscription."
      >
        <EmptyHint>Profil non créé.</EmptyHint>
      </PageLayout>
    );
  }

  const initial = profil.nomEntreprise.trim().charAt(0).toUpperCase();
  const siteHostname = profil.siteWeb ? hostnameOf(profil.siteWeb) : null;

  return (
    <div className="flex flex-col gap-8">
      {/* Hero identité — met l'entreprise au premier plan */}
      <header className="flex items-start gap-5">
        <div
          aria-hidden="true"
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-royal/15 ring-1 ring-royal/30"
        >
          <span className="font-display text-[26px] font-light text-royal">
            {initial}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="m-0 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-soft">
            Votre entreprise
          </p>
          <h1 className="m-0 mt-1 font-display text-[28px] font-light leading-[1.1] tracking-[-0.02em] text-bone">
            {profil.nomEntreprise}
          </h1>
          {profil.siteWeb && siteHostname ? (
            <a
              href={profil.siteWeb}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 font-mono text-[12px] text-muted-soft transition-colors duration-150 ease-out hover:text-royal"
            >
              <span>{siteHostname}</span>
              <ExternalLink size={11} strokeWidth={1.8} />
            </a>
          ) : null}
        </div>
      </header>

      {/* Card compte */}
      <Card>
        <Row label="Email du compte" value={userEmail} mono />
      </Card>
    </div>
  );
}

/* ── Concurrents ───────────────────────────────────────────────────── */

export function ConcurrentsSection({
  concurrents,
}: {
  concurrents: Concurrent[];
}) {
  const count = concurrents.length;
  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="m-0 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-soft">
          {count > 0
            ? `${count} concurrent${count > 1 ? "s" : ""} surveillé${
                count > 1 ? "s" : ""
              }`
            : "Aucun concurrent"}
        </p>
        <h1 className="m-0 mt-1 font-display text-[28px] font-light leading-[1.1] tracking-[-0.02em] text-bone">
          Concurrents
        </h1>
        <p className="m-0 mt-2 max-w-[440px] text-[13px] leading-[1.55] text-muted-soft">
          Les entreprises que votre radar suit quotidiennement pour détecter
          leurs mouvements stratégiques.
        </p>
      </header>

      {concurrents.length === 0 ? (
        <EmptyHint>Aucun concurrent renseigné.</EmptyHint>
      ) : (
        <Card>
          {concurrents.map((c, i) => (
            <ConcurrentRow
              key={c.id}
              concurrent={c}
              isLast={i === concurrents.length - 1}
            />
          ))}
        </Card>
      )}
    </div>
  );
}

function ConcurrentRow({
  concurrent: c,
  isLast,
}: {
  concurrent: Concurrent;
  isLast: boolean;
}) {
  const initial = c.nom.trim().charAt(0).toUpperCase();
  const tone = avatarTone(c.nom);
  return (
    <div
      className={`group flex items-center gap-4 px-5 py-4 transition-colors duration-150 ease-out hover:bg-navy-800/30 ${
        isLast ? "" : "border-b border-navy-700/40"
      }`}
    >
      <div
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1"
        style={{
          background: `${tone}1F`, // 12% opacity
          color: tone,
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          ["--tw-ring-color" as string]: `${tone}50`,
        }}
      >
        <span className="font-display text-[15px] font-medium">{initial}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="m-0 text-[13.5px] font-medium text-bone">{c.nom}</p>
        {c.secteur ? (
          <p className="m-0 mt-0.5 text-[12px] text-muted-soft">{c.secteur}</p>
        ) : null}
      </div>
      {c.siteWeb ? (
        <a
          href={c.siteWeb}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.06em] text-muted-soft transition-colors duration-150 ease-out hover:text-royal"
        >
          {hostnameOf(c.siteWeb)}
          <ExternalLink size={10} strokeWidth={1.8} />
        </a>
      ) : null}
    </div>
  );
}

/**
 * Tone déterministe (hash léger sur le nom) pour ne pas avoir une mer de royal
 * blue uniforme quand on a 5+ concurrents listés. 5 couleurs RADAR-compatibles.
 */
function avatarTone(name: string): string {
  const palette = ["#2251FF", "#C77700", "#0F8F65", "#7C3AED", "#0EA5E9"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return palette[hash % palette.length]!;
}

/* ── Notifications ─────────────────────────────────────────────────── */

export function NotificationsSection({ userEmail }: { userEmail: string }) {
  return (
    <PageLayout
      title="Notifications"
      subtitle="Votre brief quotidien est envoyé chaque matin, sans intervention de votre part."
    >
      <Card>
        <Row label="Heure du digest" value="7h00, chaque matin" />
        <Row label="Email" value={userEmail} mono />
      </Card>
    </PageLayout>
  );
}

/* ── Layout primitives (Apple-like) ─────────────────────────────────── */

function PageLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="m-0 font-display text-[28px] font-light leading-[1.1] tracking-[-0.02em] text-bone">
          {title}
        </h1>
        {subtitle ? (
          <p className="m-0 mt-2 max-w-[440px] text-[13px] leading-[1.55] text-muted-soft">
            {subtitle}
          </p>
        ) : null}
      </header>
      {children}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl border border-navy-700 bg-navy-900/60">
      {children}
    </section>
  );
}

function Row({
  label,
  value,
  mono,
  link,
}: {
  label: string;
  value: string | null;
  mono?: boolean;
  link?: boolean;
}) {
  const isEmpty = value === null || value === "";
  return (
    <div className="flex items-center justify-between gap-6 border-b border-navy-700/40 px-5 py-4 last:border-0">
      <span className="shrink-0 text-[13px] text-muted">{label}</span>
      {isEmpty ? (
        <span className="text-[13px] italic text-muted-soft/60">—</span>
      ) : link && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-w-0 items-center gap-1 truncate text-[13px] text-bone transition-colors duration-150 ease-out hover:text-royal"
        >
          <span className="truncate">{hostnameOf(value)}</span>
          <ExternalLink size={11} strokeWidth={1.8} className="shrink-0" />
        </a>
      ) : (
        <span
          className={`min-w-0 truncate text-[13px] text-bone ${
            mono ? "font-mono text-[12.5px]" : ""
          }`}
        >
          {value}
        </span>
      )}
    </div>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-navy-700 bg-navy-900/30 px-6 py-10 text-center text-[12.5px] italic text-muted-soft">
      {children}
    </div>
  );
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
