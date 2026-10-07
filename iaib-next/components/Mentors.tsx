import { MENTOR_LOGOS, MENTORS } from "@/lib/data";

type Mentor = (typeof MENTORS)[number];

function Card({ m, dup }: { m: Mentor; dup?: boolean }) {
  const initials = m.name.split(" ").map((w) => w[0]).join("");
  return (
    <figure className="mcard relative min-w-0 m-0" aria-hidden={dup || undefined}>
      <div className="m-stage">
        <div className="m-echo e1 notch" aria-hidden />
        <div className="m-echo e2 notch" aria-hidden />
        <div className="m-echo e3 notch" aria-hidden />
        <div className="m-plate notch" aria-hidden />
        {/* stands in until --photo is set; a cut-out hides it automatically */}
        <div className="absolute inset-[21%_19%_0] z-[1] grid place-items-center font-h1 font-bold
                        text-[clamp(2rem,3vw,2.6rem)] tracking-[-0.04em] text-[#242424] select-none" aria-hidden>
          {initials}
        </div>
        <div className="m-cut" style={{ ["--photo" as string]: `url('${m.photo}')` }} aria-hidden />
        <div className="m-scrim" aria-hidden />
        <figcaption className="absolute left-0 right-0 bottom-[7%] z-[4] text-center px-[10px]">
          <h3 className="font-h1 font-bold uppercase m-0 text-white
                         text-[clamp(1.15rem,1.75vw,1.62rem)] tracking-[0.085em] leading-[1.08]
                         [text-shadow:0_2px_14px_rgba(0,0,0,.6)]">
            {m.name}
          </h3>
          <p className="mt-[10px] mb-0 font-body text-[13px] text-[#c4c4c4]
                        [text-shadow:0_1px_10px_rgba(0,0,0,.7)]">
            {m.role}
          </p>
        </figcaption>
      </div>

      <div className="m-co mt-4 pt-4 border-t border-line">
        {m.logos.map((k) => MENTOR_LOGOS[k]).map((l) => (
          /* no lazy here: in a marquee the cards parked off to the right sit
             outside the viewport indefinitely, so the trigger never fires and
             the logos pop in when the track carries them past */
          <img key={l.alt} className={`lg ${l.cls}`} src={l.src} alt={l.alt} decoding="async" />
        ))}
      </div>
    </figure>
  );
}

export default function Mentors() {
  return (
    <div className="mrail">
      {/* the set is duplicated and the track animates to exactly -50%, so frame
          0 and the last frame are the same picture and the wrap is invisible */}
      <div className="mtrack">
        {MENTORS.map((m) => <Card key={`a-${m.name}`} m={m} />)}
        {MENTORS.map((m) => <Card key={`b-${m.name}`} m={m} dup />)}
      </div>
    </div>
  );
}
