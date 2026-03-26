"use client";

import Image from "next/image";
import Link from "next/link";
import { Article } from "@/data/news";

interface HorizontalNewsCardProps {
  article: Article;
}

export default function HorizontalNewsCard({ article }: HorizontalNewsCardProps) {
  return (
    <Link href={`/news/${article.slug}`} className="block w-full">
      <div
        className="group relative flex flex-row gap-4 md:gap-6 p-2 md:p-4 rounded-3xl bg-transparent transition-all duration-300 hover:bg-white/5 hover:scale-[1.02]"
        data-cursor-hover
      >
        {/* Thumbnail Image */}
        <div className="relative w-[130px] sm:w-[160px] md:w-72 aspect-[4/3] md:aspect-video rounded-xl overflow-hidden shrink-0 z-10 bg-white/5">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-start md:justify-center flex-1 z-10 py-1">
          <span className="hidden md:block text-sm font-heading tracking-wider uppercase text-white/80 mb-2">
            {article.category}
          </span>
          
          <h3 className="text-base sm:text-lg md:text-2xl font-heading font-bold text-white/90 md:text-white leading-snug mb-2 md:mb-3 group-hover:text-white transition-colors duration-300 line-clamp-3 md:line-clamp-2">
            {article.title}
          </h3>
          
          <p className="hidden md:block text-base text-ash font-body line-clamp-2 mb-4 leading-relaxed">
            {article.content?.replace(/<[^>]*>?/gm, '')?.replace(/&nbsp;/g, ' ')?.substring(0, 150)}...
          </p>

          <div className="mt-auto hidden md:block">
            <span className="text-sm font-body text-white/60">
              {article.date}
            </span>
          </div>

          {/* Mobile Bottom Row */}
          <div className="flex items-center gap-2 mt-auto md:hidden pt-1">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-white/40 to-white/90 shrink-0" />
            <span className="text-[11px] font-body text-white/80 line-clamp-1">
              Admin
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
