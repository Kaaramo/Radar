"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { signOut } from "@/lib/auth/auth-client";

import { Avatar } from "./avatar";

export type AvatarMenuProps = {
  name: string;
  email: string;
};

/**
 * Avatar cliquable avec popover d'identité + déconnexion.
 *
 * Senior cut : 1 seule action utile (logout). Pas de "Paramètres"
 * (déjà dans la sidebar). Pas de "Manage account" (V2).
 */
export function AvatarMenu({ name, email }: AvatarMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menu utilisateur"
        className="rounded-full transition-shadow duration-150 ease-out hover:ring-2 hover:ring-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal"
      >
        <Avatar name={name} size={28} />
      </button>

      {open ? (
        <div
          role="menu"
          className="fade-mount absolute right-0 top-full mt-2 w-[260px] origin-top-right overflow-hidden rounded-md border border-navy-700 bg-navy-900 shadow-lg"
        >
          <div className="border-b border-navy-700 px-4 py-3">
            <p
              className="m-0 truncate text-[13px] font-medium text-bone"
              title={name}
            >
              {name}
            </p>
            <p
              className="m-0 mt-0.5 truncate text-[12px] text-muted-soft"
              title={email}
            >
              {email}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            role="menuitem"
            className="flex h-10 w-full items-center gap-2.5 px-4 text-left text-[13px] text-muted transition-colors duration-150 ease-out hover:bg-navy-800 hover:text-bone disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={14} strokeWidth={1.6} />
            <span>{signingOut ? "Déconnexion..." : "Se déconnecter"}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
