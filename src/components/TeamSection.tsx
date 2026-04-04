"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/**
 * TeamSection — Introduces the team/agency with prominent text and a full-width image banner.
 * Features:
 * - Large, expressive typography
 * - Full-width or structurally contained banner image
 * - Monochromatic styling matching the design system
 */
export default function TeamSection() {
  return (
    <section id="team" className="relative py-24 md:py-32 px-6 md:px-16 lg:px-24">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-obsidian-light z-0" />

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mb-16 md:mb-24 mx-auto text-center relative z-10"
      >
        <span className="font-body text-xs tracking-[0.3em] text-white/60 uppercase mb-4 block">
          Đội Ngũ
        </span>
        <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight whitespace-break-spaces">
          <span className="text-gradient-mono">HUGs Studio</span><span className="text-white">.</span>
        </h2>
        <p className="font-body text-ash text-lg md:text-xl mt-8 max-w-2xl mx-auto">
          HUGs Studio là đơn vị sáng tạo nội dung hình ảnh và video, nơi mỗi dự án không chỉ dừng lại ở việc “đẹp” mà còn phải “chạm”. Chúng tôi tin rằng một sản phẩm tốt không chỉ truyền tải thông điệp, mà còn khơi gợi cảm xúc và tạo ra sự kết nối với người xem.
        </p>
      </motion.div>

      {/* Banner Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden group z-10"
        data-cursor-hover
      >
        <Image
          src="/image/team/Team15.jpg"
          alt="HUGs STUDIO Team"
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Subtle glass overlay on borders */}
        <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none" />
      </motion.div>
    </section>
  );
}
