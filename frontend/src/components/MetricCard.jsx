export default function MetricCard({ label, value }) {
  return (
    <div className="metric-card">
      <span className="metric-card__value">{value}</span>
      <span className="metric-card__label">{label}</span>
      <style>{`
        .metric-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-top: 3px solid var(--accent);
          border-radius: var(--radius);
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .metric-card__value {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 600;
        }
        .metric-card__label {
          font-size: var(--fs-small);
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
