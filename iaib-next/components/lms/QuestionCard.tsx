"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui";

/* One multiple-choice question with its result state. Used by Practice and
   POTD; the caller decides what a right or wrong answer is worth. */

export function Burst() {
  return (
    <span className="burst pointer-events-none absolute left-1/2 top-1/2" aria-hidden>
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const d = 60 + (i % 3) * 22;
        return <i key={i} style={{ "--dx": `${Math.cos(a) * d}px`, "--dy": `${Math.sin(a) * d}px`, animationDelay: `${(i % 4) * 30}ms` } as React.CSSProperties} />;
      })}
    </span>
  );
}

export default function QuestionCard({ question, options, answer, why, onResult, locked, submitLabel = "Submit Answer", renderResult }: {
  question: string; options: string[]; answer: number; why: string;
  onResult: (correct: boolean, e: React.MouseEvent, pick: number) => void;
  locked?: { picked: number };
  submitLabel?: string;
  renderResult?: (correct: boolean) => React.ReactNode;
}) {
  const [pick, setPick] = useState<number | null>(locked?.picked ?? null);
  const [done, setDone] = useState<boolean>(!!locked);
  const correct = pick === answer;
  const letters = "ABCD";

  return (
    <div>
      <p className="m-0 font-display font-bold text-white text-[clamp(1.25rem,2.2vw,1.6rem)] leading-snug tracking-[-0.01em]">{question}</p>
      <div className="grid gap-2.5 mt-6" role="radiogroup" aria-label="Answer options">
        {options.map((o, i) => {
          const state = !done ? (pick === i ? "picked" : "idle") : i === answer ? "right" : pick === i ? "wrong" : "idle";
          const cls = {
            idle: "bg-white/[0.04] hover:bg-white/[0.07] text-l-text",
            picked: "bg-l-soft shadow-[inset_0_0_0_1px_var(--lms-accent)] text-white",
            right: "bg-l-soft shadow-[inset_0_0_0_1px_var(--lms-accent)] text-white",
            wrong: "bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,.25)] text-l-text2 line-through decoration-white/40",
          }[state];
          return (
            <button key={i} type="button" role="radio" aria-checked={pick === i} disabled={done} onClick={() => setPick(i)}
                    className={`flex items-center gap-4 p-4 border-b-4 border-black/40 text-left text-[15px] transition-[background,transform] cursor-pointer active:translate-y-[2px] disabled:cursor-default disabled:active:translate-y-0 ${cls}`}>
              <span className={` grid place-items-center w-8 h-8 flex-none font-mono text-[13px]
                ${state === "right" ? "bg-l-accent text-white" : state === "picked" ? "bg-l-accent text-white" : "bg-white/[0.07] text-l-text2"}`}>
                {state === "right" ? <Check size={16} strokeWidth={3} /> : state === "wrong" ? <X size={16} strokeWidth={2.5} /> : letters[i]}
              </span>
              <span>{o}</span>
            </button>
          );
        })}
      </div>

      {!done ? (
        <div className="mt-6">
          <Button disabled={pick === null} onClick={(e) => { setDone(true); onResult(pick === answer, e, pick!); }}>{submitLabel}</Button>
        </div>
      ) : (
        <div className="mt-6">
          {/* Duolingo-style verdict bar: green when right, accent when not */}
          <div className={`bar-up relative p-4 ${correct ? "bg-l-soft shadow-[inset_0_0_0_2px_color-mix(in_srgb,var(--lms-accent)_45%,transparent)]" : "bg-l-soft shadow-[inset_0_0_0_2px_color-mix(in_srgb,var(--lms-accent)_40%,transparent)]"}`}>
            {renderResult ? renderResult(correct) : null}
          </div>
          <div className="notch cap-n mt-4 p-4 bg-white/[0.03]">
            <p className="m-0 font-mono text-[11px] tracking-[0.12em] uppercase text-l-text3">Why</p>
            <p className="m-0 mt-1.5 text-[14.5px] text-l-text leading-[1.6]">{why}</p>
          </div>
        </div>
      )}
    </div>
  );
}
