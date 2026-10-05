"use client";

import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/data";
import { btnClass } from "./ui";
import OpenRegister from "./register/RegisterButton";

function Brand({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`flex items-center flex-none ${className}`} aria-label="upGrad — Ignite AI Buildathon, home">
      {/* the full lockup as one asset: upGrad, the divider and </IAIB>. The
          sub-lines do not read at nav scale and are not meant to — the mark is
          recognised, not parsed. */}
      <img src="/assets/brand.png" width={692} height={96} alt=""
           className="h-[26px] max-[560px]:h-[22px] w-auto block" />
    </a>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  /* In-page links (#why, #how …) scroll in script rather than by the browser's
     native smooth scroll, which an autoplaying embed or late layout can cut
     short. It lands the section just under the sticky bar, then checks where
     it actually ended up and snaps the rest of the way if anything stopped it. */
  useEffect(() => {
    const offset = () => (document.querySelector("header")?.getBoundingClientRect().height ?? 64) + 12;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      const el = id === "top" ? document.body : document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      setOpen(false);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const target = () => id === "top" ? 0 : Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset());
      window.scrollTo({ top: target(), behavior: reduce ? "auto" : "smooth" });
      history.pushState(null, "", `#${id}`);
      window.setTimeout(() => {
        if (Math.abs(window.scrollY - target()) > 4) window.scrollTo({ top: target(), behavior: "auto" });
      }, 1100);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

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
      <div className="wrap relative flex items-center gap-7 max-[560px]:gap-3 h-16 max-[560px]:h-14">
        <Brand />
        {/* centred on the bar itself, not in the space left between logo and CTA */}
        <nav className="hidden min-[1021px]:flex gap-7 absolute left-1/2 -translate-x-1/2">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}
               className="font-body text-[12px] tracking-[0.08em] uppercase text-fg-mid hover:text-fg transition-colors">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4 max-[560px]:gap-2">
          <OpenRegister className={`${btnClass({ primary: true })} max-[560px]:text-[12px] max-[560px]:px-3 max-[560px]:py-[7px] max-[340px]:hidden`}>
            Register now
          </OpenRegister>

          <div className="relative min-[1021px]:hidden" ref={menu}>
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
