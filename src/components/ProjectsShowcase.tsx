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

  return (
    <Link href={`/project/${project.slug}`} className={`${project.span} ${className}`}>
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
          {/* Project Image */}
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover contrast-125 brightness-90 group-hover:brightness-100 transition-all duration-700"
            />
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

            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              <span className="font-body text-xs tracking-[0.2em] text-white/80 uppercase mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                {project.category}
              </span>
              <h3 className="font-heading text-2xl md:text-3xl font-bold mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                {project.title}
              </h3>
              <span className="font-body text-sm text-ash translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                {project.year}
              </span>
            </div>
          </div>

          {/* Arrow icon (always visible) */}
          <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white transition-colors duration-500 pointer-events-none">
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="text-white group-hover:text-black transition-colors duration-500">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" fill="currentColor" />
            </svg>
          </div>

          {/* Bottom info (visible without hover) */}
          <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 z-5 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
            <h3 className="font-heading text-sm md:text-xl font-bold">
              {project.title}
            </h3>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function ProjectsShowcase() {
  const [projects, setProjects] = useState<any[]>(projectsData.slice(0, 7));

  useEffect(() => {
    const fetchFavoriteProjects = async () => {
      try {
        const response = await databases.listDocuments(
          APPWRITE_CONFIG.DATABASE_ID,
          APPWRITE_CONFIG.COLLECTIONS.PROJECTS,
          [
            Query.equal('isFavorite', true),
            Query.limit(7),
            Query.orderDesc('$createdAt')
          ]
        );
        if (response.documents.length > 0) {
           setProjects(response.documents);
        }
      } catch (e) {
        console.error("Failed to fetch favorite projects:", e);
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
        </div>
        <a
          href="/project"
          className="hidden md:flex items-center gap-2 font-body text-sm text-ash hover:text-white transition-colors group"
          data-cursor-hover
        >
          Xem tất cả dự án
          <svg width="16" height="16" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover:translate-x-1">
            <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </motion.div>

      {/* Asymmetric Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-8 lg:gap-10 auto-rows-[240px] md:auto-rows-[400px] lg:auto-rows-[450px]"
      >
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.$id || project.id} 
            project={project} 
            variants={cardVariants} 
            className={index === 6 ? "hidden md:flex" : ""}
          />
        ))}
      </motion.div>
    </section>
  );
}
