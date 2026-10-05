/* All page content in one place, so copy changes never go hunting through JSX. */

export const YT_ID = "Zmz5gE9nJqY";

export const NAV = [
  { href: "#why", label: "Why IAIB" },
  { href: "#how", label: "How it works" },
  { href: "#curriculum", label: "Curriculum" },
  { href: "#mentors", label: "Mentors" },
  { href: "#faq", label: "FAQs" },
];

export const STATS = [
  { value: "9–12", label: "Classes" },
  { value: "30", label: "Live sessions" },
  { value: "₹2 Cr", label: "Scholarships" },
  { value: "₹25 L", label: "Prizes" },
  { value: "36 hrs", label: "Grand finale" },
];

export const REWARDS = [
  { ico: "Scholarship", big: "₹2 Cr", note: "",
    body: "A pool of ₹2 crore for participants who join the upGrad School of Technology campus programme in next year’s cohort." },
  { ico: "Prizes", big: "₹25 L", note: "",
    body: "Prizes worth ₹25 lakhs, with a ₹20 lakh pool contested at the Bengaluru finale." },
  { ico: "Investors", big: "Pitch", note: " to VCs",
    body: "Finalists pitch what they built to a room of venture investors." },
  { ico: "Record", big: "LOR", note: "",
    body: "Letters of recommendation for standout builders." },
  { ico: "Proof", big: "Certificates", note: "", span2: true,
    body: "Certificates and goodies for everyone who completes the live sessions." },
];

/* Each mock is one idea, not four copies of one: two carry a cursor and a
   floating card, two do not. */
export type Step = {
  no: string; title: string; body: string; bar: string;
  rows: { label: string; chip: string; tone: "on" | "soft" | "mute"; live?: boolean }[];
  float: { tick?: boolean; dot?: boolean; text: string };
  seg?: boolean[];
  cursor?: boolean;
  id?: string;
};

export const STEPS: Step[] = [
  {
    no: "01", title: "Registration", bar: "register.form", cursor: true,
    body: "Sign up on your own or through your school. Open to any student in classes 9 to 12 studying in India.",
    rows: [
      { label: "Classes 9–10", chip: "Open", tone: "on", live: true },
      { label: "Classes 11–12", chip: "Open", tone: "on" },
      { label: "Fee", chip: "None", tone: "mute" },
    ],
    float: { tick: true, text: "Enrolled" },
  },
  {
    no: "02", title: "Live learning", bar: "curriculum.live",
    body: "Thirty live sessions with industry mentors, covering AI fundamentals, Python, LLMs, and agentic AI.",
    rows: [
      { label: "Foundations", chip: "Done", tone: "mute" },
      { label: "Python", chip: "Done", tone: "mute" },
      { label: "Agents", chip: "Live", tone: "on", live: true },
      { label: "Evals", chip: "Next", tone: "soft" },
    ],
    float: { dot: true, text: "30 sessions" },
  },
  {
    no: "03", title: "Screening + vibecoding", bar: "screening.test", cursor: true,
    body: "Clear a 40-minute test, then vibe code a working prototype from one of fifty prompts to earn a finale spot.",
    rows: [
      { label: "Test · 40 min", chip: "Passed", tone: "mute" },
      { label: "Prototype", chip: "Building", tone: "on", live: true },
    ],
    float: { tick: true, text: "Shortlisted" },
    seg: [true, true, true, false, false, false],
  },
  {
    no: "04", title: "Grand finale", bar: "finale.bengaluru", id: "finale",
    body: "36 hours, offline in Bengaluru. Build, pitch to VCs, and compete for the ₹20 lakh prize pool.",
    rows: [
      { label: "Build · 36 h", chip: "Running", tone: "on", live: true },
      { label: "Pitch to VCs", chip: "Queued", tone: "soft" },
    ],
    float: { text: "₹20L pool" },
    seg: [true, true, true, true, false, false],
  },
];

export const MODULES = [
  { file: "01_foundations.py", n: 5, title: "AI Foundations",
    desc: "Start from zero. What AI actually is, how models learn, and where it already shapes your day.",
    items: ["How machines learn from data", "Models, training and inference", "Your first prompts", "Bias, safety and ethics", "AI in the real world"] },
  { file: "02_python.py", n: 5, title: "Python for AI",
    desc: "Just enough code to be dangerous. The Python you need to build, not a full CS degree.",
    items: ["Variables, logic and loops", "Lists, dicts and data shapes", "Functions and reusable code", "Reading and cleaning data", "Working in notebooks"] },
  { file: "03_llms.py", n: 6, title: "Large Language Models",
    desc: "Open the hood on the models behind ChatGPT and friends, then learn to steer them.",
    items: ["Tokens, embeddings and context", "Prompt engineering that works", "Retrieval and grounding (RAG)", "Evaluating what a model returns", "Hallucination and its limits", "Building your first LLM app"] },
  { file: "04_agents.py", n: 6, title: "Agentic AI",
    desc: "Move from answering questions to getting things done. Models that plan, use tools and act.",
    items: ["Tools and function calling", "Planning and reasoning loops", "Giving an agent memory", "Multi-agent systems", "Guardrails and failure modes", "Ship a working agent"] },
  { file: "05_vibecoding.py", n: 5, title: "Vibe Coding",
    desc: "Build real products with AI as your pair programmer. This is what the screening round tests.",
    items: ["Prototyping with AI tools", "Designing a usable interface", "Debugging alongside a model", "Shipping and deploying", "Demoing what you built"] },
  { file: "06_finale.py", n: 3, title: "Finale Prep",
    desc: "The last stretch before Bengaluru: sharpen the idea, the build plan and the pitch.",
    items: ["Framing a problem worth solving", "Planning a 36-hour build", "Pitching to a room of VCs"] },
];

/* PLACEHOLDER. The name, role and the six logos are stand-ins, and one supplied
   portrait fills every card. Nobody named here is the person pictured. */
export const MENTOR = {
  name: "Vishwa Mohan",
  role: "Founder & CEO, upGrad School of Technology",
  photo: "/assets/mentors/mentor.png",
};
export const MENTOR_COUNT = 8;

export const LOGOS = [
  { src: "/assets/logos/upgrad.png", alt: "upGrad School of Technology", cls: "lg-u" },
  { src: "/assets/logos/oracle.svg", alt: "Oracle", cls: "lg-w" },
  { src: "/assets/logos/walmart.svg", alt: "Walmart", cls: "lg-w" },
  { src: "/assets/logos/paypal.svg", alt: "PayPal", cls: "lg-p" },
  { src: "/assets/logos/linkedin.svg", alt: "LinkedIn", cls: "lg-w" },
  { src: "/assets/logos/physics-wallah.svg", alt: "Physics Wallah", cls: "lg-sq" },
];

export const SCHOOL_POINTS = [
  "Free AI learning for every enrolled student",
  "A national competition with ₹20 L+ in prizes",
  "Weekend sessions that never clash with school hours",
];

export const FAQS = [
  ["Who can participate?", "Any student in classes 9 to 12, studying at a school in India."],
  ["Is there a registration fee?", "No. Registration and participation are completely free."],
  ["Do I need prior coding or AI experience?", "No. The learning sessions start from the basics. All you need is curiosity about AI."],
  ["How are the learning sessions conducted?", "Sessions are held live online, on weekend mornings. They won’t clash with school, and you’ll still have the rest of your weekend free."],
  ["What does the screening round involve?", "There are two steps. First, a 40-minute test on what you learned in the sessions. Second, a small project that you build from one of 50 prompts we share. Screening is done individually."],
  ["How is the project evaluated?", "Projects are judged on five criteria: originality, ethical use of AI, clarity, scalability, and potential for real-world impact."],
  ["Can I participate with my friends as a team?", "Screening is individual. At the offline buildathon, finalists compete in teams of four, and teams are formed on the day of the event."],
  ["Will travel and accommodation be covered for finalists?", "Yes. Travel and accommodation costs are reimbursed once receipts are verified, so keep all your bills. Costs are reimbursed for one child and one parent only. The maximum cap on the child’s return travel is still to be confirmed."],
  ["How does the ₹2 crore scholarship work?", "The scholarship is a pool of ₹2 crore for participants who take admission to the upGrad School of Technology campus programme in next year’s cohort. It becomes null and void if the student takes admission elsewhere."],
  ["Is parental consent required?", "Yes. A parent or guardian must give consent at registration. We also recommend that a parent or guardian accompany the student throughout the offline buildathon."],
  ["Who owns the solutions built during the buildathon?", "The solutions belong to the teams that built them. Participants are free to keep developing their projects after the event."],
  ["What do I need for the online sessions?", "A laptop or computer with a stable internet connection."],
  ["What if I miss a live session?", "You can access recorded sessions, which will be uploaded."],
  ["What language are the sessions taught in?", "English."],
  ["How will I know if I’ve been shortlisted?", "Shortlisted participants will be informed by email and phone."],
] as const;
