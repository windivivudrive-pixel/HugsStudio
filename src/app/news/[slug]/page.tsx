import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { Article, articlesData } from "@/data/news";
import { databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Metadata } from "next";
import { formatDisplayDate, convertToISODate } from "@/lib/date";

export const revalidate = 60; // ISR - revalidate every 60 seconds

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    // 1. Try to fetch from Appwrite
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.COLLECTIONS.NEWS,
      [Query.equal('slug', slug), Query.limit(1)]
    );

    if (response.documents.length > 0) {
      const doc = response.documents[0];
      return {
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
    console.error("Appwrite news detail fetch failed inside server:", error);
  }

  // 2. Option A Fallback: Try to fetch from Mock Data
  const mock = articlesData.find((a) => a.slug === slug);
  if (mock) {
    return mock;
  }

  return null;
}

// Helper function to extract FAQs from article HTML/Plain text content
function extractFAQs(htmlContent: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  if (!htmlContent) return faqs;

  // Normalize spaces and non-breaking spaces
  const normalized = htmlContent.replace(/&nbsp;|\u00A0/g, ' ');

  // Detect if content is HTML
  const isHtml = /<[a-z][\s\S]*>/i.test(normalized);
  let textContent = normalized;

  if (isHtml) {
    // Replace block-level HTML tags with newlines to separate paragraphs/sections
    textContent = normalized
      .replace(/<\/p>|<\/h[1-6]>|<\/div>|<br\s*\/?>/gi, '\n')
      // Strip all remaining HTML tags
      .replace(/<[^>]*>/g, '');
  }

  // Split content into lines/paragraphs
  const blocks = textContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // For each block, split into sentences
  const sentences: string[] = [];
  for (const block of blocks) {
    // Split sentences by . ? ! followed by spaces, using ES2018 lookbehind
    const sentenceSplit = block.split(/(?<=[.?!])\s+/);
    for (const s of sentenceSplit) {
      const trimmed = s.trim();
      if (trimmed.length > 0) {
        sentences.push(trimmed);
      }
    }
  }

  // Find Q&As in sentences
  for (let i = 0; i < sentences.length - 1; i++) {
    const currentSentence = sentences[i];
    
    // A question ends with '?' and has a reasonable length (10 to 150 chars)
    const isQuestion = currentSentence.endsWith('?') && currentSentence.length >= 10 && currentSentence.length <= 150;
    
    if (isQuestion) {
      let answer = '';
      let j = i + 1;
      
      // Collect subsequent sentences as the answer (up to 3 sentences or until next question)
      while (j < sentences.length) {
        const nextSentence = sentences[j];
        const isNextQuestion = nextSentence.endsWith('?') && nextSentence.length >= 10 && nextSentence.length <= 150;
        
        if (isNextQuestion) {
          break; // Stop collecting if we hit another question
        }
        
        answer += (answer ? ' ' : '') + nextSentence;
        j++;
        
        if (j - (i + 1) >= 3) break; // Collect at most 3 sentences for the answer
      }

      answer = answer.trim();
      // Ensure answer is valid and of reasonable length (>= 15 chars)
      if (answer && answer.length >= 15) {
        faqs.push({
          question: currentSentence,
          answer: answer
        });
        i = j - 1; // Skip ahead
      }
    }
  }
  
  return faqs;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Không tìm thấy bài viết — HUGs STUDIO",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hugs-studio.vercel.app';
  const imageUrl = article.image.startsWith('http') ? article.image : `${siteUrl}${article.image}`;
  const excerpt = article.content.replace(/<[^>]*>/g, '').replace(/&nbsp;|\u00A0/g, ' ').substring(0, 160) + '...';

  return {
    title: `${article.title} — HUGs STUDIO Journal`,
    description: excerpt,
    alternates: {
      canonical: `/news/${slug}`,
    },
    openGraph: {
      title: `${article.title} — HUGs STUDIO Journal`,
      description: excerpt,
      url: `${siteUrl}/news/${slug}`,
      type: "article",
      images: [
        {
          url: imageUrl,
          alt: article.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} — HUGs STUDIO`,
      description: excerpt,
      images: [imageUrl],
    }
  };
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  
  // 1. Add mock slugs
  articlesData.forEach(a => {
    if (a.slug) params.push({ slug: a.slug });
  });

  // 2. Add Appwrite slugs if possible
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.COLLECTIONS.NEWS,
      [Query.limit(100)]
    );
    response.documents.forEach((doc: any) => {
      if (doc.slug) {
        params.push({ slug: doc.slug });
      }
    });
  } catch (error) {
    console.warn("generateStaticParams news fetch failed:", error);
  }

  // Remove duplicates
  const uniqueParams = Array.from(new Set(params.map(a => a.slug))).map(slug => ({ slug }));
  return uniqueParams;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  // Calculate read time roughly (strip tags first)
  const plainText = article.content.replace(/<[^>]*>/g, '');
  const readTime = Math.max(1, Math.ceil(plainText.split(' ').length / 200));

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": [
      article.image.startsWith('http') ? article.image : `https://hugs-studio.vercel.app${article.image}`
    ],
    "datePublished": convertToISODate(article.date),
    "author": {
      "@type": "Person",
      "name": "Admin",
      "url": "https://hugs-studio.vercel.app/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "HUGs STUDIO",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hugs-studio.vercel.app/image/favicon.png"
      }
    },
    "description": article.content.replace(/<[^>]*>/g, '').replace(/&nbsp;|\u00A0/g, ' ').substring(0, 160)
  };

  const faqs = extractFAQs(article.content);
  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
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
              <span>{formatDisplayDate(article.date)}</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span>{readTime} min read</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-8">
              {article.title}
            </h1>
          </header>


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
