"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Image from "next/image";
import Footer from "@/components/Footer";
import AnimatedCounter from "@/components/AnimatedCounter";

// Placeholder images for the gallery
const topGridImages = [
  "/image/team/Team4.jpg",
  "/image/team/Team3.jpg",
  "/image/team/Team5.jpg",
  "/image/team/Team7.jpg",
  "/image/team/Team6.jpg",
  "/image/team/Team8.jpg",
];

const middleImages = [
  "/image/team/Team2.jpg",
  "/image/team/Team13.jpg",
  "/image/team/Team0.jpg",
  "/image/team/Team.jpg",
];

const bottomImage = "/image/team/Team26.jpg";

function GalleryImage({
  src,
  alt,
  className = "",
  aspect,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false
}: {
  src: string;
  alt: string;
  className?: string;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Fallback aspect ratio logic
  const isPortrait = src.includes("Team3.") || src.includes("Team4.") || src.includes("Team5.") ||
    src.includes("Team6.") || src.includes("Team7.") || src.includes("Team8.") ||
    src.includes("Team0.") || src.includes("Team.");

  const defaultAspect = isPortrait ? 'aspect-[2/3]' : 'aspect-[3/2]';
  const finalAspect = aspect || defaultAspect;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={`group relative z-10 w-full overflow-hidden rounded-2xl md:rounded-3xl bg-white/10 p-[2px] break-inside-avoid ${className}`}
      data-cursor-hover
    >
      {/* Spotlight Border Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl md:rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
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

      <div className={`relative h-full w-full rounded-2xl md:rounded-[22px] bg-obsidian overflow-hidden z-10 ${finalAspect}`}>
        <Image
          src={src}
          alt={alt}
          fill
          quality={100}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes={sizes}
        />
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
            Nơi ý tưởng được <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">thấu cảm</span> và sáng tạo không có giới hạn.
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
              <AnimatedCounter value={3} suffix="+" />
            </div>
            <span className="font-body text-xs md:text-sm uppercase tracking-widest text-ash">Năm kinh nghiệm</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center text-center border-y border-white/10 py-12 md:border-y-0 md:border-x md:py-0"
          >
            <div className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold mb-4">
              <AnimatedCounter value={80} suffix="+" />
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
              <AnimatedCounter value={50} suffix="+" />
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
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-8 text-center text-white">Đội Ngũ & Không Gian</h2>
          <p className="font-body text-white/60 text-lg md:text-xl max-w-4xl mx-auto mb-20 text-center leading-relaxed">
            Với đội ngũ trẻ, giàu ý tưởng và không ngừng đổi mới, HUGs luôn tìm kiếm những cách thể hiện khác biệt từ concept, góc quay đến cách kể chuyện. Mỗi khung hình đều được chăm chút để không chỉ ghi lại khoảnh khắc, mà còn kể một câu chuyện mang dấu ấn riêng của thương hiệu.
          </p>

          {/* Top Fixed Grid 3x2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {topGridImages.map((src, index) => (
              <GalleryImage key={`top-${index}`} src={src} alt={`HUGs Team ${index + 4}`} />
            ))}
          </div>

          {/* Middle Custom Grid (4 images total) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
            {/* Left: 2 landscapes stacked vertically */}
            <div className="md:col-span-4 flex flex-col justify-between gap-8 md:gap-0 h-full">
              <GalleryImage src={middleImages[0]} alt="Process 1" />
              <GalleryImage src={middleImages[1]} alt="Process 2" />
            </div>

            {/* Center: Portrait 1 */}
            <div className="md:col-span-4">
              <GalleryImage src={middleImages[2]} alt="Team Portrait 1" />
            </div>

            {/* Right: Portrait 2 */}
            <div className="md:col-span-4">
              <GalleryImage src={middleImages[3]} alt="Team Portrait 2" />
            </div>
          </div>

          <div className="w-full mt-8">
            <GalleryImage
              src={bottomImage}
              alt="HUGs Studio Team Banner"
              aspect="aspect-[21/9]"
              sizes="100vw"
              priority={true}
            />
          </div>
        </motion.div>

      </div>

      <div className="mt-10 md:mt-0">
        <Footer />
      </div>
    </main>
  );
}
