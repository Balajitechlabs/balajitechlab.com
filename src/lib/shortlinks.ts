export interface Shortlink {
  slug: string;
  title: string;
  destination: string;
  category: "App" | "Open Source" | "Social" | "Resume" | "Tools";
  icon: string; // Material symbols icon name
  badge: string;
  description: string;
}

export const SHORTLINKS: Record<string, Shortlink> = {
  // 🚀 Featured Apps & Platforms
  quickdash: {
    slug: "quickdash",
    title: "QuickDash — Android Productivity Toolkit",
    destination: "https://quickdash.balajitechlab.com",
    category: "App",
    icon: "android",
    badge: "Official Android App",
    description: "Multi-tool productivity suite & power toolkit engineered for Android with Material 3 Expressive UI.",
  },
  "discord-music-card": {
    slug: "discord-music-card",
    title: "Live Discord Activity & BTL-Music Card",
    destination: "https://github.com/balajitechlabs/discord-music-card",
    category: "Open Source",
    icon: "music_note",
    badge: "Open Source Widget",
    description: "Real-time animated SVG status card for GitHub Profile READMEs and websites featuring dynamic album art glow.",
  },
  "discord-card": {
    slug: "discord-card",
    title: "Live Discord Activity & BTL-Music Card",
    destination: "https://github.com/balajitechlabs/discord-music-card",
    category: "Open Source",
    icon: "music_note",
    badge: "Open Source Widget",
    description: "Real-time animated SVG status card for GitHub Profile READMEs and websites featuring dynamic album art glow.",
  },
  "play-console-tools": {
    slug: "play-console-tools",
    title: "Google Play Console Developer Tools",
    destination: "https://github.com/balajitechlabs/google-play-console-tools",
    category: "Tools",
    icon: "terminal",
    badge: "Developer CLI Tool",
    description: "Automated test-track workflows, compliance checklists, and closed-testing tester dispatch tools.",
  },
  "universal-updater": {
    slug: "universal-updater",
    title: "Universal Updater — Raycast Extension",
    destination: "https://github.com/balajitechlabs/universal-updater-raycast",
    category: "Tools",
    icon: "update",
    badge: "Raycast Extension",
    description: "1-click unified package manager updater for Homebrew, npm, pnpm, Python uv, Mac App Store, and macOS.",
  },
  "password-generator": {
    slug: "password-generator",
    title: "Cryptographic Password Generator",
    destination: "https://github.com/balajitechlabs/password-genaration",
    category: "Tools",
    icon: "lock",
    badge: "Security Utility",
    description: "Client-side cryptographic password, passphrase, and token generator with zero-leak memory security.",
  },

  // 🌐 Profiles, Socials & Developer Hubs
  github: {
    slug: "github",
    title: "balajitechlabs on GitHub",
    destination: "https://github.com/balajitechlabs",
    category: "Open Source",
    icon: "code",
    badge: "Verified GitHub Profile",
    description: "Explore 52+ open-source repositories, Android architecture showcases, and modern full-stack web projects.",
  },
  playstore: {
    slug: "playstore",
    title: "Google Play Store Developer Console",
    destination: "https://play.google.com/store/apps/dev?id=9073716923131512981",
    category: "App",
    icon: "shop",
    badge: "Google Play Developer",
    description: "Official Google Play Console developer page for balajitechlabs apps and native Android releases.",
  },
  apps: {
    slug: "apps",
    title: "Google Play Store Developer Console",
    destination: "https://play.google.com/store/apps/dev?id=9073716923131512981",
    category: "App",
    icon: "shop",
    badge: "Google Play Developer",
    description: "Official Google Play Console developer page for balajitechlabs apps and native Android releases.",
  },
  linkedin: {
    slug: "linkedin",
    title: "Balaji S. on LinkedIn",
    destination: "https://linkedin.com/in/balajitechlabs",
    category: "Social",
    icon: "work",
    badge: "Professional Profile",
    description: "Connect with Balaji S. — Principal Android Architect & Full-Stack Developer on LinkedIn.",
  },
  telegram: {
    slug: "telegram",
    title: "balajitechlabs on Telegram",
    destination: "https://t.me/balajitechlabs",
    category: "Social",
    icon: "send",
    badge: "Direct Telegram Channel",
    description: "Direct messaging, quick discussions, and engineering updates on Telegram.",
  },
  tg: {
    slug: "tg",
    title: "balajitechlabs on Telegram",
    destination: "https://t.me/balajitechlabs",
    category: "Social",
    icon: "send",
    badge: "Direct Telegram Channel",
    description: "Direct messaging, quick discussions, and engineering updates on Telegram.",
  },
  x: {
    slug: "x",
    title: "balajitechlabs on X (Twitter)",
    destination: "https://twitter.com/balajitechlabs",
    category: "Social",
    icon: "alternate_email",
    badge: "Official X Profile",
    description: "Follow @balajitechlabs for real-time build updates, Android architecture insights, and open-source drops.",
  },
  twitter: {
    slug: "twitter",
    title: "balajitechlabs on Twitter",
    destination: "https://twitter.com/balajitechlabs",
    category: "Social",
    icon: "alternate_email",
    badge: "Official Twitter Profile",
    description: "Follow @balajitechlabs for real-time build updates, Android architecture insights, and open-source drops.",
  },
  mail: {
    slug: "mail",
    title: "Email Balaji S. (admin@balajitechlab.com)",
    destination: "mailto:admin@balajitechlab.com",
    category: "Social",
    icon: "mail",
    badge: "Official Email",
    description: "Send an email inquiry directly to admin@balajitechlab.com.",
  },
  resume: {
    slug: "resume",
    title: "Balaji S. — Executive Resume (PDF)",
    destination: "https://drive.google.com/file/d/1ma7OFq0KgLPiQKTDZD-PtP5S0H3BAk5q/view?usp=sharing",
    category: "Resume",
    icon: "description",
    badge: "Verified ATS Resume",
    description: "Official single-page vector PDF resume for Balaji S. (Principal Android Architect & Full Stack Developer).",
  },
  cv: {
    slug: "cv",
    title: "Balaji S. — Executive Resume (PDF)",
    destination: "https://drive.google.com/file/d/1ma7OFq0KgLPiQKTDZD-PtP5S0H3BAk5q/view?usp=sharing",
    category: "Resume",
    icon: "description",
    badge: "Verified ATS Resume",
    description: "Official single-page vector PDF resume for Balaji S. (Principal Android Architect & Full Stack Developer).",
  },
};

export function getShortlink(slug: string): Shortlink | null {
  const normalized = slug.toLowerCase().trim();
  return SHORTLINKS[normalized] || null;
}

export function getAllShortlinks(): Shortlink[] {
  // Deduplicate aliases like discord-card/discord-music-card, tg/telegram, cv/resume
  const seen = new Set<string>();
  const list: Shortlink[] = [];
  for (const s of Object.values(SHORTLINKS)) {
    if (!seen.has(s.destination)) {
      seen.add(s.destination);
      list.push(s);
    }
  }
  return list;
}
