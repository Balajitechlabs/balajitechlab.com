"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface ProfileImage {
  src: string;
  alt: string;
}

const profileImages: ProfileImage[] = [
  { src: "/assets/img/profile/photo-1.jpg", alt: "Balaji S. - Profile 1" },
  { src: "/assets/img/profile/photo-2.jpg", alt: "Balaji S. - Profile 2" },
  { src: "/assets/img/profile/photo-3.jpg", alt: "Balaji S. - Profile 3" },
  { src: "/assets/img/profile/photo-4.jpg", alt: "Balaji S. - Profile 4" },
  { src: "/assets/img/profile/photo-5.png", alt: "Balaji S. - Profile 5" },
];

export default function Photo3DGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = profileImages.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay interval
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 3800);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  return (
    <div
      className="photo-3d-wrapper item"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="3D Profile Gallery"
    >
      <div className="photo-3d-stage">
        {profileImages.map((img, index) => {
          // Compute circular relative distance (-2, -1, 0, 1, 2)
          let offset = index - activeIndex;
          if (offset > Math.floor(total / 2)) offset -= total;
          if (offset < -Math.floor(total / 2)) offset += total;

          const isActive = offset === 0;
          const isPrev = offset === -1;
          const isNext = offset === 1;
          const isHidden = Math.abs(offset) > 2;

          let transform = "scale(0) translateZ(-300px)";
          let opacity = 0;
          let zIndex = 0;

          if (isActive) {
            transform = "rotateY(0deg) translateZ(120px) scale(1)";
            opacity = 1;
            zIndex = 10;
          } else if (isNext) {
            transform = "rotateY(-36deg) translateX(130px) translateZ(-40px) scale(0.86)";
            opacity = 0.72;
            zIndex = 5;
          } else if (isPrev) {
            transform = "rotateY(36deg) translateX(-130px) translateZ(-40px) scale(0.86)";
            opacity = 0.72;
            zIndex = 5;
          } else if (offset === 2) {
            transform = "rotateY(-55deg) translateX(210px) translateZ(-130px) scale(0.72)";
            opacity = 0.35;
            zIndex = 2;
          } else if (offset === -2) {
            transform = "rotateY(55deg) translateX(-210px) translateZ(-130px) scale(0.72)";
            opacity = 0.35;
            zIndex = 2;
          }

          if (isHidden) {
            opacity = 0;
          }

          return (
            <div
              key={index}
              className={`photo-3d-card ${isActive ? "active" : ""}`}
              style={{
                transform,
                opacity,
                zIndex,
              }}
              onClick={() => setActiveIndex(index)}
              title={isActive ? "Active photo" : "Click to view photo"}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="photo-3d-img"
                loading={index < 2 ? "eager" : "lazy"}
              />
              <div className="photo-3d-shine" />
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="photo-3d-controls">
        <button
          type="button"
          className="photo-3d-nav-btn prev"
          onClick={prevSlide}
          aria-label="Previous photo"
        >
          <span className="material-symbols-rounded">chevron_left</span>
        </button>

        <div className="photo-3d-dots">
          {profileImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`photo-3d-dot ${idx === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to photo ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="photo-3d-nav-btn next"
          onClick={nextSlide}
          aria-label="Next photo"
        >
          <span className="material-symbols-rounded">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
