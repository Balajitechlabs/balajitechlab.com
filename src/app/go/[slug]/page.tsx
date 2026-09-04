import React from "react";
import type { Metadata } from "next";
import { getShortlink } from "@/lib/shortlinks";
import NotFoundView from "@/components/NotFoundView";
import RedirectBridge from "@/components/RedirectBridge";
import "@/styles/redirect/redirect.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const shortlink = getShortlink(slug);

  if (!shortlink) {
    return {
      title: "Shortlink Not Found — balajitechlabs",
      description: "The requested shortlink does not exist on balajitechlab.com.",
    };
  }

  return {
    title: `Redirecting to ${shortlink.title} — balajitechlabs`,
    description: shortlink.description,
    openGraph: {
      title: `${shortlink.title} | balajitechlabs`,
      description: shortlink.description,
      url: `https://balajitechlab.com/go/${shortlink.slug}`,
      siteName: "balajitechlabs",
      images: [
        {
          url: "https://balajitechlab.com/assets/img/web-preview.png",
          width: 1200,
          height: 630,
          alt: shortlink.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${shortlink.title} | balajitechlabs`,
      description: shortlink.description,
      creator: "@balajitechlabs",
      images: ["https://balajitechlab.com/assets/img/web-preview.png"],
    },
  };
}

export default async function GoPage({ params }: PageProps) {
  const { slug } = await params;
  const shortlink = getShortlink(slug);

  if (!shortlink) {
    return <NotFoundView slug={slug} />;
  }

  return <RedirectBridge shortlink={shortlink} />;
}
