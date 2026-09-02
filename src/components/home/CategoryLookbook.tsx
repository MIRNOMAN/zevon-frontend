"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { LOOKBOOK_CATEGORIES } from "./homeData";

const LOOKBOOK_IMAGES: Record<string, string> = {
  "men-oversized":
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80",
  "women-coords":
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
  "outerwear-drop":
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&auto=format&fit=crop&q=80",
  "lifestyle-accessories":
    "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=900&auto=format&fit=crop&q=80",
};

export function CategoryLookbook() {
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
          {/* Item 1: Large Men's Heavyweight Streetwear (md:col-span-7) */}
          {LOOKBOOK_CATEGORIES[0] && (
            <Link
              href={LOOKBOOK_CATEGORIES[0].href}
              className="group relative md:col-span-7 h-[26rem] sm:h-[30rem] rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-lg block"
            >
              <img
                src={LOOKBOOK_IMAGES[LOOKBOOK_CATEGORIES[0].id]}
                alt={LOOKBOOK_CATEGORIES[0].title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Badges and Info */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {LOOKBOOK_CATEGORIES[0].itemCount} Styles
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-950 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-1.5 text-white">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {LOOKBOOK_CATEGORIES[0].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 line-clamp-1 font-medium">
                    {LOOKBOOK_CATEGORIES[0].subtitle}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Item 2: Women's Co-ords (md:col-span-5) */}
          {LOOKBOOK_CATEGORIES[1] && (
            <Link
              href={LOOKBOOK_CATEGORIES[1].href}
              className="group relative md:col-span-5 h-[26rem] sm:h-[30rem] rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-lg block"
            >
              <img
                src={LOOKBOOK_IMAGES[LOOKBOOK_CATEGORIES[1].id]}
                alt={LOOKBOOK_CATEGORIES[1].title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {LOOKBOOK_CATEGORIES[1].itemCount} Styles
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-950 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-1.5 text-white">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {LOOKBOOK_CATEGORIES[1].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 line-clamp-1 font-medium">
                    {LOOKBOOK_CATEGORIES[1].subtitle}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Item 3: Outerwear (md:col-span-5) */}
          {LOOKBOOK_CATEGORIES[2] && (
            <Link
              href={LOOKBOOK_CATEGORIES[2].href}
              className="group relative md:col-span-5 h-[22rem] sm:h-[24rem] rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-lg block"
            >
              <img
                src={LOOKBOOK_IMAGES[LOOKBOOK_CATEGORIES[2].id]}
                alt={LOOKBOOK_CATEGORIES[2].title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {LOOKBOOK_CATEGORIES[2].itemCount} Styles
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-950 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-1 text-white">
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    {LOOKBOOK_CATEGORIES[2].title}
                  </h3>
                  <p className="text-xs text-neutral-300 line-clamp-1 font-medium">
                    {LOOKBOOK_CATEGORIES[2].subtitle}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Item 4: Caps & Lifestyle Gear (md:col-span-7) */}
          {LOOKBOOK_CATEGORIES[3] && (
            <Link
              href={LOOKBOOK_CATEGORIES[3].href}
              className="group relative md:col-span-7 h-[22rem] sm:h-[24rem] rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-lg block"
            >
              <img
                src={LOOKBOOK_IMAGES[LOOKBOOK_CATEGORIES[3].id]}
                alt={LOOKBOOK_CATEGORIES[3].title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {LOOKBOOK_CATEGORIES[3].itemCount} Styles
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-950 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-1 text-white">
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    {LOOKBOOK_CATEGORIES[3].title}
                  </h3>
                  <p className="text-xs text-neutral-300 line-clamp-1 font-medium">
                    {LOOKBOOK_CATEGORIES[3].subtitle}
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
