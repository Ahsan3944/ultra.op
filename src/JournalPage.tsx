import { ArrowLeft, ArrowUpRight, BookOpen, Clock3 } from 'lucide-react';
import { JOURNAL_ENTRIES } from './data/journal';
import { LEGACY_BLOG_POSTS } from './data/legacyContent';

function BrandHeader() {
  return <header className="journal-header"><div className="shell journal-header-inner"><a href="/" className="journal-brand"><img src="/brand/ultraop-mark.svg" alt="UltraOP official logo"/><span>ULTRA<span>OP</span></span></a><a href="/" className="journal-back"><ArrowLeft size={14}/> Home</a></div></header>;
}

export function JournalPage() {
  return <div className="journal-page"><BrandHeader/><main>
    <section className="journal-hero shell">
      <div className="eyebrow">THE ULTRAOP JOURNAL / CREATOR TIMELINE</div>
      <h1>The story<br/><span>behind the uploads.</span></h1>
      <p>A living archive of Sk Ahsan Ahmad’s journey from PUBG esports and organised scrims through the Rooter streaming and moderation era, Free Fire, YouTube, Minecraft, technology projects and the next story-led gaming chapter.</p>
      <div className="journal-hero-meta"><span><BookOpen size={15}/> {JOURNAL_ENTRIES.length} creator chapters</span><span><Clock3 size={15}/> Exact dates can be refined later</span></div>
    </section>

    <section className="journal-timeline shell">
      {JOURNAL_ENTRIES.map((entry, index) => <article className="timeline-entry" key={entry.slug} id={entry.slug}>
        <div className="timeline-marker"><span>{String(index + 1).padStart(2, '0')}</span></div>
        <div className="timeline-card">
          <div className="timeline-top"><span className="eyebrow">{entry.eyebrow}</span><span className="mono timeline-era">{entry.era}</span></div>
          <h2>{entry.title}</h2>
          <p className="timeline-summary">{entry.summary}</p>
          {entry.body.map(paragraph => <p className="timeline-body" key={paragraph}>{paragraph}</p>)}
          <div className="timeline-tags">{entry.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        </div>
      </article>)}
    </section>

    <section className="journal-archive shell"><div className="section-heading"><div><p className="eyebrow">ARCHIVE / LEGACY POSTS</p><h2>Older writing.<br/><span>Still part of the story.</span></h2></div><p className="section-intro">The original UltraOP blog is preserved here as a separate archive. Historical posts are clearly marked so they are not confused with the personal creator timeline.</p></div><div className="journal-archive-grid">{LEGACY_BLOG_POSTS.map((post, index) => <a href={`/blog/${post.slug}/`} className="journal-archive-card" key={post.slug}><span className="mono">{String(index + 1).padStart(2, '0')} / {post.date}</span><h3>{post.title}</h3><p>{post.excerpt}</p><span className="read-more">Open article <ArrowUpRight size={14}/></span></a>)}</div></section>
  </main></div>;
}
