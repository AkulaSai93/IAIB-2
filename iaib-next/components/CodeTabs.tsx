"use client";

import { useState } from "react";
import { SNIPPETS, TABS, type SnippetKey } from "@/lib/snippets";

export default function CodeTabs() {
  const [key, setKey] = useState<SnippetKey>("py");
  const [label, setLabel] = useState("Copy");
  const snip = SNIPPETS[key];

  async function copy() {
    try {
      await navigator.clipboard.writeText(snip.raw);
      setLabel("Copied");
    } catch {
      // clipboard is blocked on insecure origins and in some embedded views
      setLabel("Press ⌘C");
    }
    setTimeout(() => setLabel("Copy"), 1800);
  }

  return (
    <div className="notch overflow-hidden text-code-fg bg-linear-to-b from-[#101010] to-[#0a0a0a]">
      <div className="flex items-center gap-2 border-b border-line pr-2">
        <div className="flex gap-[2px] p-2 overflow-x-auto flex-1 min-w-0 [scrollbar-width:none]
                        [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Code examples">
          {TABS.map((t) => (
            <button
              key={t.key} role="tab" aria-selected={t.key === key} onClick={() => setKey(t.key)}
              className={`font-mono text-xs border-0 cursor-pointer px-[11px] py-[6px] rounded-md
                          whitespace-nowrap transition-[0.14s] ${
                t.key === key ? "text-code-fg bg-white/10" : "text-code-fg-mid bg-transparent hover:text-[#c9c9c9] hover:bg-white/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button onClick={copy}
          className="flex-none font-mono text-[11px] text-code-fg-mid bg-white/[0.06] border border-line
                     rounded-md px-[9px] py-[5px] cursor-pointer transition-[0.14s] hover:text-code-fg hover:bg-white/[0.12]">
          {label}
        </button>
      </div>
      <pre>
        <code
          /* the snippets are fixed, hand-tokenised strings in this repo — no
             user input ever reaches this */
          dangerouslySetInnerHTML={{ __html: snip.html.map((l) => `<span class="l">${l}</span>`).join("") }}
        />
      </pre>
    </div>
  );
}
