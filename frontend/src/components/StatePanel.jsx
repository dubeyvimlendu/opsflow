// Shared loading / empty / error presentation used by any page that
// fetches from the API, so each page doesn't re-implement the same states.
export default function StatePanel({ variant = 'default', title, children }) {
  return (
    <div className={'state-panel' + (variant === 'error' ? ' state-panel--error' : '')}>
      {title && <h2>{title}</h2>}
      {children}
      <style>{`
        .state-panel {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: var(--space-6);
          max-width: 480px;
        }
        .state-panel h2 {
          font-size: var(--fs-h3);
          margin-bottom: var(--space-2);
        }
        .state-panel p {
          color: var(--text-muted);
          font-size: var(--fs-small);
        }
        .state-panel--error {
          border-top: 3px solid var(--danger);
        }
        .state-panel--error h2 {
          color: var(--danger);
        }
      `}</style>
    </div>
  );
}
