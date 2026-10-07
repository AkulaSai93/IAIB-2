import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Steps from "@/components/Steps";
import Curriculum from "@/components/Curriculum";
import Mentors from "@/components/Mentors";
import Faq from "@/components/Faq";
import BotCursor from "@/components/BotCursor";
import ScrollReveal from "@/components/ScrollReveal";
import Rewards from "@/components/Rewards";
import PartnerStrip from "@/components/PartnerStrip";
import Footer from "@/components/Footer";
import { LightboxProvider } from "@/components/Lightbox";
import { H2, Hl, Sub, SecHead, Sec, RegisterButton } from "@/components/ui";

export default function Page() {
  return (
    <LightboxProvider>
      <Nav />
      <main>
        <Hero />
        <PartnerStrip className="max-[1020px]:hidden" />

        {/* ---- rewards ---- */}
        <section id="why" className="border-b border-line">
          <Sec>
            <SecHead>
              <H2>Why <Hl>IAIB?</Hl></H2>
              <Sub className="!max-w-[86ch]">
                AI is no longer the future, it&rsquo;s the skill shaping the present. IAIB makes AI literacy a
                norm for students from Classes 9&ndash;12 through hands-on learning and real-world problem solving.
              </Sub>
            </SecHead>
            <Rewards />
          </Sec>
        </section>

        {/* ---- how ---- */}
        <section id="how" className="border-b border-line">
          <Sec>
            <SecHead>
              <H2>The Four <Hl>Stages</Hl></H2>
            </SecHead>
            <Steps />
            <div className="flex justify-center mt-12 max-[560px]:mt-9 max-[560px]:[&>*]:w-full max-[560px]:[&>*]:justify-center">
              <RegisterButton lg>Register now</RegisterButton>
            </div>
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
              <H2>Industry <Hl>Bigwigs</Hl></H2>
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
                <H2>Bring the <Hl>IAIB Buildathon<br />to your school</Hl></H2>
                <Sub>
                  Your students are ready to build the future. Give them the opportunity to learn AI for free,
                  build real-world projects and compete nationally for &#8377;20L in prizes.
                </Sub>
                <div className="flex flex-wrap gap-3 mt-8">
                  <RegisterButton school>Register your school</RegisterButton>
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
      {/* marketing-page only: the bot cursor and the scroll reveals stay out of the LMS */}
      <BotCursor />
      <ScrollReveal />
    </LightboxProvider>
  );
}
