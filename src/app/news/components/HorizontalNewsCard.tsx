"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Article } from "@/data/news";
import { formatDisplayDate } from "@/lib/date";

interface HorizontalNewsCardProps {
  article: Article;
}

export default function HorizontalNewsCard({ article }: HorizontalNewsCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <Link href={`/news/${article.slug}`} className="block w-full">
      <motion.div
        onMouseMove={handleMouseMove}
        className="group relative flex flex-row gap-4 md:gap-6 p-2 md:p-3 rounded-lg bg-transparent transition-all duration-300 hover:bg-white/5 hover:scale-[1.01]"
        data-cursor-hover
      >
        {/* Spotlight Border Glow */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition duration-300 group-hover:opacity-100 z-0"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                250px circle at ${mouseX}px ${mouseY}px,
                rgba(255,255,255,0.25),
                transparent 40%
              )
            `,
          }}
        />

        {/* Thumbnail Image Container */}
        <div className="relative w-[110px] sm:w-[150px] md:w-64 aspect-[3/2] rounded-md overflow-hidden shrink-0 z-10 bg-white/5 border border-white/5">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-start md:justify-center flex-1 z-10 py-1">
          <span className="hidden md:block text-[11px] font-heading tracking-widest uppercase text-white/50 mb-2">
            {article.category}
          </span>
          
          <h3 className="text-sm sm:text-base md:text-xl font-heading font-bold text-white/90 md:text-white leading-snug mb-1 md:mb-2 group-hover:text-white transition-colors duration-300 line-clamp-2">
            {article.title}
          </h3>
          
          <p className="hidden lg:block text-sm text-ash font-body line-clamp-2 mb-3 leading-relaxed opacity-80">
            {article.content?.replace(/<[^>]*>?/gm, '')?.replace(/&nbsp;/g, ' ')?.substring(0, 120)}...
          </p>

          <div className="mt-auto hidden md:block">
            <span className="text-[11px] font-body text-white/40">
              {formatDisplayDate(article.date)}
            </span>
          </div>

          {/* Mobile Bottom Row */}
          <div className="flex items-center gap-2 mt-auto md:hidden pt-1">
            <span className="text-[10px] font-body text-white/40 uppercase tracking-tight">
              {formatDisplayDate(article.date)}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
