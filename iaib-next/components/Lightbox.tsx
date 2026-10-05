"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { YT_ID } from "@/lib/data";

/* The hero clip is cropped, masked, scaled and muted — it is wallpaper, not
   something you can watch. This is where it becomes watchable: full 16:9, real
   controls, sound. The iframe is mounted on open and unmounted on close, so the
   full-size player never loads behind the page or keeps playing once dismissed. */

type Ctx = { open: () => void };
const LightboxCtx = createContext<Ctx>({ open: () => {} });
export const useLightbox = () => useContext(LightboxCtx);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);
  const last = useRef<HTMLElement | null>(null);
  const box = useRef<HTMLDivElement>(null);

  const open = useCallback(() => {
    last.current = document.activeElement as HTMLElement;
    setOn(true);
  }, []);
  const close = useCallback(() => {
    setOn(false);
    last.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!on) return;
    document.body.style.overflow = "hidden";
    box.current?.querySelector<HTMLButtonElement>("button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !box.current) return;
      // keep tabbing inside the dialog while it is up
      const f = box.current.querySelectorAll<HTMLElement>("button, iframe, [href]");
      if (!f.length) return;
      const first = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [on, close]);

  return (
    <LightboxCtx.Provider value={{ open }}>
      {children}
      {on && (
        <div className="fixed inset-0 z-[200] grid place-items-center p-[4vmin]"
             role="dialog" aria-modal="true" aria-label="Watch the film">
          <div className="lb-back absolute inset-0 bg-black/[0.88] backdrop-blur-[6px]" onClick={close} />
          <div className="lb-box relative w-[min(100%,1180px)]" ref={box}>
            <button
              type="button" onClick={close}
              className="notch absolute right-0 bottom-[calc(100%+12px)] cursor-pointer border-0
                         inline-flex items-center gap-2 px-[14px] py-[9px] font-mono text-[11px]
                         tracking-[0.09em] uppercase text-black bg-white hover:bg-[#dcdcdc] transition-colors"
              style={{ ["--n" as string]: "7px" }}
            >
              Close
            </button>
            <div className="relative aspect-video bg-black overflow-hidden">
              <iframe
                className="absolute inset-0 w-full h-full border-0"
                src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&controls=0&rel=0&playsinline=1&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0`}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title="Ignite AI Buildathon"
              />
            </div>
          </div>
        </div>
      )}
    </LightboxCtx.Provider>
  );
}
