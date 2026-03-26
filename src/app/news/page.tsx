"use client";

import { motion } from "framer-motion";
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
  return (
    <Link href={`/news/${article.slug}`} className={`${span}`}>
      <motion.div
        variants={cardVariants}
        className="group relative z-10 flex flex-col h-full transition-transform duration-300 hover:scale-[1.02]"
        data-cursor-hover
      >
        {/* Card Border wrapper */}
        <div className={`relative overflow-hidden rounded-2xl md:rounded-3xl bg-transparent md:bg-white/10 p-0 md:p-[2px] w-full ${featured ? 'aspect-[16/9] md:aspect-[21/9]' : 'aspect-square sm:aspect-[4/3] md:aspect-auto md:flex-1'}`}>
          {/* Inner Image Container */}
          <div className={`relative h-full w-full rounded-2xl md:rounded-[22px] bg-obsidian overflow-hidden z-10 ${featured ? 'md:min-h-[450px]' : 'md:min-h-[350px]'}`}>
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
              {/* Top Grid Area (First 5 Articles) - Responsive */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 md:gap-y-12 md:gap-x-6"
              >
                {mainArticles.map((article, index) => (
                  <NewsCard key={article.id} article={article} span={getSpan(index)} featured={index === 0} />
                ))}
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
