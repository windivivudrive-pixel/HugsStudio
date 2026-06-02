import React from "react";
import { projectsData, Project } from "@/data/projects";
import { databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import { Query } from "appwrite";
import ProjectsPageClient from "@/components/ProjectsPageClient";
import { Metadata } from "next";

export const revalidate = 60; // ISR - revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Tất Cả Dự Án Sáng Tạo — HUGs STUDIO",
  description: "Bộ sưu tập những dự án nổi bật của HUGs STUDIO tại Đà Nẵng. Từ sản phẩm nhiếp ảnh thương mại, F&B đến sản xuất TVC, video chuyên nghiệp và thiết kế thương hiệu.",
  alternates: {
    canonical: "/project",
  },
  openGraph: {
    title: "Tất Cả Dự Án Sáng Tạo — HUGs STUDIO",
    description: "Bộ sưu tập những dự án nổi bật của HUGs STUDIO tại Đà Nẵng. Từ sản phẩm nhiếp ảnh thương mại, F&B đến sản xuất TVC và thiết kế thương hiệu.",
    type: "website",
  }
};

async function getProjects(): Promise<Project[]> {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.COLLECTIONS.PROJECTS,
      [Query.limit(50)]
    );

    if (response.documents.length > 0) {
      return response.documents.map((doc: any) => ({
        id: doc.$id,
        slug: doc.slug || "",
        title: doc.title || "",
        category: doc.category || "",
        year: doc.year || "",
        color: doc.color || "",
        image: doc.image || "",
        description: doc.description || "",
        fullDescription: doc.fullDescription || "",
        tags: typeof doc.tags === 'string' ? doc.tags.split(",").map((t: string) => t.trim()) : (Array.isArray(doc.tags) ? doc.tags : []),
        span: doc.span || "",
        aspect: doc.aspect || "",
      }));
    }
  } catch (error) {
    console.warn("Appwrite projects fetch failed on server, falling back to mock:", error);
  }

  return projectsData;
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return <ProjectsPageClient initialProjects={projects} />;
}
