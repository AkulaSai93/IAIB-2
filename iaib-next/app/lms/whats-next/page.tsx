"use client";

import { ArrowRight, Check, Gift } from "lucide-react";
import Link from "next/link";
import { useLms, fmtXp } from "@/lib/lms/store";
import { CURRICULUM, SESSIONS, fmtDate, nextReward, today } from "@/lib/lms/data";
import { Bar, Button, Card, Eyebrow, PageHead, Pill, Sprite, Xp } from "@/components/lms/ui";

/* What's Next answers "what should I do next?". The steps are derived from
   the student's state; a recommendation engine (or the AI backend) can
   later replace `steps`/`recs` without touching the layout. */

const TOPIC_ACCURACY = [
  { topic: "AI", pct: 88 }, { topic: "Python", pct: 81 }, { topic: "Prompting", pct: 58 },
  { topic: "LLMs", pct: 74 }, { topic: "Agents", pct: 66 },
];

export default function WhatsNext() {
  const { student: s } = useLms();
  const cur = SESSIONS[s.sessionsCompleted];
  const weak = [...TOPIC_ACCURACY].sort((a, b) => a.pct - b.pct)[0];
  const r = nextReward(s.xp);

  const steps = [
    { title: `Complete Session ${String(cur.no).padStart(2, "0")}`, note: `${cur.title} · ${cur.minutes} min`, xp: 5, href: "/lms/learn", done: false },
    { title: "Solve today's POTD", note: "One question, about two minutes", xp: 2, href: "/lms/potd", done: s.potdSolvedOn === today() },
    { title: "Complete 2 practice problems", note: `Start with ${weak.topic}, your weakest topic`, xp: 2, href: "/lms/practice", done: false },
    { title: "Complete your profile", note: "Email, school, class and city", xp: 10, href: "/lms/profile", done: s.profileCompleted },
  ];
  const open = steps.filter((x) => !x.done);

  return (
    <>
      <PageHead eyebrow="What's next" title="Your next steps" sub="Ranked by what moves you forward most, based on your progress so far." />

      <Card className="p-5 mb-6 flex items-center gap-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden style={{ background: "linear-gradient(100deg, rgba(255,255,255,.045), transparent 60%)" }} />
        <span className="relative bob notch num-n grid place-items-center w-12 h-12 bg-white/[0.06] flex-none"><Sprite size={30} /></span>
        <p className="relative m-0 text-[15px] text-l-text">
          <span className="text-white font-medium">Byte&rsquo;s take:</span> you&rsquo;re {s.sessionsCompleted} sessions in and on a {s.streak}-day streak.
          Today&rsquo;s session plus the POTD keeps you on pace for screening, and {open.reduce((a, x) => a + x.xp, 0)} XP is on the table.
        </p>
      </Card>

      <ol className="list-none m-0 p-0 grid gap-3">
        {steps.map((x, i) => (
          <li key={x.title}>
            <Link href={x.href} className="block group">
              <Card hover className={`p-5 flex items-center gap-5 max-[560px]:gap-4 ${x.done ? "opacity-55" : ""}`}>
                <span className={`notch cap-n grid place-items-center w-12 h-12 flex-none font-display font-bold text-[1.25rem]
                  ${x.done ? "bg-l-accent text-white" : i === 0 ? "bg-white text-black" : "bg-white/[0.06] text-white"}`}>{x.done ? <Check size={20} strokeWidth={3} /> : i + 1}</span>
                <span className="flex-1 min-w-0">
                  <span className={`block font-display font-bold text-[1.15rem] ${x.done ? "text-l-text2 line-through" : "text-white"}`}>{x.title}</span>
                  <span className="block text-[13.5px] text-l-text2">{x.note}</span>
                </span>
                {x.done ? <Pill tone="ok">Done</Pill> : <Xp n={x.xp} />}
                <ArrowRight size={18} className="text-l-text3 group-hover:text-white transition-colors max-[560px]:hidden" aria-hidden />
              </Card>
            </Link>
          </li>
        ))}
      </ol>

      <h2 className="m-0 mt-10 mb-4 font-display font-bold text-white text-[1.35rem]">Recommended for you</h2>
      <div className="grid grid-cols-4 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1 gap-4">
        <Card hover className="p-5 flex flex-col">
          <Eyebrow>Recommended session</Eyebrow>
          <p className="m-0 mt-3 font-display font-bold text-white text-[1.1rem] leading-snug">{SESSIONS[s.sessionsCompleted + 1].title}</p>
          <p className="m-0 mt-1 text-[13px] text-l-text2">Tomorrow · {CURRICULUM[SESSIONS[s.sessionsCompleted + 1].module].title}</p>
          <Link href="/lms/learn" className="mt-auto pt-5 font-mono text-[13px] text-l-text2 hover:text-white">Preview →</Link>
        </Card>
        <Card hover className="p-5 flex flex-col">
          <Eyebrow>Weak topic</Eyebrow>
          <p className="m-0 mt-3 font-display font-bold text-white text-[1.1rem]">{weak.topic}</p>
          <p className="m-0 mt-1 text-[13px] text-l-text2">{weak.pct}% accuracy, your lowest. Three Medium problems will lift it.</p>
          <Link href="/lms/practice" className="mt-auto pt-5 font-mono text-[13px] text-l-text2 hover:text-white">Practise {weak.topic} →</Link>
        </Card>
        <Card hover className="p-5 flex flex-col">
          <Eyebrow>Upcoming deadline</Eyebrow>
          <p className="m-0 mt-3 font-display font-bold text-white text-[1.1rem]">Module 01 wrap-up</p>
          <p className="m-0 mt-1 text-[13px] text-l-text2">Finish AI Foundations by {fmtDate(CURRICULUM[0].sessions[4].date)} to stay on pace.</p>
          <div className="mt-auto pt-5"><Bar value={(Math.min(s.sessionsCompleted, 5) / 5) * 100} thin /></div>
        </Card>
        <Card hover className="p-5 flex flex-col">
          <Eyebrow>Reward progress</Eyebrow>
          <p className="m-0 mt-3 font-display font-bold text-white text-[1.1rem] flex items-center gap-2"><Gift size={18} className="text-l-text2" /> {r.title}</p>
          <p className="m-0 mt-1 text-[13px] text-l-text2">{fmtXp(Math.max(0, r.xp - s.xp))} XP to go. Daily POTDs get you there.</p>
          <div className="mt-auto pt-5"><Bar value={(s.xp / r.xp) * 100} thin /></div>
        </Card>
      </div>

      <Card className="p-6 mt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Eyebrow>Accuracy by topic</Eyebrow>
            <p className="m-0 mt-1.5 text-[13.5px] text-l-text2">Where your practice answers land. Lowest first gets the most from your time.</p>
          </div>
          <Link href="/lms/practice"><Button variant="ghost">Go to practice</Button></Link>
        </div>
        <div className="grid gap-3 mt-5">
          {TOPIC_ACCURACY.map((t) => (
            <div key={t.topic} className="grid grid-cols-[110px_1fr_48px] items-center gap-4">
              <span className={`text-[14px] ${t === weak ? "text-l-accent" : "text-l-text"}`}>{t.topic}</span>
              <Bar value={t.pct} thin />
              <span className="font-mono text-[13px] text-l-text2 text-right">{t.pct}%</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
