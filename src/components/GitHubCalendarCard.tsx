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

  // Group days by Sunday-aligned weeks (matching official GitHub calendar grid)
  const weeks: (ActivityDay | null)[][] = [];
  if (data.length > 0) {
    let currentWeek: (ActivityDay | null)[] = [];

    const firstDate = new Date(data[0].date);
    const firstDayOfWeek = isNaN(firstDate.getTime()) ? 0 : firstDate.getUTCDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    for (const day of data) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
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

  return (
    <div
      ref={containerRef}
      className="item github-calendar"
      style={{ position: "relative" }}
      aria-label="GitHub contribution calendar"
    >
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
              week.map((day, rowIdx) => {
                if (!day) return null;
                const title =
                  day.count === 0
                    ? `No contributions on ${formatDate(day.date)}`
                    : `${day.count} ${day.count === 1 ? "contribution" : "contributions"} on ${formatDate(day.date)}`;
                return (
                  <rect
                    key={`${day.date}-${colIdx}-${rowIdx}`}
                    x={colIdx * 13}
                    y={rowIdx * 13}
                    width={10}
                    height={10}
                    rx={2.5}
                    ry={2.5}
                    data-level={day.level}
                    data-title={title}
                    className={`gh-cal-rect level-${day.level}`}
                  />
                );
              })
            )}
          </svg>
        </div>
      )}
    </div>
  );
}
