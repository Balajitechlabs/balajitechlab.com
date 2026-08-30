"use client";

import "@/styles/index/socials-chips.css";
import { soundFx } from "@/lib/soundFx";

const SOCIALS = [
  {
    label: "GitHub",
    url: "https://github.com/balajitechlabs",
    icon: <i className="fa-brands fa-github" />,
    social: "github",
  },
  {
    label: "Mail",
    url: "https://mail.google.com/mail/?view=cm&to=admin@balajitechlab.com",
    icon: <i className="fa-regular fa-envelope" />,
    social: "email",
  },
  {
    label: "My Apps",
    url: "https://play.google.com/store/apps/dev?id=9073716923131512981",
    icon: <i className="fa-brands fa-google-play" />,
    social: "google-play",
  },
  {
    label: "X (Twitter)",
    url: "https://twitter.com/balajitechlabs",
    icon: <i className="fa-brands fa-x-twitter" />,
    social: "twitter",
  },
  {
    label: "LinkedIn",
    url: "https://linkedin.com/in/balajitechlabs",
    icon: <i className="fa-brands fa-linkedin" />,
    social: "linkedin",
  },
  {
    label: "GitLab",
    url: "https://gitlab.com/balajitechlabs",
    icon: <i className="fa-brands fa-gitlab" />,
    social: "gitlab",
  },
  {
    label: "Instagram",
    url: "https://instagram.com/balajitechlabs",
    icon: <i className="fa-brands fa-instagram" />,
    social: "instagram",
  },
  {
    label: "YouTube",
    url: "https://youtube.com/@balajitechlabs-org",
    icon: <i className="fa-brands fa-youtube" />,
    social: "youtube",
  },
  {
    label: "Telegram",
    url: "https://t.me/balajitechlabs",
    icon: <i className="fa-brands fa-telegram" />,
    social: "telegram",
  },
  {
    label: "r/balajitechlabs",
    url: "https://reddit.com/r/balajitechlabs",
    icon: <i className="fa-brands fa-reddit" />,
    social: "reddit",
  },
  {
    label: "u/balaji_developer",
    url: "https://www.reddit.com/user/balaji_developer/",
    icon: <i className="fa-brands fa-reddit-alien" />,
    social: "reddit",
  },
];

export default function SocialsChips() {
  return (
    <div className="socials-chips item">
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.url}
          target={s.url.startsWith("mailto") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="socials-chip"
          data-social={s.social}
          onClick={() => soundFx.playPop()}
        >
          {s.icon}
          <span>{s.label}</span>
        </a>
      ))}
    </div>
  );
}
