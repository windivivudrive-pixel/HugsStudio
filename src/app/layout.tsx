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
  title: "HUGs STUDIO — Creative Digital Agency",
  description:
    "Premium creative digital agency specializing in brand identity, web design, motion design, and digital experiences. We craft bold, immersive solutions that make your brand unforgettable.",
  keywords: [
    "creative agency",
    "digital agency",
    "brand design",
    "web development",
    "motion design",
    "UI/UX design",
  ],
  openGraph: {
    title: "HUGs STUDIO — Creative Digital Agency",
    description:
      "Premium creative digital agency crafting bold, immersive digital experiences.",
    type: "website",
    images: [
      {
        url: "/image/banner.png",
        width: 1200,
        height: 630,
        alt: "HUGs STUDIO — Creative Digital Agency Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HUGs STUDIO — Creative Digital Agency",
    description:
      "Premium creative digital agency crafting bold, immersive digital experiences.",
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
 
