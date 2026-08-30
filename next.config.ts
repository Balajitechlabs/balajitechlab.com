import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 🚀 Showcase Projects & Apps Link Shorteners
      {
        source: "/quickdash",
        destination: "https://quickdash.balajitechlab.com",
        permanent: false,
      },
      {
        source: "/discord-music-card",
        destination: "https://github.com/balajitechlabs/discord-music-card",
        permanent: false,
      },
      {
        source: "/discord-card",
        destination: "https://github.com/balajitechlabs/discord-music-card",
        permanent: false,
      },
      {
        source: "/universal-updater",
        destination: "https://github.com/balajitechlabs/universal-updater-raycast",
        permanent: false,
      },
      {
        source: "/play-console-tools",
        destination: "https://github.com/balajitechlabs/google-play-console-tools",
        permanent: false,
      },
      {
        source: "/password-generator",
        destination: "https://github.com/balajitechlabs/password-genaration",
        permanent: false,
      },
      {
        source: "/password-gen",
        destination: "https://github.com/balajitechlabs/password-genaration",
        permanent: false,
      },

      // 🌐 Socials & Quick Action Shorteners
      {
        source: "/resume",
        destination: "https://drive.google.com/file/d/1ma7OFq0KgLPiQKTDZD-PtP5S0H3BAk5q/view?usp=sharing",
        permanent: false,
      },
      {
        source: "/cv",
        destination: "https://drive.google.com/file/d/1ma7OFq0KgLPiQKTDZD-PtP5S0H3BAk5q/view?usp=sharing",
        permanent: false,
      },
      {
        source: "/github",
        destination: "https://github.com/balajitechlabs",
        permanent: false,
      },
      {
        source: "/playstore",
        destination: "https://play.google.com/store/apps/dev?id=9073716923131512981",
        permanent: false,
      },
      {
        source: "/apps",
        destination: "https://play.google.com/store/apps/dev?id=9073716923131512981",
        permanent: false,
      },
      {
        source: "/telegram",
        destination: "https://t.me/balajitechlabs",
        permanent: false,
      },
      {
        source: "/tg",
        destination: "https://t.me/balajitechlabs",
        permanent: false,
      },
      {
        source: "/linkedin",
        destination: "https://linkedin.com/in/balajitechlabs",
        permanent: false,
      },
      {
        source: "/x",
        destination: "https://twitter.com/balajitechlabs",
        permanent: false,
      },
      {
        source: "/twitter",
        destination: "https://twitter.com/balajitechlabs",
        permanent: false,
      },
      {
        source: "/mail",
        destination: "https://mail.google.com/mail/?view=cm&to=admin@balajitechlab.com",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
