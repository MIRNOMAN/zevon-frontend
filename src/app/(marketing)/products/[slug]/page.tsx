import type { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect, RedirectType } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getProductBySlug, getProducts } from "@/features/products";
import { ProductDetailView } from "@/components/products/ProductDetailView";

type Props = {
  params: Promise<{ slug: string }>;
};

const DISCONTINUED_SLUGS = new Set([
  "monochrome-heavy-knit-co-ord-set",
  "vintage-washed-canvas-distressed-dad-cap",
  "monochrome-ribbed-knit-two-piece-co-ord",
  "high-waisted-tailored-pleated-trousers",
  "280-gsm-acid-washed-boxy-tee",
  "structured-oversized-trench-coat",
  "$",
  "%24",
]);

// ---------------------------------------------------------------------------
// Dynamic Metadata (SEO, OpenGraph, Twitter, Canonical Tag)
// ---------------------------------------------------------------------------

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  if (DISCONTINUED_SLUGS.has(slug)) {
    redirect("/shop", RedirectType.replace);
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | ZEVON",
      alternates: {
        canonical: `/products/${encodeURIComponent(slug)}`,
      },
    };
  }

  const previousImages = (await parent).openGraph?.images ?? [];
  const displayName = product.title || product.name || "ZEVON Apparel";
  const displayImage =
    product.image ||
    (typeof product.images?.[0] === "object"
      ? (product.images[0] as any)?.url
      : product.images?.[0]) ||
    "";

  const canonicalPath = `/products/${product.slug || slug}`;

  return {
    title: `${displayName} | ZEVON`,
    description: product.description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${displayName} | ZEVON ARCHIVE`,
      description: product.description,
      url: `${siteConfig.url}${canonicalPath}`,
      siteName: siteConfig.shortName,
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
// Page Component
// ---------------------------------------------------------------------------

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  if (DISCONTINUED_SLUGS.has(slug)) {
    redirect("/shop", RedirectType.replace);
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch a couple related products
  let relatedProducts: any[] = [];
  try {
    const allProductsRes = await getProducts();
    relatedProducts = (allProductsRes.products || [])
      .filter((p) => p.slug !== product.slug)
      .slice(0, 4);
  } catch {
    // Ignore
  }

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}
