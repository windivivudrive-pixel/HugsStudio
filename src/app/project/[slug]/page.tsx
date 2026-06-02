import { notFound } from "next/navigation";
import { projectsData, Project } from "@/data/projects";
import { databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import { Query } from "appwrite";
import ProjectDetailClient from "@/components/ProjectDetailClient";
import { Metadata } from "next";

export const revalidate = 60; // ISR - revalidate every 60 seconds

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.COLLECTIONS.PROJECTS,
      [Query.equal('slug', slug), Query.limit(1)]
    );

    if (response.documents.length > 0) {
      const doc = response.documents[0];
      let tags = doc.tags;
      if (typeof tags === 'string') {
        tags = tags.split(',').map((t: string) => t.trim());
      }

      return {
        id: doc.$id,
        slug: doc.slug,
        title: doc.title || "",
        category: doc.category || "",
        year: doc.year || "",
        color: doc.color || "",
        image: doc.image || "",
        description: doc.description || "",
        fullDescription: doc.fullDescription || "",
        tags: Array.isArray(tags) ? tags : [],
        gallery: doc.gallery || [],
        span: doc.span || "",
        aspect: doc.aspect || ""
      };
    }
  } catch (err) {
    console.warn("Appwrite project fetch failed inside server:", err);
  }

  // Option A Fallback: Mock Data
  const mock = projectsData.find((p) => p.slug === slug);
  if (mock) {
    return {
      ...mock,
      fullDescription: mock.fullDescription || "",
      tags: mock.tags || [],
      gallery: mock.gallery || []
    };
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Không tìm thấy dự án — HUGs STUDIO",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hugs-studio.vercel.app';
  const imageUrl = project.image.startsWith('http') ? project.image : `${siteUrl}${project.image}`;
  
  return {
    title: `${project.title} — Dự án của HUGs STUDIO`,
    description: project.description || `Chi tiết dự án ${project.title} thực hiện bởi HUGs STUDIO Đà Nẵng.`,
    alternates: {
      canonical: `/project/${slug}`,
    },
    openGraph: {
      title: `${project.title} — Dự án của HUGs STUDIO`,
      description: project.description,
      url: `${siteUrl}/project/${slug}`,
      type: "article",
      images: [
        {
          url: imageUrl,
          alt: project.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — HUGs STUDIO`,
      description: project.description,
      images: [imageUrl],
    }
  };
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  
  // 1. Add mock slugs
  projectsData.forEach(p => {
    if (p.slug) params.push({ slug: p.slug });
  });

  // 2. Add Appwrite slugs if possible
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.COLLECTIONS.PROJECTS,
      [Query.limit(100)]
    );
    response.documents.forEach((doc: any) => {
      if (doc.slug) {
        params.push({ slug: doc.slug });
      }
    });
  } catch (error) {
    console.warn("generateStaticParams projects fetch failed:", error);
  }

  // Remove duplicates
  const uniqueParams = Array.from(new Set(params.map(p => p.slug))).map(slug => ({ slug }));
  return uniqueParams;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "image": project.image.startsWith('http') ? project.image : `https://hugs-studio.vercel.app${project.image}`,
    "creator": {
      "@type": "LocalBusiness",
      "name": "HUGs STUDIO",
      "url": "https://hugs-studio.vercel.app"
    },
    "genre": project.category,
    "dateCreated": project.year
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <ProjectDetailClient project={project} />
    </>
  );
}
