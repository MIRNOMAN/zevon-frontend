"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  TrendingUp,
  ArrowRight,
  CornerDownLeft,
  Loader2,
  Package,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useGetProductsQuery } from "@/redux/api/productApi";
import { FEATURED_PRODUCTS } from "@/components/home/homeData";
import type { Product } from "@/features/products";
import { useTranslation, formatPrice, getCategoryI18nName, toBengaliDigits } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { t, language, isBn } = useTranslation();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounce user input to optimize backend requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 200);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch real-time products matching search from backend
  const {
    data: searchData,
    isLoading: isSearching,
    isFetching,
  } = useGetProductsQuery(
    {
      search: debouncedQuery,
      limit: 8,
      isPublished: true,
    },
    {
      skip: !debouncedQuery,
    }
  );

  // Combine backend search results + local featured catalog matches
  const productsList = useMemo((): Product[] => {
    if (!debouncedQuery) return [];

    const serverProducts: Product[] = searchData?.products || [];
    const q = debouncedQuery.toLowerCase();

    // Find any local featured matches
    const localMatches: Product[] = FEATURED_PRODUCTS.filter((p) => {
      return (
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.colors?.some((c) => c.name.toLowerCase().includes(q))
      );
    }).map((p) => {
      const generatedSlug = p.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      return {
        id: p.id,
        title: p.name,
        name: p.name,
        slug: generatedSlug,
        description: p.description,
        basePrice: p.price,
        discountPrice: p.originalPrice ? p.price : null,
        price: p.price,
        category: {
          id: p.category,
          name: p.subcategory || p.category,
          slug: p.subcategory
            ? p.subcategory.toLowerCase().replace(/[^a-z0-9]+/g, "-")
            : p.category,
        },
        images: p.images,
        primaryImage: { url: p.images[0], isPrimary: true },
        inStock: p.inStock,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Product;
    });

    // Merge unique by slug or title
    const combined = [...serverProducts];
    for (const item of localMatches) {
      const exists = combined.some(
        (cp) =>
          cp.slug === item.slug ||
          cp.title?.toLowerCase().trim() === item.title?.toLowerCase().trim() ||
          cp.id === item.id
      );
      if (!exists) {
        combined.push(item);
      }
    }

    return combined;
  }, [debouncedQuery, searchData]);

  const hasQuery = debouncedQuery.length > 0;
  const isBusy = isSearching || isFetching;

  // Focus input on open & lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setDebouncedQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    router.push(`/shop?search=${encodeURIComponent(tag)}`);
    onClose();
  };

  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`);
    onClose();
  };

  // Helper to extract image URL safely
  const getProductImageUrl = (p: Product) => {
    if (p.primaryImage?.url) return p.primaryImage.url;
    if (p.images && p.images.length > 0) {
      const first = p.images[0];
      if (typeof first === "string") return first;
      if (first && typeof first === "object" && "url" in first) return first.url;
    }
    if (p.image) return p.image;
    return "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80";
  };

  const getProductCategoryName = (p: Product) => {
    if (p.category && typeof p.category === "object") {
      return getCategoryI18nName(p.category.slug, p.category.name, t);
    }
    if (typeof p.category === "string") {
      return getCategoryI18nName(p.category, p.category, t);
    }
    return p.gender || (isBn ? "পোশাক" : "Apparel");
  };

  const trendingTags = isBn
    ? ["হেভিওয়েট টি-শার্ট", "কার্গো প্যান্ট", "ওভারসাইজড হুডি", "ড্রপ শোল্ডার", "ক্যাপ ও টুপি", "উইমেন কো-অর্ড"]
    : ["Heavyweight Tee", "Cargo Pants", "Oversized Hoodie", "Drop Shoulder", "Caps & Beanies", "Women's Co-ords"];

  const popularCategories = [
    { name: t("categories.menTshirts", "Graphic T-Shirts"), href: "/shop?category=men-t-shirts" },
    { name: t("categories.menHoodies", "Heavyweight Hoodies"), href: "/shop?category=men-hoodies" },
    { name: t("categories.menPants", "Utility Cargo Pants"), href: "/shop?category=men-pants" },
    { name: t("categories.womenCoords", "Women's Co-ords"), href: "/shop?category=women-coords" },
    { name: t("categories.accessoriesCaps", "Caps & Headwear"), href: "/shop?category=caps-headwear" },
    { name: isBn ? "নতুন ড্রপস ২০২৬" : "New Drops 2026", href: "/shop?filter=new" },
  ];

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4 overflow-hidden transition-all duration-250",
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      )}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-250 ease-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal Dialog with smooth scale transition */}
      <div
        className={cn(
          "relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 z-10 flex flex-col max-h-[85vh] transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2"
        )}
      >
        {/* Search Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-800/90 bg-transparent shrink-0"
        >
          {isBusy ? (
            <Loader2 className="h-5 w-5 text-neutral-400 dark:text-neutral-500 shrink-0 ml-1 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-neutral-400 dark:text-neutral-500 shrink-0 ml-1" />
          )}
          <input
            ref={inputRef}
            type="text"
            suppressHydrationWarning
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder", "Search collections, apparel, accessories...")}
            style={{ outline: "none", border: "none", boxShadow: "none" }}
            className="w-full bg-transparent px-3.5 py-1 text-base sm:text-lg font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 shadow-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mr-1 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors focus:outline-none shrink-0"
          >
            <span>ESC</span>
          </button>
        </form>

        {/* Dynamic Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* CASE 1: Active Live Product Results from Backend */}
          {hasQuery && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
                <div className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
                  <span>
                    {t("search.matchingProducts", "Matching Products")}
                    {productsList.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px]">
                        {isBn ? toBengaliDigits(productsList.length) : productsList.length}
                      </span>
                    )}
                  </span>
                </div>
                {isBusy && (
                  <span className="text-[11px] font-normal text-neutral-400 dark:text-neutral-500">
                    {t("search.searching", "Searching...")}
                  </span>
                )}
              </div>

              {/* Product Live Matches List */}
              {productsList.length > 0 ? (
                <div className="space-y-2">
                  {productsList.map((product) => {
                    const imgUrl = getProductImageUrl(product);
                    const categoryName = getProductCategoryName(product);
                    const price = product.discountPrice || product.basePrice || product.price || 0;
                    const originalPrice = product.discountPrice ? (product.basePrice || product.price) : undefined;

                    return (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.slug)}
                        className="group flex items-center justify-between p-2.5 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/30 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 transition-all cursor-pointer"
                      >
                        {/* Left: Product Thumbnail & Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0 border border-neutral-200/60 dark:border-neutral-700/60">
                            <img
                              src={imgUrl}
                              alt={product.title || product.name || "Product"}
                              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>

                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block truncate">
                              {categoryName}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate group-hover:text-neutral-950 dark:group-hover:text-white">
                              {product.title || product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-extrabold text-neutral-900 dark:text-white">
                                {formatPrice(price, language as "en" | "bn")}
                              </span>
                              {originalPrice && (
                                <span className="text-[11px] text-neutral-400 line-through">
                                  {formatPrice(originalPrice, language as "en" | "bn")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Quick Action View */}
                        <div className="flex items-center gap-2 shrink-0 pl-2">
                          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                            <span>{isBn ? "দেখুন" : "View"}</span>
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                          </span>
                          <div className="h-7 w-7 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-950 transition-colors shadow-xs">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* "View All Results" Direct Action Link */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full mt-3 py-2.5 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold tracking-wide flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                  >
                    <span>
                      {t("search.viewAllResults", "View all results for")} &ldquo;{debouncedQuery}&rdquo;
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : !isBusy ? (
                /* No Results Found State */
                <div className="text-center py-8 space-y-2">
                  <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mx-auto">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {t("search.noResults", "No products found for")} &ldquo;{debouncedQuery}&rdquo;
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                    {t(
                      "search.noResultsDesc",
                      "Try searching with broader terms like 'tee', 'hoodie', 'cargos', or 'black'."
                    )}
                  </p>
                </div>
              ) : (
                /* Loading Skeleton */
                <div className="space-y-2 py-2">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="flex items-center gap-3 p-2.5 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 animate-pulse"
                    >
                      <div className="h-14 w-14 rounded-xl bg-neutral-200 dark:bg-neutral-700" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
                        <div className="h-4 w-40 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CASE 2: Default Suggested Trending Tags */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{t("search.trending", "Trending Searches")}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-all duration-150"
                >
                  <span>{tag}</span>
                  <ArrowRight className="h-3 w-3 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {/* Popular Categories */}
          <div className="border-t border-neutral-100 dark:border-neutral-800/80 pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-2.5">
              {t("search.popularCategories", "Popular Categories")}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {popularCategories.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 text-left hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-all group"
                >
                  <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white">
                    {item.name}
                  </span>
                  <CornerDownLeft className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-950/40 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500 shrink-0">
          <span>{isBn ? "অনুসন্ধান করতে Enter চাপুন" : "Press Enter to search"}</span>
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>ZEVON Live Catalog</span>
          </span>
        </div>
      </div>
    </div>
  );
}
