import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';

type Mark = 'X' | 'O' | null;
type Mode = 'pvp' | 'pvc';

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
] as const;

function result(board: Mark[]) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return { winner: board[a], line: [a, b, c] };
  }
  if (board.every(Boolean)) return { winner: 'draw' as const, line: [] as number[] };
  return null;
}

function computerMove(board: Mark[]) {
  const open = board.map((v, i) => v ? -1 : i).filter(i => i >= 0);
  if (!open.length) return -1;
  const winning = (mark: 'X' | 'O') => open.find(i => {
    const next = [...board]; next[i] = mark;
    return result(next)?.winner === mark;
  });
  const win = winning('O');
  if (win !== undefined) return win;
  const block = winning('X');
  if (block !== undefined) return block;
  if (open.includes(4)) return 4;
  const corners = [0, 2, 6, 8].filter(i => open.includes(i));
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  return open[Math.floor(Math.random() * open.length)];
}

export function LegacyTicTacToePage() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [board, setBoard] = useState<Mark[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [wins, setWins] = useState({ X: 0, O: 0 });
  const outcome = useMemo(() => result(board), [board]);

  const reset = () => { setBoard(Array(9).fill(null)); setTurn('X'); };
  const play = (index: number) => {
    if (!mode || board[index] || outcome || (mode === 'pvc' && turn === 'O')) return;
    const next = [...board]; next[index] = turn;
    const r = result(next);
    if (r?.winner === 'X' || r?.winner === 'O') setWins(w => ({ ...w, [r.winner]: w[r.winner] + 1 }));
    if (!r) {
      const nextTurn = turn === 'X' ? 'O' : 'X';
      setTurn(nextTurn);
      if (mode === 'pvc' && nextTurn === 'O') {
        const ai = computerMove(next);
        if (ai >= 0) {
          const aiBoard = [...next]; aiBoard[ai] = 'O';
          const aiResult = result(aiBoard);
          if (aiResult?.winner === 'O') setWins(w => ({ ...w, O: w.O + 1 }));
          setBoard(aiBoard); setTurn('X');
        }
        return;
      }
    } else setBoard(next);
    setBoard(next);
  };

  if (!mode) return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[#0a0a0a]/90 backdrop-blur-xl"><div className="shell h-16 flex items-center justify-between"><a href="/games/" className="text-xs text-[var(--muted)] inline-flex items-center gap-2"><ArrowLeft size={14}/> Arcade</a><span className="font-extrabold tracking-[-.04em]">TIC TAC <span className="text-[var(--accent)]">TOE</span></span><span /></div></header>
      <main className="shell min-h-[calc(100vh-64px)] grid place-items-center py-12"><div className="card w-full max-w-md p-8 text-center"><div className="eyebrow mb-3">Arcade classic</div><h1 className="text-4xl font-extrabold tracking-[-.05em]">Choose your mode.</h1><p className="mt-4 text-sm text-[var(--muted)]">Play locally with a friend or challenge the computer.</p><div className="grid gap-3 mt-8"><button className="px-5 py-3 rounded-full bg-[var(--accent)] text-white font-bold" onClick={() => setMode('pvp')}>Player vs Player</button><button className="px-5 py-3 rounded-full border border-[var(--line)] font-bold" onClick={() => setMode('pvc')}>Player vs Computer</button></div></div></main>
    </div>
  );

  return <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]"><header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[#0a0a0a]/90 backdrop-blur-xl"><div className="shell h-16 flex items-center justify-between"><button onClick={() => { setMode(null); reset(); }} className="text-xs text-[var(--muted)] inline-flex items-center gap-2"><ArrowLeft size={14}/> Mode</button><span className="font-extrabold tracking-[-.04em]">TIC TAC <span className="text-[var(--accent)]">TOE</span></span><button onClick={reset} className="text-xs text-[var(--muted)]"><RotateCcw size={14}/></button></div></header><main className="shell py-12 flex flex-col items-center"><div className="text-center mb-8"><div className="eyebrow">{mode === 'pvc' ? 'Player vs Computer' : 'Player vs Player'}</div><h1 className="text-3xl md:text-5xl font-extrabold tracking-[-.05em] mt-2">{outcome ? (outcome.winner === 'draw' ? 'Draw.' : `${outcome.winner} wins.`) : `${turn}'s turn.`}</h1><p className="mt-2 text-xs text-[var(--muted)]">X {wins.X} · O {wins.O}</p></div><div className="grid grid-cols-3 w-[min(90vw,420px)] aspect-square overflow-hidden rounded-2xl border border-[var(--line)] card">{board.map((mark, i) => <button key={i} onClick={() => play(i)} className={`aspect-square border border-[var(--line)] text-6xl md:text-7xl font-black ${mark === 'X' ? 'text-[var(--accent)]' : 'text-[var(--text)]'} ${outcome?.line.includes(i) ? 'bg-white/10' : ''}`}>{mark}</button>)}</div><button onClick={reset} className="mt-8 px-5 py-3 rounded-full bg-[var(--accent)] text-white font-bold">Reset Game</button><p className="mt-5 text-xs text-[var(--muted)]">Three matching marks in a row, column, or diagonal wins.</p></main></div>;
}
