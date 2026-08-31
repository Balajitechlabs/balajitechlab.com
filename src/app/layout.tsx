import type { Metadata } from "next";
import Script from "next/script";

import "@/styles/style.css";
import "@/styles/common/no-cursor.css";
import "@/styles/common/loading-screen.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Cursor from "@/components/Cursor";
import LoadingScreen from "@/components/LoadingScreen";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Balaji S. (balajitechlabs) — Principal Android Architect & Developer",
  description:
    "Official portfolio of Balaji S. (balajitechlabs) — Principal Android Architect, Full-Stack Developer & CS Engineer from India 🇮🇳. Creator of QuickDash, Luxora OS, and high-performance open-source tools.",
  metadataBase: new URL("https://balajitechlab.com/"),
  alternates: {
    canonical: "https://balajitechlab.com/",
  },
  keywords: [
    "Balaji S",
    "balajitechlabs",
    "balajitechlab",
    "balajitechlab.com",
    "balajitechlabs.com",
    "balajitech",
    "btl",
    "BTL",
    "||BTL||™",
    "||BTL||",
    "balaji_developer",
    "balaji developer",
    "Balaji Tech Labs",
    "Balaji Tech Lab",
    "BTL Developer",
    "BTL Tech Labs",
    "quickdash.balajitechlab.com",
    "Principal Android Architect",
    "Android Architect India",
    "Senior Android Engineer",
    "Jetpack Compose Expert",
    "Material 3 Expressive",
    "Material Design 3",
    "Kotlin Multiplatform",
    "Coroutines StateFlow",
    "Clean Architecture Android",
    "AGSL Shaders Android",
    "QuickDash",
    "QuickDash Android",
    "QuickDash Dashboard",
    "Essentials essentialx",
    "Discord Live Music Card",
    "Universal Updater",
    "scrcpy Wireless CLI",
    "Shizuku Android Automation",
    "Vivo V60e OriginOS Setup",
    "MacBook Air M1 Setup",
    "Full Stack Developer India",
    "Full Stack Developer Bengaluru",
    "Cloudflare Workers Next.js",
    "OpenNext Edge Runtime",
    "Next.js App Router Portfolio",
    "TypeScript Developer Bangalore",
    "Software Engineer Bengaluru",
    "Google Play Console Developer",
    "Open Source Contributor India",
  ],
  authors: [{ name: "Balaji S.", url: "https://balajitechlab.com" }],
  creator: "Balaji S. (balajitechlabs)",
  publisher: "balajitechlabs",
  category: "Technology & Software Development",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://balajitechlab.com/",
    siteName: "balajitechlabs",
    title: "Balaji S. (balajitechlabs) — Principal Android Architect & Full Stack Developer",
    description:
      "Official engineering portfolio of Balaji S. (balajitechlabs) — Principal Android Architect, Full-Stack Developer & CS Engineer from Bengaluru, India 🇮🇳. Creator of QuickDash, Essentials, and Edge Cloud tools.",
    images: [
      {
        url: "https://balajitechlab.com/assets/img/web-preview.png?v=2026",
        width: 1200,
        height: 630,
        alt: "Balaji S. (balajitechlabs) Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@balajitechlabs",
    creator: "@balajitechlabs",
    title: "Balaji S. (balajitechlabs) — Principal Android Architect & Developer",
    description:
      "Principal Android Architect, Full-Stack Developer & CS Engineer from Bengaluru, India 🇮🇳. Creator of QuickDash, Essentials, and high-performance developer toolchains.",
    images: ["https://balajitechlab.com/assets/img/web-preview.png?v=2026"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://balajitechlab.com/#person",
      name: "Balaji S.",
      alternateName: ["balajitechlabs", "balaji_developer", "BTL", "||BTL||™"],
      jobTitle: "Principal Android Architect & Full Stack Developer",
      url: "https://balajitechlab.com",
      image: "https://balajitechlab.com/assets/img/btl-topographic-avatar.png",
      email: "mailto:admin@balajitechlab.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "New Horizon College, Kasturi-Nagar, Bangalore",
      },
      sameAs: [
        "https://github.com/balajitechlabs",
        "https://play.google.com/store/apps/dev?id=9073716923131512981",
        "https://linkedin.com/in/balajitechlabs",
        "https://twitter.com/balajitechlabs",
        "https://gitlab.com/balajitechlabs",
        "https://t.me/balajitechlabs",
        "https://quickdash.balajitechlab.com",
      ],
      nationality: {
        "@type": "Country",
        name: "India",
      },
      knowsAbout: [
        "Android Architecture",
        "Jetpack Compose",
        "Material 3 Expressive",
        "Kotlin & Coroutines Flow",
        "Clean Architecture (UDF)",
        "Next.js App Router",
        "TypeScript",
        "Cloudflare Workers & Edge AI",
        "AGSL Progressive Shaders",
        "Full-Stack Web Development",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://balajitechlab.com/#website",
      url: "https://balajitechlab.com",
      name: "Balaji S. — balajitechlabs",
      description: "Official engineering portfolio, Android architecture blueprints, and open-source project showcase of Balaji S.",
      publisher: {
        "@id": "https://balajitechlab.com/#person",
      },
    },
    {
      "@type": "ProfilePage",
      "@id": "https://balajitechlab.com/#profilepage",
      url: "https://balajitechlab.com",
      name: "Balaji S. Engineering Portfolio",
      mainEntity: {
        "@id": "https://balajitechlab.com/#person",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght,wdth,ROND@6..144,1..1000,100..150,0..100&display=swap"
          rel="stylesheet"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,200"
          as="style"
        />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />

        {/* JSON-LD Schema for Google Search Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />

        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="f35df0a1-95c5-4edf-b397-46a6071914f7"
          strategy="beforeInteractive"
        />
        <Script
          src="https://code.jquery.com/jquery-3.6.0.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6F3G1NW62X"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6F3G1NW62X');
          `}
        </Script>
      </head>
      <body>
        <LoadingScreen />
        <Cursor />
        {children}
        <Toaster position="bottom-right" richColors closeButton theme="dark" />
      </body>
    </html>
  );
}
