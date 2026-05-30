"use client";

import { useEffect, useState } from "react";

export type ResendCountdownButtonProps = {
  initialSeconds?: number;
  label?: string;
  onResend?: () => void;
};

/**
 * Bouton secondary qui se disable pendant N secondes après chaque clic.
 * Pendant le countdown, le libellé devient « Renvoyer dans Xs ».
 */
export function ResendCountdownButton({
  initialSeconds = 60,
  label = "Renvoyer l'email",
  onResend,
}: ResendCountdownButtonProps) {
  const [secs, setSecs] = useState(initialSeconds);

  useEffect(() => {
    if (secs <= 0) return;
    const id = setInterval(() => {
      setSecs((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [secs]);

  const disabled = secs > 0;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        setSecs(initialSeconds);
        onResend?.();
      }}
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-navy-700 bg-transparent text-[15px] font-medium text-bone transition-colors duration-150 ease-out hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {disabled ? `Renvoyer dans ${secs}s` : label}
    </button>
  );
}
