"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Brain, Flame as FlameIcon, Rocket, Target, Trophy, Zap, type LucideIcon } from "lucide-react";
import { ART, PAL } from "@/lib/bot";
import { AVATARS, type Student } from "@/lib/lms/data";

/* Shared LMS primitives. Everything reads the --lms-* tokens (via the l-*
   colour utilities), so a theme change restyles them all at once. */

export function Card({ children, className = "", as: Tag = "div", hover }:
  { children: ReactNode; className?: string; as?: "div" | "section" | "article" | "li"; hover?: boolean }) {
  return (
    <Tag className={`notch cap-n relative bg-l-surface ${hover ? "transition-[transform,background] duration-200 hover:-translate-y-[2px] hover:bg-l-elev" : ""} ${className}`}>
      {children}
    </Tag>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`m-0 font-mono text-[11px] tracking-[0.14em] uppercase text-l-text3 ${className}`}>{children}</p>;
}

export function PageHead({ eyebrow, title, sub, right }: { eyebrow?: string; title: ReactNode; sub?: ReactNode; right?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-6 mb-9 max-[640px]:mb-7">
      <div className="min-w-0">
        {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
        <h1 className="m-0 font-display font-bold text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] tracking-[-0.03em]">{title}</h1>
        {sub && <p className="m-0 mt-3 text-l-text2 text-[16px] max-w-[60ch]">{sub}</p>}
      </div>
      {right}
    </header>
  );
}

export function Bar({ value, className = "", thin }: { value: number; className?: string; thin?: boolean }) {
  return (
    <div className={`relative w-full overflow-hidden bg-white/[0.07] ${thin ? "h-[5px]" : "h-2"} ${className}`}
         role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div className="bar-in absolute inset-y-0 left-0 bg-l-accent" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function Pill({ children, tone = "muted", className = "" }: { children: ReactNode; tone?: "muted" | "accent" | "ok" | "solid"; className?: string }) {
  const t = {
    muted: "bg-white/[0.06] text-l-text2",
    accent: "bg-white/[0.08] text-white",
    ok: "bg-white/[0.08] text-white",
    solid: "bg-l-accent text-white",
  }[tone];
  return <span className={`notch num-n inline-flex items-center gap-1.5 px-2 py-[3px] font-mono text-[11px] tracking-[0.04em] ${t} ${className}`}>{children}</span>;
}

export function Xp({ n, className = "" }: { n: number | string; className?: string }) {
  return <Pill tone="accent" className={className}>+{n} XP</Pill>;
}

/* Lucide icons by name, so mock data (achievements) can refer to
   an icon with a plain string a backend can send. */
export const ICONS: Record<string, LucideIcon> = {
  trophy: Trophy, flame: FlameIcon, brain: Brain, target: Target, zap: Zap, rocket: Rocket,
};

/* The streak flame: Lucide's flame in the accent colour, gently breathing. */
export function Flame({ size = 18, className = "" }: { size?: number; className?: string }) {
  return <FlameIcon size={size} strokeWidth={2} className={`flame text-l-accent fill-[var(--lms-accent-soft)] ${className}`} aria-hidden />;
}

/* The IAIB pixel bot, drawn crisp at any size: the mascot's face. */
export function Sprite({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 20 21" width={size} height={Math.round(size * 1.05)} shapeRendering="crispEdges" className={className} aria-hidden>
      {ART.flatMap((row, y) => [...row].map((c, x) =>
        c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={c === "R" ? "var(--lms-accent)" : PAL[c]} />))}
    </svg>
  );
}

export function Avatar({ student, size = 40, className = "" }: { student: Pick<Student, "avatar" | "avatarImage" | "name">; size?: number; className?: string }) {
  const a = AVATARS.find((x) => x.id === student.avatar);
  const style = { width: size, height: size };
  if (student.avatar === "upload" && student.avatarImage)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={student.avatarImage} alt="" style={style} className={`notch num-n object-cover flex-none ${className}`} />;
  return (
    a
      // eslint-disable-next-line @next/next/no-img-element
      ? <img src={a.img} alt="" style={style} className={`notch num-n object-cover flex-none ${className}`} />
      : <span style={{ ...style, background: "var(--lms-elevated)" }} className={`notch num-n grid place-items-center flex-none ${className}`} aria-hidden>
          <span className="font-display font-bold text-white" style={{ fontSize: size * 0.42 }}>{student.name.slice(0, 1)}</span>
        </span>
  );
}

export function Button({ children, onClick, variant = "primary", className = "", type = "button", disabled }:
  { children: ReactNode; onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; variant?: "primary" | "ghost" | "accent"; className?: string; type?: "button" | "submit"; disabled?: boolean }) {
  /* chunky, game-style: a darker ledge underneath that the button presses into */
  const v = {
    primary: "game-btn bg-white text-black [--ledge:#a8a8a8] hover:brightness-95",
    accent: "game-btn bg-l-accent text-white [--ledge:color-mix(in_srgb,var(--lms-accent)_55%,black)] hover:brightness-110",
    ghost: "game-btn bg-white/[0.08] text-l-text [--ledge:rgba(0,0,0,.55)] hover:bg-white/[0.13]",
  }[variant];
  return (
    <button type={type} onClick={onClick} disabled={disabled}
            className={`notch cta inline-flex items-center justify-center gap-2 px-5 pt-[10px] pb-[8px] font-mono font-medium text-[13.5px] uppercase tracking-[0.04em] whitespace-nowrap transition-[filter,background,transform] duration-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${v} ${className}`}>
      {children}
    </button>
  );
}

export function Empty({ title, note }: { title: string; note: string }) {
  return (
    <div className="grid place-items-center text-center py-14 px-6">
      <Sprite size={44} className="opacity-60 mb-4" />
      <p className="m-0 font-display font-bold text-white text-lg">{title}</p>
      <p className="m-0 mt-1 text-l-text2 text-sm max-w-[36ch]">{note}</p>
    </div>
  );
}

export const greeting = () => {
  const h = Number(new Date().toLocaleString("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }));
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

/* Overlays render into <body>: the page wrapper animates a transform on
   arrival, which would otherwise trap position:fixed children inside it. */
export function Portal({ children }: { children: ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => setEl(document.body), []);
  return el ? createPortal(<div className="text-l-text">{children}</div>, el) : null;
}
