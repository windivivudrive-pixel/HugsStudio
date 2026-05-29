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
    subtitle: "Studio Chụp Ảnh Sản Phẩm & Quay TVC Tại Đà Nẵng",
    category: "",
    gradient: "from-zinc-900/20 via-black/50 to-black/85",
    video: "/video/loading 1.mp4",
  },
  {
    id: 2,
    title: "KHẲNG ĐỊNH\nTHƯƠNG HIỆU",
    subtitle: "Mỗi dự án là một dấu ấn riêng",
    category: "",
    gradient: "from-stone-900/20 via-black/50 to-black/90",
    image: "/image/du-an-home/banner1.webp",
  },
  {
    id: 3,
    title: "QUAY PHIM\n& TVC",
    subtitle: "Sẵn sàng kể câu chuyện của bạn theo cách chưa từng có",
    category: "",
    gradient: "from-gray-900/20 via-black/50 to-black/90",
    image: "/image/du-an-home/banner 2.1.webp",
  },
];

// Slide transition variants optimized for smooth performance and cross-fading
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "10%" : "-10%",
    opacity: 0,
    scale: 1.02,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-10%" : "10%",
    opacity: 0,
    scale: 0.98,
  }),
};

export default function HeroSlider() {
  const [[currentSlide, direction], setSlide] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const [watchedSlides, setWatchedSlides] = useState<Record<number, boolean>>({});
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

  const handleVideoEnded = useCallback(() => {
    setWatchedSlides(prev => ({ ...prev, [currentSlide]: true }));
    paginate(1);
  }, [currentSlide, paginate]);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;

    const hasVideo = !!slides[currentSlide].video;
    const isVideoWatched = watchedSlides[currentSlide];
    const shouldWaitForVideo = hasVideo && !isVideoWatched;

    if (shouldWaitForVideo) {
      // Wait for the video to complete and trigger handleVideoEnded, no 5s timer
      return;
    }

    const interval = setInterval(() => paginate(1), 5000);
    return () => clearInterval(interval);
  }, [isPaused, paginate, currentSlide, watchedSlides]);

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
      className="relative w-full sm:aspect-video max-sm:h-auto max-sm:pt-[85px] max-sm:pb-16 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      data-cursor-hover
    >
      {/* Mobile Placeholder to maintain height since slides will be absolute */}
      <div className="sm:hidden w-full px-4 pointer-events-none invisible">
        <div className="w-full aspect-video" />
      </div>

      {/* Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 max-sm:top-[85px] max-sm:bottom-16 max-sm:left-4 max-sm:right-4 max-sm:rounded-2xl max-sm:overflow-hidden max-sm:border max-sm:border-white/5 pointer-events-none"
        >
          {/* Background Media */}
          <div className="absolute inset-0 z-0">
            {slides[currentSlide].video ? (
              <video
                key={slides[currentSlide].video}
                ref={(el) => {
                  if (el) {
                    el.defaultMuted = true;
                    el.muted = true;
                    const playPromise = el.play();
                    if (playPromise !== undefined) {
                      playPromise.catch(e => console.log("Autoplay prevented:", e));
                    }
                  }
                }}
                autoPlay
                muted
                loop={!!watchedSlides[currentSlide]}
                onEnded={handleVideoEnded}
                playsInline
                preload="auto"
                disablePictureInPicture
                className="absolute inset-0 w-full h-full object-cover contrast-110 brightness-[0.85] bg-black"
              >
                <source
                  src={slides[currentSlide].video}
                  type={slides[currentSlide].video.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'}
                />
              </video>
            ) : slides[currentSlide].image ? (
              <Image
                src={slides[currentSlide].image!}
                alt={slides[currentSlide].title}
                fill
                className="absolute inset-0 object-cover contrast-110 brightness-78 bg-black"
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

          {/* Bottom Gradient for Text Readability */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent z-10 pointer-events-none" />

          {/* Slide Content */}
          <motion.div
            style={{ x: textX }}
          className="absolute bottom-0 left-0 w-full z-20 flex flex-col justify-end pb-4 sm:pb-28 px-4 sm:px-16"
          >
            {/* Category tag */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-body text-[9px] sm:text-sm tracking-[0.3em] text-white/80 mb-2 md:mb-6"
            >
              {slides[currentSlide].category}
            </motion.span>

            {(() => {
              const isTwoLines = slides[currentSlide].title.includes('\n');
              return (
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  className={`font-heading text-lg sm:text-4xl md:text-6xl ${isTwoLines ? 'lg:text-[5rem]' : 'lg:text-[7.2rem]'} font-bold leading-[1.1] md:leading-[0.95] tracking-tight whitespace-pre-line mb-1.5 md:mb-6`}
                >
                  {slides[currentSlide].title}
                </motion.h1>
              );
            })()}

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="font-body text-[11px] sm:text-lg md:text-xl text-ash max-w-xl md:max-w-2xl"
            >
              {slides[currentSlide].subtitle}
            </motion.p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Invisible Drag Overlay */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x: dragX }}
        className="absolute inset-0 z-10 touch-pan-y"
      />

      {/* Navigation Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
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
                : "w-4 bg-white/20 group-hover:bg-white/50"
                }`}
            />
          </button>
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-12 z-20 max-sm:top-[195px] text-white/50">
        <div className="flex flex-col items-center gap-2">
          <span className="font-heading text-lg md:text-2xl font-bold text-white">
            {String(currentSlide + 1).padStart(2, "0")}
          </span>
          <div className="w-px h-8 bg-white/20 max-sm:h-4" />
          <span className="font-heading text-xs md:text-sm text-white/40">
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
