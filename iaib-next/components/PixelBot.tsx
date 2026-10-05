"use client";

import { useEffect, useRef, useState } from "react";
import { useLightbox } from "./Lightbox";
import { ART, PAL } from "@/lib/bot";

const BW = 58;
const BH = Math.round((BW * 21) / 20);

export default function PixelBot({ stageRef }: { stageRef: React.RefObject<HTMLElement | null> }) {
  const [src, setSrc] = useState<string>("");
  const walk = useRef<HTMLSpanElement>(null);
  const arrived = useRef(false);
  const { open } = useLightbox();

  useEffect(() => {
    const cv = document.createElement("canvas");
    cv.width = ART[0].length; cv.height = ART.length;
    const cx = cv.getContext("2d");
    if (!cx) return;
    for (let y = 0; y < ART.length; y++)
      for (let x = 0; x < ART[y].length; x++) {
        const ch = ART[y][x];
        if (ch === ".") continue;
        cx.fillStyle = PAL[ch] ?? "#888";
        cx.fillRect(x, y, 1, 1);
      }
    try { setSrc(cv.toDataURL("image/png")); } catch {}
  }, []);

  /* It starts out by the headline and walks to the centre of the clip. Only when
     it arrives does the cloud appear — it is the only thing on the page that
     says the video opens, so it has to actually go there. */
  useEffect(() => {
    if (!src) return;
    const el = walk.current;
    const field = stageRef.current;
    if (!el || !field) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const target = () => {
      const vid = field.querySelector<HTMLElement>(".hero-vid");
      if (!vid || getComputedStyle(vid).display === "none") return null;
      const fr = field.getBoundingClientRect(), vr = vid.getBoundingClientRect();
      return {
        x: vr.left - fr.left + vr.width / 2 - BW / 2,
        y: vr.top - fr.top + vr.height / 2 - BH / 2,
        startX: vr.left - fr.left - BW * 1.6,
        startY: 28,
      };
    };
    const put = (x: number, y: number) => {
      el.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`;
    };

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.style.transition = "";
      arrived.current = true;
      el.classList.add("arrived");
    };

    const place = () => {
      const t = target();
      if (!t) { el.style.display = "none"; return; }
      el.style.display = ""; el.style.transition = "";
      put(t.x, t.y); el.style.visibility = "";
    };

    const arrive = () => {
      const t = target();
      if (!t) { el.style.display = "none"; return; }
      el.style.display = "";
      put(t.startX, t.startY);
      el.style.visibility = "";
      // the start position has to be painted before the move is armed, or the
      // browser collapses both into one style change and nothing animates
      void el.offsetWidth;
      el.style.transition = "transform 2.5s linear";
      put(t.x, t.y);
      el.addEventListener("transitionend", finish, { once: true });
      setTimeout(finish, 3100); // transitionend can be missed
    };

    let timer: number;
    if (reduce) { place(); el.classList.add("arrived"); }
    else timer = window.setTimeout(arrive, 620);

    let rt: number;
    const onResize = () => {
      clearTimeout(rt);
      rt = window.setTimeout(() => { if (arrived.current || reduce) place(); else arrive(); }, 150);
    };
    window.addEventListener("resize", onResize);
    return () => { clearTimeout(timer!); clearTimeout(rt); window.removeEventListener("resize", onResize); };
  }, [src, stageRef]);

  if (!src) return null;

  return (
    <div className="botfield">
      <span className="bw" ref={walk} style={{ visibility: "hidden" }}>
        <span className="botsay">
          Click to watch<i /><i />
        </span>
        <span className="bf">
          <span
            className="bot"
            role="button"
            tabIndex={0}
            aria-label="Watch the film"
            style={{ backgroundImage: `url(${src})`, ["--w" as string]: `${BW}px`, ["--h" as string]: `${BH}px` }}
            onClick={(e) => { e.stopPropagation(); open(); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}
            onPointerEnter={(e) => {
              const t = e.currentTarget;
              if (t.classList.contains("jump")) return;
              t.classList.add("jump");
              t.addEventListener("animationend", () => t.classList.remove("jump"), { once: true });
            }}
          />
        </span>
      </span>
    </div>
  );
}
