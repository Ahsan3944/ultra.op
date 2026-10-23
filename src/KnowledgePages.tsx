import { ArrowRight, ArrowUpRight, BookOpen, ExternalLink, Gamepad2, Radio } from 'lucide-react';
import type { ReactNode } from 'react';
import KNOWLEDGE_ARTICLES from './data/knowledge.json';

export type KnowledgeArticle = (typeof KNOWLEDGE_ARTICLES)[number];
export const KNOWLEDGE_BY_PATH = Object.fromEntries(
  KNOWLEDGE_ARTICLES.map((article) => [article.route.replace(/\/+$/, ''), article])
) as Record<string, KnowledgeArticle>;

export function getKnowledgeArticle(path: string): KnowledgeArticle | undefined {
  return KNOWLEDGE_BY_PATH[path];
}

function RichText({ value }: { value: string }) {
  const parts = value.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    const external = /^https?:\/\//i.test(match[2]);
    return <a key={index} href={match[2]} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{match[1]}</a>;
  });
}

function KnowledgeHero({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description: string; children?: ReactNode }) {
  return (
    <section className="uos-interior-hero uos-knowledge-hero">
      <div className="uos-container">
        <a className="uos-back-link" href="/"><ArrowRight size={15} aria-hidden="true" /> BACK TO ULTRAOP</a>
        <p className="uos-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="uos-interior-description">{description}</p>
        {children}
      </div>
    </section>
  );
}

function KnowledgeCard({ article }: { article: KnowledgeArticle }) {
  return (
    <a className="uos-knowledge-card" href={article.route} data-reveal>
      <div className="uos-knowledge-card-image">
        <img src={article.heroImage} alt={article.heroAlt} loading="lazy" width="1200" height="675" />
        <span>{article.category}</span>
      </div>
      <div className="uos-knowledge-card-copy">
        <p className="uos-knowledge-meta">{article.updatedAt} · {article.readingMinutes} MIN READ</p>
        <h3>{article.title}</h3>
        <p>{article.description}</p>
        <span className="uos-knowledge-read">Read article <ArrowUpRight size={15} aria-hidden="true" /></span>
      </div>
    </a>
  );
}

export function KnowledgeTeasers() {
  const featuredSlugs = ['minecraft-version-library', 'pubg-global-championship-history', 'valorant-patch-13-08'];
  const featured = featuredSlugs.map((slug) => KNOWLEDGE_ARTICLES.find((article) => article.slug === slug)).filter((article): article is KnowledgeArticle => Boolean(article));
  return (
    <section className="uos-section uos-knowledge-section" id="knowledge">
      <div className="uos-container">
        <div className="uos-section-heading" data-reveal>
          <div><p className="uos-eyebrow">THE KNOWLEDGE DESK / 05</p><h2>Read the game.<br /><span>Understand the story.</span></h2></div>
          <div className="uos-section-heading-aside"><p>Version guides, tournament history and practical game explainers—organised by title, patch and competition.</p><a className="uos-text-link" href="/guides/">Explore every guide <ArrowUpRight size={16} aria-hidden="true" /></a></div>
        </div>
        <div className="uos-knowledge-grid">{featured.map((article) => <KnowledgeCard key={article.slug} article={article} />)}</div>
        <div className="uos-knowledge-hub-links"><a href="/games/"><Gamepad2 size={18} aria-hidden="true" /> Browse games <ArrowUpRight size={15} aria-hidden="true" /></a><a href="/esports/"><Radio size={18} aria-hidden="true" /> Tournament histories <ArrowUpRight size={15} aria-hidden="true" /></a><a href="/journal/ultraop-creator-story/"><BookOpen size={18} aria-hidden="true" /> UltraOP creator story <ArrowUpRight size={15} aria-hidden="true" /></a></div>
      </div>
    </section>
  );
}

export function KnowledgeDirectoryPage({ route }: { route: string }) {
  const hub = KNOWLEDGE_BY_PATH[route];
  let groups: { title: string; articles: KnowledgeArticle[] }[] = [];
  if (route === '/esports') {
    groups = [{ title: 'Tournament history and champions', articles: KNOWLEDGE_ARTICLES.filter((article) => article.kind === 'esports') }];
  } else if (route === '/games/minecraft/versions') {
    groups = [{ title: 'Minecraft Java Edition versions', articles: KNOWLEDGE_ARTICLES.filter((article) => article.categorySlug === 'minecraft' && article.kind === 'guide') }];
  } else if (route === '/games/valorant/updates') {
    groups = [{ title: 'VALORANT updates and patch guides', articles: KNOWLEDGE_ARTICLES.filter((article) => article.categorySlug === 'valorant' && article.kind === 'guide') }];
  } else if (route === '/games') {
    groups = [
      { title: 'Minecraft versions and server compatibility', articles: KNOWLEDGE_ARTICLES.filter((article) => article.categorySlug === 'minecraft' && article.kind !== 'hub') },
      { title: 'VALORANT updates and patch coverage', articles: KNOWLEDGE_ARTICLES.filter((article) => article.categorySlug === 'valorant' && article.kind === 'guide') },
      { title: 'General game guides', articles: KNOWLEDGE_ARTICLES.filter((article) => article.categorySlug === 'guides') }
    ];
  } else {
    groups = [
      { title: 'Minecraft versions and server guides', articles: KNOWLEDGE_ARTICLES.filter((article) => article.categorySlug === 'minecraft' && article.kind === 'guide') },
      { title: 'PUBG, BGMI, Free Fire and VALORANT tournament history', articles: KNOWLEDGE_ARTICLES.filter((article) => article.kind === 'esports') },
      { title: 'VALORANT updates', articles: KNOWLEDGE_ARTICLES.filter((article) => article.categorySlug === 'valorant' && article.kind === 'guide') },
      { title: 'General gaming explainers', articles: KNOWLEDGE_ARTICLES.filter((article) => article.categorySlug === 'guides') },
      { title: 'The UltraOP creator journey', articles: KNOWLEDGE_ARTICLES.filter((article) => article.kind === 'creator') }
    ];
  }
  return (
    <>
      <KnowledgeHero eyebrow={'KNOWLEDGE HUB / ' + (hub?.category ?? 'INDEX').toUpperCase()} title={<>{hub?.title ?? 'Gaming guides and references'}</>} description={hub?.intro ?? hub?.description ?? 'Browse structured guides by game and topic.'}>
        <div className="uos-knowledge-directory-meta"><span>{KNOWLEDGE_ARTICLES.length} published reference pages</span><span>Updated 23 October 2026</span></div>
      </KnowledgeHero>
      <section className="uos-section uos-knowledge-directory">
        <div className="uos-container">
          {groups.filter((group) => group.articles.length > 0).map((group) => (
            <div className="uos-knowledge-group" key={group.title}>
              <div className="uos-knowledge-group-heading"><p className="uos-eyebrow">CURATED READING</p><h2>{group.title}</h2><span>{group.articles.length} ARTICLES</span></div>
              <div className="uos-knowledge-grid">{group.articles.map((article) => <KnowledgeCard key={article.slug} article={article} />)}</div>
            </div>
          ))}
          <div className="uos-knowledge-sources-note"><strong>How these pages are maintained.</strong> Update details and tournament results are tied to the event year and the publisher or organiser sources listed inside each article. Search engines decide indexing and ranking; these pages are designed for useful, specific answers, not guaranteed placement.</div>
        </div>
      </section>
    </>
  );
}

export function KnowledgeArticlePage({ article }: { article: KnowledgeArticle }) {
  return (
    <>
      <KnowledgeHero eyebrow={article.category.toUpperCase() + ' / UPDATED ' + article.updatedAt} title={<>{article.title}</>} description={article.intro}>
        <div className="uos-article-meta"><span><BookOpen size={15} aria-hidden="true" /> {article.readingMinutes} minute read</span><span>Last reviewed {article.updatedAt}</span><span>{article.category}</span></div>
      </KnowledgeHero>
      <section className="uos-section uos-knowledge-article">
        <div className="uos-container">
          <figure className="uos-article-figure" data-reveal>
            <img src={article.heroImage} alt={article.heroAlt} width="1200" height="675" fetchPriority="high" />
            <figcaption>Original editorial illustration for this reference article; not an official in-game screenshot.</figcaption>
          </figure>
          <div className="uos-article-layout">
            <article className="uos-article-body">
              <section className="uos-takeaways"><h2>Key takeaways</h2><ul>{article.takeaways.map((item, index) => <li key={index}><RichText value={item} /></li>)}</ul></section>
              {article.sections.map((section, index) => (
                <section className="uos-article-section" key={section.heading}>
                  <p className="uos-eyebrow">{String(index + 1).padStart(2, '0')} / {article.category}</p><h2>{section.heading}</h2>
                  {(section.paragraphs ?? []).map((paragraph, paragraphIndex) => <p key={paragraphIndex}><RichText value={paragraph} /></p>)}
                  {(section.bullets ?? []).length > 0 && <ul className="uos-article-bullets">{section.bullets!.map((item, bulletIndex) => <li key={bulletIndex}><RichText value={item} /></li>)}</ul>}
                  {(section.tables ?? []).map((table) => <div className="uos-article-table-wrap" key={table.heading}><h3>{table.heading}</h3><div className="uos-table-scroll"><table><thead><tr>{table.headers.map((head) => <th scope="col" key={head}>{head}</th>)}</tr></thead><tbody>{table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div></div>)}
                </section>
              ))}
              <section className="uos-article-sources"><h2>Sources and further reading</h2><p>Use these publisher, game-developer and tournament-organiser references for full rules, exact values and official result corrections.</p><div className="uos-source-links">{article.sources.map((source) => <a href={source.url} key={source.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} aria-hidden="true" /><span>{source.label}</span></a>)}</div></section>
            </article>
            <aside className="uos-related-panel"><p className="uos-eyebrow">KEEP EXPLORING</p><h2>Related articles</h2><div className="uos-related-links">{KNOWLEDGE_ARTICLES.filter((candidate) => (article.related ?? []).includes(candidate.slug)).map((candidate) => <a key={candidate.slug} href={candidate.route}><span>{candidate.category}</span><strong>{candidate.title}</strong><ArrowUpRight size={15} aria-hidden="true" /></a>)}</div><a className="uos-button uos-button-secondary" href="/guides/">All gaming guides <ArrowRight size={15} aria-hidden="true" /></a></aside>
          </div>
        </div>
      </section>
    </>
  );
}
