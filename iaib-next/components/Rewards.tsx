import type { ReactNode } from "react";

/* Why IAIB (content and order from Figma 497:20, drawn in the site's own
   stepped-corner style): each reward is a neutral stage holding a small
   mock of the thing itself, with the title and the plain-language promise
   beneath. Order and copy follow the design: prizes, pitch, scholarship on
   the first row; recommendation and certificates on the second. */

const Eyebrow = ({ children, center }: { children: ReactNode; center?: boolean }) => (
  <p className={`m-0 font-body font-semibold text-[11px] leading-[17.6px] tracking-[0.14em] uppercase text-accent ${center ? "text-center" : ""}`}>
    {children}
  </p>
);

/* the stage: a dark diagonal gradient with a soft light in its top-left */
function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="notch relative h-[270px] max-[640px]:h-[240px] overflow-hidden"
         style={{ backgroundImage: "linear-gradient(146deg, #2a2a2a 0%, #161616 50%, #0a0a0a 100%)" }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse 70% 60% at 15% 0%, rgba(255,255,255,.1), transparent 60%)" }} />
      {children}
    </div>
  );
}

/* the mock inside a stage: parked 28px in and 32px down, running off the bottom */
function Mock({ children, wide, className = "" }: { children: ReactNode; wide?: boolean; className?: string }) {
  return (
    <div className={`notch cap-n absolute left-7 top-8 bottom-0 bg-surface ${wide ? "right-7" : "right-0"} ${className}`}>{children}</div>
  );
}

function Prizes() {
  const rows = [
    { r: "01", t: "Team Neural", p: "Winner", hi: true },
    { r: "02", t: "Byte Builders", p: "Runner-up" },
    { r: "03", t: "Prompt Pilots", p: "2nd runner-up" },
  ];
  return (
    <Mock>
      <div className="flex items-center gap-2 h-9 px-4 border-b border-line">
        {[0, 1, 2].map((i) => <span key={i} className="w-[7px] h-[7px] bg-white/20" />)}
        <span className="pl-2 font-mono text-[12px] text-fg-dim">finale.leaderboard</span>
      </div>
      <ol className="list-none m-0 p-3 grid gap-[6px]">
        {rows.map((x) => (
          <li key={x.r} className={`notch num-n flex items-center gap-3 px-3 py-[9px] ${x.hi ? "bg-accent text-white" : "bg-white/[0.04] text-fg-mid"}`}>
            <span className="font-mono text-[12px] opacity-80">{x.r}</span>
            <span className="flex-1 text-[14px]">{x.t}</span>
            <span className="text-[12px] opacity-90">{x.p}</span>
          </li>
        ))}
      </ol>
    </Mock>
  );
}

function Pitch() {
  const bars = [27.6, 40.5, 35, 53.4, 46, 66.2, 81];
  return (
    <>
      <Mock className="px-6 pt-5">
        <Eyebrow>Demo day · Bengaluru</Eyebrow>
        <p className="m-0 mt-2 font-display font-bold text-white text-[19.2px] leading-[30.72px]">AI Project X</p>
        <div className="flex items-end gap-[7px] h-[92px] mt-4">
          {bars.map((h, i) => (
            <span key={i} className={i === bars.length - 1 ? "bg-accent" : "bg-white/[0.12]"} style={{ width: 16, height: h }} />
          ))}
        </div>
      </Mock>
      {/* the investors watching */}
      <div aria-hidden className="absolute right-4 bottom-5 flex">
        {["#f0402f", "#e6e6e6", "#8c8c8c"].map((c) => (
          <span key={c} className="notch num-n grid place-items-center w-9 h-9 -ml-2 first:ml-0" style={{ background: c }}>
            <span className="w-3 h-3 bg-black/70" />
          </span>
        ))}
      </div>
    </>
  );
}

function Scholarship() {
  const items: ReactNode[] = ["Open to IAIB participants", <span key="c" className="bg-accent/15 text-white px-2 py-[2px]">Campus programme</span>, "Next year’s cohort"];
  return (
    <Mock className="px-6 pt-6">
      <Eyebrow>upGrad School of Technology · Scholarship</Eyebrow>
      <p className="m-0 mt-2 font-display font-bold text-white text-[21.6px] leading-[34.56px] tracking-[-0.01em]">₹2 crore scholarship pool</p>
      <ul className="list-none m-0 mt-4 p-0 grid gap-[10px] text-[14px] leading-[22.4px] text-fg-mid">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/why/check.svg" width={16} height={16} alt="" className="flex-none" />
            {it}
          </li>
        ))}
      </ul>
    </Mock>
  );
}

function Letter() {
  return (
    <Mock wide className="px-6 pt-6">
      <Eyebrow>Letter of recommendation</Eyebrow>
      <p className="m-0 mt-2 text-[14px] leading-[22.4px] text-fg-mid">To whom it may concern,</p>
      <div className="grid gap-[7px] mt-3" aria-hidden>
        {[92, 100, 84, 96, 60].map((w, i) => <span key={i} className="h-[6px] bg-white/[0.09]" style={{ width: `${w}%` }} />)}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/why/signature.svg" width={110} height={27.5} alt="" className="block mt-4" />
      <span className="absolute right-6 top-[158px] notch num-n grid place-items-center w-14 h-14 bg-accent/15 text-accent font-mono text-[10px] leading-[12.5px] text-center">
        IAIB<br />MENTOR
      </span>
    </Mock>
  );
}

function Certificate() {
  return (
    <Mock wide className="px-6 pt-6 text-center">
      <div aria-hidden className="absolute left-3 right-3 top-3 h-[214px] border border-accent/30 pointer-events-none" />
      <Eyebrow center>Certificate of completion</Eyebrow>
      <p className="m-0 mt-3 font-display font-bold text-white text-[20px] leading-[32px]">Ignite AI Buildathon</p>
      <p className="m-0 mt-3 text-[12px] leading-[19.2px] text-fg-dim">Awarded to</p>
      <p className="m-0 mt-1 text-[24px] leading-[38.4px] text-white">Your Name</p>
      <span className="block w-32 h-px bg-white/[0.14] mx-auto mt-2" />
      <span className="absolute right-5 top-[162px] notch cap-n grid place-items-center w-14 h-14 bg-accent">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/why/award.svg" width={28} height={28} alt="" />
      </span>
    </Mock>
  );
}

const ITEMS: { title: string; body: string; visual: ReactNode; wide?: boolean }[] = [
  { title: "₹20 L in prizes", visual: <Prizes />,
    body: "Win from a ₹20 lakh prize pool, awarded to the top teams at the grand finale in Bengaluru." },
  { title: "Pitch to VCs", visual: <Pitch />,
    body: "Finalists present what they built to a panel of venture capital investors." },
  { title: "₹2 Cr in scholarships", visual: <Scholarship />,
    body: "A ₹2 crore scholarship pool for participants who join the upGrad School of Technology campus programme next year." },
  { title: "Letters of recommendation", visual: <Letter />, wide: true,
    body: "Letters of recommendation to top performers" },
  { title: "Certificates & Goodies", visual: <Certificate />, wide: true,
    body: "Participating students stand a chance to win certificates and goodies." },
];

export default function Rewards() {
  return (
    <div className="grid grid-cols-6 gap-x-8 gap-y-14 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-y-10">
      {ITEMS.map((it) => (
        <article key={it.title} className={`min-w-0 ${it.wide ? "col-span-3" : "col-span-2"} max-[980px]:col-span-1
                                            ${it.wide ? "max-[980px]:last:col-span-2 max-[640px]:last:col-span-1" : ""}`}>
          <Stage>{it.visual}</Stage>
          <h3 className="mt-6 mb-0 font-display font-bold text-white text-[23.2px] leading-[37.12px] tracking-[-0.015em]">{it.title}</h3>
          <p className="mt-2 mb-0 text-fg-mid text-[15px] leading-[24px] max-w-[450px]">{it.body}</p>
        </article>
      ))}
    </div>
  );
}
