import { STEPS, type Step } from "@/lib/data";

const Cursor = () => (
  <svg className="m-cur" viewBox="0 0 20 22" fill="currentColor" aria-hidden>
    <path d="M2 1.6 L15.5 11.5 L9.6 12.2 L12.6 18.4 L10.1 19.6 L7.1 13.4 L2.6 17.4 Z" />
  </svg>
);

const Tick = () => (
  <span className="m-tick">
    <svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" /></svg>
  </span>
);

function Card({ s }: { s: Step }) {
  return (
    <article id={s.id}
      className="step notch relative flex flex-col min-w-0 overflow-hidden transition-[background] duration-200
                 bg-surface hover:bg-surface-2
                 bg-linear-to-b from-white/[0.028] to-transparent"
      style={{ ["--n" as string]: "14px" }}
    >
      {/* decoration: the heading and paragraph below say everything it gestures
          at, so a screen reader hearing it would get the same fact twice */}
      <div className="relative h-[186px] overflow-hidden
                      after:content-[''] after:absolute after:left-[18px] after:right-[18px]
                      after:bottom-0 after:h-px after:bg-line" aria-hidden>
        <div className="step-art-in">
          <div className="m-bar">{s.bar}</div>
          <div className="m-board">
            {s.rows.map((r) => (
              <div key={r.label} className={`m-r ${r.live ? "live" : ""}`}>
                <span className="m-l">{r.label}</span>
                <span className={`m-s ${r.tone}`}>{r.chip}</span>
              </div>
            ))}
          </div>
          {s.seg && (
            <div className="m-seg">{s.seg.map((f, i) => <i key={i} className={f ? "f" : ""} />)}</div>
          )}
        </div>
        <div className="m-float notch">
          {s.float.tick && <Tick />}
          {s.float.dot && <span className="m-dot" />}
          <b>{s.float.text}</b>
        </div>
        {s.cursor && <Cursor />}
      </div>

      <div className="px-5 pt-5 pb-6 mt-auto">
        <div className="font-body text-[12px] text-fg-dim tracking-[0.1em]">Stage {Number(s.no)}</div>
        <h3 className="font-display text-[1.16rem] font-semibold tracking-[-0.015em] my-[9px] mb-[10px] text-white text-balance">
          {s.title}
        </h3>
        <p className="m-0 text-sm text-fg-mid leading-[1.58]">{s.body}</p>
      </div>
    </article>
  );
}

export default function Steps() {
  return (
    <div className="grid grid-cols-4 gap-[14px] max-[1180px]:grid-cols-2 max-[1180px]:gap-[18px] max-[640px]:grid-cols-1">
      {STEPS.map((s) => <Card key={s.no} s={s} />)}
    </div>
  );
}
