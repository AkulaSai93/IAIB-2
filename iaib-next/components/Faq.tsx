"use client";

import { useState } from "react";
import { FAQS } from "@/lib/data";
import { btnClass } from "./ui";

/* the first eight cover what most people ask; the rest wait behind View more */
const SHOWN = 8;

export default function Faq() {
  const [all, setAll] = useState(false);
  const list = all ? FAQS : FAQS.slice(0, SHOWN);
  return (
    <>
    <div className="border-t border-line">
      {list.map(([q, a], i) => (
        <details key={q} open={i === 0} className="group border-b border-line">
          <summary
            className="list-none cursor-pointer pr-10 py-5 relative text-base text-[#e6e6e6]
                       hover:text-white transition-colors
                       [&::-webkit-details-marker]:hidden [&::marker]:content-['']
                       after:content-[''] after:absolute after:right-[6px] after:top-1/2
                       after:w-[9px] after:h-[9px] after:-mt-[6px]
                       after:border-r-[1.4px] after:border-b-[1.4px] after:border-fg-dim
                       after:rotate-45 after:transition-transform
                       group-open:after:-rotate-[135deg] group-open:after:-mt-[2px]"
          >
            {q}
          </summary>
          <p className="mt-0 mb-[22px] text-fg-mid text-[15px] max-w-[68ch]">{a}</p>
        </details>
      ))}
    </div>
    {FAQS.length > SHOWN && (
      <div className="mt-9 flex justify-center">
        <button type="button" aria-expanded={all} onClick={() => setAll((v) => !v)}
                className={btnClass({ lg: true })}>
          {all ? "View less" : `View more (${FAQS.length - SHOWN})`}
        </button>
      </div>
    )}
    </>
  );
}
