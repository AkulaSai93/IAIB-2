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

const BTN =
  "inline-flex items-center gap-2 font-mono text-[11.5px] tracking-[0.08em] uppercase " +
  "font-medium px-[14px] py-[7px] rounded-[7px] border border-transparent " +
  "leading-[1.6] whitespace-nowrap transition-[0.16s] cursor-pointer";

const PRIMARY =
  "bg-linear-to-b from-white to-[#dcdcdc] text-black " +
  "shadow-[0_1px_0_rgba(255,255,255,.5)_inset,0_6px_20px_-8px_rgba(255,255,255,.3)] " +
  "hover:from-white hover:to-[#eee]";

const GHOST =
  "border-line-2 text-fg bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.22]";

const LG = "text-[12.5px] px-[22px] py-[13px] rounded-lg";

/* A notched ghost button cannot keep its border — a clip-path cuts a 1px border
   into open ends at every step — so it carries a filled surface instead. */
const GHOST_NOTCHED = "border-transparent bg-white/[0.06] hover:bg-white/[0.12]";

export function btnClass(opts: { primary?: boolean; lg?: boolean; notch?: boolean } = {}) {
  return [
    BTN,
    opts.primary ? PRIMARY : GHOST,
    opts.lg ? LG : "",
    opts.notch ? `notch ${opts.primary ? "" : GHOST_NOTCHED}` : "",
  ].join(" ");
}

/* Register has no destination yet. A real <button> rather than a link to
   nowhere: it stays keyboard-focusable and is plainly a control awaiting a
   handler, rather than a link that silently does nothing. */
export function RegisterButton({ children, lg, notch }: { children: ReactNode; lg?: boolean; notch?: boolean }) {
  return (
    <button type="button" className={btnClass({ primary: true, lg, notch })}>
      {children}
    </button>
  );
}

export function GhostLink({ href, children, lg, notch }: { href: string; children: ReactNode; lg?: boolean; notch?: boolean }) {
  return (
    <a href={href} className={btnClass({ lg, notch })}>
      {children}
    </a>
  );
}
