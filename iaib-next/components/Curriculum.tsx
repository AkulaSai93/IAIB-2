"use client";

import { useState } from "react";
import { MODULES } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Curriculum() {
  const [i, setI] = useState(0);
  const m = MODULES[i];

  return (
    <div className="notch grid grid-cols-[240px_1fr] max-[800px]:grid-cols-1 overflow-hidden bg-surface">
      <div role="tablist" aria-label="Curriculum modules"
           className="border-r border-line p-2 bg-[#070707]
                      max-[800px]:border-r-0 max-[800px]:border-b max-[800px]:border-line
                      max-[800px]:flex max-[800px]:gap-1 max-[800px]:overflow-x-auto
                      max-[800px]:[scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MODULES.map((mod, j) => (
          <button
            key={mod.file} role="tab" aria-selected={j === i} onClick={() => setI(j)}
            className={`flex items-center justify-between gap-[10px] w-full max-[800px]:w-auto
                        max-[800px]:whitespace-nowrap font-mono text-[12.5px] border-0 cursor-pointer
                        px-[11px] py-[9px] rounded-[7px] text-left transition-[0.14s] ${
              j === i ? "bg-white/[0.075] text-fg" : "bg-transparent text-fg-mid hover:bg-white/[0.04] hover:text-fg"
            }`}
          >
            <span>{mod.file}</span>
            <span className={`text-[11px] tabular-nums max-[800px]:hidden ${j === i ? "text-[#ff5a46]" : "text-fg-dim"}`}>
              {mod.n}
            </span>
          </button>
        ))}
      </div>

      <div className="px-8 py-[30px] max-[800px]:px-5 max-[800px]:py-6 min-w-0">
        <h3 className="font-mono font-medium text-[1.3rem] tracking-[-0.01em] m-0 text-white">{m.title}</h3>
        <p className="mt-2 mb-0 font-mono text-[11.5px] text-fg-dim">
          module {pad(i + 1)} · {m.n} live sessions
        </p>
        <p className="mt-[14px] mb-6 text-fg-mid text-[14.5px] max-w-[54ch]">{m.desc}</p>
        <ol className="list-none m-0 p-0 grid gap-px bg-line border border-line rounded-[9px] overflow-hidden">
          {m.items.map((t, j) => (
            <li key={t} className="bg-[#0b0b0b] px-[15px] py-[11px] text-sm text-[#d4d4d4] flex gap-[14px] items-baseline">
              <span className="font-mono text-[11px] text-fg-dim min-w-[1.4em] tabular-nums">{pad(j + 1)}</span>
              {t}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
