"use client";

import { useEffect, useRef, useState } from "react";

import MemberCard from "./MemberCard";

/** How long the confirmation holds before the card flips in. */
const SECONDS = 5;

const R = 44;
const CIRC = 2 * Math.PI * R;
/** Length of the tick path, for the draw-on animation. */
const TICK_LEN = 34;

function Confirmation({
  name,
  email,
  secondsLeft,
  onSkip,
}: {
  name: string;
  email?: string;
  secondsLeft: number;
  onSkip: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-5 py-6 text-center">
      <div className="relative grid size-[112px] place-items-center">
        {/* countdown ring — the sweep is the timer */}
        <svg
          className="absolute inset-0 -rotate-90"
          viewBox="0 0 112 112"
          fill="none"
          aria-hidden
        >
          <circle cx="56" cy="56" r={R} stroke="#fff" strokeOpacity="0.1" strokeWidth="4" />
          <circle
            cx="56"
            cy="56"
            r={R}
            stroke="var(--color-brand)"
            strokeWidth="4"
            strokeLinecap="round"
            className="ring-sweep"
            style={
              {
                "--circ": `${CIRC}`,
                "--dur": `${SECONDS}s`,
              } as React.CSSProperties
            }
          />
        </svg>

        {/* the tick pops in, then draws itself */}
        <span className="pop-in grid size-[68px] place-items-center rounded-full bg-brand">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden>
            <path
              d="M9 17.5 14.5 23 25 11.5"
              stroke="#fff"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="tick-draw"
              style={{ "--len": `${TICK_LEN}` } as React.CSSProperties}
            />
          </svg>
        </span>
      </div>

      <div>
        <h3 className="font-ui text-[30px] leading-[1.1] font-bold tracking-[-1px] text-ink sm:text-[36px]">
          You&rsquo;re in, {name.trim().split(/\s+/)[0]}!
        </h3>
        <p className="mt-2 font-display text-[15px] leading-[24px] text-ink/65 sm:text-[16px]">
          Your registration is confirmed.
          <br />
          We&rsquo;ll send the next steps to{" "}
          {email ? (
            <span className="font-medium text-ink">{email}</span>
          ) : (
            "your email"
          )}
          .
        </p>
      </div>

      {/* tells them what the wait is for, so they don't close the tab */}
      <div className="flex flex-col items-center gap-2">
        <p
          className="font-display text-[14px] text-ink/55"
          aria-live="polite"
          role="status"
        >
          Building your member card&hellip; {secondsLeft}s
        </p>
        <button
          type="button"
          onClick={onSkip}
          className=" px-4 py-1.5 font-display text-[14px] text-brand underline underline-offset-2 transition-colors hover:text-ink"
        >
          Show it now
        </button>
      </div>
    </div>
  );
}

/**
 * `name` is the full name: the greeting uses the first word of it, the card
 * underneath is printed with all of it.
 *
 * The screen after a successful individual registration: an animated
 * confirmation that counts itself down and then flips, on its own, to the
 * member card. Nothing to click — the card arrives.
 */
export default function RegistrationSuccess({
  name,
  email,
  onClose,
}: {
  name: string;
  email?: string;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"confirm" | "flipping" | "card">("confirm");
  const [left, setLeft] = useState(SECONDS);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const flip = () => {
    setPhase((p) => (p === "confirm" ? "flipping" : p));
  };

  // countdown, then the flip
  useEffect(() => {
    if (phase !== "confirm") return;
    const tick = setInterval(() => setLeft((n) => Math.max(0, n - 1)), 1000);
    const go = setTimeout(flip, SECONDS * 1000);
    timers.current.push(go);
    return () => {
      clearInterval(tick);
      clearTimeout(go);
    };
  }, [phase]);

  // the confirmation swings out, then the card swings in
  useEffect(() => {
    if (phase !== "flipping") return;
    const t = setTimeout(() => setPhase("card"), 300);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  return (
    <div style={{ perspective: "1200px" }}>
      {phase !== "card" ? (
        <div className={phase === "flipping" ? "flip-out" : undefined}>
          <Confirmation
            name={name}
            email={email}
            secondsLeft={left}
            onSkip={() => {
              setLeft(0);
              flip();
            }}
          />
        </div>
      ) : (
        <div className="flip-in">
          <MemberCard name={name} onClose={onClose} />
        </div>
      )}
    </div>
  );
}
