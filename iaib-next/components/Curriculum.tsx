"use client";

import { useState } from "react";
import { MODULES } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");
const TOTAL = MODULES.reduce((s, m) => s + m.n, 0);

/* The curriculum as a macOS window: traffic lights and a title bar, a Finder
   sidebar of module files, and the open file in an editor pane. The pane shows
   the module in plain type — title, summary, numbered sessions — so it reads
   for a student who has never seen code. */

function Lights() {
  return (
    <div className="flex gap-2 flex-none" aria-hidden>
      <span className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.25)]" />
      <span className="w-3 h-3 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.25)]" />
      <span className="w-3 h-3 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.25)]" />
    </div>
  );
}

function FileIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="w-[15px] h-[15px] flex-none" aria-hidden>
      <path d="M3.5 1.5h6l3 3v10h-9z" fill={on ? "#f0402f" : "#3a3a3c"} />
      <path d="M9.5 1.5v3h3" fill="none" stroke={on ? "#ffb3aa" : "#5a5a5e"} />
    </svg>
  );
}

export default function Curriculum() {
  const [i, setI] = useState(0);
  const m = MODULES[i];

  return (
    <div className="notch win-n overflow-hidden bg-[#1c1c1e]">
      {/* title bar */}
      <div className="relative flex items-center h-12 px-4 bg-linear-to-b from-[#2c2c2e] to-[#232325] border-b border-black/60">
        <Lights />
        <p className="absolute inset-x-0 text-center m-0 pointer-events-none font-mono text-[12px] text-fg-mid truncate px-24">
          Curriculum — {m.title}
        </p>
      </div>

      <div className="grid grid-cols-[230px_1fr] min-h-[620px] max-[800px]:min-h-0 max-[800px]:grid-cols-1">
        {/* Finder sidebar */}
        <div className="bg-[#232325]/80 border-r border-black/50 p-3
                        max-[800px]:border-r-0 max-[800px]:border-b max-[800px]:p-2">
          <p className="m-0 px-2 pt-1 pb-2 text-[11px] font-semibold text-fg-dim max-[800px]:hidden">
            Modules
          </p>
          <div role="tablist" aria-label="Curriculum modules"
               className="grid gap-[2px] max-[800px]:flex max-[800px]:overflow-x-auto
                          max-[800px]:[scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {MODULES.map((mod, j) => (
              <button
                key={mod.file} role="tab" aria-selected={j === i} onClick={() => setI(j)}
                className={`flex items-center gap-2 w-full max-[800px]:w-auto max-[800px]:whitespace-nowrap
                            font-mono text-[12.5px] border-0 cursor-pointer notch cap-n px-3 py-[8px] text-left
                            transition-colors duration-100 ${
                  j === i ? "bg-white/[0.12] text-white" : "bg-transparent text-fg-mid hover:bg-white/[0.05] hover:text-fg"
                }`}
              >
                <FileIcon on={j === i} />
                <span className="truncate font-body text-[13.5px]">{mod.title}</span>
                <span className="ml-auto text-[11px] tabular-nums text-fg-dim max-[800px]:hidden">{mod.n}</span>
              </button>
            ))}
          </div>
        </div>

        {/* editor pane */}
        <div className="min-w-0 bg-[#141415] flex flex-col">
          <div className="flex items-center gap-2 h-9 px-4 border-b border-black/50 bg-[#1a1a1b] max-[800px]:hidden">
            <span className="flex items-center gap-2 font-mono text-[12px] text-fg">
              <FileIcon on /> Module {pad(i + 1)}
            </span>
            <span className="ml-auto font-mono text-[11px] text-fg-dim">{m.n} sessions</span>
          </div>

          <div className="flex-1 px-9 py-8 max-[560px]:px-5 max-[560px]:py-6">
            <h3 className="font-display font-bold text-white m-0 text-[1.6rem] max-[560px]:text-[1.3rem] tracking-[-0.015em]">
              {m.title}
            </h3>
            <p className="mt-2 mb-0 text-fg-mid text-[15px] max-w-[56ch]">{m.desc}</p>

            <ol className="list-none m-0 mt-6 p-0 grid gap-2">
              {m.items.map((t, j) => (
                <li key={t} className="flex items-center gap-4 max-[560px]:gap-3 notch cap-n px-4 py-[13px]
                                       bg-white/[0.05] text-[15px] max-[560px]:text-[14px] text-[#e6e6e6]">
                  <span className="grid place-items-center flex-none notch num-n w-7 h-7 bg-accent/15
                                   text-accent font-mono text-[12px] tabular-nums">{j + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
          </div>

          {/* status bar */}
          <div className="flex items-center gap-4 h-7 px-4 border-t border-black/50 bg-[#1a1a1b]
                          font-mono text-[11px] text-fg-dim">
            <span className="ml-auto">{TOTAL} sessions in total</span>
          </div>
        </div>
      </div>
    </div>
  );
}
