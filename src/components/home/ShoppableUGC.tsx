"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight, Camera } from "lucide-react";
import { UGC_POSTS } from "./homeData";
import { useTranslation, useCurrency, toBengaliDigits } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const UGC_IMAGES: Record<string, string> = {
  "ugc-1":
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
  "ugc-2":
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
  "ugc-3":
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
  "ugc-4":
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
};

export function ShoppableUGC() {
  const { t, isBn } = useTranslation();
  const { formatPrice } = useCurrency();
  const [activePin, setActivePin] = useState<string | null>(null);

  return (
    <section className="py-16 sm:py-24 bg-neutral-50/50 dark:bg-neutral-950/30 border-t border-neutral-200/80 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">
              <Camera className="h-3.5 w-3.5 text-rose-500" />
              <span>{isBn ? "কমিউনিটি ও স্ট্রিট স্টাইল" : "Community & Street Style"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
              {isBn ? "কমিউনিটি আর্কাইভ #ZEVON_BD" : "TAGGED BY YOU #ZEVON_BD"}
            </h2>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 sm:mt-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white hover:opacity-80 transition-opacity"
          >
            <span>{isBn ? "ইনস্টাগ্রামে ফলো করুন @ZEVON_BD" : "Follow @ZEVON_BD on Instagram"}</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Shoppable Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {UGC_POSTS.map((post) => {
            const isPinActive = activePin === post.id;
            return (
              <div
                key={post.id}
                className="group relative rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Image Frame with Hotspot Pin */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950">
                  <img
                    src={UGC_IMAGES[post.id]}
                    alt={post.caption}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                  {/* Interactive Hotspot Pulsating Pin */}
                  <div
                    className="absolute z-20 cursor-pointer"
                    style={{
                      left: `${post.taggedProduct.x}%`,
                      top: `${post.taggedProduct.y}%`,
                    }}
                    onClick={() => setActivePin(isPinActive ? null : post.id)}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-white opacity-75" />
                      <span className="relative flex h-6 w-6 rounded-full bg-white text-neutral-950 shadow-md items-center justify-center">
                        <ShoppingBag className="h-3 w-3" />
                      </span>
                    </div>

                    {/* Popover Product Tag Card */}
                    <div
                      className={cn(
                        "absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-48 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md p-3 shadow-2xl border border-neutral-200 dark:border-neutral-700 transition-all duration-200 z-30",
                        isPinActive
                          ? "opacity-100 scale-100 pointer-events-auto"
                          : "opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto"
                      )}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                        {t("ugc.shopTheLook", "Shop this look")}
                      </span>
                      <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {post.taggedProduct.name}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-neutral-100 dark:border-neutral-800">
                        <span className="text-xs font-extrabold text-neutral-950 dark:text-white">
                          {formatPrice(post.taggedProduct.price)}
                        </span>
                        <Link
                          href={post.taggedProduct.href}
                          className="text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 px-2 py-0.5 rounded-md hover:opacity-90"
                        >
                          {t("ugc.viewProduct", "View")}
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Top Creator Tag */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="text-xs font-bold text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      {post.handle}
                    </span>
                  </div>

                  {/* Likes Count */}
                  <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 text-xs font-bold text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                    <span>{post.likes.toLocaleString()}</span>
                  </div>

                  {/* Bottom Caption */}
                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
                    <p className="line-clamp-2 font-medium opacity-90">
                      &ldquo;{post.caption}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
