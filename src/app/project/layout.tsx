import Footer from "@/components/Footer";

/**
 * Layout for /project routes — shares Navbar, Footer, and CustomCursor
 * with the main page for visual consistency.
 */
export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  );
}
