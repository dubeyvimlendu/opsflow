import { NavLink } from 'react-router-dom';

// Only Dashboard is a real, wired-up route in Stage 1. The rest are
// listed so the shell reads like the finished product, but they are
// visibly inactive rather than pretending to lead somewhere real.
const NAV_ITEMS = [
  { label: 'Dashboard', to: '/', active: true },
  { label: 'Employee Directory', to: '/employees', active: true },
  { label: 'Import Center', to: '/import', active: true },
  { label: 'Reports', to: '/reports', active: true },
  { label: 'Insights', to: '/insights', active: false },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__mark">OF</span>
        <div>
          <div className="sidebar__name">OpsFlow</div>
          <div className="sidebar__tagline">Operational data, in order</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) =>
          item.active ? (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                'sidebar__link' + (isActive ? ' sidebar__link--active' : '')
              }
            >
              {item.label}
            </NavLink>
          ) : (
            <span key={item.to} className="sidebar__link sidebar__link--disabled" aria-disabled="true">
              {item.label}
              <span className="sidebar__soon">Soon</span>
            </span>
          )
        )}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__status-dot" aria-hidden="true" />
        <span>Backend: live</span>
      </div>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          flex-shrink: 0;
          background: var(--bg-sidebar);
          color: var(--text-on-sidebar);
          display: flex;
          flex-direction: column;
          padding: var(--space-5) var(--space-4);
          height: 100%;
        }
        .sidebar__brand {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding-bottom: var(--space-5);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: var(--space-5);
        }
        .sidebar__mark {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.9rem;
          background: var(--accent);
          color: #fff;
          width: 34px;
          height: 34px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .sidebar__name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1rem;
          color: #fff;
        }
        .sidebar__tagline {
          font-size: var(--fs-micro);
          color: var(--text-on-sidebar-muted);
          margin-top: 2px;
        }
        .sidebar__nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }
        .sidebar__link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-3) var(--space-3);
          border-radius: var(--radius-sm);
          font-size: var(--fs-body);
          color: var(--text-on-sidebar);
          text-decoration: none;
          transition: background-color 120ms ease;
        }
        .sidebar__link:hover {
          background: var(--bg-sidebar-hover);
        }
        .sidebar__link--active {
          background: var(--accent-strong);
          color: #fff;
          font-weight: 500;
        }
        .sidebar__link--disabled {
          color: var(--text-on-sidebar-muted);
          cursor: default;
        }
        .sidebar__link--disabled:hover {
          background: transparent;
        }
        .sidebar__soon {
          font-size: 0.65rem;
          border: 1px solid rgba(255,255,255,0.15);
          padding: 1px 6px;
          border-radius: 999px;
        }
        .sidebar__footer {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--fs-micro);
          color: var(--text-on-sidebar-muted);
          padding-top: var(--space-4);
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .sidebar__status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
        }
      `}</style>
    </aside>
  );
}
