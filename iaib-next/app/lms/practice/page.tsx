"use client";

import { Check, CircleHelp, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLms } from "@/lib/lms/store";
import { LEVEL_XP, PRACTICE_TOPICS, PROBLEMS, type Problem } from "@/lib/lms/data";
import { Card, Empty, Eyebrow, PageHead, Pill, Portal } from "@/components/lms/ui";
import { StatCard } from "@/components/lms/widgets";
import QuestionCard, { Burst } from "@/components/lms/QuestionCard";

/* Practice answers "how can I improve?". The difficulty cards start a game
   round (Easy +2 / Medium +3 / Hard +5, never negative); problems from the
   list follow the practice rule (+1 correct, -0.5 wrong). */

const LEVELS = [
  { level: "Easy", blurb: "Warm-ups on the basics", glyph: "▰▱▱" },
  { level: "Medium", blurb: "Apply what you learned", glyph: "▰▰▱" },
  { level: "Hard", blurb: "Think like a builder", glyph: "▰▰▰" },
] as const;

type Run = { p: Problem; mode: "game" | "practice" };

function Solver({ run, onClose }: { run: Run; onClose: () => void }) {
  const { student, patch, addXp } = useLms();
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = prev; };
  }, [onClose]);
  const gain = run.mode === "game" ? LEVEL_XP[run.p.level] : 1;

  return (
    <div className="fixed inset-0 z-[150] grid place-items-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={run.p.title} className="lms-page relative w-full max-w-[680px] notch win-n bg-l-surface p-7 max-[560px]:p-5 my-auto">
        <div className="flex items-center gap-2 mb-5">
          <Pill tone="accent">{run.p.topic}</Pill>
          <Pill>{run.p.level}</Pill>
          <Pill tone="muted">{run.mode === "game" ? `Game · +${gain} XP · no penalty` : "+1 XP · −0.5 if wrong"}</Pill>
          <button type="button" onClick={onClose} aria-label="Close" className="ml-auto text-l-text3 hover:text-white text-xl cursor-pointer">×</button>
        </div>
        <QuestionCard
          question={run.p.question} options={run.p.options} answer={run.p.answer} why={run.p.why}
          onResult={(ok, e) => {
            const o = { x: e.clientX, y: e.clientY - 20 };
            if (ok) addXp(gain, `${run.mode === "game" ? `${run.p.level} game` : "Practice"}: ${run.p.title}`, o);
            else if (run.mode === "practice") addXp(-0.5, `Practice: ${run.p.title}`, o);
            patch({ todayCorrect: (student.todayCorrect ?? 0) + (ok ? 1 : 0), practiceSolved: student.practiceSolved + 1, practiceCorrect: student.practiceCorrect + (ok ? 1 : 0), practiceXp: student.practiceXp + (ok ? gain : run.mode === "practice" ? -0.5 : 0) });
          }}
          renderResult={(ok) => (
            <div className="relative flex items-center gap-4">
              {ok && <Burst />}
              <span className={`pop-in notch cap-n grid place-items-center w-12 h-12 ${ok ? "bg-l-accent text-white" : "bg-white/[0.08] text-white"}`}>{ok ? <Check size={24} strokeWidth={3} /> : <X size={22} />}</span>
              <div>
                <p className="m-0 font-display font-bold text-white text-[1.25rem]">{ok ? "Correct!" : "Not quite."}</p>
                <p className="m-0 text-[13.5px] text-l-text2">{ok ? `+${gain} XP added.` : run.mode === "game" ? "Games never cost XP. Read why below and try another." : "−0.5 XP. Read why below; it'll stick next time."}</p>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default function Practice() {
  const { student: s } = useLms();
  const [topic, setTopic] = useState<(typeof PRACTICE_TOPICS)[number]>("All");
  const [run, setRun] = useState<Run | null>(null);
  const list = useMemo(() => PROBLEMS.filter((p) => topic === "All" || p.topic === topic), [topic]);
  const acc = s.practiceSolved ? Math.round((s.practiceCorrect / s.practiceSolved) * 100) : 0;
  const play = (level: Problem["level"]) => {
    const pool = PROBLEMS.filter((p) => p.level === level);
    setRun({ p: pool[Math.floor(Math.random() * pool.length)], mode: "game" });
  };

  return (
    <>
      <PageHead eyebrow="Practice" title="Practice" sub="Sharpen your skills. Earn XP. Level up." />

      <div className="grid grid-cols-3 max-[900px]:grid-cols-1 gap-4">
        {LEVELS.map((l, i) => (
          <button key={l.level} type="button" onClick={() => play(l.level)}
                  className="notch cap-n group relative overflow-hidden text-left p-6 bg-l-surface hover:-translate-y-[3px] transition-transform cursor-pointer">
            <div className="absolute inset-0 pointer-events-none transition-opacity opacity-60 group-hover:opacity-100" aria-hidden
                 style={{ background: `radial-gradient(ellipse 80% 90% at 100% 0%, rgba(255,255,255,.045), transparent ${45 + i * 12}%)` }} />
            <div className="relative flex items-start justify-between">
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-l-text3">Game</span>
              <span className="font-mono text-l-text2 tracking-[0.1em]">{l.glyph}</span>
            </div>
            <p className="relative m-0 mt-6 font-display font-bold text-white text-[2.2rem] leading-none tracking-[-0.02em] uppercase">{l.level}</p>
            <p className="relative m-0 mt-2 text-[14px] text-l-text2">{l.blurb}</p>
            <div className="relative flex items-center justify-between mt-6">
              <span className="notch num-n bg-white/[0.08] text-white font-mono text-[14px] px-3 py-1">+{LEVEL_XP[l.level]} XP</span>
              <span className="font-mono text-[13px] text-white group-hover:text-white transition-colors">Play →</span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 max-[900px]:grid-cols-2 gap-4 mt-5">
        <StatCard label="Problems solved" value={s.practiceSolved} />
        <StatCard label="Correct" value={s.practiceCorrect} />
        <StatCard label="Accuracy" value={`${acc}%`} />
        <StatCard label="XP from practice" value={s.practiceXp} sub="Games + problems" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-10 mb-4">
        <h2 className="m-0 font-display font-bold text-white text-[1.35rem]">Problems</h2>
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by topic">
          {PRACTICE_TOPICS.map((t) => (
            <button key={t} role="tab" aria-selected={topic === t} type="button" onClick={() => setTopic(t)}
                    className={`notch num-n px-3 py-1.5 text-[13px] cursor-pointer transition-colors ${topic === t ? "bg-white text-black" : "bg-white/[0.05] text-l-text2 hover:text-white"}`}>{t}</button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <Card><Empty title="No problems here yet" note="New problems drop with every session. Check back after the next one." /></Card>
      ) : (
        <ul className="list-none m-0 p-0 grid grid-cols-2 max-[900px]:grid-cols-1 gap-3">
          {list.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => setRun({ p, mode: "practice" })} className="w-full text-left cursor-pointer">
                <Card hover className="p-5 flex items-center gap-4">
                  <span className={`notch num-n grid place-items-center w-10 h-10 flex-none text-[14px] ${p.solved ? "bg-white/[0.08] text-white" : "bg-white/[0.05] text-l-text3"}`}>{p.solved ? <Check size={16} strokeWidth={3} /> : <CircleHelp size={17} />}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-white text-[15px]">{p.title}</span>
                    <span className="block text-[12.5px] text-l-text3">{p.topic} · {p.level}</span>
                  </span>
                  <Pill tone={p.level === "Hard" ? "accent" : "muted"}>{p.level}</Pill>
                  <Eyebrow className="max-[480px]:hidden">+1 XP</Eyebrow>
                </Card>
              </button>
            </li>
          ))}
        </ul>
      )}

      {run && <Portal><Solver key={run.p.id + run.mode} run={run} onClose={() => setRun(null)} /></Portal>}
    </>
  );
}
