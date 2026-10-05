/* The moving strip under the hero: the university partner, repeated. The
   track holds two identical halves and slides by exactly one half, so the loop
   is seamless; the second half is hidden from screen readers. */

function Run({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex items-center flex-none" aria-hidden={hidden || undefined}>
      {Array.from({ length: 4 }, (_, i) => (
        <span key={i} className="flex items-center gap-3 px-8 whitespace-nowrap">
          <img src="/assets/ssahe-logo.png" width={722} height={722} alt={hidden ? "" : "SSAHE logo"}
               className="w-9 h-9 max-[560px]:w-8 max-[560px]:h-8 block flex-none" />
          <span className="grid gap-0 leading-[1.2]">
            <span className="font-body text-[11px] tracking-[0.06em] uppercase text-fg-dim">University Partner</span>
            <span className="font-body text-[14.5px] max-[560px]:text-[13.5px] text-white tracking-[-0.005em]">
              Sri Siddhartha Academy of Higher Education, Tumkur
            </span>
          </span>
          <span className="w-[5px] h-[5px] bg-accent ml-6" aria-hidden />
        </span>
      ))}
    </div>
  );
}

export default function PartnerStrip({ className = "" }: { className?: string }) {
  return (
    <section aria-label="University partner" className={`pstrip ${className} relative overflow-hidden border-b border-line bg-surface py-[10px]`}>
      <div className="ptrack flex w-max">
        <Run /><Run hidden />
      </div>
    </section>
  );
}
