"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import type { Category } from "@/features/categories";

const DEFAULT_LOOKBOOK_CATEGORIES: Category[] = [
  {
    id: "men",
    name: "Men's Streetwear",
    slug: "men",
    description: "380 GSM Drop-Shoulder Tees, Cargos & Hoodies",
    imageUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80",
    sortOrder: 1,
    isActive: true,
    _count: { products: 4 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "women",
    name: "Women's Minimalist Co-ords",
    slug: "women",
    description: "Two-Piece Knit Sets, Wide Leg Trousers & Ribbed Tops",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
    sortOrder: 2,
    isActive: true,
    _count: { products: 4 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "outerwear",
    name: "Tailored Outerwear & Jackets",
    slug: "outerwear",
    description: "Minimalist Blazers, Structured Trench & Bombers",
    imageUrl:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&auto=format&fit=crop&q=80",
    sortOrder: 3,
    isActive: true,
    _count: { products: 1 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "accessories",
    name: "Architectural Accessories",
    slug: "accessories",
    description: "Leather Goods, Silver Jewelry & Canvas Caps",
    imageUrl:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=900&auto=format&fit=crop&q=80",
    sortOrder: 4,
    isActive: true,
    _count: { products: 1 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const FALLBACK_IMAGES: Record<string, string> = {
  men: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80",
  women: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
  outerwear: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&auto=format&fit=crop&q=80",
  accessories: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=900&auto=format&fit=crop&q=80",
};

export function CategoryLookbook() {
  const { data: serverCategories, isLoading } = useGetCategoriesQuery({
    onlyRoot: true,
  });

  const categories =
    serverCategories && serverCategories.length > 0
      ? serverCategories
      : DEFAULT_LOOKBOOK_CATEGORIES;

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Curated Collections</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
              EXPLORE BY CATEGORY
            </h2>
          </div>
          <p className="mt-2 sm:mt-0 text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
            Discover tailored drops, oversized essentials, and curated streetwear aesthetic.
          </p>
        </div>

        {/* Bento / Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {categories.map((category, index) => {
            const isSpan7 = index % 4 === 0 || index % 4 === 3;
            const isTall = index % 4 === 0 || index % 4 === 1;
            const imageUrl =
              category.imageUrl ||
              FALLBACK_IMAGES[category.slug] ||
              FALLBACK_IMAGES["men"]!;

            const fallbackCount =
              DEFAULT_LOOKBOOK_CATEGORIES.find((f) => f.slug === category.slug)?._count?.products ?? 0;
            const count =
              typeof category._count?.products === "number"
                ? category._count.products
                : fallbackCount;

            const categoryHref =
              category.slug === "men"
                ? "/men"
                : category.slug === "women"
                ? "/women"
                : `/shop?category=${category.slug}`;

            return (
              <Link
                key={category.id}
                href={categoryHref}
                className={`group relative ${
                  isSpan7 ? "md:col-span-7" : "md:col-span-5"
                } ${
                  isTall ? "h-[26rem] sm:h-[30rem]" : "h-[22rem] sm:h-[24rem]"
                } rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-lg block`}
              >
                <img
                  src={imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Badges and Info */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-xs">
                      {count} {count === 1 ? "Item" : "Items"}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-950 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-white">
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-xs sm:text-sm text-neutral-300 line-clamp-1 font-medium">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
