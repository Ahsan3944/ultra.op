import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';

type Cell = number | null;
type Piece = { cells: number[]; w: number; h: number };

const PIECES: Piece[] = [
  { cells: [0], w: 1, h: 1 },
  { cells: [0, 1], w: 2, h: 1 },
  { cells: [0, 1, 2], w: 3, h: 1 },
  { cells: [0, 3], w: 1, h: 2 },
  { cells: [0, 1, 3, 4], w: 2, h: 2 },
  { cells: [0, 1, 2, 4], w: 3, h: 2 },
  { cells: [0, 1, 2, 3], w: 4, h: 1 },
  { cells: [0, 1, 2, 4, 7], w: 3, h: 3 },
  { cells: [0, 1, 2, 3, 4, 5, 6, 7, 8], w: 3, h: 3 },
];

const SIZE = 8;
const emptyBoard = (): Cell[] => Array(SIZE * SIZE).fill(null);
const randomPieces = (): Piece[] => Array.from({ length: 3 }, () => PIECES[Math.floor(Math.random() * PIECES.length)]);

function canPlace(board: Cell[], piece: Piece, row: number, col: number) {
  return piece.cells.every(offset => {
    const r = row + Math.floor(offset / piece.w);
    const c = col + (offset % piece.w);
    return r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r * SIZE + c] === null;
  });
}

function place(board: Cell[], piece: Piece, row: number, col: number, value: number) {
  const next = [...board];
  piece.cells.forEach(offset => {
    const r = row + Math.floor(offset / piece.w);
    const c = col + (offset % piece.w);
    next[r * SIZE + c] = value;
  });
  return next;
}

function clearLines(board: Cell[]) {
  const fullRows = Array.from({ length: SIZE }, (_, r) => r).filter(r => board.slice(r * SIZE, r * SIZE + SIZE).every(v => v !== null));
  const fullCols = Array.from({ length: SIZE }, (_, c) => c).filter(c => Array.from({ length: SIZE }, (_, r) => board[r * SIZE + c]).every(v => v !== null));
  if (!fullRows.length && !fullCols.length) return { board, lines: 0 };
  const next = [...board];
  fullRows.forEach(r => Array.from({ length: SIZE }, (_, c) => r * SIZE + c).forEach(i => { next[i] = null; }));
  fullCols.forEach(c => Array.from({ length: SIZE }, (_, r) => r * SIZE + c).forEach(i => { next[i] = null; }));
  return { board: next, lines: fullRows.length + fullCols.length };
}

function hasMove(board: Cell[], pieces: Piece[]) {
  return pieces.some(piece => Array.from({ length: SIZE }, (_, r) => r).some(r => Array.from({ length: SIZE }, (_, c) => c).some(c => canPlace(board, piece, r, c))));
}

export function LegacyFreeBlockPuzzlePage() {
  const [board, setBoard] = useState<Cell[]>(emptyBoard);
  const [pieces, setPieces] = useState<Piece[]>(randomPieces);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem('ultraop-free-block-best') || 0));

  const gameOver = useMemo(() => pieces.length > 0 && !hasMove(board, pieces), [board, pieces]);

  const reset = () => { setBoard(emptyBoard()); setPieces(randomPieces()); setSelected(null); setScore(0); };

  const play = (row: number, col: number) => {
    if (selected === null || gameOver) return;
    const piece = pieces[selected];
    if (!piece || !canPlace(board, piece, row, col)) return;
    const placed = place(board, piece, row, col, selected + 1);
    const cleared = clearLines(placed);
    const nextScore = score + piece.cells.length + cleared.lines * SIZE;
    setBoard(cleared.board);
    setScore(nextScore);
    if (nextScore > best) { setBest(nextScore); localStorage.setItem('ultraop-free-block-best', String(nextScore)); }
    const remaining = pieces.filter((_, i) => i !== selected);
    setSelected(null);
    setPieces(remaining.length ? remaining : randomPieces());
  };

  return <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]"><header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[#0a0a0a]/90 backdrop-blur-xl"><div className="shell h-16 flex items-center justify-between"><a href="/games/" className="text-xs text-[var(--muted)] inline-flex items-center gap-2"><ArrowLeft size={14}/> Arcade</a><span className="font-extrabold tracking-[-.04em]">FREE BLOCK <span className="text-[var(--accent)]">PUZZLE</span></span><button onClick={reset} className="text-xs text-[var(--muted)]"><RotateCcw size={14}/></button></div></header><main className="shell py-10 md:py-14 flex flex-col items-center"><div className="text-center mb-7"><div className="eyebrow">Arcade puzzle</div><h1 className="text-3xl md:text-5xl font-extrabold tracking-[-.05em] mt-2">Build lines. Clear space.</h1><p className="mt-2 text-xs text-[var(--muted)]">Score {score} · Best {best}</p></div><div className="w-[min(92vw,520px)]"><div className="grid grid-cols-8 gap-1 rounded-2xl border border-[var(--line)] bg-black/20 p-2">{board.map((cell, i) => { const r = Math.floor(i / SIZE); const c = i % SIZE; return <button key={i} onClick={() => play(r, c)} className={`aspect-square rounded-md border border-[var(--line)] transition ${cell !== null ? 'bg-[var(--accent)]' : 'bg-white/[.025] hover:bg-white/[.08]'}`} aria-label={`row ${r + 1}, column ${c + 1}`} />; })}</div><div className="grid grid-cols-3 gap-3 mt-5">{pieces.map((piece, i) => <button key={`${piece.w}-${piece.h}-${i}`} onClick={() => setSelected(i)} className={`card min-h-24 p-3 flex items-center justify-center ${selected === i ? 'ring-2 ring-[var(--accent)]' : ''}`} aria-label={`Select piece ${i + 1}`}><div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${piece.w}, 1fr)` }}>{Array.from({ length: piece.w * piece.h }, (_, j) => <span key={j} className={`w-4 h-4 md:w-5 md:h-5 rounded-sm ${piece.cells.includes(j) ? 'bg-[var(--accent)]' : 'bg-transparent'}`} />)}</div></button>)}</div></div>{gameOver && <div className="card mt-7 p-6 text-center"><div className="eyebrow">Game over</div><h2 className="text-2xl font-extrabold mt-2">No more moves.</h2><button onClick={reset} className="mt-5 px-5 py-3 rounded-full bg-[var(--accent)] text-white font-bold">Play Again</button></div>}<p className="mt-6 text-xs text-[var(--muted)] text-center">Select a piece, then tap an open position. Complete rows or columns to clear them.</p></main></div>;
}
