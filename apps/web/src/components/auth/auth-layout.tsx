import type { ReactNode } from "react";

export type AuthLayoutProps = {
  form: ReactNode;
  panel: ReactNode;
};

/**
 * Split layout : formulaire à gauche (50%) + panneau branding à droite (50%).
 * Sur mobile (<900px), le panneau droit est masqué et le formulaire prend
 * la pleine largeur.
 */
export function AuthLayout({ form, panel }: AuthLayoutProps) {
  return (
    <div className="grid h-full min-h-dvh w-full grid-cols-1 bg-navy md:grid-cols-2">
      <div className="flex items-center justify-center bg-navy px-8 py-14">
        <div className="w-full max-w-[420px]">{form}</div>
      </div>
      <div className="hidden md:block">{panel}</div>
    </div>
  );
}
