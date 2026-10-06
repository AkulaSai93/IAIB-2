"use client";

import { CalendarDays, Clock, MonitorPlay, Trophy, User, Zap } from "lucide-react";
import Link from "next/link";
import { useLms, fmtXp } from "@/lib/lms/store";
import { CURRICULUM, SESSIONS } from "@/lib/lms/data";
import { Bar, Button, Card, Eyebrow, Pill, greeting, Flame } from "@/components/lms/ui";
import { Notifications, SessionCard, StatCard } from "@/components/lms/widgets";
import { LeagueCard } from "@/components/lms/game";

/* Dashboard answers "what should I do today?": today's numbers, the one
   thing to continue, the league, what's coming up, what's new. */


export default function Dashboard() {
  const { student: s } = useLms();
  const cur = SESSIONS[s.sessionsCompleted];
  const mod = CURRICULUM[cur.module];
  const modDone = mod.sessions.filter((x) => x.no <= s.sessionsCompleted).length;
  const upcoming = SESSIONS.slice(s.sessionsCompleted + 1, s.sessionsCompleted + 4);

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-5 mb-8">
        <div>
          <Eyebrow className="mb-3">Dashboard · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</Eyebrow>
          <h1 className="m-0 font-display font-bold text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] tracking-[-0.03em]">{greeting()}, {s.name}</h1>
          <p className="m-0 mt-3 text-l-text2 text-[16px]">Keep your streak alive and continue your learning journey.</p>
        </div>
      </header>

      <div className="grid grid-cols-4 max-[1000px]:grid-cols-2 gap-4">
        <StatCard label="Sessions" value={<>{s.sessionsCompleted}<span className="text-l-text3 text-[1.1rem]"> / {s.totalSessions}</span></>} icon={<MonitorPlay size={18} />} href="/lms/learn">
          <Bar value={(s.sessionsCompleted / s.totalSessions) * 100} thin className="mt-4" />
        </StatCard>
        <StatCard label="Overall ranking" value={`#${s.rank}`} icon={<Trophy size={18} />} sub={<span className="text-l-text2">▲ {s.rankDelta} this week</span>} />
        <StatCard label="XP" value={fmtXp(s.xp)} icon={<Zap size={18} />} sub="Earned across IAIB" href="/lms/overview" />
        <StatCard label="Streak" value={<span className="inline-flex items-center gap-2"><Flame size={28} /> {s.streak}</span>} sub={`days · best ${s.longestStreak}`} />
      </div>

      <div className="grid gap-5 mt-5">
        {/* continue learning */}
        <Card as="section" className="p-7 max-[640px]:p-5 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden
               style={{ background: "radial-gradient(ellipse 60% 90% at 100% 0%, rgba(255,255,255,.045), transparent 65%)" }} />
          <div className="relative">
            <div className="flex items-center gap-2"><Eyebrow>Continue learning</Eyebrow><Pill tone="solid">Live today</Pill></div>
            <p className="m-0 mt-5 font-mono text-[13px] text-l-text2">{mod.title} · Session {String(cur.no).padStart(2, "0")}</p>
            <h2 className="m-0 mt-2 font-display font-bold text-white text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight tracking-[-0.02em]">&ldquo;{cur.title}&rdquo;</h2>
            <p className="m-0 mt-3 text-l-text2 max-w-[52ch]">{mod.desc}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-[13.5px] text-l-text2">
              <span className="inline-flex items-center gap-1.5"><Clock size={15} /> {cur.minutes} min</span><span className="inline-flex items-center gap-1.5"><User size={15} /> {cur.mentor}</span><span className="inline-flex items-center gap-1.5"><CalendarDays size={15} /> 10:00 AM IST</span>
            </div>
            <div className="mt-6 max-w-[420px]">
              <div className="flex justify-between text-[13px] mb-2"><span className="text-l-text2">Module progress</span><span className="font-mono text-white">{modDone} / {mod.sessions.length} sessions</span></div>
              <Bar value={(modDone / mod.sessions.length) * 100} />
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link href="/lms/learn"><Button>Continue Learning →</Button></Link>
              <span className="text-[13px] text-l-text3">Finish it for <span className="text-l-accent">+5 XP</span></span>
            </div>
          </div>
        </Card>
      </div>

      {/* the game layer: where you stand this week */}
      <div className="mt-5">
        <LeagueCard s={s} />
      </div>

      <div className="grid grid-cols-[1.6fr_1fr] max-[1000px]:grid-cols-1 gap-5 mt-5">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="m-0 font-display font-bold text-white text-[1.25rem]">Upcoming sessions</h2>
            <Link href="/lms/learn" className="font-mono text-[13px] text-l-text2 hover:text-white">All 30 →</Link>
          </div>
          <div className="grid grid-cols-3 max-[1180px]:grid-cols-2 max-[640px]:grid-cols-1 gap-4">
            {upcoming.map((x) => <SessionCard key={x.no} s={x} completed={s.sessionsCompleted} />)}
          </div>
        </section>
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="m-0 font-display font-bold text-white text-[1.25rem]">Notifications</h2>
            <Pill tone="accent">4 new</Pill>
          </div>
          <Card className="px-5 py-1"><Notifications /></Card>
        </section>
      </div>
    </>
  );
}
