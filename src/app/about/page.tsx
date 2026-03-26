"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Image from "next/image";
import Footer from "@/components/Footer";
import AnimatedCounter from "@/components/AnimatedCounter";

// Placeholder images for the gallery
const galleryImages = [
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000",
];

// Reusing spotlight glow logic for consistency
function GalleryImage({ src, alt, span }: { src: string; alt: string; span: string }) {
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
      className={`group relative z-10 w-full overflow-hidden rounded-2xl md:rounded-3xl bg-white/10 p-[2px] ${span}`}
      data-cursor-hover
    >
      <motion.div
        className="hidden md:block pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
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
      <div className="relative h-full w-full rounded-2xl md:rounded-[22px] bg-obsidian overflow-hidden z-10 min-h-[300px] md:min-h-[400px]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover contrast-125 brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-obsidian text-white pt-40 pb-20 selection:bg-white/20 relative z-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto text-center mb-20 md:mb-32"
        >
          <span className="font-body text-xs tracking-[0.3em] text-white/60 uppercase mb-6 block">
            Về CHÚNG TÔI
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8 text-white">
            Kiến tạo giá trị từ <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">sự thấu cảm</span> và sáng tạo không giới hạn.
          </h1>
          <p className="font-body text-base md:text-xl text-ash leading-relaxed max-w-3xl mx-auto">
            Tại HUGs STUDIO, chúng tôi tin rằng mỗi thương hiệu đều mang một câu chuyện độc bản. Sứ mệnh của chúng tôi là lắng nghe Insight, thấu hiểu và chuyển hóa những câu chuyện đó thành các trải nghiệm thị giác và kỹ thuật số đẳng cấp, mang lại tác động thực sự đến người dùng.
          </p>
        </motion.div>

        {/* Statistics Section (Numbers increment over time) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-12 mb-24 md:mb-32 md:border-y border-white/10 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center text-center"
          >
            <div className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold mb-4">
              <AnimatedCounter value={30} suffix="+" />
            </div>
            <span className="font-body text-xs md:text-sm uppercase tracking-widest text-ash">Quy mô nhân sự</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center text-center border-y border-white/10 py-12 md:border-y-0 md:border-x md:py-0"
          >
            <div className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold mb-4">
              <AnimatedCounter value={150} suffix="+" />
            </div>
            <span className="font-body text-xs md:text-sm uppercase tracking-widest text-ash">Dự án hoàn thành</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <div className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold mb-4">
              <AnimatedCounter value={80} suffix="+" />
            </div>
            <span className="font-body text-xs md:text-sm uppercase tracking-widest text-ash">Khách hàng tin tưởng</span>
          </motion.div>
        </div>

        {/* Gallery Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-20 md:mb-32"
        >
          <h2 className="font-heading text-2xl md:text-4xl font-bold mb-10 md:mb-12 text-center">Đội Ngũ & Không Gian</h2>

          {/* Asymmetric Masonry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
            <GalleryImage src={galleryImages[0]} alt="Studio Working" span="md:col-span-8 aspect-[4/3] md:aspect-[16/10]" />
            <GalleryImage src={galleryImages[1]} alt="Brainstorming Session" span="md:col-span-4 aspect-square" />
            <GalleryImage src={galleryImages[2]} alt="Creative Team" span="md:col-span-5 aspect-[4/3]" />
            <GalleryImage src={galleryImages[3]} alt="Offsite Retreat" span="md:col-span-7 aspect-[4/3] md:aspect-[16/9]" />
          </div>
        </motion.div>

      </div>

      <div className="mt-10 md:mt-0">
        <Footer />
      </div>
    </main>
  );
}
