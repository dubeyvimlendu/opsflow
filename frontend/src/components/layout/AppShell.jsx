import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppShell({ title, subtitle, children }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className={'app-shell__sidebar' + (navOpen ? ' app-shell__sidebar--open' : '')}>
        <Sidebar />
      </div>

      {navOpen && (
        <button
          className="app-shell__scrim"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
        />
      )}

      <div className="app-shell__main">
        <Header title={title} subtitle={subtitle} onMenuClick={() => setNavOpen((v) => !v)} />
        <main className="app-shell__content">{children}</main>
      </div>

      <style>{`
        .app-shell {
          display: flex;
          height: 100vh;
        }
        .app-shell__main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .app-shell__content {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-6);
        }
        .app-shell__scrim {
          display: none;
        }
        @media (max-width: 880px) {
          .app-shell__sidebar {
            position: fixed;
            inset: 0 auto 0 0;
            z-index: 20;
            transform: translateX(-100%);
            transition: transform 160ms ease;
          }
          .app-shell__sidebar--open {
            transform: translateX(0);
          }
          .app-shell__scrim {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(16, 40, 33, 0.35);
            border: none;
            z-index: 15;
          }
          .app-shell__content {
            padding: var(--space-4);
          }
        }
      `}</style>
    </div>
  );
}
