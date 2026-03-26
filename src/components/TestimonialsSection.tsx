"use client";

import { motion, useMotionValue, useMotionTemplate, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "Đặng Hoàng Nam",
    role: "Giám đốc ABC Studios",
    content: "Quy trình làm việc rất bài bản và hiệu quả. Các ý tưởng được chuyển hóa thành giao diện tinh tế một cách nhanh chóng, cùng với những đóng góp giúp cải thiện dự án so với kế hoạch ban đầu.",
    avatar: "https://i.pravatar.cc/150?u=1",
    stars: 5,
  },
  {
    id: 2,
    name: "Lê Minh Phương",
    role: "Quản lý Sản phẩm",
    content: "Thời gian hoàn thành nhanh chóng nhưng vẫn đảm bảo chất lượng tuyệt vời. Sản phẩm cuối cùng rất dễ bàn giao và vận hành mượt mà cùng đội ngũ phát triển của chúng tôi.",
    avatar: "https://i.pravatar.cc/150?u=2",
    stars: 5,
  },
  {
    id: 3,
    name: "Nguyễn Thu Hà",
    role: "Nhà thiết kế",
    content: "Sự tỉ mỉ và trau chuốt trong từng chi tiết thực sự ấn tượng. Mỗi màn hình đều mang lại cảm giác có chủ đích, nhất quán và được thiết kế chu đáo trên mọi thiết bị.",
    avatar: "https://i.pravatar.cc/150?u=3",
    stars: 5,
  },
  {
    id: 4,
    name: "Trần Anh Quân",
    role: "Founder & CEO, Techflow",
    content: "HUGs STUDIO không chỉ là đơn vị thiết kế, họ là những đối tác chiến lược. Tầm nhìn sáng tạo của họ đã giúp brand của chúng tôi vươn tầm quốc tế chỉ sau một năm.",
    avatar: "https://i.pravatar.cc/150?u=4",
    stars: 5,
  },
  {
    id: 5,
    name: "Phạm Thảo Vy",
    role: "Giám đốc Marketing",
    content: "Khả năng nắm bắt insight và chuyển hóa thành ngôn ngữ hình ảnh cực kỳ tốt. Chúng tôi hoàn toàn hài lòng với kết quả cuối cùng và chắc chắn sẽ còn hợp tác lâu dài.",
    avatar: "https://i.pravatar.cc/150?u=5",
    stars: 5,
  }
];

function TestimonialCard({ t, i }: { t: typeof testimonials[0]; i: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        opacity: { duration: 0.6, delay: i * 0.1 },
        y: { duration: 0.6, delay: i * 0.1 },
        scale: { type: "spring", stiffness: 300, damping: 20 },
        default: { duration: 0.3 }
      }}
      className="relative rounded-[24px] bg-[#141414] p-8 md:p-10 min-h-[380px] h-full flex flex-col justify-between border border-white/10 overflow-hidden group transition-colors duration-300 hover:border-white/20 select-none"
      data-cursor-hover
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.06),
              transparent 80%
            )
          `,
        }}
      />

      {/* Quote Icon */}
      <div className="absolute top-6 right-6 z-20">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="url(#icon-grad)" className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all duration-300">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      {/* Card Content */}
      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
            <img src={t.avatar} alt={t.name} className="w-full h-full object-cover block" />
          </div>
          <div>
            <h4 className="font-heading font-medium text-white text-[16px]">{t.name}</h4>
            <p className="font-body text-ash text-sm">{t.role}</p>
          </div>
        </div>
        
        <p className="font-body text-[17px] leading-relaxed text-white/90 mb-10 flex-1">
          {t.content}
        </p>

        {/* Stars */}
        <div className="flex gap-1 mt-auto pb-2">
          {[...Array(t.stars)].map((_, idx) => (
            <svg key={idx} width="16" height="16" viewBox="0 0 24 24" fill="url(#icon-grad)" className="opacity-90 group-hover:opacity-100 group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] transition-all duration-300">
              <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.446l-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
            </svg>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const [visibleItems, setVisibleItems] = useState(3);
  const GAP = 32; // px, matches gap-8

  // Responsive items count
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768) setVisibleItems(1);
      else if (window.innerWidth < 1024) setVisibleItems(2);
      else setVisibleItems(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Clone array for seamless loop: [...last N, ...original, ...first N]
  const cloned = [
    ...testimonials.slice(-visibleItems),
    ...testimonials,
    ...testimonials.slice(0, visibleItems),
  ];

  // Start at the real first item (after the prepended clones)
  const [rawIndex, setRawIndex] = useState(visibleItems);
  const [animate, setAnimate] = useState(true);
  const dragging = useRef(false);

  // Calculate pixel offset for a given index
  const getX = (idx: number, containerWidth: number) => {
    const itemWidth = (containerWidth - GAP * (visibleItems - 1)) / visibleItems;
    return -(idx * (itemWidth + GAP));
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // After animation settles at a clone, silently jump to the real item
  const handleAnimationComplete = () => {
    const total = testimonials.length;
    if (rawIndex < visibleItems) {
      // jumped to prepended clone → jump to real end
      setAnimate(false);
      setRawIndex(rawIndex + total);
    } else if (rawIndex >= visibleItems + total) {
      // jumped to appended clone → jump to real start
      setAnimate(false);
      setRawIndex(rawIndex - total);
    }
  };

  // Re-enable animation after silent jump
  useEffect(() => {
    if (!animate) {
      // Allow one frame for the jump to render, then re-enable
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [animate]);

  const next = () => setRawIndex((p) => p + 1);
  const prev = () => setRawIndex((p) => p - 1);

  // Dot corresponds to original index (not cloned)
  const realIndex = ((rawIndex - visibleItems) % testimonials.length + testimonials.length) % testimonials.length;

  // Drag handling
  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipe = info.offset.x;
    if (Math.abs(swipe) > 50) {
      swipe < 0 ? next() : prev();
    }
  };

  const itemWidth = containerWidth > 0
    ? (containerWidth - GAP * (visibleItems - 1)) / visibleItems
    : 0;

  return (
    <section className="relative py-24 md:py-32 bg-obsidian overflow-hidden" id="testimonials">
      {/* SVG Gradient definitions */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="icon-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#efefef" />
            <stop offset="100%" stopColor="#888888" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative z-10 text-left"
          >
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Tín nhiệm bởi <br /> khách hàng
            </h2>
            <p className="font-body text-base md:text-lg text-ash max-w-sm leading-relaxed">
              Phản hồi thực tế từ các founder, nhóm làm việc và đối tác từ khắp nơi.
            </p>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 relative z-10">
            <button 
              onClick={prev}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors group"
              data-cursor-hover
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-white/60 group-hover:stroke-white transition-colors">
                <path d="M15 18L9 12L15 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              onClick={next}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors group"
              data-cursor-hover
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-white/60 group-hover:stroke-white transition-colors">
                <path d="M9 18L15 12L9 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div ref={containerRef} className="relative z-10 overflow-hidden cursor-grab active:cursor-grabbing py-20 -my-20">
          <motion.div
            className="flex"
            style={{ gap: GAP }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={handleDragEnd}
            animate={containerWidth > 0 ? { x: getX(rawIndex, containerWidth) } : false}
            transition={animate ? { type: "spring", stiffness: 300, damping: 30 } : { duration: 0 }}
            onAnimationComplete={handleAnimationComplete}
          >
            {cloned.map((t, ci) => (
              <div 
                key={`${t.id}-${ci}`}
                className="shrink-0"
                style={{ width: itemWidth > 0 ? itemWidth : `calc((100% - ${(visibleItems - 1) * GAP}px) / ${visibleItems})` }}
              >
                <TestimonialCard t={t} i={ci} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-12 relative z-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setRawIndex(i + visibleItems)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === realIndex ? "w-8 bg-white" : "w-4 bg-white/10 hover:bg-white/20"
              }`}
              data-cursor-hover
            />
          ))}
        </div>

      </div>
    </section>
  );
}
