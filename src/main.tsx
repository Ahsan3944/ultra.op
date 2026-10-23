import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import RuntimeErrorBoundary from './RuntimeErrorBoundary';
import UltraOPStudio from './UltraOPStudio';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('UltraOP root element was not found.');

const path = window.location.pathname.replace(/\/+$/, '') || '/';

if (path === '/blog' || path.startsWith('/blog/')) {
  window.location.replace('/journal/');
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <RuntimeErrorBoundary>
        <UltraOPStudio />
      </RuntimeErrorBoundary>
    </StrictMode>
  );
}
