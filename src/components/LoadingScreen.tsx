"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ultra-snappy mobile & desktop reveal
    const handleComplete = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 550);
    };

    if (document.readyState === "complete") {
      handleComplete();
    } else {
      window.addEventListener("load", handleComplete, { once: true });
      const fallbackTimer = setTimeout(handleComplete, 1000);
      return () => {
        window.removeEventListener("load", handleComplete);
        clearTimeout(fallbackTimer);
      };
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.02,
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="btl-splash-overlay"
        >
          <div className="btl-splash-ambient-glow" aria-hidden="true" />
          
          <motion.div 
            className="btl-splash-content"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Logo Avatar with Breathing Glow */}
            <div className="btl-splash-logo-wrap">
              <div className="btl-splash-logo-pulse-ring" aria-hidden="true" />
              <Image
                src="/assets/img/btl-topographic-avatar.png"
                alt="balajitechlabs"
                width={84}
                height={84}
                className="btl-splash-logo-img"
                priority
              />
            </div>

            {/* Brand Typography */}
            <div className="btl-splash-text-group">
              <span className="btl-splash-monogram">||BTL||™</span>
              <h1 className="btl-splash-brand">balajitechlabs</h1>
              <p className="btl-splash-caption">INITIALIZING SYSTEMS</p>
            </div>

            {/* Minimalist Progress Bar */}
            <div className="btl-splash-progress-track" aria-hidden="true">
              <motion.div 
                className="btl-splash-progress-fill"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
