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

// All partner logos (only including existing ones)
const partnerLogos = [1, 2, 3, 4, 5, 6, 7, 9, 11, 12].map((num) => `/image/logo partner/${num}.png`);

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
      className="relative py-3 md:py-14 overflow-hidden border-b border-white/5"
    >
      <div
        className="flex w-fit items-center"
        style={{
          animation: `marquee ${speedMap[speed]} linear infinite`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {/* First set of logos */}
        <div className="flex items-center gap-16 md:gap-40 pr-16 md:pr-40 shrink-0 min-w-max">
          {partnerLogos.map((logo, idx) => (
            <div key={`set1-${idx}`} className="flex items-center shrink-0">
              <Image
                src={logo}
                alt={`Partner ${idx}`}
                width={180}
                height={90}
                className="h-10 md:h-28 w-auto object-contain transition-all duration-500 grayscale opacity-40 hover:grayscale-0 hover:opacity-100"
              />
            </div>
          ))}
        </div>

        {/* Second identical set of logos for seamless loop */}
        <div className="flex items-center gap-16 md:gap-40 pr-16 md:pr-40 shrink-0 min-w-max">
          {partnerLogos.map((logo, idx) => (
            <div key={`set2-${idx}`} className="flex items-center shrink-0">
              <Image
                src={logo}
                alt={`Partner ${idx}`}
                width={180}
                height={90}
                className="h-10 md:h-28 w-auto object-contain transition-all duration-500 grayscale opacity-40 hover:grayscale-0 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
