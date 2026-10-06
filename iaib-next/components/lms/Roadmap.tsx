"use client";

import Link from "next/link";
import { Check, ClipboardCheck, Code2, GraduationCap, Lock, PenLine, Radio, Rocket, Trophy, UserPlus, type LucideIcon } from "lucide-react";
import { JOURNEY, type Student } from "@/lib/lms/data";

/* The IAIB journey as a quest map: chunky 3D stage nodes (the same as the
   Learn path) along a track, lit where done, pulsing where you are, locked
   ahead. Desktop lays it out as a winding row; narrow screens as a trail. */

export type StepState = "done" | "current" | "action" | "upcoming" | "locked";

export function journeyStates(s: Student): StepState[] {
  return JOURNEY.map((j) => {
    if (j.id === "register") return "done";
    if (j.id === "profile") return s.profileCompleted ? "done" : "action";
    if (j.id === "live") return s.sessionsCompleted >= s.totalSessions ? "done" : "current";
    if (j.id === "curriculum" || j.id === "practice") return "upcoming";
    return "locked";
  });
}

const ICON: Record<string, LucideIcon> = {
  register: UserPlus, profile: PenLine, live: Radio, curriculum: GraduationCap,
  practice: Code2, screening: ClipboardCheck, prototype: Rocket, finale: Trophy,
};
const LINKS: Record<string, string> = { profile: "/lms/profile", live: "/lms/learn", curriculum: "/lms/learn", practice: "/lms/practice" };
const LABEL: Record<StepState, string> = { done: "Cleared", current: "You are here", action: "Finish this", upcoming: "Up next", locked: "Locked" };

const sizeOf = (_id: string, _st: StepState) => 68;

function Node({ id, state }: { id: string; state: StepState }) {
  const I = ICON[id];
  const lit = state === "current" || state === "action" || state === "done";
  const done = false;
  const size = sizeOf(id, state);
  return (
    <span className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      {(state === "current" || state === "action") && (
        <span className="ring-spin absolute -inset-[10px] rounded-full border-[4px] border-dashed border-l-accent" aria-hidden />
      )}
      <span className="path-node grid place-items-center w-full h-full"
            style={{ background: lit ? "var(--lms-accent)" : done ? "#3a3a3a" : "#2b2b2b", "--node-ledge": lit ? "color-mix(in srgb, var(--lms-accent) 50%, black)" : "#141414" } as React.CSSProperties}>
        {state === "done" ? <Check size={size * 0.42} strokeWidth={3.5} className="text-white" />
          : state === "locked" ? <Lock size={size * 0.32} className="text-l-text3" />
          : <I size={size * 0.42} strokeWidth={2.4} className={lit ? "text-white" : "text-l-text2"} />}
      </span>
    </span>
  );
}

export default function Roadmap({ student }: { student: Student }) {
  const states = journeyStates(student);
  const n = JOURNEY.length;

  return (
    <>
      {/* ---------- desktop: one straight, even track ---------- */}
      <div className="max-[899px]:hidden pt-14 pb-2">
        <ol className="list-none m-0 p-0 relative grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {/* the track runs node centre to node centre: solid where cleared, dotted ahead */}
          <span aria-hidden className="absolute top-[34px] h-[4px] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.22)_0_4px,transparent_4px_12px)]"
                style={{ left: `${50 / n}%`, right: `${50 / n}%` }} />
          <span aria-hidden className="absolute top-[34px] h-[4px] bg-white/55 transition-[width] duration-700"
                style={{ left: `${50 / n}%`, width: `${(Math.max(0, states.findIndex((x) => x !== "done")) / n) * 100}%` }} />
          {JOURNEY.map((j, i) => {
            const st = states[i];
            const here = st === "current" || st === "action";
            const href = LINKS[j.id];
            const inner = (
              <>
                {here && (
                  <span className="start-bubble absolute left-1/2 -top-12 z-10 px-2.5 py-1 bg-white font-mono font-medium text-[11px] tracking-[0.08em] uppercase whitespace-nowrap text-white" aria-hidden>
                    <span className="text-black">You are here</span>
                  </span>
                )}
                <Node id={j.id} state={st} />
                <span className={`mt-4 font-display font-bold text-[14.5px] leading-tight ${st === "locked" ? "text-l-text3" : "text-white"}`}>{j.title}</span>
                <span className={`mt-1.5 font-mono text-[10.5px] tracking-[0.1em] uppercase ${here ? "text-l-accent" : "text-l-text3"}`}>
                  {j.id === "live" && st === "current" ? `${student.sessionsCompleted}/${student.totalSessions} sessions` : LABEL[st]}
                </span>
              </>
            );
            return (
              <li key={j.id} className="relative flex flex-col items-center text-center px-1">
                {href ? <Link href={href} className="relative flex flex-col items-center" aria-label={`${j.title}: ${LABEL[st]}`}>{inner}</Link>
                  : <div className="relative flex flex-col items-center">{inner}</div>}
              </li>
            );
          })}
        </ol>
      </div>

      {/* ---------- vertical trail ---------- */}
      <ol className="min-[900px]:hidden list-none m-0 p-0 relative">
        {JOURNEY.map((j, i) => {
          const st = states[i];
          return (
            <li key={j.id} className="relative flex items-center gap-4 pb-7 last:pb-0">
              {i < n - 1 && <span className={`absolute left-[33px] top-[74px] bottom-0 w-[5px] ${st === "done" ? "bg-l-accent" : "bg-white/10"}`} aria-hidden />}
              <Node id={j.id} state={st === "current" ? "action" : st} />
              <div className="min-w-0">
                <p className={`m-0 font-display font-bold text-[16px] ${st === "locked" ? "text-l-text3" : "text-white"}`}>{j.title}</p>
                <p className="m-0 text-[13px] text-l-text2">{j.blurb}</p>
                <p className={`m-0 mt-1 font-mono text-[10.5px] tracking-[0.1em] uppercase ${st === "current" || st === "action" ? "text-l-accent" : "text-l-text3"}`}>
                  {j.id === "live" && st === "current" ? `${student.sessionsCompleted} / ${student.totalSessions} sessions` : LABEL[st]}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
