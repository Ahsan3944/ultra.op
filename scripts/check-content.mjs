import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const core = readFileSync('src/data/core.ts', 'utf8');
const studio = readFileSync('src/UltraOPStudio.tsx', 'utf8');
const html = readFileSync('index.html', 'utf8');
const privacy = readFileSync('public/privacy.html', 'utf8');
const cookiePolicy = readFileSync('public/cookie-policy.html', 'utf8');
const terms = readFileSync('public/terms.html', 'utf8');

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
assert.ok(html.includes('summary_large_image'), 'Social cards must request a large image preview.');
assert.ok(html.includes('/brand/ultraop-social-banner.jpg'), 'Social preview metadata must use the designed banner.');
assert.ok(html.includes('/brand/ultraop-original.png'), 'Favicons/touch icons must use the original supplied UltraOP logo.');
assert.ok(studio.includes('/brand/ultraop-original.png'), 'Header, footer and hero artwork must use the original supplied logo.');
assert.ok(readFileSync('public/site.webmanifest', 'utf8').includes('/brand/ultraop-original.png'), 'Web app manifest must use the supplied original logo.');
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
  'brand/ultraop-original.png',
  'brand/ultraop-social-banner.jpg',
  'privacy.html',
  'cookie-policy.html',
  'terms.html',
  '404.html',
  'blog.html',
  'sitemap.xml'
];
requiredFiles.forEach((file) => assert.ok(existsSync(path.join(dist, file)), 'Missing generated production file: dist/' + file));

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
assert.ok(sitemapEntries.length >= 25, 'Sitemap should include main routes, legal pages and creator journal entries.');
assert.equal(new Set(sitemapEntries).size, sitemapEntries.length, 'Sitemap entries must be unique.');
assert.ok(!sitemap.includes('/blog/'), 'Removed legacy blog URLs must not remain in the canonical sitemap.');
assert.ok(!sitemap.includes('/blog.html'), 'Legacy blog.html must not remain in the canonical sitemap.');
assert.ok(sitemap.includes('https://ultraop.in/site-map/'), 'Search-engine sitemap must include the human-readable site map.');
const llms = readFileSync(path.join(dist, 'llms.txt'), 'utf8');
assert.ok(llms.includes('## Primary pages') && llms.includes('## Creator journal'), 'AI-readable llms.txt must include primary pages and journal entries.');
['Ultra OP Live', 'Roblox UltraOP3', 'Ultra OP 2.0', 'Op Earnings'].forEach((name) => assert.ok(llms.includes(name), 'AI-readable site overview must include channel: ' + name));
assert.ok(llms.includes('https://ultraop.in/site-map/'), 'AI-readable overview must link to the site map.');
const crawlerRules = readFileSync(path.join(dist, 'robots.txt'), 'utf8');
assert.ok(crawlerRules.includes('Sitemap: https://ultraop.in/sitemap.xml'), 'robots.txt must tell search engines where the XML sitemap lives.');
const legacyBlog = readFileSync(path.join(dist, 'blog.html'), 'utf8');
assert.ok(legacyBlog.includes('noindex,follow') && legacyBlog.includes('/journal/'), 'Legacy blog.html must migrate without becoming an indexed duplicate.');
assert.ok(readFileSync(path.join(dist, 'index.html'), 'utf8').includes('Play the game. Build the story.'), 'Homepage fallback content is missing.');
const channelFallback = readFileSync(path.join(dist, 'channels/index.html'), 'utf8');
['Ultra OP Live', 'Roblox UltraOP3', 'Ultra OP 2.0', 'Op Earnings'].forEach((name) => assert.ok(channelFallback.includes(name), 'Channel fallback is missing: ' + name));
assert.ok(channelFallback.includes('Subscribe — Ultra OP Live') && channelFallback.includes('sub_confirmation=1'), 'Pre-rendered channels page must include direct subscribe links.');
const siteMapFallback = readFileSync(path.join(dist, 'site-map/index.html'), 'utf8');
assert.ok(siteMapFallback.includes('Creator timeline') && siteMapFallback.includes('/llms.txt') && siteMapFallback.includes('/sitemap.xml'), 'Human site map must provide journal and crawler-resource links.');
const homepageFallback = readFileSync(path.join(dist, 'index.html'), 'utf8');
['Amazon', 'THE FINALS', 'Wild Stone', 'Hero', 'Parallel Mobile', 'TVS'].forEach((name) => assert.ok(homepageFallback.includes(name), 'Campaign fallback is missing: ' + name));
['Twitch', 'Kick', 'Rooter', 'Discord', 'WhatsApp Channel'].forEach((name) => assert.ok(homepageFallback.includes(name), 'Social/community fallback is missing: ' + name));

const builtMain = readFileSync(path.join(dist, 'index.html'), 'utf8');
assert.ok(builtMain.includes("script-src 'self'"), 'Generated homepage is missing the baseline script-src policy.');
assert.ok(builtMain.includes("style-src 'self' 'unsafe-inline'"), 'Generated homepage must permit same-origin production CSS.');
assert.ok(builtMain.includes("frame-src 'none'"), 'Generated homepage must not silently allow embedded frames.');
console.log('Audit passed: creator data, no fabricated statistics, policy disclosures, generated routes, unique SEO metadata, structured data and sitemap.');
