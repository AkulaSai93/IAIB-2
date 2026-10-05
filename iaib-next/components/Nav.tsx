"use client";

import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/data";
import { btnClass } from "./ui";

function Brand({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`flex items-center flex-none ${className}`} aria-label="upGrad — Ignite AI Buildathon, home">
      {/* the full lockup as one asset: upGrad, the divider and </IAIB>. The
          sub-lines do not read at nav scale and are not meant to — the mark is
          recognised, not parsed. */}
      <img src="/assets/brand.png" width={692} height={96} alt=""
           className="h-[34px] max-[560px]:h-[26px] w-auto block" />
    </a>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  /* close on outside click and on Escape — a menu that only closes by its own
     button is a trap on a phone */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (menu.current && !menu.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-50 bg-black/[0.72] backdrop-blur-[14px] border-b border-line">
      <div className="wrap flex items-center gap-7 h-16 max-[560px]:h-14">
        <Brand />
        <nav className="hidden min-[881px]:flex gap-6 ml-2">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}
               className="font-mono text-[11.5px] tracking-[0.09em] uppercase text-fg-mid hover:text-fg transition-colors">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <button type="button" className={`${btnClass({ primary: true })} max-[360px]:hidden`}>
            Register Now
          </button>

          <div className="relative min-[881px]:hidden" ref={menu}>
            <button
              type="button"
              aria-expanded={open}
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="w-[34px] h-8 grid place-items-center border border-line-2 rounded-[7px] bg-white/[0.03] cursor-pointer"
            >
              <span className="relative block w-[15px] h-[1.5px] bg-fg
                before:content-[''] before:absolute before:left-0 before:-top-[5px] before:w-[15px] before:h-[1.5px] before:bg-fg
                after:content-[''] after:absolute after:left-0 after:top-[5px] after:w-[15px] after:h-[1.5px] after:bg-fg" />
            </button>

            {open && (
              <div className="absolute right-0 top-[calc(100%+11px)] min-w-[196px] z-[70] bg-[#0a0a0a]
                              border border-line rounded-[10px] p-[7px] grid gap-[2px]
                              shadow-[0_20px_44px_-14px_rgba(0,0,0,.95)]">
                {NAV.map((n) => (
                  <a key={n.href} href={n.href} onClick={() => setOpen(false)}
                     className="px-3 py-[9px] rounded-[7px] text-sm text-fg-mid hover:bg-white/[0.06] hover:text-fg">
                    {n.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
