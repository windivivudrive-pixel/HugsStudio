"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/**
 * LogoMarquee — Infinitely scrolling horizontal strip of partner logos.
 * Features:
 * - Perfectly seamless loop using a double-set technique
 * - Refined spacing and speed for a premium feel
 * - High visibility monochromatic styling
 */

interface LogoMarqueeProps {
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
}

// All partner logos (cleaned up duplicates)
const partnerLogos = [
  "/image/logo partner/partner0.png",
  "/image/logo partner/partner1.png",
  "/image/logo partner/partner2.png",
  "/image/logo partner/partner3.png",
  "/image/logo partner/partner5.png",
  "/image/logo partner/partner6.png",
  "/image/logo partner/partner8.png",
  "/image/logo partner/partner9.png",
  "/image/logo partner/partner10.png",
  "/image/logo partner/partner11.png",
  "/image/logo partner/partner12.png",
  "/image/logo partner/partner13.png",
  "/image/logo partner/partner14.png",
  "/image/logo partner/partner16.png",
  "/image/logo partner/partner17.png",
  "/image/logo partner/partner18.png",
  "/image/logo partner/partner20.png",
  "/image/logo partner/partner21.png",
  "/image/logo partner/partner22.png",
  "/image/logo partner/partner23.png",
  "/image/logo partner/partner25.png",
];

export default function LogoMarquee({
  speed = "normal",
  direction = "right",
}: LogoMarqueeProps) {
  const speedMap = {
    slow: "100s",
    normal: "80s",
    fast: "60s",
  };

  // For a perfectly seamless loop with 'translateX(-50%)':
  // 1. We use two identical sets.
  // 2. The gap between the two sets (the 'pr-...' on the containers) 
  //    MUST be exactly the same as the gap between the logos ('gap-...') inside the containers.
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative py-12 md:py-20 overflow-hidden border-b border-white/5"
    >
      <div
        className="flex w-fit items-center"
        style={{
          animation: `marquee ${speedMap[speed]} linear infinite`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {/* First set of logos */}
        <div className="flex items-center gap-16 md:gap-32 pr-16 md:pr-32 shrink-0 min-w-max">
          {partnerLogos.map((logo, idx) => (
            <div key={`set1-${idx}`} className="flex items-center shrink-0">
              <Image
                src={logo}
                alt={`Partner ${idx}`}
                width={80}
                height={40}
                className="h-8 md:h-14 w-auto object-contain transition-all duration-500 brightness-0 invert opacity-60 hover:brightness-100 hover:invert-0 hover:opacity-100"
              />
            </div>
          ))}
        </div>

        {/* Second identical set of logos for seamless loop */}
        <div className="flex items-center gap-16 md:gap-32 pr-16 md:pr-32 shrink-0 min-w-max">
          {partnerLogos.map((logo, idx) => (
            <div key={`set2-${idx}`} className="flex items-center shrink-0">
              <Image
                src={logo}
                alt={`Partner ${idx}`}
                width={80}
                height={40}
                className="h-8 md:h-14 w-auto object-contain transition-all duration-500 brightness-0 invert opacity-60 hover:brightness-100 hover:invert-0 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
