"use client";

import { Check, Circle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLms, fmtXp } from "@/lib/lms/store";
import { CalendarCheck, CircleUser, Compass, Dumbbell, GraduationCap, LayoutDashboard, Map, type LucideIcon } from "lucide-react";
import { levelOf } from "@/lib/lms/data";
import { Avatar, Flame } from "./ui";
import Mascot from "./Mascot";

/* The LMS frame: top bar (brand, XP, streak, profile), a persistent sidebar
   on desktop that collapses to an icon rail on tablets and becomes a bottom
   bar on phones, and the mascot pinned bottom-left. */

export const NAV = [
  { href: "/lms/overview", label: "Overview", icon: Map, tour: "nav-overview" },
  { href: "/lms/dashboard", label: "Dashboard", icon: LayoutDashboard, tour: "nav-dashboard" },
  { href: "/lms/learn", label: "Learn", icon: GraduationCap, tour: "nav-learn" },
  { href: "/lms/whats-next", label: "What's Next", icon: Compass, tour: "nav-next" },
  { href: "/lms/practice", label: "Practice", icon: Dumbbell, tour: "nav-practice" },
  { href: "/lms/potd", label: "POTD", icon: CalendarCheck, tour: "nav-potd" },
];
const PROFILE = { href: "/lms/profile", label: "Profile", icon: CircleUser, tour: "nav-profile" };

function Icon({ d: I, className = "" }: { d: LucideIcon; className?: string }) {
  return <I size={17} strokeWidth={1.8} className={`flex-none ${className}`} aria-hidden />;
}

/* An icon in a circle: the rail's one repeated element. Red on the active page. */
function Ring({ d, active, size = 38 }: { d: LucideIcon; active: boolean; size?: number }) {
  return (
    <span className={`grid place-items-center rounded-full border-2 transition-colors duration-200
                      ${active ? "border-l-accent bg-l-soft" : "border-white/10 bg-white/[0.04] group-hover:border-white/25"}`}
          style={{ width: size, height: size }}>
      <Icon d={d} className={active ? "text-white" : "text-l-text2 group-hover:text-white"} />
    </span>
  );
}

function NavItem({ item, active }: { item: typeof PROFILE; active: boolean }) {
  return (
    <Link href={item.href} data-tour={item.tour} aria-current={active ? "page" : undefined}
          className="group relative flex flex-col items-center gap-1 py-0.5 transition-transform duration-200 hover:-translate-y-[1px]">
      <span>
        <Ring d={item.icon} active={active} />
      </span>
      <span className={`text-[10px] leading-none whitespace-nowrap ${active ? "text-white" : "text-l-text3 group-hover:text-l-text2"}`}>{item.label}</span>
    </Link>
  );
}

/* The rail grows out of the page's left edge like a tab: flush to the edge,
   rounded on the right, with concave fillets curving it into the edge above
   and below. Page icons sit in circles; Profile closes the rail.
   Phones use the bottom bar instead. */
const FILLET = 20;
function Fillet({ at }: { at: "top" | "bottom" }) {
  return (
    <span aria-hidden className="block" style={{
      width: FILLET, height: FILLET,
      background: `radial-gradient(circle at 100% ${at === "top" ? "0" : "100%"}, transparent ${FILLET - 0.5}px, var(--lms-surface) ${FILLET}px)`,
    }} />
  );
}

function Sidebar() {
  const path = usePathname();
  return (
    <aside className="fixed left-0 top-[calc(50%+32px)] -translate-y-1/2 z-30 max-[767px]:hidden flex flex-col">
      <Fillet at="top" />
      <nav aria-label="LMS" className="flex flex-col items-center gap-2.5 w-[76px] py-4 pl-1 rounded-r-[34px] bg-l-surface
                                        shadow-[18px_0_40px_-28px_rgba(0,0,0,.9)]">
        {NAV.map((n) => <NavItem key={n.href} item={n} active={path === n.href} />)}
        <span className="w-7 h-px bg-l-line2" aria-hidden />
        <NavItem item={PROFILE} active={path === PROFILE.href} />
      </nav>
      <Fillet at="bottom" />
    </aside>
  );
}

function MobileNav() {
  const path = usePathname();
  // all six learning pages; Profile is a tap away in the avatar menu
  const items = NAV.map((n) => (n.label === "What's Next" ? { ...n, label: "Next" } : n));
  return (
    <nav aria-label="LMS" className="min-[768px]:hidden fixed bottom-0 inset-x-0 z-40 border-t border-l-line bg-l-bg/95 backdrop-blur-md
                                     grid grid-cols-6 pb-[env(safe-area-inset-bottom)]">
      {items.map((n) => {
        const on = path === n.href;
        return (
          <Link key={n.href} href={n.href} data-tour={n.tour} aria-current={on ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-[9px] text-[10px] ${on ? "text-white" : "text-l-text3"}`}>
            <Icon d={n.icon} className={on ? "text-l-accent" : ""} />{n.label}
          </Link>
        );
      })}
    </nav>
  );
}

/* a small dropdown that closes on outside click and Escape */
function Pop({ trigger, children, label, tour }: { trigger: ReactNode; children: ReactNode; label: string; tour?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const d = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", d); document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", d); document.removeEventListener("keydown", k); };
  }, [open]);
  return (
    <div className="relative" ref={ref}>
      <button type="button" aria-expanded={open} aria-label={label} data-tour={tour} onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 cursor-pointer">{trigger}</button>
      {open && (
        <div className="lms-page absolute right-0 top-[calc(100%+12px)] z-50 w-[320px] max-w-[calc(100vw-24px)] notch win-n bg-l-elev p-5
                        shadow-[0_24px_60px_-20px_rgba(0,0,0,.9)]" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function StreakBadge() {
  const { student } = useLms();
  const todayIdx = (new Date().getDay() + 6) % 7;
  return (
    <Pop label={`${student.streak} day streak`} tour="streak" trigger={
      <span className="notch num-n flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.1] px-3 py-[6px] transition-colors">
        <Flame size={17} />
        <span className="font-mono text-[14px] text-white tabular-nums">{student.streak}</span>
      </span>}>
      <p className="m-0 font-mono text-[11px] tracking-[0.14em] uppercase text-l-text3">Daily streak</p>
      <div className="flex items-end gap-3 mt-3">
        <Flame size={40} />
        <div>
          <p className="m-0 font-display font-bold text-white text-[2rem] leading-none">{student.streak} days</p>
          <p className="m-0 mt-1 text-[13px] text-l-text2">Longest: {student.longestStreak} days</p>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 mt-5">
        {DAYS.map((d, i) => {
          const on = student.week[i];
          return (
            <div key={d} className="grid gap-1.5 justify-items-center">
              <span className={`notch num-n grid place-items-center w-9 h-9 text-[14px]
                ${on ? "bg-white/[0.14] text-white" : i === todayIdx ? "bg-white/[0.08] text-l-text2 shadow-[inset_0_0_0_1px_var(--lms-accent)]" : "bg-white/[0.05] text-l-text3"}`}>
                {on ? <Check size={16} strokeWidth={3} /> : <Circle size={10} />}
              </span>
              <span className={`text-[11px] ${i === todayIdx ? "text-white" : "text-l-text3"}`}>{d}</span>
            </div>
          );
        })}
      </div>
      <p className="m-0 mt-5 text-[13px] text-l-text2">Log in every day to keep your streak alive. Each daily login earns <span className="text-l-accent">+1 XP</span>.</p>
    </Pop>
  );
}

function ProfileMenu() {
  const { student, reset } = useLms();
  return (
    <Pop label="Profile menu" trigger={<Avatar student={student} size={36} />}>
      <div className="flex items-center gap-3">
        <Avatar student={student} size={48} />
        <div className="min-w-0">
          <p className="m-0 font-display font-bold text-white text-lg truncate">{student.fullName}</p>
          <p className="m-0 text-[13px] text-l-text2">Level {String(levelOf(student.xp)).padStart(2, "0")} · {fmtXp(student.xp)} XP · #{student.rank}</p>
        </div>
      </div>
      <div className="grid mt-4 border-t border-l-line pt-2">
        {[["/lms/profile", "View profile"], ["/lms/overview", "My journey"], ["/", "Back to iaib website"]].map(([h, l]) => (
          <Link key={h} href={h} className="px-1 py-2 text-[14px] text-l-text2 hover:text-white">{l}</Link>
        ))}
        <button type="button" onClick={() => { reset(); try { localStorage.removeItem("iaib.lms.access"); localStorage.removeItem("iaib.lms.v1"); } catch {} location.href = "/"; }}
                className="text-left px-1 py-2 text-[14px] text-l-text3 hover:text-white cursor-pointer">Sign out</button>
      </div>
    </Pop>
  );
}

function TopBar() {
  const { student, ready } = useLms();
  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 border-b border-l-line bg-l-bg/85 backdrop-blur-md">
      <div className="h-full flex items-center gap-4 px-6 max-[640px]:px-4">
        <Link href="/lms/overview" aria-label="IAIB home" className="flex items-center gap-3 flex-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/brand.png" width={692} height={96} alt="upGrad School of Technology · IAIB" className="h-[24px] max-[640px]:h-[20px] w-auto" />
        </Link>
        <span className="max-[900px]:hidden ml-3 pl-4 border-l border-l-line font-mono text-[11px] tracking-[0.14em] uppercase text-l-text3">Student</span>
        {/* until the saved student loads, hold the space rather than flash defaults */}
        {!ready ? (
          <div className="ml-auto flex items-center gap-3" aria-hidden>
            <span className="skel w-20 h-8" /><span className="skel w-14 h-8" /><span className="skel w-9 h-9" />
          </div>
        ) : (
        <div className="ml-auto flex items-center gap-3 max-[640px]:gap-2">
          <Link href="/lms/profile" data-xp-chip className="max-[480px]:hidden notch num-n flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] px-3 py-[6px] transition-colors">
            <span className="w-2 h-2 bg-l-accent" aria-hidden />
            <span className="font-mono text-[14px] text-white tabular-nums">{fmtXp(student.xp)}</span>
            <span className="font-mono text-[11px] text-l-text3">XP</span>
          </Link>
          <StreakBadge />
          <ProfileMenu />
        </div>
        )}
      </div>
    </header>
  );
}

function Floats() {
  const { floats } = useLms();
  return (
    <>
      {floats.map((f) => (
        <span key={f.id} className={`xp-float notch num-n ${f.amount < 0 ? "neg" : ""}`} style={{ left: f.x, top: f.y }} aria-hidden>
          {f.amount > 0 ? "+" : ""}{fmtXp(f.amount)} XP
        </span>
      ))}
      <p className="sr-only" aria-live="polite">{floats.length ? `${fmtXp(floats[floats.length - 1].amount)} XP` : ""}</p>
    </>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <div className="lms">
      <a href="#lms-main" className="sr-only focus:not-sr-only focus:fixed focus:z-[500] focus:top-2 focus:left-2 focus:bg-white focus:text-black focus:px-3 focus:py-2">Skip to content</a>
      <TopBar />
      <Sidebar />
      <main id="lms-main" className="pt-16 pl-[100px] max-[767px]:pl-0 max-[767px]:pb-24">
        <div key={path} className="lms-page mx-auto max-w-[1240px] px-10 py-10 max-[1100px]:px-7 max-[640px]:px-4 max-[640px]:py-7">
          {children}
        </div>
      </main>
      <MobileNav />
      <Mascot placement="float" />
      <Floats />
    </div>
  );
}
