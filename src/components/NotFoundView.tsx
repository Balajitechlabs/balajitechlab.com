"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllShortlinks } from "@/lib/shortlinks";
import { soundFx } from "@/lib/soundFx";
import WarpShaderBackground from "@/components/WarpShaderBackground";

interface NotFoundViewProps {
  slug?: string;
}

export default function NotFoundView({ slug }: NotFoundViewProps) {
  const allLinks = getAllShortlinks();

  return (
    <>
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
            <span className="material-symbols-rounded">explore_off</span>
            <span>{slug ? "Shortlink Not Found" : "404 · Page Not Found"}</span>
          </div>

          <h1 className="redirect-title">
            {slug ? `Link "/go/${slug}" is unavailable` : "Lost in Cyberspace?"}
          </h1>
          <p className="redirect-description">
            The page or destination you are looking for has moved or does not exist. Choose from our verified project links below:
          </p>

          {/* ── Verified Link Directory Grid ── */}
          <div className="redirect-directory-grid">
            {allLinks.map((link) => (
              <Link
                key={link.slug}
                href={`/go/${link.slug}`}
                onClick={() => soundFx.playClick()}
                className="redirect-dir-item"
              >
                <div className="redirect-dir-item-left">
                  <div className="redirect-dir-icon-box">
                    <span className="material-symbols-rounded">{link.icon}</span>
                  </div>
                  <div className="redirect-dir-text">
                    <span className="redirect-dir-title">{link.title}</span>
                    <span className="redirect-dir-badge">{link.badge}</span>
                  </div>
                </div>
                <span className="material-symbols-rounded redirect-dir-arrow">
                  arrow_forward
                </span>
              </Link>
            ))}
          </div>

          {/* ── Action Buttons ── */}
          <div className="redirect-actions">
            <Link
              href="/"
              onClick={() => soundFx.playClick()}
              className="redirect-btn-primary"
            >
              <span className="material-symbols-rounded">home</span>
              <span>Return to Portfolio Home</span>
            </Link>

            <Link
              href="/resume"
              onClick={() => soundFx.playClick()}
              className="redirect-btn-secondary"
            >
              <span className="material-symbols-rounded">description</span>
              <span>View Executive Resume</span>
            </Link>
          </div>

          {/* ── Verified Security Tag ── */}
          <div className="redirect-trust-tag">
            <span className="material-symbols-rounded">verified_user</span>
            <span>Verified directory by ||BTL||™ · balajitechlab.com</span>
          </div>
        </div>
      </main>
    </>
  );
}
