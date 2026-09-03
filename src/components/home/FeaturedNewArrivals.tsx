"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Eye, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { FEATURED_PRODUCTS, Product } from "./homeData";
import { QuickViewModal } from "./QuickViewModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";

const DEFAULT_TABS = [
  { id: "all", label: "All Drops" },
  { id: "men", label: "Men's Streetwear" },
  { id: "women", label: "Women's Essentials" },
  { id: "accessories", label: "Accessories" },
  { id: "sale", label: "Sale Edition" },
];

export function FeaturedNewArrivals() {
  const { data: serverCategories } = useGetCategoriesQuery({ onlyRoot: true });

  const dynamicTabs = React.useMemo(() => {
    if (!serverCategories || serverCategories.length === 0) {
      return DEFAULT_TABS;
    }
    const catTabs = serverCategories.map((c) => ({
      id: c.slug,
      label: c.name,
    }));
    return [
      { id: "all", label: "All Drops" },
      ...catTabs,
      { id: "sale", label: "Sale Edition" },
    ];
  }, [serverCategories]);

  const [activeTab, setActiveTab] = useState("all");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlistMap, setWishlistMap] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = FEATURED_PRODUCTS.filter((product) => {
    if (activeTab === "all") return true;
    if (activeTab === "sale") return product.originalPrice !== undefined || product.badge === "SALE";
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
              <span>Seasonal Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
              NEW ARRIVALS &amp; BESTSELLERS
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
            const isWishlisted = !!wishlistMap[product.id];
            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-3 sm:p-4 shadow-xs hover:shadow-xl transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-950">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badges */}
                  {product.badge && (
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <Badge
                        variant={product.badge === "SALE" ? "sale" : "new"}
                        className="text-[10px] font-black uppercase px-2 py-0.5"
                      >
                        {product.badge}
                      </Badge>
                    </div>
                  )}

                  {/* Wishlist Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleWishlist(product.id, e)}
                    aria-label="Add to wishlist"
                    className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-neutral-600 dark:text-neutral-300 hover:text-rose-500 shadow-sm transition-all focus:outline-none"
                  >
                    <Heart className={cn("h-4 w-4", isWishlisted && "fill-rose-500 text-rose-500")} />
                  </button>

                  {/* Quick-View Overlay Action */}
                  <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hidden sm:flex gap-2">
                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(product)}
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
                      <span>{product.subcategory}</span>
                      {product.gsm && <span>{product.gsm}</span>}
                    </div>

                    <Link
                      href={`/shop/${product.category}/${product.id}`}
                      className="block text-xs sm:text-sm font-bold text-neutral-900 dark:text-white tracking-tight line-clamp-1 hover:underline"
                    >
                      {product.name}
                    </Link>

                    {/* Color Swatch Dots */}
                    {product.colors.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        {product.colors.map((c) => (
                          <span
                            key={c.name}
                            title={c.name}
                            className="h-2.5 w-2.5 rounded-full border border-black/10 dark:border-white/10"
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price & Add button */}
                  <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-extrabold text-neutral-950 dark:text-white">
                        ৳{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs font-medium text-neutral-400 line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(product)}
                      aria-label={`Buy ${product.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-colors focus:outline-none"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Collection Link */}
        <div className="mt-12 text-center">
          <Link href="/shop">
            <Button variant="outline" size="lg" className="font-bold tracking-wide gap-2 border-neutral-300 dark:border-neutral-700">
              View All 120+ Products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
