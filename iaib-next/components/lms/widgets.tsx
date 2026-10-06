"use client";

import { Gift, Radio, Trophy, Flame as FlameIcon, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { fmtXp } from "@/lib/lms/store";
import { CURRICULUM, NOTIFICATIONS, REWARD_TIERS, fmtDate, fmtDay, fmtTime, nextReward, prevRewardXp, sessionState,
  type Session, type Student } from "@/lib/lms/data";
import { Bar, Card, Eyebrow, Pill } from "./ui";

export function StatCard({ label, value, sub, icon, href, children }:
  { label: string; value: ReactNode; sub?: ReactNode; icon?: ReactNode; href?: string; children?: ReactNode }) {
  const body = (
    <Card hover={!!href} className="p-5 h-full">
      <div className="flex items-start justify-between gap-3">
        <Eyebrow>{label}</Eyebrow>
        {icon && <span className="text-l-text3" aria-hidden>{icon}</span>}
      </div>
      <p className="m-0 mt-4 font-display font-bold text-white text-[2rem] leading-none tracking-[-0.02em] tabular-nums">{value}</p>
      {sub && <p className="m-0 mt-2 text-[13px] text-l-text2">{sub}</p>}
      {children}
    </Card>
  );
  return href ? <Link href={href} className="block h-full">{body}</Link> : body;
}

/* XP towards the next reward, with the tier ladder underneath. */
export function RewardCard({ student, compact }: { student: Student; compact?: boolean }) {
  const r = nextReward(student.xp);
  const from = prevRewardXp(student.xp);
  const pct = ((student.xp - from) / (r.xp - from)) * 100;
  const left = Math.max(0, r.xp - student.xp);
  return (
    <Card className="p-6 overflow-hidden">
      <div className="absolute -right-16 -top-16 w-56 h-56 pointer-events-none" aria-hidden
           style={{ background: "radial-gradient(circle, rgba(255,255,255,.045), transparent 70%)" }} />
      <Eyebrow>Your XP</Eyebrow>
      <div className="relative flex flex-wrap items-end justify-between gap-4 mt-3">
        <p className="m-0 font-display font-bold text-white text-[3rem] leading-none tracking-[-0.03em] tabular-nums">
          {fmtXp(student.xp)}<span className="text-l-text3 text-[1.1rem] font-mono font-normal ml-2">XP</span>
        </p>
        <div className="text-right">
          <p className="m-0 text-[12.5px] text-l-text3">Next reward</p>
          <p className="m-0 font-display font-bold text-white text-[1.15rem] flex items-center justify-end gap-2"><Gift size={18} className="text-l-text2" /> {r.title}</p>
        </div>
      </div>
      <Bar value={pct} className="mt-5" />
      <div className="flex justify-between mt-2 text-[13px]">
        <span className="text-l-text2"><span className="text-l-accent font-mono">{fmtXp(left)} XP</span> to go</span>
        <span className="font-mono text-l-text3">{r.xp} XP</span>
      </div>
      {!compact && (
        <ol className="list-none m-0 mt-6 p-0 grid grid-cols-4 max-[560px]:grid-cols-2 gap-2">
          {REWARD_TIERS.map((t) => {
            const got = student.xp >= t.xp;
            const isNext = t === r;
            return (
              <li key={t.xp} className={`notch num-n p-3 ${got ? "bg-white/[0.08]" : isNext ? "bg-white/[0.06] shadow-[inset_0_0_0_1px_var(--lms-accent)]" : "bg-white/[0.03]"}`}>
                <p className={`m-0 font-mono text-[12px] ${got ? "text-white" : "text-l-text3"}`}>{t.xp} XP{got ? " · unlocked" : ""}</p>
                <p className={`m-0 mt-1 text-[13.5px] leading-tight ${got || isNext ? "text-white" : "text-l-text2"}`}>{t.title}</p>
                <p className="m-0 mt-0.5 text-[11.5px] text-l-text3">{t.note}</p>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}

export function XpHistory({ student }: { student: Student }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <Eyebrow>How you earned it</Eyebrow>
        <span className="text-[12.5px] text-l-text3">Latest first</span>
      </div>
      <ul className="list-none m-0 mt-4 p-0 grid">
        {student.xpLog.slice(0, 6).map((l) => (
          <li key={l.id} className="flex items-center gap-3 py-2.5 border-b border-l-line last:border-0">
            <span className={`w-1.5 h-1.5 flex-none ${l.amount > 0 ? "bg-l-accent" : "bg-white/30"}`} />
            <span className="flex-1 text-[14px] text-l-text">{l.label}</span>
            <span className="text-[12px] text-l-text3">{l.at}</span>
            <span className={`font-mono text-[13px] w-14 text-right ${l.amount > 0 ? "text-l-accent" : "text-l-text3"}`}>{l.amount > 0 ? "+" : ""}{fmtXp(l.amount)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function SessionCard({ s, completed, cta = "View Session" }: { s: Session; completed: number; cta?: string }) {
  const st = sessionState(s.no, completed);
  const mod = CURRICULUM[s.module];
  return (
    <Card as="article" hover className="p-5 flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[12px] text-l-text3">Session {String(s.no).padStart(2, "0")}</span>
        <Pill tone={st === "current" ? "solid" : st === "done" ? "ok" : "muted"}>{st === "current" ? "Today" : st === "done" ? "Done" : st === "upcoming" ? "Upcoming" : "Locked"}</Pill>
      </div>
      <h3 className="m-0 mt-3 font-display font-bold text-white text-[1.15rem] leading-snug">{s.title}</h3>
      <p className="m-0 mt-1 text-[13px] text-l-text3">{mod.title}</p>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 mt-4 text-[13px]">
        <div><dt className="text-l-text3">Date</dt><dd className="m-0 text-l-text">{fmtDay(s.date)}, {fmtDate(s.date)}</dd></div>
        <div><dt className="text-l-text3">Time</dt><dd className="m-0 text-l-text">{fmtTime(s.date)}</dd></div>
        <div><dt className="text-l-text3">Mentor</dt><dd className="m-0 text-l-text truncate">{s.mentor}</dd></div>
        <div><dt className="text-l-text3">Duration</dt><dd className="m-0 text-l-text">{s.minutes} min</dd></div>
      </dl>
      <Link href="/lms/learn" className="mt-5 self-start font-mono text-[13px] text-l-text2 hover:text-white transition-colors">{cta} →</Link>
    </Card>
  );
}

const N_ICON: Record<string, LucideIcon> = { session: Radio, rank: Trophy, reward: Gift, streak: FlameIcon };

export function Notifications({ limit }: { limit?: number }) {
  const list = NOTIFICATIONS.slice(0, limit);
  return (
    <ul className="list-none m-0 p-0 grid">
      {list.map((n) => (
        <li key={n.id} className="flex gap-3 py-3.5 border-b border-l-line last:border-0">
          <span className="notch num-n grid place-items-center w-9 h-9 bg-white/[0.06] text-white flex-none" aria-hidden>{(() => { const I = N_ICON[n.kind]; return <I size={17} />; })()}</span>
          <div className="flex-1 min-w-0">
            <p className="m-0 text-[14px] text-white">{n.title}</p>
            <p className="m-0 text-[13px] text-l-text2">{n.body}</p>
          </div>
          <span className="text-[12px] text-l-text3 whitespace-nowrap">{n.at}</span>
        </li>
      ))}
    </ul>
  );
}
