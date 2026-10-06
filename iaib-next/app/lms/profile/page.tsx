"use client";

import { BadgeCheck, Lock, Pencil, Trophy } from "lucide-react";
import { useState } from "react";
import { useLms, fmtXp } from "@/lib/lms/store";
import { ACHIEVEMENTS, THEMES, XP_RULES, levelOf, XP_PER_LEVEL } from "@/lib/lms/data";
import { Avatar, Bar, Button, Card, Eyebrow, Pill, Portal, Flame, ICONS } from "@/components/lms/ui";
import { AvatarPicker, ProfileCompletionModal, completion } from "@/components/lms/Onboarding";

/* Profile answers "who am I and what have I achieved?": identity first,
   then achievements and stats, then the editable details. */

const FIELD = "w-full bg-white/[0.05] px-3.5 py-2.5 text-[15px] text-white placeholder:text-l-text3 outline-none border-b-2 border-transparent focus:border-l-accent";

export default function Profile() {
  const { student: s, patch } = useLms();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(s);
  const [picking, setPicking] = useState(false);
  const [completing, setCompleting] = useState(false);
  const lvl = levelOf(s.xp);
  const inLevel = s.xp - (lvl - 1) * XP_PER_LEVEL;
  const acc = s.practiceSolved ? Math.round((s.practiceCorrect / s.practiceSolved) * 100) : 0;
  const pct = completion(s);

  const details: [string, keyof typeof s, string?][] = [
    ["Name", "fullName"], ["Email", "email", "email"], ["Phone", "phone", "tel"], ["School", "school"], ["Class", "grade"], ["City", "city"],
  ];

  return (
    <>
      {/* identity */}
      <Card as="section" className="p-8 max-[640px]:p-5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden
             style={{ background: "radial-gradient(ellipse 50% 120% at 0% 0%, rgba(255,255,255,.045), transparent 70%)" }} />
        <div className="relative flex flex-wrap items-center gap-7">
          <div className="relative">
            <Avatar student={s} size={120} />
            <button type="button" onClick={() => setPicking((v) => !v)} aria-label="Change avatar"
                    className="absolute -bottom-2 -right-2 notch num-n grid place-items-center w-9 h-9 bg-white text-black hover:bg-l-accent hover:text-white cursor-pointer transition-colors"><Pencil size={15} /></button>
          </div>
          <div className="flex-1 min-w-[240px]">
            <Eyebrow>IAIB builder · {s.grade}</Eyebrow>
            <h1 className="m-0 mt-2 font-display font-bold text-white text-[clamp(2rem,4vw,3rem)] leading-none tracking-[-0.03em]">{s.fullName}</h1>
            <div className="flex flex-wrap gap-2 mt-4">
              <Pill tone="solid">Level {String(lvl).padStart(2, "0")}</Pill>
              <Pill tone="accent">{fmtXp(s.xp)} XP</Pill>
              <Pill><Flame size={12} /> {s.streak} day streak</Pill>
              <Pill><Trophy size={12} /> #{s.rank}</Pill>
            </div>
            <div className="max-w-[360px] mt-5">
              <div className="flex justify-between text-[12.5px] mb-1.5"><span className="text-l-text3">Level {lvl + 1} in {fmtXp(XP_PER_LEVEL - inLevel)} XP</span><span className="font-mono text-l-text2">{fmtXp(inLevel)}/{XP_PER_LEVEL}</span></div>
              <Bar value={(inLevel / XP_PER_LEVEL) * 100} thin />
            </div>
          </div>
        </div>
        {picking && (
          <div className="lms-page relative mt-7 pt-7 border-t border-l-line">
            <p className="m-0 mb-4 font-display font-bold text-white">Choose your avatar</p>
            <AvatarPicker value={s.avatar} image={s.avatarImage} onChange={(id, img) => patch({ avatar: id, avatarImage: id === "upload" ? img ?? s.avatarImage : "" })} />
            <div className="mt-5"><Button variant="ghost" onClick={() => setPicking(false)}>Done</Button></div>
          </div>
        )}
      </Card>

      {!s.profileCompleted && (
        <Card className="p-5 mt-5 flex flex-wrap items-center gap-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,.12)]">
          <div className="flex-1 min-w-[220px]">
            <p className="m-0 font-display font-bold text-white">Your profile is {pct}% complete</p>
            <p className="m-0 mt-0.5 text-[13.5px] text-l-text2">Finish it to unlock <span className="text-l-accent">+10 XP</span> and personalised recommendations.</p>
            <Bar value={pct} thin className="mt-3 max-w-[320px]" />
          </div>
          <Button variant="accent" onClick={() => setCompleting(true)}>Complete profile</Button>
        </Card>
      )}

      {/* achievements */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="m-0 font-display font-bold text-white text-[1.35rem]">Achievements</h2>
          <span className="font-mono text-[13px] text-l-text3">{ACHIEVEMENTS.filter((a) => a.earned).length} / {ACHIEVEMENTS.length}</span>
        </div>
        <ul className="list-none m-0 p-0 grid grid-cols-6 max-[1100px]:grid-cols-3 max-[560px]:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((a) => (
            <li key={a.id}>
              <Card hover className={`p-5 text-center h-full ${a.earned ? "" : "opacity-45"}`}>
                <span className={`notch cap-n inline-grid place-items-center w-14 h-14 ${a.earned ? "bg-white/[0.08] text-white" : "bg-white/[0.04] text-l-text3"}`} aria-hidden>{(() => { const I = ICONS[a.icon]; return I ? <I size={24} /> : null; })()}</span>
                <p className="m-0 mt-3 text-[14px] text-white leading-tight">{a.title}</p>
                <p className="m-0 mt-1 text-[12px] text-l-text3 leading-snug">{a.earned ? a.note : <span className="inline-flex items-center gap-1"><Lock size={11} /> {a.note}</span>}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {/* stats */}
      <section className="mt-10">
        <h2 className="m-0 mb-4 font-display font-bold text-white text-[1.35rem]">Learning stats</h2>
        <div className="grid grid-cols-4 max-[900px]:grid-cols-2 gap-3">
          {[
            ["Sessions", `${s.sessionsCompleted}`, `of ${s.totalSessions} completed`, (s.sessionsCompleted / s.totalSessions) * 100],
            ["Problems", `${s.practiceSolved}`, `${s.practiceCorrect} correct`, (s.practiceCorrect / Math.max(1, s.practiceSolved)) * 100],
            ["Accuracy", `${acc}%`, "across practice", acc],
            ["Longest streak", `${s.longestStreak}`, "days in a row", (s.streak / Math.max(1, s.longestStreak)) * 100],
          ].map(([l, v, sub, p]) => (
            <Card key={l as string} className="p-5">
              <Eyebrow>{l}</Eyebrow>
              <p className="m-0 mt-3 font-display font-bold text-white text-[2rem] leading-none tabular-nums">{v}</p>
              <p className="m-0 mt-1.5 text-[13px] text-l-text2">{sub}</p>
              <Bar value={p as number} thin className="mt-4" />
            </Card>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-[1.3fr_1fr] max-[1000px]:grid-cols-1 gap-5 mt-10">
        {/* details */}
        <Card as="section" className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="m-0 font-display font-bold text-white text-[1.2rem]">Profile details</h2>
            {editing ? (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => { setDraft(s); setEditing(false); }} className="!px-3 !py-[7px]">Cancel</Button>
                <Button onClick={() => { patch({ ...draft, name: draft.fullName.trim().split(/\s+/)[0] || s.name, emailVerified: draft.email === s.email ? s.emailVerified : false }); setEditing(false); }} className="!px-3 !py-[7px]">Save</Button>
              </div>
            ) : <Button variant="ghost" onClick={() => { setDraft(s); setEditing(true); }} className="!px-3 !py-[7px]">Edit profile</Button>}
          </div>
          <dl className="m-0 grid gap-0">
            {details.map(([label, key, type]) => (
              <div key={key} className="grid grid-cols-[120px_1fr] max-[480px]:grid-cols-1 items-center gap-x-4 gap-y-1 py-3 border-b border-l-line last:border-0">
                <dt className="text-[13.5px] text-l-text3">{label}</dt>
                <dd className="m-0 min-w-0">
                  {editing ? (
                    <input className={FIELD} type={type ?? "text"} aria-label={label} value={String(draft[key] ?? "")}
                           onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />
                  ) : (
                    <span className="flex items-center gap-2 text-[15px] text-white">
                      {String(s[key] || "") || <span className="text-l-text3">Not added</span>}
                      {key === "email" && s.email && (s.emailVerified ? <Pill tone="ok"><BadgeCheck size={12} /> Verified</Pill> : <Pill>Unverified</Pill>)}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Card>

        <div className="grid gap-5 content-start">
          {/* theme */}
          <Card as="section" className="p-6">
            <h2 className="m-0 font-display font-bold text-white text-[1.2rem]">Theme preferences</h2>
            <p className="m-0 mt-1 mb-4 text-[13.5px] text-l-text2">Or just ask Byte: &ldquo;use a blue accent&rdquo;.</p>
            <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Theme">
              {THEMES.map((t) => {
                const on = s.theme === t.id;
                return (
                  <button key={t.id} type="button" role="radio" aria-checked={on} aria-label={t.label} onClick={() => patch({ theme: t.id })}
                          className={`notch num-n grid gap-1.5 justify-items-center p-2 cursor-pointer transition-colors ${on ? "bg-white/[0.1]" : "bg-white/[0.03] hover:bg-white/[0.06]"}`}>
                    <span className="w-full h-8 notch num-n" style={{ background: `linear-gradient(135deg, ${t.tokens.surface} 50%, ${t.tokens.accent} 50%)` }} />
                    <span className={`text-[11.5px] ${on ? "text-white" : "text-l-text3"}`}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>
          {/* xp rules */}
          <Card as="section" className="p-6">
            <h2 className="m-0 font-display font-bold text-white text-[1.2rem]">How XP works</h2>
            <ul className="list-none m-0 mt-4 p-0 grid">
              {XP_RULES.map((r) => (
                <li key={r.id} className="flex justify-between py-2 border-b border-l-line last:border-0 text-[14px]">
                  <span className="text-l-text2">{r.label}</span>
                  <span className={`font-mono ${r.amount > 0 ? "text-l-accent" : "text-l-text3"}`}>{r.amount > 0 ? "+" : ""}{r.amount} XP</span>
                </li>
              ))}
            </ul>
            <p className="m-0 mt-3 text-[12.5px] text-l-text3">Games never take XP away.</p>
          </Card>
        </div>
      </div>

      {completing && <Portal><ProfileCompletionModal onClose={() => setCompleting(false)} /></Portal>}
    </>
  );
}
