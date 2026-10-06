"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronsDown, ChevronsUp, Clock, Gift, PackageOpen, Shield, Zap } from "lucide-react";
import { useLms, fmtXp } from "@/lib/lms/store";
import { AVATARS, LEAGUE, QUESTS, WEEKLY_XP_BASE, today, type Student } from "@/lib/lms/data";
import { Avatar, Button, Card, Flame, Sprite } from "./ui";

/* The game layer, Duolingo-style: streak, a weekly league, daily quests with
   chests, and the celebration that closes a session. GameRail stacks the
   first three as a right-hand column. */

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakCard({ s }: { s: Student }) {
  const todayIdx = (new Date().getDay() + 6) % 7;
  return (
    <Card className="p-5 overflow-hidden">
      <div className="absolute -right-6 -top-6 opacity-[0.12] pointer-events-none" aria-hidden><Flame size={120} /></div>
      <div className="relative flex items-center gap-4">
        <Flame size={44} />
        <div>
          <p className="m-0 font-display font-bold text-white text-[2rem] leading-none">{s.streak}</p>
          <p className="m-0 mt-1 text-[13px] text-l-text2">day streak · best {s.longestStreak}</p>
        </div>
      </div>
      <div className="relative grid grid-cols-7 gap-1.5 mt-4">
        {DAYS.map((d, i) => (
          <div key={i} className="grid justify-items-center gap-1">
            <span className={`w-8 h-8 rounded-full grid place-items-center ${s.week[i] ? "bg-white/[0.14]" : i === todayIdx ? "bg-white/[0.06] shadow-[inset_0_0_0_2px_var(--lms-accent)]" : "bg-white/[0.06]"}`}>
              {s.week[i] && <Flame size={14} className="!animate-none" />}
            </span>
            <span className={`text-[11px] ${i === todayIdx ? "text-white" : "text-l-text3"}`}>{d}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function weeklyXp(s: Student) { return WEEKLY_XP_BASE + (s.todayXp ?? 0); }

export function LeagueCard({ s, full }: { s: Student; full?: boolean }) {
  const me = { name: `${s.name} (you)`, avatar: s.avatar, xp: weeklyXp(s), me: true };
  const rows = [...LEAGUE.players.map((p) => ({ ...p, me: false })), me].sort((a, b) => b.xp - a.xp);
  const myRank = rows.findIndex((r) => r.me) + 1;
  const shown = full ? rows : rows.slice(Math.max(0, myRank - 3), Math.max(0, myRank - 3) + 5);
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <span className="grid place-items-center w-11 h-11 bg-white/[0.06] text-white"><Shield size={22} fill="currentColor" fillOpacity={0.25} /></span>
        <div className="flex-1">
          <p className="m-0 font-display font-bold text-white">{LEAGUE.name}</p>
          <p className="m-0 text-[12.5px] text-l-text3 flex items-center gap-1"><Clock size={12} /> Ends in {LEAGUE.endsIn}</p>
        </div>
        <span className="font-mono text-[13px] text-white">#{myRank}</span>
      </div>
      <ol className="list-none m-0 mt-4 p-0 grid gap-1">
        {shown.map((r) => {
          const rank = rows.indexOf(r) + 1;
          const up = rank <= LEAGUE.promote, down = rank > rows.length - LEAGUE.demote;
          const av = AVATARS.find((a) => a.id === r.avatar);
          return (
            <li key={r.name} className={`flex items-center gap-3 px-2.5 py-2 ${r.me ? "bg-white/[0.08]" : ""}`}>
              <span className={`w-5 text-center font-mono text-[13px] ${up ? "text-white" : "text-l-text3"}`}>{rank}</span>
              {r.me ? <Avatar student={s} size={30} className="!rounded-full" />
                : <>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={av?.img} alt="" className="w-[30px] h-[30px] rounded-full object-cover" /></>}
              <span className={`flex-1 text-[14px] truncate ${r.me ? "text-white font-medium" : "text-l-text"}`}>{r.name}</span>
              <span className="font-mono text-[12.5px] text-l-text2">{r.xp} XP</span>
            </li>
          );
        })}
      </ol>
      <div className="flex justify-between mt-3 text-[12px]">
        <span className="flex items-center gap-1 text-l-text2"><ChevronsUp size={14} /> Top {LEAGUE.promote} advance</span>
        <span className="flex items-center gap-1 text-l-text3"><ChevronsDown size={14} /> Bottom {LEAGUE.demote} drop</span>
      </div>
    </Card>
  );
}

export function questProgress(q: (typeof QUESTS)[number], s: Student) {
  if (q.id === "xp") return Math.min(q.goal, Math.floor(s.todayXp ?? 0));
  if (q.id === "potd") return s.potdSolvedOn === today() ? 1 : 0;
  if (q.id === "practice") return Math.min(q.goal, s.todayCorrect ?? 0);
  return 0;
}

export function QuestsCard({ s }: { s: Student }) {
  const { patch, addXp } = useLms();
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="m-0 font-display font-bold text-white">Daily quests</p>
        <Link href="/lms/whats-next" className="font-mono text-[12px] text-l-text2 hover:text-white">View all</Link>
      </div>
      <ul className="list-none m-0 mt-4 p-0 grid gap-4">
        {QUESTS.map((q) => {
          const p = questProgress(q, s);
          const done = p >= q.goal;
          const claimed = (s.questsClaimed ?? []).includes(q.id);
          return (
            <li key={q.id} className="flex items-center gap-3">
              <span className="grid place-items-center w-10 h-10 bg-white/[0.05] text-l-accent flex-none"><Zap size={18} /></span>
              <div className="flex-1 min-w-0">
                <p className="m-0 text-[14px] text-white">{q.title}</p>
                <div className="relative mt-1.5 h-4 bg-white/[0.08] overflow-hidden">
                  <div className="bar-in absolute inset-y-0 left-0 bg-l-accent" style={{ width: `${(p / q.goal) * 100}%` }} />
                  <span className="relative block text-center text-[10.5px] leading-4 font-mono text-white">{p} / {q.goal}</span>
                </div>
              </div>
              <button type="button" disabled={!done || claimed} aria-label={claimed ? "Chest opened" : done ? `Open chest for ${q.xp} XP` : "Chest locked"}
                      onClick={(e) => { patch({ questsClaimed: [...(s.questsClaimed ?? []), q.id] }); addXp(q.xp, `Quest: ${q.title}`, { x: e.clientX, y: e.clientY - 20 }); }}
                      className={`grid place-items-center w-10 h-10 flex-none transition-transform ${done && !claimed ? "bg-l-accent text-white jump cursor-pointer hover:scale-105" : "bg-white/[0.04] text-l-text3"}`}>
                {claimed ? <PackageOpen size={18} /> : <Gift size={18} />}
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export function GameRail() {
  const { student: s } = useLms();
  return (
    <aside className="grid gap-4 content-start xl:sticky xl:top-24" aria-label="Your progress">
      <StreakCard s={s} />
      <LeagueCard s={s} />
    </aside>
  );
}

/* ------------------------------------------------------- celebration */

const CONFETTI = ["var(--lms-accent)", "#ffffff", "color-mix(in srgb, var(--lms-accent) 60%, white)", "#5a5a5a"];

export function Celebration({ title, sub, xp, minutes, onDone }: { title: string; sub: string; xp: number; minutes: number; onDone: () => void }) {
  const { student: s } = useLms();
  const [n, setN] = useState(0);
  useEffect(() => {
    let v = 0;
    const t = xp > 0 ? setInterval(() => { v += 1; setN(v); if (v >= xp) clearInterval(t); }, 90) : undefined;
    const k = (e: KeyboardEvent) => e.key === "Enter" && onDone();
    document.addEventListener("keydown", k);
    return () => { clearInterval(t); document.removeEventListener("keydown", k); };
  }, [xp, onDone]);
  const tiles = [
    { label: "Total XP", value: `+${n}`, icon: <Zap size={20} />, tone: "var(--lms-accent)" },
    { label: "Time", value: `${minutes}m`, icon: <Clock size={20} />, tone: "#3a3a3a" },
    { label: "Streak", value: `${s.streak}`, icon: <Flame size={20} className="!animate-none" />, tone: "#3a3a3a" },
  ];
  return (
    <div className="fixed inset-0 z-[400] bg-l-bg grid place-items-center p-6 overflow-hidden" role="dialog" aria-modal="true" aria-label={title}>
      <div className="confetti absolute inset-0 pointer-events-none" aria-hidden>
        {Array.from({ length: 46 }, (_, i) => (
          <i key={i} style={{ left: `${(i * 37) % 100}%`, background: CONFETTI[i % CONFETTI.length], "--x": `${((i * 53) % 120) - 60}px`, "--r": `${(i * 97) % 720}deg`, "--d": `${2.2 + (i % 7) * 0.35}s`, animationDelay: `${(i % 10) * 0.08}s` } as React.CSSProperties} />
        ))}
      </div>
      <div className="relative text-center max-w-[520px] w-full">
        <div className="jump inline-block"><Sprite size={110} /></div>
        <h2 className="m-0 mt-6 font-display font-bold text-l-accent text-[clamp(2rem,5vw,2.8rem)] tracking-[-0.02em]">{title}</h2>
        <p className="m-0 mt-2 text-l-text2 text-[16px]">{sub}</p>
        <div className="grid grid-cols-3 gap-3 mt-9">
          {tiles.map((t, i) => (
            <div key={t.label} className="tile-in p-[2px]" style={{ background: t.tone, animationDelay: `${0.25 + i * 0.12}s` }}>
              <p className="m-0 py-1.5 font-mono text-[11px] tracking-[0.1em] uppercase text-white font-medium">{t.label}</p>
              <div className=" bg-l-bg py-4 flex items-center justify-center gap-2 font-display font-bold text-white text-[1.5rem]" style={{ color: t.tone }}>
                {t.icon}<span className="text-white">{t.value}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10"><Button variant="accent" onClick={onDone} className="w-full max-w-[320px] !py-[14px] !text-[15px]">Continue</Button></div>
        <p className="m-0 mt-3 text-[12.5px] text-l-text3">Total: {fmtXp(s.xp)} XP</p>
      </div>
    </div>
  );
}

