"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Heart, Eye, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { FEATURED_PRODUCTS, Product } from "./homeData";
import { QuickViewModal } from "./QuickViewModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { useGetProductsQuery } from "@/redux/api/productApi";
import { useTranslation, useCurrency, getCategoryI18nName } from "@/lib/i18n";
import { useWishlist } from "@/context/WishlistContext";

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
          Array.isArray(p.images) && p.images.length > 0
            ? p.images.map((img: any) =>
                typeof img === "string" ? img : img?.url || primaryImgUrl
              )
            : [primaryImgUrl];

        const priceNum =
          typeof p.price === "number"
            ? p.price
            : Number(p.discountPrice || p.basePrice || 0);
        const originalPriceNum = p.discountPrice
          ? Number(p.basePrice || p.price)
          : undefined;
        const catSlug =
          typeof p.category === "object"
            ? p.category?.slug
            : String(p.category || "men");

        return {
          id: p.id,
          name: p.title || (p as any).name || "ZEVON Piece",
          category: (catSlug === "women"
            ? "women"
            : catSlug === "accessories"
            ? "accessories"
            : "men") as any,
          subcategory:
            typeof p.category === "object"
              ? p.category?.name || "Apparel"
              : "Apparel",
          price: priceNum,
          originalPrice: originalPriceNum,
          rating: 4.9,
          reviewsCount: 24,
          badge: p.discountPrice ? "SALE" : p.isFeatured ? "HOT" : "NEW",
          images: allImages,
          colors: [
            { name: "Onyx Black", hex: "#1c1917" },
            { name: "Off White", hex: "#f5f5f4" },
          ],
          sizes: ["S", "M", "L", "XL"],
          gsm: (p as any).fabricSpecs || "380 GSM",
          fit: "Oversized Boxy Fit",
          description:
            p.description ||
            "Premium streetwear garment crafted with heavyweight organic cotton.",
          inStock: (p.totalStock ?? 10) > 0,
          rawProduct: p,
        };
      });
    }
    return FEATURED_PRODUCTS;
  }, [serverProductsData]);

  const handleToggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const slug =
      product.rawProduct?.slug ||
      product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    toggleWishlist({
      id: product.id,
      title: product.name,
      name: product.name,
      slug,
      price: product.price,
      basePrice: product.originalPrice || product.price,
      discountPrice: product.originalPrice ? product.price : null,
      image: product.images[0],
      category: product.category,
    });
  };

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
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 focus-visible:outline-none",
                    isActive
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm"
                      : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => {
            const productSlug =
              product.rawProduct?.slug ||
              product.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

            const isWishlisted =
              isInWishlist(product.id) || isInWishlist(productSlug);

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-3 sm:p-4 shadow-xs hover:shadow-xl transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-950">
                  <Link href={`/products/${productSlug}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>

                  {/* Badges */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge
                        variant={product.badge === "SALE" ? "sale" : "new"}
                        className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5"
                      >
                        {product.badge === "SALE"
                          ? t("shop.saleBadge", "SALE")
                          : t("shop.newBadge", "NEW")}
                      </Badge>
                    </div>
                  )}

                  {/* Wishlist Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(product, e)}
                    aria-label="Add to wishlist"
                    className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-neutral-700 dark:text-neutral-300 hover:text-rose-500 transition-colors shadow-xs active:scale-90"
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isWishlisted && "fill-rose-500 text-rose-500 scale-110"
                      )}
                    />
                  </button>

                  {/* Quick-View Overlay Action */}
                  <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hidden sm:flex gap-2">
                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(product)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md py-2.5 text-xs font-bold text-neutral-900 dark:text-white shadow-lg hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-colors focus:outline-none"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {t("home.quickView", "Quick View")}
                    </button>
                  </div>
                </div>

                {/* Product Meta */}
                <div className="mt-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      <span>{product.subcategory}</span>
                      {product.gsm && <span>{product.gsm}</span>}
                    </div>

                    <Link
                      href={`/products/${productSlug}`}
                      className="block text-xs sm:text-sm font-bold text-neutral-900 dark:text-white tracking-tight line-clamp-1 hover:underline"
                    >
                      {product.name}
                    </Link>

                    {/* Color Swatch Dots */}
                    {product.colors.length > 0 && (
                      <div className="flex items-center gap-1 pt-0.5">
                        {product.colors.map((color, idx) => (
                          <span
                            key={idx}
                            title={color.name}
                            style={{ backgroundColor: color.hex }}
                            className="h-2.5 w-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 inline-block"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price Row */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-neutral-950 dark:text-white">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-neutral-400 line-through font-semibold">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                      ★ {product.rating} ({product.reviewsCount})
                    </span>
                  </div>
                </div>
              </div>
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
