import { Card } from '@radar/ui';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RapportDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Rapport {id}</h1>
      <Card>
        <p style={{ color: 'var(--radar-fg-secondary)' }}>
          Vue détail à brancher sur l&apos;API agent (statut, sources, SWOT, PESTEL, signaux, synthèse).
        </p>
      </Card>
    </main>
  );
}
