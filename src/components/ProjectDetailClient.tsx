"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "@/data/projects";
import React, { useState } from "react";
import Footer from "@/components/Footer";

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const rawContent = (project.fullDescription || "").replace(/&nbsp;|\u00A0/g, ' ');
  const imgUrlRegex = /<img[^>]+src="([^">]+)"/g;
  const richTextImageUrls = Array.from(rawContent.matchAll(imgUrlRegex)).map(match => match[1]);
  
  // Combine gallery images with legacy rich text images to support older posts
  const allImageUrls = [...(project.gallery || []), ...richTextImageUrls];

  // Remove <img> tags, then remove empty <p> tags
  const textOnlyContent = rawContent
    .replace(/<img[^>]+>/g, '')
    .replace(/<p>[\s\n]*(?:<br\s*\/?>)?[\s\n]*<\/p>/g, '')
    .trim();
  const hasTextContent = textOnlyContent.length > 0;

  return (
    <>
      <main className="min-h-screen bg-obsidian text-white pt-24 pb-20 selection:bg-white/20 relative z-10">
        <article className="container mx-auto px-6 md:px-12 lg:px-24">
          
          {/* Back Button */}
          <div className="mb-12">
            <Link 
              href="/project"
              className="inline-flex items-center gap-2 font-body text-sm text-ash hover:text-white transition-colors group"
              data-cursor-hover
            >
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover:-translate-x-1">
                <path d="M11 6H1M1 6L5 2M1 6L5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Quay lại Dự Án
            </Link>
          </div>

          {/* Project Header */}
          <header className="max-w-4xl mx-auto mb-16 text-center">
            <div className="flex items-center justify-center gap-4 font-heading text-xs uppercase tracking-wider text-ash mb-6">
              <span className="text-white/80">{project.category}</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span>{project.year}</span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-8"
            >
              {project.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-body text-xl text-ash max-w-2xl mx-auto leading-relaxed"
            >
              {project.description}
            </motion.p>
          </header>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full aspect-[16/9] max-w-6xl mx-auto rounded-2xl overflow-hidden mb-20 bg-white/5 border border-white/10"
          >
            <Image
              src={project.image || "/image/placeholder.png"}
              alt={project.title}
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Project Content */}
          <div className="max-w-4xl mx-auto">
            {hasTextContent && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rich-text-content font-body text-lg text-white/80 leading-relaxed mb-16"
                dangerouslySetInnerHTML={{ __html: textOnlyContent }}
              />
            )}
          </div>
          
          {/* Project Image Gallery (Creative Masonry Layout) */}
          {allImageUrls.length > 0 && (
            <div className="max-w-7xl mx-auto mb-20 px-4 md:px-0">
               <motion.div 
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6 }}
                 className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
               >
                 {allImageUrls.map((url, idx) => (
                   <div
                     key={idx}
                     className="break-inside-avoid relative rounded-2xl overflow-hidden group border border-white/10 bg-white/5 shadow-2xl cursor-pointer"
                     onClick={() => setLightboxIndex(idx)}
                     data-cursor-hover
                   >
                     <img
                       src={url}
                       alt={`${project.title || 'Project'} Showcase ${idx + 1}`}
                       className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                       loading="lazy"
                     />
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none flex items-center justify-center">
                       <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                       </svg>
                     </div>
                   </div>
                 ))}
               </motion.div>
            </div>
          )}

          {/* Lightbox Modal */}
          {lightboxIndex !== null && (
            <div
              className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
              onClick={() => setLightboxIndex(null)}
            >
              {/* Close Button */}
              <button
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                onClick={() => setLightboxIndex(null)}
                aria-label="Đóng"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Prev Button */}
              {lightboxIndex > 0 && (
                <button
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
                  aria-label="Ảnh trước"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
              )}

              {/* Next Button */}
              {lightboxIndex < allImageUrls.length - 1 && (
                <button
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
                  aria-label="Ảnh tiếp"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              )}

              {/* Image */}
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={allImageUrls[lightboxIndex]}
                alt={`${project.title || 'Project'} Showcase ${lightboxIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Counter */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-sm text-white/60">
                {lightboxIndex + 1} / {allImageUrls.length}
              </div>
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            {/* Tags / Skills */}
            <div className="pt-12 border-t border-white/10">
              <h3 className="font-heading text-xl font-bold text-white mb-6 uppercase tracking-widest">
                Lĩnh vực & Kỹ thuật
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-6 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-body text-ash hover:text-white hover:border-white/30 transition-all duration-300"
                    data-cursor-hover
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 p-12 rounded-3xl bg-white/5 border border-white/10 text-center"
            >
              <h3 className="font-heading text-3xl font-bold mb-4">Bạn có dự án tương tự?</h3>
              <p className="font-body text-ash mb-8 max-w-md mx-auto">Hãy để chúng tôi giúp bạn hiện thực hóa những ý tưởng sáng tạo nhất.</p>
              <motion.a 
                href="/#contact" 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="inline-block bg-white text-black px-10 py-4 rounded-full font-heading font-bold hover:bg-ash transition-colors duration-300"
                data-cursor-hover
              >
                Liên hệ ngay
              </motion.a>
            </motion.div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
