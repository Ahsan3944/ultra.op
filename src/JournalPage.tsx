import { ArrowLeft, ArrowUpRight, BookOpen, Clock3, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { JOURNAL_ENTRIES } from './data/journal';
import { LEGACY_BLOG_POSTS } from './data/legacyContent';

const journalFaq = [
  ['Who is Sk Ahsan Ahmad / UltraOP?', 'Sk Ahsan Ahmad, known online as UltraOP, is an Indian gaming creator, live streamer, community builder and technology-focused creator.'],
  ['What was the beginning of UltraOP’s gaming journey?', 'The journey began with PUBG during the India era, followed by competitive teams, Indian Falcon, Esports Mania and organised PUBG/BGMI scrims.'],
  ['What was the Esports Mania scrim ecosystem?', 'The ESM Discord community hosted PUBG and BGMI scrims across T1, T2 and T3 levels and became an important part of the early competitive chapter.'],
  ['Why did the journey move to Rooter?', 'After PUBG was banned in India, the creator moved to Rooter, where Free Fire was learned and streamed live.'],
  ['How long was the Rooter streaming era?', 'The Rooter live-streaming chapter lasted roughly two to three years and also expanded into moderation and community responsibilities.'],
  ['What roles did UltraOP have at Rooter?', 'The journey included moderation, Head Moderator and Community Intern responsibilities alongside streaming and community work.'],
  ['How did YouTube enter the journey?', 'After the multi-year Rooter chapter, a new YouTube channel was opened and Free Fire live streaming began while Rooter and YouTube were initially run together.'],
  ['How quickly did the YouTube channel grow?', 'The creator has described reaching roughly 5,000 YouTube subscribers in about one month and getting monetized during that early growth phase.'],
  ['What is UltraOP focused on now?', 'Minecraft is the current main live-streaming focus, with Minecraft videos also appearing on YouTube and Roblox planned as a future expansion.'],
  ['What is planned for Minecraft and future gaming content?', 'The plan includes Minecraft story-mode videos on an alternate channel and future PUBG/FPS storytelling with stronger cinematic production.'],
  ['Does UltraOP work on technology projects?', 'Yes. Web development and technology are important parts of the creator identity, including ultrapi.in and Minecraft-mod and WhatsApp-related projects.'],
  ['Has UltraOP appeared in other creators’ videos?', 'Yes. The creator has appeared in videos from other YouTubers as part of the broader gaming creator network.'],
  ['Where are the official UltraOP channels?', 'The current network includes Ultra OP Live, Op Earnings, Ultra OP 2.0 and Roblox UltraOP3, with the structure ready for future official channels.'],
  ['Where can I watch UltraOP live?', 'Official live destinations currently include YouTube, Twitch, Kick and Rooter, subject to each platform’s availability.'],
  ['How can brands contact UltraOP?', 'Business enquiries, creator collaborations and professional opportunities can be sent to ultraopbiz@gmail.com.'],
  ['How can I support UltraOP?', 'The official UPI ID is ultraop001@ybl.'],
];

function BrandHeader() {
  return <header className="journal-header"><div className="shell journal-header-inner"><a href="/" className="journal-brand"><img src="/brand/ultraop-mark.svg" alt="UltraOP official creator website logo"/><span>ULTRA<span>OP</span></span></a><a href="/" className="journal-back"><ArrowLeft size={14}/> Home</a></div></header>;
}

function JournalFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return <section className="faq-section section shell journal-faq"><div className="section-heading"><div><p className="eyebrow">FAQ / THE JOURNEY</p><h2>Questions,<br/><span>answered.</span></h2></div><p className="section-intro">A searchable Q&A covering the creator journey, PUBG esports, Rooter, Free Fire, YouTube, Minecraft, technology projects and the future UltraOP direction.</p></div><div className="faq-list">{journalFaq.map(([question, answer], index) => <div className={`faq-item ${open === index ? 'is-open' : ''}`} key={question}><button onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}><span className="faq-number mono">{String(index + 1).padStart(2, '0')}</span><strong>{question}</strong><ChevronDown size={18}/></button>{open === index && <div className="faq-answer"><p>{answer}</p></div>}</div>)}</div></section>;
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

    <JournalFAQ/>

    <section className="journal-archive shell"><div className="section-heading"><div><p className="eyebrow">ARCHIVE / LEGACY POSTS</p><h2>Older writing.<br/><span>Still part of the story.</span></h2></div><p className="section-intro">The original UltraOP blog is preserved here as a separate archive. Historical posts are clearly marked so they are not confused with the personal creator timeline.</p></div><div className="journal-archive-grid">{LEGACY_BLOG_POSTS.map((post, index) => <a href={`/blog/${post.slug}/`} className="journal-archive-card" key={post.slug}><span className="mono">{String(index + 1).padStart(2, '0')} / {post.date}</span><h3>{post.title}</h3><p>{post.excerpt}</p><span className="read-more">Open article <ArrowUpRight size={14}/></span></a>)}</div></section>
  </main></div>;
}
