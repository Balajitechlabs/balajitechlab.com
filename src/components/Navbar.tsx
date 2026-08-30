"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { soundFx } from "@/lib/soundFx";

interface NavLink {
  href: string;
  id: string;
  icon: string;
  caption: string;
  ariaLabel: string;
}

interface NavbarProps {
  isArticle?: boolean;
  extraLinks?: NavLink[];
  backHref?: string;
}

export default function Navbar({
  isArticle = false,
  extraLinks = [],
  backHref = "/",
}: NavbarProps) {
  const [activeSegment, setActiveSegment] = useState("home");

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY || document.documentElement.scrollTop;

          if (isArticle && extraLinks.length > 0) {
            let currentActive = extraLinks[0].href.replace("#", "");
            for (const link of extraLinks) {
              const targetId = link.href.replace("#", "");
              const el = document.getElementById(targetId);
              if (el && currentScroll >= el.offsetTop - 220) {
                currentActive = targetId;
              }
            }
            setActiveSegment(currentActive);
            ticking = false;
            return;
          }

          if (isArticle) {
            ticking = false;
            return;
          }

          const updates = document.getElementById("updates");
          const projects = document.getElementById("projects");
          const about = document.getElementById("about-me");
          const techStack = document.getElementById("tech-stack");
          const contact = document.getElementById("contact");

          const updatesTop = updates ? updates.offsetTop : Infinity;
          const projectsTop = projects ? projects.offsetTop : Infinity;
          const aboutTop = about ? about.offsetTop : Infinity;
          const techStackTop = techStack ? techStack.offsetTop : Infinity;
          const contactTop = contact ? contact.offsetTop : Infinity;

          // Offset with hysteresis to prevent segment flickering
          if (currentScroll < updatesTop - 200) {
            setActiveSegment("home");
          } else if (currentScroll < projectsTop - 200) {
            setActiveSegment("updates");
          } else if (currentScroll < aboutTop - 200) {
            setActiveSegment("projects");
          } else if (currentScroll < techStackTop - 200) {
            setActiveSegment("about");
          } else if (currentScroll < contactTop - 200) {
            setActiveSegment("tech-stack");
          } else {
            setActiveSegment("contact");
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isArticle, extraLinks]);

  const renderLink = (link: NavLink, isNextLink = false) => {
    const Component = isNextLink ? Link : "a";
    const segmentId = link.href.replace("#", "");
    const isActive = activeSegment === segmentId;

    return (
      <li key={link.id}>
        <Component
          href={link.href}
          id={link.id}
          className={isActive ? "active" : ""}
          aria-label={link.ariaLabel}
        >
          <span className="material-symbols-rounded">{link.icon}</span>
          <span className="caption">{link.caption}</span>
        </Component>
      </li>
    );
  };

  return (
    <nav id="nav" aria-label="Main Navigation">
      <ul>
        {isArticle ? (
          <>
            <li>
              <Link href={backHref} id="home-nav" aria-label="Back to home">
                <span className="material-symbols-rounded">arrow_back</span>
                <span className="caption">Back</span>
              </Link>
            </li>
            {extraLinks.map((link) => renderLink(link))}
          </>
        ) : (
          <>
            <li>
              <a
                href="#"
                id="home-nav"
                className={activeSegment === "home" ? "active" : ""}
                aria-label="Home - navigation bar"
              >
                <span className="material-symbols-rounded">space_dashboard</span>
                <span className="caption">Home</span>
              </a>
            </li>
            <li key="updates-nav">
              <a
                href="#updates"
                id="updates-nav"
                className={activeSegment === "updates" ? "active" : ""}
                aria-label="Updates - Navigation bar"
              >
                <span className="material-symbols-rounded">notifications_unread</span>
                <span className="caption">Updates</span>
              </a>
            </li>
            <li key="projects-nav">
              <a
                href="#projects"
                id="projects-nav"
                className={activeSegment === "projects" ? "active" : ""}
                aria-label="Projects - Navigation bar"
              >
                <span className="material-symbols-rounded">apps</span>
                <span className="caption">Projects</span>
              </a>
            </li>
            <li key="about-nav">
              <a
                href="#about-me"
                id="about-nav"
                className={activeSegment === "about" ? "active" : ""}
                aria-label="About me - Navigation bar"
              >
                <span className="material-symbols-rounded">person</span>
                <span className="caption">About</span>
              </a>
            </li>
            <li key="tech-nav">
              <a
                href="#tech-stack"
                id="tech-nav"
                className={activeSegment === "tech-stack" ? "active" : ""}
                aria-label="Tech Stack - Navigation bar"
              >
                <span className="material-symbols-rounded">memory</span>
                <span className="caption">Stack</span>
              </a>
            </li>
            <li key="contact-nav">
              <a
                href="#contact"
                id="contact-nav"
                className={activeSegment === "contact" ? "active" : ""}
                aria-label="Contact me - Navigation bar"
                onClick={() => soundFx.playClick()}
              >
                <span className="material-symbols-rounded">send</span>
                <span className="caption">Contact</span>
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
