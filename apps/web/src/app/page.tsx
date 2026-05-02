import Link from 'next/link';
import { Card, Badge } from '@radar/ui';

export default function HomePage() {
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 1.5rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Badge variant="info">M244 · Veille stratégique</Badge>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.75rem', marginBottom: '0.5rem' }}>
          RADAR
        </h1>
        <p style={{ color: 'var(--radar-fg-secondary)', fontSize: '1.125rem', maxWidth: 640 }}>
          Plateforme de veille stratégique multi-agents : collecte, évaluation CRAAP,
          analyses SWOT/PESTEL, détection de signaux faibles et synthèse rédigée.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        <Card title="Collecteur">
          Génère des requêtes diversifiées et collecte les sources pertinentes.
        </Card>
        <Card title="Évaluateur CRAAP">
          Note chaque source sur 5 critères : Currency, Relevance, Authority, Accuracy, Purpose.
        </Card>
        <Card title="Analystes SWOT & PESTEL">
          Produisent les matrices stratégiques à partir du corpus filtré.
        </Card>
        <Card title="Signaux faibles">
          Détecte les indices émergents et les classe par intensité et horizon.
        </Card>
        <Card title="Rédacteur">
          Synthétise le rapport final en français, structuré pour décideur.
        </Card>
      </section>

      <Link
        href="/rapports"
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          background: 'var(--radar-accent-primary)',
          color: '#fff',
          borderRadius: 'var(--radar-radius-md)',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Voir les rapports →
      </Link>
    </main>
  );
}
