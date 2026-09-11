import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './ultraop-enhancements.css';
import './ultraop-responsive.css';
import './ultraop-fixes.css';
import './creator-pages.css';
import './creator-home-overrides.css';
import './creator-home.css';
import './creator-home-refinement.css';
import './gallery-pages.css';
import App from './App';
import CreatorHome from './CreatorHome';
import { LegacyHubPage } from './LegacyHubPage';
import { JournalPage } from './JournalPage';
import { AboutPage, ChannelsPage, LivePage, CommunityPage, WorkPage, ContactPage, JournalLandingPage, Creator404 } from './CreatorPages';
import { FanArtPage, AssetsPage } from './GalleryPages';
import { installGalleryNav } from './gallery-nav';

function recoverStaticHostPath() { const key = 'ultraop:requested-path'; const stored = sessionStorage.getItem(key); if (stored && stored !== '/') { sessionStorage.removeItem(key); window.history.replaceState(null, '', stored); } }
type FeedItem = { title?: string; link?: string }; type FeedResponse = { status?: string; items?: FeedItem[] };
function extractYouTubeVideoId(link = '') { const match = link.match(/[?&]v=([A-Za-z0-9_-]{6,})/); return match?.[1] ?? null; }
function loadLatestNonShortVideo(channelId: string): Promise<string | null> { return new Promise(resolve => { const callbackName = `__ultraopRss_${Date.now()}_${Math.random().toString(36).slice(2)}`; const script = document.createElement('script'); const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`; const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&callback=${callbackName}`; let settled = false; const finish = (value: string | null) => { if (settled) return; settled = true; delete (window as unknown as Record<string, unknown>)[callbackName]; script.remove(); resolve(value); }; (window as unknown as Record<string, unknown>)[callbackName] = (data: FeedResponse) => { if (data?.status !== 'ok' || !Array.isArray(data.items)) return finish(null); const item = data.items.find(entry => { const text = `${entry.title ?? ''} ${entry.link ?? ''}`.toLowerCase(); return !/\bshorts?\b|#shorts|\/shorts\//i.test(text) && !!extractYouTubeVideoId(entry.link ?? ''); }); finish(item ? extractYouTubeVideoId(item.link ?? '') : null); }; script.async = true; script.src = apiUrl; script.onerror = () => finish(null); document.head.appendChild(script); window.setTimeout(() => finish(null), 7000); }); }

function installHomepageEnhancements() {
  if (window.location.pathname.replace(/\/+$/, '') !== '/') return;
  const start = () => { const root = document.getElementById('root'); if (!root) return; let activeListener: (() => void) | null = null; let liveSetupStarted = false; let orderApplied = false;
    const findCard = (name: string) => Array.from(document.querySelectorAll<HTMLElement>('.channel-video-card')).find(card => card.querySelector('h3')?.textContent?.trim() === name) ?? null;
    const applyChannelOrder = () => { if (orderApplied) return; const grid = document.querySelector<HTMLElement>('.channel-grid'); if (!grid) return; const cards = ['Ultra OP Live', 'Roblox UltraOP3', 'Ultra OP 2.0', 'Op Earnings'].map(findCard); if (cards.some(card => !card)) return; cards.map(card => card?.closest<HTMLElement>('.scroll-reveal') ?? card!).forEach(wrapper => grid.appendChild(wrapper)); const focus = cards[0]?.querySelector<HTMLElement>('.channel-focus'); if (focus) focus.textContent = 'Live streams, Minecraft & other games'; orderApplied = true; };
    const setupLiveChannel = () => { if (liveSetupStarted) return; const frame = findCard('Ultra OP Live')?.querySelector<HTMLIFrameElement>('iframe'); if (!frame) return; liveSetupStarted = true; const liveChannelId = 'UCAxlmL3_721xzOjQVe5Klbg'; frame.src = `https://www.youtube.com/embed/live_stream?channel=${liveChannelId}&rel=0&modestbranding=1`; frame.dataset.liveOnly = 'true'; frame.title = 'Ultra OP Live — current live stream'; window.setTimeout(async () => { if (frame.dataset.liveOnly !== 'true') return; const videoId = await loadLatestNonShortVideo(liveChannelId); if (!videoId) return; frame.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`; frame.dataset.liveOnly = 'false'; frame.title = 'Ultra OP Live — latest video'; }, 12000); };
    const wirePageNavigation = () => { const routes: Record<string,string> = { Home:'/', Channels:'/channels/', Live:'/live/', Story:'/about/', Community:'/community/', Journal:'/journal/', Contact:'/contact/' }; document.querySelectorAll<HTMLButtonElement>('.desktop-nav button, .mobile-nav button').forEach(button => { const label = button.textContent?.trim() ?? ''; const route = routes[label]; if (!route || button.dataset.routeWired === 'true') return; button.dataset.routeWired = 'true'; button.addEventListener('click', event => { event.preventDefault(); window.location.assign(route); }); }); };
    let applied = false;
    const apply = () => { applyChannelOrder(); setupLiveChannel(); wirePageNavigation(); if (applied) return; const navButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.desktop-nav button')); const ids = ['home', 'channels', 'live', 'story', 'community', 'journal', 'contact']; navButtons.forEach((button, index) => button.dataset.section = ids[index] ?? ''); const sections = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]; const updateActive = () => { const marker = window.scrollY + Math.min(window.innerHeight * 0.35, 280); let current = sections[0]?.id ?? 'home'; for (const section of sections) if (section.offsetTop <= marker) current = section.id; navButtons.forEach(button => button.classList.toggle('is-active', button.dataset.section === current)); }; updateActive(); window.addEventListener('scroll', updateActive, { passive: true }); activeListener = () => window.removeEventListener('scroll', updateActive); applied = true; };
    apply(); const observer = new MutationObserver(() => { if (!orderApplied || !liveSetupStarted) apply(); else wirePageNavigation(); }); observer.observe(root, { childList: true, subtree: true }); window.setTimeout(apply, 250); window.setTimeout(apply, 1000); window.addEventListener('beforeunload', () => { observer.disconnect(); activeListener?.(); }, { once: true });
  }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
}

function Root() { recoverStaticHostPath(); const path = window.location.pathname.replace(/\/+$/, '') || '/'; if (path === '/about') return <AboutPage/>; if (path === '/channels') return <ChannelsPage/>; if (path === '/live') return <LivePage/>; if (path === '/community') return <CommunityPage/>; if (path === '/work') return <WorkPage/>; if (path === '/contact') return <ContactPage/>; if (path === '/journal') return <JournalLandingPage/>; if (path === '/journal-full') return <JournalPage/>; if (path === '/fan-art') return <FanArtPage/>; if (path === '/assets') return <AssetsPage/>; if (path === '/blog') return <LegacyHubPage kind="blog"/>; if (path.startsWith('/blog/')) { const slug = path.slice('/blog/'.length).split('/')[0]; return <LegacyHubPage kind="blog" slug={slug}/>; } if (path !== '/') return <Creator404/>; return <CreatorHome/>; }
createRoot(document.getElementById('root')!).render(<React.StrictMode><Root/></React.StrictMode>);
installHomepageEnhancements();
installGalleryNav();
