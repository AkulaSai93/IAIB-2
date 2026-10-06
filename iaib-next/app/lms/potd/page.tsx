"use client";

import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLms, fmtXp } from "@/lib/lms/store";
import { POTD, today } from "@/lib/lms/data";
import { Card, Eyebrow, Pill, Sprite, Flame } from "@/components/lms/ui";
import QuestionCard, { Burst } from "@/components/lms/QuestionCard";

/* POTD answers "what is today's challenge?". One question a day: a right
   answer is +2 XP, a wrong one earns nothing but explains itself. The
   day's answer is remembered so a revisit shows the result. */

const KEY = "iaib.lms.potd";
const PAST = [
  { d: "Oct 5", t: "What a token is", ok: true },
  { d: "Oct 4", t: "Training vs inference", ok: true },
  { d: "Oct 3", t: "Spotting biased data", ok: false },
];

function CountUp({ from, to }: { from: number; to: number }) {
  const [n, setN] = useState(from);
  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 900);
      setN(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    // hidden tabs pause animation frames; land on the value regardless
    const done = setTimeout(() => setN(to), 1000);
    return () => { cancelAnimationFrame(raf); clearTimeout(done); };
  }, [from, to]);
  return <>{fmtXp(Math.round(n))}</>;
}

export default function Potd() {
  const { student: s, patch, addXp } = useLms();
  const [saved, setSaved] = useState<{ date: string; pick: number; xpBefore: number } | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (v?.date === today()) setSaved(v);
    } catch {}
    setLoaded(true);
  }, []);

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-5 mb-8">
        <div>
          <Eyebrow className="mb-3">POTD · {POTD.date}</Eyebrow>
          <h1 className="m-0 font-display font-bold text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] tracking-[-0.03em]">Problem of the Day</h1>
          <p className="m-0 mt-3 text-l-text2 text-[16px]">One challenge, every day. Keep the ritual going.</p>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="solid"><Flame size={13} className="!text-white !fill-white/25" /> +2 XP</Pill>
          <Pill>{POTD.topic}</Pill>
        </div>
      </header>

      <div className="grid grid-cols-[1fr_320px] max-[1000px]:grid-cols-1 gap-5 items-start">
        <Card as="section" className="p-8 max-[640px]:p-5 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-48 pointer-events-none" aria-hidden
               style={{ background: "radial-gradient(ellipse 60% 100% at 20% 0%, rgba(255,255,255,.045), transparent 70%)" }} />
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <span className="notch num-n grid place-items-center w-10 h-10 bg-white/[0.08] text-white font-mono">06</span>
              <div>
                <p className="m-0 font-display font-bold text-white">Today&rsquo;s Challenge</p>
                <p className="m-0 text-[12.5px] text-l-text3">About 2 minutes · resets at midnight</p>
              </div>
            </div>
            {loaded && (
              <QuestionCard
                key={saved ? "locked" : "open"}
                question={POTD.question} options={POTD.options} answer={POTD.answer} why={POTD.why}
                locked={saved ? { picked: saved.pick } : undefined}
                onResult={(ok, e, pick) => {
                  const v = { date: today(), pick, xpBefore: s.xp };
                  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
                  setSaved(v);
                  patch({ potdSolvedOn: today() });
                  if (ok) addXp(2, "Problem of the Day", { x: e.clientX, y: e.clientY - 20 });
                }}
                renderResult={(ok) => ok ? (
                  <div className="relative notch cap-n p-5 bg-[var(--lms-accent)]/[0.08] flex flex-wrap items-center gap-5">
                    <Burst />
                    <span className="pop-in notch cap-n grid place-items-center w-14 h-14 bg-l-accent text-white"><Check size={28} strokeWidth={3} /></span>
                    <div className="flex-1 min-w-[180px]">
                      <p className="m-0 font-mono text-[12px] tracking-[0.14em] text-l-accent">CORRECT</p>
                      <p className="m-0 mt-1 font-display font-bold text-white text-[1.5rem]">+2 XP</p>
                    </div>
                    <div className="text-right">
                      <p className="m-0 font-mono text-[15px] text-l-text2">{fmtXp(saved?.xpBefore ?? s.xp - 2)} XP → <span className="text-white"><CountUp from={saved?.xpBefore ?? s.xp - 2} to={(saved?.xpBefore ?? s.xp - 2) + 2} /> XP</span></p>
                      <p className="m-0 mt-1 text-[13px] text-l-text2 inline-flex items-center gap-1.5"><Flame size={15} /> Streak continues</p>
                    </div>
                  </div>
                ) : (
                  <div className="notch cap-n p-5 bg-white/[0.04] flex items-center gap-4">
                    <span className="pop-in notch cap-n grid place-items-center w-14 h-14 bg-white/[0.08] text-white"><X size={26} /></span>
                    <div>
                      <p className="m-0 font-display font-bold text-white text-[1.4rem]">Not quite.</p>
                      <p className="m-0 mt-0.5 text-[13.5px] text-l-text2">No XP this time, but your streak is safe. The right answer is highlighted above.</p>
                    </div>
                  </div>
                )}
              />
            )}
            {saved && <p className="m-0 mt-6 text-[13px] text-l-text3">Come back tomorrow for the next one.</p>}
          </div>
        </Card>

        <aside className="grid gap-5">
          <Card className="p-5">
            <Eyebrow>Your streak</Eyebrow>
            <div className="flex items-center gap-3 mt-3">
              <Flame size={34} />
              <div>
                <p className="m-0 font-display font-bold text-white text-[1.8rem] leading-none">{s.streak} days</p>
                <p className="m-0 mt-1 text-[12.5px] text-l-text3">Best {s.longestStreak}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <Eyebrow>Recent problems</Eyebrow>
            <ul className="list-none m-0 mt-3 p-0 grid">
              {PAST.map((p) => (
                <li key={p.d} className="flex items-center gap-3 py-2.5 border-b border-l-line last:border-0">
                  <span className={`notch num-n grid place-items-center w-7 h-7 text-[12px] ${p.ok ? "bg-white/[0.08] text-white" : "bg-white/[0.05] text-l-text3"}`}>{p.ok ? <Check size={14} strokeWidth={3} /> : <X size={14} />}</span>
                  <span className="flex-1 text-[14px] text-l-text">{p.t}</span>
                  <span className="font-mono text-[12px] text-l-text3">{p.d}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5 flex items-center gap-3">
            <span className="bob"><Sprite size={26} /></span>
            <p className="m-0 text-[13px] text-l-text2">Stuck? Ask Byte to explain today&rsquo;s topic without giving the answer away.</p>
          </Card>
        </aside>
      </div>
    </>
  );
}
