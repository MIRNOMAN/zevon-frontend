import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ── Navigation ─────────────────────────────────────── */}
      <Navbar />

      {/* ── Page Content ───────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
