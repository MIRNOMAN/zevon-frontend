"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { FEATURED_PRODUCTS, Product } from "./homeData";
import { QuickViewModal } from "./QuickViewModal";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { useGetProductsQuery } from "@/redux/api/productApi";
import { useTranslation, useCurrency, getCategoryI18nName } from "@/lib/i18n";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard3D, Product as Card3DProduct } from "@/components/products/ProductCard3D";

export function FeaturedNewArrivals() {
  const { t, isBn } = useTranslation();
  const { formatPrice } = useCurrency();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { data: serverCategories } = useGetCategoriesQuery({ onlyRoot: true });
  const { data: serverProductsData } = useGetProductsQuery({ limit: 12 });

  const dynamicTabs = useMemo(() => {
    if (!serverCategories || serverCategories.length === 0) {
      return [
        { id: "all", label: t("home.allDropsTab", "All Drops") },
        { id: "men", label: t("nav.men", "Men") },
        { id: "women", label: t("nav.women", "Women") },
        { id: "accessories", label: t("nav.accessories", "Accessories") },
        { id: "sale", label: t("home.saleEditionTab", "Sale Edition") },
      ];
    }
    const catTabs = serverCategories.map((c) => ({
      id: c.slug,
      label: getCategoryI18nName(c.slug, c.name, t),
    }));
    return [
      { id: "all", label: t("home.allDropsTab", "All Drops") },
      ...catTabs,
      { id: "sale", label: t("home.saleEditionTab", "Sale Edition") },
    ];
  }, [serverCategories, t]);

  const [activeTab, setActiveTab] = useState("all");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Map server products or fallback to FEATURED_PRODUCTS
  const displayProducts: Product[] = useMemo(() => {
    if (serverProductsData?.products && serverProductsData.products.length > 0) {
      return serverProductsData.products.map((p) => {
        const primaryImgUrl =
          typeof p.primaryImage === "object" && p.primaryImage?.url
            ? p.primaryImage.url
            : typeof p.images?.[0] === "object" && (p.images[0] as any)?.url
            ? (p.images[0] as any).url
            : typeof p.images?.[0] === "string"
            ? p.images[0]
            : "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";

        const allImages =
          p.images && p.images.length > 0
            ? p.images.map((img: any) => (typeof img === "object" && img?.url ? img.url : String(img)))
            : [primaryImgUrl];

        const secImgUrl = allImages[1] || undefined;
        const catName =
          typeof p.category === "object" ? p.category?.name || "Apparel" : String(p.category || "Apparel");

        const categoryGroup: "men" | "women" | "accessories" =
          p.gender === "women" ? "women" : p.gender === "accessories" ? "accessories" : "men";

        const badgeType: "NEW" | "SALE" | "HOT" | "LIMITED" | undefined = p.isFeatured
          ? "HOT"
          : p.discountPrice
          ? "SALE"
          : "NEW";

        return {
          id: p.id || p.slug || "prod-id",
          name: p.title || p.name || "Streetwear Drop",
          category: categoryGroup,
          subcategory: catName,
          price: Number(p.discountPrice || p.basePrice || 2500),
          originalPrice: p.discountPrice ? Number(p.basePrice) : undefined,
          images: [primaryImgUrl, ...(secImgUrl ? [secImgUrl] : [])],
          badge: badgeType,
          colors:
            p.availableColors && p.availableColors.length > 0
              ? p.availableColors.map((c) => ({ name: c.color, hex: c.colorCode || "#18181b" }))
              : [
                  { name: "Black", hex: "#18181b" },
                  { name: "Off-White", hex: "#f5f5f4" },
                ],
          sizes: p.availableSizes || ["S", "M", "L", "XL"],
          rating: p.rating || p.averageRating || 4.9,
          reviewsCount: p.reviewCount || 34,
          description: p.description || p.title || "Architectural streetwear drop.",
          inStock: p.inStock !== false,
          gsm: p.fabricSpecs || "380 GSM",
          rawProduct: p,
        };
      });
    }

    return FEATURED_PRODUCTS;
  }, [serverProductsData]);

  const filteredProducts = displayProducts.filter((product) => {
    if (activeTab === "all") return true;
    if (activeTab === "sale")
      return product.originalPrice !== undefined || product.badge === "SALE";
    return product.category === activeTab;
  });

  return (
    <section className="py-16 sm:py-24 bg-neutral-50/50 dark:bg-neutral-950/30 border-y border-neutral-200/80 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-rose-500" />
              <span>{isBn ? "সিজনাল সিলেকশন" : "Seasonal Selection"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
              {t("home.arrivalsTitle", "NEW ARRIVALS & BESTSELLERS")}
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="mt-4 md:mt-0 flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {dynamicTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 focus-visible:outline-none ${
                    isActive
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm"
                      : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Product Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const productSlug =
              product.rawProduct?.slug ||
              product.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

            const card3DData: Card3DProduct = {
              id: product.id || productSlug,
              title: product.name,
              brand: "ZEVON BD",
              category: product.subcategory,
              price: product.price,
              originalPrice: product.originalPrice,
              rating: product.rating,
              reviewsCount: product.reviewsCount,
              image: product.images[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
              secondaryImage: product.images[1],
              badge: product.badge,
              isNew: product.badge === "NEW",
              inStock: product.inStock,
              colors: product.colors,
            };

            return (
              <Link key={product.id} href={`/products/${productSlug}`} className="block">
                <ProductCard3D
                  product={card3DData}
                  maxTiltAngle={14}
                  perspective={1000}
                  onQuickView={() => setQuickViewProduct(product)}
                  onWishlistToggle={() => {
                    toggleWishlist({
                      id: product.id || productSlug,
                      title: product.name,
                      name: product.name,
                      slug: productSlug,
                      price: product.price,
                      basePrice: product.originalPrice || product.price,
                      discountPrice: product.originalPrice ? product.price : null,
                      image: product.images[0],
                      category: product.category,
                    });
                  }}
                />
              </Link>
            );
          })}
        </div>

        {/* Explore All Link */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold tracking-wide hover:opacity-90 transition-opacity shadow-md"
          >
            <span>{t("home.viewAllProducts", "Explore All Drops")}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
}
