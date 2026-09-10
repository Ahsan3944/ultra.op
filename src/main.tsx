import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';
import { LegacyHubPage } from './LegacyHubPage';

function Root() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  if (path === '/blog') return <LegacyHubPage kind="blog" />;
  if (path.startsWith('/blog/')) {
    const slug = path.slice('/blog/'.length).split('/')[0];
    return <LegacyHubPage kind="blog" slug={slug} />;
  }

  if (path === '/games' || path.startsWith('/games/')) {
    return <LegacyHubPage kind="games" />;
  }

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
