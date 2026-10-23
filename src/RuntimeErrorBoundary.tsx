import { Component, type ErrorInfo, type ReactNode } from 'react';

type RuntimeErrorBoundaryProps = { children: ReactNode };
type RuntimeErrorBoundaryState = { hasError: boolean };

/**
 * Keeps a branded recovery path visible when a page component throws during render.
 * The static HTML is useful to crawlers before React starts; this boundary protects
 * visitors after React replaces that pre-rendered markup.
 */
export default class RuntimeErrorBoundary extends Component<RuntimeErrorBoundaryProps, RuntimeErrorBoundaryState> {
  state: RuntimeErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RuntimeErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Preserve the diagnostic in developer tools without exposing internals to site visitors.
    console.error('UltraOP page render failed.', error, info.componentStack);
  }

  private retryPage = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="uos-runtime-error" role="alert" aria-labelledby="uos-runtime-error-title">
          <div className="uos-runtime-error-inner">
            <p className="uos-runtime-error-kicker">ULTRAOP / RECOVERY MODE</p>
            <p className="uos-runtime-error-code">PAGE LOAD INTERRUPTED</p>
            <h1 id="uos-runtime-error-title">This page couldn’t finish loading.</h1>
            <p className="uos-runtime-error-copy">
              The page ran into a problem while opening. Retry once, or use the links below to continue
              without getting stuck on this screen.
            </p>
            <div className="uos-runtime-error-actions">
              <button type="button" onClick={this.retryPage}>Try again</button>
              <a href="/">Go to homepage <span aria-hidden="true">↗</span></a>
              <a href="/guides/">Browse gaming guides <span aria-hidden="true">↗</span></a>
              <a href="/contact/">Contact / report a broken page <span aria-hidden="true">↗</span></a>
            </div>
            <p className="uos-runtime-error-note">
              If the same page keeps failing, use a different link and report the page address so the issue
              can be reproduced and fixed.
            </p>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
