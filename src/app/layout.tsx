import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import Chatbot from "@/components/Chatbot";

/**
 * Root Layout — Sets up fonts, metadata, and dark background for HUGs STUDIO.
 */

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hugs-studio.vercel.app'),
  title: "HUGs STUDIO — Studio Chụp Sản Phẩm & Quay TVC Tại Đà Nẵng",
  description:
    "HUGS STUDIO là đơn vị hàng đầu về sản xuất nội dung hình ảnh, video, studio chụp sản phẩm chuyên nghiệp và quay TVC tại Đà Nẵng. Chúng tôi kiến tạo những giá trị thẩm mỹ và cảm xúc chân thực cho thương hiệu của bạn.",
  keywords: [
    "creative agency",
    "chụp ảnh sản phẩm",
    "quay phim TVC",
    "brand design",
    "quay phim chuyên nghiệp",
    "HUGS STUDIO",
    "chụp ảnh profile",
    "studio chụp sản phẩm",
    "studio tại đà nẵng",
    "chụp ảnh sản phẩm đà nẵng",
    "quay tvc đà nẵng"
  ],
  openGraph: {
    title: "HUGs STUDIO — Studio Chụp Sản Phẩm & Quay TVC Tại Đà Nẵng",
    description:
      "Đơn vị sản xuất nội dung hình ảnh, studio chụp sản phẩm và quay TVC hàng đầu tại Đà Nẵng, mang đến sự đột phá cho thương hiệu.",
    type: "website",
    images: [
      {
        url: "/image/banner.png",
        width: 1200,
        height: 630,
        alt: "HUGs STUDIO Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HUGs STUDIO — Studio Chụp Sản Phẩm & Quay TVC Tại Đà Nẵng",
    description:
      "Đơn vị sản xuất nội dung hình ảnh, studio chụp sản phẩm và quay TVC hàng đầu tại Đà Nẵng, mang đến sự đột phá cho thương hiệu.",
    images: ["/image/banner.png"],
  },
  icons: {
    icon: "/image/favicon.png",
    apple: "/image/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased bg-obsidian text-white`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "HUGs STUDIO",
              image: "https://hugs-studio.vercel.app/image/banner.png",
              description: "HUGS STUDIO là đơn vị hàng đầu về sản xuất nội dung hình ảnh, video, studio chụp sản phẩm chuyên nghiệp và quay TVC tại Đà Nẵng.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Đà Nẵng",
                addressCountry: "VN"
              },
              url: "https://hugs-studio.vercel.app",
              telephone: "",
              priceRange: "$$"
            })
          }}
        />
        <Navbar />
        {children}
        <CustomCursor />
        <Chatbot />
      </body>
    </html>
  );
}
 
