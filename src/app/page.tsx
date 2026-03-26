import HeroSlider from "@/components/HeroSlider";
import MarqueeStrip from "@/components/MarqueeStrip";
import LogoMarquee from "@/components/LogoMarquee";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import NewsJournal from "@/components/NewsJournal";
import TeamSection from "@/components/TeamSection";
import ServiceSection from "@/components/ServiceSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main>
        {/* ═══ Hero Slider ═══ */}
        <HeroSlider />

        {/* ═══ Marquee Strip — Services ═══ */}
        <MarqueeStrip />

        {/* ═══ Logo Marquee — Partners ═══ */}
        <LogoMarquee direction="right" />

        {/* ═══ Featured Projects ═══ */}
        <ProjectsShowcase />

        {/* ═══ Services Accordion ═══ */}
        <ServiceSection />

        {/* ═══ Second Marquee — Different direction ═══ */}
        <MarqueeStrip
          items={[
            "Tận Tâm",
            "Sáng Tạo",
            "Chuyên Nghiệp",
            "Hiện Đại",
            "Uy Tín",
          ]}
          direction="right"
          speed="normal"
        />

        {/* ═══ Journal / News ═══ */}
        <NewsJournal />

        {/* ═══ Team Section ═══ */}
        <TeamSection />

        {/* ═══ Testimonials ═══ */}
        <TestimonialsSection />
      </main>

      {/* Footer with CTA + Contact Form */}
      <Footer />
    </>
  );
}
