import React from "react";
import { Article, articlesData } from "@/data/news";
import { databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import { Query } from "appwrite";
import NewsPageClient from "@/components/NewsPageClient";
import { Metadata } from "next";
import { convertToISODate } from "@/lib/date";

export const revalidate = 60; // ISR - revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Tin Tức & Xu Hướng Sáng Tạo — HUGs STUDIO",
  description: "Khám phá các bài chia sẻ chuyên sâu về thiết kế đồ họa, nhiếp ảnh sản phẩm F&B, sản xuất TVC chuyên nghiệp và xu hướng công nghệ Web từ đội ngũ HUGs STUDIO.",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "Tin Tức & Xu Hướng Sáng Tạo — HUGs STUDIO",
    description: "Khám phá các bài chia sẻ chuyên sâu về thiết kế đồ họa, nhiếp ảnh sản phẩm F&B, sản xuất TVC chuyên nghiệp và xu hướng công nghệ Web từ đội ngũ HUGs STUDIO.",
    type: "website",
  }
};

async function getArticles(): Promise<Article[]> {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.COLLECTIONS.NEWS,
      [Query.orderDesc('$createdAt'), Query.limit(100)]
    );
    
    if (response.documents.length > 0) {
      const articles = response.documents.map((doc: any) => ({
        id: doc.$id,
        slug: doc.slug,
        title: doc.title,
        date: doc.date,
        category: doc.category,
        image: doc.image,
        content: doc.content,
      }));

      // Sort articles by date descending
      return articles.sort((a, b) => {
        const timeA = new Date(convertToISODate(a.date)).getTime();
        const timeB = new Date(convertToISODate(b.date)).getTime();
        return timeB - timeA;
      });
    }
  } catch (error) {
    console.error("Appwrite news fetch failed on server, using mock fallback:", error);
  }

  // Option A Fallback: Mock Data
  return [...articlesData].sort((a, b) => {
    const timeA = new Date(convertToISODate(a.date)).getTime();
    const timeB = new Date(convertToISODate(b.date)).getTime();
    return timeB - timeA;
  });
}

export default async function NewsPage() {
  const articles = await getArticles();

  return <NewsPageClient initialArticles={articles} />;
}
