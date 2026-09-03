import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getProductBySlug } from "@/features/products";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types — using the Next.js PageProps helper for this route
// ---------------------------------------------------------------------------

type Props = {
  params: Promise<{ slug: string }>;
};

// ---------------------------------------------------------------------------
// Dynamic Metadata (SEO, OpenGraph, Twitter)
// ---------------------------------------------------------------------------

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const previousImages = (await parent).openGraph?.images ?? [];
  const displayName = product.title || product.name || "Product";
  const displayImage =
    product.image ||
    (typeof product.images?.[0] === "object" ? product.images[0]?.url : product.images?.[0]) ||
    "";

  return {
    title: displayName,
    description: product.description,
    openGraph: {
      title: displayName,
      description: product.description,
      url: `${siteConfig.url}/products/${product.slug}`,
      siteName: siteConfig.name,
      images: [
        {
          url: displayImage,
          width: 1200,
          height: 630,
          alt: displayName,
        },
        ...previousImages,
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: displayName,
      description: product.description,
      images: [displayImage],
    },
  };
}

// ---------------------------------------------------------------------------
// Static Params (for SSG / ISR)
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  // In a real app, fetch all product slugs from your API/DB.
  // For this starter, we provide a sample slug.
  return [{ slug: "sample-product" }];
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const displayName = product.title || product.name || "Product";
  const categoryName =
    typeof product.category === "object"
      ? product.category?.name
      : product.category || "Apparel";

  const priceNum =
    typeof product.price === "number"
      ? product.price
      : typeof product.basePrice === "number"
      ? product.basePrice
      : parseFloat(String(product.basePrice || 0));

  const displayImage =
    product.image ||
    (typeof product.images?.[0] === "object" ? product.images[0]?.url : product.images?.[0]);

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      {/* ── Breadcrumbs ────────────────────────────── */}
      <nav className="mb-8 text-sm text-foreground/50">
        <span>Home</span>
        <span className="mx-2">/</span>
        <span>Products</span>
        <span className="mx-2">/</span>
        <span className="text-foreground">{displayName}</span>
      </nav>

      {/* ── Product Detail ─────────────────────────── */}
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-foreground/5 overflow-hidden">
          {displayImage ? (
            <img
              src={displayImage}
              alt={displayName}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <span className="text-6xl">📦</span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <span className="mb-2 inline-block w-fit rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium uppercase tracking-wider">
            {categoryName}
          </span>
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {displayName}
          </h1>
          <p className="mb-6 text-lg leading-relaxed text-foreground/60">
            {product.description}
          </p>
          <p className="mb-8 text-2xl font-semibold">
            ৳{priceNum.toLocaleString()}
          </p>
          <div className="flex gap-4">
            <Button size="lg">Add to Cart</Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
