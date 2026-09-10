import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ChevronDown, Instagram, Mail, Menu, MessageCircle, Play, X, Youtube } from 'lucide-react';
import { SITE, YOUTUBE_CHANNELS, SOCIALS, BRAND_CAMPAIGNS } from './data/core';

const profileImage = 'https://raw.githubusercontent.com/ultraop-in/ultra-in.github.io/main/images/ahsan-profile.png';

type ChannelStats = {
  subscribers: number | null;
  totalViews: number | null;
  monthlyViews: number | null;
  recentViews: number | null;
  videos: number | null;
};

type SocialCountResponse = {
  est_sub?: number;
  API_sub?: number;
  table?: Array<{ name?: string; count?: number }>;
  views?: number;
  videos?: number;
};

const emptyStats: ChannelStats = { subscribers: null, totalViews: null, monthlyViews: null, recentViews: null, videos: null };

function formatNumber(value: number | null, compact = true) {
  if (value === null || Number.isNaN(value)) return '—';
  if (!compact) return value.toLocaleString('en-IN');
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1)}K`;
  return value.toLocaleString('en-IN');
}

function parseStats(data: SocialCountResponse): ChannelStats {
  const rows = Array.isArray(data.table) ? data.table : [];
  const numericRows = rows.map(row => ({ name: String(row.name ?? ''), count: Number(row.count ?? 0) })).filter(row => Number.isFinite(row.count));
  const viewsRows = numericRows.filter(row => /view/i.test(row.name));
  const recent = viewsRows.slice(0, 10).reduce((sum, row) => sum + Math.max(0, row.count), 0) || null;
  const monthly = viewsRows.slice(0, 30).reduce((sum, row) => sum + Math.max(0, row.count), 0) || null;
  return {
    subscribers: Number(data.est_sub ?? data.API_sub ?? 0) || null,
    totalViews: Number(data.views ?? 0) || null,
    monthlyViews: monthly,
    recentViews: recent,
    videos: Number(data.videos ?? 0) || null,
  };
}

function useChannelStats() {
  const [stats, setStats] = useState<Record<string, ChannelStats>>({});
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const entries = await Promise.all(YOUTUBE_CHANNELS.map(async channel => {
        try {
          const response = await fetch(`https://api.socialcounts.org/youtube-live-subscriber-count/${channel.id}`, { cache: 'no-store' });
          if (!response.ok) throw new Error('stats unavailable');
          const data = await response.json() as SocialCountResponse;
          return [channel.key, parseStats(data)] as const;
        } catch {
          return [channel.key, emptyStats] as const;
        }
      }));
      if (!cancelled) setStats(Object.fromEntries(entries));
    };
    load();
    const timer = window.setInterval(load, 15 * 60 * 1000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, []);
  return stats;
}

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    ['/', 'Home'], ['/about/', 'About'], ['/channels/', 'Channels'], ['/live/', 'Live'], ['/community/', 'Community'], ['/work/', 'Brand Work'], ['/fan-art/', 'Fan Art'], ['/assets/', 'Assets'], ['/journal/', 'Journal'], ['/contact/', 'Contact'],
  ];
  return <header className="home-nav"><div className="home-nav-inner"><a className="home-wordmark" href="/"><img src="/brand/ultraop-mark.svg" alt="UltraOP"/><span>Ultra<em>OP</em></span></a><nav>{links.slice(0, 6).map(([href, label]) => <a key={href} href={href}>{label}</a>)}</nav><button onClick={() => setOpen(v => !v)} aria-label="Open UltraOP navigation" className="home-menu">{open ? <X size={20}/> : <Menu size={20}/>}</button></div>{open && <div className="home-side-menu"><div className="home-side-head"><span>ULTRAOP / NAVIGATION</span><span>01—10</span></div>{links.map(([href, label], i) => <a href={href} key={href} onClick={() => setOpen(false)}><span>0{Math.min(i + 1, 9)}</span>{label}<ArrowUpRight size={15}/></a>)}</div>}</header>;
}

function SectionTitle({ kicker, title, action }: { kicker: string; title: string; action?: string }) { return <div className="home-section-title"><div><span>{kicker}</span><h2>{title}</h2></div>{action && <a href={action === 'Fan Art' ? '/fan-art/' : action === 'Assets' ? '/assets/' : '/work/'}>{action}<ArrowUpRight size={15}/></a>}</div>; }

function IntroStats({ stats }: { stats: Record<string, ChannelStats> }) {
  const totalSubs = Object.values(stats).reduce((sum, item) => sum + (item.subscribers ?? 0), 0);
  const totalMonthly = Object.values(stats).reduce((sum, item) => sum + (item.monthlyViews ?? 0), 0);
  const totalRecent = Object.values(stats).reduce((sum, item) => sum + (item.recentViews ?? 0), 0);
  return <div className="home-network-panel"><div className="network-label">NETWORK SNAPSHOT / PUBLIC DATA</div><div className="network-primary"><strong>{formatNumber(totalSubs)}</strong><span>combined YouTube subscribers</span></div><div className="network-grid"><div><b>{formatNumber(totalMonthly)}</b><span>30-day views</span></div><div><b>{formatNumber(totalRecent)}</b><span>last 10 days</span></div><div><b>04</b><span>official channels</span></div><div><b>01</b><span>creator identity</span></div></div><small>Subscriber figures are public estimates and may be rounded by YouTube/analytics providers.</small></div>;
}

function Hero({ stats }: { stats: Record<string, ChannelStats> }) {
  return <section className="home-hero"><div className="home-hero-grid"><div className="home-hero-copy"><p className="home-eyebrow">ULTRAOP / OFFICIAL CREATOR WEBSITE</p><h1>Gaming creator.<br/><span>Storyteller.</span><br/>Builder.</h1><p className="home-intro">I'm <strong>Sk Ahsan Ahmad</strong>, the creator behind UltraOP. What started with competitive gaming and live streams has grown into a connected creator world spanning YouTube, Minecraft, Roblox, community, brand work and technology.</p><div className="home-hero-actions"><a className="home-button primary" href="/about/">Meet the creator <ArrowUpRight size={16}/></a><a className="home-button" href="/channels/">Explore the channels <ArrowUpRight size={16}/></a></div></div><div className="home-hero-side"><div className="home-portrait"><img src={profileImage} onError={e => { e.currentTarget.src = '/creator/creator-photo.svg'; }} alt="Sk Ahsan Ahmad"/><span>SK AHSAN AHMAD / ULTRAOP</span></div><IntroStats stats={stats}/></div></div><div className="home-scroll-note"><span>01</span><span>SCROLL TO EXPLORE</span><ChevronDown size={15}/></div></section>;
}

function BrandRail() {
  return <section className="home-brand-section"><SectionTitle kicker="COLLABORATIONS / BRAND WORK" title="Brands that have entered the story." action="Brand Work"/><div className="home-brand-rail">{BRAND_CAMPAIGNS.map((brand, i) => <a className={`home-brand-card brand-${i}`} key={brand.name} href="/work/"><div className="home-brand-logo">{brand.logo ? <img src={brand.logo} alt={`${brand.name} logo`} /> : <strong>{brand.name}</strong>}</div><span>{brand.category}</span><small>{brand.year}</small></a>)}</div></section>;
}

function ChannelCard({ channel, stats }: { channel: typeof YOUTUBE_CHANNELS[number]; stats: ChannelStats }) {
  return <article className="home-channel-card"><div className="home-channel-top"><span>{channel.handle}</span><a href={`${channel.url}?sub_confirmation=1`} target="_blank" rel="noreferrer">YouTube <ArrowUpRight size={14}/></a></div><div className="home-channel-main"><div><p>0{YOUTUBE_CHANNELS.findIndex(item => item.key === channel.key) + 1}</p><h3>{channel.name}</h3><span>{channel.focus}</span></div><div className="home-channel-stats"><div><b>{formatNumber(stats.subscribers)}</b><span>subs</span></div><div><b>{formatNumber(stats.totalViews)}</b><span>views</span></div><div><b>{formatNumber(stats.recentViews)}</b><span>10-day views</span></div></div></div><div className="home-channel-video"><iframe title={`${channel.name} latest uploads`} src={`https://www.youtube.com/embed/videoseries?list=${channel.uploadsPlaylist}&rel=0&modestbranding=1`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/></div></article>;
}

function ReachSection({ stats }: { stats: Record<string, ChannelStats> }) { return <section className="home-reach"><SectionTitle kicker="PLATFORM REACH / GAMING COMMUNITY" title="Four channels. Different audiences. One creator network."/><div className="home-channel-grid">{YOUTUBE_CHANNELS.map(channel => <ChannelCard key={channel.key} channel={channel} stats={stats[channel.key] ?? emptyStats}/>)}</div></section>; }

function YouTubeTab({ stats }: { stats: Record<string, ChannelStats> }) { return <div className="home-tab-content"><div className="home-tab-lead"><span>YOUTUBE / THE MAIN ENGINE</span><h3>Long-form gaming, live streams and the next chapter.</h3><p>Every official channel has its own role. The network keeps the audience connected while letting each format stay focused.</p></div><div className="home-mini-list">{YOUTUBE_CHANNELS.map(channel => <a href={channel.url} target="_blank" rel="noreferrer" key={channel.key}><span>{channel.name}</span><b>{formatNumber(stats[channel.key]?.recentViews ?? null)}</b><small>last 10 days</small><ArrowUpRight size={15}/></a>)}</div></div>; }
function InstagramTab() { const instagram = SOCIALS.filter(item => item.name.startsWith('Instagram')); return <div className="home-tab-content"><div className="home-tab-lead"><span>INSTAGRAM / SHORT-FORM & PERSONALITY</span><h3>Fast updates, creator moments and behind-the-scenes.</h3><p>Follow the official Instagram destinations for short-form content, creator updates and the people behind the network.</p></div><div className="home-mini-list">{instagram.map(item => <a href={item.url} target="_blank" rel="noreferrer" key={item.url}><span>{item.name}</span><b>{item.handle}</b><small>official profile</small><ArrowUpRight size={15}/></a>)}</div></div>; }
function BrandTab() { return <div className="home-tab-content"><div className="home-tab-lead"><span>BRAND WORK / PARTNERSHIPS</span><h3>Creator-native campaigns, not generic placements.</h3><p>Gaming, tech, lifestyle and youth-focused collaborations designed around the audience and the story.</p></div><div className="home-mini-list">{BRAND_CAMPAIGNS.slice(0, 5).map(brand => <a href="/work/" key={brand.name}><span>{brand.name}</span><b>{brand.type}</b><small>{brand.year}</small><ArrowUpRight size={15}/></a>)}</div></div>; }

function PlatformTabs({ stats }: { stats: Record<string, ChannelStats> }) { const [tab, setTab] = useState<'youtube' | 'instagram' | 'brand'>('youtube'); return <section className="home-platforms"><SectionTitle kicker="THE NETWORK / ACROSS PLATFORMS" title="Different formats. Same UltraOP world."/><div className="home-tabs"><button className={tab === 'youtube' ? 'active' : ''} onClick={() => setTab('youtube')}><Youtube size={16}/> YouTube</button><button className={tab === 'instagram' ? 'active' : ''} onClick={() => setTab('instagram')}><Instagram size={16}/> Instagram</button><button className={tab === 'brand' ? 'active' : ''} onClick={() => setTab('brand')}><span className="tab-dot"/> Brand Work</button></div>{tab === 'youtube' && <YouTubeTab stats={stats}/>} {tab === 'instagram' && <InstagramTab/>} {tab === 'brand' && <BrandTab/>}</section>; }

const tools = [
  ['DaVinci Resolve', 'Editing / post-production'], ['OBS Studio', 'Live production'], ['Minecraft', 'Core content world'], ['Visual Studio Code', 'Development'], ['GitHub', 'Projects / releases'], ['Adobe Photoshop', 'Thumbnails / design'],
];
function ToolsSection() { return <section className="home-tools"><SectionTitle kicker="THE TOOLKIT / CREATOR + BUILDER" title="The tools behind the work."/><div className="home-tools-grid">{tools.map(([name, role], i) => <div key={name} className="home-tool"><span>0{i + 1}</span><div><h3>{name}</h3><p>{role}</p></div></div>)}</div></section>; }

function FooterContact() { return <><section className="home-contact"><div><span className="home-eyebrow">BUSINESS / CONTACT</span><h2>Have something worth building?</h2><p>For sponsorships, creator campaigns, collaborations, media enquiries and professional opportunities.</p></div><a className="home-contact-button" href={`mailto:${SITE.businessEmail}`}><Mail size={18}/><span>{SITE.businessEmail}</span><ArrowUpRight size={17}/></a></section><footer className="home-footer"><div className="home-footer-brand"><a className="home-wordmark" href="/"><img src="/brand/ultraop-mark.svg" alt="UltraOP"/><span>Ultra<em>OP</em></span></a><p>Gaming, storytelling, community and technology — connected under one creator identity.</p></div><div className="home-footer-links"><a href="/about/">About</a><a href="/channels/">Channels</a><a href="/work/">Brand Work</a><a href="/fan-art/">Fan Art</a><a href="/assets/">Assets</a><a href="/journal/">Journal</a><a href="/contact/">Contact</a></div><div className="home-footer-social"><a href={SITE.youtube} target="_blank" rel="noreferrer"><Youtube size={17}/> YouTube</a><a href={SITE.instagram} target="_blank" rel="noreferrer"><Instagram size={17}/> Instagram</a><a href={SITE.discord} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Discord</a></div><div className="home-footer-bottom"><span>© {new Date().getFullYear()} UltraOP / Sk Ahsan Ahmad</span><span><a href="/terms.html">Terms</a><a href="/privacy.html">Privacy</a></span></div></footer></>; }

export default function CreatorHome() { const stats = useChannelStats(); const totalViews = useMemo(() => Object.values(stats).reduce((sum, item) => sum + (item.totalViews ?? 0), 0), [stats]); return <div className="creator-home"><Nav/><main><Hero stats={stats}/><div className="home-total-strip"><span>NETWORK TOTAL VIEWS</span><strong>{formatNumber(totalViews)}</strong><span>across official YouTube channels</span></div><BrandRail/><ReachSection stats={stats}/><PlatformTabs stats={stats}/><ToolsSection/><FooterContact/></main></div>; }
