"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

/**
 * Navbar — Sticky glassmorphic navigation bar.
 * Features:
 * - Liquid Glass backdrop blur effect
 * - Logo on left, nav links center, CTA button right
 * - Scroll-aware: slightly more opaque on scroll
 * - Mobile hamburger menu with animated panel
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Dự án", href: "/project" },
    { label: "Tin tức", href: "/news" },
    { label: "Giới thiệu", href: "/about" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
      }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-[100] pointer-events-none transition-all duration-500 ${scrolled ? "pt-4" : "pt-0"}`}
    >
      <div
        className={`mx-auto flex items-center justify-between rounded-2xl border pointer-events-auto shadow-sm transition-all duration-500 ${
          scrolled 
            ? "max-w-[1200px] w-[95%] bg-[#141414]/40 backdrop-blur-[40px] saturate-150 border-white/10 py-3 px-4 md:px-6" 
            : "max-w-[1280px] w-full bg-transparent backdrop-blur-none border-transparent py-6 px-4 md:px-6 shadow-none"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="relative h-10 md:h-12 w-48 md:w-56" data-cursor-hover>
          <Image
            src="/logo-hugs-black.png"
            alt="HUGs STUDIO Logo"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-[15px] text-ash hover:text-white transition-colors duration-300 relative group"
              data-cursor-hover
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-heading text-[15px] font-semibold rounded-full hover:bg-white-dim transition-colors duration-300"
          data-cursor-hover
        >
          Liên hệ ngay
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-px">
            <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.a>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          data-cursor-hover
        >
          <motion.span
            animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 6 : 0 }}
            className="block w-6 h-px bg-white"
          />
          <motion.span
            animate={{ opacity: mobileOpen ? 0 : 1 }}
            className="block w-6 h-px bg-white"
          />
          <motion.span
            animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -6 : 0 }}
            className="block w-6 h-px bg-white"
          />
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mx-4 mt-2 rounded-2xl p-6 pointer-events-auto border border-white/10 bg-[#0a0a0a]/70 backdrop-blur-[40px] saturate-150 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-heading text-xl text-white hover:text-white-dim transition-colors"
                  data-cursor-hover
                >
                  {link.label}
                </a>
              ))}
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-black font-heading text-sm font-semibold rounded-full"
                data-cursor-hover
              >
                Liên hệ ngay
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
