import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './ultraop-enhancements.css';
import './ultraop-responsive.css';
import './ultraop-fixes.css';
import App from './App';
import { LegacyHubPage } from './LegacyHubPage';
import { JournalPage } from './JournalPage';

function recoverStaticHostPath() {
  const key = 'ultraop:requested-path';
  const stored = sessionStorage.getItem(key);
  if (stored && stored !== '/') {
    sessionStorage.removeItem(key);
    window.history.replaceState(null, '', stored);
  }
}

function NotFound() {
  return <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center">
    <main className="shell py-20">
      <div className="eyebrow mb-4">404 / Page not found</div>
      <h1 className="display text-[clamp(4rem,12vw,9rem)] font-extrabold">WRONG<br/><span className="text-[var(--accent)]">TURN.</span></h1>
      <p className="mt-7 max-w-xl text-base leading-8 text-[var(--muted)]">That UltraOP page does not exist. Head back to the official creator homepage or open the journal.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href="/" className="px-5 py-3.5 bg-[var(--cream)] text-black text-[11px] font-bold uppercase tracking-[.14em] inline-flex items-center gap-2"><ArrowLeft size={14}/> Back home</a>
        <a href="/journal/" className="px-5 py-3.5 border border-[var(--line)] text-[11px] font-bold uppercase tracking-[.14em]">Open journal</a>
      </div>
    </main>
  </div>;
}

function Root() {
  recoverStaticHostPath();
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  if (path === '/journal') return <JournalPage />;
  if (path === '/blog') return <LegacyHubPage kind="blog" />;
  if (path.startsWith('/blog/')) {
    const slug = path.slice('/blog/'.length).split('/')[0];
    return <LegacyHubPage kind="blog" slug={slug} />;
  }
  if (path !== '/') return <NotFound />;

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
