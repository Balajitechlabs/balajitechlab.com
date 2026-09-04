"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import RedirectBridge from "@/components/RedirectBridge";
import { Shortlink } from "@/lib/shortlinks";

export default function RedirectClient() {
  const searchParams = useSearchParams();
  const to = searchParams.get("to") || searchParams.get("url") || "";
  const title = searchParams.get("title") || "External Destination";
  const desc =
    searchParams.get("desc") ||
    "You are being redirected to an external resource from balajitechlab.com.";

  // Safety validation: must be a valid http, https, or mailto link
  const isValid =
    to.startsWith("https://") ||
    to.startsWith("http://") ||
    to.startsWith("mailto:");

  if (!to || !isValid) {
    return (
      <main className="redirect-viewport">
        <div className="redirect-card-container">
          <div className="redirect-ambient-beam" aria-hidden="true" />

          <div className="redirect-avatar-wrapper">
            <Image
              src="/assets/img/project-logos/balajitechlabs-logo.png"
              alt="balajitechlabs"
              width={96}
              height={96}
              className="redirect-avatar-img"
            />
          </div>

          <div className="redirect-subtitle" style={{ color: "#ef4444" }}>
            <span className="material-symbols-rounded">security</span>
            <span>Invalid Destination</span>
          </div>

          <h1 className="redirect-title">Missing or Invalid Destination URL</h1>
          <p className="redirect-description">
            For security reasons, only valid HTTP, HTTPS, and email links can be redirected through this portal.
          </p>

          <div className="redirect-actions">
            <Link href="/" className="redirect-btn-primary">
              <span className="material-symbols-rounded">home</span>
              <span>Return to Portfolio Home</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const dynamicShortlink: Shortlink = {
    slug: "custom",
    title: title,
    destination: to,
    category: "Tools",
    icon: "open_in_new",
    badge: "Outgoing Link",
    description: desc,
  };

  return <RedirectBridge shortlink={dynamicShortlink} />;
}
