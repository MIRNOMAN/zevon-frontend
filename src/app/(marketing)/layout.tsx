import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* ── Navigation ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/80 backdrop-blur-lg">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            Acme
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products/sample-product"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Products
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Dashboard
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Page Content ───────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-foreground/10 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-foreground/50">
            &copy; {new Date().getFullYear()} Acme Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
