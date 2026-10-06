"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Sprite } from "./ui";

/* A spotlight walkthrough over the real UI. Each step names a data-tour
   target; the first visible element with it is lit, and steps whose target
   isn't on screen (e.g. sidebar items on a phone) are skipped. */

const STEPS = [
  { t: "streak", title: "Your Streak", body: "Log in every day to maintain your streak and earn XP." },
  { t: "nav-overview", title: "Your Learning Journey", body: "Track your complete IAIB journey here." },
  { t: "nav-dashboard", title: "Your Daily Dashboard", body: "See what you should focus on today." },
  { t: "nav-learn", title: "Learn", body: "Access your sessions and curriculum." },
  { t: "nav-next", title: "What's Next", body: "Your personalised next actions." },
  { t: "nav-practice", title: "Practice", body: "Solve challenges and earn XP." },
  { t: "nav-potd", title: "Problem of the Day", body: "Complete one challenge every day." },
  { t: "mascot", title: "Meet your AI Buddy", body: "Ask questions, get help, and personalise your experience." },
];

const visible = (sel: string) =>
  [...document.querySelectorAll<HTMLElement>(`[data-tour="${sel}"]`)].find((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden";
  });

export default function ProductTour({ onFinish }: { onFinish: () => void }) {
  const router = useRouter();
  const [steps, setSteps] = useState(STEPS);
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [end, setEnd] = useState(false);

  // keep only steps whose target exists at this screen size
  useLayoutEffect(() => { setSteps(STEPS.filter((s) => visible(s.t))); }, []);

  const measure = useCallback(() => {
    const s = steps[i];
    const el = s && visible(s.t);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [steps, i]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => { window.removeEventListener("resize", measure); window.removeEventListener("scroll", measure, true); };
  }, [measure]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFinish();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") setI((x) => Math.max(0, x - 1));
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  });

  const next = () => (i + 1 >= steps.length ? setEnd(true) : setI(i + 1));

  if (end)
    return (
      <div className="fixed inset-0 z-[300] grid place-items-center bg-black/80 backdrop-blur-sm p-4">
        <div role="dialog" aria-modal="true" aria-label="Tour complete" className="lms-page w-full max-w-[440px] notch win-n bg-l-surface p-8 text-center relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-40 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(255,255,255,.045), transparent 70%)" }} aria-hidden />
          <span className="bob relative inline-block"><Sprite size={56} /></span>
          <h2 className="relative m-0 mt-4 font-display font-bold text-white text-[2rem] tracking-[-0.02em]">You&rsquo;re all set!</h2>
          <p className="relative m-0 mt-2 text-l-text2">Let&rsquo;s start learning.</p>
          <div className="relative mt-7"><Button onClick={() => { onFinish(); router.push("/lms/dashboard"); }}>Start Learning →</Button></div>
        </div>
      </div>
    );

  const s = steps[i];
  if (!s) return null;
  const pad = 8;
  const hole = rect ? { left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 } : null;

  // tooltip: right of the target if there's room, else below, else above
  const tipW = 300;
  let tip: React.CSSProperties = { left: "50%", top: "50%", transform: "translate(-50%,-50%)" };
  if (hole) {
    const vw = window.innerWidth, vh = window.innerHeight;
    if (hole.left + hole.width + 16 + tipW < vw) tip = { left: hole.left + hole.width + 16, top: Math.min(Math.max(12, hole.top), vh - 220) };
    else if (hole.top + hole.height + 200 < vh) tip = { left: Math.min(Math.max(12, hole.left + hole.width - tipW), vw - tipW - 12), top: hole.top + hole.height + 14 };
    else tip = { left: Math.min(Math.max(12, hole.left), vw - tipW - 12), top: Math.max(12, hole.top - 200) };
  }

  return (
    <div className="fixed inset-0 z-[300]" role="dialog" aria-modal="true" aria-label={`Tour: ${s.title}`}>
      <div className="absolute inset-0" onClick={next} aria-hidden />
      {hole ? <div className="tour-hole" style={hole} /> : <div className="absolute inset-0 bg-black/70" />}
      <div key={i} className="lms-page fixed z-[310] notch win-n bg-l-elev p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,.9)]"
           style={{ width: tipW, maxWidth: "calc(100vw - 24px)", ...tip, transition: "left .45s, top .45s" }}>
        <div className="flex items-center gap-2 mb-2">
          <Sprite size={18} />
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-l-text3">{i + 1} / {steps.length}</span>
        </div>
        <p className="m-0 font-display font-bold text-white text-[1.15rem]">{s.title}</p>
        <p className="m-0 mt-1.5 text-[14px] text-l-text2 leading-[1.55]">{s.body}</p>
        <div className="flex items-center gap-2 mt-4">
          <button type="button" onClick={onFinish} className="mr-auto text-[13px] text-l-text3 hover:text-white cursor-pointer">Skip tour</button>
          {i > 0 && <Button variant="ghost" onClick={() => setI(i - 1)} className="!px-3 !py-[7px]">Back</Button>}
          <Button variant="accent" onClick={next} className="!px-4 !py-[7px]" >{i + 1 === steps.length ? "Finish" : "Next"}</Button>
        </div>
      </div>
    </div>
  );
}
