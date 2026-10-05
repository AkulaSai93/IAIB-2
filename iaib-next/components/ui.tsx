import type { ReactNode } from "react";

/* The page's shared primitives, so a section never hand-rolls its own spacing
   or button shape. */

export function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`wrap ${className}`}>{children}</div>;
}

export function Sec({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`wrap py-[88px] ${className}`}>{children}</div>;
}

export function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`font-display font-bold text-white m-0 text-balance
        text-[clamp(2rem,4.4vw,3.1rem)] leading-[1.12] tracking-[-0.025em] ${className}`}
    >
      {children}
    </h2>
  );
}

/* the live site accents the key words of every heading; same device here */
export function Hl({ children }: { children: ReactNode }) {
  return <span className="text-accent">{children}</span>;
}

export function Sub({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`max-w-[52ch] mt-4 mb-0 text-fg-mid text-base ${className}`}>{children}</p>;
}

export function SecHead({ children }: { children: ReactNode }) {
  return <div className="mb-11">{children}</div>;
}

/* Every CTA is a ticket stub: a stepped pixel corner, and sentence-case mono. The corner is the same clip-path as .notch, at a step sized
   to the button (see .cta in globals.css). */
const BTN =
  "cta notch inline-flex items-center gap-[0.55em] font-mono font-normal " +
  "text-[13px] tracking-[-0.01em] px-[18px] py-[9px] leading-[1.5] " +
  "whitespace-nowrap transition-colors duration-150 cursor-pointer";

const PRIMARY = "bg-white text-black hover:bg-[#e4e4e4]";

/* A clip-path cuts a 1px border into open ends at every step, so the
   secondary CTA carries a filled surface instead of an outline. */
const GHOST = "bg-white/[0.08] text-fg hover:bg-white/[0.16]";

const LG = "cta-lg text-[15px] px-[26px] py-[13px]";

export function btnClass(opts: { primary?: boolean; lg?: boolean } = {}) {
  return [BTN, opts.primary ? PRIMARY : GHOST, opts.lg ? LG : ""].join(" ");
}

/* Register has no destination yet. A real <button> rather than a link to
   nowhere: it stays keyboard-focusable and is plainly a control awaiting a
   handler, rather than a link that silently does nothing. */
export function RegisterButton({ children, lg }: { children: ReactNode; lg?: boolean; notch?: boolean }) {
  return (
    <button type="button" className={btnClass({ primary: true, lg })}>
      {children}
    </button>
  );
}

export function GhostLink({ href, children, lg }: { href: string; children: ReactNode; lg?: boolean; notch?: boolean }) {
  return (
    <a href={href} className={btnClass({ lg })}>
      {children}
    </a>
  );
}
