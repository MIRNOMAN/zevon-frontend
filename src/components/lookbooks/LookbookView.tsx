"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Tag,
  ShoppingBag,
  Eye,
  ArrowRight,
  Loader2,
  ExternalLink,
  ChevronRight,
  Layers,
  Flame,
} from "lucide-react";
import { useTranslation, useCurrency } from "@/lib/i18n";
import { useGetActiveLookbooksQuery, LookbookItem, LookbookHotspot } from "@/redux/api/lookbookApi";
import { Badge } from "@/components/ui/badge";

export function LookbookView() {
  const { t, isBn } = useTranslation();
  const { formatPrice } = useCurrency();

  const [selectedTag, setSelectedTag] = useState<string>("ALL");
  const [activeHotspot, setActiveHotspot] = useState<{ lookbookId: string; hotspot: LookbookHotspot } | null>(null);

  const { data: lookbooksRes, isLoading } = useGetActiveLookbooksQuery(
    selectedTag !== "ALL" ? { tag: selectedTag } : undefined
  );

  const fallbackLookbooks: LookbookItem[] = [
    {
      id: "lb-1",
      title: "Archive 01: Monochrome Concrete & Heavy Fleece",
      slug: "monochrome-concrete-heavy-fleece",
      description: "Layering the 380 GSM Onyx Drop-Shoulder Hoodie with Tactical Double-Pleat Cargo Pants.",
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80",
      tags: ["Streetwear", "Heavyweight", "Monochrome"],
      sortOrder: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      hotspots: [
        {
          id: "hs-1",
          coordinateX: 45,
          coordinateY: 35,
          product: {
            id: "p1",
            title: "ZEVON 380 GSM Onyx Heavyweight Hoodie",
            slug: "380-gsm-onyx-heavyweight-hoodie",
            basePrice: 3800,
            discountPrice: 3400,
            images: [{ url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80", isPrimary: true }],
          },
        },
        {
          id: "hs-2",
          coordinateX: 52,
          coordinateY: 72,
          product: {
            id: "p2",
            title: "ZEVON French Terry Utility Cargo Pants",
            slug: "french-terry-utility-cargo-pants",
            basePrice: 2900,
            discountPrice: null,
            images: [{ url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80", isPrimary: true }],
          },
        },
      ],
    },
    {
      id: "lb-2",
      title: "Archive 02: Architectural Layering & Oversized Drape",
      slug: "architectural-layering-oversized-drape",
      description: "280 GSM Acid Washed Boxy Tee matched with Raw Edge Heavyweight Zip Vest.",
      imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80",
      tags: ["Layering", "Acid Wash", "Minimalist"],
      sortOrder: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
      hotspots: [
        {
          id: "hs-3",
          coordinateX: 48,
          coordinateY: 42,
          product: {
            id: "p3",
            title: "ZEVON 280 GSM Acid Washed Boxy Tee",
            slug: "280-gsm-acid-washed-boxy-tee",
            basePrice: 1850,
            discountPrice: 1650,
            images: [{ url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80", isPrimary: true }],
          },
        },
      ],
    },
  ];

  const lookbooks: LookbookItem[] =
    lookbooksRes?.data?.data && lookbooksRes.data.data.length > 0
      ? lookbooksRes.data.data
      : fallbackLookbooks;

  const tags = ["ALL", "Streetwear", "Heavyweight", "Monochrome", "Acid Wash", "Minimalist"];

  return (
    <div className="min-h-[85vh] bg-background py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb ── */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            {t("nav.home", "Home")}
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white">
            {isBn ? "লুকবুক ও শপ দ্য লুক" : "Shoppable Lookbook"}
          </span>
        </nav>

        {/* ── Hero Banner ── */}
        <div className="relative rounded-3xl bg-linear-to-br from-neutral-950 via-neutral-900 to-black text-white p-8 sm:p-14 lg:p-20 shadow-2xl overflow-hidden mb-12 border border-neutral-800 animate-fade-in-up">
          <div className="absolute right-0 top-0 translate-x-20 -translate-y-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-neutral-300 border border-white/10 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>{isBn ? "শপ দ্য লুক" : "SHOP THE EDITORIAL LOOK"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
              {isBn ? "এডিটোরিয়াল স্ট্রিটওয়্যার লুকবুক" : "VISUAL ARCHIVE & SHOPPABLE HOTSPOTS."}
            </h1>

            <p className="text-xs sm:text-base text-neutral-300 font-normal leading-relaxed mb-8 max-w-2xl">
              {isBn
                ? "আমাদের স্টাইলিস্টদের কিউরেট করা সম্পূর্ণ লুক দেখুন। ছবির হটস্পট পিনে ট্যাপ করে সরাসরি প্রতিটি পোশাকের স্পেসিফিকেশন ও সাইজ বেছে নিন।"
                : "Explore complete atelier silhouettes styled by our creative directors. Click any glowing pin to reveal tagged garment specs and instant bag checkout."}
            </p>

            <Link
              href="/outfits"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <span>{isBn ? "মিক্স অ্যান্ড ম্যাচ ক্যানভাস ওপেন করুন" : "Launch Outfit Builder Canvas"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* ── Style Filter Tags ── */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedTag === tag
                  ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md"
                  : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
              }`}
            >
              {tag === "ALL" ? (isBn ? "সব কালেকশন" : "All Looks") : tag}
            </button>
          ))}
        </div>

        {/* ── Lookbook Grid ── */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
          </div>
        ) : (
          <div className="space-y-16 mb-20">
            {lookbooks.map((lb, idx) => (
              <div
                key={lb.id}
                style={{ animationDelay: `${idx * 150}ms` }}
                className="animate-fade-in-up rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0"
              >
                {/* Visual Image with Hotspots (7 Cols) */}
                <div className="lg:col-span-7 relative h-[450px] sm:h-[600px] bg-neutral-950 overflow-hidden group">
                  <img
                    src={lb.imageUrl}
                    alt={lb.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Hotspot Pins */}
                  {lb.hotspots?.map((hs) => {
                    const isSelected =
                      activeHotspot?.lookbookId === lb.id &&
                      activeHotspot?.hotspot.id === hs.id;
                    return (
                      <button
                        key={hs.id}
                        type="button"
                        onClick={() =>
                          setActiveHotspot(
                            isSelected ? null : { lookbookId: lb.id, hotspot: hs }
                          )
                        }
                        style={{
                          left: `${hs.coordinateX}%`,
                          top: `${hs.coordinateY}%`,
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center transition-all z-20 cursor-pointer ${
                          isSelected
                            ? "bg-amber-400 text-neutral-950 scale-125 ring-4 ring-amber-400/50 shadow-2xl"
                            : "bg-neutral-950/80 text-white backdrop-blur-sm ring-2 ring-white/60 hover:scale-110 hover:bg-white hover:text-neutral-950"
                        }`}
                        title={hs.product.title}
                      >
                        <span className="h-2 w-2 rounded-full bg-current animate-ping absolute" />
                        <span className="h-2 w-2 rounded-full bg-current relative" />
                      </button>
                    );
                  })}
                </div>

                {/* Editorial Details & Tagged Garments (5 Cols) */}
                <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {lb.tags?.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-extrabold uppercase text-neutral-600 dark:text-neutral-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white leading-snug">
                      {lb.title}
                    </h2>

                    {lb.description && (
                      <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        {lb.description}
                      </p>
                    )}
                  </div>

                  {/* Hotspot Garments List */}
                  <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
                      {isBn ? "লুকের পোশাকসমূহ (Tagged Pieces):" : "Pieces in this Look:"}
                    </span>

                    <div className="space-y-2">
                      {lb.hotspots?.map((hs) => {
                        const product = hs.product;
                        const pImg =
                          product.images?.[0]?.url ||
                          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80";
                        const price = product.discountPrice || product.basePrice;
                        const isSelected =
                          activeHotspot?.lookbookId === lb.id &&
                          activeHotspot?.hotspot.id === hs.id;

                        return (
                          <div
                            key={hs.id}
                            className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                              isSelected
                                ? "bg-amber-500/10 border-amber-500/40 dark:bg-amber-500/5 shadow-sm"
                                : "bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200/60 dark:border-neutral-700/60 hover:border-neutral-400"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-12 w-12 rounded-xl overflow-hidden bg-neutral-200 shrink-0">
                                <img
                                  src={pImg}
                                  alt={product.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-neutral-950 dark:text-white truncate">
                                  {product.title}
                                </h4>
                                <span className="text-xs font-black text-neutral-900 dark:text-white">
                                  {formatPrice(price)}
                                </span>
                              </div>
                            </div>

                            <Link
                              href={`/products/${product.slug || product.id}`}
                              className="px-3.5 py-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold hover:opacity-90 transition-all shrink-0 ml-2"
                            >
                              {isBn ? "কিনুন" : "View Piece"}
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
