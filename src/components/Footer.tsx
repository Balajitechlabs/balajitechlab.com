"use client";

import { useEffect, useState } from "react";
import "@/styles/common/footer.css";
import { soundFx } from "@/lib/soundFx";

export default function Footer() {
  const [istTime, setIstTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const timeStr = new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setIstTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    soundFx.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="portfolio-footer-card item">
      {/* Top Ambient Raycast Glow Beam */}
      <div className="footer-ambient-beam" aria-hidden="true" />

      <div className="footer-inner-content">
        {/* Top Header Row with Brand & Actions */}
        <div className="footer-top-header">
          <div className="footer-brand-lockup">
            <img
              src="/assets/img/btl-topographic-avatar.png"
              alt="Balaji S. Logo"
              className="footer-brand-logo-img"
              width={42}
              height={42}
            />
            <div className="footer-brand-text">
              <span className="footer-brand-title">Balaji S.</span>
              <span className="footer-brand-subtitle">Principal Android Architect &amp; Full Stack Developer</span>
            </div>
          </div>

          <div className="footer-top-actions">
            <div className="footer-status-pill">
              <span className="footer-status-dot"></span>
              <span>India 🇮🇳 (<b>{istTime || "11:30 PM IST"}</b>)</span>
            </div>
            <button
              onClick={scrollToTop}
              className="footer-scroll-top-btn footer-pill-btn"
              aria-label="Scroll to top of page"
            >
              <span className="material-symbols-rounded">arrow_upward</span>
              <span>Top</span>
            </button>
          </div>
        </div>

        {/* 4-Column Structured Raycast Matrix with Social Media Pill Styling */}
        <div className="footer-matrix-grid">
          {/* Column 1: Ecosystem & Products */}
          <div className="footer-matrix-col">
            <h4 className="footer-col-header">Ecosystem</h4>
            <div className="footer-pills-list">
              <a href="https://quickdash.balajitechlab.com" target="_blank" rel="noopener noreferrer" className="footer-pill" data-pill="quickdash">
                <span className="material-symbols-rounded">dashboard</span>
                <span>QuickDash</span>
                <span className="arrow-tag">↗</span>
              </a>
              <a href="https://play.google.com/store/apps/dev?id=9073716923131512981" target="_blank" rel="noopener noreferrer" className="footer-pill" data-pill="google-play">
                <i className="fa-brands fa-google-play"></i>
                <span>Play Store</span>
                <span className="arrow-tag">↗</span>
              </a>
              <a href="https://github.com/balajitechlabs" target="_blank" rel="noopener noreferrer" className="footer-pill" data-pill="luxora">
                <span className="material-symbols-rounded">watch</span>
                <span>Luxora OS</span>
                <span className="arrow-tag">↗</span>
              </a>
              <a href="https://github.com/balajitechlabs" target="_blank" rel="noopener noreferrer" className="footer-pill" data-pill="jarvis">
                <span className="material-symbols-rounded">smart_toy</span>
                <span>JARVIS AI</span>
                <span className="arrow-tag">↗</span>
              </a>
              <a href="https://github.com/balajitechlabs" target="_blank" rel="noopener noreferrer" className="footer-pill" data-pill="updater">
                <span className="material-symbols-rounded">system_update</span>
                <span>Updater</span>
                <span className="arrow-tag">↗</span>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation & Hubs */}
          <div className="footer-matrix-col">
            <h4 className="footer-col-header">Navigation</h4>
            <div className="footer-pills-list">
              <a href="#updates" className="footer-pill" data-pill="nav">
                <span className="material-symbols-rounded">notifications</span>
                <span>Updates</span>
              </a>
              <a href="#projects" className="footer-pill" data-pill="nav">
                <span className="material-symbols-rounded">apps</span>
                <span>Projects</span>
              </a>
              <a href="#about-me" className="footer-pill" data-pill="nav">
                <span className="material-symbols-rounded">person</span>
                <span>About Me</span>
              </a>
              <a href="#tech-stack" className="footer-pill" data-pill="nav">
                <span className="material-symbols-rounded">code</span>
                <span>Arsenal</span>
              </a>
              <a href="#contact" className="footer-pill" data-pill="nav">
                <span className="material-symbols-rounded">mail</span>
                <span>Contact</span>
              </a>
              <a href="/macos" className="footer-pill" data-pill="nav">
                <span className="material-symbols-rounded">laptop_mac</span>
                <span>macOS Setup</span>
                <span className="arrow-tag">↗</span>
              </a>
            </div>
          </div>

          {/* Column 3: Community & Socials */}
          <div className="footer-matrix-col">
            <h4 className="footer-col-header">Community</h4>
            <div className="footer-pills-list">
              <a href="https://github.com/balajitechlabs" target="_blank" rel="noopener noreferrer" className="footer-pill" data-pill="github">
                <i className="fa-brands fa-github"></i>
                <span>GitHub</span>
                <span className="arrow-tag">↗</span>
              </a>
              <a href="https://t.me/balajitechlabs" target="_blank" rel="noopener noreferrer" className="footer-pill" data-pill="telegram">
                <i className="fa-brands fa-telegram"></i>
                <span>Telegram</span>
                <span className="arrow-tag">↗</span>
              </a>
              <a href="https://linkedin.com/in/balajitechlabs" target="_blank" rel="noopener noreferrer" className="footer-pill" data-pill="linkedin">
                <i className="fa-brands fa-linkedin"></i>
                <span>LinkedIn</span>
                <span className="arrow-tag">↗</span>
              </a>
              <a href="https://x.com/balajitechlabs" target="_blank" rel="noopener noreferrer" className="footer-pill" data-pill="twitter">
                <i className="fa-brands fa-x-twitter"></i>
                <span>X / Twitter</span>
                <span className="arrow-tag">↗</span>
              </a>
              <a href="https://gitlab.com/balajitechlabs" target="_blank" rel="noopener noreferrer" className="footer-pill" data-pill="gitlab">
                <i className="fa-brands fa-gitlab"></i>
                <span>GitLab</span>
                <span className="arrow-tag">↗</span>
              </a>
            </div>
          </div>

          {/* Column 4: Direct & Invariants */}
          <div className="footer-matrix-col">
            <h4 className="footer-col-header">Direct Inquiries</h4>
            <div className="footer-pills-list">
              <a href="mailto:admin@balajitechlab.com" className="footer-pill" data-pill="email">
                <span className="material-symbols-rounded">outgoing_mail</span>
                <span>admin@balajitechlab.com</span>
              </a>
              <a href="https://drive.google.com/file/d/1ma7OFq0KgLPiQKTDZD-PtP5S0H3BAk5q/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="footer-pill" data-pill="resume">
                <span className="material-symbols-rounded">description</span>
                <span>Resume (PDF)</span>
                <span className="arrow-tag">↗</span>
              </a>
              <div className="footer-pill static-pill" data-pill="badge">
                <span className="material-symbols-rounded">verified_user</span>
                <span>1Password Signed</span>
              </div>
              <div className="footer-pill static-pill" data-pill="badge">
                <span className="material-symbols-rounded">layers</span>
                <span>Clean Architecture</span>
              </div>
              <div className="footer-pill static-pill" data-pill="badge">
                <span className="material-symbols-rounded">copyright</span>
                <span>Brand: ||BTL||™</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="footer-bottom-row">
          <p className="footer-copy-left">
            &copy; {currentYear} <b>||BTL||™</b> (balajitechlabs) · Engineered by Balaji S. All rights reserved.
          </p>
          <div className="footer-copy-right">
            <span>India 🇮🇳</span>
            <span className="footer-dot">·</span>
            <span>Next.js 15 &amp; Cloudflare Edge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
