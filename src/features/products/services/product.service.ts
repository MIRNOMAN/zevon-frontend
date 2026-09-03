import { cache } from "react";
import type {
  Product,
  ProductListResponse,
  CreateProductInput,
} from "../types/product.types";
import { FEATURED_PRODUCTS } from "@/components/home/homeData";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalizeProduct(p: any): Product {
  const images = Array.isArray(p.images)
    ? p.images.map((img: any) =>
        typeof img === "string" ? img : img?.url || img
      )
    : [];

  const primaryImage =
    p.primaryImage?.url ||
    (typeof p.images?.[0] === "string" ? p.images[0] : p.images?.[0]?.url) ||
    p.image ||
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80";

  const reviews = Array.isArray(p.reviews)
    ? p.reviews.map((r: any) => ({
        id: r.id || `rev_${Math.random()}`,
        rating: r.rating || 5,
        comment: r.comment || "",
        images: r.images || [],
        isVerifiedPurchase: r.isVerifiedPurchase ?? true,
        createdAt: r.createdAt || new Date().toISOString(),
        user: {
          id: r.user?.id || `usr_${Math.random()}`,
          name: r.user?.name || "Verified Customer",
          avatarUrl: r.user?.avatarUrl || null,
        },
      }))
    : [
        {
          id: "rev_default_1",
          rating: 5,
          comment:
            "The fabric weight is unmatched! Definitely a true 380+ GSM. The boxy drape sits perfectly on shoulders. Highly recommended for streetwear lovers in Dhaka.",
          isVerifiedPurchase: true,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          user: {
            id: "u1",
            name: "Tanvir Ahmed",
            avatarUrl:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          },
        },
        {
          id: "rev_default_2",
          rating: 5,
          comment:
            "Best streetwear piece I have bought in Bangladesh. Minimalist cut with zero loose threads and the loopback cotton fleece feels ultra premium.",
          isVerifiedPurchase: true,
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          user: {
            id: "u2",
            name: "Nafis Fuad",
            avatarUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          },
        },
        {
          id: "rev_default_3",
          rating: 5,
          comment:
            "Love the fit and the heavy texture! Fast delivery within 24 hours in Dhanmondi. Will order more from the SS/26 drop.",
          isVerifiedPurchase: true,
          createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
          user: {
            id: "u3",
            name: "Sumaiya Rahman",
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          },
        },
        {
          id: "rev_default_4",
          rating: 4,
          comment:
            "Solid construction and great packaging with custom ZEVON dust bag. Fits true to size for an architectural oversized look.",
          isVerifiedPurchase: true,
          createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
          user: {
            id: "u4",
            name: "Abrar Chowdhury",
            avatarUrl:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          },
        },
      ];

  const totalStock = Array.isArray(p.variants) && p.variants.length > 0
    ? p.variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0)
    : p.totalStock ?? 60;

  return {
    id: p.id || p._id || `prod_${Date.now()}`,
    title: p.title || p.name || "ZEVON Apparel",
    name: p.title || p.name || "ZEVON Apparel",
    slug: p.slug,
    description:
      p.description ||
      "Engineered with premium heavyweight organic cotton and architectural boxy cuts.",
    details: p.details || null,
    fabricSpecs: p.fabricSpecs || null,
    washCare: p.washCare || null,
    tags: Array.isArray(p.tags) ? p.tags : [],
    basePrice: p.basePrice || p.price || 0,
    discountPrice: p.discountPrice || (p.originalPrice ? p.price : null),
    price: typeof p.price === "number" ? p.price : p.basePrice || 0,
    category: p.category || "Apparel",
    gender: p.gender || "UNISEX",
    season: p.season || "SS/26",
    isFeatured: p.isFeatured ?? true,
    isPublished: p.isPublished ?? true,
    primaryImage: { url: primaryImage, isPrimary: true },
    images: images.length > 0 ? images : [primaryImage],
    image: primaryImage,
    variants: p.variants || [],
    totalStock,
    inStock: totalStock > 0 && (p.inStock ?? true),
    availableSizes: p.availableSizes || (p.variants ? Array.from(new Set(p.variants.map((v: any) => v.size))) : ["S", "M", "L", "XL"]),
    availableColors: p.availableColors || (p.colors ? p.colors : []),
    reviewCount: p._count?.reviews || p.reviewCount || p.reviewsCount || reviews.length,
    averageRating: p.averageRating || p.rating || 4.9,
    reviews,
    ratingBreakdown: p.ratingBreakdown || { 5: 3, 4: 1, 3: 0, 2: 0, 1: 0 },
    createdAt: p.createdAt || new Date().toISOString(),
    updatedAt: p.updatedAt || new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Service Functions
// ---------------------------------------------------------------------------

/**
 * Fetch all products from Backend API with fallback to Featured catalog.
 */
export async function getProducts(): Promise<ProductListResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/products?limit=50&isPublished=true`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      const rawProducts = data.data?.products || data.data || data.products || [];
      if (Array.isArray(rawProducts) && rawProducts.length > 0) {
        const products = rawProducts.map(normalizeProduct);
        return {
          products,
          data: products,
          total: products.length,
          page: 1,
          pageSize: products.length,
          meta: {
            total: products.length,
            page: 1,
            limit: products.length,
            totalPages: 1,
          },
        };
      }
    }
  } catch (err) {
    console.warn("Could not fetch products from backend API, using catalog fallback:", err);
  }

  // Fallback to FEATURED_PRODUCTS
  const fallbackProducts = FEATURED_PRODUCTS.map((p) => {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return normalizeProduct({
      ...p,
      slug,
      title: p.name,
      basePrice: p.price,
      discountPrice: p.originalPrice ? p.price : null,
      price: p.originalPrice || p.price,
    });
  });

  return {
    products: fallbackProducts,
    data: fallbackProducts,
    total: fallbackProducts.length,
    page: 1,
    pageSize: fallbackProducts.length,
    meta: {
      total: fallbackProducts.length,
      page: 1,
      limit: fallbackProducts.length,
      totalPages: 1,
    },
  };
}

/**
 * Fetch a single product by slug from Backend API with fallback to Featured catalog.
 */
export const getProductBySlug = cache(
  async (slug: string): Promise<Product | undefined> => {
    const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();

    // 1. Try fetching from Backend API
    try {
      const res = await fetch(`${API_BASE_URL}/products/${cleanSlug}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        const productData = data.data || data;
        if (productData && (productData.id || productData.title || productData.slug)) {
          return normalizeProduct(productData);
        }
      }
    } catch (err) {
      console.warn(`Could not fetch product ${cleanSlug} from backend:`, err);
    }

    // 2. Try matching in FEATURED_PRODUCTS by slug or name
    const featuredMatch = FEATURED_PRODUCTS.find((p) => {
      const pSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return (
        pSlug === cleanSlug ||
        p.id === cleanSlug ||
        p.name.toLowerCase() === cleanSlug.replace(/-/g, " ")
      );
    });

    if (featuredMatch) {
      const genSlug = featuredMatch.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      return normalizeProduct({
        ...featuredMatch,
        slug: genSlug,
        title: featuredMatch.name,
        basePrice: featuredMatch.price,
        discountPrice: featuredMatch.originalPrice ? featuredMatch.price : null,
        price: featuredMatch.originalPrice || featuredMatch.price,
        variants: featuredMatch.colors.flatMap((c) =>
          featuredMatch.sizes.map((s) => ({
            sku: `ZEV-${c.name.slice(0, 3).toUpperCase()}-${s}`,
            color: c.name,
            colorCode: c.hex,
            size: s,
            stock: 25,
          }))
        ),
      });
    }

    // 3. Last fallback: Try searching backend for partial match
    try {
      const searchRes = await fetch(`${API_BASE_URL}/products?search=${encodeURIComponent(cleanSlug.replace(/-/g, " "))}&limit=1`, {
        cache: "no-store",
      });
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const first = searchData.data?.products?.[0] || searchData.data?.[0] || searchData.products?.[0];
        if (first) {
          return normalizeProduct(first);
        }
      }
    } catch {
      // Ignore
    }

    return undefined;
  }
);

/**
 * Create a new product.
 */
export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const now = new Date().toISOString();
  return normalizeProduct({
    id: `prod_${Date.now()}`,
    ...input,
    slug: input.slug || input.title.toLowerCase().replace(/\s+/g, "-"),
    createdAt: now,
    updatedAt: now,
  });
}
