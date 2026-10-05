import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BotCursor from "@/components/BotCursor";
import { RegisterProvider } from "@/components/register/RegisterFlow";
import ScrollReveal from "@/components/ScrollReveal";

/* next/font self-hosts these and emits the @font-face rules, so there is no
   render-blocking request to Google and no layout shift from a late swap.
   Helvetica stays a system face — it is the h1 voice and is not downloaded. */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bricolage",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const DESC =
  "Ignite AI Buildathon - India's largest AI talent discovery platform for school students. " +
  "30 live sessions, a national screening round, and a 36-hour offline finale in Bengaluru. Free, for classes 9 to 12.";

export const metadata: Metadata = {
  title: "Ignite AI Buildathon",
  description: DESC,
  openGraph: { type: "website", title: "IAIB - Ignite AI Buildathon", description: DESC },
  twitter: { card: "summary_large_image" },
  icons: {
    icon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E" +
      "%3Crect width='32' height='32' rx='7' fill='%23000'/%3E%3Ctext x='16' y='22' " +
      "font-family='ui-monospace,Menlo,monospace' font-size='15' fill='%23f0402f' " +
      "text-anchor='middle'%3E%26lt;/%26gt;%3C/text%3E%3C/svg%3E",
  },
};

export const viewport = { themeColor: "#000000", width: "device-width", initialScale: 1, viewportFit: "cover" as const };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${jetbrains.variable}`}>
      <body><RegisterProvider>{children}</RegisterProvider><BotCursor /><ScrollReveal /></body>
    </html>
  );
}
