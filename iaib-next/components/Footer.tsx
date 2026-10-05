const COLS = [
  { h: "Programme", items: [
    { label: "Why IAIB", href: "#why" }, { label: "How it works", href: "#how" },
    { label: "Curriculum", href: "#curriculum" }, { label: "Mentors", href: "#mentors" } ] },
  { h: "Participate", items: [
    { label: "Register" }, { label: "For schools" },
    { label: "FAQs", href: "#faq" }, { label: "Grand finale", href: "#finale" } ] },
  { h: "Legal", items: [{ label: "Privacy policy" }, { label: "Terms & conditions" }] },
];

export default function Footer() {
  return (
    <footer className="pt-[54px] pb-10">
      <div className="wrap">
        <div className="grid grid-cols-[1.6fr_repeat(3,1fr)] gap-10 max-[760px]:grid-cols-2 max-[760px]:gap-8">
          <div>
            <a href="#top" className="flex items-center gap-3 font-mono text-sm mb-[14px] whitespace-nowrap">
              <span className="text-fg-mid font-medium">upGrad</span>
              <span className="w-px h-4 bg-line-2" />
              <span className="text-fg">&lt;<b className="text-accent font-normal">/</b>IAIB<b className="text-accent font-normal">&gt;</b></span>
            </a>
            <p className="m-0 text-fg-dim text-[13.5px] max-w-[30ch]">
              Ignite AI Buildathon. India&rsquo;s largest AI talent discovery and development platform for school students.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.h}>
              <h3 className="font-mono text-[11.5px] tracking-[0.11em] uppercase text-fg-dim mt-0 mb-[14px] font-medium">{c.h}</h3>
              <ul className="list-none m-0 p-0 grid gap-[9px]">
                {c.items.map((it) => (
                  <li key={it.label}>
                    {it.href
                      ? <a href={it.href} className="text-[13.5px] text-fg-mid hover:text-fg transition-colors">{it.label}</a>
                      /* not wired up yet: shown, but not pretending to be a link */
                      : <span className="text-[13.5px] text-fg-dim cursor-default">{it.label}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-[14px] justify-between items-center mt-[46px] pt-6 border-t border-line text-[12.5px] text-fg-dim">
          <span>© 2026 Ignite AI Buildathon · An upGrad initiative</span>
          <span>Bengaluru, India</span>
        </div>
      </div>
    </footer>
  );
}
