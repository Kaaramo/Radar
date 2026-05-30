"use client";

import { forwardRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  type LucideIcon,
} from "lucide-react";

export type FormInputProps = {
  id: string;
  label: string;
  leadingIcon?: LucideIcon;
  error?: string | null;
  success?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

/**
 * Champ de formulaire stylisé pour les écrans Auth :
 * - label cliquable lié à l'input via htmlFor
 * - icône leading (Lucide)
 * - toggle eye automatique pour `type="password"`
 * - états error / success avec border + ring
 * - ARIA : aria-invalid + aria-describedby
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput(
    {
      id,
      label,
      type = "text",
      leadingIcon: LeadingIcon,
      error,
      success,
      className,
      ...rest
    },
    ref,
  ) {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";
    const realType = isPassword ? (show ? "text" : "password") : type;

    const state: "error" | "success" | "default" = error
      ? "error"
      : success
        ? "success"
        : "default";

    const controlBorder =
      state === "error"
        ? "border-error focus-within:border-error focus-within:ring-error/25"
        : state === "success"
          ? "border-success"
          : "border-navy-700 focus-within:border-royal focus-within:ring-royal/30";

    const leadingColor = state === "error" ? "text-error" : "text-muted-soft";

    return (
      <div className={className}>
        <label
          htmlFor={id}
          className="mb-1.5 block text-[13px] font-medium tracking-[0.01em] text-muted"
        >
          {label}
        </label>
        <div
          className={`relative flex h-11 items-center rounded-md border bg-navy-900 transition-[border-color,box-shadow,background-color] duration-150 ease-out hover:bg-navy-800 focus-within:ring-2 ${controlBorder}`}
        >
          {LeadingIcon ? (
            <span
              className={`flex h-full w-9 shrink-0 items-center justify-center pl-1 ${leadingColor}`}
              aria-hidden="true"
            >
              <LeadingIcon size={16} strokeWidth={1.5} />
            </span>
          ) : null}
          <input
            ref={ref}
            id={id}
            type={realType}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? `${id}-err` : undefined}
            className="min-w-0 flex-1 border-0 bg-transparent px-1 py-2.5 pr-3.5 text-[15px] text-bone outline-none placeholder:text-muted-soft"
            {...rest}
          />
          {success && !isPassword ? (
            <span
              className="flex h-full w-9 shrink-0 items-center justify-center text-success"
              aria-hidden="true"
            >
              <CheckCircle2 size={16} strokeWidth={1.5} />
            </span>
          ) : null}
          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShow((s) => !s)}
              aria-label={
                show ? "Masquer le mot de passe" : "Afficher le mot de passe"
              }
              className="absolute right-0 flex h-full w-9 items-center justify-center bg-transparent text-muted-soft transition-colors duration-150 ease-out hover:text-bone"
            >
              {show ? (
                <EyeOff size={16} strokeWidth={1.5} />
              ) : (
                <Eye size={16} strokeWidth={1.5} />
              )}
            </button>
          ) : null}
        </div>
        {error ? (
          <div
            id={`${id}-err`}
            className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-error"
          >
            <AlertCircle size={14} strokeWidth={1.5} aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : null}
      </div>
    );
  },
);
