"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Navbar from "@/components/Navbar";
import DiscordMusicWidget from "@/components/DiscordMusicWidget";
import SocialsChips from "@/components/SocialsChips";
import GitHubCalendarCard from "@/components/GitHubCalendarCard";
import GitHubChips from "@/components/GitHubChips";

import Photo3DGallery from "@/components/Photo3DGallery";
import TechStackSection from "@/components/TechStackSection";
import Footer from "@/components/Footer";
import WarpShaderBackground from "@/components/WarpShaderBackground";
import UniverseWithinBackground from "@/components/UniverseWithinBackground";
import VoronoiShaderBackground from "@/components/VoronoiShaderBackground";
import DeveloperPalette from "@/components/DeveloperPalette";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { soundFx } from "@/lib/soundFx";

import "@/styles/index/photos-switcher.css";
import "@/styles/index/highlights.css";
import "@/styles/index/form.css";
import "@/styles/index/discord-music.css";
import "@/styles/index/github-stats.css";

interface HomeClientProps {
  updatesSection: React.ReactNode;
}

export default function HomeClient({
  updatesSection,
}: HomeClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [shaderColors, setShaderColors] = useState<{ light: string; dark: string } | null>(null);
  const [activeTheme, setActiveTheme] = useState<"topographic" | "universe" | "voronoi">("topographic");

  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPlatform, setContactPlatform] = useState("telegram");
  const [contactHandle, setContactHandle] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const SOCIAL_PREFIXES: Record<string, { label: string; prefix: string; placeholder: string; icon: string }> = {
    telegram: { label: "Telegram", prefix: "t.me/", placeholder: "@username or username", icon: "send" },
    discord: { label: "Discord", prefix: "discord.com/users/", placeholder: "user_id or username", icon: "forum" },
    instagram: { label: "Instagram", prefix: "instagram.com/", placeholder: "username", icon: "photo_camera" },
    x: { label: "X (Twitter)", prefix: "x.com/", placeholder: "username", icon: "tag" },
    github: { label: "GitHub", prefix: "github.com/", placeholder: "username", icon: "code" },
    linkedin: { label: "LinkedIn", prefix: "linkedin.com/in/", placeholder: "vanity-url", icon: "work" },
    whatsapp: { label: "WhatsApp", prefix: "wa.me/", placeholder: "+919876543210", icon: "chat" },
  };

  const [projectDetails, setProjectDetails] = useState<Record<string, { stars: number; downloads: number; latestReleaseAt: string }> | null>(null);

  useEffect(() => {
    fetch("/project-details.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setProjectDetails(data);
      })
      .catch(() => {});
  }, []);

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const timeAgo = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    return `${diffYears}y ago`;
  };

  const PROJECT_TAGS: Record<string, string[]> = {
    quickdash: ["Android", "Kotlin", "Compose", "Power Tool"],
    "discord-music-card": ["TypeScript", "SVG", "Discord API", "Spotify"],
    "universal-updater": ["Raycast", "macOS", "CLI", "12+ PMs"],
    "play-console-tools": ["Python", "Play Store", "Automation", "CLI"],
    macos: ["Apple M1", "8GB RAM", "256GB SSD", "macOS", "Workflow"],
    "password-generator": ["Security", "Entropy", "Vanilla JS", "Crypto"],
  };

  const renderProjectStats = (key: string) => {
    const detail = projectDetails ? projectDetails[key] : null;
    const tags = PROJECT_TAGS[key] || [];

    return (
      <div className="highlight-stats">
        {detail && detail.stars > 0 && (
          <span className="highlight-stat-badge" title={`${detail.stars} stars`}>
            <span className="material-symbols-rounded">star</span>
            <span>{formatCount(detail.stars)}</span>
          </span>
        )}
        {detail && detail.downloads > 0 && (
          <span className="highlight-stat-badge" title={`${detail.downloads} downloads`}>
            <span className="material-symbols-rounded">download</span>
            <span>{formatCount(detail.downloads)}</span>
          </span>
        )}
        {detail && detail.latestReleaseAt && (
          <span className="highlight-stat-badge" title={`Last release: ${new Date(detail.latestReleaseAt).toLocaleString()}`}>
            <span className="material-symbols-rounded">schedule</span>
            <span>{timeAgo(detail.latestReleaseAt)}</span>
          </span>
        )}
        {tags.map((tag) => (
          <span key={tag} className="highlight-stat-badge highlight-stat-tag">
            <span>{tag}</span>
          </span>
        ))}
      </div>
    );
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");

    const form = e.currentTarget;
    const formValues = new FormData(form);

    const name = contactName.trim() || (formValues.get("name") as string)?.trim() || "";
    const email = contactEmail.trim() || (formValues.get("_replyto") as string)?.trim() || (formValues.get("email") as string)?.trim() || "";
    const platform = contactPlatform || (formValues.get("social_platform") as string) || "telegram";
    const handle = contactHandle.trim() || (formValues.get("social_handle") as string)?.trim() || "";
    const message = contactMessage.trim() || (formValues.get("message") as string)?.trim() || "";

    if (!name || !email || !message) {
      setFormStatus("error");
      return;
    }

    try {
      // 1. Dispatch to instant Telegram Bot API route
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          platform,
          handle,
          message,
        }),
      });

      // 2. Also forward to Netlify Forms for HTML form compatibility
      fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formValues as any).toString(),
      }).catch(() => {});

      if (res.ok) {
        setFormStatus("success");
        setContactName("");
        setContactEmail("");
        setContactHandle("");
        setContactMessage("");
        form.reset();

        // Audio celebration + Confetti burst + Toast notification
        soundFx.playSuccess();
        toast.success("Message dispatched to Telegram! 🚀", {
          description: "Thank you for reaching out, Balaji will get back to you shortly.",
        });
        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.8 },
            colors: ["#38bdf8", "#818cf8", "#c084fc", "#34d399", "#fbbf24", "#f43f5e"],
            disableForReducedMotion: true,
          });
        } catch {}
      } else {
        setFormStatus("error");
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Contact submit error:", error);
      setFormStatus("error");
      toast.error("Network error. Please try again.");
    }
  };

  // Helper to dynamically calculate age without revealing birth date in text
  const calculateAge = (birthDateString: string = "2006-11-24"): number => {
    const today = new Date();
    const birth = new Date(birthDateString);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedTheme = localStorage.getItem("btl_theme") as
        | "topographic"
        | "universe"
        | "voronoi"
        | null;
      if (
        savedTheme &&
        (savedTheme === "topographic" ||
          savedTheme === "universe" ||
          savedTheme === "voronoi")
      ) {
        setActiveTheme(savedTheme);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);



  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll(".item") as NodeListOf<HTMLElement>;
    let i = 0;

    const animate = () => {
      if (i < items.length) {
        items[i].style.opacity = "1";
        items[i].style.transform = "translateY(0)";
        i++;
        setTimeout(animate, 150);
      }
    };

    setTimeout(() => {
      animate();
    }, 100);

    const handleScroll = () => {
      const scroll = window.scrollY;
      setIsScrolled(scroll > 100);

      items.forEach((item) => {
        if (item.id === "logo") return;
        const position = item.getBoundingClientRect();
        if (position.top > window.innerHeight - 10 || position.bottom < 20) {
          item.style.scale = "0.85";
        } else {
          item.style.scale = "1";
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ── 1. Lenis Smooth Momentum Inertial Scrolling ──
  useEffect(() => {
    let lenisInstance: any = null;
    let rafId: number;

    const startLenis = async () => {
      try {
        const Lenis = (await import("lenis")).default;
        lenisInstance = new Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });

        function raf(time: number) {
          lenisInstance?.raf(time);
          rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);
      } catch (err) {
        console.error("Lenis init error:", err);
      }
    };

    startLenis();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
    };
  }, []);

  // ── 2. 3D Holographic Parallax Tilt on Project Cards ──
  useEffect(() => {
    const cards = document.querySelectorAll(".highlight-item");

    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const card = mouseEvent.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };

    const handleMouseLeave = (e: Event) => {
      const card = (e as MouseEvent).currentTarget as HTMLElement;
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    };

    cards.forEach((card) => {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [showAllProjects]);





  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (activeTheme === "topographic") {
      const topoColors = {
        light: "hsl(0, 0%, 20%)",
        dark: "hsl(0, 0%, 94%)",
      };
      setShaderColors(topoColors);
      document.documentElement.style.setProperty(
        "--primary-color",
        isDark ? topoColors.dark : topoColors.light
      );
    }
  }, [activeTheme]);

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getActiveThemeColors = () => {
    if (activeTheme === "topographic") {
      return {
        light: "hsl(0, 0%, 20%)",
        dark: "hsl(0, 0%, 94%)",
      };
    }
    return (
      shaderColors || {
        light: "hsl(280, 75%, 45%)",
        dark: "hsl(280, 85%, 65%)",
      }
    );
  };

  const themeColors = getActiveThemeColors();

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            --primary-color: ${themeColors.light};
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --primary-color: ${themeColors.dark};
            }
          }
        `,
        }}
      />

      {activeTheme === "universe" && (
        <UniverseWithinBackground opacity={0.52} />
      )}
      {activeTheme === "voronoi" && (
        <VoronoiShaderBackground opacity={0.52} />
      )}
      {activeTheme === "topographic" && (
        <WarpShaderBackground
          opacity={0.65}
          onThemeColorsChange={setShaderColors}
        />
      )}

      <Navbar />
      <DeveloperPalette
        activeTheme={activeTheme}
        onThemeSelect={(theme) => {
          setActiveTheme(theme);
          try {
            localStorage.setItem("btl_theme", theme);
          } catch {}
        }}
      />




      <div className="container">
        <section id="intro">
          <div className="heading">
            <a href="#" onClick={handleScrollToTop} aria-label="Back to top">
              <div
                id="logo"
                className={`home-logo theme-${activeTheme} item ${isScrolled ? "scrolled" : ""}`}
              ></div>

            </a>



            <div className="container-mini">
              <h1 id="title" className="item">
                <span className="name-primary">BALAJITECHLABS</span>
                <br />
                <span className="name-secondary">Balaji.S</span>
              </h1>


              <SocialsChips />
              <GitHubCalendarCard isMounted={isMounted} />
              <GitHubChips />
              <DiscordMusicWidget />

            </div>
          </div>
        </section>

        {updatesSection}

        <section id="projects">
          <div className="heading item">
            <h2>Showcase</h2>
          </div>
          <div className="container">
            <div id="highlights">
              <a
                id="quickdash"
                className="highlight-item item"
                href="https://quickdash.balajitechlab.com"
                target="_blank"
                rel="noopener noreferrer"
                data-title="https://quickdash.balajitechlab.com"
              >
                <div className="highlight-thumbnail"></div>
                <div className="highlight-content">
                  <h3>QuickDash</h3>
                  <p className="highlight-description">
                    Native Android power-user utility & system panel enhancements
                  </p>
                  {renderProjectStats("quickdash")}
                </div>
              </a>
              <a
                id="discord-music-card"
                className="highlight-item item"
                href="https://github.com/Balajitechlabs/discord-music-card"
                target="_blank"
                rel="noopener noreferrer"
                data-title="https://github.com/Balajitechlabs/discord-music-card"
              >
                <div className="highlight-thumbnail"></div>
                <div className="highlight-content">
                  <h3>Live Discord Activity & Music Card</h3>
                  <p className="highlight-description">
                    Real-time animated SVG presence, live Spotify/BTL music status, and equalizer waveforms for GitHub READMEs
                  </p>
                  {renderProjectStats("discord-music-card")}
                </div>
              </a>
              <a
                id="universal-updater"
                className="highlight-item item"
                href="https://github.com/Balajitechlabs/universal-updater-raycast"
                target="_blank"
                rel="noopener noreferrer"
                data-title="https://github.com/Balajitechlabs/universal-updater-raycast"
              >
                <div className="highlight-thumbnail"></div>
                <div className="highlight-content">
                  <h3>Universal Updater for Raycast</h3>
                  <p className="highlight-description">
                    Fast macOS Raycast extension to check, upgrade, and audit packages across 12+ package managers
                  </p>
                  {renderProjectStats("universal-updater")}
                </div>
              </a>
              <a
                id="play-console-tools"
                className="highlight-item item"
                href="https://github.com/Balajitechlabs/google-play-console-tools"
                target="_blank"
                rel="noopener noreferrer"
                data-title="https://github.com/Balajitechlabs/google-play-console-tools"
              >
                <div className="highlight-thumbnail"></div>
                <div className="highlight-content">
                  <h3>Google Play Console Tools</h3>
                  <p className="highlight-description">
                    Complete Python CLI developer automation suite to generate 512x512 icons, screenshots & aspect ratios
                  </p>
                  {renderProjectStats("play-console-tools")}
                </div>
              </a>
              <a
                id="macos"
                className="highlight-item item"
                href="/macos"
              >
                <div className="highlight-thumbnail"></div>
                <div className="highlight-content">
                  <h3>MacBook Air M1 (8GB / 256GB SSD)</h3>
                  <p className="highlight-description">
                    Daily driver Apple Silicon developer setup — custom dotfiles, CLI tools, native utilities & macOS workflow optimizations
                  </p>
                  {renderProjectStats("macos")}
                </div>
              </a>

              {/* ── collapsible extras ── */}
              <div
                className={`highlight-extras ${showAllProjects ? "expanded" : ""}`}
              >
                <div className="highlight-extras-inner">
                  <a
                    id="password-generator"
                    className="highlight-item"
                    href="https://github.com/Balajitechlabs/password-genaration"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-title="https://github.com/Balajitechlabs/password-genaration"
                  >
                    <div className="highlight-thumbnail"></div>
                    <div className="highlight-content">
                      <h3>Secure Password Generator</h3>
                      <p className="highlight-description">
                        Client-side password generator with entropy validation and custom complexity toggles
                      </p>
                      {renderProjectStats("password-generator")}
                    </div>
                  </a>
                  <a
                    id="more-github"
                    className="highlight-item"
                    href="https://github.com/balajitechlabs?tab=repositories"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-title="Explore all repositories"
                  >
                    <div className="highlight-thumbnail"></div>
                    <div className="highlight-content">
                      <h3>More on GitHub</h3>
                      <p className="highlight-description">
                        Explore all 33+ open-source repositories, libraries, and tools
                      </p>
                    </div>
                  </a>

                  <div className="highlight-github-cta-container">
                    <a
                      href="https://github.com/balajitechlabs?tab=repositories"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="highlight-view-more-github-btn"
                    >
                      <span className="material-symbols-rounded">code</span>
                      <span>View More on GitHub (33+ Repos)</span>
                      <span className="material-symbols-rounded">arrow_outward</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* ── toggle button ── */}
              <button
                className="highlight-toggle item"
                onClick={() => {
                  soundFx.playClick();
                  setShowAllProjects((p) => !p);
                }}
                aria-label={
                  showAllProjects ? "Show less projects" : "Show more projects"
                }
              >
                <span
                  className={`material-symbols-rounded highlight-toggle-icon ${showAllProjects ? "rotated" : ""}`}
                >
                  expand_more
                </span>
                <span>{showAllProjects ? "Show less" : "Show more"}</span>
              </button>
            </div>
          </div>
        </section>

        <section id="about-me">
          <div className="heading item">
            <h2>About Me</h2>
            <Photo3DGallery />
          </div>
          <div className="content">
            <p className="item">
              Full Stack Developer, Android Architect, and AI &amp; Cloud Enthusiast based in India 🇮🇳.
              Founder of <b>Luxora OS</b> (smart wearable OS with international patent strategy planned across India, USA &amp; Germany)
              and creator of <b>QuickDash</b>. Seeking high-performance engineering roles in IT operations and full-stack product development.
            </p>
            <div className="details-pills">
              <div className="pill item">
                <span className="material-symbols-rounded">person</span>
                <span><b>Balaji S.</b> (balajitechlabs)</span>
              </div>
              <div className="pill item">
                <span className="material-symbols-rounded">cake</span>
                <span><b>{calculateAge()} Years Old</b></span>
              </div>
              <div className="pill item">
                <span className="material-symbols-rounded">location_on</span>
                <span>India 🇮🇳</span>
              </div>
              <div className="pill item">
                <span className="material-symbols-rounded">school</span>
                <span>Bachelor of Computer Applications (BCA) · New Horizon College of Engineering (2024 – 2027 · CGPA 7.79)</span>
              </div>
              <div className="pill item">
                <span className="material-symbols-rounded">work</span>
                <span>Full Stack Developer Intern · Digital Kuppam (React.js · Node.js · Express · REST APIs · Agile Ops)</span>
              </div>
              <div className="pill item">
                <span className="material-symbols-rounded">lightbulb</span>
                <span>Founder & Concept Engineer · Luxora OS (Holographic UI · Gesture Control · On-Device AI Agents)</span>
              </div>
              <div className="pill item">
                <span className="material-symbols-rounded">rocket_launch</span>
                <span>Creator of QuickDash (Android Utility Hub) & JARVIS Omega (Cloud AI Assistant)</span>
              </div>
              <div className="pill item">
                <span className="material-symbols-rounded">verified</span>
                <span>AWS Cloud Foundation (2024) · VR & AR (2025) · Full Stack Web Dev (2026) · 33+ Open-Source Repos</span>
              </div>
            </div>
          </div>
        </section>

        <section id="tech-stack">
          <div className="heading item">
            <h2>Tech Stack</h2>
          </div>
          <div className="content">
            <TechStackSection />
          </div>
        </section>

        <section id="contact">
          <div className="heading item">
            <h2>Contact</h2>
          </div>
          <div className="content">
            <p className="item">
              If you have any questions, career opportunities, or want to collaborate, feel free to
              contact me via email, phone, or any of my social profiles.
            </p>
            <div id="contact-form">
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleFormSubmit}
              >
                <input type="hidden" name="form-name" value="contact" />
                <p style={{ display: "none" }}>
                  <label>
                    Don’t fill this out if you’re human:{" "}
                    <input name="bot-field" />
                  </label>
                </p>
                <div id="highlights">
                  {/* Name Input */}
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Your Name"
                    required
                    className="highlight-item item"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />

                  {/* Social Media Selector + Username with Platform Prefix */}
                  <div className="contact-social-row highlight-item item">
                    <div className="contact-social-select-wrap">
                      <span className="material-symbols-rounded contact-select-icon">
                        {SOCIAL_PREFIXES[contactPlatform]?.icon || "link"}
                      </span>
                      <select
                        name="social_platform"
                        id="social-platform"
                        className="contact-social-select"
                        value={contactPlatform}
                        onChange={(e) => setContactPlatform(e.target.value)}
                        aria-label="Social Media Platform"
                      >
                        <option value="telegram">Telegram</option>
                        <option value="discord">Discord</option>
                        <option value="instagram">Instagram</option>
                        <option value="x">X / Twitter</option>
                        <option value="github">GitHub</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="whatsapp">WhatsApp</option>
                      </select>
                    </div>

                    <div className="contact-social-input-wrap">
                      <span className="contact-prefix-tag">
                        {SOCIAL_PREFIXES[contactPlatform]?.prefix}
                      </span>
                      <input
                        type="text"
                        name="social_handle"
                        id="social-handle"
                        placeholder={SOCIAL_PREFIXES[contactPlatform]?.placeholder}
                        value={contactHandle}
                        onChange={(e) => setContactHandle(e.target.value)}
                        className="contact-handle-input"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <input
                    type="email"
                    name="_replyto"
                    id="email"
                    placeholder="Your Email Address"
                    required
                    className="highlight-item item"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />

                  {/* Message Textarea */}
                  <textarea
                    name="message"
                    id="message"
                    placeholder="Your Message or Project Inquiry..."
                    required
                    className="highlight-item item"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  ></textarea>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    id="btn"
                    className="highlight-item item"
                    disabled={formStatus === "submitting"}
                  >
                    <span className="material-symbols-rounded">
                      {formStatus === "submitting"
                        ? "hourglass_empty"
                        : formStatus === "success"
                          ? "verified"
                          : formStatus === "error"
                            ? "error"
                            : "send"}
                    </span>
                    {formStatus === "submitting"
                      ? "Sending Message..."
                      : formStatus === "success"
                        ? "Message Sent Successfully! 🚀"
                        : formStatus === "error"
                          ? "Failed to send, click to try again"
                          : "Send Message"}
                  </button>
                </div>
              </form>
              <div id="highlights" style={{ marginTop: "1em" }}>
                <a
                  href="https://drive.google.com/file/d/1ma7OFq0KgLPiQKTDZD-PtP5S0H3BAk5q/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="resume"
                  aria-label="Download Balaji's Resume (PDF)"
                  className="highlight-item item"
                >
                  <span className="material-symbols-rounded">description</span>
                  <h3>View My Resume</h3>
                </a>
                <a
                  href="mailto:admin@balajitechlab.com?subject=Portfolio%20Inquiry%20%E2%80%94%20Balaji%20S.&body=Hi%20Balaji%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20connect%20regarding..."
                  id="email-btn"
                  aria-label="Send Direct Email to admin@balajitechlab.com"
                  className="highlight-item item"
                >
                  <span className="material-symbols-rounded">outgoing_mail</span>
                  <div className="email-btn-text">
                    <h3>Direct Collaboration &amp; Inquiries</h3>
                    <p className="email-subtext">admin@balajitechlab.com</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Full Rich Animated Developer Footer */}
        <Footer />
      </div>
    </>
  );
}
