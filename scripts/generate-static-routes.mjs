import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const template = await readFile(path.join(dist, 'index.html'), 'utf8');

const pages = [
  { path: '/', title: 'UltraOP — Sk Ahsan Ahmad | Official Gaming Creator', description: 'The official website of UltraOP (Sk Ahsan Ahmad), an Indian gaming creator and streamer. Explore Minecraft, the creator journey, official channels and brand collaborations.' },
  { path: '/about/', title: 'About UltraOP — Sk Ahsan Ahmad | Gaming Creator Journey', description: 'Discover the UltraOP creator journey from PUBG and Free Fire to Rooter streaming, YouTube, Minecraft, community building and technology projects.' },
  { path: '/channels/', title: 'Official Channels — UltraOP | YouTube, Minecraft & Gaming', description: 'Find the official UltraOP YouTube channels, their focus, public links and current channel statistics when a public data source is available.' },
  { path: '/live/', title: 'Watch UltraOP Live — YouTube, Twitch, Kick & Rooter', description: 'Open UltraOP’s official streaming destinations on YouTube, Twitch, Kick and Rooter. Stream availability is determined by each platform.' },
  { path: '/community/', title: 'UltraOP Community — Official Social Media & Streaming Links', description: 'Find UltraOP’s official Instagram profiles, YouTube channels, Twitch, Kick, Rooter, Discord and WhatsApp community channel.' },
  { path: '/work/', title: 'Brand Collaborations — UltraOP | Creator Partnerships', description: 'Explore selected brand and campaign records from UltraOP’s gaming creator journey and contact UltraOP for business collaborations.' },
  { path: '/contact/', title: 'Contact UltraOP — Business, Sponsorships & Collaborations', description: 'Contact UltraOP / Sk Ahsan Ahmad for sponsorships, creator campaigns, brand partnerships and professional enquiries.' },
  { path: '/journal/', title: 'UltraOP Journal — Gaming, Streaming & Creator Journey', description: 'Read the UltraOP creator timeline: competitive gaming, PUBG, Rooter, Free Fire, YouTube, Minecraft, community roles and technology projects.' },
  { path: '/assets/', title: 'UltraOP Creator Toolkit — Published Assets & Resources', description: 'Check the public resources and creator toolkit status for UltraOP. Only assets that are actually published will be listed.', noindex: true },
  { path: '/fan-art/', title: 'UltraOP Fan Art — Community Creations', description: 'The official home for UltraOP fan-art updates and community creations.', noindex: true },
  { path: '/support/', title: 'Support UltraOP — Official Creator Links', description: 'Find official ways to follow and support UltraOP’s gaming content and creator projects.', noindex: true },
  { path: '/privacy.html', title: 'Privacy Policy — UltraOP', description: 'How the UltraOP official creator website handles requests, technical information, external platform links and public channel data.' },
  { path: '/cookie-policy.html', title: 'Cookie Policy — UltraOP', description: 'Cookies, browser storage and third-party requests used by the UltraOP official creator website.' },
  { path: '/terms.html', title: 'Terms & Conditions — UltraOP', description: 'Terms for using the official UltraOP creator website, content, links, projects and contact options.' }
];

const source = await readFile(path.resolve('src/data/journal.ts'), 'utf8');
const journalPattern = /\{\s*slug:\s*'([^']+)',\s*eyebrow:\s*'([^']*)',\s*title:\s*'([^']+)',\s*summary:\s*'([^']+)'/g;
for (const match of source.matchAll(journalPattern)) {
  const slug = match[1];
  const title = match[3];
  const summary = match[4];
  pages.push({
    path: '/journal/' + slug + '/',
    title: title + ' | UltraOP Journal',
    description: summary
  });
}

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function upsertMeta(html, selectorAttribute, selectorValue, tag) {
  const escaped = selectorValue.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
  const pattern = new RegExp('<meta\\b(?=[^>]*\\b' + selectorAttribute + '="' + escaped + '")[^>]*>', 'i');
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', '  ' + tag + '\n</head>');
}

function createPageHtml(page) {
  const canonical = 'https://ultraop.in' + page.path;
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, '<title>' + escapeAttr(page.title) + '</title>');
  html = upsertMeta(html, 'name', 'description', '<meta name="description" content="' + escapeAttr(page.description) + '" />');
  html = upsertMeta(html, 'property', 'og:title', '<meta property="og:title" content="' + escapeAttr(page.title) + '" />');
  html = upsertMeta(html, 'property', 'og:description', '<meta property="og:description" content="' + escapeAttr(page.description) + '" />');
  html = upsertMeta(html, 'property', 'og:url', '<meta property="og:url" content="' + escapeAttr(canonical) + '" />');
  html = upsertMeta(html, 'name', 'twitter:title', '<meta name="twitter:title" content="' + escapeAttr(page.title) + '" />');
  html = upsertMeta(html, 'name', 'twitter:description', '<meta name="twitter:description" content="' + escapeAttr(page.description) + '" />');
  const canonicalPattern = /<link\b(?=[^>]*\brel="canonical")[^>]*>/i;
  const canonicalTag = '<link rel="canonical" href="' + escapeAttr(canonical) + '" />';
  html = canonicalPattern.test(html) ? html.replace(canonicalPattern, canonicalTag) : html.replace('</head>', '  ' + canonicalTag + '\n</head>');
  if (page.noindex) html = upsertMeta(html, 'name', 'robots', '<meta name="robots" content="noindex, follow" />');
  const schema = {
    '@context': 'https://schema.org',
    '@type': page.path === '/' ? 'ProfilePage' : 'WebPage',
    '@id': canonical + '#page',
    url: canonical,
    name: page.title,
    description: page.description,
    isPartOf: { '@id': 'https://ultraop.in/#website' }
  };
  return html.replace('</head>', '  <script type="application/ld+json">' + JSON.stringify(schema) + '</script>\n</head>');
}

for (const page of pages) {
  if (page.path.endsWith('.html')) continue; // Public legal pages are standalone documents in /public.
  const relativeFile = page.path === '/' ? 'index.html' : path.join(page.path.replace(/^\/|\/$/g, ''), 'index.html');
  const destination = path.join(dist, relativeFile);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, createPageHtml(page), 'utf8');
}

const legacyBlogRoutes = [
  '/blog/',
  '/blog/top-freefire-strategies/',
  '/blog/grow-as-gaming-creator/',
  '/blog/freefire-redeem-codes-jun-2023/',
  '/blog/online-gaming-act-2025/'
];
for (const route of legacyBlogRoutes) {
  const destination = path.join(dist, route.replace(/^\/|\/$/g, ''), 'index.html');
  await mkdir(path.dirname(destination), { recursive: true });
  const canonical = 'https://ultraop.in/journal/';
  const redirectHtml = template
    .replace(/<title>[\s\S]*?<\/title>/i, '<title>UltraOP Journal — Redirecting</title>')
    .replace(/<link\b(?=[^>]*\brel="canonical")[^>]*>/i, '<link rel="canonical" href="' + canonical + '" />')
    .replace('</head>', '<meta name="robots" content="noindex,follow" /><meta http-equiv="refresh" content="0;url=/journal/" /></head>')
    .replace('<div id="root"></div>', '<main style="padding:3rem;font-family:system-ui;color:#f1eee7;background:#090a0c;min-height:100vh"><h1>Moved to the UltraOP Journal</h1><p>This archive has moved to the creator journal.</p><a href="/journal/">Open the UltraOP Journal</a></main>');
  await writeFile(destination, redirectHtml, 'utf8');
}

const sitemapPaths = pages.filter((page) => !page.noindex).map((page) => page.path);
const uniquePaths = [...new Set(sitemapPaths)];
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  uniquePaths.map((route) => '  <url><loc>https://ultraop.in' + route + '</loc></url>').join('\n') +
  '\n</urlset>\n';
await writeFile(path.join(dist, 'sitemap.xml'), sitemap, 'utf8');

console.log('Generated ' + pages.length + ' static route documents and a sitemap with ' + uniquePaths.length + ' canonical URLs.');
