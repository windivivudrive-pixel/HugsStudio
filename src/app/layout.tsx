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
  title: "HUGs STUDIO — Sáng Tạo Nội Dung Hình Ảnh & Video",
  description:
    "HUGS STUDIO là đơn vị chuyên nghiệp về sản xuất nội dung hình ảnh, video, chụp ảnh sản phẩm, profile và quay phim TVC. Chúng tôi kiến tạo những giá trị thẩm mỹ và cảm xúc chân thực cho thương hiệu của bạn.",
  keywords: [
    "creative agency",
    "chụp ảnh sản phẩm",
    "quay phim TVC",
    "brand design",
    "quay phim chuyên nghiệp",
    "HUGS STUDIO",
    "chụp ảnh profile",
  ],
  openGraph: {
    title: "HUGs STUDIO — Sáng Tạo Nội Dung Hình Ảnh & Video",
    description:
      "Đơn vị sản xuất nội dung hình ảnh và video hàng đầu, mang đến sự đột phá cho thương hiệu.",
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
    title: "HUGs STUDIO — Sáng Tạo Nội Dung Hình Ảnh & Video",
    description:
      "Đơn vị sản xuất nội dung hình ảnh và video hàng đầu, mang đến sự đột phá cho thương hiệu.",
    images: ["/image/banner.png"],
  },
  icons: {
    icon: "/favicon-hugs.png",
    apple: "/favicon-hugs.png",
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
        <Navbar />
        {children}
        <CustomCursor />
        <Chatbot />
      </body>
    </html>
  );
}
 
