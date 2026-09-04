import React from "react";
import type { Metadata } from "next";
import NotFoundView from "@/components/NotFoundView";
import "@/styles/redirect/redirect.css";

export const metadata: Metadata = {
  title: "404 — Page Not Found | balajitechlabs",
  description: "The page you were looking for does not exist on balajitechlab.com.",
};

export default function NotFoundPage() {
  return <NotFoundView />;
}
