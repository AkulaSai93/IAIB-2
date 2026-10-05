"use client";

import { useEffect } from "react";

/* Sections below the hero rise into place as they scroll into view. Each
   section's blocks (heading, then content) are staggered a beat apart. The
   hidden state is only applied from script, so without JS — or with reduced
   motion — everything is simply visible. Transforms don't move layout, so the
   nav's scroll-to-section maths is unaffected. */
export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    // one level of blocks per section: the direct children of its inner grid
    // or wrapper, whichever holds more than one item
    const els = new Set<HTMLElement>();
    document.querySelectorAll<HTMLElement>("main > section:not(#top), footer").forEach((sec) => {
      const wrap = sec.querySelector<HTMLElement>(".wrap");
      if (!wrap) return;
      const top = [...wrap.children] as HTMLElement[];
      const blocks = top.length === 1 && top[0].children.length > 1 ? ([...top[0].children] as HTMLElement[]) : top;
      blocks.forEach((b, i) => {
        b.dataset.reveal = "";
        b.style.setProperty("--rv-delay", `${Math.min(i, 4) * 110}ms`);
        els.add(b);
      });
    });

    // a plain position check on scroll, not an IntersectionObserver: it can't
    // miss an element, so nothing is ever left stuck invisible
    let pending = [...els];
    const check = (instant: boolean) => {
      const line = window.innerHeight * 0.88;
      // at the foot of the page nothing can scroll any higher, so whatever is
      // still waiting (the footer wordmark sits below the line) shows now
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      pending = pending.filter((el) => {
        if (!atEnd && el.getBoundingClientRect().top > line) return true;
        el.classList.add("rv-in");
        if (instant) el.classList.add("rv-now");
        return false;
      });
      if (!pending.length) window.removeEventListener("scroll", onScroll);
    };
    // a handful of elements, so checking on every scroll event is cheap
    const onScroll = () => check(false);
    check(true); // whatever is already on screen at load shows at once
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  return null;
}
