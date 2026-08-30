"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { toast } from "sonner";
import { soundFx } from "@/lib/soundFx";
import {
  Sparkles,
  Layers,
  Grid,
  FileText,
  Copy,
  Mail,
  Volume2,
  VolumeX,
  ExternalLink,
  Laptop,
  ArrowUpRight,
  Code2,
  Send,
  User,
  Bell,
  Compass,
  Search,
  Check
} from "lucide-react";
import "@/styles/common/command-palette.css";

interface DeveloperPaletteProps {
  activeTheme: "topographic" | "universe" | "voronoi";
  onThemeSelect: (theme: "topographic" | "universe" | "voronoi") => void;
}

export default function DeveloperPalette({
  activeTheme,
  onThemeSelect,
}: DeveloperPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(true);

  useEffect(() => {
    setSoundActive(soundFx.getSoundEnabled());

    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName))) {
        e.preventDefault();
        soundFx.playPop();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (action: () => void, feedback?: string) => {
    soundFx.playClick();
    action();
    setOpen(false);
    if (feedback) {
      toast.success(feedback);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard!`);
    soundFx.playPop();
  };

  const toggleSound = () => {
    const next = soundFx.toggleSound();
    setSoundActive(next);
    toast.info(next ? "UI Sound Effects Enabled 🔊" : "UI Sound Effects Muted 🔇");
  };

  return (
    <>
      {/* Modal Backdrop & Command Container (Triggered via Cmd + K, Ctrl + K, or /) */}
      {open && (
        <div className="cmd-backdrop" onClick={() => setOpen(false)}>
          <div
            className="cmd-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <Command label="Developer Command Palette" loop>
              <div className="cmd-input-wrap">
                <Search className="cmd-search-icon" size={18} />
                <Command.Input
                  placeholder="Type a command or search sections, shaders, projects..."
                  className="cmd-input"
                  autoFocus
                />
                <kbd className="cmd-esc-tag" onClick={() => setOpen(false)}>ESC</kbd>
              </div>

              <Command.List className="cmd-list">
                <Command.Empty className="cmd-empty">No results found.</Command.Empty>

                {/* ── Group 1: Live WebGL Shader Themes ── */}
                <Command.Group heading="Live Shader Themes" className="cmd-group">
                  <Command.Item
                    className={`cmd-item ${activeTheme === "topographic" ? "active" : ""}`}
                    onSelect={() => handleSelect(() => onThemeSelect("topographic"), "Switched to AMOLED Topographic theme")}
                  >
                    <Layers className="cmd-item-icon" size={16} />
                    <div className="cmd-item-content">
                      <span className="cmd-item-title">Theme 1: AMOLED Topographic</span>
                      <span className="cmd-item-desc">Pitch-black AMOLED shutoff with crisp white contour isolines</span>
                    </div>
                    {activeTheme === "topographic" && <Check className="cmd-item-check" size={15} />}
                  </Command.Item>

                  <Command.Item
                    className={`cmd-item ${activeTheme === "universe" ? "active" : ""}`}
                    onSelect={() => handleSelect(() => onThemeSelect("universe"), "Switched to The Universe Within shader")}
                  >
                    <Sparkles className="cmd-item-icon" size={16} />
                    <div className="cmd-item-content">
                      <span className="cmd-item-title">Theme 2: The Universe Within</span>
                      <span className="cmd-item-desc">3D celestial constellation mesh with live color modulation</span>
                    </div>
                    {activeTheme === "universe" && <Check className="cmd-item-check" size={15} />}
                  </Command.Item>

                  <Command.Item
                    className={`cmd-item ${activeTheme === "voronoi" ? "active" : ""}`}
                    onSelect={() => handleSelect(() => onThemeSelect("voronoi"), "Switched to Voronoi Distances theme")}
                  >
                    <Grid className="cmd-item-icon" size={16} />
                    <div className="cmd-item-content">
                      <span className="cmd-item-title">Theme 3: Voronoi Distances</span>
                      <span className="cmd-item-desc">Inigo Quilez Euclidean crystal distance isoline waves</span>
                    </div>
                    {activeTheme === "voronoi" && <Check className="cmd-item-check" size={15} />}
                  </Command.Item>
                </Command.Group>

                {/* ── Group 2: Quick Navigation ── */}
                <Command.Group heading="Navigation" className="cmd-group">
                  <Command.Item className="cmd-item" onSelect={() => handleSelect(() => { window.location.hash = "updates"; })}>
                    <Bell className="cmd-item-icon" size={16} />
                    <span className="cmd-item-title">Updates &amp; Changelogs</span>
                    <span className="cmd-shortcut">#updates</span>
                  </Command.Item>

                  <Command.Item className="cmd-item" onSelect={() => handleSelect(() => { window.location.hash = "projects"; })}>
                    <Compass className="cmd-item-icon" size={16} />
                    <span className="cmd-item-title">Featured Showcase</span>
                    <span className="cmd-shortcut">#projects</span>
                  </Command.Item>

                  <Command.Item className="cmd-item" onSelect={() => handleSelect(() => { window.location.hash = "about-me"; })}>
                    <User className="cmd-item-icon" size={16} />
                    <span className="cmd-item-title">About the Engineer</span>
                    <span className="cmd-shortcut">#about-me</span>
                  </Command.Item>

                  <Command.Item className="cmd-item" onSelect={() => handleSelect(() => { window.location.hash = "tech-stack"; })}>
                    <Code2 className="cmd-item-icon" size={16} />
                    <span className="cmd-item-title">Technical Arsenal</span>
                    <span className="cmd-shortcut">#tech-stack</span>
                  </Command.Item>

                  <Command.Item className="cmd-item" onSelect={() => handleSelect(() => { window.location.hash = "contact"; })}>
                    <Send className="cmd-item-icon" size={16} />
                    <span className="cmd-item-title">Instant Telegram Contact Form</span>
                    <span className="cmd-shortcut">#contact</span>
                  </Command.Item>

                  <Command.Item className="cmd-item" onSelect={() => handleSelect(() => { router.push("/macos"); })}>
                    <Laptop className="cmd-item-icon" size={16} />
                    <span className="cmd-item-title">macOS Developer Setup Showcase</span>
                    <ArrowUpRight className="cmd-arrow" size={14} />
                  </Command.Item>
                </Command.Group>

                {/* ── Group 3: Quick Developer Actions ── */}
                <Command.Group heading="Quick Actions" className="cmd-group">
                  <Command.Item
                    className="cmd-item"
                    onSelect={() => handleSelect(() => copyToClipboard("admin@balajitechlab.com", "Email"))}
                  >
                    <Mail className="cmd-item-icon" size={16} />
                    <div className="cmd-item-content">
                      <span className="cmd-item-title">Copy Email Address</span>
                      <span className="cmd-item-desc">admin@balajitechlab.com</span>
                    </div>
                    <Copy className="cmd-arrow" size={14} />
                  </Command.Item>

                  <Command.Item
                    className="cmd-item"
                    onSelect={() => handleSelect(() => {
                      window.open("https://drive.google.com/file/d/1ma7OFq0KgLPiQKTDZD-PtP5S0H3BAk5q/view?usp=sharing", "_blank");
                    }, "Opening Verified Resume (PDF)")}
                  >
                    <FileText className="cmd-item-icon" size={16} />
                    <div className="cmd-item-content">
                      <span className="cmd-item-title">Verified Resume (PDF)</span>
                      <span className="cmd-item-desc">View full credential &amp; architecture history</span>
                    </div>
                    <ExternalLink className="cmd-arrow" size={14} />
                  </Command.Item>

                  <Command.Item className="cmd-item" onSelect={() => handleSelect(toggleSound)}>
                    {soundActive ? <Volume2 className="cmd-item-icon" size={16} /> : <VolumeX className="cmd-item-icon" size={16} />}
                    <span className="cmd-item-title">{soundActive ? "Mute UI Sound Effects" : "Enable UI Sound Effects"}</span>
                    <span className="cmd-shortcut">{soundActive ? "ON" : "OFF"}</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>

              <div className="cmd-footer">
                <span className="cmd-footer-tip">Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate, <kbd>↵</kbd> to select, <kbd>ESC</kbd> to close</span>
                <span className="cmd-footer-brand">||BTL||™</span>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
