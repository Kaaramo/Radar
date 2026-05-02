import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: ReactNode;
}

export const Card = ({ title, children, style, ...rest }: CardProps) => (
  <div
    style={{
      background: 'var(--radar-bg-raised)',
      border: '1px solid var(--radar-border-subtle)',
      borderRadius: 'var(--radar-radius-lg)',
      padding: '1rem 1.25rem',
      color: 'var(--radar-fg-primary)',
      ...style,
    }}
    {...rest}
  >
    {title ? (
      <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--radar-fg-secondary)', margin: 0, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </h3>
    ) : null}
    {children}
  </div>
);
