import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CodeTabs from "@/components/CodeTabs";
import Steps from "@/components/Steps";
import Curriculum from "@/components/Curriculum";
import Mentors from "@/components/Mentors";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import { LightboxProvider } from "@/components/Lightbox";
import { H2, Hl, Sub, SecHead, Sec, GhostLink, RegisterButton } from "@/components/ui";
import { REWARDS } from "@/lib/data";

export default function Page() {
  return (
    <LightboxProvider>
      <Nav />
      <main>
        <Hero />

        {/* ---- why ---- */}
        <section id="why" className="border-b border-line">
          <Sec>
            <div className="grid grid-cols-[1fr_1.15fr] gap-14 items-center max-[860px]:grid-cols-1 max-[860px]:gap-[34px]">
              <div>
                <H2>Start building<br /><Hl>this weekend</Hl></H2>
                <Sub>
                  No prior coding. Sessions begin at zero and end with you running real code.
                  A model, a prompt, a tool call, and something on screen that works.
                </Sub>
                <div className="flex flex-wrap gap-3 mt-8">
                  <GhostLink href="#curriculum">See all 30 sessions</GhostLink>
                </div>
              </div>
              <CodeTabs />
            </div>
          </Sec>
        </section>

        {/* ---- rewards ---- */}
        <section className="border-b border-line">
          <Sec>
            <SecHead>
              <H2>Why <Hl>IAIB?</Hl></H2>
              <Sub>
                AI is no longer the future, it&rsquo;s the skill shaping the present. IAIB makes AI literacy a
                norm for students from Classes 9&ndash;12 through hands-on learning and real-world problem solving.
              </Sub>
            </SecHead>
            {/* gap:1px over a line-coloured ground, so the rules never double up
                where two cells meet */}
            <div className="notch grid grid-cols-3 gap-px bg-line overflow-hidden max-[860px]:grid-cols-2 max-[560px]:grid-cols-1">
              {REWARDS.map((r) => (
                <div key={r.ico}
                  className={`px-[26px] py-[30px] max-[560px]:px-5 max-[560px]:py-6 min-w-0 transition-[background] duration-200 bg-surface
                              bg-linear-to-b from-white/[0.02] to-transparent
                              hover:bg-surface-2 hover:from-white/[0.06]
                              ${r.span2 ? "col-span-2 max-[560px]:col-span-1" : ""}`}>
                  <div className="font-mono text-[11px] tracking-[0.09em] uppercase text-fg-dim">{r.ico}</div>
                  <div className="font-mono font-medium text-[2.1rem] max-[560px]:text-[1.75rem] leading-none tracking-[-0.02em] tabular-nums text-white mt-[14px] mb-2">
                    {r.big}
                    {r.note && <small className="text-[0.95rem] text-fg-mid font-mono tracking-normal">{r.note}</small>}
                  </div>
                  <p className="m-0 text-fg-mid text-sm">{r.body}</p>
                </div>
              ))}
            </div>
          </Sec>
        </section>

        {/* ---- how ---- */}
        <section id="how" className="border-b border-line">
          <Sec>
            <SecHead>
              <H2>How does it <Hl>work?</Hl></H2>
              <Sub>Just a quick 4-step process and you&rsquo;re in.</Sub>
            </SecHead>
            <Steps />
          </Sec>
        </section>

        {/* ---- curriculum ---- */}
        <section id="curriculum" className="border-b border-line">
          <Sec>
            <SecHead>
              <H2>Explore the <Hl>Curriculum</Hl></H2>
              <Sub>Learn AI, build projects, and get ready to compete.</Sub>
            </SecHead>
            <Curriculum />
          </Sec>
        </section>

        {/* ---- mentors ---- */}
        <section id="mentors" className="border-b border-line">
          <div className="wrap pt-[88px] pb-[88px]">
            <SecHead>
              <H2>Meet Your <Hl>Mentors</Hl></H2>
              {/* a longer sentence than the other intros, and this section is
                  full-bleed, so it can carry a wider measure and hold two lines */}
              <Sub className="max-w-[78ch] max-[1180px]:max-w-[62ch]">
                Learn from industry experts, creators, and innovators who bring real-world experience,
                practical insights, and guidance to help you learn, build, and grow.
              </Sub>
            </SecHead>
          </div>
          {/* outside .wrap: the rail bleeds to both viewport edges */}
          <div className="pb-[88px] -mt-[88px]">
            <div className="wrap"><Mentors /></div>
          </div>
        </section>

        {/* ---- schools ---- */}
        <section className="border-b border-line">
          <Sec>
            <div className="grid grid-cols-[0.8fr_1.6fr] gap-10 items-center max-[1100px]:grid-cols-1 max-[860px]:gap-[34px]">
              <div>
                <H2>Bring the <Hl>AI Buildathon<br />to your school</Hl></H2>
                <Sub>
                  Your students are ready to build the future. Give them the opportunity to learn AI for free,
                  build real-world projects and compete nationally for &#8377;20L+ in prizes.
                </Sub>
                <div className="flex flex-wrap gap-3 mt-8">
                  <RegisterButton>Register your school</RegisterButton>
                </div>
              </div>
              <img src="/assets/school.webp" width={1672} height={941} loading="lazy"
                   alt="A school surrounded by cards: learn AI, build projects, compete for ₹20 lakh, for schools"
                   className="block w-full h-auto" />
            </div>
          </Sec>
        </section>

        {/* ---- faq ---- */}
        <section id="faq" className="border-b border-line">
          <Sec>
            <SecHead><H2>Frequently Asked <Hl>Questions</Hl></H2></SecHead>
            <Faq />
          </Sec>
        </section>
      </main>
      <Footer />
    </LightboxProvider>
  );
}
