import React, { Suspense } from "react";
import type { Metadata } from "next";
import RedirectClient from "./RedirectClient";
import "@/styles/redirect/redirect.css";

export const metadata: Metadata = {
  title: "Redirecting — balajitechlabs",
  description: "External destination link from balajitechlab.com.",
};

export default function RedirectPage() {
  return (
    <Suspense
      fallback={
        <main className="redirect-viewport">
          <div className="redirect-card-container">
            <div className="redirect-title">Loading destination...</div>
          </div>
        </main>
      }
    >
      <RedirectClient />
    </Suspense>
  );
}
