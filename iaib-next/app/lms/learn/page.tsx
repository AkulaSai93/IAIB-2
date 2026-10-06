"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Check, Crown, Gift, Lock, Play, Star } from "lucide-react";
import { useLms } from "@/lib/lms/store";
import { CURRICULUM, fmtDate, sessionState, type Session } from "@/lib/lms/data";
import { Button, Portal, Sprite } from "@/components/lms/ui";
import { Celebration, GameRail } from "@/components/lms/game";

/* Learn answers "what can I learn?" as a Duolingo-style path: each module is
   a unit with its banner, sessions are round nodes winding down the page,
   a chest closes each unit, and Byte walks alongside. Tapping the current
   node starts the session; finishing it plays the celebration. */

const OFFSETS = [0, 70, 105, 70, 0, -70, -105, -70];

function NodePopover({ s, state, onStart, onClose }: { s: Session; state: string; onStart: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const d = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && onClose();
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const t = setTimeout(() => document.addEventListener("mousedown", d));
    document.addEventListener("keydown", k);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", d); document.removeEventListener("keydown", k); };
  }, [onClose]);
  const locked = state === "locked" || state === "upcoming";
  const bg = "var(--lms-elevated)";
  return (
    <div ref={ref} className="lms-page absolute left-1/2 -translate-x-1/2 top-[calc(100%+18px)] z-20 w-[280px] p-5 text-left
                              shadow-[0_24px_60px_-20px_rgba(0,0,0,.95)]" style={{ background: bg }} role="dialog" aria-label={s.title}>
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45" style={{ background: bg }} aria-hidden />
      <p className={`m-0 font-display font-bold text-[1.1rem] leading-snug text-white`}>{s.title}</p>
      <p className={`m-0 mt-1 text-[13px] ${locked ? "text-l-text2" : "text-white/80"}`}>
        Session {String(s.no).padStart(2, "0")} · {s.minutes} min · {fmtDate(s.date)}
      </p>
      {locked ? (
        <p className="m-0 mt-4 text-[13px] text-l-text3 flex items-center gap-1.5"><Lock size={13} /> Finish the sessions before this one to unlock it.</p>
      ) : (
        <button type="button" onClick={onStart}
                className="game-btn mt-4 w-full bg-l-accent text-white [--ledge:color-mix(in_srgb,var(--lms-accent)_55%,black)] py-2.5 font-mono font-medium uppercase tracking-[0.05em] text-[13px] cursor-pointer">
          {state === "done" ? "Replay" : "Start · +5 XP"}
        </button>
      )}
    </div>
  );
}

function PathNode({ s, state, offset, open, onOpen, onClose, onStart }: {
  s: Session; state: string; offset: number; open: boolean; onOpen: () => void; onClose: () => void; onStart: () => void;
}) {
  const cur = state === "current";
  const lit = cur || state === "done";
  return (
    <div className="relative flex justify-center" style={{ transform: `translateX(${offset}px)`, zIndex: open ? 40 : undefined }}>
      {cur && (
        <span className="start-bubble absolute left-1/2 -top-12 z-10 px-3 py-1.5 bg-white font-mono font-medium text-[13px] tracking-[0.06em] uppercase whitespace-nowrap text-white">
          <span className="text-black">Start</span>
        </span>
      )}
      <div className="relative">
        {cur && <span className="ring-spin absolute -inset-[10px] rounded-full border-[4px] border-dashed border-l-accent" aria-hidden />}
        <button type="button" onClick={open ? onClose : onOpen} aria-label={`Session ${s.no}: ${s.title} (${state})`} aria-expanded={open}
                className="path-node relative grid place-items-center w-[74px] h-[70px] cursor-pointer"
                style={{ background: lit ? "var(--lms-accent)" : "#2b2b2b", "--node-ledge": lit ? "color-mix(in srgb, var(--lms-accent) 50%, black)" : "#141414" } as React.CSSProperties}>
          {state === "done" ? <Check size={30} strokeWidth={3.5} className="text-white" />
            : cur ? <Star size={30} fill="white" className="text-white" />
            : <Lock size={24} className="text-l-text3" />}
        </button>
        {open && <NodePopover s={s} state={state} onStart={onStart} onClose={onClose} />}
      </div>
    </div>
  );
}

/* Byte walks the path with you: it stands beside the session you tap, and
   otherwise strolls along to whichever session is in the middle of the
   screen as you scroll. A step animation plays while it's on the move. */
function WalkingByte({ column, target }: { column: React.RefObject<HTMLDivElement | null>; target: number | null }) {
  const me = useRef<HTMLDivElement>(null);
  const [walking, setWalking] = useState(false);
  useEffect(() => {
    const col = column.current, el = me.current;
    if (!col || !el) return;
    let last = "";
    let stop: ReturnType<typeof setTimeout>;
    const place = () => {
      const nodes = [...col.querySelectorAll<HTMLElement>("[data-node] .path-node")];
      if (!nodes.length) return;
      let node = target != null ? nodes.find((n) => n.closest<HTMLElement>("[data-node]")?.dataset.node === String(target)) : undefined;
      if (!node) {
        const mid = window.innerHeight * 0.55;
        node = nodes.reduce((a, b) => Math.abs(b.getBoundingClientRect().top - mid) < Math.abs(a.getBoundingClientRect().top - mid) ? b : a);
      }
      const c = col.getBoundingClientRect(), r = node.getBoundingClientRect();
      const x = r.right - c.left + 18, y = r.top - c.top + r.height / 2 - 26;
      const key = `${Math.round(x)},${Math.round(y)}`;
      if (key === last) return;
      last = key;
      el.style.transform = `translate(${x}px, ${y}px)`;
      setWalking(true);
      clearTimeout(stop);
      stop = setTimeout(() => setWalking(false), 650);
    };
    place();
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(place); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const t = setInterval(place, 400); // also catches scrolls the frame loop misses
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); clearInterval(t); clearTimeout(stop); cancelAnimationFrame(raf); };
  }, [column, target]);
  return (
    <div ref={me} aria-hidden className="absolute left-0 top-0 z-30 pointer-events-none max-[700px]:hidden transition-transform duration-[650ms] ease-[cubic-bezier(.3,.7,.3,1)]">
      <div className={walking ? "byte-walk" : "bob"}><Sprite size={44} /></div>
    </div>
  );
}

export default function Learn() {
  const { student: st, patch, addXp } = useLms();
  const [open, setOpen] = useState<number | null>(null);
  const [celebrate, setCelebrate] = useState<{ s: Session; xp: number } | null>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const pathCol = useRef<HTMLDivElement>(null);
  useEffect(() => { curRef.current?.scrollIntoView({ block: "center" }); }, []);

  const start = (s: Session) => {
    setOpen(null);
    const fresh = s.no === st.sessionsCompleted + 1;
    if (fresh) {
      patch({ sessionsCompleted: st.sessionsCompleted + 1, goalsDone: [...new Set([...st.goalsDone, "session"])] });
      addXp(5, `Session ${String(s.no).padStart(2, "0")} completed`);
    }
    setCelebrate({ s, xp: fresh ? 5 : 0 });
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_340px] max-[1180px]:grid-cols-1 gap-10">
      <div className="min-w-0 relative" ref={pathCol}>
        <WalkingByte column={pathCol} target={open} />
        {CURRICULUM.map((m, mi) => {
          const done = m.sessions.filter((x) => x.no <= st.sessionsCompleted).length;
          const active = m.sessions.some((x) => x.no === st.sessionsCompleted + 1);
          const allDone = done === m.sessions.length;
          const locked = !active && done === 0;
          return (
            <section key={m.no} className="mb-16" aria-label={`Unit ${mi + 1}: ${m.title}`}>
              <div className="sticky top-[76px] z-10 px-6 py-5 flex items-center gap-5 max-[560px]:px-4"
                   style={{ background: "var(--lms-elevated)", boxShadow: active ? "inset 4px 0 0 var(--lms-accent)" : undefined }}>
                <div className="flex-1 min-w-0">
                  <p className={`m-0 font-mono text-[12px] tracking-[0.12em] uppercase ${locked ? "text-l-text3" : "text-white/70"}`}>Unit {mi + 1} · {m.sessions.length} sessions</p>
                  <h2 className={`m-0 mt-1 font-display font-bold text-[1.45rem] leading-tight text-white`}>{m.title}</h2>
                  <p className={`m-0 mt-1 text-[13.5px] max-[560px]:hidden ${locked ? "text-l-text2" : "text-white/80"}`}>{m.desc}</p>
                </div>
                <span className={`hidden min-[561px]:flex items-center gap-2 px-3.5 py-2.5 font-mono text-[12px] uppercase tracking-[0.05em] border-2
                                  ${locked ? "border-white/15 text-l-text2" : "border-white/30 text-white"}`}>
                  {allDone ? <><Crown size={16} /> Complete</> : <><BookOpen size={16} /> {done}/{m.sessions.length}</>}
                </span>
              </div>

              <div className="relative grid gap-9 pt-16 pb-4">
                
                {m.sessions.map((s, i) => {
                  const state = sessionState(s.no, st.sessionsCompleted);
                  return (
                    <div key={s.no} ref={state === "current" ? curRef : undefined} data-node={s.no}>
                      <PathNode s={s} state={state} offset={OFFSETS[(i + mi * 3) % OFFSETS.length]} open={open === s.no}
                                onOpen={() => setOpen(s.no)} onClose={() => setOpen(null)} onStart={() => start(s)} />
                    </div>
                  );
                })}
                <div className="flex justify-center" style={{ transform: `translateX(${OFFSETS[(m.sessions.length + mi * 3) % OFFSETS.length]}px)` }}>
                  <span className={`path-node !rounded-none grid place-items-center w-[74px] h-[70px] ${allDone ? "bg-[#3a3a3a] text-white" : "bg-[#2b2b2b] text-l-text3"}`}
                        style={{ "--node-ledge": "#141414" } as React.CSSProperties} role="img"
                        aria-label={allDone ? "Unit reward unlocked" : "Unit reward"}>
                    <Gift size={28} />
                  </span>
                </div>
              </div>
            </section>
          );
        })}
        <div className="text-center pb-6">
          <p className="m-0 text-l-text3 text-[14px]">Next stop: screening, prototype and the Grand Finale.</p>
          <div className="mt-4"><Button variant="ghost" onClick={() => curRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}><Play size={14} /> Jump to my session</Button></div>
        </div>
      </div>

      <div className="max-[1180px]:hidden"><GameRail /></div>

      {celebrate && (
        <Portal>
          <Celebration title="Session complete!" sub={`"${celebrate.s.title}" is in the bag.`} xp={celebrate.xp}
                       minutes={celebrate.s.minutes} onDone={() => setCelebrate(null)} />
        </Portal>
      )}
    </div>
  );
}
