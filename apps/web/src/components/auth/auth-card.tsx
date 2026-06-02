import type { ReactNode } from "react";

export type AuthCardProps = {
  children: ReactNode;
};

/**
 * Wrapper card centrée 420px, fond bg-surface, padding 32px.
 * Utilisé sur les écrans forgot-password, reset-password, verify-email.
 */
export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-auto bg-navy px-6 py-8">
      <div className="w-full max-w-[420px] rounded-lg border border-navy-700 bg-navy-900 p-8">
        {children}
      </div>
    </div>
  );
}
