import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingHomePage() {
  return (
    <>
      {/* ── Hero Section ─────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        {/* Gradient background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-foreground/[0.03] to-transparent"
        />

        <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:py-32 lg:py-40">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-foreground/50">
            Enterprise-grade platform
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Ship faster.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Scale smarter.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/60">
            The modern platform for high-performing teams. Build, deploy, and
            iterate on your products with confidence — backed by enterprise
            security and reliability.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/products/sample-product">
              <Button variant="outline" size="lg">
                View Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features Grid ────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-foreground/10 p-6 transition-colors hover:border-foreground/20 hover:bg-foreground/[0.02]"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 text-lg">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-foreground/60">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const features = [
  {
    icon: "⚡",
    title: "Blazing Fast",
    description:
      "Built on Next.js App Router with edge-first architecture for sub-100ms response times worldwide.",
  },
  {
    icon: "🔒",
    title: "Enterprise Security",
    description:
      "SOC 2 compliant with end-to-end encryption, SSO, and role-based access control out of the box.",
  },
  {
    icon: "📊",
    title: "Real-Time Analytics",
    description:
      "Track every metric that matters with built-in dashboards and custom reporting.",
  },
  {
    icon: "🧩",
    title: "Modular Architecture",
    description:
      "Feature-driven vertical slices keep your codebase clean, testable, and independently deployable.",
  },
  {
    icon: "🌍",
    title: "Global CDN",
    description:
      "Automatically deployed to 40+ edge locations for consistently fast experiences everywhere.",
  },
  {
    icon: "🔄",
    title: "CI/CD Built In",
    description:
      "Push-to-deploy with preview environments, automated testing, and rollback support.",
  },
] as const;
