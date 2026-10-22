import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const coreSource = await readFile(path.resolve('src/data/core.ts'), 'utf8');
const journalSource = await readFile(path.resolve('src/data/journal.ts'), 'utf8');

function capture(source, pattern) {
  return source.match(pattern)?.[1] ?? '';
}
function unescapeTsString(value) {
  return value.replace(/\\'/g, "'").replace(/\\\\/g, "\\");
}
function readRecords(source, pattern) {
  return [...source.matchAll(pattern)].map((match) => match[0]);
}
function field(record, name) {
  const pattern = new RegExp(name + ":\\s*'((?:\\\\'|[^'])*)'");
  return unescapeTsString(capture(record, pattern));
}

const channelRecords = readRecords(coreSource, /\{\s*key:\s*'[^']+'[^}]*\}/g)
  .filter((record) => /uploadsPlaylist:/.test(record))
  .map((record) => ({
    name: field(record, 'name'),
    handle: field(record, 'handle'),
    url: field(record, 'url'),
    focus: field(record, 'focus'),
    id: field(record, 'id')
  }))
  .filter((item) => item.name && item.url);

const socialsBlock = capture(coreSource, /(export const SOCIALS:[\s\S]*?\n\];)/);
const socialRecords = readRecords(socialsBlock, /\{\s*name:\s*'[^']+'[^}]*\}/g)
  .map((record) => ({
    name: field(record, 'name'),
    handle: field(record, 'handle'),
    url: field(record, 'url'),
    type: field(record, 'type')
  }))
  .filter((item) => item.name && item.url);

const brandsBlock = capture(coreSource, /(export const BRAND_CAMPAIGNS:[\s\S]*?\n\];)/);
const brandRecords = readRecords(brandsBlock, /\{\s*name:\s*'[^']+'[^}]*\}/g)
  .map((record) => ({
    name: field(record, 'name'),
    type: field(record, 'type'),
    category: field(record, 'category'),
    year: field(record, 'year')
  }))
  .filter((item) => item.name);

const journalRecords = readRecords(journalSource, /\{\s*slug:\s*'[^']+'[^}]*\}/g)
  .map((record) => {
    const bodyText = capture(record, /body:\s*\[([\s\S]*?)\],\s*era:/);
    return {
      slug: field(record, 'slug'),
      eyebrow: field(record, 'eyebrow'),
      title: field(record, 'title'),
      summary: field(record, 'summary'),
      era: field(record, 'era'),
      body: [...bodyText.matchAll(/'((?:\\'|[^'])*)'/g)].map((match) => unescapeTsString(match[1]))
    };
  })
  .filter((entry) => entry.slug && entry.title && entry.summary);

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

for (const entry of journalRecords) {
  pages.push({
    path: '/journal/' + entry.slug + '/',
    title: entry.title + ' | UltraOP Journal',
    description: entry.summary,
    journalEntry: entry
  });
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function escapeAttr(value) {
  return escapeHtml(value);
}
function renderLinks(items) {
  if (!items.length) return '';
  return '<ul>' + items.map((item) => {
    const external = /^https:\/\//.test(item.href);
    const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return '<li><a href="' + escapeAttr(item.href) + '"' + target + '>' + escapeHtml(item.label) + '</a>' +
      (item.detail ? '<p>' + escapeHtml(item.detail) + '</p>' : '') + '</li>';
  }).join('') + '</ul>';
}

const pageContent = {
  '/': {
    eyebrow: 'Official creator website / India',
    heading: 'Play the game. Build the story.',
    paragraphs: [
      'Sk Ahsan Ahmad, known online as UltraOP, is an Indian gaming creator, live streamer and technology-focused creator.',
      'The creator journey has moved through competitive PUBG and BGMI, Free Fire live streaming on Rooter, YouTube and a current focus on Minecraft. Variety games including Valorant and GTA, creator technology and story-led gaming remain part of the wider creative world.'
    ],
    sections: [
      { heading: 'Official YouTube channels', items: channelRecords.map((item) => ({ label: item.name + ' (' + item.handle + ')', href: item.url, detail: item.focus })) },
      { heading: 'Selected brand campaign records', items: brandRecords.map((item) => ({ label: item.name, href: '/work/', detail: item.type + ' · ' + item.category + ' · ' + item.year })) },
      { heading: 'Follow the official network', items: socialRecords.map((item) => ({ label: item.name + ' — ' + item.handle, href: item.url, detail: item.type })) }
    ]
  },
  '/about/': {
    eyebrow: 'The creator / about',
    heading: 'The creator behind UltraOP.',
    paragraphs: [
      'Sk Ahsan Ahmad’s journey began with PUBG and competitive gaming communities, then moved into Free Fire and live streaming on Rooter.',
      'The Rooter chapter included streaming and community responsibilities. YouTube became the main creator platform, and Minecraft is the current primary focus for live content. The wider interests include Roblox, Valorant, GTA, story-led gaming and technology projects.'
    ],
    sections: [
      { heading: 'The creator journey', items: [
        { label: 'PUBG and competitive gaming', href: '/journal/pubg-beginning/', detail: 'The early competitive chapter.' },
        { label: 'Free Fire and Rooter', href: '/journal/rooter-free-fire-streaming/', detail: 'A shift into regular live streaming and community.' },
        { label: 'YouTube growth', href: '/journal/youtube-begins/', detail: 'The next platform chapter.' },
        { label: 'Minecraft today', href: '/journal/minecraft-transition/', detail: 'Current live content and a growing storytelling direction.' }
      ]}
    ]
  },
  '/channels/': {
    eyebrow: 'The network / official channels',
    heading: 'Four channels. One creator identity.',
    paragraphs: [
      'Choose the official UltraOP YouTube channel that matches what you want to watch. Public subscriber or view counts are shown only when the public data provider returns a valid reading; this page does not use invented fallback numbers.'
    ],
    sections: [{ heading: 'Official channels', items: channelRecords.map((item) => ({ label: item.name + ' — ' + item.handle, href: item.url, detail: item.focus + ' · Channel ID: ' + item.id })) }]
  },
  '/live/': {
    eyebrow: 'Watch / live',
    heading: 'Join the next live session.',
    paragraphs: [
      'UltraOP’s official streaming destinations include YouTube, Twitch, Kick and Rooter. Stream availability changes by platform, so open the official destination to check current status.'
    ],
    sections: [{ heading: 'Official streaming destinations', items: [
      { label: 'YouTube — Ultra OP Live', href: 'https://www.youtube.com/@ultraoplive', detail: 'Primary creator channel.' },
      ...socialRecords.filter((item) => ['Twitch', 'Kick', 'Rooter'].includes(item.name)).map((item) => ({ label: item.name + ' — ' + item.handle, href: item.url, detail: 'Official streaming destination.' }))
    ] }]
  },
  '/community/': {
    eyebrow: 'Across the network / community',
    heading: 'Find the official UltraOP profiles.',
    paragraphs: [
      'Use this page as the central place to find the public social, live streaming and community destinations currently listed in the UltraOP website registry. Check the handle and destination before sharing sensitive information.'
    ],
    sections: [{ heading: 'Official social and community links', items: socialRecords.map((item) => ({ label: item.name + ' — ' + item.handle, href: item.url, detail: item.type })) }]
  },
  '/work/': {
    eyebrow: 'Selected campaigns / brand work',
    heading: 'Creative work. Real partnerships.',
    paragraphs: [
      'This section lists selected campaign records maintained in the UltraOP website registry. Campaigns are presented without invented reach figures or performance promises. For a new collaboration, contact UltraOP directly.'
    ],
    sections: [
      { heading: 'Selected campaign records', items: brandRecords.map((item) => ({ label: item.name, href: '/contact/', detail: item.type + ' · ' + item.category + ' · ' + item.year })) },
      { heading: 'Business contact', items: [{ label: 'ultraopbiz@gmail.com', href: 'mailto:ultraopbiz@gmail.com', detail: 'Sponsorships, brand collaborations and professional enquiries.' }] }
    ]
  },
  '/contact/': {
    eyebrow: 'Business / contact',
    heading: 'Make something worth watching.',
    paragraphs: [
      'For sponsorships, brand integrations, creator campaigns, event enquiries and professional opportunities, use the official UltraOP business email.'
    ],
    sections: [{ heading: 'Official business contact', items: [{ label: 'ultraopbiz@gmail.com', href: 'mailto:ultraopbiz@gmail.com', detail: 'Include the organisation, campaign goal and timing in your enquiry.' }] }]
  },
  '/journal/': {
    eyebrow: 'Journal / creator timeline',
    heading: 'The story behind the uploads.',
    paragraphs: [
      'A timeline of the games, platforms and creative shifts that shaped UltraOP. Exact dates are omitted where they have not been confirmed.'
    ],
    sections: [{ heading: 'Creator timeline', items: journalRecords.map((item) => ({ label: item.title, href: '/journal/' + item.slug + '/', detail: item.summary })) }]
  },
  '/assets/': {
    eyebrow: 'Creator toolkit / public resources',
    heading: 'Resources, when they are ready.',
    paragraphs: ['Only published assets should be listed here. No public downloads are advertised until the file and its use are confirmed.'],
    sections: [{ heading: 'Explore', items: [{ label: 'Official community links', href: '/community/', detail: 'Find UltraOP’s public profiles.' }] }]
  },
  '/fan-art/': {
    eyebrow: 'Community / fan art',
    heading: 'Made by the community.',
    paragraphs: ['Community artwork should be credited and published with the creator’s permission. No artwork is displayed until the source and permission details are confirmed.'],
    sections: [{ heading: 'Contact', items: [{ label: 'Contact UltraOP', href: '/contact/', detail: 'For permissions, attribution and community submissions.' }] }]
  },
  '/support/': {
    eyebrow: 'Support / official destinations',
    heading: 'Support the work. Follow the journey.',
    paragraphs: ['The simplest way to support UltraOP is to watch, share and follow official content across the creator network.'],
    sections: [{ heading: 'Official links', items: socialRecords.map((item) => ({ label: item.name + ' — ' + item.handle, href: item.url, detail: item.type })) }]
  }
};

function fallbackFor(page) {
  if (page.journalEntry) {
    return {
      eyebrow: page.journalEntry.eyebrow || 'UltraOP journal',
      heading: page.journalEntry.title,
      paragraphs: [page.journalEntry.summary, ...page.journalEntry.body],
      sections: [{ heading: 'More from the creator timeline', items: [{ label: 'All journal entries', href: '/journal/', detail: 'Explore the full UltraOP creator timeline.' }, { label: 'About UltraOP', href: '/about/', detail: 'Read the creator overview.' }] }]
    };
  }
  return pageContent[page.path] ?? {
    eyebrow: 'UltraOP / official website',
    heading: page.title,
    paragraphs: [page.description],
    sections: [{ heading: 'Explore the website', items: [
      { label: 'Official channels', href: '/channels/', detail: 'YouTube channel directory.' },
      { label: 'Creator journey', href: '/about/', detail: 'About UltraOP / Sk Ahsan Ahmad.' },
      { label: 'Contact', href: '/contact/', detail: 'Business enquiries.' }
    ] }]
  };
}

function renderFallback(page) {
  const content = fallbackFor(page);
  const sections = (content.sections ?? []).map((section) =>
    '<section><h2>' + escapeHtml(section.heading) + '</h2>' + renderLinks(section.items ?? []) + '</section>'
  ).join('');
  const paragraphs = (content.paragraphs ?? []).map((paragraph) => '<p>' + escapeHtml(paragraph) + '</p>').join('');
  return '<main class="uos-prerender"><p class="uos-prerender-label">' + escapeHtml(content.eyebrow) +
    '</p><article><h1>' + escapeHtml(content.heading) + '</h1>' + paragraphs + sections +
    '<p class="uos-prerender-foot">Official website of UltraOP / Sk Ahsan Ahmad · <a href="/">Home</a></p></article></main>';
}

function upsertMeta(html, selectorAttribute, selectorValue, tag) {
  const escaped = selectorValue.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
  const pattern = new RegExp('<meta\\b(?=[^>]*\\b' + selectorAttribute + '="' + escaped + '")[^>]*>', 'i');
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', '  ' + tag + '\n</head>');
}
function createPageHtml(page) {
  const canonical = 'https://ultraop.in' + page.path;
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, '<title>' + escapeHtml(page.title) + '</title>');
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
  const fallbackCss = '<style>' +
    '.uos-prerender{min-height:100svh;padding:clamp(28px,6vw,84px);background:#090a0c;color:#f1eee7;font:15px/1.85 system-ui,sans-serif}' +
    '.uos-prerender article{max-width:1000px;margin:auto}.uos-prerender-label{color:#ff6847;font:700 10px/1.5 ui-monospace,monospace;letter-spacing:.15em;text-transform:uppercase}' +
    '.uos-prerender h1{max-width:1000px;margin:20px 0;font-size:clamp(44px,7vw,90px);line-height:.94;letter-spacing:-.07em}' +
    '.uos-prerender h2{margin:42px 0 12px;font-size:24px;letter-spacing:-.04em}.uos-prerender p,.uos-prerender li{color:#b0b0aa}' +
    '.uos-prerender ul{padding-left:22px}.uos-prerender li{padding:7px 0}.uos-prerender a{color:#f1eee7}.uos-prerender a:hover{color:#ff6847}' +
    '.uos-prerender li p{margin:3px 0;font-size:12px}.uos-prerender-foot{margin-top:50px;padding-top:15px;border-top:1px solid rgba(255,255,255,.15);font-size:11px}' +
    '</style>';
  html = html.replace('</head>', fallbackCss + '\n  <script type="application/ld+json">' + JSON.stringify(schema) + '</script>\n</head>');
  html = html.replace('<div id="root"></div>', '<div id="root">' + renderFallback(page) + '</div>');
  return html;
}

for (const page of pages) {
  if (page.path.endsWith('.html')) continue;
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
  const html = '<!doctype html><html lang="en-IN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<meta name="robots" content="noindex,follow"><meta name="referrer" content="no-referrer">' +
    '<link rel="canonical" href="https://ultraop.in/journal/"><meta http-equiv="refresh" content="0;url=/journal/">' +
    '<title>Moved to the UltraOP Journal</title></head><body><main><h1>Moved to the UltraOP Journal</h1>' +
    '<p>This legacy section has moved to the official creator journal.</p><p><a href="/journal/">Open the UltraOP Journal</a></p></main></body></html>';
  await writeFile(destination, html, 'utf8');
}

const sitemapPaths = pages.filter((page) => !page.noindex).map((page) => page.path);
const uniquePaths = [...new Set(sitemapPaths)];
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  uniquePaths.map((route) => '  <url><loc>https://ultraop.in' + route + '</loc></url>').join('\n') +
  '\n</urlset>\n';
await writeFile(path.join(dist, 'sitemap.xml'), sitemap, 'utf8');

console.log('Generated ' + pages.length + ' static route documents with crawlable fallback content and a sitemap with ' + uniquePaths.length + ' canonical URLs.');
