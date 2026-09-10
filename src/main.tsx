import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';
import { LegacyHubPage } from './LegacyHubPage';
import { LegacyGamePage } from './LegacyGamePage';

function Root() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  if (path === '/blog') return <LegacyHubPage kind="blog" />;
  if (path.startsWith('/blog/')) {
    const slug = path.slice('/blog/'.length).split('/')[0];
    return <LegacyHubPage kind="blog" slug={slug} />;
  }

  if (path === '/games') return <LegacyHubPage kind="games" />;
  if (path === '/games/flappy-bird') return <LegacyGamePage game="flappy-bird" />;
  if (path.startsWith('/games/')) return <LegacyHubPage kind="games" />;

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
