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

## SEO and discovery

The production build performs a TypeScript check, builds assets, generates static route documents with unique title, description and canonical tags, emits per-page WebPage/ProfilePage JSON-LD, and writes a canonical XML sitemap covering indexable public routes and journal entries. Google and Bing can use the same standard `/sitemap.xml`, declared in `/robots.txt`; the HTML `/site-map/` is for visitors, and `/llms.txt` is a supplemental AI-readable overview (not a guarantee that any engine or AI service will index the site).

Social sharing metadata uses Open Graph tags and Twitter/X card tags with a dedicated 1200×630 JPEG banner, alongside each page’s title and description. Facebook and WhatsApp may display a rich preview when their crawlers can fetch the metadata and image; Instagram generally does not render rich link previews in ordinary captions. Share previews may be cached by each service.

## Security checks

The content audit validates known channel IDs and playlist IDs, checks HTTPS social URLs, protects the campaign registry, and checks that no hard-coded statistics fallback has returned.

CI also runs a production build and an npm vulnerability audit at the high severity threshold. GitHub Pages hosts public static content; it is not a private backend. Never put secrets or privileged API credentials in client-side code or public repository files. A meta Content Security Policy is included as a browser-side baseline; response-header controls still depend on the hosting layer.

## Local development

Install packages with npm install, then start the development server with npm run dev.

For a production build, run npm run build. To inspect the generated output locally, run npm run preview.

## Deployment

The rebuild/premium-creator-studio branch is intended for review. The production deploy workflow runs only from main; merge only after reviewing the page routes, accessibility, build status and security checks. Keep the custom domain configuration (CNAME) intact.


## Failure and availability fallback

- `public/404.html` is the branded missing-page response GitHub Pages can serve for missing URLs.
- `public/503.html` is a branded temporary-unavailability screen for hosts that support custom HTTP 503 documents, and is also available as a direct static URL.
- `public/runtime-fallback.js` detects a failed main bundle or a stalled app boot and replaces pre-rendered content with a recovery screen. A React error boundary handles rendering exceptions inside the app.
- Limitation: a static GitHub Pages site cannot guarantee delivery of its own error page when GitHub Pages, DNS, TLS, or the origin network itself is unavailable. A full-host outage requires an independent status page / uptime monitor on a separate host and DNS name.

## Original creator branding

The header, footer, hero artwork, favicon and social-share preview use the original UltraOP mascot artwork supplied by the creator. Open Graph and Twitter/X metadata provide the page title, description, canonical URL and original mascot image for supported link-preview crawlers.
