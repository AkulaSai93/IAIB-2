"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { STUDENT, THEMES, today, type Student } from "./data";

/* The LMS's single source of truth for the student. Today it persists to
   localStorage; replacing `load`/`save` with API calls is the one seam the
   backend needs. Registration writes the student's name in, so the LMS
   greets them by it. */

const KEY = "iaib.lms.v1";

type Float = { id: number; amount: number; x: number; y: number };

type Ctx = {
  student: Student;
  ready: boolean;
  patch: (p: Partial<Student>) => void;
  /** Adds (or removes) XP, logs it, and floats a "+n XP" from `origin`. */
  addXp: (amount: number, label: string, origin?: { x: number; y: number }) => void;
  floats: Float[];
  reset: () => void;
};

const LmsCtx = createContext<Ctx | null>(null);
export const useLms = () => {
  const c = useContext(LmsCtx);
  if (!c) throw new Error("useLms outside LmsProvider");
  return c;
};

function load(): Student {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...STUDENT, ...JSON.parse(raw) };
    // a student who just registered on the site arrives with their name
    const reg = JSON.parse(localStorage.getItem("iaib.student.v1") ?? "null");
    if (reg?.name) {
      const full = String(reg.name).trim();
      return { ...STUDENT, fullName: full, name: full.split(/\s+/)[0], school: reg.school ?? "", grade: reg.grade || STUDENT.grade, city: reg.city ?? "", phone: reg.phone || STUDENT.phone };
    }
  } catch {}
  return STUDENT;
}

/* Pushes the theme's tokens onto <html> so every --lms-* consumer updates. */
export function applyTheme(id: string) {
  const t = THEMES.find((x) => x.id === id) ?? THEMES[0];
  const r = document.documentElement.style;
  r.setProperty("--lms-accent", t.tokens.accent);
  r.setProperty("--lms-accent-soft", t.tokens.accentSoft);
  r.setProperty("--lms-bg", t.tokens.bg);
  r.setProperty("--lms-surface", t.tokens.surface);
  r.setProperty("--lms-elevated", t.tokens.elevated);
}

export function LmsProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<Student>(STUDENT);
  const [ready, setReady] = useState(false);
  const [floats, setFloats] = useState<Float[]>([]);
  const fid = useRef(0);

  useEffect(() => {
    let s = load();
    // daily login: the first visit of a new day keeps the streak and earns +1
    const d = today();
    if (s.lastLogin !== d) {
      const gap = s.lastLogin ? Math.round((Date.parse(d) - Date.parse(s.lastLogin)) / 86400000) : 1;
      const streak = gap === 1 ? s.streak + (s.lastLogin ? 1 : 0) : 1;
      const week = [...s.week];
      week[(new Date().getDay() + 6) % 7] = true;
      s = {
        ...s, lastLogin: d, streak, longestStreak: Math.max(s.longestStreak, streak), week,
        xp: s.xp + (s.lastLogin ? 1 : 0), goalsDone: s.lastLogin ? [] : s.goalsDone,
        todayXp: s.lastLogin ? 1 : s.todayXp, todayCorrect: s.lastLogin ? 0 : s.todayCorrect, questsClaimed: s.lastLogin ? [] : s.questsClaimed,
        xpLog: s.lastLogin ? [{ id: `login-${d}`, label: "Daily login", amount: 1, at: "Today" }, ...s.xpLog] : s.xpLog,
      };
    }
    setStudent(s);
    applyTheme(s.theme);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) try { localStorage.setItem(KEY, JSON.stringify(student)); } catch {}
  }, [student, ready]);

  const patch = useCallback((p: Partial<Student>) => {
    setStudent((s) => ({ ...s, ...p }));
    if (p.theme) applyTheme(p.theme);
  }, []);

  const addXp = useCallback((amount: number, label: string, origin?: { x: number; y: number }) => {
    setStudent((s) => ({
      ...s,
      xp: Math.max(0, Math.round((s.xp + amount) * 10) / 10),
      todayXp: Math.max(0, (s.todayXp ?? 0) + Math.max(0, amount)),
      xpLog: [{ id: `x${Date.now()}`, label, amount, at: "Just now" }, ...s.xpLog].slice(0, 30),
    }));
    const id = ++fid.current;
    const o = origin ?? { x: window.innerWidth - 160, y: 72 };
    setFloats((f) => [...f, { id, amount, ...o }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1400);
  }, []);

  const reset = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch {}
    setStudent({ ...STUDENT, lastLogin: today() });
    applyTheme(STUDENT.theme);
  }, []);

  const value = useMemo(() => ({ student, ready, patch, addXp, floats, reset }), [student, ready, patch, addXp, floats, reset]);
  return <LmsCtx.Provider value={value}>{children}</LmsCtx.Provider>;
}

export const fmtXp = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
