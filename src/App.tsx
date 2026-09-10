import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, ExternalLink, Instagram, Mail, Menu, MessageCircle, Play, Youtube } from 'lucide-react';
import { SITE, YOUTUBE_CHANNELS, SOCIALS } from './data/core';
import { LEGACY_BLOG_POSTS } from './data/legacyContent';

const nav = [
  ['home', 'Home'],
  ['channels', 'Channels'],
  ['live', 'Live'],
  ['story', 'Story'],
  ['community', 'Community'],
  ['journal', 'Journal'],
  ['contact', 'Contact'],
];

const profileImage = 'https://raw.githubusercontent.com/ultraop-in/ultra-in.github.io/main/images/ahsan-profile.png';
const journalImages: Record<string, string> = {
  'top-freefire-strategies': 'https://raw.githubusercontent.com/ultraop-in/ultra-in.github.io/main/images/freefire-strategies.jpg',
  'grow-as-gaming-creator': 'https://raw.githubusercontent.com/ultraop-in/ultra-in.github.io/main/images/creator-growth.jpg',
  'freefire-redeem-codes-jun-2023': 'https://raw.githubusercontent.com/ultraop-in/ultra-in.github.io/main/images/redeem-codes.jpg',
  'online-gaming-act-2025': 'https://raw.githubusercontent.com/ultraop-in/ultra-in.github.io/main/images/gaming-psychology.jpg',
};

function External({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-[var(--accent)] transition-colors">{children}<ArrowUpRight size={14} /></a>;
}

function CreatorPhoto({ className = '', alt = 'Sk Ahsan Ahmad — UltraOP creator' }: { className?: string; alt?: string }) {
  const [src, setSrc] = useState(profileImage);
  return <img src={src} onError={() => setSrc('/creator/creator-photo.svg')} alt={alt} className={className} />;
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`${visible ? 'is-visible' : ''} scroll-reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>{children}</div>;
}

function BrandMark() {
  return <div className="brand-lockup"><img src="/brand/ultraop-mark.svg" alt="UltraOP" className="brand-mark"/><span>ULTRA<span>OP</span></span></div>;
}

function ChannelCard({ channel, index }: { channel: typeof YOUTUBE_CHANNELS[number]; index: number }) {
  return <article className="channel-card">
    <div className="channel-art">
      <CreatorPhoto className="channel-photo" alt="UltraOP creator" />
      <div className="channel-art-shade" />
      <div className="channel-index">0{index + 1}</div>
      <div className="channel-platform"><Youtube size={15}/> YOUTUBE</div>
      <div className="channel-play"><Play size={18} fill="currentColor"/></div>
    </div>
    <div className="channel-body">
      <div><p className="mono channel-handle">{channel.handle}</p><h3>{channel.name}</h3></div>
      <p className="channel-focus">{channel.focus}</p>
      <div className="channel-actions"><a href={`${channel.url}?sub_confirmation=1`} target="_blank" rel="noopener noreferrer" className="channel-subscribe">Subscribe <ArrowUpRight size={14}/></a><a href={channel.url} target="_blank" rel="noopener noreferrer" className="channel-open" aria-label={`Open ${channel.name}`}><ExternalLink size={15}/></a></div>
    </div>
  </article>;
}

function SocialCard({ social }: { social: typeof SOCIALS[number] }) {
  return <a href={social.url} target="_blank" rel="noopener noreferrer" className="social-card"><span className="social-dot"/><div className="social-copy"><strong>{social.name}</strong><span>{social.handle}</span></div><ArrowUpRight size={16} className="social-arrow"/></a>;
}

function App() {
  const [menu, setMenu] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => { setMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const twitch = SOCIALS.find(s => s.name === 'Twitch');
  const kick = SOCIALS.find(s => s.name === 'Kick');
  const rooter = SOCIALS.find(s => s.name === 'Rooter');

  return <>
    <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }}/>
    <div className="noise"/>
    <div className="site-shell">
      <header className="site-header">
        <div className="shell header-inner">
          <button onClick={() => scrollTo('home')} aria-label="Go to UltraOP home"><BrandMark/></button>
          <nav className="desktop-nav">{nav.map(([id, label]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}</nav>
          <button className="menu-toggle" onClick={() => setMenu(!menu)} aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu}>{menu ? <X size={20}/> : <Menu size={20}/>}</button>
        </div>
        {menu && <div className="mobile-nav">{nav.map(([id, label]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}</div>}
      </header>

      <main id="main-content">
        <section id="home" className="hero shell">
          <div className="hero-copy">
            <Reveal><p className="eyebrow">OFFICIAL CREATOR / INDIA</p></Reveal>
            <Reveal delay={80}><h1>THIS IS<br/><span>ULTRAOP.</span></h1></Reveal>
            <Reveal delay={150}><p className="hero-lede">{SITE.creator} creates gaming stories, live moments and creator-led content across a growing network of channels and communities.</p></Reveal>
            <Reveal delay={220}><div className="hero-cta"><button className="button button-primary" onClick={() => scrollTo('channels')}>Explore the channels <ArrowDownRight size={15}/></button><a className="button button-ghost" href={SITE.youtube} target="_blank" rel="noopener noreferrer">Watch on YouTube <Youtube size={15}/></a></div></Reveal>
            <Reveal delay={290}><div className="hero-meta"><span><b>{String(YOUTUBE_CHANNELS.length).padStart(2, '0')}</b> official YouTube channels</span><span><b>{String(SOCIALS.length).padStart(2, '0')}</b> verified platforms</span><span><b>01</b> creator universe</span></div></Reveal>
          </div>
          <Reveal className="hero-visual" delay={120}>
            <div className="hero-photo-wrap"><CreatorPhoto className="hero-photo"/><div className="hero-photo-overlay"/><div className="hero-photo-grain"/>
              <div className="hero-stamp"><span>ULTRAOP</span><strong>LIVE / CREATE / CONNECT</strong></div>
              <div className="hero-name"><span>SK AHSAN AHMAD</span><b>CREATOR</b></div>
            </div>
            <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
          </Reveal>
        </section>

        <section className="marquee" aria-label="UltraOP creator network"><div className="marquee-track"><span>ULTRAOP</span><i>•</i><span>GAMING</span><i>•</i><span>STORYTELLING</span><i>•</i><span>LIVE</span><i>•</i><span>COMMUNITY</span><i>•</i><span>ULTRAOP</span><i>•</i><span>GAMING</span><i>•</i><span>STORYTELLING</span><i>•</i><span>LIVE</span><i>•</i><span>COMMUNITY</span></div></section>

        <section id="channels" className="section shell">
          <Reveal><div className="section-heading"><div><p className="eyebrow">01 / THE NETWORK</p><h2>Four channels.<br/><span>One identity.</span></h2></div><p className="section-intro">Different formats, different audiences, one UltraOP creative universe. The network is built to expand without redesigning the site.</p></div></Reveal>
          <div className="channel-grid">{YOUTUBE_CHANNELS.map((channel, index) => <Reveal key={channel.id} delay={index * 70}><ChannelCard channel={channel} index={index}/></Reveal>)}</div>
          <Reveal><div className="future-note"><span className="mono">NETWORK / READY FOR MORE</span><p>New official YouTube channels can be added to the network without changing the layout or navigation.</p></div></Reveal>
        </section>

        <section id="live" className="live-section">
          <div className="shell live-inner">
            <Reveal><div className="live-label"><span className="live-pulse"/>LIVE PRESENCE</div></Reveal>
            <Reveal delay={80}><h2>When the stream starts,<br/><span>be there.</span></h2></Reveal>
            <Reveal delay={140}><p>Follow the official streaming destinations. Availability is controlled by each platform.</p></Reveal>
            <Reveal delay={200}><div className="live-links"><a href={YOUTUBE_CHANNELS[0].url} target="_blank" rel="noopener noreferrer"><Youtube size={17}/> YouTube <ArrowUpRight size={14}/></a>{twitch && <a href={twitch.url} target="_blank" rel="noopener noreferrer">Twitch <ArrowUpRight size={14}/></a>}{kick && <a href={kick.url} target="_blank" rel="noopener noreferrer">Kick <ArrowUpRight size={14}/></a>}{rooter && <a href={rooter.url} target="_blank" rel="noopener noreferrer">Rooter <ArrowUpRight size={14}/></a>}</div></Reveal>
          </div>
        </section>

        <section id="story" className="section shell story-section">
          <div className="story-grid">
            <Reveal><div className="story-portrait"><CreatorPhoto className="story-photo"/><div className="portrait-label"><span>SK AHSAN AHMAD</span><b>ULTRAOP / 001</b></div></div></Reveal>
            <Reveal delay={100}><div className="story-copy"><p className="eyebrow">02 / THE CREATOR</p><h2>Not a channel.<br/><span>A universe.</span></h2><p>UltraOP is the creator identity of {SITE.creator}, built around entertaining gaming content, live interaction, storytelling and the people who keep coming back for the next upload.</p><p>The website is the front door: a place where every official channel, stream, community and piece of creator work has a clear home.</p><blockquote>“Content first. Community always.”</blockquote><div className="story-signature"><span className="mono">CREATOR / STORYTELLER / COMMUNITY</span><span className="signature">UltraOP</span></div></div></Reveal>
          </div>
        </section>

        <section id="community" className="community-section">
          <div className="shell">
            <Reveal><div className="section-heading community-heading"><div><p className="eyebrow">03 / THE COMMUNITY</p><h2>Find the real<br/><span>UltraOP.</span></h2></div><p className="section-intro">Official destinations only. Social, streaming and community platforms are kept together here so there is one reliable place to find the network.</p></div></Reveal>
            <div className="social-grid">{SOCIALS.map((social, index) => <Reveal key={social.url} delay={index * 45}><SocialCard social={social}/></Reveal>)}</div>
            <Reveal><div className="support-strip"><div><span className="eyebrow">DIRECT SUPPORT</span><h3>Keep the next upload moving.</h3><p>Official UPI: <strong>{SITE.upi}</strong></p></div><button onClick={() => navigator.clipboard?.writeText(SITE.upi)} className="copy-upi">Copy UPI <ExternalLink size={14}/></button></div></Reveal>
          </div>
        </section>

        <section id="journal" className="section shell journal-section">
          <Reveal><div className="section-heading"><div><p className="eyebrow">04 / JOURNAL</p><h2>Ideas, stories<br/><span>& notes.</span></h2></div><a className="view-all" href="/blog/">View the journal <ArrowUpRight size={15}/></a></div></Reveal>
          <div className="journal-grid">{LEGACY_BLOG_POSTS.map((post, index) => <Reveal key={post.slug} delay={index * 70}><a href={`/blog/${post.slug}/`} className="journal-card"><div className="journal-image"><img src={journalImages[post.slug]} alt="" loading="lazy"/><span>{String(index + 1).padStart(2, '0')}</span></div><div className="journal-copy"><div className="mono">{post.date}</div><h3>{post.title}</h3><p>{post.excerpt}</p><span className="read-more">Read story <ArrowUpRight size={14}/></span></div></a></Reveal>)}</div>
        </section>

        <section id="contact" className="contact-section">
          <div className="shell contact-inner">
            <Reveal><p className="eyebrow">05 / CONTACT</p></Reveal>
            <Reveal delay={80}><h2>Have an idea?<br/><span>Let's build it.</span></h2></Reveal>
            <Reveal delay={140}><p>For business enquiries, creator collaborations and professional opportunities.</p></Reveal>
            <Reveal delay={200}><a className="contact-email" href={`mailto:${SITE.businessEmail}`}><Mail size={18}/>{SITE.businessEmail}<ArrowUpRight size={18}/></a></Reveal>
            <Reveal delay={260}><div className="contact-links"><External href={SITE.youtube}><Youtube size={15}/> YouTube</External><External href={SITE.instagram}><Instagram size={15}/> Instagram</External><External href={SITE.discord}><MessageCircle size={15}/> Discord</External></div></Reveal>
          </div>
        </section>
      </main>

      <footer className="site-footer"><div className="shell footer-grid"><div><BrandMark/><p>Official creator website of {SITE.creator}.</p></div><div className="footer-links"><External href={SITE.youtube}>YouTube</External><External href={SITE.instagram}>Instagram</External><External href={SITE.discord}>Discord</External><a href={`mailto:${SITE.businessEmail}`}>Business</a></div><div className="footer-meta"><span>© {new Date().getFullYear()} UltraOP</span><span>Built for the next upload.</span></div></div></footer>
    </div>
  </>;
}

export default App;
