"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLms, fmtXp } from "@/lib/lms/store";
import { CURRICULUM, SESSIONS, THEMES, nextReward, levelOf, XP_RULES, type Student } from "@/lib/lms/data";
import { Sprite } from "./ui";

/* Byte, the IAIB buddy: the site's pixel bot, now the student's companion.
   `respond` is the single seam for an AI backend — today it matches intents
   locally and returns a reply plus an optional action (navigate, theme). */

type Msg = { from: "byte" | "me"; text: string };
type Reply = { text: string; go?: string; theme?: string };

const SUGGESTIONS = [
  "What should I learn today?",
  "Explain my current topic",
  "Show my progress",
  "Take me to POTD",
  "How can I earn XP?",
  "Show my rewards",
];

export function respond(input: string, s: Student): Reply {
  const q = input.toLowerCase();
  const cur = SESSIONS[s.sessionsCompleted];
  const mod = CURRICULUM[cur?.module ?? 0];
  const theme = THEMES.find((t) => q.includes(t.id) || q.includes(t.label.toLowerCase()))
    ?? (q.includes("purple") ? THEMES[1] : q.includes("blue") ? THEMES[2] : /green|futur/.test(q) ? THEMES[3] : /minimal|grey|gray|calm/.test(q) ? THEMES[4] : /red|default|original/.test(q) ? THEMES[0] : undefined);

  if (theme && /theme|accent|colou?r|make|change|use|switch/.test(q))
    return { text: `Done: switched you to the ${theme.label} theme. Say "default theme" to go back.`, theme: theme.id };
  if (/potd|problem of the day|today'?s challenge/.test(q))
    return { text: "Opening today's Problem of the Day. +2 XP if you get it right.", go: "/lms/potd" };
  if (/learn today|what should i|next|recommend/.test(q))
    return { text: `Next up is Session ${String(cur.no).padStart(2, "0")}: "${cur.title}" (${cur.minutes} min) in ${mod.title}. Then the POTD and two practice problems to round out today.`, go: "/lms/whats-next" };
  if (/explain|topic|current/.test(q))
    return { text: `You're in ${mod.title}. ${mod.desc} Today's session, "${cur.title}", builds on what you covered in the last one. Want me to open it?`, go: "/lms/learn" };
  if (/progress|journey|where am i/.test(q))
    return { text: `${s.sessionsCompleted} of ${s.totalSessions} sessions done, Level ${levelOf(s.xp)}, ${fmtXp(s.xp)} XP, rank #${s.rank}. You're in the 30-day live learning stage.`, go: "/lms/overview" };
  if (/reward|prize|hoodie/.test(q)) {
    const r = nextReward(s.xp);
    return { text: `Your next reward is "${r.title}" at ${r.xp} XP. You're ${fmtXp(Math.max(0, r.xp - s.xp))} XP away.`, go: "/lms/overview" };
  }
  if (/xp|earn|points/.test(q))
    return { text: "Ways to earn: " + XP_RULES.filter((r) => r.amount > 0).map((r) => `${r.label} +${r.amount}`).join(", ") + ". A wrong practice answer costs 0.5 XP; games never take XP away." };
  if (/streak|fire/.test(q))
    return { text: `You're on a ${s.streak}-day streak (best: ${s.longestStreak}). Log in tomorrow to make it ${s.streak + 1}.` };
  if (/practice|problem/.test(q)) return { text: "Opening Practice. Easy +2, Medium +3, Hard +5.", go: "/lms/practice" };
  if (/profile|avatar|mascot/.test(q)) return { text: "Your profile is where your avatar, achievements and details live.", go: "/lms/profile" };
  return { text: "I can help you find what to learn next, explain your current topic, show progress, XP and rewards, or change your theme. Try one of the suggestions below." };
}

export default function Mascot({ placement }: { placement: "sidebar" | "float" }) {
  const { student, patch } = useLms();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "theme">("chat");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => { log.current?.scrollTo({ top: 1e6, behavior: "smooth" }); }, [msgs, typing]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open]);
  // the tour (and anything else) can open Byte with a window event
  useEffect(() => {
    const o = () => setOpen(true);
    window.addEventListener("lms:open-mascot", o);
    return () => window.removeEventListener("lms:open-mascot", o);
  }, []);

  const ask = (q: string) => {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: q }]);
    setText("");
    setTyping(true);
    const r = respond(q, student);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "byte", text: r.text }]);
      if (r.theme) patch({ theme: r.theme });
      if (r.go) setTimeout(() => router.push(r.go!), 700);
    }, 550);
  };

  const trigger = placement === "sidebar" ? (
    <button type="button" data-tour="mascot" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Open Byte, your AI buddy"
            className="notch cap-n w-full flex items-center gap-3 bg-l-surface hover:bg-l-elev p-3 text-left transition-colors cursor-pointer
                       max-[1100px]:justify-center max-[1100px]:p-2">
      <span className="bob grid place-items-center w-11 h-11 bg-l-soft notch num-n flex-none"><Sprite size={28} /></span>
      <span className="min-w-0 max-[1100px]:hidden">
        <span className="block font-display font-bold text-white text-[15px]">Byte</span>
        <span className="block text-[12.5px] text-l-text2 truncate">Your AI buddy · Ask me</span>
      </span>
    </button>
  ) : (
    <button type="button" data-tour="mascot" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Open Byte, your AI buddy"
            className="fixed right-6 bottom-6 max-[767px]:right-4 max-[767px]:bottom-[84px] z-40 notch cap-n grid place-items-center w-16 h-16 max-[767px]:w-14 max-[767px]:h-14 bg-l-elev hover:bg-l-soft transition-colors shadow-[0_10px_30px_-10px_rgba(0,0,0,.9)] cursor-pointer">
      <span className="bob"><Sprite size={34} /></span>
    </button>
  );

  return (
    <>
      {trigger}
      {open && (
        <div ref={panel} role="dialog" aria-label="Byte, your AI buddy"
             className="lms-page fixed z-[60] right-6 bottom-[104px] max-[767px]:left-3 max-[767px]:right-3 max-[767px]:bottom-[150px]
                        w-[380px] max-[767px]:w-auto h-[520px] max-h-[calc(100svh-120px)] notch win-n bg-l-elev flex flex-col
                        shadow-[0_30px_80px_-20px_rgba(0,0,0,.95)]">
          <div className="flex items-center gap-3 p-4 border-b border-l-line">
            <span className="bob grid place-items-center w-10 h-10 bg-l-soft notch num-n"><Sprite size={26} /></span>
            <div className="flex-1 min-w-0">
              <p className="m-0 font-display font-bold text-white">Byte</p>
              <p className="m-0 text-[12px] text-l-text3 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[var(--lms-accent)]" /> Online · IAIB buddy</p>
            </div>
            <div className="flex bg-white/[0.05] p-[3px] text-[12px]" role="tablist">
              {(["chat", "theme"] as const).map((t) => (
                <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                        className={`px-2.5 py-1 cursor-pointer capitalize ${tab === t ? "bg-white/[0.1] text-white" : "text-l-text3"}`}>{t}</button>
              ))}
            </div>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="text-l-text3 hover:text-white px-1 cursor-pointer text-lg">×</button>
          </div>

          {tab === "chat" ? (
            <>
              <div ref={log} className="flex-1 overflow-y-auto p-4 grid content-start gap-3">
                <Bubble from="byte">Hey {student.name}! Need help? I can plan your day, explain topics, track your XP, or restyle the dashboard.</Bubble>
                {msgs.map((m, i) => <Bubble key={i} from={m.from}>{m.text}</Bubble>)}
                {typing && <Bubble from="byte"><span className="inline-flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 bg-l-text2 bob" style={{ animationDelay: `${i * .15}s`, animationDuration: ".9s" }} />)}</span></Bubble>}
                {msgs.length === 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} type="button" onClick={() => ask(s)}
                              className="notch num-n bg-white/[0.05] hover:bg-l-soft hover:text-white text-l-text2 text-[13px] px-3 py-1.5 text-left cursor-pointer transition-colors">{s}</button>
                    ))}
                  </div>
                )}
              </div>
              <form className="flex gap-2 p-3 border-t border-l-line" onSubmit={(e) => { e.preventDefault(); ask(text); }}>
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder='Try "change the theme to purple"' aria-label="Message Byte"
                       className="flex-1 min-w-0 bg-white/[0.05] px-3 py-2 text-[14px] text-white placeholder:text-l-text3 outline-none focus:bg-white/[0.08]" />
                <button type="submit" className="notch num-n bg-l-accent text-white px-3 font-mono text-[13px] cursor-pointer">Send</button>
              </form>
            </>
          ) : (
            <ThemeSelector />
          )}
        </div>
      )}
    </>
  );
}

function Bubble({ from, children }: { from: "byte" | "me"; children: React.ReactNode }) {
  return (
    <div className={`max-w-[88%] px-3.5 py-2.5 text-[14px] leading-[1.5] notch num-n ${from === "me" ? "justify-self-end bg-l-accent text-white" : "bg-white/[0.06] text-l-text"}`}>
      {children}
    </div>
  );
}

export function ThemeSelector() {
  const { student, patch } = useLms();
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <p className="m-0 text-[13px] text-l-text2 mb-3">Pick a look. Byte can also do this for you: try asking for &ldquo;a blue accent&rdquo;.</p>
      <div className="grid gap-2">
        {THEMES.map((t) => {
          const on = student.theme === t.id;
          return (
            <button key={t.id} type="button" onClick={() => patch({ theme: t.id })} aria-pressed={on}
                    className={`notch cap-n flex items-center gap-3 p-3 text-left cursor-pointer transition-colors ${on ? "bg-white/[0.09]" : "bg-white/[0.03] hover:bg-white/[0.06]"}`}>
              <span className="flex flex-none">
                <span className="w-6 h-8" style={{ background: t.tokens.surface }} />
                <span className="w-6 h-8" style={{ background: t.tokens.accent }} />
              </span>
              <span className="flex-1">
                <span className="block text-white text-[14.5px]">{t.label}</span>
                <span className="block text-[12.5px] text-l-text3">{t.note}</span>
              </span>
              {on && <span className="text-l-accent font-mono text-[12px]">Active</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
