/* Mock data for the student LMS. Every export here stands in for an API
   response, so swapping in the real backend means replacing this file's
   values (or the functions that read them), not the components. */

import { MODULES, MENTORS } from "@/lib/data";

/* ---------------------------------------------------------------- student */

export type Student = {
  name: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  school: string;
  grade: string;
  city: string;
  avatar: string;          // an AVATARS id (a01–a40), or "upload"
  avatarImage: string;     // data URL when avatar === "upload"
  xp: number;
  streak: number;
  longestStreak: number;
  rank: number;
  rankDelta: number;
  sessionsCompleted: number;
  totalSessions: number;
  practiceSolved: number;
  practiceCorrect: number;
  practiceXp: number;
  profileCompleted: boolean;
  onboardingCompleted: boolean;
  tourCompleted: boolean;
  potdSolvedOn: string;    // YYYY-MM-DD of the last POTD answered
  lastLogin: string;       // YYYY-MM-DD
  week: boolean[];         // Mon..Sun activity for the current week
  theme: string;           // a THEMES id
  goalsDone: string[];     // ids of today's goals ticked off
  todayXp: number;         // XP earned today, for quests
  todayCorrect: number;    // practice answers right today
  questsClaimed: string[]; // quest ids whose chest was opened today
  xpLog: { id: string; label: string; amount: number; at: string }[];
};

export const STUDENT: Student = {
  name: "Sai",
  fullName: "Sai Akula",
  email: "",
  emailVerified: false,
  phone: "98765 43210",
  school: "",
  grade: "Class 11",
  city: "",
  avatar: "",
  avatarImage: "",
  xp: 246,
  streak: 7,
  longestStreak: 14,
  rank: 128,
  rankDelta: 14,
  sessionsCompleted: 3,
  totalSessions: 30,
  practiceSolved: 84,
  practiceCorrect: 67,
  practiceXp: 96,
  profileCompleted: false,
  onboardingCompleted: false,
  tourCompleted: false,
  potdSolvedOn: "",
  lastLogin: "",
  week: [true, true, true, true, true, true, false],
  theme: "ignite",
  goalsDone: [],
  todayXp: 0,
  todayCorrect: 0,
  questsClaimed: [],
  xpLog: [
    { id: "l1", label: "Session 03 completed", amount: 5, at: "Yesterday" },
    { id: "l2", label: "Problem of the Day", amount: 2, at: "Yesterday" },
    { id: "l3", label: "Practice: Python lists", amount: 1, at: "2 days ago" },
    { id: "l4", label: "Practice: tokens", amount: -0.5, at: "2 days ago" },
    { id: "l5", label: "Daily login", amount: 1, at: "2 days ago" },
  ],
};

/* -------------------------------------------------------------------- XP */

export const XP_RULES = [
  { id: "login", label: "Daily login", amount: 1 },
  { id: "potd", label: "POTD correct", amount: 2 },
  { id: "practice", label: "Practice correct", amount: 1 },
  { id: "practice-wrong", label: "Practice wrong", amount: -0.5 },
  { id: "profile", label: "Profile setup", amount: 10 },
  { id: "session", label: "Session completed", amount: 5 },
  { id: "easy", label: "Easy game", amount: 2 },
  { id: "medium", label: "Medium game", amount: 3 },
  { id: "hard", label: "Hard game", amount: 5 },
];

/* Levels every 75 XP: 246 XP sits in level 4. */
export const XP_PER_LEVEL = 75;
export const levelOf = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;

/* Reward tiers — the names are deliberately soft so they can be configured
   later from an admin panel without the UI promising a specific item. */
export const REWARD_TIERS = [
  { xp: 100, title: "IAIB starter kit", note: "Stickers and swag" },
  { xp: 500, title: "IAIB Hoodie", note: "Or an equivalent voucher" },
  { xp: 1000, title: "Premium reward", note: "Announced at the halfway mark" },
  { xp: 2000, title: "Special IAIB reward", note: "For the top builders" },
];

export const nextReward = (xp: number) => REWARD_TIERS.find((r) => r.xp > xp) ?? REWARD_TIERS[REWARD_TIERS.length - 1];
export const prevRewardXp = (xp: number) => [...REWARD_TIERS].reverse().find((r) => r.xp <= xp)?.xp ?? 0;

/* --------------------------------------------------------------- sessions */

export type Session = {
  no: number;            // 1..30
  module: number;        // index into MODULES
  title: string;
  date: Date;
  minutes: number;
  mentor: string;
};

/* Live sessions run daily at 10:00 AM IST from October 3. */
const START = new Date("2026-10-03T10:00:00+05:30");
const LENGTHS = [42, 45, 38, 50, 44, 40];

export const SESSIONS: Session[] = MODULES.flatMap((m, mi) => m.items.map((title) => ({ module: mi, title })))
  .map((s, i) => ({
    ...s,
    no: i + 1,
    date: new Date(START.getTime() + i * 86400000),
    minutes: LENGTHS[i % LENGTHS.length],
    mentor: MENTORS[i % MENTORS.length].name,
  }));

export type SessionState = "done" | "current" | "upcoming" | "locked";
export const sessionState = (no: number, completed: number): SessionState =>
  no <= completed ? "done" : no === completed + 1 ? "current" : no <= completed + 3 ? "upcoming" : "locked";

export const CURRICULUM = MODULES.map((m, i) => ({
  index: i,
  no: String(i + 1).padStart(2, "0"),
  title: m.title,
  desc: m.desc,
  sessions: SESSIONS.filter((s) => s.module === i),
}));

/* -------------------------------------------------------------- roadmap */

export const JOURNEY = [
  { id: "register", title: "Registration", blurb: "You signed up for IAIB." },
  { id: "profile", title: "Profile setup", blurb: "Your learning identity." },
  { id: "live", title: "30 live sessions", blurb: "Daily sessions with industry mentors." },
  { id: "curriculum", title: "Curriculum", blurb: "Six modules, Foundations to Vibe Coding." },
  { id: "practice", title: "Practice", blurb: "Problems, POTD and games for XP." },
  { id: "screening", title: "Screening", blurb: "A national online round." },
  { id: "prototype", title: "Prototype · Vibecoding", blurb: "Build something real with AI." },
  { id: "finale", title: "Grand Finale", blurb: "36 hours, live in Bengaluru." },
] as const;

/* ----------------------------------------------------------- notifications */

export const NOTIFICATIONS = [
  { id: "n1", kind: "session", title: "New session available", body: "Session 05 is now open for registration.", at: "10m" },
  { id: "n2", kind: "rank", title: "Ranking update", body: "You moved up 14 positions to #128.", at: "1h" },
  { id: "n3", kind: "reward", title: "Reward unlocked", body: "You crossed 100 XP. Your starter kit is on its way.", at: "2d" },
  { id: "n4", kind: "streak", title: "7-day streak", body: "A full week of showing up. Keep going.", at: "Today" },
] as const;

/* -------------------------------------------------------------- practice */

export type Problem = {
  id: string;
  topic: "AI" | "Python" | "Prompting" | "LLMs" | "Agents" | "Vibe Coding";
  level: "Easy" | "Medium" | "Hard";
  title: string;
  question: string;
  options: string[];
  answer: number;
  why: string;
  solved?: boolean;
};

export const PRACTICE_TOPICS = ["All", "AI", "Python", "Prompting", "LLMs", "Agents", "Vibe Coding"] as const;
export const LEVEL_XP = { Easy: 2, Medium: 3, Hard: 5 } as const;

export const PROBLEMS: Problem[] = [
  { id: "p1", topic: "AI", level: "Easy", title: "Supervised or not?", solved: true,
    question: "A model learns to tag photos as 'cat' or 'dog' from 10,000 labelled photos. What kind of learning is this?",
    options: ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Rule-based programming"], answer: 0,
    why: "The photos come with the right answers (labels), so the model learns by comparing its guesses to them: that is supervised learning." },
  { id: "p2", topic: "Python", level: "Easy", title: "List indexing",
    question: "What does `[10, 20, 30, 40][-1]` return in Python?",
    options: ["10", "40", "An error", "30"], answer: 1,
    why: "Negative indexes count from the end, so -1 is the last item: 40." },
  { id: "p3", topic: "Prompting", level: "Medium", title: "Few-shot prompting",
    question: "Which change most reliably gets an LLM to answer in a fixed format?",
    options: ["Asking it to 'be careful'", "Adding two worked examples in that format", "Making the prompt shorter", "Raising the temperature"], answer: 1,
    why: "Showing examples (few-shot prompting) anchors the output format far better than instructions alone." },
  { id: "p4", topic: "LLMs", level: "Medium", title: "Context windows", solved: true,
    question: "A model's context window is 8,000 tokens. What happens to text beyond that?",
    options: ["It is summarised automatically", "The model can't see it in that call", "It is saved for next time", "It is translated into embeddings"], answer: 1,
    why: "Anything outside the window simply isn't part of the input the model reads for that request." },
  { id: "p5", topic: "Agents", level: "Hard", title: "Tool calling loop",
    question: "In an agent loop, what should happen right after the model requests a tool call?",
    options: ["Return the request to the user", "Run the tool and feed the result back to the model", "Restart the conversation", "Ask the model to guess the result"], answer: 1,
    why: "The agent executes the tool, then gives the model the result so it can decide the next step." },
  { id: "p6", topic: "Vibe Coding", level: "Medium", title: "Debugging with AI",
    question: "Your AI-written app crashes. What's the most useful thing to paste to the model?",
    options: ["'It doesn't work'", "The full error message and the code it points to", "A screenshot of the homepage", "Your whole project folder"], answer: 1,
    why: "The exact error plus the relevant code gives the model what it needs to find the cause." },
  { id: "p7", topic: "AI", level: "Hard", title: "Bias in data",
    question: "A hiring model trained on past hires keeps rejecting one group. The most likely cause?",
    options: ["The model is too small", "The training data reflected past bias", "The learning rate is too low", "Too many features"], answer: 1,
    why: "Models learn patterns in their data, including unfair ones from past decisions." },
  { id: "p8", topic: "Python", level: "Medium", title: "Dictionaries",
    question: "Which line safely reads a key that might be missing from dict `d`?",
    options: ["d['score']", "d.get('score', 0)", "d.score", "get(d, 'score')"], answer: 1,
    why: "`dict.get(key, default)` returns the default instead of raising a KeyError." },
];

/* --------------------------------------------------------------------- POTD */

export const POTD = {
  date: "October 6",
  topic: "Large Language Models",
  question: "Which of the following best explains why an LLM can confidently state something false?",
  options: [
    "It searches the internet and finds wrong pages",
    "It predicts likely next words, not verified facts",
    "It is programmed to make jokes",
    "It forgets everything after each word",
  ],
  answer: 1,
  why: "LLMs generate text by predicting what is likely to come next. Fluent and plausible isn't the same as true, which is why answers that matter should be checked against a source.",
};

/* ---------------------------------------------------------- achievements */

export const ACHIEVEMENTS = [
  { id: "a1", icon: "trophy", title: "First Session", note: "Attended your first live session", earned: true },
  { id: "a2", icon: "flame", title: "7 Day Streak", note: "Logged in seven days running", earned: true },
  { id: "a3", icon: "brain", title: "10 Problems Solved", note: "Ten practice problems down", earned: true },
  { id: "a4", icon: "target", title: "100 XP", note: "Crossed your first 100 XP", earned: true },
  { id: "a5", icon: "zap", title: "Module Master", note: "Finish a whole module", earned: false },
  { id: "a6", icon: "rocket", title: "Screening Ready", note: "Complete all 30 sessions", earned: false },
];

/* ------------------------------------------------------------- avatars */

/* Pixel-art builders (public/assets/avatars/aNN.webp), sliced from the
   IAIB avatar sheet: people in the first three rows, creatures in the last two. */
export const AVATARS = [
  { id: "a01", label: "Coder" },
  { id: "a02", label: "Headphones" },
  { id: "a03", label: "Hoodie" },
  { id: "a04", label: "Specs" },
  { id: "a05", label: "Violet" },
  { id: "a06", label: "Red Hoodie" },
  { id: "a07", label: "Curls" },
  { id: "a08", label: "Topknot" },
  { id: "a09", label: "Glasses" },
  { id: "a10", label: "Red Cap" },
  { id: "a11", label: "Black Cap" },
  { id: "a12", label: "Bookworm" },
  { id: "a13", label: "Silver" },
  { id: "a14", label: "DJ" },
  { id: "a15", label: "Blue Hoodie" },
  { id: "a16", label: "Bucket Hat" },
  { id: "a17", label: "Visor" },
  { id: "a18", label: "Wizard" },
  { id: "a19", label: "Astronaut" },
  { id: "a20", label: "Cyber" },
  { id: "a21", label: "Shadow" },
  { id: "a22", label: "Neon Cat" },
  { id: "a23", label: "Hacker" },
  { id: "a24", label: "Ninja" },
  { id: "a25", label: "Shiba" },
  { id: "a26", label: "Panda" },
  { id: "a27", label: "Fox" },
  { id: "a28", label: "Wolf" },
  { id: "a29", label: "Black Cat" },
  { id: "a30", label: "Dino" },
  { id: "a31", label: "Penguin" },
  { id: "a32", label: "Axolotl" },
  { id: "a33", label: "Robot" },
  { id: "a34", label: "Void Bot" },
  { id: "a35", label: "Sprout" },
  { id: "a36", label: "Bear" },
  { id: "a37", label: "Spirit Cat" },
  { id: "a38", label: "Alien" },
  { id: "a39", label: "Duckling" },
  { id: "a40", label: "Corgi" },
].map((a) => ({ ...a, img: `/assets/avatars/${a.id}.webp` }));

/* --------------------------------------------------------------- themes */

/* Semantic tokens. The mascot (and later an AI backend) changes the look by
   switching these; components only ever read the --lms-* variables. */
export const THEMES = [
  { id: "ignite", label: "Ignite", note: "IAIB red on black", tokens: { accent: "#f0402f", accentSoft: "rgba(240,64,47,.14)", bg: "#000000", surface: "#0c0c0c", elevated: "#141414" } },
  { id: "violet", label: "Violet", note: "Purple accent", tokens: { accent: "#9b7bff", accentSoft: "rgba(155,123,255,.15)", bg: "#05040a", surface: "#0d0b14", elevated: "#15121f" } },
  { id: "ocean", label: "Ocean", note: "Blue accent", tokens: { accent: "#3ba4ff", accentSoft: "rgba(59,164,255,.15)", bg: "#02060b", surface: "#0a1018", elevated: "#111a24" } },
  { id: "matrix", label: "Matrix", note: "Futuristic green", tokens: { accent: "#3ddc84", accentSoft: "rgba(61,220,132,.14)", bg: "#000402", surface: "#07100b", elevated: "#0e1912" } },
  { id: "mono", label: "Minimal", note: "Quiet greyscale", tokens: { accent: "#f0f0f0", accentSoft: "rgba(255,255,255,.1)", bg: "#000000", surface: "#0b0b0b", elevated: "#131313" } },
] as const;

/* ------------------------------------------------------------- helpers */

export const today = () => new Date().toISOString().slice(0, 10);
export const fmtDay = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "long" });
export const fmtDate = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
export const fmtTime = (d: Date) => d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });

/* ------------------------------------------------------------- league */

/* A weekly league, Duolingo-style: everyone's XP this week, top 5 move up,
   bottom 3 drop. The student is slotted in by their weekly XP. */
export const LEAGUE = {
  name: "Ember League",
  endsIn: "3 days",
  promote: 5,
  demote: 3,
  players: [
    { name: "Ananya R", avatar: "a05", xp: 142 },
    { name: "Kabir S", avatar: "a20", xp: 128 },
    { name: "Ishaan M", avatar: "a10", xp: 117 },
    { name: "Diya P", avatar: "a14", xp: 96 },
    { name: "Rohan K", avatar: "a27", xp: 81 },
    { name: "Zara A", avatar: "a32", xp: 58 },
    { name: "Arjun V", avatar: "a09", xp: 44 },
    { name: "Meera J", avatar: "a16", xp: 37 },
    { name: "Vihaan T", avatar: "a33", xp: 21 },
    { name: "Tara N", avatar: "a40", xp: 12 },
  ],
};
export const WEEKLY_XP_BASE = 66;

/* ------------------------------------------------------------- quests */

export type Quest = { id: string; title: string; goal: number; xp: number };
export const QUESTS: Quest[] = [
  { id: "xp", title: "Earn 10 XP", goal: 10, xp: 3 },
  { id: "potd", title: "Solve the Problem of the Day", goal: 1, xp: 2 },
  { id: "practice", title: "Get 2 practice answers right", goal: 2, xp: 2 },
];
