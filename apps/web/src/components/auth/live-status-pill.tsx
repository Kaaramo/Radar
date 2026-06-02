/**
 * Status pill « EN DIRECT — Cycle quotidien · 06:00 ».
 * Server component statique (le dot pulsant est en pure CSS).
 */
export function LiveStatusPill() {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-navy-700 bg-navy-800/60 px-3 py-1.5 backdrop-blur-sm">
      <span className="relative flex size-2 items-center justify-center">
        <span className="absolute inline-flex size-2 rounded-full bg-royal live-pulse" />
      </span>
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
        EN DIRECT
      </span>
      <span className="h-3 w-px bg-navy-700" aria-hidden="true" />
      <span className="font-mono text-[11px] tracking-[0.04em] text-muted-soft">
        Cycle quotidien
      </span>
    </div>
  );
}
