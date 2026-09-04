"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Shortlink } from "@/lib/shortlinks";
import { soundFx } from "@/lib/soundFx";
import WarpShaderBackground from "@/components/WarpShaderBackground";

interface RedirectBridgeProps {
  shortlink: Shortlink;
}

export default function RedirectBridge({ shortlink }: RedirectBridgeProps) {
  const [copied, setCopied] = useState(false);

  const handleOpenDestination = () => {
    soundFx.playClick();
  };

  const handleCopyLink = async () => {
    soundFx.playClick();
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(shortlink.destination);
        setCopied(true);
        toast.success("Destination URL copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <>
      {/* ── Live AMOLED Topographic Background Wallpaper ── */}
      <WarpShaderBackground />

      <main className="redirect-viewport">
        <div className="redirect-card-container">
          <div className="redirect-ambient-beam" aria-hidden="true" />

          {/* ── BTL Avatar Logo (Pure Monochrome & AMOLED) ── */}
          <div className="redirect-avatar-wrapper">
            <Image
              src="/assets/img/project-logos/balajitechlabs-logo.png"
              alt="balajitechlabs"
              width={88}
              height={88}
              className="redirect-avatar-img"
              priority
            />
          </div>

          {/* ── Subtitle & Main Title ── */}
          <div className="redirect-subtitle">
            <span className="material-symbols-rounded">north_east</span>
            <span>Outgoing Link Gateway</span>
          </div>

          <h1 className="redirect-title">{shortlink.title}</h1>
          <p className="redirect-description">{shortlink.description}</p>

          {/* ── Destination Preview Box ── */}
          <a
            href={shortlink.destination}
            onClick={handleOpenDestination}
            className="redirect-destination-box"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="redirect-dest-icon-container">
              <span className="material-symbols-rounded">{shortlink.icon}</span>
            </div>
            <div className="redirect-dest-meta">
              <span className="redirect-dest-badge">{shortlink.badge}</span>
              <div className="redirect-dest-url" title={shortlink.destination}>
                {shortlink.destination.replace(/^https?:\/\//, "")}
              </div>
            </div>
            <span
              className="material-symbols-rounded"
              style={{ fontSize: "1.2rem", opacity: 0.6 }}
            >
              open_in_new
            </span>
          </a>

          {/* ── Action Buttons (Clean Monochrome Pills) ── */}
          <div className="redirect-actions">
            <a
              href={shortlink.destination}
              onClick={handleOpenDestination}
              className="redirect-btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Continue to Destination</span>
              <span className="material-symbols-rounded">arrow_forward</span>
            </a>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={handleCopyLink}
                className="redirect-btn-secondary"
                style={{ flex: 1 }}
              >
                <span className="material-symbols-rounded">
                  {copied ? "check" : "content_copy"}
                </span>
                <span>{copied ? "Copied" : "Copy Link"}</span>
              </button>

              <Link
                href="/"
                onClick={() => soundFx.playClick()}
                className="redirect-btn-secondary"
                style={{ flex: 1 }}
              >
                <span className="material-symbols-rounded">home</span>
                <span>Portfolio</span>
              </Link>
            </div>
          </div>

          {/* ── Verified Security Tag ── */}
          <div className="redirect-trust-tag">
            <span className="material-symbols-rounded">verified_user</span>
            <span>Verified link by ||BTL||™ · balajitechlab.com</span>
          </div>
        </div>
      </main>
    </>
  );
}
