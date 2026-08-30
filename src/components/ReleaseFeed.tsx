"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { ReleaseNote, AppTag } from "@/lib/releaseNotes";
import "@/styles/index/release-feed.css";

interface ReleaseFeedProps {
  notes: ReleaseNote[];
  filter?: AppTag | "all";
  hideGradient?: boolean;
}

const LOGO_MAP: Record<string, string> = {
  quickdash: "/assets/img/project-logos/quickdash-logo.svg",
  "discord-music-card": "/assets/img/project-logos/discord-music-card-logo.svg",
  balajitechlabs: "/assets/img/project-logos/balajitechlabs-logo.png",
  "universal-updater": "/assets/img/project-logos/universal-updater-logo.svg",
  "password-generator": "/assets/img/project-logos/password-generator-logo.svg",
  "old-portfolio": "/assets/img/project-logos/old-portfolio-logo.jpeg",
  "play-console-tools": "/assets/img/project-logos/play-console-tools-logo.svg",
};

const APP_TO_PROJECT_KEY: Record<string, string> = {
  quickdash: "quickdash",
  "discord-music-card": "discord-music-card",
  balajitechlabs: "balajitechlabs",
  "universal-updater": "universal-updater",
  "password-generator": "password-generator",
  "old-portfolio": "old-portfolio",
  "play-console-tools": "play-console-tools",
};

export default function ReleaseFeed({ 
  notes, 
  filter = "all", 
  hideGradient = false 
}: ReleaseFeedProps) {
  const [selectedNote, setSelectedNote] = useState<ReleaseNote | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalOrigin, setModalOrigin] = useState<{ x: string, y: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [projectDetails, setProjectDetails] = useState<Record<string, { stars: number; downloads: number }> | null>(null);

  useEffect(() => {
    fetch("/project-details.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setProjectDetails(data);
      })
      .catch(() => {});
  }, []);

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const filteredNotes =
    filter === "all" ? notes : notes.filter((n) => n.app === filter);

  // Handle deep linking on mount
  useEffect(() => {
    const updateSlug = searchParams.get("update");
    if (updateSlug) {
      const note = notes.find((n) => n.slug === updateSlug);
      if (note) {
        setSelectedNote(note);
        setIsModalVisible(true);
        
        const updatesSection = document.getElementById("updates");
        if (updatesSection) {
          updatesSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [notes, searchParams]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setTimeout(() => {
              setVisibleIndices((prev) => new Set(prev).add(index));
            }, (index % 5) * 60);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: scrollRef.current,
        threshold: 0.1,
      }
    );

    const cards = scrollRef.current?.querySelectorAll(".release-card-trigger") ?? [];
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [filteredNotes]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (selectedNote) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
    }
    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, [selectedNote]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 284;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const openNote = (note: ReleaseNote, e?: React.MouseEvent | React.FocusEvent) => {
    if (e) {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      setModalOrigin({
        x: `${rect.left + rect.width / 2}px`,
        y: `${rect.top + rect.height / 2}px`
      });
    } else {
      setModalOrigin({ x: "50%", y: "50%" });
    }

    setSelectedNote(note);
    setCopiedLink(false);
    setTimeout(() => setIsModalVisible(true), 10);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("update", note.slug);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const closeNote = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setSelectedNote(null);
      setModalOrigin(null);
      setCopiedLink(false);
    }, 280);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("update");
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedNote || typeof window === "undefined") return;
    
    const url = `${window.location.origin}${pathname}?update=${selectedNote.slug}`;
    let success = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        success = true;
      }
    } catch {
      success = false;
    }

    if (!success) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.opacity = "0";
        textArea.style.pointerEvents = "none";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch (err) {
        console.error("Fallback copy failed", err);
      }
    }

    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedNote) {
        closeNote();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNote]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (filteredNotes.length === 0) return null;

  return (
    <>
      <div className={`release-feed-wrapper ${isLoaded ? "page-loaded" : ""}`}>
        <div className="release-nav-btns">
          <button 
            className="release-nav-btn prev" 
            onClick={() => scroll("left")}
            aria-label="Previous"
          >
            <span className="material-symbols-rounded">chevron_left</span>
          </button>
          <button 
            className="release-nav-btn next" 
            onClick={() => scroll("right")}
            aria-label="Next"
          >
            <span className="material-symbols-rounded">chevron_right</span>
          </button>
        </div>

        <div className="release-feed-scroll no-scrollbar" ref={scrollRef}>
          {filteredNotes.map((note, index) => (
            <button
              key={note.slug}
              className={`release-card release-card-trigger ${visibleIndices.has(index) ? "revealed" : ""}`}
              onClick={(e) => openNote(note, e)}
              data-app={note.app}
              data-index={index}
            >
              <div className="release-card-body">
                <div className="release-card-header-row">
                  {LOGO_MAP[note.app] && (
                    <img 
                      src={LOGO_MAP[note.app]} 
                      alt={note.app} 
                      className="release-card-logo"
                    />
                  )}
                  {note.badge && (
                    <span className="release-card-badge-pill">
                      {note.badge}
                    </span>
                  )}
                </div>
                <span className="release-app-tag">{note.app}</span>
                <h3 className="release-card-title">{note.title}</h3>
                <p className="release-card-desc">{note.description}</p>
                {note.tags && note.tags.length > 0 && (
                  <div className="release-card-tags">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="release-tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <span className="release-card-date">
                  {formatDate(note.date)}
                  {note.time ? ` · ${note.time} UTC` : ""}
                </span>
              </div>
            </button>
          ))}
        </div>
        {!hideGradient && <div className="release-feed-fade-right" />}
      </div>

      {selectedNote && (
        <div
          className={`release-modal-backdrop ${isModalVisible ? "visible" : ""}`}
          onClick={(e) => e.target === e.currentTarget && closeNote()}
          style={{
            "--origin-x": modalOrigin?.x ?? "50%",
            "--origin-y": modalOrigin?.y ?? "50%",
          } as React.CSSProperties}
        >
          <div 
            className={`release-modal ${isModalVisible ? "visible" : ""}`}
            data-app={selectedNote.app}
          >
            {/* Top Bar Header with macOS style traffic light on left */}
            <div className="release-modal-header">
              <div className="release-modal-left">
                <button 
                  className="release-modal-traffic-close" 
                  onClick={closeNote}
                  title="Close (Esc)"
                  aria-label="Close"
                >
                  <svg className="traffic-cross" viewBox="0 0 12 12" width="7" height="7">
                    <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </button>

                <div className="release-modal-brand">
                  {LOGO_MAP[selectedNote.app] && (
                    <img 
                      src={LOGO_MAP[selectedNote.app]} 
                      alt={selectedNote.app} 
                      className="release-modal-logo"
                    />
                  )}
                  <div className="release-modal-brand-info">
                    <span className="release-modal-app">{selectedNote.app}</span>
                    {selectedNote.badge && (
                      <span className="release-card-badge-pill modal">
                        {selectedNote.badge}
                      </span>
                    )}
                  </div>
                  
                  {(() => {
                    const projKey = APP_TO_PROJECT_KEY[selectedNote.app];
                    const detail = projectDetails?.[projKey];
                    if (!detail) return null;
                    return (
                      <div className="release-modal-stats">
                        {detail.stars > 0 && (
                          <span className="release-modal-stat-badge" title={`${detail.stars} stars`}>
                            <span className="material-symbols-rounded">star</span>
                            <span>{formatCount(detail.stars)}</span>
                          </span>
                        )}
                        {detail.downloads > 0 && (
                          <span className="release-modal-stat-badge" title={`${detail.downloads} downloads`}>
                            <span className="material-symbols-rounded">download</span>
                            <span>{formatCount(detail.downloads)}</span>
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="release-modal-actions">
                <button 
                  className={`release-modal-action-btn ${copiedLink ? "copied" : ""}`}
                  onClick={handleCopyLink}
                  title={copiedLink ? "Link Copied!" : "Copy Link"}
                  aria-label="Copy link to this update"
                >
                  <span className="material-symbols-rounded">
                    {copiedLink ? "check" : "link"}
                  </span>
                  <span className="release-modal-action-label">
                    {copiedLink ? "Copied!" : "Copy Link"}
                  </span>
                </button>
              </div>
            </div>

            {/* Hero Section */}
            <div className="release-modal-hero">
              <h2 className="release-modal-title">{selectedNote.title}</h2>
              
              <div className="release-modal-meta-row">
                <span className="release-modal-date-chip">
                  <span className="material-symbols-rounded">calendar_today</span>
                  <span>{formatDate(selectedNote.date)}{selectedNote.time ? ` · ${selectedNote.time} UTC` : ""}</span>
                </span>
                {selectedNote.version && (
                  <span className="release-modal-version-chip">
                    <span className="material-symbols-rounded">sell</span>
                    <span>{selectedNote.version}</span>
                  </span>
                )}
              </div>

              {selectedNote.tags && selectedNote.tags.length > 0 && (
                <div className="release-modal-tags">
                  {selectedNote.tags.map((tag) => (
                    <span key={tag} className="release-modal-tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Primary Action Button (Top) */}
            {selectedNote.link && (
              <div className="release-modal-cta-row">
                <a 
                  href={selectedNote.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="release-visit-btn"
                >
                  <span>Visit {selectedNote.app === "quickdash" ? "QuickDash" : "Project"}</span>
                  <span className="material-symbols-rounded">arrow_outward</span>
                </a>
              </div>
            )}
            
            {/* Changelog Content */}
            <div
              className="release-modal-content release-prose"
              dangerouslySetInnerHTML={{ __html: selectedNote.contentHtml }}
            />

            {/* Bottom Action for long changelogs */}
            {selectedNote.link && (
              <div className="release-modal-footer">
                <a 
                  href={selectedNote.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="release-visit-btn secondary"
                >
                  <span>Open {selectedNote.link.replace(/^https?:\/\//, '')}</span>
                  <span className="material-symbols-rounded">open_in_new</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
