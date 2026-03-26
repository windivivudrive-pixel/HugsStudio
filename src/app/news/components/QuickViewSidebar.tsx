"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Article } from "@/data/news";

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

      <div className="relative border-l border-white/10 ml-2 pl-6 py-2 space-y-8">
        {articles.map((article, index) => (
          <motion.div 
            key={article.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[29px] top-3 w-2 h-2 rounded-full bg-white/60 group-hover:bg-white ring-4 ring-obsidian group-hover:scale-125 transition-all duration-300" />
            
            <Link href={`/news/${article.slug}`} className="flex gap-4 items-start">
              {/* Text */}
              <div className="flex-1 mt-1">
                <h3 className="text-sm font-heading font-bold text-white/80 leading-snug group-hover:text-white transition-colors duration-300 line-clamp-3">
                  {article.title}
                </h3>
              </div>
              
              {/* Thumbnail */}
              <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-white/5">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
