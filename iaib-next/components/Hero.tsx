"use client";

import { useEffect, useRef } from "react";
import { YT_ID } from "@/lib/data";
import { useLightbox } from "./Lightbox";
import PixelBot from "./PixelBot";
import { RegisterButton, GhostLink } from "./ui";

declare global { interface Window { YT?: any; onYouTubeIframeAPIReady?: () => void } }

function HeroVideo() {
  const { open } = useLightbox();
  const frame = useRef<HTMLIFrameElement>(null);

  /* The autoplay attribute alone leaves a frozen play button wherever the
     browser declines it, which is often. The IFrame API's mute()+playVideo() is
     honoured, and ENDED seeks back to 0 rather than letting the end-screen's
     video grid appear. None of the player's chrome can be turned off, so the
     clip is scaled past it instead (see .hero-yt). */
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const el = frame.current;
    if (!el) return;

    const boot = () => {
      if (!window.YT?.Player) return;
      new window.YT.Player(el, {
        events: {
          onReady: (e: any) => { e.target.mute(); e.target.playVideo(); },
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.ENDED) { e.target.seekTo(0); e.target.playVideo(); }
          },
        },
      });
    };

    if (window.YT?.Player) { boot(); return; }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); boot(); };
    if (!document.querySelector('script[src*="iframe_api"]')) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
  }, []);

  const q = new URLSearchParams({
    autoplay: "1", mute: "1", loop: "1", playlist: YT_ID, controls: "0",
    modestbranding: "1", playsinline: "1", rel: "0", disablekb: "1", fs: "0",
    iv_load_policy: "3", cc_load_policy: "0", enablejsapi: "1",
  });

  return (
    <div className="hero-vid" onClick={open}>
      <iframe
        ref={frame} className="hero-yt" tabIndex={-1} aria-hidden title=""
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        src={`https://www.youtube-nocookie.com/embed/${YT_ID}?${q}`}
      />
    </div>
  );
}

function Prize({ label, amount, unit, star }: { label: string; amount: string; unit: string; star?: boolean }) {
  return (
    <div className="notch relative overflow-hidden px-[18px] pt-4 pb-[15px] max-[430px]:px-[14px] max-[430px]:pt-3 max-[430px]:pb-3
                    bg-linear-170 from-white/[0.07] via-white/[0.02] to-transparent">
      <span className="p-rail" aria-hidden />
      <span className="block font-mono text-[11px] max-[430px]:text-[9.5px] tracking-[0.14em] max-[430px]:tracking-[0.08em] uppercase text-fg-dim">{label}</span>
      <span className="flex items-baseline gap-[7px] mt-[9px] font-mono tabular-nums whitespace-nowrap">
        <b className="font-medium text-[clamp(1.5rem,2.5vw,2.05rem)] leading-none tracking-[-0.02em] text-white">{amount}</b>
        <em className="not-italic text-[12.5px] tracking-[0.06em] uppercase text-fg-mid">{unit}</em>
        {star && <sup className="text-[11px] text-accent -top-[0.7em]">*</sup>}
      </span>
    </div>
  );
}

export default function Hero() {
  const stage = useRef<HTMLElement>(null);

  return (
    <section className="hero relative overflow-hidden border-b border-line" ref={stage} id="top">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0"
             style={{ background:
               "radial-gradient(ellipse 55% 45% at 78% 8%,rgba(255,255,255,.10),transparent 68%)," +
               "radial-gradient(ellipse 34% 34% at 88% 0%,rgba(240,64,47,.13),transparent 70%)," +
               "radial-gradient(ellipse 80% 50% at 50% 100%,rgba(255,255,255,.03),transparent 70%)" }} />
        <div className="absolute -top-[30%] -right-[5%] w-[52%] h-[150%] blur-[26px]"
             style={{ background: "linear-gradient(104deg,transparent 42%,rgba(255,255,255,.07) 50%,transparent 58%)" }} />
      </div>

      <PixelBot stageRef={stage} />

      <div className="wrap relative grid items-center gap-12 min-[1021px]:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)]
                      min-[1021px]:min-h-[min(840px,calc(100svh-57px))]">
        <div className="relative z-[1] text-left pt-[72px] pb-12 min-[1021px]:pt-[72px] min-[1021px]:pb-12">
          <div className="rise flex items-center justify-start gap-4 m-0" style={{ animationDelay: ".14s" }}>
            {/* lifted off its near-white plate by flood-filling inward from the
                border: the bird, the scroll and the motto inside the shield are
                white too, and a blanket key punched holes through them */}
            <img src="/assets/karnataka-emblem.png" width={154} height={140} alt="" aria-hidden
                 className="w-[78px] max-[560px]:w-[60px] h-auto block flex-none" />
            <p className="grid gap-[2px] text-left m-0">
              <span className="font-mono text-[11px] tracking-[0.13em] uppercase text-fg-dim">Supported by</span>
              <span className="font-display font-bold text-[19px] max-[560px]:text-base leading-[1.15] tracking-[-0.02em] text-[#fafafa]">
                Government of Karnataka
              </span>
            </p>
          </div>

          <h1 className="font-h1 font-bold text-white m-0 mt-[26px] whitespace-nowrap
                         text-[clamp(1.75rem,4.8vw,4.3rem)] leading-[1.06] tracking-[-0.035em]">
            <span className="line block">
              <span className="line-in block">
                Ignite AI{" "}
                <span className="sel">
                  <span className="text-accent" style={{ WebkitTextFillColor: "var(--color-accent)" }}>Buildathon</span>
                  <i className="hd hd-tl" /><i className="hd hd-tr" /><i className="hd hd-bl" /><i className="hd hd-br" />
                  <svg className="sel-cursor" viewBox="0 0 20 22" fill="currentColor" aria-hidden>
                    <path d="M2 1.6 L15.5 11.5 L9.6 12.2 L12.6 18.4 L10.1 19.6 L7.1 13.4 L2.6 17.4 Z" />
                  </svg>
                </span>
              </span>
            </span>
          </h1>

          <p className="rise max-w-[560px] mt-10 mb-0 text-fg-mid text-[17px] leading-[1.62]" style={{ animationDelay: ".62s" }}>
            AIB stands to identify, nurture, and facilitate school students from classes 9th till 12th in
            learning about AI. They will get to learn AI, test their knowledge, and build solutions.
          </p>

          <div className="rise flex flex-wrap gap-3 mt-8 justify-start max-[560px]:grid max-[560px]:[&>*]:justify-center" style={{ animationDelay: ".74s" }}>
            <RegisterButton lg notch>Register now</RegisterButton>
            <GhostLink href="#curriculum" lg notch>Explore the curriculum</GhostLink>
          </div>

          <div className="rise grid grid-cols-2 gap-[14px] max-[430px]:gap-[10px] mt-[34px] max-w-[520px]"
               style={{ animationDelay: ".86s" }}>
            <Prize label="Scholarship worth" amount="₹2" unit="Crore" star />
            <Prize label="Win prizes up to" amount="₹20" unit="Lakhs" />
          </div>

          <p className="rise m-0 mt-9 font-mono text-[12.5px] tracking-[0.1em] uppercase text-fg"
             style={{ animationDelay: "1.02s" }}>
            October 8th, 2026 <i className="not-italic text-fg-dim mx-[0.55em]">|</i> Bengaluru
          </p>
        </div>

        <HeroVideo />
      </div>
    </section>
  );
}
