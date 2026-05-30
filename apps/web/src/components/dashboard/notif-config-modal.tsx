"use client";

import { useState, useTransition } from "react";
import { BellOff, CalendarDays, Check, Mail, Sun } from "lucide-react";

import {
  saveNotificationPreference,
  type NotificationPreferenceInput,
} from "@/lib/actions/dashboard";

export type NotifConfigModalProps = {
  defaultEmail: string;
  onClose: () => void;
};

type Frequency = NotificationPreferenceInput["digestFrequency"];

/**
 * Modale de configuration des notifications — affichée en J0 à la 1ʳᵉ visite.
 *
 * Source design : `dash-screens.jsx` (NotifConfigModal).
 */
export function NotifConfigModal({
  defaultEmail,
  onClose,
}: NotifConfigModalProps) {
  const [frequency, setFrequency] = useState<Frequency>("DAILY");
  const [email, setEmail] = useState(defaultEmail);
  const [criticalAlertsOnly, setCriticalAlertsOnly] = useState(true);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await saveNotificationPreference({
        digestFrequency: frequency,
        emailDigest: email,
        criticalAlertsOnly,
      });
      onClose();
    });
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="backdrop-fade-in fixed inset-0 z-50 bg-black/70"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="notif-modal-title"
          className="w-full max-w-[520px] rounded-xl border border-navy-700 bg-navy-900 p-7 shadow-xl"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-royal/10 text-royal ring-1 ring-royal/20">
            <Sun size={24} strokeWidth={1.6} />
          </div>

          <h2
            id="notif-modal-title"
            className="m-0 text-[22px] font-semibold leading-[1.25] tracking-[-0.01em] text-bone"
          >
            Comment voulez-vous recevoir vos rapports ?
          </h2>
          <p className="mt-2 text-[14px] leading-[1.55] text-muted">
            Réglez vos préférences. Vous pourrez les ajuster à tout moment dans
            Paramètres.
          </p>

          {/* Section 1 — Fréquence */}
          <div className="mt-6">
            <div className="mb-2 text-[12px] font-medium uppercase tracking-[0.06em] text-muted-soft">
              Fréquence du digest
            </div>
            <div className="grid grid-cols-3 gap-2">
              <RadioCard
                icon={<Sun size={18} strokeWidth={1.6} />}
                color="#4F73FF"
                label="Quotidien"
                recommended
                selected={frequency === "DAILY"}
                onClick={() => setFrequency("DAILY")}
              />
              <RadioCard
                icon={<CalendarDays size={18} strokeWidth={1.6} />}
                color="#8FA3B8"
                label="Hebdomadaire"
                selected={frequency === "WEEKLY"}
                onClick={() => setFrequency("WEEKLY")}
              />
              <RadioCard
                icon={<BellOff size={18} strokeWidth={1.6} />}
                color="#6B7280"
                label="Jamais"
                selected={frequency === "NEVER"}
                onClick={() => setFrequency("NEVER")}
              />
            </div>
          </div>

          {/* Section 2 — Email */}
          <div className="mt-5">
            <div className="mb-2 text-[12px] font-medium uppercase tracking-[0.06em] text-muted-soft">
              Email destinataire
            </div>
            <div className="flex h-11 items-center gap-2 rounded-md border border-navy-700 bg-navy px-3 transition-colors duration-150 ease-out focus-within:border-royal focus-within:ring-2 focus-within:ring-royal/30">
              <Mail size={16} strokeWidth={1.6} className="text-muted-soft" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-bone outline-none placeholder:text-muted-soft"
              />
            </div>
            <p className="mt-1.5 text-[12px] text-muted-soft">
              Vous pouvez utiliser une autre adresse pour les digests.
            </p>
          </div>

          {/* Section 3 — Toggle critiques */}
          <div className="mt-5 flex items-start justify-between gap-4 rounded-md border border-navy-700 bg-navy p-4">
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-medium text-bone">
                Alertes critiques uniquement
              </div>
              <div className="mt-0.5 text-[12.5px] leading-[1.5] text-muted">
                Email instantané si un mouvement urgent est détecté (axes
                Stratégie ou Réglementation).
              </div>
            </div>
            <Toggle on={criticalAlertsOnly} onChange={setCriticalAlertsOnly} />
          </div>

          {/* Footer */}
          <div className="mt-7 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="inline-flex h-10 items-center rounded-md px-4 text-[14px] font-medium text-muted transition-colors duration-150 ease-out hover:bg-navy-800 hover:text-bone disabled:cursor-not-allowed disabled:opacity-50"
            >
              Plus tard
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="inline-flex h-10 items-center rounded-md bg-royal px-5 text-[14px] font-semibold text-navy transition-colors duration-150 ease-out hover:bg-royal-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

type RadioCardProps = {
  icon: React.ReactNode;
  color: string;
  label: string;
  recommended?: boolean;
  selected: boolean;
  onClick: () => void;
};

function RadioCard({
  icon,
  color,
  label,
  recommended = false,
  selected,
  onClick,
}: RadioCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1.5 rounded-md border px-2 py-3 text-[12.5px] transition-all duration-150 ease-out ${
        selected
          ? "border-royal bg-royal/10 text-bone"
          : "border-navy-700 bg-navy text-muted hover:bg-navy-800"
      }`}
    >
      <span style={{ color }}>{icon}</span>
      <span className="font-medium">{label}</span>
      {recommended ? (
        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-royal">
          ★ Recommandé
        </span>
      ) : null}
      {selected ? (
        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-royal text-navy">
          <Check size={10} strokeWidth={2.5} />
        </span>
      ) : null}
    </button>
  );
}

type ToggleProps = {
  on: boolean;
  onChange: (next: boolean) => void;
};

function Toggle({ on, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-150 ease-out ${
        on ? "bg-royal" : "bg-navy-700"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 transform rounded-full bg-white shadow transition-transform duration-150 ease-out ${
          on ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
