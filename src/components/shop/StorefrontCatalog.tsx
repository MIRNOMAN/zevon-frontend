"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import {
  Heart,
  Eye,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Loader2,
  PackageOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuickViewModal } from "@/components/home/QuickViewModal";
import { useGetProductsQuery } from "@/redux/api/productApi";
import type { Product as BackendProduct } from "@/features/products";
import type { Product as HomeProduct } from "@/components/home/homeData";
import { cn } from "@/lib/utils";
import { useTranslation, useCurrency, getCategoryI18nName } from "@/lib/i18n";
import { useSearchParams, useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";

interface SubCategoryFilter {
  name: string;
  slug: string;
}

export interface StorefrontCatalogProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  categorySlug?: string;
  gender?: "MEN" | "WOMEN" | "UNISEX";
  initialSubCategory?: string;
  subCategories?: SubCategoryFilter[];
}

function StorefrontCatalogContent({
  title,
  subtitle,
  description,
  badge = "SS/26 Collection",
  categorySlug,
  gender,
  initialSubCategory,
  subCategories = [],
}: StorefrontCatalogProps) {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(initialSubCategory || "all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [quickViewProduct, setQuickViewProduct] = useState<HomeProduct | null>(null);

  const displaySubtitle = subtitle || description;

  // Query parameters
  const queryParams = {
    gender: gender,
    categorySlug: selectedSubCategory !== "all" ? selectedSubCategory : categorySlug,
    sortBy: sortBy,
    limit: 40,
  };

  const { data, isLoading, isFetching } = useGetProductsQuery(queryParams);

  const products = data?.products || [];

  const handleToggleWishlist = (p: BackendProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const primaryImgUrl =
      typeof p.primaryImage === "object" && p.primaryImage?.url
        ? p.primaryImage.url
        : typeof p.images[0] === "object" && p.images[0]?.url
        ? p.images[0].url
        : typeof p.images[0] === "string"
        ? p.images[0]
        : "";

    toggleWishlist({
      id: p.id,
      title: p.title,
      name: p.title,
      slug: p.slug,
      price: p.discountPrice || p.basePrice || 0,
      basePrice: p.basePrice,
      discountPrice: p.discountPrice,
      image: primaryImgUrl,
      category: p.category,
    });
  };

  // Adapt backend product to QuickViewModal format if needed
  const handleOpenQuickView = (p: BackendProduct) => {
    const primaryImgUrl =
      typeof p.primaryImage === "object" && p.primaryImage?.url
        ? p.primaryImage.url
        : typeof p.images[0] === "object" && p.images[0]?.url
        ? p.images[0].url
        : typeof p.images[0] === "string"
        ? p.images[0]
        : "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80";

    const allImgUrls = p.images.map((img) =>
      typeof img === "object" && img?.url ? img.url : String(img)
    );

    const baseP = typeof p.basePrice === "number" ? p.basePrice : parseFloat(String(p.basePrice)) || 0;
    const discP = p.discountPrice ? (typeof p.discountPrice === "number" ? p.discountPrice : parseFloat(String(p.discountPrice))) : undefined;

    const adapted: HomeProduct = {
      id: p.id,
      name: p.title || p.name || "Product",
      category: (p.gender?.toLowerCase() as "men" | "women" | "accessories") || "men",
      subcategory: typeof p.category === "object" ? p.category?.name || "Apparel" : String(p.category || "Apparel"),
      price: discP ? discP : baseP,
      originalPrice: discP ? baseP : undefined,
      rating: 4.9,
      reviewsCount: p.reviewCount || 12,
      badge: discP ? "SALE" : p.isFeatured ? "NEW" : undefined,
      images: allImgUrls.length > 0 ? allImgUrls : [primaryImgUrl],
      colors: p.availableColors?.map((c) => ({ name: c.color, hex: c.colorCode })) || [
        { name: "Onyx Black", hex: "#111111" },
      ],
      sizes: p.availableSizes || ["S", "M", "L", "XL"],
      gsm: p.fabricSpecs || "380 GSM",
      fit: "Relaxed Boxy",
      description: p.description,
      inStock: p.inStock ?? true,
      variants: p.variants,
      rawProduct: p,
    };

    setQuickViewProduct(adapted);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ── 1. Category Hero Banner ────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-foreground/10 bg-neutral-50/80 dark:bg-neutral-950/60 py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-neutral-300/40 via-neutral-100/30 to-transparent dark:from-neutral-900/60 dark:via-neutral-800/30 dark:to-transparent blur-3xl"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-4">
            <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-neutral-900 dark:text-white capitalize">
              {gender ? gender.toLowerCase() : "Catalog"}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-neutral-900 px-3 py-1 border border-neutral-200 dark:border-neutral-800 text-[11px] font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-3 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>{badge}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white uppercase">
                {title}
              </h1>

              {/* Subtitle */}
              {displaySubtitle && (
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl font-normal leading-relaxed">
                  {displaySubtitle}
                </p>
              )}
            </div>

            {/* Total count */}
            <div className="text-xs sm:text-sm font-semibold text-neutral-500 dark:text-neutral-400">
              {t("shop.showing", "Showing")}{" "}
              <span className="font-bold text-neutral-950 dark:text-white">
                {products.length}
              </span>{" "}
              {t("shop.styles", "styles")}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Filters & Sort Controls ─────────────────────────────── */}
      <section className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b border-foreground/10 py-3.5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Subcategory Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedSubCategory("all")}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 focus-visible:outline-none",
                selectedSubCategory === "all"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              {t("shop.allDrops", "All Drops")}
            </button>

            {subCategories.map((sub) => {
              const isSelected = selectedSubCategory === sub.slug;
              const subDisplayName = getCategoryI18nName(sub.slug, sub.name, t);
              return (
                <button
                  key={sub.slug}
                  type="button"
                  onClick={() => setSelectedSubCategory(sub.slug)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 focus-visible:outline-none",
                    isSelected
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  )}
                >
                  {subDisplayName}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-neutral-800 dark:text-neutral-200 border-0 focus:outline-none cursor-pointer"
            >
              <option value="newest" className="dark:bg-neutral-900">{t("shop.newestDrops", "Newest Drops")}</option>
              <option value="price_asc" className="dark:bg-neutral-900">{t("shop.priceLowHigh", "Price: Low to High")}</option>
              <option value="price_desc" className="dark:bg-neutral-900">{t("shop.priceHighLow", "Price: High to Low")}</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── 3. Product Catalog Grid ────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        {isLoading || isFetching ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-3xl bg-neutral-100 dark:bg-neutral-900 p-3 h-[22rem] sm:h-[26rem] flex flex-col justify-between border border-neutral-200/60 dark:border-neutral-800"
              >
                <div className="h-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
                <div className="space-y-2 mt-3">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-3/4" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
              <PackageOpen className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white">
              {t("shop.noProducts", "No products found in this category")}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
              {t("shop.noProductsDesc", "Check back soon for new SS/26 archive drops, or explore other collections.")}
            </p>
            <Button
              variant="outline"
              onClick={() => setSelectedSubCategory("all")}
              className="mt-2"
            >
              {t("shop.resetFilters", "Reset Filters")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
            {products.map((product) => {
              const primaryImgUrl =
                typeof product.primaryImage === "object" && product.primaryImage?.url
                  ? product.primaryImage.url
                  : typeof product.images[0] === "object" && product.images[0]?.url
                  ? product.images[0].url
                  : typeof product.images[0] === "string"
                  ? product.images[0]
                  : "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80";

              const basePriceNum =
                typeof product.basePrice === "number"
                  ? product.basePrice
                  : parseFloat(String(product.basePrice)) || 0;

              const discountPriceNum = product.discountPrice
                ? typeof product.discountPrice === "number"
                  ? product.discountPrice
                  : parseFloat(String(product.discountPrice))
                : undefined;

              const categoryName =
                typeof product.category === "object"
                  ? product.category?.name
                  : String(product.category || "Streetwear");

              const isWishlisted = isInWishlist(product.id) || (product.slug ? isInWishlist(product.slug) : false);

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-3 sm:p-4 shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-950">
                    <img
                      src={primaryImgUrl}
                      alt={product.title}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Badges */}
                    {discountPriceNum && (
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <Badge variant="sale" className="text-[10px] font-black uppercase px-2 py-0.5">
                          SALE
                        </Badge>
                      </div>
                    )}
                    {!discountPriceNum && product.isFeatured && (
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <Badge variant="new" className="text-[10px] font-black uppercase px-2 py-0.5">
                          NEW
                        </Badge>
                      </div>
                    )}

                    {/* Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(product, e)}
                      aria-label="Add to wishlist"
                      className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-neutral-600 dark:text-neutral-300 hover:text-rose-500 shadow-sm transition-all focus:outline-none"
                    >
                      <Heart className={cn("h-4 w-4", isWishlisted && "fill-rose-500 text-rose-500")} />
                    </button>

                    {/* Quick View Button */}
                    <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hidden sm:flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenQuickView(product)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md py-2.5 text-xs font-bold text-neutral-900 dark:text-white shadow-lg hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-colors focus:outline-none"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* Product Meta */}
                  <div className="mt-3.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                        <span className="line-clamp-1">{categoryName}</span>
                        {product.tags && product.tags[0] && <span>{product.tags[0]}</span>}
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className="block text-xs sm:text-sm font-bold text-neutral-900 dark:text-white tracking-tight line-clamp-1 hover:underline"
                      >
                        {product.title}
                      </Link>

                      {/* Color Swatch Dots */}
                      {product.availableColors && product.availableColors.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-1">
                          {product.availableColors.map((c) => (
                            <span
                              key={c.color}
                              title={c.color}
                              className="h-2.5 w-2.5 rounded-full border border-black/10 dark:border-white/10"
                              style={{ backgroundColor: c.colorCode }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-extrabold text-neutral-950 dark:text-white">
                          {formatPrice(discountPriceNum || basePriceNum)}
                        </span>
                        {discountPriceNum && (
                          <span className="text-xs text-neutral-400 line-through">
                            {formatPrice(basePriceNum)}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white group-hover:bg-neutral-950 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-950 transition-colors"
                        aria-label="View product"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}

export function StorefrontCatalog(props: StorefrontCatalogProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      }
    >
      <StorefrontCatalogContent {...props} />
    </Suspense>
  );
}
