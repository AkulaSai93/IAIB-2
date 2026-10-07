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
  { value: "₹20 L", label: "Prizes" },
  { value: "36 hrs", label: "Grand finale" },
];

export const REWARDS = [
  { ico: "Scholarship", big: "₹2 Cr", note: "",
    body: "A ₹2 crore scholarship pool for participants who join the upGrad School of Technology campus programme next year." },
  { ico: "Prizes", big: "₹20 L", note: "",
    body: "Win from a ₹20 lakh prize pool, awarded to the top teams at the grand finale in Bengaluru." },
  { ico: "Investors", big: "Pitch", note: " to VCs",
    body: "Finalists present what they built to a panel of venture capital investors." },
  { ico: "Recognition", big: "LOR", note: "",
    body: "Letters of recommendation for standout builders, to strengthen college and internship applications." },
  { ico: "Certificate", big: "For all", note: "",
    body: "Every student who completes the live sessions gets a certificate and IAIB goodies.", span2: true },
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
    no: "02", title: "Hybrid Learning Model", bar: "curriculum.live",
    body: "Recorded Sessions and Live Master Classes",
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
    body: "From one of our pre-set problem statements to earn a spot in the finale",
    rows: [
      { label: "Test · 40 min", chip: "Passed", tone: "mute" },
      { label: "Prototype", chip: "Building", tone: "on", live: true },
    ],
    float: { tick: true, text: "Shortlisted" },
    seg: [true, true, true, false, false, false],
  },
  {
    no: "04", title: "Grand finale", bar: "finale.bengaluru", id: "finale",
    body: "Offline in SSAHE Campus facilitated by uGSOT (near Bengaluru)",
    rows: [
      { label: "Build", chip: "Running", tone: "on", live: true },
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

/* The mentors. Portraits are trimmed transparent cut-outs in
   public/assets/mentors. ROLE IS A PLACEHOLDER until each mentor's title is
   confirmed. The company logos under each card are still the shared row
   below; per-mentor logos can replace them once they're supplied. */
export const MENTORS = [
  { name: "Gladden Rumao", role: "Staff Software AI Engineer", photo: "/assets/mentors/gladden-rumao.webp", logos: ["upgrad", "barclays"] },
  { name: "Gaurav Kaushik", role: "Senior Staff Software Engineer & Problem Solving Track Lead", photo: "/assets/mentors/gaurav-kaushik.webp", logos: ["salesforce", "paypal", "microsoft"] },
  { name: "Rishabh Bafna", role: "Senior AI Engineer & Lead Instructor", photo: "/assets/mentors/rishabh-bafna.webp", logos: ["upgrad", "iiitd"] },
  { name: "Rahul Yadav", role: "SDE 2 + Lead Instructor", photo: "/assets/mentors/rahul-yadav.webp", logos: ["upgrad"] },
  { name: "Jyoti Nigam", role: "Staff Software AI Engineer", photo: "/assets/mentors/jyoti-nigam.webp", logos: ["upgrad"] },
];

/* company marks for the mentor cards, keyed so each mentor lists their own */
export const MENTOR_LOGOS: Record<string, { src: string; alt: string; cls: string }> = {
  upgrad: { src: "/assets/logos/upgrad.png", alt: "upGrad School of Technology", cls: "lg-u" },
  barclays: { src: "/assets/logos/barclays.png", alt: "Barclays", cls: "lg-w lg-mono" },
  iiitd: { src: "/assets/logos/iiitd.png", alt: "IIIT Delhi", cls: "lg-sq lg-mono" },
  salesforce: { src: "/assets/logos/salesforce.svg", alt: "Salesforce", cls: "lg-sf" },
  paypal: { src: "/assets/logos/paypal.svg", alt: "PayPal", cls: "lg-p" },
  microsoft: { src: "/assets/logos/microsoft.svg", alt: "Microsoft", cls: "lg-sq" },
};

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
  ["How are the learning sessions conducted?", "Recorded sessions will be uploaded periodically and the schedule of live master classes will be shared in advance. Live master classes will be scheduled to work around school hours."],
  ["What does the screening round involve?", "A working prototype that you build from one of our pre-set problem statements to earn a spot in the finale."],
  ["How is the project evaluated?", "Projects are judged on five criteria: originality, ethical use of AI, clarity, scalability, and potential for real-world impact."],
  ["Can I participate with my friends as a team?", "Screening is individual. At the offline buildathon, finalists compete in teams of four, and teams are formed on the day of the event."],
  ["Will travel and accommodation be covered for finalists?", "Yes. It’s mandatory for students to be accompanied by a parent/legal guardian. Travel and accommodation costs will be reimbursed up to Rs. xxxxx, subject to submission of valid receipts."],
  ["How does the ₹2 crore scholarship work?", "The scholarship may be awarded from a pool of Rs. 2 crore, for participants who are currently in class 12 and take admission to the upGrad School of Technology campus programme in the 2027 cohort."],
  ["Is parental consent required?", "Yes. It is mandatory to have consent from a parent/legal guardian."],
  ["Who owns the solutions built during the buildathon?", "The solutions belong to the teams that built them. Participants are free to keep developing their projects after the event."],
  ["What do I need for the online sessions?", "A laptop/computer with a functional microphone and camera, and a stable internet connection of minimum 2 Mbps."],
  ["What if I miss a live master class?", "You can access recordings of the sessions on the student portal."],
  ["What language are the sessions taught in?", "English."],
  ["How will I know if I’ve been shortlisted?", "Shortlisted participants will be informed by email and phone."],
] as const;
