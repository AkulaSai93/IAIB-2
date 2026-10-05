"use client";

/**
 * Local stand-in for the student backend. Everything here is per-browser
 * and unauthenticated — swap these for real API calls when the service
 * exists. Kept in one place so there's a single seam to replace.
 */

const KEY = "iaib.student.v1";

export type Student = {
  name: string;
  email: string;
  phone: string;
  grade: string;
  school: string;
  city: string;
  bio: string;
  /** Emoji fallback. */
  avatar: string;
  /** Data URL of an uploaded picture; wins over the emoji when set. */
  avatarImage: string;
  themeId: string;
  credits: number;
  /** ISO dates (YYYY-MM-DD) the student solved a problem. */
  solved: string[];
};

const EMPTY: Student = {
  name: "",
  email: "",
  phone: "",
  grade: "",
  school: "",
  city: "",
  bio: "",
  avatar: "🐍",
  avatarImage: "",
  themeId: "default",
  credits: 0,
  solved: [],
};

/**
 * Local calendar date, not UTC. `toISOString()` would roll the day over at
 * UTC midnight, which breaks streaks for anyone not on UTC.
 */
const localISO = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const today = () => localISO(new Date());

const dayBefore = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() - 1);
  return localISO(d);
};

export function loadStudent(): Student {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function saveStudent(s: Student) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private mode — progress just won't persist */
  }
}

/** Consecutive days ending today (or yesterday, if today isn't solved yet). */
export function streakOf(solved: string[]): number {
  const set = new Set(solved);
  let cursor = today();
  if (!set.has(cursor)) {
    cursor = dayBefore(cursor);
    if (!set.has(cursor)) return 0;
  }
  let n = 0;
  while (set.has(cursor)) {
    n++;
    cursor = dayBefore(cursor);
  }
  return n;
}

/** The last 7 calendar days, oldest first. */
export function lastSevenDays(solved: string[]) {
  const set = new Set(solved);
  const out: { iso: string; label: string; done: boolean }[] = [];
  const d = new Date();
  for (let i = 6; i >= 0; i--) {
    const day = new Date(d);
    day.setDate(d.getDate() - i);
    const iso = localISO(day);
    out.push({
      iso,
      label: day.toLocaleDateString(undefined, { weekday: "narrow" }),
      done: set.has(iso),
    });
  }
  return out;
}
