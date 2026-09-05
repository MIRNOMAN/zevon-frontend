/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Flame,
  Clock,
  Zap,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  useGetActiveFlashSaleQuery,
  useClaimFlashSaleStockMutation,
  type FlashSaleItem,
  type FlashSaleCampaign,
} from "@/redux/api/flashSaleApi";
import { useCart } from "@/context/CartContext";
import { useTranslation, useCurrency, toBengaliDigits } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function FlashSaleSection() {
  const { t, isBn } = useTranslation();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  const { data: flashSaleRes, isLoading } = useGetActiveFlashSaleQuery();
  const [claimStockMutation] = useClaimFlashSaleStockMutation();

  const [claimedProductIds, setClaimedProductIds] = useState<Record<string, boolean>>({});

  // Active flash sale data from backend
  const campaign: FlashSaleCampaign | null = flashSaleRes?.data || null;

  // Calculate live countdown timer state
  const targetEndTime = useMemo(() => {
    if (campaign?.endTime) {
      return new Date(campaign.endTime).getTime();
    }
    // Fallback: 24h from today midnight
    const tomorrow = new Date();
    tomorrow.setHours(23, 59, 59, 999);
    return tomorrow.getTime();
  }, [campaign?.endTime]);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = targetEndTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetEndTime]);

  // Fallback demo flash sale items if no active campaign in DB yet
  const displayItems = useMemo((): FlashSaleItem[] => {
    if (campaign?.items && campaign.items.length > 0) {
      return campaign.items;
    }

    return [
      {
        id: "demo-fs-1",
        discountPrice: 1450,
        discountPercent: 35,
        quantityLimit: 50,
        soldCount: 38,
        availableStock: 12,
        claimPercentage: 76,
        isSoldOut: false,
        product: {
          id: "prod-fs-1",
          title: "380 GSM Heavyweight Raw Boxy Tee",
          slug: "architectural-minimalist-heavyweight-tee",
          basePrice: 2250,
          discountPrice: 1450,
          category: { id: "cat-1", name: "T-Shirts", slug: "men-t-shirts" },
          images: [
            {
              url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
              isPrimary: true,
            },
          ],
        },
      },
      {
        id: "demo-fs-2",
        discountPrice: 2650,
        discountPercent: 30,
        quantityLimit: 40,
        soldCount: 34,
        availableStock: 6,
        claimPercentage: 85,
        isSoldOut: false,
        product: {
          id: "prod-fs-2",
          title: "Acid Wash Heavy Loopback Hoodie",
          slug: "heavy-french-terry-oversized-hoodie",
          basePrice: 3800,
          discountPrice: 2650,
          category: { id: "cat-2", name: "Hoodies", slug: "men-hoodies" },
          images: [
            {
              url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
              isPrimary: true,
            },
          ],
        },
      },
      {
        id: "demo-fs-3",
        discountPrice: 2200,
        discountPercent: 40,
        quantityLimit: 30,
        soldCount: 27,
        availableStock: 3,
        claimPercentage: 90,
        isSoldOut: false,
        product: {
          id: "prod-fs-3",
          title: "Ribbed Minimalist Knit Co-ord Top & Pants",
          slug: "ribbed-knit-crop-top-and-trouser-co-ord",
          basePrice: 3650,
          discountPrice: 2200,
          category: { id: "cat-3", name: "Co-ords", slug: "women-coords" },
          images: [
            {
              url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
              isPrimary: true,
            },
          ],
        },
      },
      {
        id: "demo-fs-4",
        discountPrice: 2150,
        discountPercent: 25,
        quantityLimit: 45,
        soldCount: 31,
        availableStock: 14,
        claimPercentage: 68,
        isSoldOut: false,
        product: {
          id: "prod-fs-4",
          title: "Utility Multi-Pocket Cargo Trousers",
          slug: "pleated-wide-leg-tonal-trousers",
          basePrice: 2850,
          discountPrice: 2150,
          category: { id: "cat-4", name: "Pants", slug: "men-pants" },
          images: [
            {
              url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
              isPrimary: true,
            },
          ],
        },
      },
    ];
  }, [campaign]);

  const handleClaimDeal = async (item: FlashSaleItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (item.isSoldOut || (item.availableStock !== undefined && item.availableStock <= 0)) {
      return;
    }

    if (campaign?.id && item.product?.id) {
      try {
        await claimStockMutation({
          flashSaleId: campaign.id,
          productId: item.product.id,
          quantity: 1,
        }).unwrap();
      } catch (err) {
        console.warn("Stock claim error:", err);
      }
    }

    // Add to cart with flash sale discount price
    if (item.product) {
      await addToCart({
        productVariantId: item.product.id,
        quantity: 1,
        product: {
          id: item.product.id,
          title: item.product.title,
          slug: item.product.slug,
          basePrice: item.product.basePrice,
          discountPrice: item.discountPrice,
          price: item.discountPrice,
          images: item.product.images?.map((i) => i.url) || [],
          primaryImage: item.product.images?.[0]?.url || "",
          inStock: true,
        } as any,
        variant: {
          id: item.product.id,
          size: "L",
          color: "Standard",
          extraPrice: 0,
          stock: item.availableStock || 10,
        },
      });

      setClaimedProductIds((prev) => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setClaimedProductIds((prev) => ({ ...prev, [item.id]: false }));
      }, 2500);
    }
  };

  const title = campaign?.title || (isBn ? "লাইভ ফ্ল্যাশ সেল • লিমিটেড ড্রপ" : "FLASH SALE • 24H DROP");
  const discountText = campaign?.discountPercent
    ? `UP TO ${campaign.discountPercent}% OFF`
    : isBn
    ? "৪০% পর্যন্ত বিশেষ ছাড়"
    : "UP TO 40% OFF";

  return (
    <section className="py-14 sm:py-20 relative overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white border-y border-neutral-800">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-[45rem] rounded-full bg-gradient-to-r from-rose-600/15 via-amber-500/10 to-transparent blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Live Status & Countdown Timer */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-neutral-800/80">
          <div>
            {/* Live Indicator Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-rose-400">
                {isBn ? "লাইভ ক্যাম্পেইন" : "LIVE FLASH SALE"}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                {discountText}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <span>{title}</span>
              <Flame className="h-8 w-8 text-rose-500 animate-bounce" />
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-xl">
              {campaign?.description ||
                (isBn
                  ? "সীমিত স্টক এবং সময়ভিত্তিক বিশেষ ডিসকাউন্ট। দ্রুত আপনার পছন্দের পোশাকটি সংগ্রহ করুন।"
                  : "Tiered markdowns on signature heavyweight pieces. Stock allocations decrease in real-time.")}
            </p>
          </div>

          {/* Glowing Countdown Flip Cards */}
          <div className="flex items-center gap-2 sm:gap-3 bg-neutral-900/90 border border-neutral-800 p-3 sm:p-4 rounded-3xl backdrop-blur-xl shadow-2xl shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 mr-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <span className="hidden sm:inline">{isBn ? "শেষ হতে বাকি:" : "Ends in:"}</span>
            </div>

            {/* Days */}
            {timeLeft.days > 0 && (
              <>
                <div className="flex flex-col items-center">
                  <div className="w-11 sm:w-12 h-12 sm:h-13 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-lg sm:text-xl font-black text-white font-mono shadow-inner">
                    {isBn ? toBengaliDigits(timeLeft.days.toString().padStart(2, "0")) : timeLeft.days.toString().padStart(2, "0")}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 mt-1">
                    {isBn ? "দিন" : "Days"}
                  </span>
                </div>
                <span className="text-neutral-600 font-bold text-lg pb-4">:</span>
              </>
            )}

            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="w-11 sm:w-12 h-12 sm:h-13 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-lg sm:text-xl font-black text-white font-mono shadow-inner">
                {isBn ? toBengaliDigits(timeLeft.hours.toString().padStart(2, "0")) : timeLeft.hours.toString().padStart(2, "0")}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 mt-1">
                {isBn ? "ঘণ্টা" : "Hours"}
              </span>
            </div>

            <span className="text-neutral-600 font-bold text-lg pb-4">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="w-11 sm:w-12 h-12 sm:h-13 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-lg sm:text-xl font-black text-white font-mono shadow-inner">
                {isBn ? toBengaliDigits(timeLeft.minutes.toString().padStart(2, "0")) : timeLeft.minutes.toString().padStart(2, "0")}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 mt-1">
                {isBn ? "মিনিট" : "Mins"}
              </span>
            </div>

            <span className="text-neutral-600 font-bold text-lg pb-4">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="w-11 sm:w-12 h-12 sm:h-13 rounded-2xl bg-rose-950/40 border border-rose-800/60 flex items-center justify-center text-lg sm:text-xl font-black text-rose-400 font-mono shadow-inner">
                {isBn ? toBengaliDigits(timeLeft.seconds.toString().padStart(2, "0")) : timeLeft.seconds.toString().padStart(2, "0")}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-rose-400/80 mt-1">
                {isBn ? "সেকেন্ড" : "Secs"}
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid with Real-time Stock Allocation Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
          {displayItems.map((item) => {
            const product = item.product;
            if (!product) return null;

            const imgUrl =
              product.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";

            const percentClaimed = item.claimPercentage || Math.min(100, Math.round(((item.soldCount || 0) / (item.quantityLimit || 1)) * 100));
            const isClaimed = claimedProductIds[item.id];
            const discountPercent =
              item.discountPercent ||
              (product.basePrice
                ? Math.round(((product.basePrice - item.discountPrice) / product.basePrice) * 100)
                : 30);

            return (
              <div
                key={item.id}
                className="group rounded-3xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-rose-950/20"
              >
                {/* Image Section */}
                <div className="relative aspect-3/4 w-full overflow-hidden bg-neutral-950">
                  <img
                    src={imgUrl}
                    alt={product.title}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    <span className="px-2.5 py-1 rounded-xl bg-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1">
                      <Zap className="h-3 w-3 fill-white" />
                      <span>-{discountPercent}%</span>
                    </span>
                  </div>

                  {item.availableStock !== undefined && item.availableStock <= 5 && !item.isSoldOut && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/90 text-neutral-950 text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
                        {isBn ? `মাত্র ${toBengaliDigits(item.availableStock)}টি বাকি` : `Only ${item.availableStock} Left`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info & Stock Progress Section */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block truncate">
                      {product.category?.name || "Streetwear Drop"}
                    </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-sm font-bold text-white hover:text-rose-400 transition-colors line-clamp-1 mt-0.5 block"
                    >
                      {product.title}
                    </Link>

                    {/* Price comparison */}
                    <div className="flex items-baseline gap-2.5 mt-2">
                      <span className="text-base font-black text-white">
                        {formatPrice(item.discountPrice)}
                      </span>
                      <span className="text-xs text-neutral-500 line-through font-semibold">
                        {formatPrice(product.basePrice)}
                      </span>
                    </div>
                  </div>

                  {/* Stock Claim Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-rose-500" />
                        <span>{isBn ? `${toBengaliDigits(percentClaimed)}% দাবি করা হয়েছে` : `${percentClaimed}% Claimed`}</span>
                      </span>
                      <span className="text-neutral-500">
                        {item.availableStock || (item.quantityLimit - item.soldCount)} {isBn ? "টি বাকি" : "left"}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          percentClaimed > 80
                            ? "bg-gradient-to-r from-amber-500 to-rose-600"
                            : "bg-gradient-to-r from-rose-600 to-amber-500"
                        )}
                        style={{ width: `${percentClaimed}%` }}
                      />
                    </div>
                  </div>

                  {/* Claim Button */}
                  <button
                    type="button"
                    disabled={item.isSoldOut || (item.availableStock !== undefined && item.availableStock <= 0)}
                    onClick={(e) => handleClaimDeal(item, e)}
                    className={cn(
                      "w-full py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md",
                      isClaimed
                        ? "bg-emerald-600 text-white"
                        : item.isSoldOut
                        ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                        : "bg-white text-neutral-950 hover:bg-rose-500 hover:text-white"
                    )}
                  >
                    {isClaimed ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>{isBn ? "ব্যাগে যোগ হয়েছে" : "Claimed & Added"}</span>
                      </>
                    ) : item.isSoldOut ? (
                      <span>{isBn ? "স্টক শেষ" : "Sold Out"}</span>
                    ) : (
                      <>
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>{isBn ? "ডিল নিন • ব্যাগে যোগ করুন" : "Claim Flash Deal"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Deals Link */}
        <div className="mt-12 text-center">
          <Link
            href="/sale"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 border border-neutral-700 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all"
          >
            <span>{isBn ? "সকল সেল কালেকশন দেখুন" : "Explore Full Sale Archive"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
