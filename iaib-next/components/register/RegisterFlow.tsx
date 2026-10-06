"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { usePathname } from "next/navigation";
import RegistrationSuccess from "./RegistrationSuccess";
import SchoolForm from "./SchoolForm";
import { loadStudent, saveStudent } from "@/lib/student-store";

/* ------------------------------------------------------------------ *
 * Steps
 * ------------------------------------------------------------------ */

export type Path = "individual" | "school";

type Step =
  | {
      id: string;
      kind: "text" | "email" | "tel" | "number";
      question: string;
      hint?: string;
      placeholder: string;
      validate: (v: string) => string | null;
    }
  | { id: string; kind: "choice"; question: string; hint?: string; options: string[] }
  | { id: "pincode"; kind: "pincode"; question: string; hint?: string; placeholder: string }
  | { id: "school"; kind: "school"; question: string; hint?: string; placeholder: string }
  | { id: "otp"; kind: "otp"; question: string; hint?: string };

const required = (label: string) => (v: string) =>
  v.trim().length < 2 ? `Please enter ${label}.` : null;

const isEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : "That email doesn't look right.";

const isPhone = (v: string) =>
  /^[6-9]\d{9}$/.test(v.replace(/\D/g, "")) ? null : "Enter a 10-digit mobile number.";

const isCount = (v: string) =>
  Number(v) >= 1 && Number(v) <= 5000 ? null : "Enter a number between 1 and 5000.";

const OTP_STEP: Step = {
  id: "otp",
  kind: "otp",
  question: "Verify your number",
  hint: "We've sent a 6-digit code to your phone.",
};

const INDIVIDUAL: Step[] = [
  {
    id: "name",
    kind: "text",
    question: "What's your name?",
    placeholder: "As you'd like it to appear on your certificate",
    validate: required("your name"),
  },
  {
    id: "phone",
    kind: "tel",
    question: "And your WhatsApp number?",
    hint: "We'll send important updates and information to this number.",
    placeholder: "98765 43210",
    validate: isPhone,
  },
  OTP_STEP,
  {
    id: "grade",
    kind: "choice",
    question: "Which class are you in?",
    options: ["Class 9", "Class 10", "Class 11", "Class 12"],
  },
  {
    id: "pincode",
    kind: "pincode",
    question: "Where is your school located?",
    hint: "Enter your school's PIN code so we can find your school and location.",
    placeholder: "Enter pincode",
  },
  {
    id: "school",
    kind: "school",
    question: "What's your school name?",
    placeholder: "Start typing to find your school\u2026",
  },
];

const SCHOOL: Step[] = [
  {
    id: "school",
    kind: "text",
    question: "What's your school called?",
    placeholder: "School name",
    validate: required("the school name"),
  },
  {
    id: "name",
    kind: "text",
    question: "Who's coordinating this?",
    hint: "The teacher or staff member we should talk to.",
    placeholder: "Coordinator's full name",
    validate: required("a name"),
  },
  {
    id: "email",
    kind: "email",
    question: "Official school email?",
    placeholder: "coordinator@school.edu",
    validate: isEmail,
  },
  {
    id: "phone",
    kind: "tel",
    question: "A number we can call?",
    placeholder: "98765 43210",
    validate: isPhone,
  },
  OTP_STEP,
  {
    id: "students",
    kind: "number",
    question: "Roughly how many students?",
    hint: "You can change this later.",
    placeholder: "e.g. 60",
    validate: isCount,
  },
  {
    id: "city",
    kind: "text",
    question: "Which city is the school in?",
    placeholder: "City",
    validate: required("a city"),
  },
];

/* ------------------------------------------------------------------ *
 * Backend stubs — wire these to the real API
 * ------------------------------------------------------------------ */

/** TODO: POST to the real "send OTP" endpoint. */
async function requestOtp(phone: string) {
  await new Promise((r) => setTimeout(r, 400));
  return { sent: true, phone };
}

/**
 * TODO: verify against the real endpoint. Until that exists this only
 * checks the shape of the code — it does NOT prove the number is owned.
 */
async function verifyOtp(code: string) {
  await new Promise((r) => setTimeout(r, 500));
  return /^\d{6}$/.test(code);
}

/** TODO: POST the completed registration. */
async function submitRegistration(path: Path, answers: Record<string, string>) {
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true, path, answers };
}

/* ------------------------------------------------------------------ *
 * Context
 * ------------------------------------------------------------------ */

/* Figma uses an underlined field rather than a boxed one. */
const UNDERLINE =
  "w-full border-0 border-b-2 border-solid border-brand bg-transparent px-0 pb-2.5 font-display text-[18px] text-ink outline-none placeholder:text-ink/35 focus:border-ink";

const RegisterCtx = createContext<{ open: (path?: Path) => void }>({
  open: () => {},
});
export const useRegister = () => useContext(RegisterCtx);

export function RegisterProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  // which set of questions the modal starts on; the bottom link still switches
  const [startPath, setStartPath] = useState<Path>("individual");
  const open = useCallback((path: Path = "individual") => {
    setStartPath(path);
    setOpen(true);
  }, []);
  const pathname = usePathname();
  const value = useMemo(() => ({ open }), [open]);

  // the LMS sends unregistered visitors to /?register=1: open the flow for them
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("register")) {
      open(q.get("register") === "school" ? "school" : "individual");
      history.replaceState(null, "", window.location.pathname);
    }
  }, [open, pathname]);

  return (
    <RegisterCtx.Provider value={value}>
      {children}
      {isOpen && (
        <RegisterModal startPath={startPath} onClose={() => setOpen(false)} />
      )}
    </RegisterCtx.Provider>
  );
}

/* ------------------------------------------------------------------ *
 * Modal
 * ------------------------------------------------------------------ */

function RegisterModal({
  startPath,
  onClose,
}: {
  startPath: Path;
  onClose: () => void;
}) {
  const [path, setPath] = useState<Path>(startPath);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [schoolDone, setSchoolDone] = useState(false);
  // resolved from the PIN code, shown read-only and carried into the payload
  const [loc, setLoc] = useState<{ city: string; state: string; pin: string } | null>(null);
  const [locBusy, setLocBusy] = useState(false);
  const [hits, setHits] = useState<{ id: string; name: string; address: string }[]>([]);

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isSchool = path === "school";
  const steps = path === "individual" ? INDIVIDUAL : SCHOOL;
  const step = steps[index];
  const total = steps.length;

  // lock the page behind the dialog, and hand the pointer back: the bot
  // cursor stands down while someone is filling in the form
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("reg-open");
    return () => {
      document.body.style.overflow = prev;
      document.documentElement.classList.remove("reg-open");
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // focus the field as each question appears
  useEffect(() => {
    if (!step) return;
    if (step.kind === "otp") otpRefs.current[0]?.focus();
    else inputRef.current?.focus();
  }, [step, index]);

  // ask for a code as soon as the OTP step opens
  useEffect(() => {
    if (step?.kind === "otp" && answers.phone) void requestOtp(answers.phone);
  }, [step, answers.phone]);

  // answers survive a path switch, so shared fields don't need retyping
  const answersRef = useRef(answers);
  answersRef.current = answers;

  /* PIN resolves to city + state, same endpoint the school form uses. */
  useEffect(() => {
    if (step?.kind !== "pincode") return;
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 6) {
      setLoc(null);
      return;
    }
    let cancelled = false;
    setLocBusy(true);
    fetch(`/api/pincode?pin=${digits}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.ok) {
          setLoc({ city: d.city, state: d.state, pin: d.pin });
          setError(null);
        } else {
          setLoc(null);
          setError(d.error ?? "We couldn't find that PIN code.");
        }
      })
      .catch(() => !cancelled && setError("Couldn't look that up. Try again."))
      .finally(() => !cancelled && setLocBusy(false));
    return () => {
      cancelled = true;
    };
  }, [value, step]);

  /* School type-ahead, scoped to the resolved PIN. */
  useEffect(() => {
    if (step?.kind !== "school" || !loc || value.trim().length < 2) {
      setHits([]);
      return;
    }
    let cancelled = false;
    const t = setTimeout(() => {
      fetch(`/api/schools?pin=${loc.pin}&q=${encodeURIComponent(value.trim())}`)
        .then((r) => r.json())
        .then((d) => !cancelled && setHits(d.results ?? []))
        .catch(() => !cancelled && setHits([]));
    }, 280);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [value, loc, step]);

  const switchPath = (p: Path) => {
    setPath(p);
    setIndex(0);
    setOtp(Array(6).fill(""));
    setError(null);
  };

  const finish = async (all: Record<string, string>) => {
    setBusy(true);
    await submitRegistration(path, all);
    // carry the registration into the dashboard
    saveStudent({
      ...loadStudent(),
      name: all.name ?? "",
      email: all.email ?? "",
      phone: all.phone ?? "",
      grade: all.grade ?? "",
      school: all.school ?? "",
      city: loc?.city ?? all.city ?? "",
    });
    setBusy(false);
    setDone(true);
  };

  useEffect(() => {
    const s = (path === "individual" ? INDIVIDUAL : SCHOOL)[index];
    if (s && s.kind !== "otp") setValue(answersRef.current[s.id] ?? "");
  }, [path, index]);

  const advance = async (answer: string) => {
    const next = { ...answers };
    if (answer) next[step.id] = answer;
    else delete next[step.id];
    setAnswers(next);
    setValue("");
    setOtp(Array(6).fill(""));
    setError(null);
    if (index + 1 >= total) await finish(next);
    else setIndex(index + 1);
  };

  const onNext = async () => {
    if (!step || busy) return;

    if (step.kind === "otp") {
      const code = otp.join("");
      if (code.length < 6) return setError("Enter all 6 digits.");
      setBusy(true);
      const ok = await verifyOtp(code);
      setBusy(false);
      if (!ok) return setError("That code isn't right. Try again.");
      return advance(code);
    }

    if (step.kind === "choice") {
      if (!value) return setError("Pick one to continue.");
      return advance(value);
    }

    if (step.kind === "pincode") {
      if (!loc) return setError("Enter a valid 6-digit PIN code.");
      return advance(loc.pin);
    }

    if (step.kind === "school") {
      if (value.trim().length < 2) return setError("Please enter your school's name.");
      return advance(value.trim());
    }

    const problem = step.validate(value);
    if (problem) return setError(problem);
    await advance(value.trim());
  };

  const onBack = () => {
    setError(null);
    if (index > 0) setIndex(index - 1);
  };

  const setOtpAt = (i: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      const nextOtp = [...otp];
      nextOtp[i] = "";
      setOtp(nextOtp);
      return;
    }
    const nextOtp = [...otp];
    // paste of a whole code fills forward
    digits.split("").forEach((d, k) => {
      if (i + k < 6) nextOtp[i + k] = d;
    });
    setOtp(nextOtp);
    otpRefs.current[Math.min(i + digits.length, 5)]?.focus();
  };

  const progress = ((done ? total : index) / total) * 100;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-[6px] sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (!panelRef.current?.contains(e.target as Node)) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Register for IAIB"
        className={`notch win-n relative flex max-h-[92vh] w-full flex-col overflow-hidden bg-surface ${isSchool ? "max-w-[640px]" : "max-w-[600px]"}`}
      >
        {/* progress */}
        <div className="h-1 w-full bg-white/10">
          <div
            className="h-full bg-brand transition-[width] duration-500 ease-out"
            style={{ width: isSchool ? "100%" : `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-6 pt-4">
          <p className="font-display text-[13px] text-ink/50">
            {isSchool
              ? schoolDone
                ? "All done"
                : "School registration"
              : done
                ? "All done"
                : `Question ${index + 1} of ${total}`}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="notch num-n grid size-8 place-items-center text-ink/60 transition-colors hover:bg-white/5 hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-7 sm:px-9 sm:pb-9">
          {/* ---- schools get the whole form on one page ---- */}
          {isSchool && (
            <SchoolForm onClose={onClose} onRegistered={() => setSchoolDone(true)} />
          )}

          {/* ---- done ---- */}
          {!isSchool && done && (
            <div key="done" className="step-in">
              <RegistrationSuccess
                name={answers.name ?? "Builder"}
                email={answers.email}
                onClose={onClose}
              />
            </div>
          )}

          {/* ---- questions ---- */}
          {!isSchool && !done && step && (
            <div key={`${path}-${index}`} className="step-in flex flex-col gap-5 py-2">
              <div>
                <h3 className="font-ui text-[26px] leading-[1.15] font-bold tracking-[-0.8px] text-ink sm:text-[32px]">
                  {step.question}
                </h3>
                {step.hint && (
                  <p className="mt-2 font-display text-[15px] text-ink/60">
                    {step.hint}
                  </p>
                )}
              </div>

              {step.kind === "choice" ? (
                <div className="grid grid-cols-2 gap-3">
                  {step.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={value === opt}
                      onClick={() => {
                        setValue(opt);
                        setError(null);
                      }}
                      className={` border border-solid px-4 py-3.5 text-left font-display text-[16px] transition-colors ${
                        value === opt
                          ? "border-brand bg-brand/[0.1] text-ink"
                          : "border-white/15 bg-surface-2 text-ink hover:border-line-2 hover:bg-white/[0.03]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : step.kind === "otp" ? (
                <div className="flex gap-2 sm:gap-3">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      value={d}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      aria-label={`Digit ${i + 1}`}
                      onChange={(e) => setOtpAt(i, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[i] && i > 0)
                          otpRefs.current[i - 1]?.focus();
                        if (e.key === "Enter") void onNext();
                      }}
                      className="size-12 border border-solid border-white/20 text-center font-ui text-[20px] font-bold text-ink outline-none focus:border-2 focus:border-line-2 sm:size-[52px]"
                    />
                  ))}
                </div>
              ) : step.kind === "pincode" ? (
                <div className="flex flex-col gap-5">
                  <input
                    ref={inputRef}
                    value={value}
                    inputMode="numeric"
                    maxLength={6}
                    placeholder={step.placeholder}
                    onChange={(e) => {
                      setValue(e.target.value.replace(/\D/g, "").slice(0, 6));
                      setError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void onNext();
                    }}
                    className={UNDERLINE}
                  />
                  {/* filled in from the PIN code, so not editable */}
                  <div className="grid grid-cols-2 gap-5">
                    <input
                      readOnly
                      aria-label="City"
                      value={loc?.city ?? ""}
                      placeholder={locBusy ? "\u2026" : "-- -- --"}
                      className={`${UNDERLINE} cursor-default`}
                    />
                    <input
                      readOnly
                      aria-label="State"
                      value={loc?.state ?? ""}
                      placeholder={locBusy ? "\u2026" : "-- -- --"}
                      className={`${UNDERLINE} cursor-default`}
                    />
                  </div>
                </div>
              ) : step.kind === "school" ? (
                <div className="relative flex flex-col gap-4">
                  {loc && (
                    <div className="flex flex-wrap gap-2">
                      {[loc.pin, loc.city, loc.state].map((chip) => (
                        <span
                          key={chip}
                          className=" bg-brand px-2.5 py-1 font-display text-[14px] text-white"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                  <input
                    ref={inputRef}
                    value={value}
                    placeholder={step.placeholder}
                    autoComplete="off"
                    onChange={(e) => {
                      setValue(e.target.value);
                      setError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void onNext();
                    }}
                    className={UNDERLINE}
                  />
                  {hits.length > 0 && (
                    <ul className="absolute top-full right-0 left-0 z-10 max-h-[200px] overflow-y-auto border border-solid border-white/15 bg-surface-2 py-1 shadow-lg">
                      {hits.map((h) => (
                        <li key={h.id}>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setValue(h.name);
                              setHits([]);
                            }}
                            className="flex w-full flex-col items-start px-3 py-2 text-left transition-colors hover:bg-white/[0.04]"
                          >
                            <span className="font-display text-[15px] text-ink">{h.name}</span>
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
              ) : step.kind === "tel" ? (
                <div className="flex items-center gap-2.5 border-b-2 border-solid border-brand pb-2.5 focus-within:border-ink">
                  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="shrink-0">
                    <circle cx="12" cy="12" r="12" fill="#25D366" />
                    <path
                      fill="#fff"
                      d="M12 5.6a6.3 6.3 0 0 0-5.4 9.5L5.7 18.4l3.4-.9A6.3 6.3 0 1 0 12 5.6Zm3.2 8.9c-.13.38-.76.75-1.07.76-.31.06-.63.07-1-.06-.25-.07-.57-.18-.95-.37-1.64-.7-2.7-2.4-2.78-2.52-.08-.12-.66-.88-.66-1.64s.4-1.14.55-1.3c.13-.15.3-.19.4-.19h.3c.1 0 .24 0 .37.3l.5 1.2c.07.13.07.25 0 .32l-.2.3-.19.2c-.6.07-.13.17 0 .32.13.18.44.69.88 1.12.56.5 1.06.69 1.2.76.13.06.24.06.32-.07l.44-.5c.12-.13.2-.1.32-.06l1.13.56c.13.06.25.12.25.19.06.13.06.37 0 .62Z"
                    />
                  </svg>
                  <input
                    ref={inputRef}
                    type="tel"
                    inputMode="numeric"
                    value={value}
                    placeholder={step.placeholder}
                    onChange={(e) => {
                      setValue(e.target.value);
                      setError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void onNext();
                    }}
                    className="w-full border-0 bg-transparent p-0 font-display text-[18px] text-ink outline-none placeholder:text-ink/35"
                  />
                </div>
              ) : (
                <input
                  ref={inputRef}
                  type={step.kind === "number" ? "number" : step.kind}
                  inputMode={step.kind === "number" ? "numeric" : undefined}
                  value={value}
                  placeholder={step.placeholder}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void onNext();
                  }}
                  className={UNDERLINE}
                />
              )}

              {error && (
                <p role="alert" className="font-display text-[14px] text-brand">
                  {error}
                </p>
              )}

              <div className="mt-2 flex items-center gap-3">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={onBack}
                    className=" px-4 py-2.5 font-display text-[15px] text-ink/60 transition-colors hover:bg-white/5 hover:text-ink"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void onNext()}
                  disabled={busy}
                  className="notch cap-n  bg-brand px-7 py-2.5 font-ui text-[16px] text-white transition-colors hover:bg-white hover:text-black disabled:opacity-60"
                >
                  {busy ? "Just a sec…" : step.kind === "otp" ? "Verify" : "Next"}
                </button>
              </div>

              {/* Figma 258:20693 — consent sits under the OTP step */}
              {step.kind === "otp" && (
                <p className="font-display text-[12px] leading-[18px] text-ink/55">
                  By verifying your number, you agree to receive{" "}
                  <span className="text-brand">marketing and promotional messages</span>{" "}
                  from us on WhatsApp.
                </p>
              )}
            </div>
          )}
        </div>

        {!schoolDone && (isSchool || !done) && (
          <div className="border-t border-white/10 px-6 py-4 sm:px-9">
            {path === "individual" ? (
              <p className="font-display text-[14px] text-ink/60">
                Signing up a whole school?{" "}
                <button
                  type="button"
                  onClick={() => switchPath("school")}
                  className="font-medium text-brand underline underline-offset-2 hover:text-ink"
                >
                  Register as a School
                </button>
              </p>
            ) : (
              <p className="font-display text-[14px] text-ink/60">
                Just signing yourself up?{" "}
                <button
                  type="button"
                  onClick={() => switchPath("individual")}
                  className="font-medium text-brand underline underline-offset-2 hover:text-ink"
                >
                  Register as an Individual
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
