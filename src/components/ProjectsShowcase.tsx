"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { projectsData } from "@/data/projects";
import { databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import { Query } from "appwrite";

/**
 * ProjectsShowcase — Asymmetric grid of project cards.
 * Features:
 * - Creative asymmetric layout with varying sizes
 * - Liquid Glass hover overlay revealing project info
 * - Staggered reveal-on-scroll animation
 * - Image zoom on hover
 */

// Stagger animation container
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as any,
    },
  },
};

function ProjectCard({ project, variants, className = "" }: { project: any; variants: any; className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Force clean spans without md: or lg: prefixes to ensure grid works on mobile
  const rawSpan = project.span || "col-span-12";
  const colMatch = rawSpan.match(/col-span-\d+/);
  const rowMatch = rawSpan.match(/row-span-\d+/);
  const cleanSpan = `${colMatch ? colMatch[0] : ''} ${rowMatch ? rowMatch[0] : ''}`.trim() || rawSpan;

  return (
    <Link href={`/project/${project.slug}`} className={`${cleanSpan} ${className}`}>
      <motion.div
        variants={variants}
        onMouseMove={handleMouseMove}
        className={`group relative h-full w-full overflow-hidden rounded-2xl bg-white/10 p-[2px]`}
        data-cursor-hover
      >
        {/* Spotlight Border Glow */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
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

        {/* Inner Container masking the center of the glow */}
        <div className="relative h-full w-full rounded-[14px] bg-obsidian overflow-hidden z-10">
          {/* Project Image/Video */}
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
            {project.type === 'video' && project.video ? (
              <video
                src={project.video}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="object-cover w-full h-full contrast-125 brightness-90 group-hover:brightness-100 transition-all duration-700"
              />
            ) : (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover contrast-125 brightness-90 group-hover:brightness-100 transition-all duration-700"
              />
            )}
            {/* Overlay gradient for depth (normal state) */}
            <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0`} />
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.04] z-10"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Hover Content Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-10 pointer-events-none">
            {/* Sliding Bottom Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />

            <div className="absolute inset-0 flex flex-col justify-end p-2 md:p-6 lg:p-8">
              <span className="font-body text-[7px] md:text-xs tracking-[0.2em] text-white/80 uppercase mb-1 md:mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                {project.category}
              </span>
              <h3 className="font-heading text-[10px] leading-tight md:text-2xl lg:text-3xl font-bold mb-0.5 md:mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                {project.title}
              </h3>
              <span className="font-body text-[8px] md:text-sm text-ash translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                {project.year}
              </span>
            </div>
          </div>

          {/* Arrow icon (always visible) */}
          <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 w-5 h-5 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white transition-colors duration-500 pointer-events-none">
            <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-white group-hover:text-black transition-colors duration-500">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" fill="currentColor" />
            </svg>
          </div>

          {/* Bottom info (visible without hover) */}
          <div className="absolute bottom-0 inset-x-0 p-2 md:p-4 lg:p-6 z-5 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
            <h3 className="font-heading text-[9px] md:text-sm lg:text-xl font-bold leading-tight drop-shadow-md">
              {project.title}
            </h3>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

const LOCAL_CONFIGS: Record<string, { image: string; span: string; aspect: string; type: 'image' | 'video' }> = {
  '69ce33b3003b8472378c': { image: '/image/du-an-home/1.webp', span: 'col-span-7', aspect: 'aspect-[16/10]', type: 'image' },
  '69cf2a5c0015e782cd1c': { image: '/image/du-an-home/2.webp', span: 'col-span-5', aspect: 'aspect-[4/5]', type: 'image' },
  '69cf29b60029fcf9fbe0': { image: '/image/du-an-home/3.webp', span: 'col-span-4', aspect: 'aspect-square', type: 'image' },
  '6a191f0000317b1bfb25': { image: '/image/du-an-home/04.webp', span: 'col-span-4', aspect: 'aspect-[16/9]', type: 'image' },
  '69ce3a20001c830d1bd1': { image: '/image/du-an-home/5.webp', span: 'col-span-8', aspect: 'aspect-[4/3]', type: 'image' },
  '69cf295a00172e76fc61': { image: '/image/du-an-home/6.png', span: 'col-span-6', aspect: 'aspect-[16/10]', type: 'image' },
  '6a192001002d3af039d3': { image: '/image/du-an-home/07.webp', span: 'col-span-6', aspect: 'aspect-[21/9]', type: 'image' }
};

export default function ProjectsShowcase() {
  const [projects, setProjects] = useState<any[]>(projectsData.slice(0, 8));

  useEffect(() => {
    const fetchFavoriteProjects = async () => {
      try {
        const response = await databases.listDocuments(
          APPWRITE_CONFIG.DATABASE_ID,
          APPWRITE_CONFIG.COLLECTIONS.PROJECTS,
          [Query.limit(50)]
        );
        if (response.documents.length > 0) {
          const docs = response.documents;
          const docMap = new Map<string, any>();
          docs.forEach(doc => docMap.set(doc.$id, doc));

          const orderedIds = [
            '69ce33b3003b8472378c',
            '69cf2a5c0015e782cd1c',
            '69cf29b60029fcf9fbe0',
            '6a191f0000317b1bfb25',
            '69ce3a20001c830d1bd1',
            '69cf295a00172e76fc61',
            '6a192001002d3af039d3'
          ];

          const mappedProjects: any[] = [];

          orderedIds.forEach(id => {
            const doc = docMap.get(id);
            const local = LOCAL_CONFIGS[id];
            if (doc && local) {
              let tags: string[] = [];
              if (typeof doc.tags === 'string' && doc.tags.trim() !== '') {
                tags = doc.tags.split(',').map((t: string) => t.trim());
              } else if (Array.isArray(doc.tags)) {
                tags = doc.tags;
              }

              mappedProjects.push({
                $id: doc.$id,
                id: doc.$id,
                slug: doc.slug || '',
                title: doc.title || '',
                category: doc.category || '',
                year: doc.year || '',
                color: doc.color || 'from-zinc-800/30 to-zinc-950/60',
                image: local.image,
                description: doc.description || '',
                fullDescription: doc.fullDescription || '',
                tags: tags,
                span: local.span,
                aspect: local.aspect,
                type: local.type
              });
            } else {
              const fallback = projectsData.find(p => p.id === id);
              if (fallback) mappedProjects.push(fallback);
            }
          });

          const verticalVideo = projectsData.find(p => p.id === 8);
          if (verticalVideo) {
            mappedProjects.splice(2, 0, verticalVideo);
          }

          setProjects(mappedProjects);
        }
      } catch (e) {
        console.error("Failed to fetch projects dynamically:", e);
      }
    };
    fetchFavoriteProjects();
  }, []);

  return (
    <section id="projects" className="relative py-24 md:py-32 px-6 md:px-20 lg:px-32">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="flex items-end justify-between mb-16"
      >
        <div>
          <span className="font-body text-xs tracking-[0.3em] text-white/60 uppercase mb-3 block">
            Dự Án Nổi Bật
          </span>
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Dự Án<br />
            Tiêu Biểu<span className="text-white">.</span>
          </h2>
          <p className="font-body text-sm md:text-base text-ash/80 mt-6 max-w-xl leading-relaxed">
            Mỗi dự án tại HUGs là một hành trình sáng tạo nơi ý tưởng được định hình thành concept và chuyển hóa thành những hình ảnh mang dấu ấn riêng biệt.
          </p>
        </div>
        <Link
          href="/project"
          className="hidden md:flex items-center gap-2 font-body text-sm text-ash hover:text-white transition-colors group"
          data-cursor-hover
        >
          Xem tất cả dự án
          <svg width="16" height="16" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover:translate-x-1">
            <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </motion.div>

      {/* Asymmetric Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-12 gap-1.5 md:gap-4 lg:gap-6 auto-rows-[calc((100vw-3rem)*0.3)] md:auto-rows-[calc((100vw-10rem)*0.3)] lg:auto-rows-[calc((100vw-16rem)*0.3)]"
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={project.$id || project.id}
            project={project}
            variants={cardVariants}
          />
        ))}
      </motion.div>
    </section>
  );
}
