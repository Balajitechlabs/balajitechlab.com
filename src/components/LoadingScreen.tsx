"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Graceful initialization timer (smooth 750ms reveal on refresh/load)
    const handleComplete = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 700);
    };

    if (document.readyState === "complete") {
      handleComplete();
    } else {
      window.addEventListener("load", handleComplete);
      const fallbackTimer = setTimeout(handleComplete, 1200);
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
            scale: 1.03,
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="btl-splash-overlay"
        >
          <div className="btl-splash-ambient-glow" />
          
          <motion.div 
            className="btl-splash-content"
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {/* Logo Avatar with Breathing Glow */}
            <div className="btl-splash-logo-wrap">
              <div className="btl-splash-logo-pulse-ring" />
              <img
                src="/assets/img/btl-topographic-avatar.png"
                alt="balajitechlabs"
                className="btl-splash-logo-img"
              />
            </div>

            {/* Brand Typography */}
            <div className="btl-splash-text-group">
              <span className="btl-splash-monogram">||BTL||™</span>
              <h1 className="btl-splash-brand">balajitechlabs</h1>
              <p className="btl-splash-caption">INITIALIZING SYSTEMS</p>
            </div>

            {/* High-Tech Progress Bar */}
            <div className="btl-splash-progress-track">
              <motion.div 
                className="btl-splash-progress-fill"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.65, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
