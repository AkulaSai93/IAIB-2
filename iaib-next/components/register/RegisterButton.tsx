"use client";

import type { ReactNode } from "react";
import { useRegister, type Path } from "./RegisterFlow";

/* Opens the registration dialog. `path` picks which flow it starts on:
   a student signing themselves up, or a school coordinator. */
export default function RegisterButton({ children, className, path = "individual" }:
  { children: ReactNode; className: string; path?: Path }) {
  const { open } = useRegister();
  return (
    <button type="button" className={className} onClick={() => open(path)}>
      {children}
    </button>
  );
}
