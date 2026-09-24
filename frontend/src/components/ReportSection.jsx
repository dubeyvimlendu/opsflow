import StatePanel from './StatePanel';

export default function ReportSection({ title, loading, error, isEmpty, emptyMessage, children }) {
  return (
    <section className="report-section">
      <h2 className="report-section__title">{title}</h2>

      {error ? (
        <StatePanel variant="error" title="Couldn’t load this report">
          <p>{String(error)}</p>
        </StatePanel>
      ) : loading ? (
        <StatePanel>
          <p>Loading…</p>
        </StatePanel>
      ) : isEmpty ? (
        <StatePanel title="No data yet">
          <p>{emptyMessage || 'Nothing to show for this report yet.'}</p>
        </StatePanel>
      ) : (
        children
      )}

      <style>{`
        .report-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .report-section__title {
          font-size: var(--fs-h2);
        }
      `}</style>
    </section>
  );
}
