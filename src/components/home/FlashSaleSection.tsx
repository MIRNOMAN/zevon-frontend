/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Flame,
  Clock,
  Zap,
  ShoppingBag,
  ArrowRight,
  Check,
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

export function FlashSaleSection() {
  const { isBn } = useTranslation();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  // Polling every 5s for real-time live stock synchronization
  const { data: flashSaleRes, isLoading: isFlashSaleLoading } = useGetActiveFlashSaleQuery(
    undefined,
    {
      pollingInterval: 5000,
    }
  );
  const [claimStockMutation] = useClaimFlashSaleStockMutation();

  const [claimedProductIds, setClaimedProductIds] = useState<Record<string, boolean>>({});
  const [localClaimDeltas, setLocalClaimDeltas] = useState<Record<string, number>>({});
  const [isExpired, setIsExpired] = useState(false);

  // Active flash sale data from backend
  const campaign: FlashSaleCampaign | null = flashSaleRes?.data || null;

  // Calculate live countdown timer state
  const targetEndTime = useMemo(() => {
    if (!campaign?.endTime) return null;
    return new Date(campaign.endTime).getTime();
  }, [campaign?.endTime]);

  const targetStartTime = useMemo(() => {
    if (!campaign?.startTime) return null;
    return new Date(campaign.startTime).getTime();
  }, [campaign?.startTime]);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Ticking countdown effect
  useEffect(() => {
    if (!targetEndTime || !targetStartTime) {
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();

      // Check if sale has not started yet or has expired
      if (now < targetStartTime) {
        // Not active yet
        setIsExpired(true);
        return;
      }

      const diff = targetEndTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
        return;
      }

      setIsExpired(false);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetEndTime, targetStartTime]);

  // Dynamic real-time flash sale items derived from campaign
  const displayItems = useMemo((): FlashSaleItem[] => {
    if (!campaign?.items || campaign.items.length === 0) {
      return [];
    }

    return campaign.items.map((item) => {
      const delta = localClaimDeltas[item.id] || 0;
      const totalStock = item.quantityLimit || 30;
      const sold = (item.soldCount || 0) + delta;
      const available = Math.max(0, totalStock - sold);
      const claimPct = Math.min(100, Math.round((sold / totalStock) * 100));

      return {
        ...item,
        soldCount: sold,
        availableStock: available,
        claimPercentage: claimPct,
        isSoldOut: available <= 0,
      };
    });
  }, [campaign?.items, localClaimDeltas]);

  const handleClaimDeal = useCallback(
    async (item: FlashSaleItem, e: React.MouseEvent) => {
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
        const variant = (item.product as any).variants?.[0];
        const variantId = variant?.id || item.product.id;
        await addToCart({
          productVariantId: variantId,
          quantity: 1,
          product: {
            id: item.product.id,
            title: item.product.title,
            slug: item.product.slug,
            basePrice: item.product.basePrice,
            discountPrice: item.discountPrice,
            price: item.discountPrice,
            images: item.product.images?.map((i) => (typeof i === "string" ? i : i.url)) || [],
            primaryImage:
              (typeof item.product.images?.[0] === "string"
                ? item.product.images[0]
                : item.product.images?.[0]?.url) || "",
            inStock: true,
          } as any,
          variant: {
            id: variantId,
            size: variant?.size || "Standard",
            color: variant?.color || "Default",
            extraPrice: Number(variant?.extraPrice || 0),
            stock: item.availableStock || 10,
          },
        });

        setClaimedProductIds((prev) => ({ ...prev, [item.id]: true }));
        setLocalClaimDeltas((prev) => ({
          ...prev,
          [item.id]: (prev[item.id] || 0) + 1,
          ...(item.product?.id ? { [item.product.id]: (prev[item.product.id] || 0) + 1 } : {}),
        }));
        setTimeout(() => {
          setClaimedProductIds((prev) => ({ ...prev, [item.id]: false }));
        }, 2500);
      }
    },
    [campaign?.id, claimStockMutation, addToCart]
  );

  // Auto-hide if no active campaign, if campaign inactive, if expired, or if no products
  if (isFlashSaleLoading) {
    return null;
  }

  if (!campaign || !campaign.isActive || isExpired || displayItems.length === 0) {
    return null;
  }

  const title = campaign.title || (isBn ? "লাইভ ফ্ল্যাশ সেল • লিমিটেড ড্রপ" : "FLASH SALE • LIMITED DROP");
  const discountText = campaign.discountPercent
    ? `UP TO ${campaign.discountPercent}% OFF`
    : isBn
    ? "বিশেষ ছাড়"
    : "SPECIAL DISCOUNT";

  return (
    <section
      id="flash-sale-section"
      className="py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white border-y border-neutral-800"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 sm:h-96 w-full max-w-4xl rounded-full bg-gradient-to-r from-rose-600/15 via-amber-500/10 to-transparent blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Live Status & 4-Unit Countdown Timer */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 sm:pb-10 border-b border-neutral-800/80">
          <div className="space-y-2">
            {/* Live Indicator Badge */}
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-rose-400">
                {isBn ? "লাইভ ফ্ল্যাশ সেল" : "LIVE FLASH SALE"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                {discountText}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white flex items-center gap-2.5 sm:gap-3">
              <span>{title}</span>
              <Flame className="h-6 w-6 sm:h-8 sm:w-8 text-rose-500 shrink-0 animate-bounce" />
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
              {campaign.description ||
                (isBn
                  ? "সীমিত স্টক এবং সময়ভিত্তিক বিশেষ ডিসকাউন্ট। অফার শেষ হওয়ার আগেই সংগ্রহ করুন।"
                  : "Limited-time deals with live stock quotas. Special markdown ends strictly when timer hits zero.")}
            </p>
          </div>

          {/* Glowing 4-Unit Countdown: Days, Hours, Minutes, Seconds */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-neutral-900/90 border border-neutral-800 p-3.5 sm:p-4 rounded-3xl backdrop-blur-xl shadow-2xl shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 sm:mr-2">
              <Clock className="h-4 w-4 text-amber-400 shrink-0" />
              <span>{isBn ? "অফার শেষ হতে বাকি:" : "Ends in:"}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-2.5 w-full sm:w-auto">
              {/* Days */}
              <div className="flex flex-col items-center">
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-lg sm:text-xl font-black text-white font-mono shadow-inner">
                  {isBn
                    ? toBengaliDigits(timeLeft.days.toString().padStart(2, "0"))
                    : timeLeft.days.toString().padStart(2, "0")}
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-1">
                  {isBn ? "দিন" : "Days"}
                </span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-lg sm:text-xl font-black text-white font-mono shadow-inner">
                  {isBn
                    ? toBengaliDigits(timeLeft.hours.toString().padStart(2, "0"))
                    : timeLeft.hours.toString().padStart(2, "0")}
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-1">
                  {isBn ? "ঘণ্টা" : "Hours"}
                </span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-lg sm:text-xl font-black text-white font-mono shadow-inner">
                  {isBn
                    ? toBengaliDigits(timeLeft.minutes.toString().padStart(2, "0"))
                    : timeLeft.minutes.toString().padStart(2, "0")}
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-1">
                  {isBn ? "মিনিট" : "Mins"}
                </span>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-rose-950/50 border border-rose-800/60 flex items-center justify-center text-lg sm:text-xl font-black text-rose-400 font-mono shadow-inner">
                  {isBn
                    ? toBengaliDigits(timeLeft.seconds.toString().padStart(2, "0"))
                    : timeLeft.seconds.toString().padStart(2, "0")}
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-rose-400 mt-1">
                  {isBn ? "সেকেন্ড" : "Secs"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards Grid with Real-time Stock Allocation Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-8 sm:pt-10">
          {displayItems.map((item) => {
            const product = item.product;
            if (!product) return null;

            const imgUrl =
              product.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";

            const percentClaimed =
              item.claimPercentage ||
              Math.min(
                100,
                Math.round(((item.soldCount || 0) / (item.quantityLimit || 1)) * 100)
              );
            const isClaimed = claimedProductIds[item.id];
            const discountPercent =
              item.discountPercent ||
              (product.basePrice
                ? Math.round(((product.basePrice - item.discountPrice) / product.basePrice) * 100)
                : campaign.discountPercent || 30);

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

                  {/* Top Discount Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    <span className="px-2.5 py-1 rounded-xl bg-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1">
                      <Zap className="h-3 w-3 fill-white" />
                      <span>-{discountPercent}%</span>
                    </span>
                  </div>

                  {item.availableStock !== undefined && item.availableStock <= 5 && !item.isSoldOut && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/90 text-neutral-950 text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
                        {isBn
                          ? `মাত্র ${toBengaliDigits(item.availableStock)}টি বাকি`
                          : `Only ${item.availableStock} Left`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info & Stock Progress Section */}
                <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block truncate">
                      {product.category?.name || (isBn ? "স্পেশাল ড্রপ" : "Special Drop")}
                    </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-sm font-bold text-white hover:text-rose-400 transition-colors line-clamp-1 mt-0.5 block"
                    >
                      {product.title}
                    </Link>

                    {/* Price comparison */}
                    <div className="flex items-baseline gap-2.5 mt-2">
                      <span className="text-base sm:text-lg font-black text-rose-400">
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
                        <span>
                          {isBn
                            ? `${toBengaliDigits(percentClaimed)}% দাবি করা হয়েছে`
                            : `${percentClaimed}% Claimed`}
                        </span>
                      </span>
                      <span className="text-neutral-500">
                        {isBn
                          ? `${toBengaliDigits(item.availableStock ?? item.quantityLimit - item.soldCount)}টি বাকি`
                          : `${item.availableStock ?? item.quantityLimit - item.soldCount} left`}
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
                      "w-full py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98",
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
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/sale"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 border border-neutral-700 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 hover:border-neutral-600 transition-all"
          >
            <span>{isBn ? "সকল সেল কালেকশন দেখুন" : "Explore Full Sale Archive"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
