"use client";

import { useEffect, useState, useCallback } from "react";

interface GitHubStats {
  repos: number;
  stars: number;
  followers: number;
  streak: {
    current: number;
    longest: number;
    totalThisYear: number;
  };
  graphqlOk: boolean;
}

export default function GitHubChips() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(() => {
    fetch(`/api/github-stats?t=${Date.now()}`, {
      cache: "no-store",
      headers: { Pragma: "no-cache" },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && !d.error) {
          setStats(d);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchStats();

    // Instant update when switching tabs or window focuses
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchStats();
      }
    };

    window.addEventListener("focus", fetchStats);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", fetchStats);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchStats]);

  if (isLoading || !stats) {
    return (
      <div className="github-chips-row" aria-label="Loading GitHub stats...">
        {[80, 70, 90, 85, 85, 170].map((width, idx) => (
          <div
            key={idx}
            className="gh-chip-skeleton"
            style={{
              width: `${width}px`,
              animationDelay: `${idx * 0.12}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <a
      href="https://github.com/balajitechlabs"
      className="github-chips-row"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub profile"
    >
      {/* Repos */}
      <span className="gh-chip" data-gh="repos" title={`${stats.repos} public repositories`}>
        <span className="material-symbols-rounded gh-chip-icon">folder</span>
        <span className="gh-chip-value">{stats.repos}</span>
        <span className="gh-chip-label">Repos</span>
      </span>

      {/* Stars */}
      <span className="gh-chip" data-gh="stars" title={`${stats.stars} total stars`}>
        <span className="material-symbols-rounded gh-chip-icon">star</span>
        <span className="gh-chip-value">{stats.stars}</span>
        <span className="gh-chip-label">Stars</span>
      </span>

      {/* Followers */}
      <span className="gh-chip" data-gh="followers" title={`${stats.followers} followers`}>
        <span className="material-symbols-rounded gh-chip-icon">group</span>
        <span className="gh-chip-value">{stats.followers}</span>
        <span className="gh-chip-label">Followers</span>
      </span>

      {/* Current Live Streak (GraphQL) */}
      {stats.streak.current > 0 && (
        <span className="gh-chip" data-gh="streak" title={`Current streak: ${stats.streak.current} days`}>
          <span className="material-symbols-rounded gh-chip-icon">local_fire_department</span>
          <span className="gh-chip-value">{stats.streak.current}d</span>
          <span className="gh-chip-label">Streak</span>
        </span>
      )}

      {/* Longest Streak Record (GraphQL) */}
      {stats.streak.longest > 0 && (
        <span className="gh-chip" data-gh="record" title={`All-time best streak: ${stats.streak.longest} consecutive days`}>
          <span className="material-symbols-rounded gh-chip-icon">military_tech</span>
          <span className="gh-chip-value">{stats.streak.longest}d</span>
          <span className="gh-chip-label">Record</span>
        </span>
      )}

      {/* Unified Tech Stack Chip */}
      <span className="gh-chip" data-gh="stack" title="Favorite Stack: Next.js · Kotlin · Python · Java">
        <span className="material-symbols-rounded gh-chip-icon">terminal</span>
        <span className="gh-chip-value">Next.js · Kotlin · Python · Java</span>
      </span>
    </a>
  );
}
