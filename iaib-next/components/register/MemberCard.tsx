"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

const CARD_BG = "/assets/card/card-bg.png";
const CARD_LOGO = "/assets/card/card-logo.png";

/* TODO: point at the real domain once it exists. */
const REFERRAL_BASE = "https://iaib.vercel.app/";

/* The code is generated here, so it is not reserved against anything yet —
   the backend should mint it and hand it back on submit. */
function makeCode(name: string) {
  const seed = name.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3) || "IAIB";
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return (seed + rand).slice(0, 6);
}

/* Three-digit member number, as in the design (IAIB123). */
function badgeId() {
  return `IAIB${String(Math.floor(100 + Math.random() * 900))}`;
}

const SOCIALS = [
  { label: "WhatsApp", icon: "/assets/card/whatsapp.svg" },
  { label: "LinkedIn", icon: "/assets/card/linkedin.svg" },
  { label: "Facebook", icon: "/assets/card/facebook.svg" },
  { label: "Instagram", icon: "/assets/card/instagram.svg" },
];

/**
 * Figma 274:22135 — the member card the student gets after registering,
 * with the referral link and the XP they earn for sharing it.
 */
export default function MemberCard({
  name,
  onClose,
}: {
  name: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [code] = useState(() => makeCode(name));
  const [badge] = useState(() => badgeId());
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const url = `${REFERRAL_BASE}?ref=${code}`;
  const shareText = `I'm in for the IAIB Ignite AI Buildathon! Join me:`;
  const first = name.trim().split(/\s+/)[0] || "Builder";

  /* The card on screen is DOM, so the download is painted separately. */
  const download = useCallback(async () => {
    const W = 290;
    const H = 409;
    const S = 3;
    const canvas = document.createElement("canvas");
    canvas.width = W * S;
    canvas.height = H * S;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(S, S);

    const bg = new window.Image();
    bg.src = CARD_BG;
    try {
      await bg.decode();
      /* cover-fit the artwork into the card */
      const r = Math.max(W / bg.naturalWidth, H / bg.naturalHeight);
      const w = bg.naturalWidth * r;
      const h = bg.naturalHeight * r;
      ctx.drawImage(bg, (W - w) / 2, (H - h) / 2, w, h);
    } catch {
      ctx.fillStyle = "#0b0b0d";
      ctx.fillRect(0, 0, W, H);
    }

    ctx.fillStyle = "#fff";
    ctx.font = "300 9px system-ui, sans-serif";
    ctx.fillText("BUILDATHON MEMBER", 14.8, 36);

    ctx.font = "600 32px system-ui, sans-serif";
    ctx.fillText(first.toUpperCase(), 14.5, 322);

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "11.8px system-ui, sans-serif";
    ctx.fillText("You\u2019re officially in.", 14.5, 340);
    ctx.fillText("uGSOT Ignite AI Buildathon", 14.5, 355);

    const bw = ctx.measureText(badge).width;
    ctx.fillStyle = "#e7000b";
    ctx.fillRect(200, 300, bw + 16, 24);
    ctx.fillStyle = "#fff";
    ctx.font = "15px system-ui, sans-serif";
    ctx.fillText(badge, 208, 317);

    ctx.font = "300 9px system-ui, sans-serif";
    ctx.fillText("LEARN \u00b7 BUILD \u00b7 WIN", 190, 394);

    await new Promise<void>((resolve) =>
      canvas.toBlob((blob) => {
        if (blob) {
          const href = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = href;
          a.download = `iaib-member-${code}.png`;
          a.click();
          URL.revokeObjectURL(href);
        }
        resolve();
      }, "image/png"),
    );
  }, [first, badge, code]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setNote("Couldn't copy — select the link and copy it manually.");
    }
  }, [url]);

  const share = useCallback(
    (label: string) => {
      const u = encodeURIComponent(url);
      const t = encodeURIComponent(`${shareText} ${url}`);
      const targets: Record<string, string> = {
        WhatsApp: `https://wa.me/?text=${t}`,
        LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
        Facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      };
      if (targets[label]) {
        window.open(targets[label], "_blank", "noopener,noreferrer");
        return;
      }
      /* Instagram has no web share target. */
      void navigator
        .share?.({ text: `${shareText} ${url}` })
        .catch(() => setNote("Instagram has no web share link — copy it instead."));
      if (!navigator.share) {
        setNote("Instagram has no web share link — copy the link instead.");
      }
    },
    [url, shareText],
  );

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/brand.png" alt="upGrad School of Technology x IAIB" width={692} height={96}
           className="h-[26px] w-auto" />

      {/* the card itself */}
      <div className="relative aspect-[290/409] w-full max-w-[290px] overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CARD_BG} alt="" aria-hidden className="absolute inset-0 size-full object-cover" />

        <div className="absolute top-[3.2%] left-[5%] flex w-[33%] flex-col gap-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CARD_LOGO} alt="" aria-hidden className="h-auto w-[70px]" />
          <p className="font-display text-[9px] font-extralight text-white">
            BUILDATHON MEMBER
          </p>
        </div>

        <div className="absolute bottom-[12%] left-[5%] flex items-end">
          <div className="flex flex-col">
            <p className="font-display text-[32px] leading-none font-semibold text-white uppercase">
              {first}
            </p>
            <p className="mt-1 font-display text-[11.8px] leading-[1.25] text-white/70">
              You&rsquo;re officially in.
              <br />
              uGSOT Ignite AI Buildathon
            </p>
          </div>
          <span
            className="notch cap-n ml-2 bg-brand px-2 font-ui text-[15px] leading-[24px] text-white"
            style={{ borderStyle: "solid", borderColor: "#fff", borderWidth: "0.5px 2px 2px 0.5px" }}
          >
            {badge}
          </span>
        </div>

        <div className="absolute right-[5%] bottom-[4%] flex items-center gap-1.5 font-display text-[9px] font-extralight text-white">
          <span>LEARN</span>
          <i className="size-[2.7px] rounded-full bg-surface-2" />
          <span>BUILD</span>
          <i className="size-[2.7px] rounded-full bg-surface-2" />
          <span>WIN</span>
        </div>
      </div>

      {/* what sharing earns */}
      <div
        className="notch cap-n flex w-full max-w-[380px] items-center gap-2 bg-surface-2 px-3.5 py-2.5"
      >
        <div className="flex flex-1 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/card/gift.svg" alt="" aria-hidden width={25} height={25} className="shrink-0" />
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="font-ui text-[12.6px] text-ink">
              Earn <span className="font-bold text-brand">10</span>
              <span className="text-[10px] font-bold text-brand"> XP</span>
            </p>
            <p className="font-ui text-[10.8px] leading-[1.25] text-ink">
              When a friend registers through your link
            </p>
          </div>
        </div>

        <span aria-hidden className="h-[45px] w-px shrink-0 bg-white/15" />

        <div className="flex flex-1 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/card/users.svg" alt="" aria-hidden width={25} height={25} className="shrink-0" />
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="font-ui text-[10.8px] leading-[1.25] text-ink">Your friend gets</p>
            <p className="font-ui text-[14.4px] font-bold text-brand">
              5<span className="text-[10px]"> XP</span>
            </p>
          </div>
        </div>
      </div>

      {/* share */}
      <div className="flex w-full max-w-[468px] flex-col items-center gap-1">
        <p className="font-ui text-[17px] font-bold text-ink">Spread the word</p>

        <div className="mt-1 flex w-full items-center gap-2.5">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white/[0.05] py-2 pr-2 pl-4">
            <span className="min-w-0 flex-1 truncate font-display text-[12.6px] text-ink/80">
              {url}
            </span>
            <button
              type="button"
              onClick={() => void copy()}
              aria-label="Copy referral link"
              className="grid size-[34px] shrink-0 place-items-center rounded-full transition-colors hover:bg-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/card/copy.svg" alt="" aria-hidden width={18} height={18} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => void download()}
            aria-label="Download your member card"
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-brand transition-colors hover:bg-white hover:text-black"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/card/download.svg" alt="" aria-hidden width={19} height={19} />
          </button>
        </div>

        {copied && (
          <p className="mt-1 font-display text-[13px] text-brand">Link copied</p>
        )}

        <ul className="mt-2.5 flex items-center gap-4">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <button
                type="button"
                onClick={() => share(s.label)}
                aria-label={`Share on ${s.label}`}
                className="block size-10 transition-transform hover:scale-105"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.icon} alt="" aria-hidden className="size-full" />
              </button>
            </li>
          ))}
        </ul>

        {note && (
          <p className="mt-2 text-center font-display text-[13px] text-ink/60">{note}</p>
        )}

        <button
          type="button"
          onClick={() => {
            // a new registration starts a fresh LMS profile seeded from it
            try { localStorage.removeItem("iaib.lms.v1"); localStorage.setItem("iaib.lms.access", "1"); sessionStorage.removeItem("iaib.lms.profileDismissed"); } catch {}
            onClose();
            router.push("/lms/overview");
          }}
          className="notch cap-n mt-4 flex w-full items-center justify-center bg-white px-6 py-3 font-mono text-[15px] text-black transition-colors hover:bg-brand hover:text-white"
        >
          Enter your LMS &rarr;
        </button>
      </div>
    </div>
  );
}
