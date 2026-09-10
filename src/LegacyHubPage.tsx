import { ArrowLeft, ArrowUpRight, BookOpen, Gamepad2 } from 'lucide-react';
import { LEGACY_BLOG_POSTS, LEGACY_GAMES } from './data/legacyContent';

type Props = { kind: 'blog' | 'games' };

const legacyOrigin = 'https://ultraop.in';

export function LegacyHubPage({ kind }: Props) {
  const isBlog = kind === 'blog';
  const items = isBlog ? LEGACY_BLOG_POSTS : LEGACY_GAMES;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="shell h-16 flex items-center justify-between">
          <a href="/" className="font-extrabold tracking-[-.04em]">ULTRA<span className="text-[var(--accent)]">OP</span></a>
          <a href="/" className="text-xs text-[var(--muted)] inline-flex items-center gap-2 hover:text-white"><ArrowLeft size={14}/> Home</a>
        </div>
      </header>

      <main className="shell py-16 md:py-24">
        <div className="max-w-3xl mb-12">
          <div className="eyebrow mb-4">{isBlog ? 'Journal / migrated archive' : 'Arcade / migrated archive'}</div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-[-.06em]">
            {isBlog ? <>The <span className="text-[var(--accent)]">journal.</span></> : <>The <span className="text-[var(--accent)]">arcade.</span></>}
          </h1>
          <p className="mt-6 text-[var(--muted)] leading-7 max-w-2xl">
            {isBlog
              ? 'Legacy article metadata has been preserved from the original UltraOP site. Full article bodies will be migrated only from verified source content.'
              : 'Legacy game entries have been preserved from the original UltraOP site. Existing game implementations are kept separate until their source assets can be migrated without loss.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <article key={isBlog ? item.slug : item.id} className="card p-6 min-h-64 flex flex-col">
              <div className="flex items-center justify-between mb-12">
                {isBlog ? <BookOpen size={18} className="text-[var(--accent)]"/> : <Gamepad2 size={18} className="text-[var(--accent)]"/>}
                <span className="mono text-xs text-[var(--muted)]">0{index + 1}</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-[-.04em]">{item.title ?? item.name}</h2>
              <p className="mt-3 text-sm text-[var(--muted)] leading-6">{item.excerpt ?? item.description}</p>
              <div className="mt-auto pt-8 flex items-center justify-between gap-4">
                {isBlog && 'date' in item ? <span className="mono text-[10px] text-[var(--muted)]">{item.date}</span> : <span className="mono text-[10px] text-[var(--muted)]">LEGACY ENTRY</span>}
                <a
                  href={`${legacyOrigin}${isBlog ? `/blog/${item.slug}/` : item.legacyPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase font-bold tracking-[.14em] text-[var(--accent)] inline-flex items-center gap-2"
                >
                  Open legacy <ArrowUpRight size={13}/>
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
