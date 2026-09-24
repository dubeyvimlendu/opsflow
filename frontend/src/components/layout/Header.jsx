export default function Header({ title, subtitle, onMenuClick }) {
  return (
    <header className="app-header">
      <button
        type="button"
        className="app-header__menu"
        onClick={onMenuClick}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
        <span />
      </button>

      <div className="app-header__titles">
        <h1 className="app-header__title">{title}</h1>
        {subtitle && <p className="app-header__subtitle">{subtitle}</p>}
      </div>

      <style>{`
        .app-header {
          height: var(--header-height);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: 0 var(--space-6);
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 5;
        }
        .app-header__menu {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
          width: 32px;
          height: 32px;
          background: transparent;
          border: none;
          padding: 0;
        }
        .app-header__menu span {
          display: block;
          height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
        }
        .app-header__titles {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .app-header__title {
          font-size: var(--fs-h2);
        }
        .app-header__subtitle {
          font-size: var(--fs-small);
          color: var(--text-muted);
        }
        @media (max-width: 880px) {
          .app-header__menu {
            display: flex;
          }
          .app-header {
            padding: 0 var(--space-4);
          }
        }
      `}</style>
    </header>
  );
}
