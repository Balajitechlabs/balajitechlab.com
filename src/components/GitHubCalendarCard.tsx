"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface ActivityDay {
  date: string;
  count: number;
  level: number; // 0 to 4
}

interface CalendarData {
  calendar?: ActivityDay[];
}

interface GitHubCalendarCardProps {
  isMounted?: boolean;
}

export default function GitHubCalendarCard({ isMounted: _isMounted }: GitHubCalendarCardProps) {
  const [data, setData] = useState<ActivityDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const fetchCalendar = useCallback(() => {
    fetch(`/api/github-stats?t=${Date.now()}`, {
      cache: "no-store",
      headers: { Pragma: "no-cache" },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((res: CalendarData | null) => {
        if (res && Array.isArray(res.calendar) && res.calendar.length > 0) {
          setData(res.calendar);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchCalendar();

    // Instant update when switching tabs or window focuses
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchCalendar();
      }
    };

    window.addEventListener("focus", fetchCalendar);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", fetchCalendar);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchCalendar]);

  // Auto-scroll to end (current date) when mounted
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [data, isLoading]);

  // Group into 7-day columns (weeks)
  const weeks: ActivityDay[][] = [];
  let currentWeek: ActivityDay[] = [];

  for (const day of data) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Format date readable
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleCellEnter = (day: ActivityDay) => {
    if (!tooltipRef.current) return;
    tooltipRef.current.innerHTML = `<strong>${day.count} ${day.count === 1 ? "contribution" : "contributions"}</strong> on ${formatDate(day.date)}`;
    tooltipRef.current.style.opacity = "1";
    tooltipRef.current.style.transform = "translateX(-50%) translateY(0)";
  };

  const handleCellLeave = () => {
    if (!tooltipRef.current) return;
    tooltipRef.current.style.opacity = "0";
    tooltipRef.current.style.transform = "translateX(-50%) translateY(4px)";
  };

  return (
    <div
      ref={containerRef}
      className="item github-calendar"
      style={{ position: "relative" }}
      aria-label="GitHub contribution calendar"
    >
      {/* Zero Re-Render Floating Hover Tooltip */}
      <div
        ref={tooltipRef}
        className="gh-cal-tooltip"
        style={{
          opacity: 0,
          transform: "translateX(-50%) translateY(4px)",
          transition: "opacity 0.15s ease, transform 0.15s ease",
          pointerEvents: "none",
        }}
      />

      {isLoading || weeks.length === 0 ? (
        /* Simple Clean Loading Matrix */
        <div className="gh-cal-matrix" style={{ display: "flex", gap: "3px" }}>
          {Array.from({ length: 48 }).map((_, w) => (
            <div key={w} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {Array.from({ length: 7 }).map((_, d) => (
                <div key={d} className="gh-cal-cell" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        /* Real Live GraphQL Calendar Matrix */
        <div className="gh-cal-matrix">
          <svg
            width={weeks.length * 13}
            height={7 * 13}
            viewBox={`0 0 ${weeks.length * 13} ${7 * 13}`}
            className="gh-cal-svg"
            style={{ display: "block" }}
          >
            {weeks.map((week, colIdx) =>
              week.map((day, rowIdx) => (
                <rect
                  key={`${day.date}-${colIdx}-${rowIdx}`}
                  x={colIdx * 13}
                  y={rowIdx * 13}
                  width={10}
                  height={10}
                  rx={2.5}
                  ry={2.5}
                  data-level={day.level}
                  className={`gh-cal-rect level-${day.level}`}
                  onMouseEnter={() => handleCellEnter(day)}
                  onMouseLeave={handleCellLeave}
                />
              ))
            )}
          </svg>
        </div>
      )}
    </div>
  );
}
