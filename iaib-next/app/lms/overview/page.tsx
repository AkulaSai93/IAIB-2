"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ChevronDown, Gift, Lock, PackageOpen, Play, Shield, Trophy, Zap } from "lucide-react";
import { useLms, fmtXp } from "@/lib/lms/store";
import { CURRICULUM, REWARD_TIERS, levelOf, sessionState, XP_PER_LEVEL } from "@/lib/lms/data";
import { Avatar, Card, Eyebrow, Flame } from "@/components/lms/ui";
import { LEAGUE } from "@/lib/lms/data";
import { weeklyXp } from "@/components/lms/game";

/* Overview answers "where am I in my IAIB journey?", told as a game: your
   player card, the reward road and your unit badges. No to-do
   list here; that is the Dashboard's job. */

function PlayerCard() {
  const { student: s } = useLms();
  const lvl = levelOf(s.xp);
  const inLevel = s.xp - (lvl - 1) * XP_PER_LEVEL;
  const pct = (inLevel / XP_PER_LEVEL) * 100;
  const leaguePlace = [...LEAGUE.players.map((p) => p.xp), weeklyXp(s)].sort((a, b) => b - a).indexOf(weeklyXp(s)) + 1;
  const chips = [
    { icon: <Flame size={18} />, value: `${s.streak}`, label: "day streak" },
    { icon: <Trophy size={18} className="text-l-text2" />, value: `#${s.rank}`, label: "overall" },
    { icon: <Shield size={18} className="text-l-text2" />, value: `#${leaguePlace}`, label: LEAGUE.name },
    { icon: <Zap size={18} className="text-l-text2" />, value: `${s.sessionsCompleted}/${s.totalSessions}`, label: "sessions" },
  ];
  return (
    <Card as="section" className="p-7 max-[640px]:p-5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden
           style={{ background: "radial-gradient(ellipse 45% 120% at 0% 50%, rgba(255,255,255,.045), transparent 70%)" }} />
      <div className="relative flex flex-wrap items-center gap-7">
        {/* avatar with its level tag */}
        <div className="relative">
          <span className="block rounded-full overflow-hidden bg-l-elev w-[104px] h-[104px] grid place-items-center">
            <Avatar student={s} size={92} className="!rounded-full" />
          </span>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-l-accent text-white font-mono font-medium text-[12px] tracking-[0.08em] px-2.5 py-1"
                aria-label={`Level ${lvl}`}>LV {lvl}</span>
        </div>

        <div className="flex-1 min-w-[260px]">
          <Eyebrow>Your IAIB journey</Eyebrow>
          <h1 className="m-0 mt-2 font-display font-bold text-white text-[clamp(1.9rem,3.4vw,2.7rem)] leading-[1.05] tracking-[-0.03em]">
            {s.name}, you&rsquo;re on <span className="text-l-accent">Level {lvl}</span>
          </h1>
          <p className="m-0 mt-2 text-l-text2">Learn. Build. Practice. Compete.</p>
          {/* chunky level bar */}
          <div className="mt-5 max-w-[520px]">
            <div className="flex justify-between text-[13px] mb-2">
              <span className="font-mono text-white">{fmtXp(inLevel)} / {XP_PER_LEVEL} XP</span>
              <span className="text-l-text3">{fmtXp(XP_PER_LEVEL - inLevel)} XP to Level {lvl + 1}</span>
            </div>
            <div className="relative h-5 bg-white/[0.08] overflow-hidden">
              <div className="bar-in absolute inset-y-0 left-0 bg-l-accent" style={{ width: `${pct}%` }}>
                <span className="absolute inset-x-2 top-1 h-1.5 bg-white/30" aria-hidden />
              </div>
            </div>
          </div>
        </div>

        <ul className="list-none m-0 p-0 grid grid-cols-2 gap-2.5 max-[1100px]:w-full max-[1100px]:grid-cols-4 max-[560px]:grid-cols-2">
          {chips.map((c) => (
            <li key={c.label} className="flex items-center gap-3 bg-white/[0.05] border-b-4 border-black/40 px-4 py-3 min-w-[150px]">
              {c.icon}
              <span>
                <span className="block font-display font-bold text-white text-[1.2rem] leading-none">{c.value}</span>
                <span className="block mt-1 text-[11.5px] text-l-text3">{c.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function RewardRoad() {
  const { student: s } = useLms();
  const max = REWARD_TIERS[REWARD_TIERS.length - 1].xp;
  // the road is drawn in equal steps between chests, not to scale, so early rewards aren't squashed
  const stops = [0, ...REWARD_TIERS.map((t) => t.xp)];
  const seg = 100 / (stops.length - 1);
  const k = stops.findIndex((x, i) => i > 0 && s.xp < x);
  const fill = k === -1 ? 100 : (k - 1) * seg + ((s.xp - stops[k - 1]) / (stops[k] - stops[k - 1])) * seg;
  const next = REWARD_TIERS.find((t) => t.xp > s.xp);
  return (
    <Card as="section" className="p-7 max-[640px]:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Eyebrow>Reward road</Eyebrow>
          <h2 className="m-0 mt-2 font-display font-bold text-white text-[1.5rem]">
            {next ? <>{fmtXp(next.xp - s.xp)} XP to your <span className="text-white">{next.title}</span></> : "Every reward unlocked"}
          </h2>
        </div>
        <span className="font-mono text-[13px] text-l-text2">{fmtXp(s.xp)} / {max} XP</span>
      </div>

      <div className="relative mt-12 mb-4 mx-6">
        <div className="relative h-4 bg-white/[0.08]">
          <div className="bar-in absolute inset-y-0 left-0 bg-l-accent" style={{ width: `${fill}%` }} />
          {/* you */}
          <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10" style={{ left: `${fill}%` }}>
            <span className="block rounded-full overflow-hidden w-9 h-9 border-[3px] border-white bg-l-elev"><Avatar student={s} size={30} className="!rounded-full" /></span>
          </span>
        </div>
        {REWARD_TIERS.map((t, i) => {
          const got = s.xp >= t.xp;
          const isNext = t === next;
          return (
            <div key={t.xp} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${(i + 1) * seg}%` }}>
              <span className={`path-node !rounded-none grid place-items-center w-14 h-14 ${isNext ? "jump" : ""}`}
                    style={{ background: isNext ? "var(--lms-accent)" : got ? "#3a3a3a" : "#2b2b2b", "--node-ledge": isNext ? "color-mix(in srgb, var(--lms-accent) 50%, black)" : "#141414" } as React.CSSProperties}>
                {got ? <PackageOpen size={24} className="text-white" /> : isNext ? <Gift size={24} className="text-white" /> : <Lock size={20} className="text-l-text3" />}
              </span>
            </div>
          );
        })}
      </div>
      <div className="relative h-14 mx-6">
        {REWARD_TIERS.map((t, i) => (
          <div key={t.xp} className="absolute top-6 -translate-x-1/2 text-center w-[140px]" style={{ left: `${(i + 1) * seg}%` }}>
            <p className={`m-0 font-mono text-[12px] ${s.xp >= t.xp ? "text-white" : "text-l-text3"}`}>{t.xp} XP</p>
            <p className="m-0 mt-0.5 text-[13px] text-white leading-tight max-[640px]:hidden">{t.title}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function CurriculumCard() {
  const { student: s } = useLms();
  const curModule = CURRICULUM.findIndex((m) => m.sessions.some((x) => x.no === s.sessionsCompleted + 1));
  const [open, setOpen] = useState<number | null>(curModule);
  return (
    <Card as="section" className="p-7 max-[640px]:p-5">
      <div className="flex items-center justify-between">
        <div>
          <Eyebrow>Curriculum</Eyebrow>
          <h2 className="m-0 mt-2 font-display font-bold text-white text-[1.25rem]">{s.sessionsCompleted} of {s.totalSessions} sessions done</h2>
        </div>
        <Link href="/lms/learn" className="font-mono text-[13px] text-l-text2 hover:text-white">Go to Learn →</Link>
      </div>
      <ol className="list-none m-0 mt-5 p-0 grid gap-2">
        {CURRICULUM.map((m, mi) => {
          const done = m.sessions.filter((x) => x.no <= s.sessionsCompleted).length;
          const all = done === m.sessions.length;
          const active = mi === curModule;
          const locked = !active && done === 0;
          const isOpen = open === mi;
          return (
            <li key={m.no} className={`${active ? "bg-white/[0.06] shadow-[inset_3px_0_0_var(--lms-accent)]" : "bg-white/[0.03]"}`}>
              <button type="button" onClick={() => setOpen(isOpen ? null : mi)} aria-expanded={isOpen}
                      className="w-full flex items-center gap-4 p-3.5 text-left cursor-pointer">
                <span className={`grid place-items-center w-10 h-10 rounded-full flex-none font-mono text-[13px]
                                  ${all ? "bg-l-accent text-white" : active ? "bg-white text-black" : "bg-white/[0.06] text-l-text3"}`}>
                  {all ? <Check size={18} strokeWidth={3} /> : locked ? <Lock size={15} /> : m.no}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-[14.5px] ${locked ? "text-l-text2" : "text-white"}`}>{m.title}</span>
                  <span className="mt-1.5 block h-1.5 bg-white/[0.08] overflow-hidden">
                    <span className="bar-in block h-full bg-l-accent" style={{ width: `${(done / m.sessions.length) * 100}%` }} />
                  </span>
                </span>
                <span className="font-mono text-[12px] text-l-text3 w-9 text-right">{done}/{m.sessions.length}</span>
                <ChevronDown size={16} className={`text-l-text3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <ol className="lms-page list-none m-0 px-3.5 pb-3.5 grid gap-1">
                  {m.sessions.map((x) => {
                    const st = sessionState(x.no, s.sessionsCompleted);
                    return (
                      <li key={x.no} className="flex items-center gap-3 pl-[52px] pr-1 py-1.5 text-[13.5px]">
                        <span className={`grid place-items-center w-5 h-5 rounded-full flex-none
                                          ${st === "done" ? "bg-l-accent text-white" : st === "current" ? "bg-white text-black" : "bg-white/[0.06] text-l-text3"}`}>
                          {st === "done" ? <Check size={11} strokeWidth={3.5} /> : st === "current" ? <Play size={9} fill="currentColor" /> : <Lock size={10} />}
                        </span>
                        <span className={`flex-1 truncate ${st === "done" || st === "current" ? "text-white" : "text-l-text3"}`}>{x.title}</span>
                        <span className="font-mono text-[11px] text-l-text3">{st === "current" ? "Today" : `${x.minutes}m`}</span>
                      </li>
                    );
                  })}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

export default function Overview() {
  const { student: s } = useLms();

  return (
    <div className="grid gap-5">
      <PlayerCard />

      <RewardRoad />

      <div className="grid grid-cols-[1.4fr_1fr] max-[1000px]:grid-cols-1 gap-5">
        {/* the curriculum, module by module; the current one open */}
        <CurriculumCard />

        {/* recent wins */}
        <Card as="section" className="p-7 max-[640px]:p-5">
          <Eyebrow>Recent wins</Eyebrow>
          <ul className="list-none m-0 mt-5 p-0 grid gap-2">
            {s.xpLog.slice(0, 6).map((l) => (
              <li key={l.id} className="flex items-center gap-3 bg-white/[0.03] px-3.5 py-3">
                <span className={`grid place-items-center w-8 h-8 rounded-full flex-none ${l.amount > 0 ? "bg-white/[0.08] text-white" : "bg-white/[0.06] text-l-text3"}`}><Zap size={15} /></span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[14px] text-white truncate">{l.label}</span>
                  <span className="block text-[11.5px] text-l-text3">{l.at}</span>
                </span>
                <span className={`font-mono text-[13px] ${l.amount > 0 ? "text-l-accent" : "text-l-text3"}`}>{l.amount > 0 ? "+" : ""}{fmtXp(l.amount)} XP</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
