# UltraOP — Official Creator Website

Production website for UltraOP / Sk Ahsan Ahmad. The rebuild focuses on a premium, responsive creator portfolio with clear channel information, selected campaign records, community destinations and a creator journal.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4 (existing project tooling)
- GSAP + ScrollTrigger for scoped motion
- Lucide React
- GitHub Actions and GitHub Pages

## Data integrity

- Official YouTube channel IDs and upload playlist IDs remain in src/data/core.ts.
- Social, streaming, business and campaign records are centralised in the same registry.
- The new site does not use hard-coded fallback subscriber or view counts. Channel counts are displayed only when the public endpoint returns a valid reading; third-party estimates are labelled.
- Brand records are shown without unverified performance claims.
- Visitor-facing pages do not expose API keys, tokens or private configuration.
- The Channels page calls the public SocialCounts endpoint; see the Privacy and Cookie Policies for its data disclosure.

## SEO

The production build performs a TypeScript check, builds assets, generates static route documents with unique title, description and canonical tags, emits per-page WebPage/ProfilePage JSON-LD, and writes a sitemap based on published routes and journal entries.

## Security checks

The content audit validates known channel IDs and playlist IDs, checks HTTPS social URLs, protects the campaign registry, and checks that no hard-coded statistics fallback has returned.

CI also runs a production build and an npm vulnerability audit at the high severity threshold. GitHub Pages hosts public static content; it is not a private backend. Never put secrets or privileged API credentials in client-side code or public repository files. A meta Content Security Policy is included as a browser-side baseline; response-header controls still depend on the hosting layer.

## Local development

Install packages with npm install, then start the development server with npm run dev.

For a production build, run npm run build. To inspect the generated output locally, run npm run preview.

## Deployment

The rebuild/premium-creator-studio branch is intended for review. The production deploy workflow runs only from main; merge only after reviewing the page routes, accessibility, build status and security checks. Keep the custom domain configuration (CNAME) intact.
