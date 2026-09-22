import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

/* ── Font definitions ──────────────────────────────────────────── */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/* ── Metadata ──────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Digital Heroes — Golf, Charity & Monthly Draws",
  description:
    "Play golf, support charity, and win monthly prizes. Digital Heroes is a subscription platform where your game funds real-world impact.",
  keywords: "golf, charity, prize draw, subscription, stableford, digital heroes",
  openGraph: {
    title: "Digital Heroes",
    description: "Play golf. Support charity. Win prizes.",
    type: "website",
  },
};

/* ── Root layout ───────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${manrope.variable}`}>
      <body className="min-h-full flex flex-col antialiased">
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
