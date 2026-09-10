import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

type GameId = 'flappy-bird';
type Pipe = { x: number; gapY: number; scored: boolean };

const W = 360, H = 640, BIRD_X = 90, BIRD_R = 14;
const GRAVITY = 980, FLAP = -300, PIPE_W = 56, GAP = 125, SPEED = 120, SPAWN_MS = 1400, GROUND = 72;

export function LegacyGamePage({ game }: { game: GameId }) {
  if (game === 'flappy-bird') return <FlappyBird />;
  return null;
}

function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null), lastRef = useRef(0), spawnRef = useRef(0);
  const birdY = useRef(H * .45), velocity = useRef(0), pipes = useRef<Pipe[]>([]), score = useRef(0);
  const best = useRef(Number(localStorage.getItem('ultraop-flappy-best') || 0));
  const state = useRef<'ready'|'run'|'pause'|'over'>('ready');
  const [ui, setUi] = useState({ state: 'ready', score: 0, best: best.current });
  const sync = useCallback(() => setUi({ state: state.current, score: score.current, best: best.current }), []);
  const reset = useCallback(() => { birdY.current=H*.45; velocity.current=0; pipes.current=[]; score.current=0; spawnRef.current=0; state.current='ready'; sync(); }, [sync]);
  const end = useCallback(() => { state.current='over'; if(score.current>best.current){best.current=score.current; localStorage.setItem('ultraop-flappy-best',String(best.current));} sync(); }, [sync]);
  const flap = useCallback(() => { if(state.current==='ready'||state.current==='over'){reset();state.current='run';} else if(state.current==='pause') state.current='run'; velocity.current=FLAP; sync(); }, [reset,sync]);
  const pause = useCallback(() => { if(state.current==='run')state.current='pause'; else if(state.current==='pause')state.current='run'; sync(); }, [sync]);

  useEffect(() => {
    const canvas=canvasRef.current; const ctx=canvas?.getContext('2d'); if(!canvas||!ctx)return;
    const dpr=Math.min(devicePixelRatio||1,2); canvas.width=W*dpr; canvas.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    const draw=()=>{
      const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#66b3ff');g.addColorStop(.3,'#87d8ff');g.addColorStop(1,'#bdf');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      for(const p of pipes.current){const top=p.gapY-GAP/2,bottom=p.gapY+GAP/2;ctx.fillStyle='#39d353';ctx.fillRect(p.x,0,PIPE_W,top);ctx.fillRect(p.x,bottom,PIPE_W,H-GROUND-bottom);ctx.fillStyle='#2aaa45';ctx.fillRect(p.x-4,top-16,PIPE_W+8,16);ctx.fillRect(p.x-4,bottom,PIPE_W+8,16);}
      ctx.fillStyle='#d6b36a';ctx.fillRect(0,H-GROUND,W,GROUND);ctx.fillStyle='#8cc152';ctx.fillRect(0,H-GROUND,W,12);
      ctx.save();ctx.translate(BIRD_X,birdY.current);ctx.rotate(Math.max(-.45,Math.min(1.15,velocity.current/500)));ctx.fillStyle='#ffd84d';ctx.beginPath();ctx.arc(0,0,BIRD_R,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(7,-6,4,0,Math.PI*2);ctx.fill();ctx.fillStyle='#222';ctx.beginPath();ctx.arc(8,-6,2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ff8b3d';ctx.beginPath();ctx.moveTo(11,1);ctx.lineTo(23,5);ctx.lineTo(11,8);ctx.closePath();ctx.fill();ctx.restore();
      ctx.fillStyle='rgba(13,15,26,.75)';ctx.font='700 36px system-ui';ctx.textAlign='center';ctx.fillText(String(score.current),W/2,58);
    };
    const tick=(now:number)=>{const dt=Math.min((now-lastRef.current)/1000||0,.033);lastRef.current=now;if(state.current==='run'){velocity.current+=GRAVITY*dt;birdY.current+=velocity.current*dt;spawnRef.current+=dt*1000;if(spawnRef.current>=SPAWN_MS){spawnRef.current=0;const min=100,max=H-GROUND-100;pipes.current.push({x:W+10,gapY:min+Math.random()*(max-min),scored:false});}for(const p of pipes.current){p.x-=SPEED*dt;if(!p.scored&&p.x+PIPE_W<BIRD_X-BIRD_R){p.scored=true;score.current++;sync();}const hitX=BIRD_X+BIRD_R>p.x&&BIRD_X-BIRD_R<p.x+PIPE_W;const hitY=birdY.current-BIRD_R<p.gapY-GAP/2||birdY.current+BIRD_R>p.gapY+GAP/2;if(hitX&&hitY)end();}pipes.current=pipes.current.filter(p=>p.x>-PIPE_W-10);if(birdY.current-BIRD_R<0||birdY.current+BIRD_R>H-GROUND)end();}draw();rafRef.current=requestAnimationFrame(tick);};
    rafRef.current=requestAnimationFrame(tick);return()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current)};
  },[end,sync]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.code==='Space'){e.preventDefault();flap();}if(e.key.toLowerCase()==='p')pause();};addEventListener('keydown',key);return()=>removeEventListener('keydown',key)},[flap,pause]);

  return <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]"><header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[#0a0a0a]/90 backdrop-blur-xl"><div className="shell h-16 flex items-center justify-between"><a href="/games/" className="text-xs text-[var(--muted)] inline-flex items-center gap-2"><ArrowLeft size={14}/> Arcade</a><span className="font-extrabold tracking-[-.04em]">FLAPPY <span className="text-[var(--accent)]">BIRD</span></span><button onClick={reset} aria-label="Reset"><RotateCcw size={14}/></button></div></header><main className="shell py-10 flex flex-col items-center"><div className="w-full max-w-[360px] flex justify-between mb-4 text-xs mono text-[var(--muted)]"><span>BEST {ui.best}</span><span>Tap / Click / Space • P pause</span></div><div className="relative w-full max-w-[360px] aspect-[360/640] overflow-hidden rounded-2xl shadow-2xl cursor-pointer select-none" onPointerDown={flap}><canvas ref={canvasRef} className="block w-full h-full" aria-label="Flappy Bird game" />{ui.state!=='run'&&<div className="absolute inset-0 grid place-items-center bg-black/35 p-5"><div className="card w-full p-6 text-center" onPointerDown={e=>e.stopPropagation()}><div className="eyebrow mb-3">{ui.state==='pause'?'Paused':ui.state==='over'?'Game over':'Ready'}</div><h1 className="text-3xl font-extrabold tracking-[-.05em]">{ui.state==='over'?`Score ${ui.score}`:'Flap through.'}</h1><p className="mt-3 text-sm text-[var(--muted)]">Tap, click or press Space to flap.</p><button className="mt-6 px-5 py-3 rounded-full bg-[var(--accent)] text-white font-bold" onClick={flap}>{ui.state==='pause'?'Resume':ui.state==='over'?'Play again':'Start game'}</button></div></div>}</div></main></div>;
}
