"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import Image from "next/image";

/**
 * HeroSlider — Full-screen featured projects slider.
 * Features:
 * - Full viewport height with large background images
 * - Drag/swipe gesture support via Framer Motion
 * - Blur + fade transitions between slides
 * - Bold typography overlapping images
 * - Auto-play with pause on hover
 * - Navigation dots
 */

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  gradient: string;
  video?: string;
  image?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "HUGs STUDIO",
    subtitle: "Studio Nhiếp Ảnh Chuyên Nghiệp",
    category: "NHIẾP ẢNH / QUAY PHIM / SÁNG TẠO",
    gradient: "from-zinc-900/20 via-black/40 to-black/80",
    video: "/image/video1.mp4",
  },
  {
    id: 2,
    title: "HÌNH ẢNH\nTHƯƠNG HIỆU",
    subtitle: "Kiến Tạo Hình Ảnh Đẳng Cấp",
    category: "CHỤP ẢNH DOANH NGHIỆP",
    gradient: "from-neutral-900/20 via-black/40 to-black/80",
    video: "/image/video2.mp4",
  },
  {
    id: 3,
    title: "KHOẢNH KHẮC\nẤN TƯỢNG",
    subtitle: "Lưu Giữ Cảm Xúc Chân Thực",
    category: "CHỤP ẢNH CHÂN DUNG",
    gradient: "from-stone-900/40 via-black/60 to-black",
    image: "/image/banner.png",
  },
  {
    id: 4,
    title: "QUAY PHIM\n& TVC",
    subtitle: "Kể Câu Chuyện Bằng Hình Ảnh",
    category: "SẢN XUẤT VIDEO",
    gradient: "from-gray-900/40 via-black/60 to-black",
    image: "/image/banner 2.jpg",
  },
];

// Slide transition variants with blur effect
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    filter: "blur(16px)",
    scale: 1.05,
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    filter: "blur(16px)",
    scale: 0.95,
  }),
};

export default function HeroSlider() {
  const [[currentSlide, direction], setSlide] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);

  // Navigate to a specific slide
  const paginate = useCallback(
    (newDirection: number) => {
      setSlide(([prev]: [number, number]) => {
        const next =
          (prev + newDirection + slides.length) % slides.length;
        return [next, newDirection];
      });
    },
    []
  );

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => paginate(1), 5000);
    return () => clearInterval(interval);
  }, [isPaused, paginate]);

  // Handle drag end to determine swipe direction
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      paginate(-1);
    } else if (info.offset.x < -threshold) {
      paginate(1);
    }
  };

  // Parallax effect on drag
  const textX = useTransform(dragX, [-200, 0, 200], [30, 0, -30]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen max-sm:h-auto max-sm:pb-16 w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      data-cursor-hover
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 200, damping: 30 },
            opacity: { duration: 0.5 },
            filter: { duration: 0.6 },
            scale: { duration: 0.6 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ x: dragX }}
          className="absolute inset-0 max-sm:relative max-sm:inset-auto max-sm:flex max-sm:flex-col"
        >
          {/* Background Media */}
          <div className="absolute inset-0 z-0 sm:absolute sm:inset-0 max-sm:relative max-sm:inset-auto max-sm:w-[calc(100%-32px)] max-sm:aspect-video max-sm:flex-shrink-0 max-sm:mt-[90px] max-sm:rounded-xl max-sm:overflow-hidden max-sm:mx-4">
            {slides[currentSlide].video ? (
              <video
                key={slides[currentSlide].video}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover contrast-110 brightness-[0.85] bg-black"
              >
                <source src={slides[currentSlide].video} type="video/mp4" />
              </video>
            ) : slides[currentSlide].image ? (
              <Image
                src={slides[currentSlide].image!}
                alt={slides[currentSlide].title}
                fill
                className="absolute inset-0 object-cover contrast-110 brightness-75 bg-black"
                priority
              />
            ) : null}

            {/* Gradient Overlay for Text Readability */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} z-10`}
            />

            {/* Abstract pattern overlay */}
            <div className="absolute inset-0 opacity-20 z-20">
              <div
                className="absolute top-1/4 -right-20 w-[600px] h-[600px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
                }}
              />
              <div
                className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
                }}
              />
            </div>
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] z-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          {/* Bottom Gradient for Text Readability - Hide on mobile */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent z-10 pointer-events-none max-sm:hidden" />

          {/* Slide Content */}
          <motion.div
            style={{ x: textX }}
            className="absolute bottom-0 left-0 w-full z-20 flex flex-col justify-start md:justify-end pt-8 md:pt-0 pb-16 md:pb-32 px-6 md:px-16 lg:px-24 max-sm:relative max-sm:inset-auto max-sm:flex-1"
          >
            {/* Category tag */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-body text-xs md:text-sm tracking-[0.3em] text-white/80 mb-4 md:mb-6"
            >
              {slides[currentSlide].category}
            </motion.span>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-heading text-5xl md:text-7xl lg:text-[8rem] font-bold leading-[0.9] tracking-tight whitespace-pre-line mb-4 md:mb-6"
            >
              {slides[currentSlide].title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="font-body text-lg md:text-xl text-ash max-w-md"
            >
              {slides[currentSlide].subtitle}
            </motion.p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 max-sm:relative max-sm:bottom-auto max-sm:left-auto max-sm:transform-none max-sm:mt-8 max-sm:mx-auto max-sm:w-max">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setSlide([idx, idx > currentSlide ? 1 : -1])}
            className="group relative p-1"
            data-cursor-hover
          >
            <div
              className={`h-1 rounded-full transition-all duration-500 ${idx === currentSlide
                ? "w-8 bg-white"
                : "w-4 bg-smoke group-hover:bg-ash"
                }`}
            />
          </button>
        ))}
      </div>

      {/* Slide Counter - move it to avoid overlapping text on mobile */}
      <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-12 z-20 max-sm:top-[200px] text-white/50">
        <div className="flex flex-col items-center gap-2">
          <span className="font-heading text-lg md:text-2xl font-bold text-white">
            {String(currentSlide + 1).padStart(2, "0")}
          </span>
          <div className="w-px h-8 bg-smoke max-sm:h-4" />
          <span className="font-heading text-xs md:text-sm text-ash">
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Scroll Indicator - hide on mobile to save space */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 right-6 md:right-12 z-20 max-sm:hidden"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-[10px] tracking-[0.2em] text-ash uppercase rotate-90 origin-center mb-8 whitespace-nowrap">
            Cuộn xuống
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-6 bg-gradient-to-b from-white to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
