"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Footer from "@/components/Footer";
import { Article } from "@/data/news";

// Relative components import mapped to absolute paths
import QuickViewSidebar from "@/app/news/components/QuickViewSidebar";
import HorizontalNewsCard from "@/app/news/components/HorizontalNewsCard";

// Stagger animation container
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as any,
    },
  },
};

function HeroArticleGlow({ article }: { article: Article }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <Link href={`/news/${article.slug}`} className="group block" onMouseMove={handleMouseMove} data-cursor-hover>
      <div className="relative aspect-[16/10] rounded-lg md:rounded-xl overflow-hidden bg-white/5 p-[1px]">
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-lg md:rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                600px circle at ${mouseX}px ${mouseY}px,
                rgba(255,255,255,0.3),
                transparent 40%
              )
            `,
          }}
        />
        <div className="relative h-full w-full rounded-[7px] md:rounded-[10px] overflow-hidden z-10 bg-obsidian">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full border border-white/20 bg-black/40 backdrop-blur-md font-heading font-medium text-white text-xs">
              {article.category}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 md:mt-5">
        <h3 className="font-heading text-xl md:text-2xl lg:text-3xl font-bold leading-snug text-white group-hover:text-white/80 transition-colors duration-300 line-clamp-3">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-white/40 to-white/90 shrink-0" />
          <span className="text-xs font-body text-white/50">Admin</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-xs font-body text-white/40">{article.date}</span>
        </div>
      </div>
    </Link>
  );
}

function SecondaryArticleGlow({ article }: { article: Article }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <Link href={`/news/${article.slug}`} className="group block" onMouseMove={handleMouseMove} data-cursor-hover>
      <div className="relative aspect-[4/3] rounded-lg md:rounded-xl overflow-hidden bg-white/5 p-[1px]">
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-lg md:rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                400px circle at ${mouseX}px ${mouseY}px,
                rgba(255,255,255,0.3),
                transparent 40%
              )
            `,
          }}
        />
        <div className="relative h-full w-full rounded-[7px] md:rounded-[10px] overflow-hidden z-10 bg-obsidian">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full border border-white/20 bg-black/40 backdrop-blur-md font-heading font-medium text-white text-xs">
              {article.category}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 md:mt-5">
        <h3 className="font-heading text-lg md:text-xl font-bold leading-snug text-white group-hover:text-white/80 transition-colors duration-300 line-clamp-2">
          {article.title}
        </h3>
        {article.content && (
          <p className="mt-2 text-ash font-body text-sm line-clamp-3 leading-relaxed">
            {article.content.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').substring(0, 160)}...
          </p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-white/40 to-white/90 shrink-0" />
          <span className="text-xs font-body text-white/50">Admin</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-xs font-body text-white/40">{article.date}</span>
        </div>
      </div>
    </Link>
  );
}

function GridArticleGlow({ article }: { article: Article }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <Link href={`/news/${article.slug}`} className="group block" onMouseMove={handleMouseMove} data-cursor-hover>
      <div className="relative aspect-[4/3] rounded-lg md:rounded-xl overflow-hidden bg-white/5 p-[1px]">
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-lg md:rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                300px circle at ${mouseX}px ${mouseY}px,
                rgba(255,255,255,0.3),
                transparent 40%
              )
            `,
          }}
        />
        <div className="relative h-full w-full rounded-[7px] md:rounded-[10px] overflow-hidden z-10 bg-obsidian">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-heading text-base md:text-lg font-bold leading-snug text-white group-hover:text-white/80 transition-colors duration-300 line-clamp-2">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-white/40 to-white/90 shrink-0" />
          <span className="text-[11px] font-body text-white/50">Admin</span>
          <span className="text-white/20 text-[11px]">·</span>
          <span className="text-[11px] font-body text-white/40">{article.date}</span>
        </div>
      </div>
    </Link>
  );
}

interface NewsPageClientProps {
  initialArticles: Article[];
}

export default function NewsPageClient({ initialArticles }: NewsPageClientProps) {
  // Main featured articles (first 5 for the left side)
  const mainArticles = initialArticles.slice(0, 5);
  // List articles (the rest of the articles for the horizontal list underneath)
  const listArticles = initialArticles.slice(5);
  // Sidebar articles (quick timeline view, picking the most recent/relevant)
  const sidebarArticles = initialArticles.slice(1, 10);

  return (
    <>
      <main className="min-h-screen bg-obsidian text-white pt-40 pb-20 selection:bg-white/20 relative z-10">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 max-w-4xl"
          >
            <span className="font-body text-xs tracking-[0.3em] text-white/60 uppercase mb-4 block">
              Tin Tức & Bài Viết
            </span>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.85] mb-8">
              News
            </h1>
            <p className="font-body text-lg md:text-xl text-ash max-w-2xl leading-relaxed">
              Khám phá những góc nhìn sâu sắc về thiết kế, chiến lược thương hiệu và xu hướng công nghệ mới nhất từ đội ngũ chuyên gia của HUGs STUDIO.
            </p>
          </motion.div>

          {/* Global 12-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Left Main Content (8 Columns) */}
            <div className="lg:col-span-8">
              {/* Featured 5 Articles — Magazine Layout */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6 md:space-y-8"
              >
                {/* Row 1: Hero (left) + Secondary (right) */}
                {mainArticles.length >= 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                    {/* Left — Large Hero */}
                    <motion.div variants={cardVariants} className="md:col-span-7">
                      <HeroArticleGlow article={mainArticles[0]} />
                    </motion.div>

                    {/* Right — Secondary article */}
                    <motion.div variants={cardVariants} className="md:col-span-5">
                      <SecondaryArticleGlow article={mainArticles[1]} />
                    </motion.div>
                  </div>
                )}

                {/* Row 2: 3 equal columns */}
                {mainArticles.length > 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                    {mainArticles.slice(2, 5).map((article) => (
                      <GridArticleGlow key={article.id} article={article} />
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Sub-divider */}
              <div className="my-10 md:my-16 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Bottom Vertical List Area (Horizontal Cards) - ALL DEVICES */}
              <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
                {listArticles.map((article) => (
                  <HorizontalNewsCard key={article.id} article={article} />
                ))}
              </div>
            </div>

            {/* Right Sidebar (4 Columns) */}
            <div className="lg:col-span-4 relative border-t border-white/10 lg:border-t-0 pt-12 lg:pt-0">
              <QuickViewSidebar articles={sidebarArticles} />
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
