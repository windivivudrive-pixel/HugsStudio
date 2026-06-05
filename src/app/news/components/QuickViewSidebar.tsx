"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Article } from "@/data/news";
import { formatDisplayDate } from "@/lib/date";

interface QuickViewSidebarProps {
  articles: Article[];
}

export default function QuickViewSidebar({ articles }: QuickViewSidebarProps) {
  return (
    <div className="sticky top-32">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-heading font-bold text-white">Xem nhanh</h2>
        <Link href="#" className="text-sm font-body text-white/60 hover:text-white transition-colors">
          Xem tất cả
        </Link>
      </div>

      <div className="relative border-l border-white/10 ml-2 pl-6 py-2 space-y-6">
        {articles.map((article, index) => (
          <SidebarItem key={article.id} article={article} index={index} />
        ))}
      </div>
    </div>
  );
}

function SidebarItem({ article, index }: { article: Article; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseMove={handleMouseMove}
      className="group relative p-2 -m-2 rounded-lg transition-colors hover:bg-white/5"
    >
      {/* Spotlight Border Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              150px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.2),
              transparent 40%
            )
          `,
        }}
      />

      {/* Timeline Dot */}
      <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white ring-4 ring-obsidian group-hover:scale-125 transition-all duration-300 z-10" />

      <Link href={`/news/${article.slug}`} className="flex gap-4 items-center relative z-10">
        {/* Text */}
        <div className="flex-1">
          <h3 className="text-xs font-heading font-bold text-white/70 leading-snug group-hover:text-white transition-colors duration-300 line-clamp-2">
            {article.title}
          </h3>
          <span className="text-[10px] font-body text-white/30 mt-1 block uppercase tracking-tighter">
            {formatDisplayDate(article.date)}
          </span>
        </div>

        {/* Thumbnail */}
        <div className="relative w-20 aspect-[3/2] rounded-md overflow-hidden shrink-0 bg-white/5 border border-white/5">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </div>
      </Link>
    </motion.div>
  );
}
