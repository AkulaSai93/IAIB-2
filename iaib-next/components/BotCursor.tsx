"use client";

import { useEffect, useRef, useState } from "react";
import { ART, PAL } from "@/lib/bot";

/* The pixel bot is the mouse cursor. It follows the pointer everywhere. Mouse and trackpad only: on a
   touch screen there is no pointer to follow, so the hero's own bot walks in
   instead (see .botfield in globals.css). */
const W = 40;
const H = Math.round((W * 21) / 20);


export default function BotCursor() {
  const [src, setSrc] = useState("");
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const cv = document.createElement("canvas");
    cv.width = ART[0].length; cv.height = ART.length;
    const cx = cv.getContext("2d");
    if (!cx) return;
    ART.forEach((row, y) => [...row].forEach((ch, x) => {
      if (ch === ".") return;
      cx.fillStyle = PAL[ch]; cx.fillRect(x, y, 1, 1);
    }));
    setSrc(cv.toDataURL("image/png"));
    document.documentElement.classList.add("bot-cursor");
    return () => document.documentElement.classList.remove("bot-cursor");
  }, []);

  useEffect(() => {
    const c = el.current;
    if (!src || !c) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // the hotspot is the top centre of the bot's head
      c.style.transform = `translate(${e.clientX - W / 2}px,${e.clientY}px)`;
      c.classList.add("on");
      // over the hero clip, and only there, the bot thinks "Click to watch"
      c.classList.toggle("watch", !!(e.target as Element | null)?.closest?.(".hero-vid"));
    };
    const leave = () => c.classList.remove("on");
    // a click is a quick hop on the spot: up a little, squash on landing
    const down = () => {
      c.classList.remove("cur-jump"); void c.offsetWidth; c.classList.add("cur-jump");
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [src]);

  if (!src) return null;
  return (
    <div className="botcur" ref={el} aria-hidden>
      <span className="botsay">Click to watch<i /><i /></span>
      <span className="bot" style={{ backgroundImage: `url(${src})`, ["--w" as string]: `${W}px`, ["--h" as string]: `${H}px` }} />
    </div>
  );
}
