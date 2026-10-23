import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Blocks, ChevronDown,
  Code2, ExternalLink, Gamepad2, Instagram, Mail, Menu, MessageCircle, Play,
  Radio, Sparkles, Twitch, X, Youtube
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SITE, YOUTUBE_CHANNELS, SOCIALS, BRAND_CAMPAIGNS } from './data/core';
import { JOURNAL_ENTRIES, type JournalEntry } from './data/journal';
import KNOWLEDGE_ARTICLES from './data/knowledge.json';
import { getKnowledgeArticle, KnowledgeArticlePage, KnowledgeDirectoryPage, KnowledgeTeasers } from './KnowledgePages';
import './ultraop-studio.css';

type ChannelStats = {
  subscribers: number | null;
  views: number | null;
  subscribersEstimated: boolean;
};
type StatsState = {
  values: Record<string, ChannelStats>;
  loading: boolean;
};

const PAGE_COPY: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'UltraOP — Sk Ahsan Ahmad | Gaming Creator',
    description: 'UltraOP (Sk Ahsan Ahmad) is an Indian gaming creator. Explore gaming videos, Minecraft stories, live streams and official links to YouTube, Twitch, Rooter and Instagram.'
  },
  '/about': {
    title: 'About UltraOP — Sk Ahsan Ahmad | Gaming Creator Journey',
    description: 'Discover the UltraOP creator journey from PUBG and Free Fire to Rooter streaming, YouTube, Minecraft, community building and technology projects.'
  },
  '/channels': {
    title: 'Official Channels — UltraOP | YouTube & Streaming Platforms',
    description: 'Find the official UltraOP YouTube channels, their focus, public links and current channel statistics when a live public data source is available.'
  },
  '/live': {
    title: 'Watch UltraOP Live — YouTube, Twitch, Rooter & Kick',
    description: 'Open UltraOP’s official streaming destinations on YouTube, Twitch, Kick and Rooter. Stream availability is determined by each platform.'
  },
  '/community': {
    title: 'UltraOP Community — Official Social Media & Streaming Links',
    description: 'Find UltraOP’s official Instagram profiles, YouTube channels, Twitch, Kick, Rooter, Discord and WhatsApp community channel.'
  },
  '/work': {
    title: 'Brand Collaborations — UltraOP | Creator Partnerships',
    description: 'Explore selected brand and campaign records from UltraOP’s gaming creator journey and contact UltraOP for business collaborations.'
  },
  '/contact': {
    title: 'Contact UltraOP — Business, Sponsorships & Collaborations',
    description: 'Contact UltraOP / Sk Ahsan Ahmad for sponsorships, creator campaigns, brand partnerships and professional enquiries.'
  },
  '/journal': {
    title: 'UltraOP Journal — Gaming, Streaming & Creator Journey',
    description: 'Read the UltraOP creator timeline: competitive gaming, PUBG, Rooter, Free Fire, YouTube, Minecraft, community roles and technology projects.'
  },
  '/site-map': {
    title: 'Website Map — All Official UltraOP Pages & Resources',
    description: 'Browse every published UltraOP website page, creator journal entry, official channel links, policies, XML sitemap and AI-readable site information.'
  },
  '/assets': {
    title: 'UltraOP Creator Toolkit — Published Assets & Resources',
    description: 'Check the public resources and creator toolkit status for UltraOP. Only assets that are actually published will be listed.'
  },
  '/fan-art': {
    title: 'UltraOP Fan Art — Community Creations',
    description: 'The official home for UltraOP fan-art updates and community creations.'
  },
  '/support': {
    title: 'Support UltraOP — Official Creator Links',
    description: 'Find official ways to follow and support UltraOP’s gaming content and creator projects.'
  },
  '/guides': { title: 'Gaming Guides & Esports Knowledge Hub | UltraOP', description: 'Structured Minecraft version guides, tournament histories, VALORANT patch notes and beginner-friendly gaming explainers by UltraOP.' },
  '/games': { title: 'Game Directory: Minecraft, PUBG, BGMI, Free Fire & VALORANT | UltraOP', description: 'Browse organised game guides, update summaries, Minecraft version notes and competitive gaming reference pages.' },
  '/esports': { title: 'Esports Tournament Histories & Champions | UltraOP', description: 'Explore separate winner timelines for PUBG Global Championship, BGMI series, Free Fire World Series and VALORANT Champions.' }
};

const JOURNAL_DETAILS: Record<string, JournalEntry> = Object.fromEntries(
  JOURNAL_ENTRIES.map((entry) => [entry.slug, entry])
);

function normalizedPath() {
  const path = window.location.pathname.replace(/\/+$/, '');
  return path || '/';
}

function SocialIcon({ name }: { name: string }) {
  if (name.toLowerCase().includes('instagram')) return <Instagram size={18} aria-hidden="true" />;
  if (name.toLowerCase() === 'twitch') return <Twitch size={18} aria-hidden="true" />;
  if (name.toLowerCase() === 'youtube') return <Youtube size={18} aria-hidden="true" />;
  if (name.toLowerCase() === 'discord' || name.toLowerCase().includes('whatsapp')) return <MessageCircle size={18} aria-hidden="true" />;
  if (name.toLowerCase() === 'kick' || name.toLowerCase() === 'rooter') return <Radio size={18} aria-hidden="true" />;
  return <ExternalLink size={18} aria-hidden="true" />;
}

function getSocialHref(name: string, url: string) {
  return name.toLowerCase().includes('instagram') || url.startsWith('https://')
    ? url
    : url;
}

function usePublicChannelStats(enabled: boolean): StatsState {
  const [state, setState] = useState<StatsState>({ values: {}, loading: false });

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 8500);
    setState({ values: {}, loading: true });

    const requests = YOUTUBE_CHANNELS.map(async (channel) => {
      try {
        const response = await fetch(
          'https://api.socialcounts.org/youtube-live-subscriber-count/' + encodeURIComponent(channel.id),
          { signal: controller.signal, referrerPolicy: 'no-referrer' }
        );
        if (!response.ok) return [channel.key, null] as const;
        const data = await response.json() as {
          API_sub?: number | string;
          est_sub?: number | string;
          views?: number | string;
        };
        const actualSubscribers = Number(data.API_sub);
        const estimatedSubscribers = Number(data.est_sub);
        const rawViews = Number(data.views);
        const hasActual = data.API_sub !== undefined && data.API_sub !== null && Number.isFinite(actualSubscribers) && actualSubscribers >= 0;
        const hasEstimate = data.est_sub !== undefined && data.est_sub !== null && Number.isFinite(estimatedSubscribers) && estimatedSubscribers >= 0;
        const views = data.views !== undefined && Number.isFinite(rawViews) && rawViews >= 0 ? rawViews : null;
        if (!hasActual && !hasEstimate && views === null) return [channel.key, null] as const;
        return [channel.key, {
          subscribers: hasActual ? actualSubscribers : hasEstimate ? estimatedSubscribers : null,
          views,
          subscribersEstimated: !hasActual && hasEstimate
        }] as const;
      } catch {
        return [channel.key, null] as const;
      }
    });

    void Promise.all(requests).then((results) => {
      if (!active) return;
      const values: Record<string, ChannelStats> = {};
      results.forEach(([key, value]) => {
        if (value) values[key] = value;
      });
      setState({ values, loading: false });
    });

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [enabled]);

  return state;
}

function formatCount(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return null;
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1) + 'M';
  if (value >= 1_000) return (value / 1_000).toFixed(value >= 100_000 ? 0 : 1) + 'K';
  return Math.round(value).toLocaleString('en-IN');
}

function setMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let element = document.head.querySelector('meta[' + attribute + '="' + name + '"]') as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.content = content;
}

function SiteHeader({ route }: { route: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const home = route === '/';
  const navItems = [
    { label: 'Creator', href: home ? '#creator' : '/about/', active: route === '/about' },
    { label: 'Channels', href: home ? '#channels' : '/channels/', active: route === '/channels' },
    { label: 'Community', href: home ? '#community' : '/community/', active: route === '/community' },
    { label: 'Journal', href: '/journal/', active: route === '/journal' || route.startsWith('/journal/') },
    { label: 'Brand work', href: home ? '#work' : '/work/', active: route === '/work' }
  ];
  const exploreItems = [
    { label: 'Games & versions', detail: 'Game directory and version notes', href: '/games/', active: route === '/games' },
    { label: 'Gaming guides', detail: 'How-to articles and game explainers', href: '/guides/', active: route === '/guides' || route.startsWith('/guides/') },
    { label: 'Esports histories', detail: 'Tournament winners and event records', href: '/esports/', active: route === '/esports' || route.startsWith('/esports/') },
    { label: 'Minecraft versions', detail: 'Release details and compatibility', href: '/games/minecraft/versions/', active: route.startsWith('/games/minecraft/') },
    { label: 'VALORANT updates', detail: 'Patch notes, agents, maps and ranked', href: '/games/valorant/updates/', active: route.startsWith('/games/valorant/') }
  ];
  const exploreActive = exploreItems.some((item) => item.active);

  return (
    <header className="uos-header">
      <div className="uos-header-inner">
        <a className="uos-wordmark" href="/" aria-label="UltraOP home">
          <img src="/brand/ultraop-original.webp" alt="" width="34" height="34" />
          <span>ULTRA<span className="uos-wordmark-accent">OP</span></span>
        </a>
        <nav className="uos-desktop-nav" aria-label="Main navigation">
          {navItems.slice(0, 2).map((item) => <a key={item.label} href={item.href} className={item.active ? 'is-active' : undefined} aria-current={item.active ? 'page' : undefined}>{item.label}</a>)}
          <div
            className={['uos-nav-dropdown', exploreActive ? 'is-active' : '', exploreOpen ? 'is-open' : ''].filter(Boolean).join(' ')}
            onMouseEnter={() => setExploreOpen(true)}
            onMouseLeave={() => setExploreOpen(false)}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setExploreOpen(false); }}
          >
            <button type="button" aria-haspopup="true" aria-expanded={exploreOpen} onClick={() => setExploreOpen((open) => !open)}>
              Explore <ChevronDown size={14} aria-hidden="true" />
            </button>
            <div className="uos-nav-dropdown-menu" role="menu" aria-label="Explore gaming content">
              {exploreItems.map((item) => (
                <a key={item.label} href={item.href} role="menuitem" className={item.active ? 'is-active' : undefined} aria-current={item.active ? 'page' : undefined} onClick={() => setExploreOpen(false)}>
                  <span>{item.label}<ArrowUpRight size={13} aria-hidden="true" /></span>
                  <small>{item.detail}</small>
                </a>
              ))}
            </div>
          </div>
          {navItems.slice(2).map((item) => <a key={item.label} href={item.href} className={item.active ? 'is-active' : undefined} aria-current={item.active ? 'page' : undefined}>{item.label}</a>)}
        </nav>
        <a className="uos-header-cta" href={home ? '#contact' : '/contact/'}>
          Let’s work <ArrowUpRight size={15} aria-hidden="true" />
        </a>
        <button
          className="uos-menu-button"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="uos-mobile-nav"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {menuOpen && (
        <nav className="uos-mobile-nav" id="uos-mobile-nav" aria-label="Mobile navigation">
          {navItems.slice(0, 2).map((item) => (
            <a key={item.label} href={item.href} className={item.active ? 'is-active' : undefined} aria-current={item.active ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
              {item.label}<ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ))}
          <div className="uos-mobile-nav-group">
            <p>Explore</p>
            {exploreItems.map((item) => (
              <a key={item.label} href={item.href} className={item.active ? 'is-active' : undefined} aria-current={item.active ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
                <span>{item.label}<small>{item.detail}</small></span><ArrowUpRight size={15} aria-hidden="true" />
              </a>
            ))}
          </div>
          {navItems.slice(2).map((item) => (
            <a key={item.label} href={item.href} className={item.active ? 'is-active' : undefined} aria-current={item.active ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
              {item.label}<ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ))}
          <a href="/live/" onClick={() => setMenuOpen(false)}>Watch live<ArrowUpRight size={15} aria-hidden="true" /></a>
          <a href="/contact/" onClick={() => setMenuOpen(false)}>Business contact<ArrowUpRight size={15} aria-hidden="true" /></a>
        </nav>
      )}
    </header>
  );
}

function SectionHeading({ eyebrow, title, copy, action }: { eyebrow: string; title: ReactNode; copy?: string; action?: { label: string; href: string } }) {
  return (
    <div className="uos-section-heading" data-reveal>
      <div>
        <p className="uos-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <div className="uos-section-heading-aside">
        {copy && <p>{copy}</p>}
        {action && <a className="uos-text-link" href={action.href}>{action.label}<ArrowUpRight size={16} aria-hidden="true" /></a>}
      </div>
    </div>
  );
}

function CubeArtwork() {
  return (
    <div className="uos-artwork" aria-hidden="true">
      <div className="uos-artwork-topline"><span>ULTRAOP / WORLD BUILD</span><span>001—∞</span></div>
      <div className="uos-grid-floor" />
      <div className="uos-cube-stage">
        <div className="uos-cube-shadow" />
        <div className="uos-cube">
          <div className="uos-cube-face uos-cube-front"><span className="uos-pixel uos-pixel-a" /><span className="uos-pixel uos-pixel-b" /><span className="uos-pixel uos-pixel-c" /><img className="uos-cube-logo" src="/brand/ultraop-original.webp" alt="" width="118" height="150" /></div>
          <div className="uos-cube-face uos-cube-back"><span className="uos-cube-face-label">BUILD<br/>YOUR<br/>WORLD</span></div>
          <div className="uos-cube-face uos-cube-right"><span className="uos-cube-side-mark">OP / 01</span></div>
          <div className="uos-cube-face uos-cube-left"><span className="uos-cube-side-mark">PLAY / CREATE</span></div>
          <div className="uos-cube-face uos-cube-top"><span className="uos-cube-top-grid" /></div>
          <div className="uos-cube-face uos-cube-bottom" />
        </div>
        <div className="uos-orbit uos-orbit-one" />
        <div className="uos-orbit uos-orbit-two" />
        <div className="uos-floating-chip uos-chip-one"><span className="uos-chip-light" /> GAMEPLAY <b>01</b></div>
        <div className="uos-floating-chip uos-chip-two"><Blocks size={14} /> WORLD / STORY</div>
      </div>
      <div className="uos-artwork-bottomline"><span>GAMING / STORYTELLING / TECHNOLOGY</span><span>INDEPENDENT CREATOR</span></div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="uos-hero">
      <div className="uos-hero-inner">
        <div className="uos-hero-copy">
          <p className="uos-eyebrow uos-hero-kicker" data-hero-reveal>INDEPENDENT GAMING CREATOR <span>·</span> INDIA</p>
          <h1 className="uos-hero-title" data-hero-reveal>
            PLAY THE<br />
            <span className="uos-title-outline">GAME.</span><br />
            BUILD THE<br />
            <span className="uos-title-accent">STORY.</span>
          </h1>
          <p className="uos-hero-description" data-hero-reveal>
            I’m <strong>Sk Ahsan Ahmad</strong>, known as UltraOP. From competitive gaming and live streams to Minecraft worlds and story-led videos, this is the home of everything I create.
          </p>
          <div className="uos-hero-actions" data-hero-reveal>
            <a className="uos-button uos-button-primary" href="#channels">Explore the network <ArrowDownRight size={16} aria-hidden="true" /></a>
            <a className="uos-button uos-button-secondary" href="/work/">Brand collaborations <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
          <div className="uos-hero-signoff" data-hero-reveal>
            <span>PLAYER → STREAMER → CREATOR</span>
            <span>ULTRAOP / EST. THROUGH PLAY</span>
          </div>
        </div>
        <div className="uos-hero-visual" data-hero-reveal>
          <CubeArtwork />
        </div>
      </div>
      <div className="uos-hero-bottom">
        <span>GAMES ARE THE MEDIUM.</span>
        <span className="uos-scroll-line" aria-hidden="true" />
        <span>STORIES MAKE THEM MATTER.</span>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ['MINECRAFT', 'LIVE STREAMING', 'COMMUNITY', 'CREATOR TECH', 'STORY-LED GAMING'];
  return (
    <div className="uos-marquee" aria-label="UltraOP creator focus">
      <div className="uos-marquee-track">
        {[...words, ...words].map((word, index) => (
          <span key={word + index}>{word}<i aria-hidden="true">✳</i></span>
        ))}
      </div>
    </div>
  );
}

function ChannelCard({ channel, index, stats, showStats = true }: { channel: typeof YOUTUBE_CHANNELS[number]; index: number; stats?: ChannelStats; showStats?: boolean }) {
  const subs = formatCount(stats?.subscribers);
  const views = formatCount(stats?.views);
  return (
    <article className="uos-channel-card" data-reveal>
      <div className={'uos-channel-art uos-channel-art-' + (index + 1)}>
        <div className="uos-channel-art-grid" />
        <span className="uos-channel-index">0{index + 1}</span>
        <span className="uos-channel-platform"><Youtube size={14} aria-hidden="true" /> OFFICIAL CHANNEL</span>
        <div className="uos-channel-glyph" aria-hidden="true">{index === 0 ? <Gamepad2 size={58} strokeWidth={1} /> : index === 1 ? <Blocks size={58} strokeWidth={1} /> : index === 2 ? <Play size={54} strokeWidth={1} /> : <Code2 size={54} strokeWidth={1} />}</div>
        <div className="uos-channel-art-title"><span>{channel.handle}</span><b>{channel.name}</b></div>
      </div>
      <div className="uos-channel-body">
        <p className="uos-channel-focus">{channel.focus}</p>
        {showStats && <div className="uos-channel-stats">
          <div><strong>{subs ?? '—'}</strong><span>{stats?.subscribersEstimated ? 'Est. subscribers' : 'Subscribers'}</span></div>
          <div><strong>{views ?? '—'}</strong><span>Total views</span></div>
        </div>}
        <div className="uos-channel-actions">
          <a
            className="uos-button uos-button-primary uos-subscribe-button"
            href={channel.url + '?sub_confirmation=1'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={'Subscribe to ' + channel.name + ' on YouTube'}
          >
            <Youtube size={15} aria-hidden="true" /> Subscribe <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a
            className="uos-button uos-button-secondary uos-channel-visit-button"
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={'View ' + channel.name + ' channel on YouTube'}
          >
            View channel <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

function ChannelsSection({ stats, compact = false }: { stats: StatsState; compact?: boolean }) {
  const channels = compact ? YOUTUBE_CHANNELS.slice(0, 4) : YOUTUBE_CHANNELS;
  return (
    <section id="channels" className="uos-section uos-channels-section">
      <div className="uos-container">
        <SectionHeading
          eyebrow="THE NETWORK / 01"
          title={<>One creator.<br /><span>Different worlds.</span></>}
          copy="Every channel has its own purpose. Follow the one that matches what you want to watch next."
          action={compact ? { label: 'Explore all channels', href: '/channels/' } : undefined}
        />
        <div className="uos-channel-grid">
          {channels.map((channel, index) => <ChannelCard key={channel.id} channel={channel} index={index} stats={stats.values[channel.key]} showStats={!compact} />)}
        </div>
        {!compact && <p className="uos-data-note">{stats.loading ? 'Checking public channel data…' : 'Subscriber and view counts appear only when a public data source returns a valid reading. No fallback numbers are used.'}</p>}
      </div>
    </section>
  );
}

function CreatorJourney({ compact = false }: { compact?: boolean }) {
  const steps = [
    { number: '01', label: 'THE COMPETITIVE CHAPTER', title: 'PUBG / BGMI', text: 'Competitive play, teams and organised scrims shaped the first part of the journey.' },
    { number: '02', label: 'THE LIVE CHAPTER', title: 'FREE FIRE / ROOTER', text: 'The move into live streaming built a stronger connection with viewers and the gaming community.' },
    { number: '03', label: 'THE CURRENT WORLD', title: 'MINECRAFT', text: 'Minecraft is the main focus today: live streams, builds, experiments and a growing storytelling direction.' },
    { number: '04', label: 'THE WIDER PLAYLIST', title: 'VARIETY / TECH', text: 'Valorant, GTA, other story-driven games, creator tools and technology projects remain part of the wider creative world.' }
  ];
  return (
    <section id="creator" className="uos-section uos-journey-section">
      <div className="uos-container">
        <SectionHeading
          eyebrow="THE CREATOR / 02"
          title={<>Not just the game.<br /><span>The journey behind it.</span></>}
          copy={compact ? undefined : 'A creator journey shaped by competitive play, community, platform changes and a new focus on Minecraft and stories.'}
          action={compact ? { label: 'Read the full story', href: '/about/' } : undefined}
        />
        <div className="uos-journey-grid">
          {steps.map((step) => (
            <article className="uos-journey-card" key={step.number} data-reveal>
              <span className="uos-journey-number">{step.number}</span>
              <p className="uos-eyebrow">{step.label}</p>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandWorkSection({ compact = false }: { compact?: boolean }) {
  const campaigns = compact ? BRAND_CAMPAIGNS : BRAND_CAMPAIGNS;
  return (
    <section id="work" className="uos-section uos-work-section">
      <div className="uos-container">
        <SectionHeading
          eyebrow="SELECTED COLLABORATIONS / 03"
          title={<>Creative work.<br /><span>Real partnerships.</span></>}
          copy="Selected brand and campaign records from the creator journey. Campaign names are shown without unverified reach or performance claims."
          action={compact ? { label: 'Discuss a campaign', href: '/contact/' } : undefined}
        />
        <div className="uos-brand-grid">
          {campaigns.map((brand, index) => (
            <article className="uos-brand-card" key={brand.name} data-reveal>
              <div className="uos-brand-card-top"><span>0{index + 1}</span><ArrowUpRight size={16} aria-hidden="true" /></div>
              <h3>{brand.name}</h3>
              <p>{brand.type}</p>
              <div className="uos-brand-card-bottom"><span>{brand.category}</span><span>{brand.year}</span></div>
            </article>
          ))}
        </div>
        <p className="uos-data-note">Selected collaboration records are maintained from the UltraOP website’s central registry.</p>
      </div>
    </section>
  );
}

function CommunitySection({ compact = false }: { compact?: boolean }) {
  const items = compact ? SOCIALS.slice(0, 6) : SOCIALS;
  return (
    <section id="community" className="uos-section uos-community-section">
      <div className="uos-container">
        <SectionHeading
          eyebrow="ACROSS THE NETWORK / 04"
          title={<>Find your way<br /><span>into the community.</span></>}
          copy="Official platform links in one place. Open the platform you use most and follow the relevant UltraOP profile."
          action={compact ? { label: 'All official links', href: '/community/' } : undefined}
        />
        <div className="uos-social-grid">
          {items.map((social) => (
            <a className="uos-social-card" href={getSocialHref(social.name, social.url)} target="_blank" rel="noopener noreferrer" key={social.url} data-reveal>
              <span className="uos-social-icon"><SocialIcon name={social.name} /></span>
              <span className="uos-social-copy"><strong>{social.name}</strong><small>{social.handle}</small></span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="uos-contact-section">
      <div className="uos-contact-orbit" aria-hidden="true" />
      <div className="uos-container uos-contact-inner" data-reveal>
        <p className="uos-eyebrow">BUSINESS / COLLABORATIONS</p>
        <h2>Make something<br /><span>worth watching.</span></h2>
        <p>For brand campaigns, sponsorships, creator collaborations and professional enquiries.</p>
        <a className="uos-button uos-button-light" href={'mailto:' + SITE.businessEmail}>{SITE.businessEmail}<ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

function SiteFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="uos-footer">
      <div className="uos-container">
        <div className="uos-footer-main">
          <div className="uos-footer-brand">
            <a className="uos-wordmark" href="/" aria-label="UltraOP home"><img src="/brand/ultraop-original.webp" alt="" width="34" height="34" /><span>ULTRA<span className="uos-wordmark-accent">OP</span></span></a>
            <p>Gaming creator. Storyteller. Builder.<br />The official home of Sk Ahsan Ahmad.</p>
          </div>
          <div className="uos-footer-links">
            <span className="uos-eyebrow">EXPLORE</span>
            <a href="/about/">Creator story</a><a href="/channels/">Channels</a><a href="/live/">Watch live</a><a href="/work/">Brand work</a><a href="/journal/">Journal</a><a href="/guides/">Gaming guides</a><a href="/games/">Games</a><a href="/esports/">Esports histories</a><a href="/site-map/">Website map</a>
          </div>
          <div className="uos-footer-links">
            <span className="uos-eyebrow">INFORMATION</span>
            <a href="/privacy.html">Privacy policy</a><a href="/cookie-policy.html">Cookie policy</a><a href="/terms.html">Terms & conditions</a><a href="/contact/">Business contact</a>
          </div>
        </div>
        <div className="uos-footer-bottom">
          <span>© {currentYear} ULTRAOP / SK AHSAN AHMAD</span>
          <span>BUILT AROUND THE CREATOR, NOT THE ALGORITHM.</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ stats }: { stats: StatsState }) {
  return (
    <>
      <HeroSection />
      <Marquee />
      <ChannelsSection stats={stats} compact />
      <CreatorJourney compact />
      <KnowledgeTeasers />
      <BrandWorkSection compact />
      <CommunitySection compact />
      <ContactSection />
    </>
  );
}

function InteriorHero({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description: string; children?: ReactNode }) {
  return (
    <section className="uos-interior-hero">
      <div className="uos-container">
        <a className="uos-back-link" href="/"><ArrowLeft size={15} aria-hidden="true" /> BACK TO ULTRAOP</a>
        <p className="uos-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="uos-interior-description">{description}</p>
        {children}
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <>
      <InteriorHero eyebrow="THE CREATOR / ABOUT" title={<>A player’s path.<br /><span>A creator’s next chapter.</span></>} description="I’m Sk Ahsan Ahmad, known as UltraOP. My journey has moved through competitive gaming, live streaming, community work and a new focus on Minecraft, storytelling and technology." />
      <CreatorJourney />
      <section className="uos-section">
        <div className="uos-container uos-story-columns">
          <div data-reveal><p className="uos-eyebrow">THE WAY I CREATE</p><h2>Always learning.<br /><span>Always building.</span></h2></div>
          <div className="uos-story-copy" data-reveal>
            <p>PUBG and the competitive scene were the starting point. Teams, organised scrims and the wider gaming community made gaming more than a casual pastime.</p>
            <p>When the platform landscape changed in India, Rooter became a new place to stream. Free Fire was a game to learn live, alongside the daily work of building an audience and showing up for a community. Moderation and community responsibilities became part of that chapter too.</p>
            <p>YouTube then became the main creator platform. Today, Minecraft is the central focus, with live streams and a larger interest in story-led videos, world-building, and repeatable formats that viewers can return to.</p>
            <p>Off-stream, the interests widen into Valorant, GTA and story-driven games. Technology and development are another creative outlet, from website work to Minecraft-related tools and production systems.</p>
          </div>
        </div>
      </section>
      <ContactSection />
    </>
  );
}

function ChannelsPage({ stats }: { stats: StatsState }) {
  return (
    <>
      <InteriorHero eyebrow="THE NETWORK / CHANNELS" title={<>Four channels.<br /><span>One creator identity.</span></>} description="Choose the channel that fits your interest. Current public statistics are loaded only when the external data service returns a valid response; unavailable values are not replaced with invented numbers." />
      <ChannelsSection stats={stats} />
      <div className="uos-container uos-data-note-wrap"><p className="uos-data-note">{stats.loading ? 'Checking public channel data…' : 'Statistics source: public third-party channel-data endpoint. Counts may be estimated and can differ from YouTube’s own current display.'}</p></div>
    </>
  );
}

function LivePage() {
  const liveLinks = [
    { name: 'YouTube', text: 'Primary channel & current content', url: SITE.youtube },
    ...SOCIALS.filter((item) => ['Twitch', 'Kick', 'Rooter'].includes(item.name)).map((item) => ({ name: item.name, text: 'Official streaming destination', url: item.url }))
  ];
  return (
    <>
      <InteriorHero eyebrow="WATCH / LIVE" title={<>When it goes live,<br /><span>join the session.</span></>} description="UltraOP streams across multiple platforms. This page links to official destinations rather than displaying an unverified live badge. Each platform controls its own stream status." />
      <section className="uos-section">
        <div className="uos-container uos-link-panel-grid">
          {liveLinks.map((item, index) => <a className="uos-link-panel" href={item.url} target="_blank" rel="noopener noreferrer" key={item.name} data-reveal><span className="uos-link-panel-number">0{index + 1}</span><SocialIcon name={item.name} /><h2>{item.name}</h2><p>{item.text}</p><span className="uos-text-link">Open official platform <ArrowUpRight size={15} aria-hidden="true" /></span></a>)}
        </div>
      </section>
    </>
  );
}

function CommunityPage() {
  return (
    <>
      <InteriorHero eyebrow="COMMUNITY / OFFICIAL LINKS" title={<>Stay connected.<br /><span>Choose your platform.</span></>} description="These are the profiles and community destinations listed in the UltraOP site registry. Always check the handle and URL before sharing personal information." />
      <CommunitySection />
    </>
  );
}

function WorkPage() {
  return (
    <>
      <InteriorHero eyebrow="BRAND WORK / PARTNERSHIPS" title={<>Creator-native ideas.<br /><span>Partnerships with purpose.</span></>} description="Selected campaign records from the UltraOP creator journey. I’m open to gaming, technology, entertainment and audience-relevant collaborations." />
      <BrandWorkSection />
      <ContactSection />
    </>
  );
}

function ContactPage() {
  return (
    <>
      <InteriorHero eyebrow="CONTACT / BUSINESS" title={<>Have a good idea?<br /><span>Let’s build it.</span></>} description="For sponsorships, brand integrations, creator campaigns, event enquiries and professional opportunities, use the official business email below." />
      <section className="uos-section">
        <div className="uos-container uos-contact-card" data-reveal>
          <span className="uos-contact-icon"><Mail size={22} aria-hidden="true" /></span>
          <p className="uos-eyebrow">OFFICIAL BUSINESS EMAIL</p>
          <h2>{SITE.businessEmail}</h2>
          <p>Include the brand or organisation, campaign goal, timing and the best way to follow up.</p>
          <a className="uos-button uos-button-primary" href={'mailto:' + SITE.businessEmail + '?subject=' + encodeURIComponent('Business enquiry for UltraOP')}>Email UltraOP <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </section>
    </>
  );
}

function JournalPage({ slug }: { slug?: string }) {
  const entry = slug ? JOURNAL_DETAILS[slug] : undefined;
  if (slug && entry) {
    return (
      <>
        <InteriorHero eyebrow={entry.eyebrow} title={<>{entry.title}</>} description={entry.summary}>
          <div className="uos-journal-tags">{entry.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </InteriorHero>
        <article className="uos-section">
          <div className="uos-container uos-journal-article">
            <p className="uos-eyebrow">{entry.era}</p>
            {entry.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            <a className="uos-button uos-button-secondary" href="/journal/"><ArrowLeft size={15} aria-hidden="true" /> All journal entries</a>
          </div>
        </article>
      </>
    );
  }
  return (
    <>
      <InteriorHero eyebrow="JOURNAL / THE CREATOR TIMELINE" title={<>The story behind<br /><span>the uploads.</span></>} description="A chronological look at the games, communities and creative shifts that shaped UltraOP. Dates are omitted where exact dates have not been confirmed." />
      <section className="uos-section">
        <div className="uos-container uos-journal-list">
          <a className="uos-journal-featured" href="/journal/ultraop-creator-story/" data-reveal>
            <span className="uos-eyebrow">FEATURED / THE CREATOR BEHIND ULTRAOP</span>
            <h2>UltraOP: The Creator Journey of Sk Ahsan Ahmad</h2>
            <p>A fuller story from PUBG and competitive scrims to Rooter streaming, YouTube, Minecraft storytelling and creator technology.</p>
            <span className="uos-knowledge-read">Read the creator story <ArrowUpRight size={15} aria-hidden="true" /></span>
          </a>
          {JOURNAL_ENTRIES.map((entry, index) => <a className="uos-journal-row" href={'/journal/' + entry.slug + '/'} key={entry.slug} data-reveal><span className="uos-journal-row-index">{String(index + 1).padStart(2, '0')}</span><span className="uos-journal-row-main"><small>{entry.eyebrow} / {entry.era}</small><strong>{entry.title}</strong><span>{entry.summary}</span></span><ArrowUpRight size={18} aria-hidden="true" /></a>)}
        </div>
      </section>
    </>
  );
}

function ToolkitPage() {
  return (
    <>
      <InteriorHero eyebrow="CREATOR TOOLKIT / PUBLIC RESOURCES" title={<>Resources, when<br /><span>they are ready.</span></>} description="This section is being rebuilt as a reliable home for published UltraOP assets. No download is listed unless the corresponding file is actually available." />
      <section className="uos-section"><div className="uos-container uos-empty-state" data-reveal><Code2 size={30} aria-hidden="true" /><h2>No public downloads yet.</h2><p>For now, follow the official channels for creator updates and project releases.</p><a className="uos-button uos-button-primary" href="/community/">Find official links <ArrowRight size={15} aria-hidden="true" /></a></div></section>
    </>
  );
}

function FanArtPage() {
  return (
    <>
      <InteriorHero eyebrow="COMMUNITY / FAN ART" title={<>Made by the community.<br /><span>Shared with permission.</span></>} description="Community artwork should be credited and published with the creator’s permission. This gallery will list works only when the assets and attribution details have been supplied and approved." />
      <section className="uos-section"><div className="uos-container uos-empty-state" data-reveal><Sparkles size={30} aria-hidden="true" /><h2>The gallery is being prepared.</h2><p>No artwork is displayed until its source and permission details are confirmed.</p><a className="uos-button uos-button-secondary" href="/contact/">Contact UltraOP <ArrowUpRight size={15} aria-hidden="true" /></a></div></section>
    </>
  );
}

function SupportPage() {
  return (
    <>
      <InteriorHero eyebrow="SUPPORT / OFFICIAL DESTINATIONS" title={<>Support the work.<br /><span>Follow the journey.</span></>} description="The simplest way to support UltraOP is to watch, share and follow official content. Use the links below to find verified platform destinations." />
      <CommunitySection />
    </>
  );
}

function SitemapPage() {
  const mainPages = [
    { label: 'Home', href: '/', description: 'Official UltraOP creator homepage.' },
    { label: 'About UltraOP', href: '/about/', description: 'Creator background and journey.' },
    { label: 'YouTube Channels', href: '/channels/', description: 'Official channels, subscribe links and public stats.' },
    { label: 'Watch Live', href: '/live/', description: 'Official streaming destinations.' },
    { label: 'Community', href: '/community/', description: 'Official social and community links.' },
    { label: 'Brand Work', href: '/work/', description: 'Campaign records and collaboration information.' },
    { label: 'Contact', href: '/contact/', description: 'Business and sponsorship contact.' },
    { label: 'Creator Journal', href: '/journal/', description: 'All articles in the creator timeline.' },
    { label: 'Creator Toolkit', href: '/assets/', description: 'Published creator resources.' },
    { label: 'Fan Art', href: '/fan-art/', description: 'Community creations and permissions.' },
    { label: 'Support UltraOP', href: '/support/', description: 'Official ways to follow and support the creator.' }
  ];
  const topicPages = [
    { label: 'Gaming Guides', href: '/guides/', description: 'Structured gaming knowledge library.' },
    { label: 'Games Directory', href: '/games/', description: 'Game-specific reference articles and update notes.' },
    { label: 'Esports Histories', href: '/esports/', description: 'Tournament winners by game, event and year.' },
    { label: 'Minecraft Versions', href: '/games/minecraft/versions/', description: 'Java Edition release guides and server-version advice.' },
    { label: 'VALORANT Updates', href: '/games/valorant/updates/', description: 'Patch notes organised by feature category.' }
  ];
  const resourcePages = [
    { label: 'Privacy Policy', href: '/privacy.html', description: 'Public-data and website privacy information.' },
    { label: 'Cookie Policy', href: '/cookie-policy.html', description: 'Browser and third-party request information.' },
    { label: 'Terms & Conditions', href: '/terms.html', description: 'Terms for using this website.' },
    { label: 'XML Sitemap (Google & Bing)', href: '/sitemap.xml', description: 'Machine-readable indexable pages.' },
    { label: 'robots.txt', href: '/robots.txt', description: 'Crawler access guidance and XML sitemap location.' },
    { label: 'llms.txt', href: '/llms.txt', description: 'AI-readable overview and official source links.' }
  ];
  return (
    <>
      <InteriorHero eyebrow="DIRECTORY / ALL PUBLISHED PAGES" title={<>One map.<br /><span>The whole UltraOP world.</span></>} description="A human-readable guide to this official creator website. Search engines use the XML sitemap; AI tools can use the llms.txt overview. These files support discovery but cannot guarantee indexing." />
      <section className="uos-section">
        <div className="uos-container uos-sitemap-layout">
          <div className="uos-sitemap-group" data-reveal>
            <p className="uos-eyebrow">01 / WEBSITE</p><h2>Main pages</h2>
            <div className="uos-sitemap-links">{mainPages.map((item) => <a href={item.href} key={item.href}><strong>{item.label}</strong><span>{item.description}</span><ArrowUpRight size={15} aria-hidden="true" /></a>)}</div>
          </div>
          <div className="uos-sitemap-group" data-reveal>
            <p className="uos-eyebrow">02 / JOURNAL</p><h2>Creator timeline</h2>
            <div className="uos-sitemap-links">{JOURNAL_ENTRIES.map((item) => <a href={'/journal/' + item.slug + '/'} key={item.slug}><strong>{item.title}</strong><span>{item.summary}</span><ArrowUpRight size={15} aria-hidden="true" /></a>)}</div>
          </div>
          <div className="uos-sitemap-group" data-reveal>
            <p className="uos-eyebrow">03 / TOPIC DIRECTORY</p><h2>Topic directories</h2>
            <div className="uos-sitemap-links">{topicPages.map((item) => <a href={item.href} key={item.href}><strong>{item.label}</strong><span>{item.description}</span><ArrowUpRight size={15} aria-hidden="true" /></a>)}</div>
          </div>
          <div className="uos-sitemap-group" data-reveal>
            <p className="uos-eyebrow">04 / KNOWLEDGE</p><h2>Games, versions & esports</h2>
            <div className="uos-sitemap-links">{KNOWLEDGE_ARTICLES.filter((item) => item.kind !== 'hub').map((item) => <a href={item.route} key={item.slug}><strong>{item.title}</strong><span>{item.description}</span><ArrowUpRight size={15} aria-hidden="true" /></a>)}</div>
          </div>
          <div className="uos-sitemap-group" data-reveal>
            <p className="uos-eyebrow">05 / REFERENCE</p><h2>Policies & crawler files</h2>
            <div className="uos-sitemap-links">{resourcePages.map((item) => <a href={item.href} key={item.href}><strong>{item.label}</strong><span>{item.description}</span><ArrowUpRight size={15} aria-hidden="true" /></a>)}</div>
          </div>
        </div>
      </section>
    </>
  );
}

function NotFoundPage() {
  return (
    <>
      <InteriorHero eyebrow="404 / NOT FOUND" title={<>This page left<br /><span>the server.</span></>} description="The link may have changed or the page may no longer be published. Explore the official pages from here." />
      <section className="uos-section"><div className="uos-container uos-not-found-links"><a href="/">Home <ArrowUpRight size={16} /></a><a href="/channels/">Channels <ArrowUpRight size={16} /></a><a href="/journal/">Journal <ArrowUpRight size={16} /></a><a href="/contact/">Contact <ArrowUpRight size={16} /></a></div></section>
    </>
  );
}

export default function UltraOPStudio() {
  const rootRef = useRef<HTMLDivElement>(null);
  const route = useMemo(() => normalizedPath(), []);
  const journalSlug = route.startsWith('/journal/') ? route.slice('/journal/'.length) : undefined;
  const channelStats = usePublicChannelStats(route === '/channels');

  useEffect(() => {
    const detail = journalSlug ? JOURNAL_DETAILS[journalSlug] : undefined;
    const knowledge = getKnowledgeArticle(route);
    const pageInfo = PAGE_COPY[route] ?? (knowledge ? {
      title: knowledge.title,
      description: knowledge.description
    } : detail ? {
      title: detail.title + ' | UltraOP Journal',
      description: detail.summary
    } : {
      title: 'Page not found | UltraOP',
      description: 'The requested UltraOP page could not be found. Explore the official creator website.'
    });
    document.title = pageInfo.title;
    setMeta('description', pageInfo.description);
    setMeta('og:title', pageInfo.title, 'property');
    setMeta('og:description', pageInfo.description, 'property');
    setMeta('og:url', 'https://ultraop.in' + (route === '/' ? '/' : route + '/'), 'property');
    setMeta('og:type', knowledge && knowledge.kind !== 'hub' ? 'article' : 'website', 'property');
    setMeta('og:image', 'https://ultraop.in/brand/ultraop-original.webp', 'property');
    setMeta('og:image:secure_url', 'https://ultraop.in/brand/ultraop-original.webp', 'property');
    setMeta('og:image:type', 'image/webp', 'property');
    setMeta('og:image:width', '142', 'property');
    setMeta('og:image:height', '161', 'property');
    setMeta('og:image:alt', 'UltraOP — Sk Ahsan Ahmad, gaming creator and live streamer on YouTube, Twitch, Rooter and Instagram.', 'property');
    setMeta('twitter:card', 'summary', 'name');
    setMeta('twitter:title', pageInfo.title, 'name');
    setMeta('twitter:description', pageInfo.description, 'name');
    setMeta('twitter:image', 'https://ultraop.in/brand/ultraop-original.webp', 'name');
    setMeta('twitter:image:alt', 'UltraOP — Sk Ahsan Ahmad | Gaming Creator and Live Streamer', 'name');
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://ultraop.in' + (route === '/' ? '/' : route + '/');
  }, [route, journalSlug]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-reveal]',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.82, stagger: 0.11, ease: 'power3.out', delay: 0.1 }
      );
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(element,
          { autoAlpha: 0, y: 25 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true }
          }
        );
      });
      if (window.matchMedia('(min-width: 850px)').matches) {
        gsap.to('.uos-cube', { rotationY: 360, rotationX: 360, duration: 28, repeat: -1, ease: 'none' });
        gsap.to('.uos-orbit-one', { rotation: 360, duration: 32, repeat: -1, ease: 'none' });
        gsap.to('.uos-orbit-two', { rotation: -360, duration: 45, repeat: -1, ease: 'none' });
      }
    }, rootRef);
    return () => context.revert();
  }, [route]);

  const content = (() => {
    if (route === '/') return <HomePage stats={channelStats} />;
    if (route === '/about') return <AboutPage />;
    if (route === '/channels') return <ChannelsPage stats={channelStats} />;
    if (route === '/live') return <LivePage />;
    if (route === '/community') return <CommunityPage />;
    if (route === '/work') return <WorkPage />;
    if (route === '/contact') return <ContactPage />;
    if (route === '/journal') return <JournalPage />;
    if (route === '/site-map') return <SitemapPage />;
    if (route === '/guides' || route === '/games' || route === '/esports' || route === '/games/minecraft/versions' || route === '/games/valorant/updates') return <KnowledgeDirectoryPage route={route} />;
    if (journalSlug && JOURNAL_DETAILS[journalSlug]) return <JournalPage slug={journalSlug} />;
    const knowledge = getKnowledgeArticle(route);
    if (knowledge) return knowledge.kind === 'hub' ? <KnowledgeDirectoryPage route={route} /> : <KnowledgeArticlePage article={knowledge} />;
    if (route === '/assets') return <ToolkitPage />;
    if (route === '/fan-art') return <FanArtPage />;
    if (route === '/support') return <SupportPage />;
    return <NotFoundPage />;
  })();

  return (
    <div className="ultraop-studio" ref={rootRef} id="top">
      <a className="uos-skip-link" href="#uos-main">Skip to content</a>
      <SiteHeader route={route} />
      <main id="uos-main">{content}</main>
      <SiteFooter />
    </div>
  );
}
