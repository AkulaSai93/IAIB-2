/* Social links: fill in each href when the accounts are confirmed. An empty
   href renders the icon without a link rather than a link to nowhere. */
const SOCIALS: { label: string; href: string; path: string }[] = [
  { label: "LinkedIn", href: "",
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.98c0-1.19-.02-2.72-1.66-2.72-1.66 0-1.92 1.3-1.92 2.63V21h-4z" },
  { label: "Facebook", href: "",
    path: "M14 8.5V6.6c0-.85.2-1.3 1.5-1.3H17V2.2C16.3 2.1 15.3 2 14.4 2 11.9 2 10.4 3.5 10.4 6.2v2.3H8V12h2.4v10H14V12h2.7l.4-3.5z" },
  { label: "Instagram", href: "",
    path: "M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zM17.1 5.8a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 3.6c2.7 0 3 0 4.1.06 2.7.12 4 1.4 4.1 4.1.05 1.06.06 1.38.06 4.1s0 3-.06 4.1c-.12 2.7-1.4 4-4.1 4.1-1.07.05-1.38.06-4.1.06s-3.04 0-4.1-.06c-2.74-.12-4-1.4-4.1-4.1C3.6 15 3.6 14.7 3.6 12s0-3 .06-4.1c.12-2.7 1.4-4 4.1-4.1C8.96 3.6 9.3 3.6 12 3.6zM12 2c-2.7 0-3.1 0-4.2.06-3.7.17-5.7 2.2-5.9 5.9C2 9 2 9.3 2 12s0 3.1.06 4.2c.17 3.7 2.2 5.7 5.9 5.9C9 22 9.3 22 12 22s3.1 0 4.2-.06c3.7-.17 5.7-2.2 5.9-5.9.05-1.1.06-1.4.06-4.1s0-3.1-.06-4.2c-.17-3.7-2.2-5.7-5.9-5.9C15.1 2 14.7 2 12 2z" },
  { label: "YouTube", href: "",
    path: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="wrap relative grid grid-cols-[1fr_auto] gap-12 items-center pt-[72px] pb-10
                      max-[980px]:grid-cols-1 max-[980px]:gap-8 max-[560px]:pt-14">
        {/* on narrow screens the column dissolves so the illustration can sit
            between the heading and the links */}
        <div className="flex flex-col h-full max-[980px]:contents">
          <h2 className="font-display font-bold text-white m-0 uppercase leading-[0.98] tracking-[-0.03em]
                         text-[clamp(2.6rem,6vw,4.6rem)] max-[980px]:order-1">
            Ignite AI<br /><span className="text-accent">Buildathon</span>
          </h2>

          <div className="flex items-center gap-4 mt-9 max-[980px]:mt-0 max-[980px]:order-3 max-[400px]:flex-wrap max-[400px]:gap-3">
            <span className="text-[15px] text-fg-mid">Follow us on</span>
            <div className="flex gap-[10px]">
              {SOCIALS.map((s) => {
                const icon = (
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                );
                const cls = "notch cap-n grid place-items-center w-10 h-10 bg-white/[0.08] text-fg " +
                            "hover:bg-white hover:text-black transition-colors";
                return s.href
                  ? <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className={cls}>{icon}</a>
                  : <span key={s.label} aria-label={s.label} title={s.label} className={cls}>{icon}</span>;
              })}
            </div>
          </div>

          <div className="mt-auto pt-16 max-[980px]:pt-0 max-[980px]:order-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-fg-mid">
            <span className="cursor-default">Privacy Policy</span>
            <span className="w-px h-4 bg-line-2" />
            <span className="cursor-default">Terms &amp; Conditions</span>
          </div>
        </div>

        {/* the illustration has a transparent ground and black line work, which
            would vanish on black; stacked white drop-shadows give it a sticker
            outline instead */}
        <img src="/assets/footer-buildathon.png" width={635} height={349} alt=""
             className="footer-art w-[min(560px,100%)] h-auto block max-[980px]:justify-self-center max-[980px]:order-2" />
      </div>

      <div className="wrap relative">
        <div className="flex flex-wrap gap-3 justify-between items-center py-6 border-t border-line text-[12.5px] text-fg-dim">
          <span>© 2026 Ignite AI Buildathon · An upGrad initiative</span>
        </div>
      </div>
    </footer>
  );
}
