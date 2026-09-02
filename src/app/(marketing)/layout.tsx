import { Navbar } from "@/components/navbar";

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
      <footer className="border-t border-neutral-200/80 dark:border-neutral-800 py-10 bg-neutral-50/50 dark:bg-neutral-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
            ZEVON APPAREL &amp; LIFESTYLE
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} ZEVON BD. All rights reserved. Premium Streetwear &amp; Everyday Essentials.
          </p>
        </div>
      </footer>
    </div>
  );
}
