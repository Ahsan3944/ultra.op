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

Social sharing metadata uses Open Graph tags and Twitter/X card tags with the published creator image, alongside each page’s title and description. A separate wide social-share banner is tracked in issue #48. Facebook and WhatsApp may display a rich preview when their crawlers can fetch the metadata and image; Instagram generally does not render rich link previews in ordinary captions. Share previews may be cached by each service.

## Security checks

The content audit validates known channel IDs and playlist IDs, checks HTTPS social URLs, protects the campaign registry, and checks that no hard-coded statistics fallback has returned.

CI also runs a production build and an npm vulnerability audit at the high severity threshold. GitHub Pages hosts public static content; it is not a private backend. Never put secrets or privileged API credentials in client-side code or public repository files. A meta Content Security Policy is included as a browser-side baseline; response-header controls still depend on the hosting layer.

## Local development

Install packages with npm install, then start the development server with npm run dev.

For a production build, run npm run build. To inspect the generated output locally, run npm run preview.

## Deployment

The rebuild/premium-creator-studio branch is intended for review. The production deploy workflow runs only from main; merge only after reviewing the page routes, accessibility, build status and security checks. Keep the custom domain configuration (CNAME) intact.


## Error handling

- The branded `public/404.html` handles missing or retired URLs on GitHub Pages.
- The site does not replace a page with a custom crash/503 recovery screen when JavaScript fails. Route-specific pre-rendered HTML remains in the page as the initial content.
- GitHub Pages is static hosting; platform-level availability, DDoS protection and response security headers are controlled by GitHub and the domain/DNS configuration, not by browser JavaScript.

## Original creator branding

The header, footer, hero artwork, favicon and social-share preview use the original UltraOP mascot artwork supplied by the creator. Open Graph and Twitter/X metadata provide the page title, description, canonical URL and original mascot image for supported link-preview crawlers.


## Gaming knowledge and search discovery

The knowledge library contains 32 long-form and reference pages, with automated coverage for all canonical routes as of 23 October 2026, data-driven from `src/data/knowledge.json`. Each entry defines a canonical route, title and description, intended search terms, category, update date, editorial illustration, article sections, key takeaways, optional result tables, external sources and related articles.

Current topic directories:
- `/guides/`: grouped how-to guides and reference articles.
- `/games/`: game-focused guides, version notes and patch coverage.
- `/esports/`: tournament histories separated by game and event series.
- `/games/minecraft/versions/`: Java Edition releases and server-version planning.
- `/games/valorant/updates/`: patch, agent, map and competitive-feature categories.

A React runtime-error boundary provides a responsive recovery screen with a working retry button and safe links to the homepage, guide library and contact page if a render fails. This protects render-time failures; a full domain, DNS or network outage still needs the hosting provider’s own fallback. The build pre-renders each knowledge route as readable HTML before the React bundle runs, emits unique page title/description/canonical tags and Article or CollectionPage JSON-LD, places every indexable route in `sitemap.xml`, and lists all entries in `llms.txt`. The content checker validates article depth, source URL scheme, route uniqueness, related links, images, canonical metadata, structured-data type, table presence and sitemap coverage.

Minecraft 26.3 is labelled stable for the 23 October 2026 update date; 26.4 is explicitly labelled snapshot/pre-release content. Tournament history pages identify the game and event series instead of mixing PUBG PC, PUBG Mobile, BGMI and Free Fire results. Every article lists source links to game publishers, event organisers or established results archives. Editorial SVG illustrations are clearly labelled as original artwork, not in-game screenshots.

Publishing helpful, accurate pages improves crawlability but cannot guarantee indexing or a specific Google ranking. Re-check dates, tournament results and official patch notes when content is refreshed. The current social-share metadata still uses the small supplied UltraOP mascot; the dedicated wide 1200×630 raster preview remains separately tracked in issue #48.
