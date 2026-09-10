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

function installHomepageEnhancements() {
  if (window.location.pathname.replace(/\/+$/, '') !== '') return;
  const start = () => {
    const root = document.getElementById('root');
    if (!root) return;
    let activeListener: (() => void) | null = null;
    let applied = false;
    const apply = () => {
      const cards = Array.from(document.querySelectorAll<HTMLIFrameElement>('.channel-video-card iframe'));
      const liveChannelId = 'UCAxlmL3_721xzOjQVe5Klbg';
      const liveFrame = cards[0];
      if (liveFrame && liveFrame.dataset.liveOnly !== 'true') {
        liveFrame.src = `https://www.youtube.com/embed/live_stream?channel=${liveChannelId}&rel=0&modestbranding=1`;
        liveFrame.dataset.liveOnly = 'true';
        liveFrame.title = 'Ultra OP Live — current live stream';
      }

      if (applied) return;
      const navButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.desktop-nav button'));
      const ids = ['home', 'channels', 'live', 'story', 'community', 'journal', 'contact'];
      navButtons.forEach((button, index) => button.dataset.section = ids[index] ?? '');
      const sections = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
      const updateActive = () => {
        const marker = window.scrollY + Math.min(window.innerHeight * 0.35, 280);
        let current = sections[0]?.id ?? 'home';
        for (const section of sections) if (section.offsetTop <= marker) current = section.id;
        navButtons.forEach(button => button.classList.toggle('is-active', button.dataset.section === current));
      };
      updateActive();
      window.addEventListener('scroll', updateActive, { passive: true });
      activeListener = () => window.removeEventListener('scroll', updateActive);
      applied = true;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(root, { childList: true, subtree: true });
    window.setTimeout(apply, 250);
    window.addEventListener('beforeunload', () => {
      observer.disconnect();
      activeListener?.();
    }, { once: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
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

installHomepageEnhancements();
