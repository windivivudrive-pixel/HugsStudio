"use client";

import { motion } from "framer-motion";

/**
 * MarqueeStrip — Infinitely scrolling horizontal text strip.
 * Features:
 * - Smooth CSS-based infinite scroll
 * - Neon dot separators
 * - Frosted glass top/bottom borders
 */

interface MarqueeStripProps {
  items?: string[];
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
}

const defaultItems = [
  "ẢNH F&B",
  "CHỤP ẢNH TÁCH NỀN",
  "PROFILE CÁ NHÂN/DOANH NGHIỆP",
  "ẢNH LIFESTYLE",
  "ẢNH BEAUTY",
  "ẢNH BRANDING",
  "CHỤP ẢNH SỰ KIỆN",
  "QUAY TVC",
];

export default function MarqueeStrip({
  items = defaultItems,
  speed = "normal",
  direction = "left",
}: MarqueeStripProps) {
  const speedMap = {
    slow: "120s",
    normal: "90s",
    fast: "60s",
  };

  // Repeat items multiple times for seamless loop (4x for safety with short lists)
  const allItems = [...items, ...items, ...items, ...items];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative py-6 md:py-8 overflow-hidden border-y border-white/5 bg-obsidian/50 backdrop-blur-sm"
    >
      <div
        className="flex items-center gap-4 md:gap-8 whitespace-nowrap w-max"
        style={{
          animation: `marquee ${speedMap[speed]} linear infinite`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {allItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 md:gap-8">
            <span className="font-heading text-sm md:text-2xl font-medium text-white/50 hover:text-white transition-colors duration-300 uppercase tracking-wider">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 opacity-40 shrink-0" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
