import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getProductBySlug, getProducts } from "@/features/products";
import { ProductDetailView } from "@/components/products/ProductDetailView";

type Props = {
  params: Promise<{ slug: string }>;
};

// ---------------------------------------------------------------------------
// Dynamic Metadata (SEO, OpenGraph, Twitter)
// ---------------------------------------------------------------------------

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | ZEVON" };
  }

  const previousImages = (await parent).openGraph?.images ?? [];
  const displayName = product.title || product.name || "ZEVON Apparel";
  const displayImage =
    product.image ||
    (typeof product.images?.[0] === "object"
      ? (product.images[0] as any)?.url
      : product.images?.[0]) ||
    "";

  return {
    title: `${displayName} | ZEVON`,
    description: product.description,
    openGraph: {
      title: `${displayName} | ZEVON ARCHIVE`,
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
// Page Component
// ---------------------------------------------------------------------------

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
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
