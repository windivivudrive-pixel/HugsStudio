"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Footer from "@/components/Footer";

import { Article } from "@/data/news";
import { databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import { Query } from "appwrite";

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

function NewsCard({ article, span, featured = false }: { article: Article; span: string; featured?: boolean }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <Link href={`/news/${article.slug}`} className={`${span}`}>
      <motion.div
        variants={cardVariants}
        onMouseMove={handleMouseMove}
        className="group relative z-10 flex flex-col h-full transition-transform duration-300 hover:scale-[1.02]"
        data-cursor-hover
      >
        {/* Spotlight Border Glow */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition duration-300 group-hover:opacity-100 z-0"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                350px circle at ${mouseX}px ${mouseY}px,
                rgba(255,255,255,0.3),
                transparent 40%
              )
            `,
          }}
        />

        {/* Card Border wrapper */}
        <div className={`relative overflow-hidden rounded-lg bg-transparent md:bg-white/10 p-[1px] md:p-[1px] w-full ${featured ? 'aspect-[16/9]' : 'aspect-[4/3] md:flex-1'}`}>
          {/* Inner Image Container */}
          <div className="relative h-full w-full rounded-[7px] bg-obsidian overflow-hidden z-10">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover contrast-125 brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

            {/* Floating Tag */}
            <div className={`absolute z-20 ${featured ? 'top-4 right-4 md:top-6 md:right-6' : 'top-3 right-3'}`}>
              <span className={`px-2 py-1 md:px-4 md:py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md font-heading font-medium text-white shadow-lg ${featured ? 'text-xs md:text-sm' : 'text-[9px] md:text-xs'}`}>
                {article.category}
              </span>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="mt-4 md:mt-6 flex flex-col px-1 md:px-2">
          <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-3">
            <span className={`font-heading uppercase tracking-wider text-white/50 ${featured ? 'text-xs md:text-sm' : 'text-[10px] md:text-xs'}`}>
              {article.date}
            </span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          <h3 className={`font-heading font-bold leading-snug md:leading-tight text-white group-hover:text-white/80 transition-colors duration-300 line-clamp-3 md:line-clamp-none ${featured ? 'text-xl sm:text-2xl md:text-4xl lg:text-5xl' : 'text-[15px] sm:text-lg md:text-2xl lg:text-3xl'}`}>
            {article.title}
          </h3>

          {/* Mobile Avatar + Author */}
          <div className="flex items-center gap-2 mt-3 md:hidden">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-white/40 to-white/90 shrink-0" />
            <span className="text-[11px] font-body text-white/60 line-clamp-1">Admin</span>
          </div>

          {/* Show excerpt only on featured */}
          {featured && article.content && (
            <p className="mt-3 md:mt-4 text-ash font-body text-sm md:text-base lg:text-lg line-clamp-2">
              {article.content.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').substring(0, 200)}...
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

import QuickViewSidebar from "./components/QuickViewSidebar";
import HorizontalNewsCard from "./components/HorizontalNewsCard";

export default function NewsPage() {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await databases.listDocuments(
          APPWRITE_CONFIG.DATABASE_ID,
          APPWRITE_CONFIG.COLLECTIONS.NEWS,
          [Query.limit(20)]
        );
        
        if (response.documents.length > 0) {
          // Map Appwrite documents to Article interface
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
        console.error("Appwrite fetch failed:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  // Main featured articles (first 5 for the left side)
  const mainArticles = articles.slice(0, 5);
  // List articles (the rest of the articles for the horizontal list underneath)
  const listArticles = articles.slice(5);
  // Sidebar articles (quick timeline view, picking the most recent/relevant)
  const sidebarArticles = articles.slice(1, 10);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Specific spanning for the Magazine Layout
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

const getSpan = (index: number) => {
    // Mobile: Hero spans 2 cols, others span 1. Desktop: Hero spans 2 cols, others span 1.
    if (index === 0) return "col-span-2 md:col-span-2";
    return "col-span-1 md:col-span-1";
  };

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
