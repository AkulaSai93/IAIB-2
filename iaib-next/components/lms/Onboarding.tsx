"use client";

import { BadgeCheck, Check, PartyPopper } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLms } from "@/lib/lms/store";
import { AVATARS, type Student } from "@/lib/lms/data";
import { Avatar, Bar, Button, Sprite } from "./ui";

/* First-run onboarding: pick an avatar, then complete the profile. Skipping
   the profile is allowed; ProfileCompletionModal reappears on later visits
   until it is done (see LmsGate). */

function Frame({ children, step, total, onSkip, label }: { children: React.ReactNode; step?: number; total?: number; onSkip?: () => void; label: string }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);
  return (
    <div className="fixed inset-0 z-[200] grid place-items-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div role="dialog" aria-modal="true" aria-label={label}
           className="lms-page relative w-full max-w-[620px] notch win-n bg-l-surface my-auto">
        <div className="absolute inset-x-0 top-0 h-[180px] pointer-events-none" aria-hidden
             style={{ background: "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(255,255,255,.045), transparent 70%)" }} />
        <div className="relative flex items-center justify-between px-7 pt-6 max-[560px]:px-5">
          {step ? (
            <div className="flex items-center gap-2">
              {Array.from({ length: total ?? 2 }, (_, i) => (
                <span key={i} className={`h-[3px] w-8 transition-colors ${i < step ? "bg-l-accent" : "bg-white/15"}`} />
              ))}
              <span className="ml-2 font-mono text-[11px] tracking-[0.12em] uppercase text-l-text3">Step {step} of {total}</span>
            </div>
          ) : <span />}
          {onSkip && <button type="button" onClick={onSkip} className="text-[13px] text-l-text3 hover:text-white cursor-pointer">Skip for now</button>}
        </div>
        <div className="relative px-7 pt-6 pb-7 max-[560px]:px-5">{children}</div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- avatar picker */

export function AvatarPicker({ value, image, onChange }: { value: string; image: string; onChange: (id: string, img?: string) => void }) {
  const file = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState("");
  const upload = (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return setErr("Please choose an image file.");
    if (f.size > 3 * 1024 * 1024) return setErr("That image is over 3 MB.");
    setErr("");
    const r = new FileReader();
    r.onload = () => onChange("upload", String(r.result));
    r.readAsDataURL(f);
  };
  return (
    <div>
      <div className="grid grid-cols-8 max-[640px]:grid-cols-5 max-[400px]:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto pr-1 -mr-1"
           role="radiogroup" aria-label="Avatars">
        {AVATARS.map((a) => {
          const on = value === a.id;
          return (
            <button key={a.id} type="button" role="radio" aria-checked={on} aria-label={a.label} title={a.label} onClick={() => onChange(a.id)}
                    className={`notch num-n group relative aspect-square overflow-hidden cursor-pointer transition-transform duration-150 hover:-translate-y-[2px]
                                ${on ? "shadow-[inset_0_0_0_2px_var(--lms-accent)]" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.img} alt="" className={`block w-full h-full object-cover transition-transform ${on ? "scale-105" : "group-hover:scale-105"} ${on ? "" : "opacity-85 group-hover:opacity-100"}`} />
              {on && <span className="absolute top-1 right-1 w-4 h-4 grid place-items-center bg-l-accent text-white notch num-n"><Check size={11} strokeWidth={3} /></span>}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-4">
        <input ref={file} type="file" accept="image/*" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} aria-label="Upload your own avatar" />
        <Button variant="ghost" onClick={() => file.current?.click()}>Upload your own avatar</Button>
        {value === "upload" && image && <Avatar student={{ avatar: "upload", avatarImage: image, name: "" }} size={40} />}
      </div>
      {err && <p role="alert" className="m-0 mt-2 text-[13px] text-l-accent">{err}</p>}
    </div>
  );
}

/* ------------------------------------------------------- profile fields */

const FIELD = "w-full bg-white/[0.05] px-4 py-3 text-[15px] text-white placeholder:text-l-text3 outline-none border-b-2 border-transparent focus:border-l-accent transition-colors";

type Draft = Pick<Student, "email" | "emailVerified" | "school" | "grade" | "city">;
const PARTS: (keyof Draft)[] = ["email", "emailVerified", "school", "grade", "city"];
export const completion = (d: Draft) => Math.round((PARTS.filter((k) => Boolean(d[k])).length / PARTS.length) * 100);

function ProfileStep({ onDone, onSkip }: { onDone: () => void; onSkip: () => void }) {
  const { student, patch } = useLms();
  const [d, setD] = useState<Draft>({ email: student.email, emailVerified: student.emailVerified, school: student.school, grade: student.grade, city: student.city });
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const pct = completion(d);
  const set = (p: Partial<Draft>) => setD((x) => ({ ...x, ...p }));

  const send = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) return setErr({ email: "That email doesn't look right." });
    setErr({}); setSent(true);
  };
  /* TODO: verify against the real endpoint; any 6 digits pass in the preview. */
  const verify = () => (/^\d{6}$/.test(code) ? (set({ emailVerified: true }), setErr({})) : setErr({ code: "Enter the 6-digit code." }));

  const save = () => {
    const e: Record<string, string> = {};
    if (!d.emailVerified) e.email = "Please verify your email.";
    if (d.school.trim().length < 2) e.school = "Please enter your school.";
    if (!d.grade) e.grade = "Pick your class.";
    if (d.city.trim().length < 2) e.city = "Please enter your city.";
    setErr(e);
    if (Object.keys(e).length) { patch(d); return; }
    patch(d);
    onDone();
  };

  return (
    <div>
      <h2 className="m-0 font-display font-bold text-white text-[2rem] max-[560px]:text-[1.6rem] leading-tight tracking-[-0.02em]">One last step!</h2>
      <p className="m-0 mt-2 text-l-text2">Complete your profile to personalise your IAIB experience. <span className="text-l-accent">+10 XP</span></p>

      <div className="mt-6 p-4 bg-white/[0.03] notch cap-n">
        <div className="flex justify-between text-[13px] mb-2"><span className="text-l-text2">Profile completion</span><span className="font-mono text-white">{pct}%</span></div>
        <Bar value={pct} thin />
      </div>

      <div className="grid gap-4 mt-6">
        <label className="grid gap-1.5">
          <span className="text-[14px] text-white">Email</span>
          <div className="flex gap-2">
            <input className={FIELD} type="email" value={d.email} disabled={d.emailVerified} placeholder="you@email.com"
                   onChange={(e) => { set({ email: e.target.value, emailVerified: false }); setSent(false); }} autoComplete="email" />
            {d.emailVerified
              ? <span className="notch num-n flex items-center gap-1.5 px-3 bg-l-soft text-l-accent text-[13px] whitespace-nowrap"><BadgeCheck size={15} /> Verified</span>
              : <Button variant="ghost" onClick={send}>{sent ? "Resend" : "Verify"}</Button>}
          </div>
          {err.email && <span role="alert" className="text-[13px] text-l-accent">{err.email}</span>}
        </label>
        {sent && !d.emailVerified && (
          <div className="lms-page grid gap-2 p-4 bg-white/[0.03] notch cap-n">
            <span className="text-[13.5px] text-l-text2">Enter the 6-digit code we sent to {d.email}</span>
            <div className="flex gap-2">
              <input className={`${FIELD} font-mono tracking-[0.4em] max-w-[200px]`} inputMode="numeric" maxLength={6} value={code}
                     onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} aria-label="Verification code" placeholder="••••••" />
              <Button variant="accent" onClick={verify}>Confirm</Button>
            </div>
            {err.code && <span role="alert" className="text-[13px] text-l-accent">{err.code}</span>}
          </div>
        )}
        <label className="grid gap-1.5">
          <span className="text-[14px] text-white">School</span>
          <input className={FIELD} value={d.school} onChange={(e) => set({ school: e.target.value })} placeholder="Your school's name" />
          {err.school && <span role="alert" className="text-[13px] text-l-accent">{err.school}</span>}
        </label>
        <div className="grid grid-cols-2 max-[480px]:grid-cols-1 gap-4">
          <label className="grid gap-1.5">
            <span className="text-[14px] text-white">Class</span>
            <select className={FIELD} value={d.grade} onChange={(e) => set({ grade: e.target.value })}>
              <option value="">Select</option>
              {["Class 9", "Class 10", "Class 11", "Class 12"].map((g) => <option key={g}>{g}</option>)}
            </select>
            {err.grade && <span role="alert" className="text-[13px] text-l-accent">{err.grade}</span>}
          </label>
          <label className="grid gap-1.5">
            <span className="text-[14px] text-white">City</span>
            <input className={FIELD} value={d.city} onChange={(e) => set({ city: e.target.value })} placeholder="e.g. Bengaluru" />
            {err.city && <span role="alert" className="text-[13px] text-l-accent">{err.city}</span>}
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-7">
        <Button onClick={save}>Complete profile</Button>
        <button type="button" onClick={() => { patch(d); onSkip(); }} className="text-[14px] text-l-text3 hover:text-white cursor-pointer px-2">I&rsquo;ll do it later</button>
      </div>
    </div>
  );
}

function Success({ onNext }: { onNext: () => void }) {
  const { student } = useLms();
  const [shown, setShown] = useState(student.xp - 10);
  useEffect(() => {
    let n = student.xp - 10;
    const t = setInterval(() => { n += 1; setShown(n); if (n >= student.xp) clearInterval(t); }, 70);
    return () => clearInterval(t);
  }, [student.xp]);
  return (
    <div className="text-center py-4">
      <div className="relative inline-grid place-items-center w-24 h-24 mx-auto">
        <span className="burst absolute inset-0" aria-hidden>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <i key={i} style={{ "--dx": `${Math.cos(a) * 70}px`, "--dy": `${Math.sin(a) * 70}px`, animationDelay: `${(i % 3) * 40}ms` } as React.CSSProperties} />;
          })}
        </span>
        <span className="pop-in grid place-items-center w-20 h-20 notch cap-n bg-l-accent text-white"><PartyPopper size={36} strokeWidth={1.8} /></span>
      </div>
      <h2 className="m-0 mt-5 font-display font-bold text-white text-[2rem] tracking-[-0.02em]">Profile complete!</h2>
      <p className="m-0 mt-3 inline-flex items-center gap-3 font-mono text-[18px]">
        <span className="pop-in notch num-n bg-l-accent text-white px-3 py-1">+10 XP</span>
        <span className="text-l-text2 tabular-nums">{shown} XP</span>
      </p>
      <p className="m-0 mt-4 text-l-text2">Your learning identity is set. Let&rsquo;s show you around.</p>
      <div className="mt-7"><Button onClick={onNext}>Show me around →</Button></div>
    </div>
  );
}

/* --------------------------------------------------------- the flows */

export function OnboardingFlow({ onFinish }: { onFinish: () => void }) {
  const { student, patch, addXp } = useLms();
  const [step, setStep] = useState<"avatar" | "profile" | "done">("avatar");
  const [pick, setPick] = useState({ id: student.avatar || "a01", img: student.avatarImage });

  if (step === "avatar")
    return (
      <Frame step={1} total={2} label="Choose your avatar">
        <div className="flex items-center gap-3 mb-5"><span className="bob"><Sprite size={30} /></span><span className="text-[13.5px] text-l-text2">Hi {student.name}, I&rsquo;m Byte. Let&rsquo;s set you up.</span></div>
        <h2 className="m-0 font-display font-bold text-white text-[2rem] max-[560px]:text-[1.6rem] leading-tight tracking-[-0.02em]">Let&rsquo;s create your learning identity</h2>
        <p className="m-0 mt-2 mb-6 text-l-text2">Choose an avatar that represents you.</p>
        <AvatarPicker value={pick.id} image={pick.img} onChange={(id, img) => setPick({ id, img: img ?? pick.img })} />
        <div className="mt-7 flex justify-end">
          <Button onClick={() => { patch({ avatar: pick.id, avatarImage: pick.id === "upload" ? pick.img : "", onboardingCompleted: true }); setStep("profile"); }}>Continue →</Button>
        </div>
      </Frame>
    );
  if (step === "profile")
    return (
      <Frame step={2} total={2} label="Complete your profile" onSkip={onFinish}>
        <ProfileStep onSkip={onFinish} onDone={() => { patch({ profileCompleted: true }); addXp(10, "Profile setup"); setStep("done"); }} />
      </Frame>
    );
  return <Frame label="Profile complete"><Success onNext={onFinish} /></Frame>;
}

/* Returning students who skipped the profile see this once per visit. */
export function ProfileCompletionModal({ onClose }: { onClose: () => void }) {
  const { patch, addXp } = useLms();
  const [done, setDone] = useState(false);
  if (done) return <Frame label="Profile complete"><Success onNext={onClose} /></Frame>;
  return (
    <Frame label="Complete your profile" onSkip={onClose}>
      <ProfileStep onSkip={onClose} onDone={() => { patch({ profileCompleted: true }); addXp(10, "Profile setup"); setDone(true); }} />
    </Frame>
  );
}
