"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * Options
 * ------------------------------------------------------------------ */

const DESIGNATIONS = [
  "Principal",
  "Vice Principal",
  "Teacher",
  "Computer Science / IT Teacher",
  "School Coordinator",
  "Career / College Counsellor",
  "Administrator",
  "Other",
];

const BOARDS = ["CBSE", "ICSE", "State Board", "IB", "Cambridge", "NIOS", "Other"];

const EXPECTED = ["1–10", "11–25", "26–50", "51–100", "100+"];

/* TODO: point at the real domain once it exists. */
const JOIN_BASE = "https://ai.buildathon.com/join";

/* ------------------------------------------------------------------ *
 * Lookups
 * ------------------------------------------------------------------ */

type Location = { city: string; state: string; pin: string };
type SchoolHit = { id: string; name: string; address: string };

async function lookupPincode(pin: string): Promise<Location> {
  const reply = await fetch(`/api/pincode?pin=${encodeURIComponent(pin)}`);
  const data = await reply.json();
  if (!reply.ok || !data.ok) throw new Error(data.error ?? "Lookup failed.");
  return { city: data.city, state: data.state, pin: data.pin };
}

async function searchSchools(pin: string, q: string) {
  const reply = await fetch(
    `/api/schools?pin=${encodeURIComponent(pin)}&q=${encodeURIComponent(q)}`,
  );
  const data = await reply.json();
  return {
    results: (data.results ?? []) as SchoolHit[],
    configured: data.configured !== false,
  };
}

/**
 * TODO: these three are stubs. Wire them to the real backend.
 *
 * `verifyOtp` only checks that six digits were typed — it does NOT prove
 * the person owns the WhatsApp number.
 */
async function requestOtp(phone: string) {
  await new Promise((r) => setTimeout(r, 400));
  return { sent: true, phone };
}

async function verifyOtp(code: string) {
  await new Promise((r) => setTimeout(r, 500));
  return /^\d{6}$/.test(code);
}

async function submitSchool(payload: Record<string, string>) {
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true, payload };
}

/* The join code is generated here, so it is not reserved against anything
 * yet. The backend should mint this and hand it back from submitSchool. */
function joinCode(school: string) {
  const slug = school
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
  const salt = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${slug || "school"}-${salt}`;
}

/* ------------------------------------------------------------------ *
 * Field furniture
 * ------------------------------------------------------------------ */

const FIELD =
  "w-full border border-solid border-white/15 bg-surface-2 px-4 py-3 font-display text-[16px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-brand";

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <h4 className="font-code text-[11px] tracking-[0.14em] text-ink/40 uppercase">
        {title}
      </h4>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string | null;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="font-display text-[15px] font-medium text-ink"
      >
        {label}
      </label>
      {hint && <p className="font-display text-[13px] text-ink/55">{hint}</p>}
      {children}
      {error && (
        <p role="alert" className="font-display text-[13px] text-brand">
          {error}
        </p>
      )}
    </div>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2.5 8.4 6 12 13.5 3.4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Form
 * ------------------------------------------------------------------ */

type Errors = Record<string, string | null>;

export default function SchoolForm({
  onClose,
  onRegistered,
}: {
  onClose: () => void;
  /** Lets the modal drop its footer once registration succeeds. */
  onRegistered?: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpBusy, setOtpBusy] = useState(false);

  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [designationOther, setDesignationOther] = useState("");

  const [pin, setPin] = useState("");
  const [location, setLocation] = useState<Location | null>(null);
  const [pinBusy, setPinBusy] = useState(false);

  const [school, setSchool] = useState("");
  const [hits, setHits] = useState<SchoolHit[]>([]);
  const [showHits, setShowHits] = useState(false);
  const [searchOn, setSearchOn] = useState(true);
  const [manualSchool, setManualSchool] = useState(false);

  const [board, setBoard] = useState("");
  const [expected, setExpected] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setErr = (k: string, v: string | null) =>
    setErrors((e) => ({ ...e, [k]: v }));

  /* ---- PIN resolves to city + state as soon as it is six digits ---- */
  useEffect(() => {
    const digits = pin.replace(/\D/g, "");
    if (digits.length !== 6) {
      setLocation(null);
      return;
    }
    let cancelled = false;
    setPinBusy(true);
    setErr("pin", null);
    lookupPincode(digits)
      .then((loc) => {
        if (!cancelled) setLocation(loc);
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setLocation(null);
          setErr("pin", e.message);
        }
      })
      .finally(() => {
        if (!cancelled) setPinBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pin]);

  /* ---- school type-ahead, scoped to that PIN ---- */
  useEffect(() => {
    if (manualSchool || !location || school.trim().length < 2) {
      setHits([]);
      return;
    }
    let cancelled = false;
    const t = setTimeout(() => {
      void searchSchools(location.pin, school.trim()).then((r) => {
        if (cancelled) return;
        setHits(r.results);
        setSearchOn(r.configured);
        setShowHits(r.results.length > 0);
      });
    }, 280);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [school, location, manualSchool]);

  /* ---- OTP ---- */
  const sendCode = async () => {
    const digits = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits)) {
      return setErr("phone", "Enter a 10-digit WhatsApp number.");
    }
    setErr("phone", null);
    setOtpBusy(true);
    await requestOtp(digits);
    setOtpBusy(false);
    setOtpSent(true);
    setTimeout(() => otpRefs.current[0]?.focus(), 40);
  };

  const setOtpAt = (i: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    const next = [...otp];
    if (!digits) {
      next[i] = "";
      setOtp(next);
      return;
    }
    digits.split("").forEach((d, k) => {
      if (i + k < 6) next[i + k] = d;
    });
    setOtp(next);
    otpRefs.current[Math.min(i + digits.length, 5)]?.focus();
  };

  const confirmCode = async () => {
    const code = otp.join("");
    if (code.length < 6) return setErr("otp", "Enter all 6 digits.");
    setOtpBusy(true);
    const ok = await verifyOtp(code);
    setOtpBusy(false);
    if (!ok) return setErr("otp", "That code isn't right. Try again.");
    setErr("otp", null);
    setOtpVerified(true);
  };

  /* ---- submit ---- */
  const submit = async () => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Please enter your full name.";
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "")))
      next.phone = "Enter a 10-digit WhatsApp number.";
    else if (!otpVerified) next.phone = "Please verify your number first.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      next.email = "That email doesn't look right.";
    if (!designation) next.designation = "Please select your designation.";
    if (designation === "Other" && designationOther.trim().length < 2)
      next.designationOther = "Please tell us your designation.";
    if (!location) next.pin = "Enter a valid 6-digit PIN code.";
    if (school.trim().length < 2) next.school = "Please enter your school's name.";
    if (!board) next.board = "Please select your school board.";

    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    setBusy(true);
    const code = joinCode(school);
    await submitSchool({
      name: name.trim(),
      phone: phone.replace(/\D/g, ""),
      email: email.trim(),
      designation:
        designation === "Other" ? designationOther.trim() : designation,
      pin: location!.pin,
      city: location!.city,
      state: location!.state,
      school: school.trim(),
      board,
      expected,
      joinCode: code,
    });
    setBusy(false);
    setLink(`${JOIN_BASE}/${code}`);
    onRegistered?.();
  };

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  /* ---- success ---- */
  if (link) {
    return (
      <div className="step-in flex flex-col gap-6 py-2">
        <div>
          <h3 className="font-ui text-[26px] leading-[1.15] font-bold tracking-[-0.8px] text-ink sm:text-[32px]">
            Your school is registered! &#127881;
          </h3>
          <p className="mt-2 font-display text-[16px] leading-[26px] text-ink/70">
            Thanks, {name.trim()}. We&rsquo;ve registered {school.trim()} for the
            Ignite AI Buildathon.
          </p>
        </div>

        <div
          className="notch cap-n flex flex-col gap-3 bg-white/[0.04] p-5"
        >
          <p className="font-ui text-[18px] font-bold text-ink">
            Get your students started
          </p>
          <p className="font-display text-[15px] leading-[24px] text-ink/70">
            Share your unique link with students of Classes 9&ndash;12 so they
            can register directly under your school.
          </p>

          <p className="mt-1 font-display text-[13px] font-medium text-ink/55">
            Your school&rsquo;s registration link
          </p>
          <div className="flex items-stretch gap-2">
            <code className="min-w-0 flex-1 truncate border border-solid border-white/15 bg-surface-2 px-3 py-2.5 font-code text-[13px] text-ink">
              {link}
            </code>
            <button
              type="button"
              onClick={() => void copy()}
              className="notch cap-n shrink-0 bg-white/10 px-4 py-2.5 font-ui text-[14px] text-white transition-colors hover:bg-brand"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="notch cap-n self-start bg-brand px-7 py-3 font-ui text-[16px] text-white transition-colors hover:bg-white hover:text-black"
        >
          Done
        </button>
      </div>
    );
  }

  /* ---- form ---- */
  return (
    <form
      className="step-in flex flex-col gap-8 py-2"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <div>
        <h3 className="font-ui text-[26px] leading-[1.15] font-bold tracking-[-0.8px] text-ink sm:text-[30px]">
          Register your school
        </h3>
        <p className="mt-2 font-display text-[15px] text-ink/60">
          A few details and your students can start signing up.
        </p>
      </div>

      <Group title="Your details">
        <Field label="Full Name" hint="Enter your full name." htmlFor="sf-name" error={errors.name}>
          <input
            id="sf-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            className={FIELD}
          />
        </Field>

        <Field
          label="WhatsApp Number"
          hint="We'll send important Buildathon updates to this number."
          htmlFor="sf-phone"
          error={errors.phone}
        >
          <div className="flex items-stretch gap-2">
            <span className="grid shrink-0 place-items-center border border-solid border-white/15 bg-white/[0.03] px-3 font-display text-[16px] text-ink/60">
              +91
            </span>
            <input
              id="sf-phone"
              value={phone}
              inputMode="numeric"
              disabled={otpVerified}
              onChange={(e) => {
                setPhone(e.target.value);
                setOtpSent(false);
                setOtpVerified(false);
              }}
              placeholder="98765 43210"
              autoComplete="tel-national"
              className={`${FIELD} disabled:bg-white/[0.03] disabled:text-ink/60`}
            />
            {otpVerified ? (
              <span className="flex shrink-0 items-center gap-1.5 bg-[#4ade80]/10 px-3 font-display text-[14px] font-medium text-[#4ade80]">
                <Check />
                Verified
              </span>
            ) : (
              <button
                type="button"
                onClick={() => void sendCode()}
                disabled={otpBusy}
                className="notch cap-n shrink-0 bg-white/10 px-4 font-ui text-[14px] text-white transition-colors hover:bg-brand disabled:opacity-60"
              >
                {otpSent ? "Resend" : "Send code"}
              </button>
            )}
          </div>
        </Field>

        {otpSent && !otpVerified && (
          <div className="flex flex-col gap-3 bg-white/[0.03] p-4">
            <div>
              <p className="font-display text-[15px] font-medium text-ink">
                Verify your number
              </p>
              <p className="mt-1 font-display text-[13px] text-ink/55">
                Enter the 6-digit code sent to your WhatsApp.
              </p>
            </div>

            <div className="flex gap-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  value={d}
                  inputMode="numeric"
                  maxLength={6}
                  aria-label={`Digit ${i + 1}`}
                  onChange={(e) => setOtpAt(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[i] && i > 0)
                      otpRefs.current[i - 1]?.focus();
                  }}
                  className="size-11 border border-solid border-white/15 bg-surface-2 text-center font-code text-[18px] text-ink outline-none focus:border-brand"
                />
              ))}
              <button
                type="button"
                onClick={() => void confirmCode()}
                disabled={otpBusy}
                className="notch cap-n ml-1 bg-brand px-4 font-ui text-[14px] text-white transition-colors hover:bg-white hover:text-black disabled:opacity-60"
              >
                {otpBusy ? "…" : "Verify"}
              </button>
            </div>

            {errors.otp && (
              <p role="alert" className="font-display text-[13px] text-brand">
                {errors.otp}
              </p>
            )}

            <p className="font-display text-[12px] leading-[18px] text-ink/50">
              By verifying your number, you agree to receive marketing and
              promotional messages from us on WhatsApp.
            </p>
          </div>
        )}

        <Field
          label="Email Address"
          hint="For official communications about the event."
          htmlFor="sf-email"
          error={errors.email}
        >
          <input
            id="sf-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.edu"
            autoComplete="email"
            className={FIELD}
          />
        </Field>

        <Field
          label="Designation"
          hint="Select your current role."
          htmlFor="sf-designation"
          error={errors.designation}
        >
          <select
            id="sf-designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className={FIELD}
          >
            <option value="">Select your designation</option>
            {DESIGNATIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>

        {designation === "Other" && (
          <Field
            label="Your designation"
            htmlFor="sf-designation-other"
            error={errors.designationOther}
          >
            <input
              id="sf-designation-other"
              value={designationOther}
              onChange={(e) => setDesignationOther(e.target.value)}
              placeholder="Type your designation"
              className={FIELD}
            />
          </Field>
        )}
      </Group>

      <Group title="School location">
        <Field
          label="School PIN Code"
          hint="Enter your school's PIN code."
          htmlFor="sf-pin"
          error={errors.pin}
        >
          <input
            id="sf-pin"
            value={pin}
            inputMode="numeric"
            maxLength={6}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="560001"
            autoComplete="postal-code"
            className={`${FIELD} max-w-[180px]`}
          />
        </Field>

        {pinBusy && (
          <p className="font-display text-[14px] text-ink/50">Looking that up…</p>
        )}

        {/* system-generated, not editable */}
        {location && (
          <div className="flex flex-col gap-1 border border-solid border-white/12 bg-[#4ade80]/10 px-4 py-3">
            <p className="font-display text-[12px] tracking-[0.06em] text-ink/50 uppercase">
              School Location
            </p>
            <p className="font-display text-[16px] font-medium text-ink">
              {location.city}, {location.state}
            </p>
            <p className="font-code text-[13px] text-ink/60">{location.pin}</p>
          </div>
        )}
      </Group>

      <Group title="School identification">
        <Field
          label="School Name"
          hint="Start typing to find your school."
          htmlFor="sf-school"
          error={errors.school}
        >
          <div className="relative">
            <input
              id="sf-school"
              value={school}
              disabled={!location && !manualSchool}
              onChange={(e) => setSchool(e.target.value)}
              onFocus={() => setShowHits(hits.length > 0)}
              onBlur={() => setTimeout(() => setShowHits(false), 140)}
              placeholder={
                manualSchool
                  ? "Type your school's full name"
                  : location
                    ? "Start typing…"
                    : "Enter your PIN code first"
              }
              autoComplete="off"
              className={`${FIELD} disabled:bg-white/[0.03] disabled:text-ink/40`}
            />

            {showHits && !manualSchool && hits.length > 0 && (
              <ul className="absolute top-[calc(100%+4px)] right-0 left-0 z-10 max-h-[220px] overflow-y-auto border border-solid border-white/15 bg-surface-2 py-1 shadow-lg">
                {hits.map((h) => (
                  <li key={h.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSchool(h.name);
                        setShowHits(false);
                      }}
                      className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors hover:bg-white/[0.04]"
                    >
                      <span className="font-display text-[15px] text-ink">
                        {h.name}
                      </span>
                      {h.address && (
                        <span className="font-display text-[12px] text-ink/50">
                          {h.address}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Field>

        {!manualSchool && (
          <p className="font-display text-[13px] text-ink/55">
            Can&rsquo;t find your school?{" "}
            <button
              type="button"
              onClick={() => {
                setManualSchool(true);
                setShowHits(false);
              }}
              className="font-medium text-brand underline underline-offset-2 hover:text-ink"
            >
              Enter your school name manually
            </button>
          </p>
        )}

        {!manualSchool && !searchOn && (
          <p className="font-display text-[13px] text-ink/45">
            School search is unavailable — enter the name manually.
          </p>
        )}
      </Group>

      <Group title="Board &amp; size">
        <Field
          label="School Board"
          hint="Select your school board."
          htmlFor="sf-board"
          error={errors.board}
        >
          <select
            id="sf-board"
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className={FIELD}
          >
            <option value="">Select your school board</option>
            {BOARDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="How many students do you expect to participate?"
          hint="Optional."
          htmlFor="sf-expected"
        >
          <select
            id="sf-expected"
            value={expected}
            onChange={(e) => setExpected(e.target.value)}
            className={FIELD}
          >
            <option value="">Select a range</option>
            {EXPECTED.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </Field>
      </Group>

      <button
        type="submit"
        disabled={busy}
        className="notch cap-n self-start bg-brand px-7 py-3 font-ui text-[16px] text-white transition-colors hover:bg-white hover:text-black disabled:opacity-60"
      >
        {busy ? "Registering…" : "Register school"}
      </button>
    </form>
  );
}
