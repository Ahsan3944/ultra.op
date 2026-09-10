import { useEffect, useState } from 'react';
import { ArrowUpRight, ExternalLink, Instagram, Mail, Menu, MessageCircle, Users, X, Youtube } from 'lucide-react';
import { SITE, YOUTUBE_CHANNELS, SOCIALS, BRAND_CAMPAIGNS } from './data/core';
import { LEGACY_BLOG_POSTS } from './data/legacyContent';

const nav = [
  ['home', 'Home'],
  ['channels', 'Channels'],
  ['story', 'Story'],
  ['collabs', 'Work'],
  ['journal', 'Journal'],
  ['contact', 'Contact'],
];

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors">{children}<ArrowUpRight size={13} /></a>;
}

function ChannelCard({ channel, index }: { channel: typeof YOUTUBE_CHANNELS[number]; index: number }) {
  return <article className="card p-5 md:p-6 rounded-[2px] group transition-all duration-300">
    <div className="flex items-start justify-between gap-4 mb-10"><span className="mono text-xs text-[var(--muted)]">0{index + 1}</span><span className="eyebrow">YouTube</span></div>
    <div className="mb-8"><h3 className="text-2xl font-extrabold tracking-[-0.04em] mb-2">{channel.name}</h3><p className="mono text-xs text-[var(--muted)]">{channel.handle}</p></div>
    <p className="text-sm text-[var(--muted)] leading-6 min-h-12">{channel.focus}</p>
    <div className="rule my-6"/>
    <div className="flex items-center justify-between text-xs"><span className="mono text-[var(--muted)]">CHANNEL ID</span><span className="mono text-right max-w-[58%] truncate">{channel.id}</span></div>
    <div className="mt-6 flex gap-2"><a href={`${channel.url}?sub_confirmation=1`} target="_blank" rel="noopener noreferrer" className="flex-1 px-4 py-3 bg-[var(--cream)] text-black text-[11px] font-bold uppercase tracking-[.14em] text-center hover:bg-[var(--accent)] transition-colors">Subscribe</a><a href={channel.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${channel.name}`} className="px-4 py-3 border border-[var(--line)] hover:border-[#615d56] transition-colors"><ExternalLink size={15}/></a></div>
  </article>;
}

function App() {
  const [menu, setMenu] = useState(false);
  const [live, setLive] = useState(false);
  const [liveTitle, setLiveTitle] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const r = await fetch('/api/youtube/live', { signal: controller.signal });
        if (!r.ok) return;
        const json = await r.json();
        const item = Array.isArray(json?.data) ? json.data.find((x: any) => x?.isLive || x?.liveVideoId) : json?.data;
        setLive(Boolean(item?.isLive || item?.liveVideoId));
        setLiveTitle(item?.liveTitle || 'UltraOP is live');
      } catch {}
    };
    load();
    const t = window.setInterval(load, 60000);
    return () => { controller.abort(); window.clearInterval(t); };
  }, []);

  const scrollTo = (id: string) => { setMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  return <><div className="noise"/><div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[#0a0a0a]/90 backdrop-blur-xl">
      <div className="shell h-16 flex items-center justify-between">
        <button onClick={() => scrollTo('home')} className="flex items-center gap-3"><div className="w-8 h-8 rounded-full border border-[var(--line)] flex items-center justify-center bg-[var(--surface)]">U</div><span className="font-extrabold tracking-[-0.04em]">ULTRA<span className="text-[var(--accent)]">OP</span></span></button>
        <nav className="hidden xl:flex items-center gap-6 text-[11px] uppercase tracking-[.14em] text-[#bcb8b0]">{nav.map(([id,label]) => <button key={id} onClick={() => scrollTo(id)} className="hover:text-white transition-colors">{label}</button>)}</nav>
        <div className="flex items-center gap-2">{live && <button onClick={() => scrollTo('live')} className="hidden sm:flex items-center gap-2 px-3 py-2 border border-[var(--accent)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-[.14em]"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"/>Live</button>}<a href={`mailto:${SITE.businessEmail}`} className="hidden md:inline-flex px-3 py-2 bg-[var(--cream)] text-black text-[10px] font-bold uppercase tracking-[.14em]">Business</a><button onClick={() => setMenu(!menu)} className="xl:hidden p-2 border border-[var(--line)]">{menu ? <X size={18}/> : <Menu size={18}/>}</button></div>
      </div>
      {menu && <div className="xl:hidden border-t border-[var(--line)] bg-[var(--surface)] p-4 grid grid-cols-2 gap-2">{nav.map(([id,label]) => <button key={id} onClick={() => scrollTo(id)} className="p-3 border border-[var(--line)] text-left text-xs uppercase tracking-[.12em]">{label}</button>)}</div>}
    </header>

    <main>
      <section id="home" className="shell pt-16 md:pt-24 pb-20 md:pb-28">
        <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-12 items-end">
          <div className="reveal"><div className="eyebrow mb-5">Official creator portal / India</div><h1 className="display text-[clamp(3.7rem,11vw,9.8rem)] font-extrabold max-w-5xl">CREATE.<br/><span className="text-[var(--accent)]">CONNECT.</span><br/>REPEAT.</h1><p className="mt-8 max-w-2xl text-base md:text-lg leading-8 text-[var(--muted)]">{SITE.creator} — building the UltraOP universe through gaming content, Minecraft storytelling, live broadcasts, community and creator-led work.</p><div className="mt-8 flex flex-wrap gap-3"><button onClick={() => scrollTo('channels')} className="px-5 py-3.5 bg-[var(--cream)] text-black text-[11px] font-bold uppercase tracking-[.14em]">Explore channels</button><button onClick={() => scrollTo('collabs')} className="px-5 py-3.5 border border-[var(--line)] text-[11px] font-bold uppercase tracking-[.14em]">Work with UltraOP</button></div></div>
          <div className="card p-5 md:p-6 reveal" style={{animationDelay:'120ms'}}><div className="eyebrow mb-4">Today / UltraOP</div><div className="aspect-[4/3] bg-[var(--surface-2)] border border-[var(--line)] overflow-hidden flex items-end p-5 relative"><div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_15%,rgba(231,106,75,.32),transparent_35%),linear-gradient(145deg,#181715,#0e0e0d)]"/><div className="relative z-10"><div className="mono text-xs text-[var(--muted)] mb-2">CREATOR / STORYTELLER</div><div className="text-3xl md:text-4xl font-extrabold tracking-[-.05em]">Built for the<br/><span className="text-[var(--accent)]">next upload.</span></div></div></div><div className="grid grid-cols-3 gap-3 mt-3"><div className="border border-[var(--line)] p-4"><div className="mono text-lg">4</div><div className="text-[10px] text-[var(--muted)] uppercase tracking-wider mt-1">YouTube channels</div></div><div className="border border-[var(--line)] p-4"><div className="mono text-lg">6</div><div className="text-[10px] text-[var(--muted)] uppercase tracking-wider mt-1">Brand campaigns</div></div><div className="border border-[var(--line)] p-4"><div className="mono text-lg">01</div><div className="text-[10px] text-[var(--muted)] uppercase tracking-wider mt-1">Creator</div></div></div></div>
        </div>
      </section>

      <div className="shell"><div className="rule"/></div>

      <section id="live" className="shell py-14"><div className={`border p-5 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 ${live ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--line)] bg-[var(--surface)]'}`}><div><div className="eyebrow mb-2">Broadcast status</div><h2 className="text-2xl md:text-3xl font-extrabold tracking-[-.04em]">{live ? liveTitle : 'No live broadcast right now.'}</h2><p className="mt-2 text-sm text-[var(--muted)]">The homepage checks the official YouTube network automatically.</p></div><a href={YOUTUBE_CHANNELS[0].url} target="_blank" rel="noopener noreferrer" className="px-5 py-3 border border-[var(--line)] text-[10px] font-bold uppercase tracking-[.14em] inline-flex items-center gap-2">Open main channel <Youtube size={14}/></a></div></section>

      <section id="channels" className="shell py-16 md:py-24"><div className="flex items-end justify-between gap-5 mb-10"><div><div className="eyebrow mb-3">01 / Broadcast network</div><h2 className="text-4xl md:text-6xl font-extrabold tracking-[-.06em]">The channels.</h2></div><span className="mono text-xs text-[var(--muted)]">4 canonical IDs</span></div><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">{YOUTUBE_CHANNELS.map((c,i)=><ChannelCard channel={c} index={i} key={c.id}/>)}</div></section>

      <section id="story" className="shell py-16 md:py-24"><div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-start"><div><div className="eyebrow mb-3">02 / Creator story</div><h2 className="text-4xl md:text-6xl font-extrabold tracking-[-.06em]">A creator brand<br/><span className="text-[var(--accent)]">built to last.</span></h2></div><div className="space-y-7 text-[var(--muted)] leading-8"><p>UltraOP is a creator-led media identity focused on entertaining gaming content, Minecraft stories, live interaction and useful creator knowledge.</p><p>The website is the professional front door: a clear place to discover the channels, understand the creator, see commercial work and find the right way to connect.</p><div className="border-l border-[var(--accent)] pl-5 text-[var(--text)]">Content first. Community always. A brand that feels intentional without feeling corporate.</div></div></div></section>

      <section id="collabs" className="bg-[var(--cream)] text-black py-16 md:py-24"><div className="shell"><div className="flex items-end justify-between mb-10 gap-5"><div><div className="eyebrow text-[#9b4c39] mb-3">03 / Commercial archive</div><h2 className="text-4xl md:text-6xl font-extrabold tracking-[-.06em]">Brands & campaigns.</h2></div><span className="mono text-xs text-black/50">verified archive</span></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/15">{BRAND_CAMPAIGNS.map(b=><article className="bg-[var(--cream)] p-6 min-h-48" key={b.name}><div className="mono text-xs text-black/45">{b.year}</div><h3 className="text-2xl font-extrabold tracking-[-.04em] mt-10">{b.name}</h3><p className="text-sm mt-2 text-black/60">{b.type}</p><div className="mono text-[10px] uppercase tracking-widest mt-8 text-black/45">{b.category}</div></article>)}</div><div className="mt-10 flex flex-wrap items-center justify-between gap-5"><p className="max-w-xl text-sm text-black/60">For brand partnerships, campaigns and creator collaborations, use the official business contact.</p><a href={`mailto:${SITE.businessEmail}`} className="px-5 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-[.14em]">Business enquiries</a></div></div></section>

      <section id="journal" className="shell py-16 md:py-24"><div className="grid lg:grid-cols-[.7fr_1.3fr] gap-10"><div><div className="eyebrow mb-3">04 / Journal</div><h2 className="text-4xl md:text-6xl font-extrabold tracking-[-.06em]">Useful things<br/>for creators.</h2><p className="mt-6 max-w-md text-sm leading-7 text-[var(--muted)]">A growing archive of gaming, creator education and industry explainers from the UltraOP site.</p></div><div className="space-y-0">{LEGACY_BLOG_POSTS.map((post,i)=><a className="article-row" href={`/blog/${post.slug}/`} key={post.slug}><div><span className="mono text-xs text-[var(--muted)]">0{i+1} · {post.date}</span><h3 className="text-xl font-bold mt-2">{post.title}</h3><p className="text-xs text-[var(--muted)] mt-2">{post.category}</p></div><ArrowUpRight className="text-[var(--muted)] shrink-0"/></a>)}<a href="/blog/" className="mt-6 inline-flex items-center gap-2 px-5 py-3 border border-[var(--line)] text-[10px] font-bold uppercase tracking-[.14em]">View all journal posts <ArrowUpRight size={14}/></a></div></div></section>

      <section id="contact" className="border-t border-[var(--line)] bg-[var(--surface)] py-16 md:py-24"><div className="shell"><div className="grid lg:grid-cols-[1fr_1fr] gap-12"><div><div className="eyebrow mb-3">05 / Contact</div><h2 className="text-4xl md:text-6xl font-extrabold tracking-[-.06em]">Let’s build<br/><span className="text-[var(--accent)]">something.</span></h2><p className="mt-6 max-w-lg text-sm md:text-base leading-7 text-[var(--muted)]">Business partnerships, campaigns, creator collaborations or general community enquiries — start with the official channels below.</p></div><div className="grid sm:grid-cols-2 gap-3"><a href={`mailto:${SITE.businessEmail}`} className="card p-5 hover:border-[#4a4842] transition-colors"><Mail size={18}/><div className="eyebrow mt-8 mb-2">Business</div><div className="text-sm font-semibold break-all">{SITE.businessEmail}</div></a><a href={SITE.discord} target="_blank" rel="noopener noreferrer" className="card p-5 hover:border-[#4a4842] transition-colors"><MessageCircle size={18}/><div className="eyebrow mt-8 mb-2">Community</div><div className="text-sm font-semibold">Join Discord</div></a><a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="card p-5 hover:border-[#4a4842] transition-colors"><Instagram size={18}/><div className="eyebrow mt-8 mb-2">Social</div><div className="text-sm font-semibold">@ultraopp</div></a><a href={SITE.youtube} target="_blank" rel="noopener noreferrer" className="card p-5 hover:border-[#4a4842] transition-colors"><Youtube size={18}/><div className="eyebrow mt-8 mb-2">Main channel</div><div className="text-sm font-semibold">@ultraoplive</div></a></div></div></div></section>

      <section className="shell py-14"><div className="border border-[var(--line)] p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8"><div><div className="eyebrow mb-2">Everywhere the creator is</div><h2 className="text-2xl md:text-3xl font-extrabold tracking-[-.04em]">Follow the wider UltraOP network.</h2></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-[var(--muted)]">{SOCIALS.map(s=><External href={s.url} key={s.name}>{s.name}</External>)}</div></div></section>
    </main>

    <footer className="border-t border-[var(--line)] py-10"><div className="shell grid md:grid-cols-[1fr_auto] gap-8"><div><div className="text-2xl font-extrabold tracking-[-.04em]">ULTRA<span className="text-[var(--accent)]">OP</span></div><p className="mt-2 text-sm text-[var(--muted)]">{SITE.tagline}</p></div><div className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-[var(--muted)]"><External href={SITE.youtube}><Youtube size={14}/> YouTube</External><External href={SITE.instagram}><Instagram size={14}/> Instagram</External><External href={SITE.discord}><Users size={14}/> Discord</External><External href={`mailto:${SITE.businessEmail}`}><Mail size={14}/> Business</External></div></div><div className="shell mt-8 text-[10px] mono text-[var(--muted)]">© {new Date().getFullYear()} UltraOP · Official creator portal</div></footer>
  </div></>;
}

export default App;
