// Renders any string value as a neutral pill. Status is an unconstrained
// backend string, so this deliberately does not color-code by value.
export default function Badge({ children }) {
  return (
    <span className="badge">
      {children}
      <style>{`
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 10px;
          border-radius: 999px;
          border: 1px solid var(--border-strong);
          background: var(--accent-soft);
          color: var(--accent-strong);
          font-size: var(--fs-micro);
          font-weight: 500;
          white-space: nowrap;
        }
      `}</style>
    </span>
  );
}
