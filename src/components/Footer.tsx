"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

/**
 * Footer — Large CTA headline with glass-styled contact form and social links.
 * Features:
 * - Bold call-to-action headline
 * - Glassmorphic contact form with custom service dropdown
 * - Google Forms backend integration
 * - Social links row
 * - Reveal-on-scroll animation
 */


const SERVICE_OPTIONS = [
  "ẢNH F&B",
  "CHỤP ẢNH TÁCH NỀN",
  "PROFILE CÁ NHÂN/DOANH NGHIỆP",
  "ẢNH LIFESTYLE",
  "ẢNH BEAUTY",
  "ẢNH BRANDING",
  "CHỤP ẢNH SỰ KIỆN",
  "QUAY TVC",
];

export default function Footer() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !phone || !service || !message) return;

    setSubmitState("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, service, message }),
      });

      if (!res.ok) throw new Error("Submit failed");

      setSubmitState("success");
      setName("");
      setEmail("");
      setPhone("");
      setService("");
      setMessage("");

      setTimeout(() => setSubmitState("idle"), 4000);
    } catch {
      setSubmitState("error");
      setTimeout(() => setSubmitState("idle"), 4000);
    }
  }

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <footer id="contact" className="relative pt-24 md:pt-32 pb-8 md:pb-10 overflow-hidden border-t border-white/10 bg-obsidian">
      {/* Background glows (High intensity for "Radiant" effect) */}
      <div
        className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, transparent 70%)",
          filter: "blur(60px)",
          mixBlendMode: "screen",
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)",
          filter: "blur(80px)",
          mixBlendMode: "screen",
        }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10 px-4 md:px-6">
        <div className="flex gap-16 lg:gap-8 flex-col-reverse lg:flex-row mb-16 md:mb-20">
          
          {/* Left Column (Typography & Links) */}
          <div className="flex-1 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="font-heading text-5xl sm:text-7xl md:text-[80px] lg:text-[96px] leading-[1.05] font-bold tracking-tight mb-16 lg:mb-24 mt-8 lg:mt-0">
                Hãy cùng <br /> tạo ra điều <br /> kỳ diệu<span className="text-white/40">.</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 gap-8 max-w-lg"
            >
              {/* Menu */}
              <div>
                <h3 className="font-body text-sm font-medium text-ash mb-6 uppercase tracking-wider">
                  Menu
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link href="/" className="font-heading text-xl text-white hover:text-ash transition-colors" data-cursor-hover>
                      Trang chủ
                    </Link>
                  </li>
                  <li>
                    <Link href="/project" className="font-heading text-xl text-white hover:text-ash transition-colors" data-cursor-hover>
                      Dự án
                    </Link>
                  </li>
                  <li>
                    <Link href="/news" className="font-heading text-xl text-white hover:text-ash transition-colors" data-cursor-hover>
                      Tin tức
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="font-heading text-xl text-white hover:text-ash transition-colors" data-cursor-hover>
                      Giới thiệu
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Follow Us */}
              <div>
                <h3 className="font-body text-sm font-medium text-ash mb-6 uppercase tracking-wider">
                  Theo dõi
                </h3>
                <p className="font-body text-[15px] text-white/80 mb-6 leading-relaxed max-w-[200px]">
                  Cập nhật các dự án thiết kế, thử nghiệm và bài viết mới nhất.
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/hugs.studio_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    data-cursor-hover
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a
                    href="https://www.tiktok.com/@hugs_studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    data-cursor-hover
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a8.13 8.13 0 0 1-2.91-2.85c-.01 2.45-.01 4.9-.01 7.35 0 1.25-.19 2.53-.78 3.64-.67 1.21-1.74 2.22-3.03 2.74-2.12.87-4.63.66-6.55-.58-1.92-1.21-3.04-3.55-2.81-5.81.16-1.57.91-3.09 2.14-4.1a6.65 6.65 0 0 1 5.92-1.32v4.02c-.52-.33-1.12-.53-1.75-.54a3.3 3.3 0 0 0-3.1 3.31c.06 1.48 1.3 2.75 2.78 2.81 1.74.07 3.33-1.1 3.47-2.84.02-3.46.01-6.91.01-10.37V.02z"/></svg>
                  </a>
                  <a
                    href="https://www.facebook.com/studio.hugs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    data-cursor-hover
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex-1 flex lg:justify-end"
          >
            <div 
              onMouseMove={handleMouseMove}
              className="group relative w-full max-w-[500px] overflow-hidden rounded-3xl bg-white/10 p-[1px]"
              data-cursor-hover
            >
              {/* Spotlight Border Glow */}
              <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                style={{
                  background: useMotionTemplate`
                    radial-gradient(
                      350px circle at ${mouseX}px ${mouseY}px,
                      rgba(255,255,255,0.3),
                      transparent 40%
                    )
                  `,
                }}
              />

              <div className="relative w-full h-full rounded-[23px] bg-obsidian p-8 sm:p-10 z-10">
                <h3 className="text-2xl font-heading font-medium text-center mb-10">
                  Làm việc cùng chúng tôi
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 font-body text-[15px] text-white placeholder-ash focus:outline-none focus:border-white/40 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 font-body text-[15px] text-white placeholder-ash focus:outline-none focus:border-white/40 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 font-body text-[15px] text-white placeholder-ash focus:outline-none focus:border-white/40 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
                  />

                  {/* Custom Service Dropdown */}
                  <div ref={dropdownRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`w-full bg-white/[0.03] border rounded-2xl px-5 py-4 font-body text-[15px] text-left flex items-center justify-between transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] focus:outline-none ${
                        dropdownOpen ? "border-white/40" : "border-white/[0.08]"
                      } ${service ? "text-white" : "text-ash"}`}
                      data-cursor-hover
                    >
                      <span>{service || "Chọn dịch vụ"}</span>
                      <motion.svg
                        animate={{ rotate: dropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="text-ash flex-shrink-0 ml-2"
                      >
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/[0.1] rounded-2xl overflow-hidden z-50 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                        >
                          <div className="py-2 max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                            {SERVICE_OPTIONS.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => {
                                  setService(option);
                                  setDropdownOpen(false);
                                }}
                                className={`w-full text-left px-5 py-3 font-body text-[14px] transition-all duration-200 hover:bg-white/[0.06] ${
                                  service === option
                                    ? "text-white bg-white/[0.05]"
                                    : "text-ash hover:text-white"
                                }`}
                                data-cursor-hover
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <textarea
                    rows={4}
                    placeholder="Chúng tôi có thể giúp gì cho bạn?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 font-body text-[15px] text-white placeholder-ash focus:outline-none focus:border-white/40 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 resize-none"
                  />
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: submitState === "idle" ? 1.02 : 1 }}
                    whileTap={{ scale: submitState === "idle" ? 0.98 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    disabled={submitState !== "idle"}
                    className={`w-full py-4 mt-4 font-heading font-semibold text-[15px] rounded-2xl transition-all duration-300 ${
                      submitState === "success"
                        ? "bg-emerald-500 text-white"
                        : submitState === "error"
                        ? "bg-red-500 text-white"
                        : submitState === "sending"
                        ? "bg-white/50 text-black/50 cursor-wait"
                        : "bg-white text-black hover:bg-white-dim"
                    }`}
                    data-cursor-hover
                  >
                    {submitState === "sending" && "Đang gửi..."}
                    {submitState === "success" && "✓ Đã gửi thành công!"}
                    {submitState === "error" && "Có lỗi xảy ra, thử lại"}
                    {submitState === "idle" && "Gửi Tin Nhắn"}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-6">
            <Link href="/" className="relative h-10 md:h-12 w-48 md:w-56 shrink-0" data-cursor-hover>
              <Image
                src="/logo-hugs-black.png"
                alt="HUGs STUDIO Logo"
                fill
                className="object-contain object-left"
              />
            </Link>

            <span className="font-body text-sm text-ash md:absolute md:left-1/2 md:-translate-x-1/2 whitespace-nowrap">
              © 2024 HUGs Studio — All rights reserved
            </span>

            <span className="font-body text-sm text-ash shrink-0 hidden md:block">
              Created by HUGs
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
