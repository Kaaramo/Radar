import type { ReactNode } from 'react';

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; fg: string; border: string }> = {
  neutral: { bg: 'var(--radar-bg-overlay)', fg: 'var(--radar-fg-secondary)', border: 'var(--radar-border-default)' },
  success: { bg: 'rgba(63, 185, 80, 0.15)', fg: 'var(--radar-accent-success)', border: 'rgba(63, 185, 80, 0.4)' },
  warning: { bg: 'rgba(210, 153, 34, 0.15)', fg: 'var(--radar-accent-warning)', border: 'rgba(210, 153, 34, 0.4)' },
  danger: { bg: 'rgba(248, 81, 73, 0.15)', fg: 'var(--radar-accent-danger)', border: 'rgba(248, 81, 73, 0.4)' },
  info: { bg: 'rgba(0, 113, 197, 0.15)', fg: 'var(--radar-accent-secondary)', border: 'rgba(0, 113, 197, 0.4)' },
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

export const Badge = ({ variant = 'neutral', children }: BadgeProps) => {
  const s = VARIANT_STYLES[variant];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.125rem 0.5rem',
        fontSize: '0.75rem',
        fontWeight: 500,
        borderRadius: 'var(--radar-radius-sm)',
        background: s.bg,
        color: s.fg,
        border: `1px solid ${s.border}`,
      }}
    >
      {children}
    </span>
  );
};
