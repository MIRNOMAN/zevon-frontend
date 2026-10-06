"use client";

import Link from "next/link";
import type { Product } from "../types/product.types";
import { ProductCard3D, Product as Card3DProduct } from "@/components/products/ProductCard3D";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProductCardProps {
  product: Product;
}

// ---------------------------------------------------------------------------
// Component Adapter
// ---------------------------------------------------------------------------

export function ProductCard({ product }: ProductCardProps) {
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

  const originalPriceNum = product.discountPrice
    ? parseFloat(String(product.basePrice || 0))
    : undefined;

  const finalPrice = product.discountPrice
    ? parseFloat(String(product.discountPrice))
    : priceNum;

  const displayName = product.title || product.name || "Product";

  const primaryImgUrl =
    typeof product.primaryImage === "object" && product.primaryImage?.url
      ? product.primaryImage.url
      : typeof product.images?.[0] === "object" && (product.images[0] as any)?.url
      ? (product.images[0] as any).url
      : typeof product.images?.[0] === "string"
      ? product.images[0]
      : product.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";

  const secondaryImgUrl =
    typeof product.images?.[1] === "object" && (product.images[1] as any)?.url
      ? (product.images[1] as any).url
      : typeof product.images?.[1] === "string"
      ? product.images[1]
      : undefined;

  // Convert features product model to ProductCard3D props model
  const adaptedProduct: Card3DProduct = {
    id: product.id || product.slug || "prod-id",
    title: displayName,
    category: categoryName,
    price: finalPrice,
    originalPrice: originalPriceNum,
    rating: product.rating || product.averageRating || 4.8,
    reviewsCount: product.reviewCount || 42,
    image: primaryImgUrl,
    secondaryImage: secondaryImgUrl,
    badge: product.isFeatured ? "FEATURED" : undefined,
    isNew: true,
    inStock: product.inStock !== false,
    colors: product.availableColors?.map((c) => ({
      name: c.color,
      hex: c.colorCode || "#18181b",
    })),
  };

  return (
    <Link href={`/products/${product.slug}`} className="block h-full">
      <ProductCard3D product={adaptedProduct} />
    </Link>
  );
}
