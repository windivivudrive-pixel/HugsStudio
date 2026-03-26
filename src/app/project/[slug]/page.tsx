"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { projectsData, Project } from "@/data/projects";
import React, { useEffect, useState } from "react";
import { databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import { Query } from "appwrite";
import Footer from "@/components/Footer";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProjectDetailPage({ params }: Props) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        // 1. Try Appwrite
        const response = await databases.listDocuments(
          APPWRITE_CONFIG.DATABASE_ID,
          APPWRITE_CONFIG.COLLECTIONS.PROJECTS,
          [Query.equal('slug', slug), Query.limit(1)]
        );

        if (response.documents.length > 0) {
          const doc = response.documents[0];
          // Tags might be stored as a string "tag1, tag2" or array
          let tags = doc.tags;
          if (typeof tags === 'string') {
            tags = tags.split(',').map((t: string) => t.trim());
          }

          setProject({
            id: doc.$id,
            slug: doc.slug,
            title: doc.title,
            category: doc.category,
            year: doc.year,
            color: doc.color,
            image: doc.image,
            description: doc.description,
            fullDescription: doc.fullDescription,
            tags: tags,
            span: doc.span,
            aspect: doc.aspect
          });
        } else {
          // 2. Try Mock Data
          const mock = projectsData.find((p) => p.slug === slug);
          setProject(mock || null);
        }
      } catch (err) {
        console.warn("Appwrite project fetch failed:", err);
        const mock = projectsData.find((p) => p.slug === slug);
        setProject(mock || null);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    notFound();
  }

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
            className="relative w-full aspect-[21/9] md:aspect-[3/1] max-w-6xl mx-auto rounded-3xl overflow-hidden mb-20 bg-white/5 border border-white/10"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Project Content */}
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rich-text-content font-body text-lg text-white/80 leading-relaxed space-y-8 mb-16"
              dangerouslySetInnerHTML={{ __html: project.fullDescription.replace(/&nbsp;|\u00A0/g, ' ') }}
            />

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
