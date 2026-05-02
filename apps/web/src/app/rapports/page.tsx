import { Card, Badge } from '@radar/ui';

export default function RapportsPage() {
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Rapports</h1>
      <Card>
        <p style={{ color: 'var(--radar-fg-secondary)' }}>
          Aucun rapport pour l&apos;instant. <Badge variant="info">À implémenter</Badge>
        </p>
      </Card>
    </main>
  );
}
