"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { projectsData, Project } from "@/data/projects";
import { databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import { Query } from "appwrite";
import Footer from "@/components/Footer";

/**
 * /project page — Full listing of all projects.
 * - Asymmetric masonry-style grid
 * - Same card style as ProjectsShowcase on homepage
 * - Staggered scroll animations
 * - Consistent with the main page design system
 */;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
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

function ProjectCard({ project, index }: { project: Project, index: number }) {
  return (
    <Link href={`/project/${project.slug}`} className="block w-full mb-[45px] lg:mb-[65px] break-inside-avoid">
      <motion.div
        variants={cardVariants}
        className={`group relative overflow-hidden rounded-2xl bg-white/10 p-[2px] w-full transition-transform duration-300 hover:scale-[1.02] ${project.aspect || 'aspect-[4/3]'}`}
        data-cursor-hover
      >

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

            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 group-hover:scale-105 transition-transform duration-500 origin-bottom-left">
              <span className="font-body text-xs tracking-[0.2em] text-white/80 uppercase mb-2">
                {project.category}
              </span>
              <h3 className="font-heading text-2xl md:text-3xl font-bold mb-1">
                {project.title}
              </h3>
              <p className="font-body text-sm text-ash/90 mb-2 max-w-sm">
                {project.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                {project.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] uppercase tracking-widest text-white/40 border border-white/10 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Arrow icon (always visible) */}
          <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white transition-colors duration-500 pointer-events-none">
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="text-white group-hover:text-black transition-colors duration-500">
              <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Bottom info (visible without hover) */}
          <div className="absolute bottom-0 inset-x-0 p-6 z-5 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
            <h3 className="font-heading text-xl font-bold">
              {project.title}
            </h3>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeFilter, setActiveFilter] = React.useState("Tất Cả");

  React.useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await databases.listDocuments(
          APPWRITE_CONFIG.DATABASE_ID,
          APPWRITE_CONFIG.COLLECTIONS.PROJECTS,
          [Query.limit(50)]
        );

        if (response.documents.length > 0) {
          const fetchedProjects: Project[] = response.documents.map((doc: any) => ({
            id: doc.$id,
            slug: doc.slug,
            title: doc.title,
            category: doc.category,
            year: doc.year,
            color: doc.color,
            image: doc.image,
            description: doc.description,
            fullDescription: doc.fullDescription,
            tags: typeof doc.tags === 'string' ? doc.tags.split(",").map((t: string) => t.trim()) : (Array.isArray(doc.tags) ? doc.tags : []),
            span: doc.span,
            aspect: doc.aspect,
          }));
          setProjects(fetchedProjects);
        } else {
          setProjects(projectsData);
        }
      } catch (error) {
        console.warn("Appwrite projects fetch failed, using mock data:", error);
        setProjects(projectsData);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Build category filter from data
  const categories = ["Tất Cả", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filtered = activeFilter === "Tất Cả"
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <>
      <main className="min-h-screen bg-obsidian text-white pt-0 pb-20 selection:bg-white/20 relative z-10">
        {/* Hero Header */}
        <section className="relative pt-40 pb-16 md:pb-24 px-6 md:px-20 lg:px-32">
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[600px] h-[400px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 font-body text-sm text-ash mb-8">
              <Link href="/" className="hover:text-white transition-colors" data-cursor-hover>
                Trang Chủ
              </Link>
              <span className="text-white/20">/</span>
              <span className="text-white">Dự Án</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
              <div>
                <span className="font-body text-xs tracking-[0.3em] text-white/60 uppercase mb-3 block">
                  Bộ Sưu Tập
                </span>
                <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                  Tất Cả Dự Án<span className="text-white/30">.</span>
                </h1>
              </div>

              <p className="font-body text-base text-ash max-w-md leading-relaxed">
                Mỗi dự án đều là sự kết hợp giữa chiến lược, sáng tạo và kỹ thuật —
                mang đến trải nghiệm số đáng nhớ cho các thương hiệu.
              </p>
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3 mt-12"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`
                  font-body text-sm px-5 py-2.5 rounded-full border transition-all duration-300
                  ${activeFilter === cat
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-ash border-white/10 hover:border-white/30 hover:text-white"
                  }
                `}
                data-cursor-hover
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </section>

        {/* Masonry Project Grid */}
        <section className="relative px-6 md:px-20 lg:px-32 pb-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={activeFilter}
            className="columns-1 md:columns-2 gap-[45px] lg:gap-[65px]"
          >
            {filtered.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-20"
          >
            <Link
              href="/#contact"
              className="group flex items-center gap-3 font-body text-sm text-ash hover:text-white transition-colors duration-300"
              data-cursor-hover
            >
              <span>Bạn có dự án cần thực hiện?</span>
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 group-hover:border-white/40 group-hover:bg-white/5 transition-all duration-300">
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
