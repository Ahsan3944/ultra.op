import { Component, StrictMode, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import UltraOPStudio from './UltraOPStudio';

type BoundaryProps = { children: ReactNode };
type BoundaryState = { hasError: boolean };

class AppErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  componentDidMount() {
    document.documentElement.dataset.ultraopAppReady = 'true';
  }

  componentDidUpdate() {
    document.documentElement.dataset.ultraopAppReady = 'true';
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    document.documentElement.dataset.ultraopAppReady = 'true';
    console.error('UltraOP app rendering failed.', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="uos-runtime-fallback" role="alert">
          <div className="uos-runtime-fallback-card">
            <p className="uos-runtime-fallback-code">500 / TEMPORARY APP ERROR</p>
            <h1>This page couldn’t load.</h1>
            <p>A temporary problem stopped this page from rendering. Your link may still be correct. Try again, or use one of the official routes below.</p>
            <nav aria-label="Recovery options">
              <a className="uos-runtime-fallback-primary" href={window.location.href}>Try again</a>
              <a href="/">UltraOP home</a>
              <a href="/channels/">Official channels</a>
              <a href="/503.html">Temporary issue information</a>
            </nav>
            <p className="uos-runtime-fallback-note">If the problem continues, return later. This recovery screen does not mean your account or device is at fault.</p>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('UltraOP root element was not found.');

const root = createRoot(rootElement);
const path = window.location.pathname.replace(/\/+$/, '') || '/';

if (path === '/blog' || path.startsWith('/blog/')) {
  document.documentElement.dataset.ultraopAppReady = 'true';
  window.location.replace('/journal/');
} else {
  root.render(
    <StrictMode>
      <AppErrorBoundary>
        <UltraOPStudio />
      </AppErrorBoundary>
    </StrictMode>
  );
}
