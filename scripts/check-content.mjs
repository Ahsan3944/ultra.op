import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const core = readFileSync('src/data/core.ts', 'utf8');
const studio = readFileSync('src/UltraOPStudio.tsx', 'utf8');
const html = readFileSync('index.html', 'utf8');
const privacy = readFileSync('public/privacy.html', 'utf8');
const mainSource = readFileSync('src/main.tsx', 'utf8');
const recoverySource = readFileSync('src/RuntimeErrorBoundary.tsx', 'utf8');
const studioCss = readFileSync('src/ultraop-studio.css', 'utf8');
const staticGenerator = readFileSync('scripts/generate-static-routes.mjs', 'utf8');
const cookiePolicy = readFileSync('public/cookie-policy.html', 'utf8');
const terms = readFileSync('public/terms.html', 'utf8');
const knowledgeArticles = JSON.parse(readFileSync('src/data/knowledge.json', 'utf8'));

const channelIds = [...core.matchAll(/\bid:\s*'([A-Za-z0-9_-]+)'/g)].map((match) => match[1]);
assert.equal(channelIds.length, 4, 'Expected exactly four official YouTube channel IDs in the source registry.');
assert.equal(new Set(channelIds).size, channelIds.length, 'YouTube channel IDs must be unique.');
channelIds.forEach((id) => assert.match(id, /^UC[A-Za-z0-9_-]{22}$/, 'Invalid YouTube channel ID: ' + id));

const playlistIds = [...core.matchAll(/uploadsPlaylist:\s*'([A-Za-z0-9_-]+)'/g)].map((match) => match[1]);
assert.equal(playlistIds.length, channelIds.length, 'Every YouTube channel must have an uploads playlist.');
assert.equal(new Set(playlistIds).size, playlistIds.length, 'Uploads playlist IDs must be unique.');
playlistIds.forEach((id) => assert.match(id, /^UU[A-Za-z0-9_-]{22}$/, 'Invalid uploads playlist ID: ' + id));

const socialUrls = [...core.matchAll(/\{ name: '[^']+', handle: '[^']+', url: '(https:\/\/[^']+)'/g)].map((match) => match[1]);
assert.ok(socialUrls.length >= 8, 'Expected official social/community destinations to remain in the registry.');
socialUrls.forEach((url) => assert.match(url, /^https:\/\/[A-Za-z0-9.-]+\//, 'Social URLs must use HTTPS: ' + url));

assert.ok(core.includes('ultraopbiz@gmail.com'), 'Business email was removed from the central registry.');
assert.ok(core.includes('Amazon') && core.includes('THE FINALS') && core.includes('Wild Stone'), 'Known campaign records are unexpectedly missing.');
assert.ok(!studio.includes('estimatedStats'), 'Do not restore a hard-coded fallback statistics object in the new website.');
assert.ok(studio.includes('subscribersEstimated'), 'Third-party estimated statistics must be explicitly distinguished from direct API values.');
assert.ok(studio.includes("'?sub_confirmation=1'"), 'Each official channel needs a direct YouTube subscribe URL.');
assert.ok(studio.includes('Subscribe to '), 'Subscribe links must have accessible channel-specific labels.');
assert.ok(studio.includes('View channel'), 'Each channel card must retain a separate channel-page link.');
assert.ok(html.includes('Content-Security-Policy'), 'A documented baseline Content Security Policy is required in the main document.');

assert.ok(html.includes('<title>UltraOP — Sk Ahsan Ahmad | Gaming Creator</title>'), 'Homepage title must present the current creator identity without outdated game-history text.');
assert.ok(html.includes('UltraOP (Sk Ahsan Ahmad) is an Indian gaming creator. Explore gaming videos, Minecraft stories, live streams and official links to YouTube, Twitch, Rooter and Instagram.'), 'Homepage description must reflect the current general gaming creator identity and active platforms.');
assert.ok(!html.includes('Explore Minecraft, the creator journey, official channels and brand collaborations.') && !html.includes('PUBG esports roots, Rooter streaming and moderation, Free Fire'), 'Homepage metadata must not lead with outdated individual-game/history snippets.');
assert.ok(staticGenerator.includes("title: 'UltraOP — Sk Ahsan Ahmad | Gaming Creator'") && staticGenerator.includes('Minecraft stories, live streams and official links to YouTube, Twitch, Rooter and Instagram.'), 'Generated homepage metadata must match the current HTML template.');
const headerStart = studio.indexOf('function SiteHeader({ route }: { route: string }) {');
const headerEnd = studio.indexOf('\nfunction SectionHeading', headerStart);
const headerSource = headerStart >= 0 && headerEnd > headerStart ? studio.slice(headerStart, headerEnd) : '';
assert.ok(headerSource.includes('uos-nav-dropdown-menu') && headerSource.includes('Explore <ChevronDown') && headerSource.includes("href: '/games/'") && headerSource.includes("href: '/guides/'") && headerSource.includes("href: '/esports/'"), 'Explore must expose distinct Games, Guides and Esports destinations in one dropdown.');
assert.equal((headerSource.match(/Explore <ChevronDown/g) ?? []).length, 1, 'Only one Explore dropdown should appear in the header navigation.');
assert.ok(headerSource.includes("label: 'Community'") && headerSource.includes("label: 'Journal'") && headerSource.includes("label: 'Brand work'"), 'Community, Journal and Brand work must remain distinct navigation items.');
assert.ok(headerSource.includes("className={item.active ? 'is-active' : undefined}"), 'Navigation should indicate the current section accessibly.');
assert.ok(studioCss.includes('.uos-desktop-nav a::after') && studioCss.includes('.uos-nav-dropdown-menu') && studioCss.includes('@keyframes uos-header-enter') && studioCss.includes('prefers-reduced-motion:reduce'), 'Header effects and dropdown must respect reduced-motion preferences.');

assert.ok(html.includes('twitter:card') && html.includes('content="summary"') && !html.includes('summary_large_image') && html.includes('twitter:image'), 'Social cards must use the compact mascot thumbnail and page title/description.');
assert.ok(html.includes('https://ultraop.in/brand/ultraop-original.webp'), 'Social preview metadata must point at the dedicated published share-card image.');
assert.ok(html.includes('og:image:width') && html.includes('142') && html.includes('161') && html.includes('image/webp'), 'Open Graph image dimensions and MIME type must match the published WEBP logo asset.');
assert.ok(staticGenerator.includes('og:image:secure_url') && staticGenerator.includes('content="image/webp"') && staticGenerator.includes('content="summary"'), 'Every generated route must keep social image metadata consistent.');
assert.ok(html.includes('https://ultraop.in/brand/ultraop-original.webp') && html.includes('og:image:secure_url'), 'Homepage share-preview must use a published official logo URL.');
assert.ok(!html.includes('ultraop-social-share.jpg'), 'Do not publish references to an unbuilt social image asset.');
assert.ok(html.includes('/brand/ultraop-original.webp'), 'Favicons/touch icons must use the original supplied UltraOP logo.');
assert.ok(studio.includes('/brand/ultraop-original.webp'), 'Header, footer and hero artwork must use the original supplied logo.');
assert.ok(readFileSync('public/site.webmanifest', 'utf8').includes('/brand/ultraop-original.webp'), 'Web app manifest must use the supplied original logo.');
assert.ok(!html.includes('/runtime-fallback.js'), 'The main document must not inject the runtime crash fallback.');
assert.ok(mainSource.includes('<RuntimeErrorBoundary>') && mainSource.includes('./RuntimeErrorBoundary'), 'React rendering must be protected by the runtime recovery boundary.');
assert.ok(recoverySource.includes('Try again') && recoverySource.includes('window.location.reload()'), 'Recovery screen must provide a working retry action.');
assert.ok(recoverySource.includes('/guides/') && recoverySource.includes('role="alert"'), 'Recovery screen needs safe navigation and accessible error messaging.');
assert.ok(studioCss.includes('.uos-runtime-error') && studioCss.includes('@media(max-width:560px)'), 'Recovery screen must have responsive styles.');
const missingPage = readFileSync('public/404.html', 'utf8');
assert.ok(missingPage.includes('404 / PAGE NOT FOUND'), 'Keep a branded 404 for invalid or retired URLs.');
assert.ok(!missingPage.includes('/503.html'), 'The 404 page must not link to the removed temporary-unavailable screen.');
assert.ok(privacy.includes('SocialCounts'), 'Privacy notice must disclose the public statistics data provider.');
assert.ok(cookiePolicy.includes('SocialCounts'), 'Cookie notice must disclose the public statistics request.');
assert.ok(terms.includes('privacy.html') && terms.includes('cookie-policy.html'), 'Terms must link to privacy and cookie policies.');

const dist = path.resolve('dist');
const requiredFiles = [
  'index.html',
  'about/index.html',
  'channels/index.html',
  'live/index.html',
  'community/index.html',
  'work/index.html',
  'contact/index.html',
  'journal/index.html',
  'site-map/index.html',
  'journal/minecraft-transition/index.html',
  'llms.txt',
  'robots.txt',
  'brand/ultraop-original.webp',
  'knowledge/minecraft-worlds.svg',
  'knowledge/battle-royale.svg',
  'knowledge/esports-championship.svg',
  'knowledge/tactical-fps.svg',
  'knowledge/pubg-editions-comparison.svg',
  'knowledge/minecraft-java-bedrock.svg',
  'knowledge/minecraft-survival-first-day.svg',
  'knowledge/valorant-beginner.svg',
  'knowledge/esports-formats.svg',
  'knowledge/pc-performance-recording.svg',
  'privacy.html',
  'cookie-policy.html',
  'terms.html',
  '404.html',
  'blog.html',
  'sitemap.xml'
];
requiredFiles.forEach((file) => assert.ok(existsSync(path.join(dist, file)), 'Missing generated production file: dist/' + file));
assert.ok(!existsSync(path.join(dist, '503.html')), 'The removed temporary-unavailable screen must not be published.');
assert.ok(!existsSync(path.join(dist, 'runtime-fallback.js')), 'The removed runtime crash fallback must not be published.');

const staticPages = [
  ['index.html', 'https://ultraop.in/'],
  ['about/index.html', 'https://ultraop.in/about/'],
  ['channels/index.html', 'https://ultraop.in/channels/'],
  ['live/index.html', 'https://ultraop.in/live/'],
  ['community/index.html', 'https://ultraop.in/community/'],
  ['work/index.html', 'https://ultraop.in/work/'],
  ['contact/index.html', 'https://ultraop.in/contact/'],
  ['journal/index.html', 'https://ultraop.in/journal/'],
  ['site-map/index.html', 'https://ultraop.in/site-map/'],
  ['journal/minecraft-transition/index.html', 'https://ultraop.in/journal/minecraft-transition/']
];

const titles = [];
for (const [relativeFile, expectedCanonical] of staticPages) {
  const page = readFileSync(path.join(dist, relativeFile), 'utf8');
  const title = page.match(/<title>([^<]+)<\/title>/i)?.[1];
  const canonical = page.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const description = page.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  assert.ok(title, relativeFile + ' must contain a title.');
  assert.ok(description && description.length >= 50, relativeFile + ' must contain a useful meta description.');
  assert.equal(canonical, expectedCanonical, relativeFile + ' has an incorrect canonical URL.');
  assert.ok(page.includes('application/ld+json'), relativeFile + ' must contain page structured data.');
  assert.ok(page.includes('class="uos-prerender"'), relativeFile + ' must have useful initial HTML content before JavaScript runs.');
  titles.push(title);
}
assert.equal(new Set(titles).size, titles.length, 'Major static route titles must be unique.');

const sitemap = readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const sitemapEntries = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.ok(sitemapEntries.length >= 45, 'Sitemap should include main routes, legal pages, creator journal entries and new game knowledge articles.');
assert.equal(new Set(sitemapEntries).size, sitemapEntries.length, 'Sitemap entries must be unique.');
assert.ok(!sitemap.includes('/blog/'), 'Removed legacy blog URLs must not remain in the canonical sitemap.');
assert.ok(!sitemap.includes('/blog.html'), 'Legacy blog.html must not remain in the canonical sitemap.');
assert.ok(sitemap.includes('https://ultraop.in/site-map/'), 'Search-engine sitemap must include the human-readable site map.');
knowledgeArticles.forEach((article) => assert.ok(sitemap.includes('https://ultraop.in' + article.route), 'Sitemap is missing knowledge route: ' + article.route));
const llms = readFileSync(path.join(dist, 'llms.txt'), 'utf8');
assert.ok(llms.includes('## Primary pages') && llms.includes('## Creator journal'), 'AI-readable llms.txt must include primary pages and journal entries.');
['Ultra OP Live', 'Roblox UltraOP3', 'Ultra OP 2.0', 'Op Earnings'].forEach((name) => assert.ok(llms.includes(name), 'AI-readable site overview must include channel: ' + name));
assert.ok(llms.includes('https://ultraop.in/site-map/'), 'AI-readable overview must link to the site map.');
const crawlerRules = readFileSync(path.join(dist, 'robots.txt'), 'utf8');
assert.ok(crawlerRules.includes('Sitemap: https://ultraop.in/sitemap.xml'), 'robots.txt must tell search engines where the XML sitemap lives.');
const legacyBlog = readFileSync(path.join(dist, 'blog.html'), 'utf8');
assert.ok(legacyBlog.includes('noindex,follow') && legacyBlog.includes('/journal/'), 'Legacy blog.html must migrate without becoming an indexed duplicate.');
assert.ok(readFileSync(path.join(dist, 'index.html'), 'utf8').includes('Play the game. Build the story.'), 'Homepage fallback content is missing.');
['/guides/', '/games/', '/esports/', '/games/minecraft/versions/', '/games/valorant/updates/'].forEach((route) => assert.ok(readFileSync(path.join(dist, 'index.html'), 'utf8').includes(route), 'Homepage fallback is missing a knowledge hub link: ' + route));
['PUBG PC vs PUBG Mobile vs BGMI', 'Minecraft Java vs Bedrock Edition', 'Esports Tournament Formats Explained', 'PC Game Performance and Recording'].forEach((title) => assert.ok(readFileSync(path.join(dist, 'llms.txt'), 'utf8').includes(title), 'AI index is missing expanded guide: ' + title));
const channelFallback = readFileSync(path.join(dist, 'channels/index.html'), 'utf8');
['Ultra OP Live', 'Roblox UltraOP3', 'Ultra OP 2.0', 'Op Earnings'].forEach((name) => assert.ok(channelFallback.includes(name), 'Channel fallback is missing: ' + name));
assert.ok(channelFallback.includes('Subscribe — Ultra OP Live') && channelFallback.includes('sub_confirmation=1'), 'Pre-rendered channels page must include direct subscribe links.');
const siteMapFallback = readFileSync(path.join(dist, 'site-map/index.html'), 'utf8');
assert.ok(siteMapFallback.includes('Creator journal') && siteMapFallback.includes('/llms.txt') && siteMapFallback.includes('/sitemap.xml'), 'Human site map must provide journal and crawler-resource links.');
const homepageFallback = readFileSync(path.join(dist, 'index.html'), 'utf8');
['Amazon', 'THE FINALS', 'Wild Stone', 'Hero', 'Parallel Mobile', 'TVS'].forEach((name) => assert.ok(homepageFallback.includes(name), 'Campaign fallback is missing: ' + name));
['Twitch', 'Kick', 'Rooter', 'Discord', 'WhatsApp Channel'].forEach((name) => assert.ok(homepageFallback.includes(name), 'Social/community fallback is missing: ' + name));

const builtMain = readFileSync(path.join(dist, 'index.html'), 'utf8');
assert.ok(builtMain.includes("script-src 'self'"), 'Generated homepage is missing the baseline script-src policy.');
assert.ok(builtMain.includes("style-src 'self' 'unsafe-inline'"), 'Generated homepage must permit same-origin production CSS.');
assert.ok(builtMain.includes("frame-src 'none'"), 'Generated homepage must not silently allow embedded frames.');

assert.ok(knowledgeArticles.length >= 30, 'Knowledge hub should contain at least 30 curated pages.');
assert.equal(new Set(knowledgeArticles.map((article) => article.slug)).size, knowledgeArticles.length, 'Knowledge article slugs must be unique.');
assert.equal(new Set(knowledgeArticles.map((article) => article.route)).size, knowledgeArticles.length, 'Knowledge article canonical routes must be unique.');
const knownSlugs = new Set(knowledgeArticles.map((article) => article.slug));
for (const article of knowledgeArticles) {
  const articleText = [article.intro, ...(article.takeaways ?? []), ...(article.sections ?? []).flatMap((section) => [...(section.paragraphs ?? []), ...(section.bullets ?? [])])].join(' ');
  const wordCount = articleText.trim().split(/\s+/).filter(Boolean).length;
  assert.ok(wordCount >= 180, article.slug + ' is too thin; expand it beyond short placeholder copy.');
  assert.ok(Array.isArray(article.sections) && article.sections.length >= 3, article.slug + ' needs clear topic sections.');
  assert.ok(Array.isArray(article.sources) && article.sources.length >= 2, article.slug + ' needs external sources.');
  assert.ok(article.route.startsWith('/') && article.route.endsWith('/'), article.slug + ' must have a clean trailing-slash canonical path.');
  assert.ok(article.heroImage.startsWith('/knowledge/'), article.slug + ' must use a same-origin editorial image.');
  assert.ok(existsSync(path.join('public', article.heroImage)), 'Missing editorial artwork: ' + article.heroImage);
  article.sources.forEach((source) => assert.match(source.url, /^https:\/\//, 'Sources must use HTTPS: ' + source.url));
  (article.related ?? []).forEach((slug) => assert.ok(knownSlugs.has(slug), article.slug + ' links to unknown related article ' + slug));
  const relativeFile = article.route.replace(/^\//, '').replace(/\/+$/, '') + '/index.html';
  const builtPath = path.join(dist, relativeFile);
  assert.ok(existsSync(builtPath), 'Missing generated knowledge page: ' + relativeFile);
  const page = readFileSync(builtPath, 'utf8');
  const title = page.match(/<title>([^<]+)<\/title>/i)?.[1];
  const canonical = page.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const description = page.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  assert.ok(title, relativeFile + ' must have a page title.');
  assert.ok(description && description.length >= 50, relativeFile + ' needs a useful meta description.');
  assert.equal(canonical, 'https://ultraop.in' + article.route, relativeFile + ' has an incorrect canonical URL.');
  assert.ok(page.includes('uos-prerender-knowledge'), relativeFile + ' must include readable article HTML before JavaScript runs.');
  assert.ok(page.includes(article.heroImage), relativeFile + ' must show its custom editorial artwork.');
  assert.ok(page.includes('application/ld+json'), relativeFile + ' must include structured data.');
  assert.ok(page.includes(article.kind === 'hub' ? '"@type":"CollectionPage"' : '"@type":"Article"'), relativeFile + ' has the wrong structured-data type.');
  article.sources.forEach((source) => assert.ok(page.includes(source.url), relativeFile + ' is missing a cited source link: ' + source.url));
  (article.tables ?? []).forEach((table) => assert.ok(page.includes(table.heading) && page.includes(table.rows[0]?.[0] ?? ''), relativeFile + ' is missing its main results table: ' + table.heading));
  titles.push(title);
}
assert.equal(new Set(titles).size, titles.length, 'Main routes and gaming knowledge pages must have unique titles.');
for (const expected of ['/guides/', '/games/', '/esports/', '/games/minecraft/versions/26-3/', '/games/minecraft/versions/26-4/', '/games/valorant/updates/patch-13-08/', '/games/valorant/updates/agents/', '/games/valorant/updates/maps/', '/games/valorant/updates/competitive/', '/esports/pubg-global-championship-history/', '/esports/pubg-mobile-global-championship-history/', '/esports/bgmi-tournament-winners/']) {
  assert.ok(sitemap.includes('https://ultraop.in' + expected), 'SEO sitemap is missing core gaming route ' + expected);
}
const knowledgeOverview = readFileSync(path.join(dist, 'llms.txt'), 'utf8');
assert.ok(knowledgeOverview.includes('## Gaming guides, version notes and esports histories'), 'llms.txt must expose the game guides and esports archive.');
['minecraft-26-3', 'pubg-global-championship-history', 'free-fire-world-series-history', 'valorant-patch-13-08'].forEach((slug) => { const article = knowledgeArticles.find((item) => item.slug === slug); assert.ok(article && knowledgeOverview.includes(article.title), 'llms.txt is missing article title for slug: ' + slug); });
const publishedHubPages = ['guides/index.html', 'games/index.html', 'esports/index.html', 'games/minecraft/versions/index.html', 'games/valorant/updates/index.html', 'games/valorant/updates/agents/index.html', 'games/valorant/updates/maps/index.html', 'games/valorant/updates/competitive/index.html', 'games/valorant/guides/beginner-basics/index.html', 'guides/minecraft-survival-first-day/index.html', 'games/minecraft/java-vs-bedrock/index.html', 'guides/esports-tournament-formats/index.html', 'guides/pc-game-performance-recording/index.html', 'guides/pubg-mobile-bgmi-vs-pubg-pc/index.html', 'journal/ultraop-creator-story/index.html'];
publishedHubPages.forEach((file) => assert.ok(existsSync(path.join(dist, file)), 'Missing primary knowledge page: ' + file));

console.log('Audit passed: creator data, no fabricated statistics, policy disclosures, generated routes, unique SEO metadata, structured data and sitemap.');
