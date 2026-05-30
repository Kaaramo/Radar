import type { ReactNode } from "react";

export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return <div className="fade-mount min-h-dvh bg-navy">{children}</div>;
}
