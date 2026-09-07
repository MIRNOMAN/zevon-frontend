import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* ── Sidebar ────────────────────────────────── */}
      <aside className="hidden w-64 shrink-0 border-r border-foreground/10 bg-foreground/[0.02] lg:block">
        <div className="flex h-16 items-center border-b border-foreground/10 px-6">
          <Link href="/" className="text-lg font-black tracking-wider uppercase">
            ZEVON
          </Link>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ── Main Content ───────────────────────────── */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-foreground/10 px-6">
          <h2 className="text-sm font-semibold text-foreground/50">
            Admin Console
          </h2>
          <Link
            href="/"
            className="text-xs font-bold text-foreground/70 hover:text-foreground transition-colors"
          >
            ← View Storefront
          </Link>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar navigation items
// ---------------------------------------------------------------------------

const sidebarLinks = [
  { icon: "🏠", label: "Overview", href: "/dashboard" },
  { icon: "🛒", label: "Abandoned Carts", href: "/dashboard/abandoned-carts" },
  { icon: "📦", label: "Products", href: "/dashboard" },
  { icon: "👥", label: "Customers", href: "/dashboard" },
  { icon: "📈", label: "Analytics", href: "/dashboard" },
  { icon: "⚙️", label: "Settings", href: "/dashboard" },
] as const;

