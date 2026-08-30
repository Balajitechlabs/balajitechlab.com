"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { appGroups, brewGroups } from "./apps";
import Navbar from "@/components/Navbar";
import UniverseWithinBackground from "@/components/UniverseWithinBackground";
import VoronoiShaderBackground from "@/components/VoronoiShaderBackground";
import WarpShaderBackground from "@/components/WarpShaderBackground";
import DeveloperPalette from "@/components/DeveloperPalette";
import "@/styles/article.css";
import "@/styles/articles/app-list.css";

const macosNavLinks = [
  {
    href: "#intro",
    id: "intro-nav",
    icon: "laptop_mac",
    caption: "Setup",
    ariaLabel: "MacBook Setup Overview",
  },
  {
    href: "#article-info",
    id: "device-nav",
    icon: "memory",
    caption: "Device",
    ariaLabel: "MacBook Air M1 Hardware Specs",
  },
  {
    href: "#apps",
    id: "apps-nav",
    icon: "apps",
    caption: "Apps",
    ariaLabel: "Native macOS Applications",
  },
  {
    href: "#brew-packages",
    id: "brew-nav",
    icon: "terminal",
    caption: "Terminal",
    ariaLabel: "Homebrew CLI Toolchain",
  },
];

export default function MacOsSetup() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTheme, setActiveTheme] = useState<
    "topographic" | "universe" | "voronoi"
  >("topographic");
  const [shaderColors, setShaderColors] = useState<{
    light: string;
    dark: string;
  } | null>(null);

  // Interactive Filter & Search & Lightbox State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "foss" | "free" | "paid"
  >("all");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("btl_theme") as any;
      if (
        savedTheme &&
        (savedTheme === "topographic" ||
          savedTheme === "universe" ||
          savedTheme === "voronoi")
      ) {
        setActiveTheme(savedTheme);
      }
    } catch {}
  }, []);

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

  // Lightbox keyboard dismiss listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen]);

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

    // reset styles
    items.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(20px)";
      if (item.id !== "logo") {
        item.style.transition =
          "opacity 0.5s ease-out, transform 0.5s ease-out, scale 0.3s ease-out";
      }
    });

    setTimeout(animate, 100);

    const handleScroll = () => {
      const value = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(value > 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopyBrew = (cmd: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => {
      setCopiedCmd((current) => (current === cmd ? null : current));
    }, 2000);
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

  // Metrics counts
  const totalAppsCount = appGroups.reduce((acc, g) => acc + g.items.length, 0);
  const totalBrewCount = brewGroups.reduce((acc, g) => acc + g.items.length, 0);

  // Filtered Apps
  const filteredAppGroups = appGroups
    .map((group) => {
      const items = group.items.filter((app) => {
        const matchesFilter =
          activeFilter === "all" || app.price === activeFilter;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          app.name.toLowerCase().includes(q) ||
          app.category.toLowerCase().includes(q) ||
          app.description.toLowerCase().includes(q);
        return matchesFilter && matchesSearch;
      });
      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);

  // Filtered Homebrew Packages
  const filteredBrewGroups = brewGroups
    .map((group) => {
      const items = group.items.filter((pkg) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          pkg.name.toLowerCase().includes(q) ||
          pkg.category.toLowerCase().includes(q) ||
          pkg.command.toLowerCase().includes(q) ||
          pkg.description.toLowerCase().includes(q);
        return matchesSearch;
      });
      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);

  const hasAnyResults =
    filteredAppGroups.length > 0 || filteredBrewGroups.length > 0;

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

      <Navbar isArticle extraLinks={macosNavLinks} />
      <DeveloperPalette
        activeTheme={activeTheme}
        onThemeSelect={(theme) => {
          setActiveTheme(theme);
          try {
            localStorage.setItem("btl_theme", theme);
          } catch {}
        }}
      />

      <div className="container article-body">
        <section id="intro">
          <div className="heading">
            <a href="#" onClick={handleScrollToTop} aria-label="Back to top">
              <div
                id="logo"
                className={`macos-logo ${isScrolled ? "scrolled" : ""}`}
              ></div>
            </a>

            <h1 id="title" className="item">
              <span className="name-primary">MY MACBOOK SETUP</span>
              <br />
              <span className="name-secondary">MacBook Air M1 (8GB / 256GB SSD)</span>
            </h1>

            <div className="intro-desc-card item">
              <p className="article-text">
                A complete lookaround of my personal macOS productivity setup on
                my <b className="accent">MacBook Air M1 (8GB / 256GB SSD).</b>{" "}
                The apps I use, developer tools, shell configurations, and productivity workflows are
                detailed below and updated as my workflow evolves.
              </p>
            </div>
          </div>
        </section>

        {/* ── Device Section ── */}
        <section id="article-info" className="item">
          <div className="pill-group-header">
            <span className="material-symbols-rounded pill-group-icon">memory</span>
            <div className="pill-group-meta">
              <h3>Hardware Specifications</h3>
              <p>Personal daily driver configuration & system architecture</p>
            </div>
          </div>

          <div className="device-card-content">
            <div
              className="device-screenshot-wrap"
              onClick={() => setIsLightboxOpen(true)}
              title="Click to view full-resolution screenshot"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setIsLightboxOpen(true)}
            >
              <img
                src="/assets/img/articles/macos/desktop-screenshot.png"
                alt="macOS desktop setup preview"
                className="device-screenshot-img"
              />
              <div className="screenshot-zoom-badge">
                <span className="material-symbols-rounded">zoom_in</span>
                <span>Click to Expand</span>
              </div>
            </div>

            <div className="device-specs-wrap">
              <h3 className="device-model-name">Apple MacBook Air M1</h3>
              <div className="device-spec-chips">
                <div className="device-spec-item">
                  <span className="material-symbols-rounded spec-icon">memory</span>
                  <div>
                    <strong>8GB Unified Memory</strong>
                    <span>High-bandwidth low-latency architecture</span>
                  </div>
                </div>
                <div className="device-spec-item">
                  <span className="material-symbols-rounded spec-icon">hard_drive</span>
                  <div>
                    <strong>256GB NVMe SSD Storage</strong>
                    <span>Ultra-fast local storage & swap</span>
                  </div>
                </div>
                <div className="device-spec-item">
                  <span className="material-symbols-rounded spec-icon">speed</span>
                  <div>
                    <strong>8-Core CPU / 7-Core GPU</strong>
                    <span>4 Performance + 4 Efficiency cores</span>
                  </div>
                </div>
                <div className="device-spec-item">
                  <span className="material-symbols-rounded spec-icon">palette</span>
                  <div>
                    <strong>Space Gray Aluminum</strong>
                    <span>Retina Display (2560 × 1600) with P3 Color</span>
                  </div>
                </div>
                <div className="device-spec-item">
                  <span className="material-symbols-rounded spec-icon">laptop_mac</span>
                  <div>
                    <strong>macOS Tahoe (Apple Silicon)</strong>
                    <span>Optimized for ARM64 developer CLI toolchains</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Interactive Setup Metrics & Search Toolbar ── */}
        <div className="macos-toolbar item">
          <div className="macos-metrics-bar">
            <div className="metric-chip">
              <span className="material-symbols-rounded">apps</span>
              <span><b>{totalAppsCount}</b> Native Apps</span>
            </div>
            <div className="metric-chip">
              <span className="material-symbols-rounded">terminal</span>
              <span><b>{totalBrewCount}</b> CLI Formulae</span>
            </div>
            <div className="metric-chip">
              <span className="material-symbols-rounded">memory</span>
              <span><b>Apple Silicon M1</b> (8GB RAM)</span>
            </div>
          </div>

          <div className="macos-search-and-filters">
            <div className="macos-search-wrap">
              <span className="material-symbols-rounded search-icon">search</span>
              <input
                type="text"
                className="macos-search-input"
                placeholder="Search apps, CLI binaries, formula..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <span className="material-symbols-rounded">close</span>
                </button>
              )}
            </div>

            <div className="macos-filter-chips">
              {(
                [
                  { id: "all", label: "All Tools" },
                  { id: "foss", label: "FOSS" },
                  { id: "free", label: "Free" },
                  { id: "paid", label: "Pro" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`filter-chip ${activeFilter === tab.id ? "active" : ""}`}
                  onClick={() => setActiveFilter(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Empty State when search returns 0 results ── */}
        {!hasAnyResults && (
          <div className="macos-empty-state item">
            <span className="material-symbols-rounded empty-icon">search_off</span>
            <h3>No matching tools found</h3>
            <p>No apps or Homebrew packages match "{searchQuery}"</p>
            <button
              type="button"
              className="reset-search-btn"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ── Native macOS Applications ── */}
        {filteredAppGroups.length > 0 && (
          <section id="apps" className="item">
            <div className="heading item">
              <h2>Apps & Native Tools</h2>
            </div>

            <div className="vertical-pill-groups">
              {filteredAppGroups.map((group, gIdx) => (
                <div key={gIdx} className="vertical-pill-group item">
                  <div className="pill-group-header">
                    <span className="material-symbols-rounded pill-group-icon">{group.icon}</span>
                    <div className="pill-group-meta">
                      <h3>{group.title}</h3>
                      <p>{group.subtitle}</p>
                    </div>
                  </div>

                  <div className="vertical-pill-container">
                    {group.items.map((app, index) => (
                      <a
                        key={index}
                        className="vertical-pill-row"
                        href={app.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div
                          className="pastel-circle"
                          style={{ backgroundColor: app.pastelColor }}
                        >
                          <img src={app.iconUrl} alt={app.name} className="app-icon-img" />
                        </div>

                        <div className="pill-row-content">
                          <div className="pill-row-title-wrap">
                            <span className="pill-row-title">{app.name}</span>
                            <span className="pill-row-category">{app.category}</span>
                          </div>
                          <p className="pill-row-desc">{app.description}</p>
                        </div>

                        <div className="pill-row-trailing">
                          <span className={`pill-badge ${app.price}`}>
                            {app.price === "foss" ? "FOSS" : app.price === "paid" ? "PRO" : "FREE"}
                          </span>
                          <span className="material-symbols-rounded pill-arrow">arrow_outward</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="card item" id="apps-guide">
              <p className="free">Free</p>
              <p className="paid">Paid / Pro</p>
              <p className="foss">Free & Open Source</p>
            </div>
          </section>
        )}

        {/* ── Homebrew & CLI Toolchain Vertical Pill Containers ── */}
        {filteredBrewGroups.length > 0 && (
          <section id="brew-packages" className="item">
            <div className="heading item">
              <h2>Homebrew & CLI Toolchain</h2>
            </div>

            <div className="vertical-pill-groups">
              {filteredBrewGroups.map((group, gIdx) => (
                <div key={gIdx} className="vertical-pill-group item">
                  <div className="pill-group-header">
                    <span className="material-symbols-rounded pill-group-icon">{group.icon}</span>
                    <div className="pill-group-meta">
                      <h3>{group.title}</h3>
                      <p>{group.subtitle}</p>
                    </div>
                  </div>

                  <div className="vertical-pill-container">
                    {group.items.map((pkg, idx) => (
                      <div key={idx} className="vertical-pill-row brew-pill-row">
                        <div
                          className="pastel-circle"
                          style={{ backgroundColor: pkg.pastelColor }}
                        >
                          <span
                            className="material-symbols-rounded brew-icon"
                            style={{ color: pkg.accentColor }}
                          >
                            {pkg.icon}
                          </span>
                        </div>

                        <div className="pill-row-content">
                          <div className="pill-row-title-wrap">
                            <span className="pill-row-title">{pkg.name}</span>
                            <span className="pill-row-category">{pkg.category}</span>
                          </div>
                          <p className="pill-row-desc">{pkg.description}</p>
                        </div>

                        <div className="pill-row-trailing brew-trailing">
                          <button
                            type="button"
                            className={`brew-command-chip ${copiedCmd === pkg.command ? "copied" : ""}`}
                            onClick={(e) => handleCopyBrew(pkg.command, e)}
                            title="Click to copy command"
                          >
                            <span className="material-symbols-rounded brew-copy-icon">
                              {copiedCmd === pkg.command ? "check" : "content_copy"}
                            </span>
                            <code>{pkg.command}</code>
                            {copiedCmd === pkg.command && (
                              <span className="copied-toast">Copied! ✓</span>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer></footer>
      </div>

      {/* ── Screenshot Lightbox Modal ── */}
      {isLightboxOpen && (
        <div
          className="screenshot-lightbox-overlay"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="lightbox-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close image preview"
            >
              <span className="material-symbols-rounded">close</span>
            </button>
            <img
              src="/assets/img/articles/macos/desktop-screenshot.png"
              alt="macOS full resolution desktop preview"
              className="lightbox-img"
            />
            <div className="lightbox-caption">
              <strong>MacBook Air M1 Desktop Workspace</strong>
              <span>Space Gray · 8GB Unified Memory · 256GB SSD · macOS Tahoe</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
