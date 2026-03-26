"use client";

import { 
  motion, 
  useMotionTemplate, 
  useMotionValue, 
  useAnimationFrame, 
  wrap 
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";

/**
 * NewsJournal — Horizontal auto-looping slider for articles.
 * Features:
 * - Infinite horizontal marquee loop
 * - Premium cards with spotlight border effect
 * - Layout matching the user provided reference
 * - 5 articles total, 3 visible on desktop
 */

import { Article } from "@/data/news";
import { databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import { Query } from "appwrite";

function ArticleCard({ article }: { article: Article }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div className="flex-shrink-0 w-[78vw] md:w-[45vw] lg:w-[31vw] px-3 md:px-4">
      <Link href={`/news/${article.slug}`} className="block">
        <motion.div
          onMouseMove={handleMouseMove}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="group relative z-10 flex flex-col"
          data-cursor-hover
        >
          {/* Card Border wrapper (similar to ProjectsShowcase) */}
          <div className="relative overflow-hidden rounded-3xl bg-white/10 p-[2px] aspect-[4/3]">
            {/* Spotlight Border Glow */}
            <motion.div
              className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
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

            {/* Inner Image Container */}
            <div className="relative h-full w-full rounded-[22px] bg-obsidian overflow-hidden z-10">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Dark overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-500" />

              {/* Category Badge - Notched corner style */}
              <div className="card-notch">
                <div className="bg-white px-3 md:px-5 py-1.5 md:py-2.5 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <span className="font-heading text-[9px] md:text-xs font-bold text-black uppercase tracking-wider whitespace-nowrap">
                    {article.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Article Metadata */}
          <div className="mt-4 md:mt-6 flex flex-col items-start gap-1 md:gap-2">
            <span className="font-body text-xs md:text-sm text-ash">
              {article.date}
            </span>
            <h3 className="font-heading text-base md:text-xl lg:text-2xl font-semibold leading-snug group-hover:text-white transition-colors duration-300">
              {article.title}
            </h3>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}

export default function NewsJournal() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for infinite scroll
  const x = useMotionValue(0);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    async function fetchLatestNews() {
      try {
        const response = await databases.listDocuments(
          APPWRITE_CONFIG.DATABASE_ID,
          APPWRITE_CONFIG.COLLECTIONS.NEWS,
          [
            Query.orderDesc("$createdAt"),
            Query.limit(5)
          ]
        );

        if (response.documents.length > 0) {
          const fetchedArticles: Article[] = response.documents.map((doc: any) => ({
            id: doc.$id,
            slug: doc.slug,
            title: doc.title,
            date: doc.date,
            category: doc.category,
            image: doc.image,
            content: doc.content,
          }));
          setArticles(fetchedArticles);
        }
      } catch (error) {
        console.error("Error fetching homepage news:", error);
      }
    }

    fetchLatestNews();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Measure content width for wrapping
  useEffect(() => {
    if (containerRef.current) {
      // Since we use 2 sets, one set is half the scrollWidth
      setContentWidth(containerRef.current.scrollWidth / 2);
    }
  }, [articles]);

  // Infinite Scroll Engine
  useAnimationFrame((_: number, delta: number) => {
    if (isPaused || !contentWidth) return;

    // Move left by default. 1.5px per frame roughly matches the old speed.
    let moveBy = -1.5 * (delta / 16); // Normalize to 60fps
    x.set(x.get() + moveBy);

    // Wrap value to keep it between 0 and -contentWidth
    if (x.get() <= -contentWidth) {
      x.set(x.get() + contentWidth);
    }
  });

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsPaused(false);
  };

  // Double set for seamless loop
  const loopArticles = [...articles, ...articles];

  return (
    <section id="journal" className="relative py-16 md:py-32 overflow-hidden">
      {/* Section Header */}
      <div className="container mx-auto px-6 mb-16 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-heading text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-4"
        >
          Tin Tức Mới Nhất
        </motion.h2>
      </div>

      {/* Auto-scroll Marquee Slider (No swipe to avoid conflict) */}
      <div
        className="relative w-full overflow-hidden py-10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          ref={containerRef}
          className="flex w-max"
          style={{ x }}
        >
          {loopArticles.map((article, index) => (
            <ArticleCard key={`${article.id}-${index}`} article={article} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
