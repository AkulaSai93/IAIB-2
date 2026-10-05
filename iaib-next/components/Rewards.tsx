import type { ReactNode } from "react";

/* Why IAIB: each reward is a neutral stage holding a small mock of the thing
   itself — the scholarship pass, the finale leaderboard, the pitch, the letter,
   the certificate — with the title and the plain-language promise beneath. The
   mocks are dark notched panels so the section stays in the page's system. */

const Check = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 flex-none" aria-hidden>
    <rect x="1" y="1" width="14" height="14" fill="none" stroke="#f0402f" strokeWidth="1.5" />
    <path d="M4.5 8.2 7 10.6 11.6 5.6" fill="none" stroke="#f0402f" strokeWidth="1.7" />
  </svg>
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="m-0 font-body text-[11px] tracking-[0.14em] uppercase text-accent font-semibold">{children}</p>
);

/* the inner mock: dark, notched, parked off the stage's bottom-right edge */
function Mock({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`notch cap-n absolute bg-surface border-0 shadow-none ${className}`}>{children}</div>
  );
}

function Scholarship() {
  return (
    <Mock className="left-7 top-8 right-0 bottom-0 px-6 pt-6">
      <Eyebrow>upGrad School of Technology · Scholarship</Eyebrow>
      <p className="m-0 mt-2 font-display font-bold text-white text-[1.35rem] tracking-[-0.01em]">₹2 crore scholarship pool</p>
      <ul className="list-none m-0 mt-4 p-0 grid gap-[10px] text-[14px] text-fg-mid">
        <li className="flex items-center gap-3"><Check /> Open to IAIB participants</li>
        <li className="flex items-center gap-3"><Check /><span className="bg-accent/15 text-white px-2 py-[2px]">Campus programme</span></li>
        <li className="flex items-center gap-3"><Check /> Next year&rsquo;s cohort</li>
      </ul>
    </Mock>
  );
}

function Prizes() {
  const rows = [
    { r: "01", t: "Team Neural", p: "Winner", hi: true },
    { r: "02", t: "Byte Builders", p: "Runner-up" },
    { r: "03", t: "Prompt Pilots", p: "2nd runner-up" },
  ];
  return (
    <Mock className="left-7 top-8 right-0 bottom-0">
      <div className="flex items-center gap-2 h-9 px-4 border-b border-line">
        {[0, 1, 2].map((i) => <span key={i} className="w-[7px] h-[7px] bg-white/20" />)}
        <span className="ml-2 font-mono text-[12px] text-fg-dim">finale.leaderboard</span>
        <span className="notch num-n ml-auto mr-1 bg-white text-black font-mono text-[11.5px] px-2 py-[3px]">₹20 L pool</span>
      </div>
      <ol className="list-none m-0 p-3 grid gap-[6px]">
        {rows.map((x) => (
          <li key={x.r} className={`notch num-n flex items-center gap-3 px-3 py-[9px] text-[14px]
                                    ${x.hi ? "bg-accent text-white" : "bg-white/[0.04] text-fg-mid"}`}>
            <span className="font-mono text-[12px] opacity-80">{x.r}</span>
            <span className="flex-1">{x.t}</span>
            <span className="font-body text-[12px] opacity-90">{x.p}</span>
          </li>
        ))}
      </ol>
    </Mock>
  );
}

function Pitch() {
  const bars = [30, 44, 38, 58, 50, 72, 88];
  return (
    <>
      <Mock className="left-7 top-8 right-0 bottom-0 px-6 pt-5">
        <Eyebrow>Demo day · Bengaluru</Eyebrow>
        <p className="m-0 mt-2 font-display font-bold text-white text-[1.2rem]">Our AI study buddy</p>
        <div className="flex items-end gap-[7px] h-[92px] mt-4">
          {bars.map((h, i) => (
            <span key={i} className={i === bars.length - 1 ? "bg-accent" : "bg-white/[0.12]"}
                  style={{ width: 16, height: `${h}%` }} />
          ))}
        </div>
      </Mock>
      <span className="notch num-n absolute right-5 top-5 bg-white text-black text-[13px] px-3 py-[7px] z-[1]">
        Let&rsquo;s talk funding
      </span>
      <div className="absolute right-6 bottom-5 flex z-[1]" aria-hidden>
        {["#f0402f", "#e6e6e6", "#8c8c8c"].map((c, i) => (
          <span key={c} className="notch num-n w-9 h-9 border-2 border-surface -ml-2 grid place-items-center"
                style={{ background: c }}>
            <span className="w-3 h-3 bg-black/70" />
          </span>
        ))}
      </div>
    </>
  );
}

function Letter() {
  return (
    <Mock className="left-7 top-8 right-7 bottom-0 px-6 pt-6">
      <Eyebrow>Letter of recommendation</Eyebrow>
      <p className="m-0 mt-2 text-[14px] text-fg-mid">To whom it may concern,</p>
      <div className="grid gap-[7px] mt-3" aria-hidden>
        {[92, 100, 84, 96, 60].map((w, i) => <span key={i} className="h-[6px] bg-white/[0.09]" style={{ width: `${w}%` }} />)}
      </div>
      <svg viewBox="0 0 120 30" className="w-[110px] mt-4" aria-hidden>
        <path d="M2 20 C 12 4, 18 28, 28 14 S 44 6, 50 18 S 70 26, 78 10 S 100 18, 118 8"
              fill="none" stroke="#e6e6e6" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="absolute right-6 bottom-6 w-14 h-14 grid place-items-center notch num-n bg-accent/15
                       text-accent font-mono text-[10px] text-center leading-tight">IAIB<br />MENTOR</span>
    </Mock>
  );
}

function Certificate() {
  return (
    <Mock className="left-7 top-8 right-7 bottom-0 px-6 pt-6 text-center">
      <div className="absolute inset-3 border border-accent/30 pointer-events-none" aria-hidden />
      <Eyebrow>Certificate of completion</Eyebrow>
      <p className="m-0 mt-3 font-display font-bold text-white text-[1.25rem]">Ignite AI Buildathon</p>
      <p className="m-0 mt-3 text-[12px] text-fg-dim">Awarded to</p>
      <p className="m-0 mt-1 font-display italic text-[1.5rem] text-white">Your Name</p>
      <span className="block w-32 h-px bg-line-2 mx-auto mt-2" />
      <span className="absolute right-5 bottom-5 w-14 h-14 notch cap-n bg-accent grid place-items-center">
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="#fff" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="9" r="5.5" /><path d="M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5" />
        </svg>
      </span>
    </Mock>
  );
}

const ITEMS: { title: string; body: string; visual: ReactNode; wide?: boolean }[] = [
  { title: "₹2 Cr in scholarships", visual: <Scholarship />,
    body: "A ₹2 crore scholarship pool for participants who join the upGrad School of Technology campus programme next year." },
  { title: "₹20 L in prizes", visual: <Prizes />,
    body: "Win from a ₹20 lakh prize pool, awarded to the top teams at the grand finale in Bengaluru." },
  { title: "Pitch to VCs", visual: <Pitch />,
    body: "Finalists present what they built to a panel of venture capital investors." },
  { title: "Letters of recommendation", visual: <Letter />, wide: true,
    body: "Letters of recommendation for standout builders, to strengthen college and internship applications." },
  { title: "Certificates & Hoodies", visual: <Certificate />, wide: true,
    body: "Every student who completes the live sessions gets a certificate and an IAIB hoodie." },
];

export default function Rewards() {
  return (
    <div className="grid grid-cols-6 gap-x-8 gap-y-14 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-y-10">
      {ITEMS.map((it) => (
        <article key={it.title} className={`min-w-0 ${it.wide ? "col-span-3" : "col-span-2"} max-[980px]:col-span-1
                                            ${it.wide ? "max-[980px]:last:col-span-2 max-[640px]:last:col-span-1" : ""}`}>
          <div className="notch relative overflow-hidden h-[270px] max-[640px]:h-[240px]
                          bg-linear-to-br from-[#2a2a2a] via-[#161616] to-[#0a0a0a]">
            {/* a soft sheen across the stage */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden
                 style={{ background: "radial-gradient(ellipse 70% 60% at 15% 0%, rgba(255,255,255,.10), transparent 60%)" }} />
            {it.visual}
          </div>
          <h3 className="mt-6 mb-0 font-display font-bold text-white text-[1.45rem] tracking-[-0.015em]">{it.title}</h3>
          <p className="mt-2 mb-0 text-fg-mid text-[15px] leading-[1.6] max-w-[46ch]">{it.body}</p>
        </article>
      ))}
    </div>
  );
}
