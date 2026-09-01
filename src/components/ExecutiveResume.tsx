"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { soundFx } from "@/lib/soundFx";

interface ExecutiveResumeProps {
  onSwitchMode?: (mode: "visual" | "resume") => void;
  showModeToggle?: boolean;
}

export default function ExecutiveResume({
  onSwitchMode,
  showModeToggle = true,
}: ExecutiveResumeProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    soundFx.playClick();
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyMarkdown = async () => {
    soundFx.playClick();
    const markdownContent = `# Balaji S. (balajitechlabs)
**Principal Android Architect & Full Stack Developer**
Bengaluru, Karnataka, India 🇮🇳 | admin@balajitechlab.com | https://balajitechlab.com

## SUMMARY
Principal Android Architect and Full-Stack Engineer with deep expertise in Android Clean Architecture (UDF), Jetpack Compose, Material 3 Expressive, Kotlin Coroutines/Flow, and Cloudflare Edge microservices. Creator of QuickDash and the ||BTL||™ open-source ecosystem.

## CORE COMPETENCIES
- **Android Engineering**: Kotlin, Jetpack Compose, Material 3 Expressive, AGSL Shaders, Coroutines, StateFlow, Hilt/Koin DI, Android CLI / Scrcpy.
- **Full-Stack & Cloud**: Next.js (App Router), TypeScript, React 19, Cloudflare Workers & Pages, OpenNext Edge Runtime, Supabase, Tailwind CSS.
- **Architecture**: Unidirectional Data Flow (UDF), Clean Architecture, REST/GraphQL APIs, Micro-frontends.

## KEY PROJECTS & ARCHITECTURAL HIGHLIGHTS
### QuickDash — Android System Management Dashboard
- Designed and authored the architecture for QuickDash, a high-performance Android quick-toggle and device management hub.
- Implemented Material 3 Expressive UI, real-time memory monitoring, and zero-leak background services.
- URL: https://quickdash.balajitechlab.com | https://play.google.com/store/apps/dev?id=9073716923131512981

### Vivo OriginOS & macOS Interactive Portfolios
- Engineered interactive device showcases reproducing OriginOS 5 dynamic capsules, Klotski widgets, and macOS Sequoia terminal engines.
- Optimized WebGL domain-warped topographic shaders running at 120 FPS.

### Discord Live Presence & Music Stream Engine
- Built authenticated real-time WebSocket presence synchronization displaying live Spotify music playback and coding activity with sub-millisecond latency.

## EDUCATION
- **Bachelor of Computer Science (CS)** — New Horizon College, Kasturi-Nagar, Bangalore, India.

## CONTACT & PROFILES
- Portfolio: https://balajitechlab.com
- GitHub: https://github.com/balajitechlabs
- LinkedIn: https://linkedin.com/in/balajitechlabs
- Google Play Console: https://play.google.com/store/apps/dev?id=9073716923131512981
- Telegram: https://t.me/balajitechlabs
`;

    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      soundFx.playSuccess();
      toast.success("Markdown Resume Copied! 📋", {
        description: "Ready to paste into job portals and application forms.",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Failed to copy resume to clipboard.");
    }
  };

  const handleDownloadVCard = () => {
    soundFx.playClick();
    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:S.;Balaji;;;
FN:Balaji S. (balajitechlabs)
ORG:balajitechlabs
TITLE:Principal Android Architect & Full Stack Developer
EMAIL;TYPE=INTERNET,PREF:admin@balajitechlab.com
URL;TYPE=WORK:https://balajitechlab.com
URL;TYPE=GITHUB:https://github.com/balajitechlabs
URL;TYPE=LINKEDIN:https://linkedin.com/in/balajitechlabs
ADR;TYPE=WORK:;;Kasturi-Nagar;Bengaluru;Karnataka;;India
NOTE:Principal Android Architect & Creator of QuickDash and ||BTL||™
END:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Balaji_S_balajitechlabs.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Contact Card (.vcf) Downloaded! 📇");
  };

  return (
    <div className="resume-container">
      {/* ── Recruiter & Actions Toolbar (Hidden on Print) ── */}
      <div className="resume-toolbar">
        <div className="resume-ambient-beam" aria-hidden="true" />
        <div className="resume-toolbar-group">
          {showModeToggle && (
            <button
              onClick={() => {
                soundFx.playPop();
                if (onSwitchMode) {
                  onSwitchMode("visual");
                } else {
                  router.push("/");
                }
              }}
              className="resume-pill-btn"
              data-pill="visual"
              title="Switch back to interactive visual portfolio"
            >
              <span className="material-symbols-rounded">rocket_launch</span>
              <span>Visual Mode</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="resume-pill-btn"
            data-pill="print"
            title="Save as single-page PDF or print"
          >
            <span className="material-symbols-rounded">print</span>
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="resume-pill-btn"
            data-pill="copy"
            title="Copy plain markdown text for job applications"
          >
            <span className="material-symbols-rounded">
              {copied ? "check" : "content_copy"}
            </span>
            <span>{copied ? "Copied!" : "Copy Markdown"}</span>
          </button>

          <button
            onClick={handleDownloadVCard}
            className="resume-pill-btn"
            data-pill="vcard"
            title="Download vCard contact file"
          >
            <span className="material-symbols-rounded">contact_page</span>
            <span>Save Contact (.vcf)</span>
          </button>
        </div>

        <div className="resume-toolbar-group">
          <a
            href="mailto:admin@balajitechlab.com"
            className="resume-pill-btn"
            data-pill="email"
            title="Send an email to Balaji S."
            onClick={() => soundFx.playPop()}
          >
            <i className="fa-regular fa-envelope" />
            <span>Email</span>
          </a>

          <a
            href="https://t.me/balajitechlabs"
            target="_blank"
            rel="noopener noreferrer"
            className="resume-pill-btn"
            data-pill="telegram"
            title="Open Telegram Chat"
            onClick={() => soundFx.playPop()}
          >
            <i className="fa-brands fa-telegram" />
            <span>Telegram</span>
          </a>

          <a
            href="https://github.com/balajitechlabs"
            target="_blank"
            rel="noopener noreferrer"
            className="resume-pill-btn"
            data-pill="github"
            title="Open GitHub Profile"
            onClick={() => soundFx.playPop()}
          >
            <i className="fa-brands fa-github" />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* ── ATS-Optimized Clean Resume Paper ── */}
      <article className="resume-paper">
        <div className="resume-ambient-beam" aria-hidden="true" />
        {/* ── Header ── */}
        <header className="resume-header">
          <div className="resume-header-top">
            <h1 className="resume-title">Balaji S.</h1>
            <span className="resume-brand">||BTL||™ · balajitechlabs</span>
          </div>

          <p className="resume-subtitle">
            Principal Android Architect & Full-Stack Developer
          </p>

          <div className="resume-contact-bar">
            <span className="resume-contact-item">
              <span className="material-symbols-rounded" style={{ fontSize: "15px" }}>
                location_on
              </span>
              <span>Bengaluru, Karnataka, India 🇮🇳</span>
            </span>

            <a href="mailto:admin@balajitechlab.com" className="resume-contact-item">
              <span className="material-symbols-rounded" style={{ fontSize: "15px" }}>
                mail
              </span>
              <span>admin@balajitechlab.com</span>
            </a>

            <a
              href="https://balajitechlab.com"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-contact-item"
            >
              <span className="material-symbols-rounded" style={{ fontSize: "15px" }}>
                language
              </span>
              <span>balajitechlab.com</span>
            </a>

            <a
              href="https://github.com/balajitechlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-contact-item"
            >
              <span className="material-symbols-rounded" style={{ fontSize: "15px" }}>
                code
              </span>
              <span>github.com/balajitechlabs</span>
            </a>

            <a
              href="https://linkedin.com/in/balajitechlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-contact-item"
            >
              <span className="material-symbols-rounded" style={{ fontSize: "15px" }}>
                badge
              </span>
              <span>linkedin.com/in/balajitechlabs</span>
            </a>
          </div>
        </header>

        {/* ── Executive Summary ── */}
        <section className="resume-section">
          <h2 className="resume-section-heading">Executive Profile</h2>
          <p className="resume-summary">
            Results-driven <strong>Principal Android Architect</strong> and <strong>Full-Stack Engineer</strong> based in Bengaluru, India. Recognized for crafting robust, high-performance mobile architectures using modern Jetpack Compose, Material 3 Expressive, Kotlin Coroutines/Flow, and Cloudflare Edge microservices. Creator of <strong>QuickDash</strong> and the <strong>||BTL||™</strong> open-source toolchain ecosystem, committed to human craftsmanship, zero-bloat architecture, and responsive user experiences.
          </p>
        </section>

        {/* ── Core Competencies ── */}
        <section className="resume-section">
          <h2 className="resume-section-heading">Core Competencies & Technology Stack</h2>
          <div className="resume-skills-grid">
            <div className="resume-skill-card">
              <h3 className="resume-skill-title">📱 Android Architecture & Jetpack Compose</h3>
              <div className="resume-skill-tags">
                <span className="resume-skill-tag">Kotlin Multiplatform</span>
                <span className="resume-skill-tag">Jetpack Compose</span>
                <span className="resume-skill-tag">Material 3 Expressive</span>
                <span className="resume-skill-tag">Coroutines & StateFlow</span>
                <span className="resume-skill-tag">Clean Architecture (UDF)</span>
                <span className="resume-skill-tag">AGSL Progressive Shaders</span>
                <span className="resume-skill-tag">Hilt / Koin DI</span>
                <span className="resume-skill-tag">Android CLI / Scrcpy</span>
              </div>
            </div>

            <div className="resume-skill-card">
              <h3 className="resume-skill-title">🌐 Full-Stack Web & Cloudflare Edge</h3>
              <div className="resume-skill-tags">
                <span className="resume-skill-tag">Next.js 15+ (App Router)</span>
                <span className="resume-skill-tag">React 19 & TypeScript</span>
                <span className="resume-skill-tag">Cloudflare Workers & Pages</span>
                <span className="resume-skill-tag">OpenNext Edge Runtime</span>
                <span className="resume-skill-tag">WebGL / GLSL Shaders</span>
                <span className="resume-skill-tag">Tailwind CSS & Framer Motion</span>
                <span className="resume-skill-tag">Supabase Postgres</span>
                <span className="resume-skill-tag">REST & GraphQL APIs</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Flagship Engineering Projects ── */}
        <section className="resume-section">
          <h2 className="resume-section-heading">Flagship Engineering Projects & Impact</h2>

          <div className="resume-item">
            <div className="resume-item-header">
              <h3 className="resume-item-title">QuickDash — Android Management & Quick-Settings Hub</h3>
              <span className="resume-item-role">Lead Architect & Author</span>
              <span className="resume-item-date">2024 – Present</span>
            </div>
            <p className="resume-item-desc">
              High-performance Android utility and device dashboard built with Jetpack Compose, Material 3 Expressive design tokens, and real-time hardware gauges.
            </p>
            <ul className="resume-item-bullets">
              <li>Engineered zero-jank 120 FPS UI with custom AGSL progressive blur shaders and dynamic Material You theme extraction.</li>
              <li>Architected power-efficient background services with structured coroutines, preventing battery drain and memory leaks.</li>
              <li>Published across Google Play Console and GitHub with thousands of active downloads.</li>
            </ul>
          </div>

          <div className="resume-item">
            <div className="resume-item-header">
              <h3 className="resume-item-title">Vivo OriginOS & macOS Interactive Portfolios</h3>
              <span className="resume-item-role">Architect & Full-Stack Developer</span>
              <span className="resume-item-date">2025 – Present</span>
            </div>
            <p className="resume-item-desc">
              Comprehensive interactive operating system simulations in the browser celebrating high-craftsmanship hardware and software ecosystems.
            </p>
            <ul className="resume-item-bullets">
              <li>Built curved AMOLED Vivo V60e frame with OriginOS 5 dynamic capsule notifications and Klotski widgets.</li>
              <li>Engineered interactive macOS Sequoia Unix terminal emulator with custom command parsers and virtual file system navigation.</li>
              <li>Implemented real-time WebGL domain-warping mathematical topographic isoline shader running at 120 FPS.</li>
            </ul>
          </div>

          <div className="resume-item">
            <div className="resume-item-header">
              <h3 className="resume-item-title">Real-Time Discord Music & Presence Engine</h3>
              <span className="resume-item-role">Backend & Integration Engineer</span>
              <span className="resume-item-date">2024 – Present</span>
            </div>
            <p className="resume-item-desc">
              Low-latency WebSocket sync pipeline displaying real-time developer activity, Spotify music streaming, and IDE coding status.
            </p>
            <ul className="resume-item-bullets">
              <li>Implemented sub-millisecond presence updates with custom cursor hover capsule animations and dynamic audio wave visualizers.</li>
            </ul>
          </div>
        </section>

        {/* ── Education & Honors ── */}
        <section className="resume-section">
          <h2 className="resume-section-heading">Education & Professional Honors</h2>
          <div className="resume-edu-grid">
            <div className="resume-item">
              <div className="resume-item-header">
                <h3 className="resume-item-title">Bachelor of Computer Science (B.Sc CS)</h3>
                <span className="resume-item-role">New Horizon College</span>
                <span className="resume-item-date">Bengaluru, India</span>
              </div>
              <p className="resume-item-desc">
                Specialized in Object-Oriented Software Engineering, Data Structures & Algorithms, Distributed Systems, and Mobile Architecture.
              </p>
            </div>
            <div className="resume-item">
              <div className="resume-item-header">
                <h3 className="resume-item-title">Open Source Contributions & Developer Badges</h3>
                <span className="resume-item-role">GitHub & Google Play</span>
                <span className="resume-item-date">Global</span>
              </div>
              <p className="resume-item-desc">
                Verified Google Play Console Developer · GitHub Arctic Code Vault Contributor · Pull Shark · Maintainer of the <code>||BTL||™</code> toolchains.
              </p>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
