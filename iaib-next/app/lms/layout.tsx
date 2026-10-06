"use client";

import { LmsProvider } from "@/lib/lms/store";
import AppShell from "@/components/lms/AppShell";
import LmsGate from "@/components/lms/LmsGate";

/* The authenticated student area. There is no auth yet: the LMS reads the
   student from local state (lib/lms/store), so it can be previewed directly
   at /lms. Registration on the site lands here. */
export default function LmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <LmsProvider>
      <AppShell>
        <LmsGate>{children}</LmsGate>
      </AppShell>
    </LmsProvider>
  );
}
