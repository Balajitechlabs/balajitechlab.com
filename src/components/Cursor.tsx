"use client";

import { useEffect, useRef } from "react";
import "@/styles/common/no-cursor.css";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only initialize on non-touch devices with a fine pointer
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    const cursorText = cursorTextRef.current;
    if (!cursor || !cursorText) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    // Smooth 120Hz/144Hz lerp render loop
    const render = () => {
      // Fast lerp (0.35) gives ultra-responsive tracking with zero glitch
      currentX += (targetX - currentX) * 0.45;
      currentY += (targetY - currentY) * 0.45;

      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Global event delegation — 0 overhead, 0 mutation observers
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        "a, button, [role='button'], input, textarea, select, .clickable, .highlight-item, .tech-shield-badge, .photo-3d-card, .pill, .gh-chip, .gh-cal-rect, rect[data-title]"
      );

      if (target) {
        cursor.classList.add("cursor-hover");
        const title = target.getAttribute("data-title");
        if (title) {
          cursorText.textContent = title;
          cursorText.style.transform = "scale(1)";
        } else {
          cursorText.style.transform = "scale(0)";
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        "a, button, [role='button'], input, textarea, select, .clickable, .highlight-item, .tech-shield-badge, .photo-3d-card, .pill, .gh-chip, .gh-cal-rect, rect[data-title]"
      );

      if (target) {
        cursor.classList.remove("cursor-hover");
        cursorText.style.transform = "scale(0)";
      }
    };

    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <div className="custom-cursor-wrapper" ref={cursorRef} aria-hidden="true">
      <div className="custom-cursor-dot" />
      <div id="cursor-text" ref={cursorTextRef} />
    </div>
  );
}
