import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const core = readFileSync('src/data/core.ts', 'utf8');
const studio = readFileSync('src/UltraOPStudio.tsx', 'utf8');
const html = readFileSync('index.html', 'utf8');
const privacy = readFileSync('public/privacy.html', 'utf8');

const channelIds = [...core.matchAll(/\bid:\s*'([A-Za-z0-9_-]+)'/g)].map((match) => match[1]);
assert.equal(channelIds.length, 4, 'Expected exactly four official YouTube channel IDs in the source registry.');
assert.equal(new Set(channelIds).size, channelIds.length, 'YouTube channel IDs must be unique.');
channelIds.forEach((id) => assert.match(id, /^UC[A-Za-z0-9_-]{22}$/, 'Invalid YouTube channel ID: ' + id));

const playlistIds = [...core.matchAll(/uploadsPlaylist:\s*'([A-Za-z0-9_-]+)'/g)].map((match) => match[1]);
assert.equal(playlistIds.length, channelIds.length, 'Every YouTube channel must have an uploads playlist.');
assert.equal(new Set(playlistIds).size, playlistIds.length, 'Uploads playlist IDs must be unique.');
playlistIds.forEach((id) => assert.match(id, /^UU[A-Za-z0-9_-]{22}$/, 'Invalid uploads playlist ID: ' + id));

const socialUrls = [...core.matchAll(/\{ name: '[^']+', handle: '[^']+', url: '(https:\/\/[^']+)'/g)].map((match) => match[1]);
assert.ok(socialUrls.length >= 8, 'Expected the existing official social/community destinations to remain in the registry.');
socialUrls.forEach((url) => assert.match(url, /^https:\/\/[A-Za-z0-9.-]+\//, 'Social URLs must use HTTPS: ' + url));

assert.ok(core.includes('ultraopbiz@gmail.com'), 'Business email was removed from the central registry.');
assert.ok(core.includes('Amazon') && core.includes('THE FINALS') && core.includes('Wild Stone'), 'Known campaign records are unexpectedly missing.');
assert.ok(!studio.includes('estimatedStats'), 'Do not restore a hard-coded fallback statistics object in the new website.');
assert.ok(studio.includes('subscribersEstimated'), 'Third-party estimated statistics must be explicitly distinguished from direct API values.');
assert.ok(html.includes('Content-Security-Policy'), 'A documented baseline Content Security Policy is required in the main document.');
assert.ok(privacy.includes('SocialCounts'), 'The privacy notice must disclose the public statistics data provider.');
console.log('Content audit passed: channel IDs, playlists, HTTPS links, campaign registry, no hard-coded stats fallback, CSP and privacy disclosure.');
