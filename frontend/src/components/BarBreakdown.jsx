// Renders a titled panel of horizontal bars from {label, count} rows.
// Used for Dashboard's department/status breakdowns and, in Stage 3,
// for Reports' salary distribution, joining trends, and status charts.
export default function BarBreakdown({ title, rows, emptyMessage = 'No data yet.' }) {
  const max = rows.length ? Math.max(...rows.map((r) => r.count)) : 1;

  return (
    <div className="breakdown">
      <h2 className="breakdown__title">{title}</h2>
      {rows.length === 0 ? (
        <p className="breakdown__empty">{emptyMessage}</p>
      ) : (
        <ul className="breakdown__list">
          {rows.map(({ label, count }) => (
            <li key={label} className="breakdown__row">
              <div className="breakdown__row-top">
                <span>{label}</span>
                <span className="breakdown__count">{count}</span>
              </div>
              <div className="breakdown__track">
                <div className="breakdown__fill" style={{ width: `${(count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
      <style>{`
        .breakdown {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: var(--space-5);
        }
        .breakdown__title {
          font-size: var(--fs-h3);
          margin-bottom: var(--space-4);
        }
        .breakdown__empty {
          color: var(--text-muted);
          font-size: var(--fs-small);
        }
        .breakdown__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .breakdown__row-top {
          display: flex;
          justify-content: space-between;
          font-size: var(--fs-small);
          margin-bottom: var(--space-1);
        }
        .breakdown__count {
          color: var(--text-muted);
        }
        .breakdown__track {
          height: 6px;
          background: var(--accent-soft);
          border-radius: 999px;
          overflow: hidden;
        }
        .breakdown__fill {
          height: 100%;
          background: var(--accent);
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}
