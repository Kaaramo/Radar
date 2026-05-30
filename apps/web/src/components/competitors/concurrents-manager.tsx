"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronRight,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  createConcurrent,
  deleteConcurrent,
  updateConcurrent,
  type ConcurrentInput,
} from "@/lib/actions/concurrents";

export type ManagedConcurrent = {
  id: string;
  nom: string;
  secteur: string | null;
  siteWeb: string | null;
};

export function ConcurrentsManager({
  concurrents,
}: {
  concurrents: ManagedConcurrent[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const refresh = () => router.refresh();

  const handleCreate = (input: ConcurrentInput) => {
    setError(null);
    startTransition(async () => {
      const res = await createConcurrent(input);
      if (res.success) {
        setAdding(false);
        refresh();
      } else {
        setError(res.error);
      }
    });
  };

  const handleUpdate = (id: string, input: ConcurrentInput) => {
    setError(null);
    startTransition(async () => {
      const res = await updateConcurrent(id, input);
      if (res.success) {
        setEditingId(null);
        refresh();
      } else {
        setError(res.error);
      }
    });
  };

  const handleDelete = (id: string) => {
    setError(null);
    startTransition(async () => {
      const res = await deleteConcurrent(id);
      if (res.success) refresh();
      else setError(res.error);
    });
  };

  return (
    <div>
      {/* Header */}
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="m-0 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-soft">
            {concurrents.length} concurrent{concurrents.length > 1 ? "s" : ""}{" "}
            surveillé{concurrents.length > 1 ? "s" : ""}
          </p>
          <h1 className="m-0 mt-1 font-display text-[32px] font-light leading-[1.05] tracking-[-0.02em] text-bone">
            Concurrents
          </h1>
          <p className="m-0 mt-3 max-w-[520px] text-[14px] leading-[1.6] text-muted">
            Ajoutez, modifiez ou retirez vos concurrents. Chaque ajout est pris
            en compte au prochain cycle de veille.
          </p>
        </div>
        {!adding ? (
          <button
            type="button"
            onClick={() => {
              setAdding(true);
              setEditingId(null);
              setError(null);
            }}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-royal px-4 text-[13px] font-semibold text-bone transition-colors duration-150 ease-out hover:bg-royal-light"
          >
            <Plus size={15} strokeWidth={1.8} />
            Ajouter un concurrent
          </button>
        ) : null}
      </header>

      {error ? (
        <p className="mb-4 rounded-md border border-error/40 bg-error/10 px-3 py-2 text-[12.5px] text-error">
          {error}
        </p>
      ) : null}

      {/* Formulaire d'ajout */}
      {adding ? (
        <ConcurrentForm
          pending={pending}
          onCancel={() => setAdding(false)}
          onSubmit={handleCreate}
        />
      ) : null}

      {/* Liste */}
      {concurrents.length === 0 && !adding ? (
        <div className="rounded-xl border border-dashed border-navy-700 bg-navy-900/60 px-6 py-14 text-center">
          <p className="m-0 text-[13.5px] text-muted">
            Vous ne surveillez encore personne.
          </p>
          <p className="m-0 mt-1.5 text-[12.5px] text-muted-soft">
            Cliquez sur «&nbsp;Ajouter un concurrent&nbsp;» pour démarrer.
          </p>
        </div>
      ) : (
        <section className="overflow-hidden rounded-xl border border-navy-700 bg-navy-900/60">
          {concurrents.map((c, i) =>
            editingId === c.id ? (
              <div
                key={c.id}
                className={
                  i === concurrents.length - 1
                    ? ""
                    : "border-b border-navy-700/40"
                }
              >
                <ConcurrentForm
                  pending={pending}
                  initial={c}
                  onCancel={() => setEditingId(null)}
                  onSubmit={(input) => handleUpdate(c.id, input)}
                />
              </div>
            ) : (
              <ConcurrentRow
                key={c.id}
                concurrent={c}
                isLast={i === concurrents.length - 1}
                pending={pending}
                onEdit={() => {
                  setEditingId(c.id);
                  setAdding(false);
                  setError(null);
                }}
                onDelete={() => handleDelete(c.id)}
                onOpen={() => router.push(`/competitors/${c.id}`)}
              />
            ),
          )}
        </section>
      )}
    </div>
  );
}

/* ── Ligne concurrent ─────────────────────────────────────────────────────── */

function ConcurrentRow({
  concurrent: c,
  isLast,
  pending,
  onEdit,
  onDelete,
  onOpen,
}: {
  concurrent: ManagedConcurrent;
  isLast: boolean;
  pending: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
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
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1"
        style={{
          background: `${tone}1F`,
          color: tone,
          ["--tw-ring-color" as string]: `${tone}50`,
        }}
      >
        <span className="font-display text-[16px] font-medium">{initial}</span>
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 text-left"
      >
        <p className="m-0 text-[14px] font-medium text-bone">{c.nom}</p>
        {c.secteur ? (
          <p className="m-0 mt-0.5 text-[12px] text-muted-soft">{c.secteur}</p>
        ) : null}
      </button>

      {c.siteWeb ? (
        <a
          href={c.siteWeb}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.06em] text-muted-soft transition-colors duration-150 ease-out hover:text-royal lg:inline-flex"
        >
          {hostnameOf(c.siteWeb)}
          <ExternalLink size={10} strokeWidth={1.8} />
        </a>
      ) : null}

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {confirmDelete ? (
          <>
            <span className="text-[11.5px] text-muted-soft">Confirmer ?</span>
            <IconBtn
              label="Confirmer la suppression"
              tone="danger"
              disabled={pending}
              onClick={onDelete}
            >
              {pending ? (
                <Loader2 size={14} strokeWidth={1.8} className="animate-spin" />
              ) : (
                <Check size={14} strokeWidth={1.8} />
              )}
            </IconBtn>
            <IconBtn label="Annuler" onClick={() => setConfirmDelete(false)}>
              <X size={14} strokeWidth={1.8} />
            </IconBtn>
          </>
        ) : (
          <>
            <IconBtn label="Modifier" onClick={onEdit}>
              <Pencil size={14} strokeWidth={1.6} />
            </IconBtn>
            <IconBtn
              label="Retirer"
              tone="danger"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={14} strokeWidth={1.6} />
            </IconBtn>
            <button
              type="button"
              onClick={onOpen}
              aria-label="Voir le détail"
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-soft/60 transition-colors duration-150 ease-out hover:text-royal"
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function IconBtn({
  label,
  children,
  onClick,
  tone = "neutral",
  disabled,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  tone?: "neutral" | "danger";
  disabled?: boolean;
}) {
  const cls =
    tone === "danger"
      ? "text-muted-soft hover:bg-error/10 hover:text-error"
      : "text-muted-soft hover:bg-navy-800 hover:text-bone";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-150 ease-out disabled:opacity-50 ${cls}`}
    >
      {children}
    </button>
  );
}

/* ── Formulaire (ajout / édition) ─────────────────────────────────────────── */

function ConcurrentForm({
  initial,
  pending,
  onSubmit,
  onCancel,
}: {
  initial?: ManagedConcurrent;
  pending: boolean;
  onSubmit: (input: ConcurrentInput) => void;
  onCancel: () => void;
}) {
  const [nom, setNom] = useState(initial?.nom ?? "");
  const [siteWeb, setSiteWeb] = useState(initial?.siteWeb ?? "");
  const [secteur, setSecteur] = useState(initial?.secteur ?? "");

  const submit = () => {
    onSubmit({
      nom: nom.trim(),
      siteWeb: siteWeb.trim() || undefined,
      secteur: secteur.trim() || undefined,
    });
  };

  return (
    <div className="mb-4 rounded-xl border border-royal/30 bg-navy-900 p-5">
      <div className="grid gap-3 sm:grid-cols-[1.4fr_1.4fr_1fr]">
        <Field label="Nom" required>
          <input
            autoFocus
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex : Inwi"
            className="h-9 w-full rounded-md border border-navy-700 bg-navy px-3 text-[13px] text-bone outline-none transition-colors duration-150 ease-out placeholder:text-muted-soft focus:border-royal"
          />
        </Field>
        <Field label="Site web">
          <input
            value={siteWeb}
            onChange={(e) => setSiteWeb(e.target.value)}
            placeholder="https://www.exemple.ma"
            className="h-9 w-full rounded-md border border-navy-700 bg-navy px-3 text-[13px] text-bone outline-none transition-colors duration-150 ease-out placeholder:text-muted-soft focus:border-royal"
          />
        </Field>
        <Field label="Secteur">
          <input
            value={secteur}
            onChange={(e) => setSecteur(e.target.value)}
            placeholder="Télécoms"
            className="h-9 w-full rounded-md border border-navy-700 bg-navy px-3 text-[13px] text-bone outline-none transition-colors duration-150 ease-out placeholder:text-muted-soft focus:border-royal"
          />
        </Field>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={pending || nom.trim().length < 2}
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-royal px-4 text-[12.5px] font-semibold text-bone transition-colors duration-150 ease-out hover:bg-royal-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? (
            <Loader2 size={13} strokeWidth={1.8} className="animate-spin" />
          ) : null}
          {initial ? "Enregistrer" : "Ajouter"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="inline-flex h-8 items-center rounded-md px-3 text-[12.5px] text-muted-soft transition-colors duration-150 ease-out hover:text-bone disabled:opacity-50"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-soft">
        {label}
        {required ? <span className="text-royal"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function avatarTone(name: string): string {
  const palette = ["#2251FF", "#C77700", "#0F8F65", "#7C3AED", "#0EA5E9"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return palette[hash % palette.length]!;
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
