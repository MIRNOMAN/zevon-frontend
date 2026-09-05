/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight, Camera } from "lucide-react";
import { UGC_POSTS } from "./homeData";
import { useTranslation, useCurrency, toBengaliDigits } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const UGC_IMAGES: Record<string, string> = {
  "ugc-1":
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
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
  const [activePin, setActivePin] = useState<string | null>("ugc-2"); // Default open ugc-2 as seen in reference image
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const handleToggleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-neutral-950 border-t border-neutral-200/70 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">
              <Camera className="h-3.5 w-3.5 text-rose-500" />
              <span>{isBn ? "কমিউনিটি ও স্ট্রিট স্টাইল" : "COMMUNITY & STREET STYLE"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white uppercase font-sans">
              {isBn ? "ট্যাগড বাই ইউ #ZEVON_BD" : "TAGGED BY YOU #ZEVON_BD"}
            </h2>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-neutral-950 dark:text-white hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
          >
            <span>{isBn ? "ইনস্টাগ্রামে ফলো করুন @ZEVON_BD" : "FOLLOW @ZEVON_BD ON INSTAGRAM"}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Shoppable 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {UGC_POSTS.map((post) => {
            const isPinActive = activePin === post.id;
            const isLiked = likedPosts[post.id];
            const currentLikes = isLiked ? post.likes + 1 : post.likes;

            return (
              <div
                key={post.id}
                className="group relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-md hover:shadow-2xl transition-all duration-300"
              >
                {/* Image Frame with Hotspot Pin */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={UGC_IMAGES[post.id]}
                    alt={post.caption}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Scrim for readable tags & captions */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none" />

                  {/* Top Creator Handle Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="text-xs font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-xs">
                      {post.handle}
                    </span>
                  </div>

                  {/* Likes Count Pill */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleLike(post.id, e)}
                    className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 text-xs font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-xs hover:bg-black/80 transition-all cursor-pointer"
                  >
                    <Heart
                      className={cn(
                        "h-3.5 w-3.5 transition-colors",
                        isLiked ? "fill-rose-500 text-rose-500" : "fill-rose-500 text-rose-500"
                      )}
                    />
                    <span>{isBn ? toBengaliDigits(currentLikes.toLocaleString()) : currentLikes.toLocaleString()}</span>
                  </button>

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
                      <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-white/60 opacity-75" />
                      <span className="relative flex h-7 w-7 rounded-full bg-white/95 dark:bg-white text-neutral-950 shadow-xl items-center justify-center border border-black/10 hover:scale-110 transition-transform">
                        <ShoppingBag className="h-3.5 w-3.5" />
                      </span>
                    </div>

                    {/* Popover Product Tag Card */}
                    <div
                      className={cn(
                        "absolute left-1/2 -translate-x-1/2 bottom-full mb-3.5 w-52 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-3.5 shadow-2xl border border-neutral-200/90 dark:border-neutral-700/80 transition-all duration-200 z-30",
                        isPinActive
                          ? "opacity-100 scale-100 pointer-events-auto"
                          : "opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto"
                      )}
                    >
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-0.5">
                        {t("ugc.shopTheLook", "SHOP THIS LOOK")}
                      </span>
                      <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {post.taggedProduct.name}
                      </p>
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        <span className="text-xs font-black text-neutral-950 dark:text-white">
                          {formatPrice(post.taggedProduct.price)}
                        </span>
                        <Link
                          href={post.taggedProduct.href}
                          className="text-[10px] font-black uppercase tracking-wider bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 px-2.5 py-1 rounded-lg hover:opacity-90 transition-opacity shadow-xs"
                        >
                          {isBn ? "ড্রপ দেখুন" : "VIEW DROP"}
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Caption in Quotes */}
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs z-10">
                    <p className="line-clamp-2 font-medium opacity-95 leading-relaxed drop-shadow-sm">
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
