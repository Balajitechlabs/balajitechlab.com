import type { Metadata } from "next";
import ExecutiveResume from "@/components/ExecutiveResume";
import WarpShaderBackground from "@/components/WarpShaderBackground";
import Navbar from "@/components/Navbar";
import Cursor from "@/components/Cursor";

export const metadata: Metadata = {
  title: "Executive Resume — Balaji S. (balajitechlabs) | Principal Android Architect",
  description:
    "Official 1-Page Executive Resume of Balaji S. (balajitechlabs) — Principal Android Architect, Full-Stack Developer & CS Engineer from Bengaluru, India 🇮🇳.",
  alternates: {
    canonical: "https://balajitechlab.com/resume",
  },
  openGraph: {
    title: "Executive Resume — Balaji S. (balajitechlabs)",
    description:
      "Official 1-Page Engineering Resume of Balaji S. — Principal Android Architect, Full-Stack Developer & Creator of QuickDash.",
    url: "https://balajitechlab.com/resume",
    siteName: "balajitechlabs",
    images: [
      {
        url: "https://balajitechlab.com/assets/img/web-preview.png?v=2026",
        width: 1200,
        height: 630,
        alt: "Balaji S. Executive Resume",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Executive Resume — Balaji S. (balajitechlabs)",
    description:
      "Principal Android Architect & Full-Stack Developer from Bengaluru, India 🇮🇳. Creator of QuickDash and ||BTL||™.",
    images: ["https://balajitechlab.com/assets/img/web-preview.png?v=2026"],
  },
};

export default function ResumePage() {
  return (
    <>
      <Cursor />
      <WarpShaderBackground opacity={0.65} />
      <Navbar />
      <main style={{ minHeight: "100vh", position: "relative", zIndex: 10, paddingTop: "1.5rem" }}>
        <ExecutiveResume showModeToggle={false} />
      </main>
    </>
  );
}
