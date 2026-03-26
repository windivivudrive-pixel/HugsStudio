"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CustomCursor — A creative, glowing ring cursor that smoothly follows the mouse.
 * - Expands when hovering over interactive elements (links, buttons, sliders)
 * - Hidden on touch devices
 * - Uses Framer Motion springs for smooth, fluid movement
 */
export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Raw mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothed cursor position with spring physics
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch devices
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Track hover state on interactive elements
    const handleElementHover = () => setIsHovering(true);
    const handleElementLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Attach hover listeners to all interactive elements
    const interactiveSelectors = "a, button, [role='button'], input, textarea, [data-cursor-hover]";
    
    // Use event delegation for better performance and reliability with dynamic elements
    const handleGlobalMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest && target.closest(interactiveSelectors)) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mouseover", handleGlobalMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", handleGlobalMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  // Don't render on touch devices
  if (isTouchDevice) return null;

  return (
    <>
      {/* Ambient Mouse Background Glow — Elevated for visibility over solid backgrounds */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[10] rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%)",
          mixBlendMode: "plus-lighter",
        }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      />

      {/* Outer glowing square */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 48 : 24,
          height: isHovering ? 48 : 24,
          opacity: isVisible ? 1 : 0,
          borderWidth: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div
          className="h-full w-full rounded-none"
          style={{
            border: `1px solid rgba(255, 255, 255, ${isHovering ? 0.9 : 0.5})`,
            boxShadow: isHovering
              ? "0 0 25px rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.15)"
              : "0 0 12px rgba(255, 255, 255, 0.2)",
            background: isHovering
              ? "rgba(255, 255, 255, 0.08)"
              : "transparent",
          }}
        />
      </motion.div>

      {/* Inner square dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-none bg-white"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 6 : 3,
          height: isHovering ? 6 : 3,
          opacity: isVisible ? (isHovering ? 1 : 0.8) : 0,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      />
    </>
  );
}
