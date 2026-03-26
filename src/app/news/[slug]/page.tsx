import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { Article } from "@/data/news";
import { databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import { Query } from "appwrite";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  
  let article: Article | null = null;

  try {
    // 1. Try to fetch from Appwrite
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.COLLECTIONS.NEWS,
      [Query.equal('slug', slug), Query.limit(1)]
    );

      if (response.documents.length > 0) {
        const doc = response.documents[0];
        article = {
          id: doc.$id,
          slug: doc.slug,
          title: doc.title,
          date: doc.date,
          category: doc.category,
          image: doc.image,
          content: doc.content,
        };
      }
    } catch (error) {
      console.error("Appwrite detail fetch failed:", error);
    }

  if (!article) {
    notFound();
  }

  // Calculate read time roughly (strip tags first)
  const plainText = article.content.replace(/<[^>]*>/g, '');
  const readTime = Math.max(1, Math.ceil(plainText.split(' ').length / 200));

  return (
    <>
      <main className="min-h-screen bg-obsidian text-white pt-24 pb-20 selection:bg-white/20 relative z-10">
        <article className="container mx-auto px-6 md:px-12 lg:px-24">
          
          {/* Back Button */}
          <div className="mb-12">
            <Link 
              href="/news"
              className="inline-flex items-center gap-2 font-body text-sm text-ash hover:text-white transition-colors group"
              data-cursor-hover
            >
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover:-translate-x-1">
                <path d="M11 6H1M1 6L5 2M1 6L5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Quay lại Tin Tức
            </Link>
          </div>

          {/* Article Header */}
          <header className="max-w-4xl mx-auto mb-16 text-center">
            <div className="flex items-center justify-center gap-4 font-heading text-xs uppercase tracking-wider text-ash mb-6">
              <span className="text-white/80">{article.category}</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span>{article.date}</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span>{readTime} min read</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-8">
              {article.title}
            </h1>
          </header>

          {/* Hero Image */}
          <div className="relative w-full aspect-[21/9] md:aspect-[3/1] max-w-6xl mx-auto rounded-3xl overflow-hidden mb-20 bg-white/5 border border-white/10">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="max-w-4xl mx-auto font-body text-lg text-ash leading-relaxed space-y-8">
            {/* Render HTML content safely */}
            <div 
              className="rich-text-content text-white/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content.replace(/&nbsp;|\u00A0/g, ' ') }}
            />

            <div className="pt-12 mt-12 border-t border-white/10">
              <h3 className="font-heading text-2xl font-bold text-white mb-4">
                Chia sẻ bài viết này
              </h3>
              <div className="flex gap-4">
                {['Twitter', 'LinkedIn', 'Facebook'].map((platform) => (
                  <button 
                    key={platform}
                    className="px-6 py-2 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all text-sm font-heading"
                    data-cursor-hover
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
