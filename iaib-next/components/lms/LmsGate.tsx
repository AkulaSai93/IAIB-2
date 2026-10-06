"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useLms } from "@/lib/lms/store";
import { OnboardingFlow, ProfileCompletionModal } from "./Onboarding";
import ProductTour from "./ProductTour";
import { Portal } from "./ui";

/* Decides what overlays the LMS on arrival:
   1. first visit           → onboarding (avatar, then profile)
   2. profile still skipped → the completion modal, once per browser session
   3. tour not yet taken    → the spotlight tour
   While state loads from storage the page shows skeletons, not a flash. */
const DISMISSED = "iaib.lms.profileDismissed";
export const ACCESS = "iaib.lms.access";
const ARRIVAL_DELAY = 1000;

export default function LmsGate({ children }: { children: ReactNode }) {
  const { student, ready, patch } = useLms();
  const [phase, setPhase] = useState<"none" | "onboarding" | "profile" | "tour">("none");

  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  /* The LMS comes after registration: website → register → member card →
     here. Entry is granted only by the member card's
     "Enter your LMS" button; anyone else goes back to the website to sign up. `?preview` skips this for demos. */
  useEffect(() => {
    let ok = false;
    try {
      // only a registration that reached the member card grants entry
      ok = localStorage.getItem(ACCESS) === "1" || location.search.includes("preview");
    } catch {}
    if (ok) setAllowed(true);
    else router.replace("/?register=1");
  }, [router]);

  useEffect(() => {
    if (!ready || !allowed) return;
    // let the student take in the LMS for a moment before anything pops up
    const t = setTimeout(() => {
      if (!student.onboardingCompleted) return setPhase("onboarding");
      let dismissed = false;
      try { dismissed = sessionStorage.getItem(DISMISSED) === "1"; } catch {}
      if (!student.profileCompleted && !dismissed) return setPhase("profile");
      if (!student.tourCompleted) return setPhase("tour");
    }, ARRIVAL_DELAY);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, allowed]);

  const afterProfile = () => {
    try { sessionStorage.setItem(DISMISSED, "1"); } catch {}
    setPhase(student.tourCompleted ? "none" : "tour");
  };

  if (!ready || !allowed)
    return (
      <div aria-busy="true" aria-label="Loading">
        <div className="skel h-4 w-32 mb-4" /><div className="skel h-12 w-[60%] mb-10" />
        <div className="grid grid-cols-4 max-[900px]:grid-cols-2 gap-4">{[0, 1, 2, 3].map((i) => <div key={i} className="skel h-28" />)}</div>
        <div className="skel h-72 mt-6" />
      </div>
    );

  return (
    <>
      {children}
      <Portal>
        {phase === "onboarding" && <OnboardingFlow onFinish={afterProfile} />}
        {phase === "profile" && <ProfileCompletionModal onClose={afterProfile} />}
        {phase === "tour" && <ProductTour onFinish={() => { patch({ tourCompleted: true }); setPhase("none"); }} />}
      </Portal>
    </>
  );
}
