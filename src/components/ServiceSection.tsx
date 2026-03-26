"use client";

import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";

interface Service {
  id: string;
  title: string;
  description: string;
  tags: string[];
  images: string[];
}

const services: Service[] = [
  {
    id: "01",
    title: "Brand Strategy & Identity",
    description: "Chúng tôi xây dựng nền tảng thương hiệu bền vững, từ chiến lược định vị đến hệ thống nhận diện thị giác toàn diện, giúp doanh nghiệp tạo dấu ấn khác biệt và nhất quán.",
    tags: ["Brand Audit", "Visual Identity", "Brand Guidelines"],
    images: ["/image/demo5.png", "/image/demo1.png", "/image/demo2.png"],
  },
  {
    id: "02",
    title: "Digital Product Design",
    description: "Thiết kế trải nghiệm người dùng (UX) và giao diện (UI) hiện đại cho ứng dụng và website. Chúng tôi tập trung vào sự cân bằng giữa tính thẩm mỹ và hiệu quả chuyển đổi.",
    tags: ["UX Research", "UI Design", "App Design"],
    images: ["/image/demo7.png", "/image/demo  4 .png", "/image/demo 3.png"],
  },
  {
    id: "03",
    title: "High-end Development",
    description: "Phát triển website chuyên nghiệp với hiệu năng tối ưu và hiệu ứng chuyển động mượt mà. Chúng tôi hiện thực hóa các ý tưởng thiết kế phức tạp nhất.",
    tags: ["Next.js", "Framer", "Performance"],
    images: ["/image/demo6.png", "/image/demo5.png", "/image/demo7.png"],
  },
  {
    id: "04",
    title: "Creative Art Direction",
    description: "Định hướng sáng tạo và nghệ thuật cho các chiến dịch truyền thông. Đảm bảo mọi hình ảnh và thông điệp đều truyền tải được giá trị cốt lõi của thương hiệu.",
    tags: ["Campaign Design", "Motion Graphics", "Content Creation"],
    images: ["/image/demo1.png", "/image/demo2.png", "/image/demo 3.png"],
  },
];

export default function ServiceSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section className="bg-obsidian py-24 md:py-32 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="mb-16 md:mb-24">
          <span className="font-body text-xs tracking-[0.3em] text-white/40 uppercase mb-4 block">
            Chuyên Môn
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white">
            Dịch Vụ<span className="text-white/20">.</span>
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          {services.map((service, index) => (
            <ServiceItem
              key={service.id}
              service={service}
              isExpanded={expandedIndex === index}
              onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceItem({
  service,
  isExpanded,
  onToggle,
}: {
  service: Service;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-white/5 p-[2px] cursor-pointer"
      onClick={onToggle}
      onMouseMove={handleMouseMove}
      data-cursor-hover
    >
      {/* Spotlight Border Glow — identical to ProjectsShowcase */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.4),
              transparent 40%
            )
          `,
        }}
      />

      {/* Inner Container — bg-obsidian masks glow center, only border glows */}
      <div className={`relative w-full rounded-[14px] overflow-hidden z-10 transition-colors duration-500 ${isExpanded ? 'bg-charcoal' : 'bg-obsidian'}`}>
        <div className="py-8 md:py-12 px-6 md:px-10">
          {/* Header - Always visible */}
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-4 md:gap-12 min-w-0">
              <div className="flex items-center justify-center w-10 h-10 md:w-16 md:h-16 border border-white/10 bg-white/5 font-heading text-lg md:text-2xl font-bold text-white tracking-tighter shrink-0">
                {service.id}
              </div>
              <h3 className="font-heading text-xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight transition-transform duration-500 group-hover:translate-x-2 truncate">
                {service.title}
              </h3>
            </div>

            {/* Plus/Minus Icon */}
            <div className="relative flex items-center justify-center w-8 h-8 md:w-14 md:h-14 border border-white/20 bg-white/5 overflow-hidden transition-all duration-500 group-hover:border-white/40 shrink-0">
              <motion.div
                animate={{ rotate: isExpanded ? 45 : 0 }}
                className="relative w-full h-full flex items-center justify-center text-white"
              >
                <div className="absolute w-3 md:w-6 h-[2px] bg-current rounded-full" />
                <motion.div 
                   animate={{ opacity: isExpanded ? 0 : 1 }}
                   className="absolute w-[2px] h-3 md:h-6 bg-current rounded-full" 
                />
              </motion.div>
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-12 pb-4 flex flex-col md:flex-row gap-12 md:items-end">
                  <div className="flex-1 md:max-w-2xl">
                    <p className="font-body text-ash text-base md:text-xl leading-relaxed mb-10 max-w-xl">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {service.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-4 md:px-6 py-2 md:py-2.5 rounded-full border border-white/15 font-heading text-[10px] md:text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:bg-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Image Slider */}
                  <div 
                    className="relative flex-shrink-0 w-full md:w-[40%] aspect-video rounded-2xl overflow-hidden glass-border group/slider"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ServiceSlider images={service.images} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/**
 * ServiceSlider — Small carousel for service examples
 */
function ServiceSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-full">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            const swipeThreshold = 50;
            if (info.offset.x > swipeThreshold) prev();
            else if (info.offset.x < -swipeThreshold) next();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
        >
          <Image 
            src={images[index]}
            alt="Service Detail"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
        <button 
          onClick={prev}
          className="w-8 h-8 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button 
          onClick={next}
          className="w-8 h-8 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-4 left-4 flex gap-1.5 z-20">
        {images.map((_, i) => (
          <div 
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
}
