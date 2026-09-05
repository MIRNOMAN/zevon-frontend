"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Plus,
  Check,
  Flame,
  Percent,
} from "lucide-react";
import { useTranslation, useCurrency } from "@/lib/i18n";
import {
  useGetOutfitsQuery,
  useCalculateOutfitTotalMutation,
  useAddOutfitBundleToCartMutation,
  OutfitData,
} from "@/redux/api/outfitApi";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function OutfitBuilderView() {
  const { t, isBn } = useTranslation();
  const { formatPrice } = useCurrency();
  const { openCart } = useCart();

  const { data: outfitsRes, isLoading } = useGetOutfitsQuery();
  const [calculateTotal, { isLoading: isCalculating }] = useCalculateOutfitTotalMutation();
  const [addBundleToCart, { isLoading: isAddingBundle }] = useAddOutfitBundleToCartMutation();

  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [bundleSuccess, setBundleSuccess] = useState(false);

  const outfits: OutfitData[] = outfitsRes?.data?.data || [];
  const currentOutfit = outfits[selectedOutfitIndex] || outfits[0];

  // Initialize selected variants when outfit changes
  useEffect(() => {
    if (currentOutfit?.slots) {
      const initial: Record<string, string> = {};
      currentOutfit.slots.forEach((s) => {
        const defaultVar =
          s.product.defaultVariant?.id ||
          s.product.availableVariants[0]?.id;
        if (defaultVar) {
          initial[s.slot] = defaultVar;
        }
      });
      setSelectedVariants(initial);
    }
  }, [currentOutfit]);

  const rawSubtotal = currentOutfit?.itemsSubtotal || 0;
  const bundleDiscountPercent = currentOutfit?.bundleDiscountPercent || 10;
  const savings = (rawSubtotal * bundleDiscountPercent) / 100;
  const finalPrice = Math.max(0, rawSubtotal - savings);

  const handleAddBundle = async () => {
    if (!currentOutfit) return;

    const variantEntries = Object.values(selectedVariants).map((vid) => ({
      productVariantId: vid,
      quantity: 1,
    }));

    try {
      await addBundleToCart({
        outfitId: currentOutfit.id,
        selectedVariants: variantEntries,
      }).unwrap();

      setBundleSuccess(true);
      setTimeout(() => {
        setBundleSuccess(false);
        openCart();
      }, 1500);
    } catch (err) {
      console.error("Bundle add error:", err);
    }
  };

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
            {isBn ? "আউটফিট বিল্ডার ও মিক্স-ম্যাচ" : "Outfit Builder Canvas"}
          </span>
        </nav>

        {/* ── Hero Banner ── */}
        <div className="relative rounded-3xl bg-linear-to-br from-neutral-950 via-neutral-900 to-black text-white p-8 sm:p-14 lg:p-20 shadow-2xl overflow-hidden mb-12 border border-neutral-800 animate-fade-in-up">
          <div className="absolute right-0 top-0 translate-x-20 -translate-y-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-neutral-300 border border-white/10 mb-6">
              <Layers className="h-3.5 w-3.5 text-amber-400" />
              <span>{isBn ? "ইন্টারঅ্যাক্টিভ মিক্স অ্যান্ড ম্যাচ" : "MIX & MATCH ATELIER CANVAS"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
              {isBn ? "সম্পূর্ণ লুক তৈরি করুন এবং ১০% বান্ডেল ছাড় পান" : "BUILD YOUR SILHOUETTE. SAVE 10% ON FULL BUNDLE."}
            </h1>

            <p className="text-xs sm:text-base text-neutral-300 font-normal leading-relaxed mb-8 max-w-2xl">
              {isBn
                ? "আমাদের ইন্টারেক্টিভ ক্যানভাসে টপ, বটম ও ফুটওয়্যার কম্বিনেশন বেছে নিন। সম্পূর্ণ সেট একসাথে কার্টে যোগ করলে পাবেন অতিরিক্ত ১০% ফ্ল্যাট ডিসকাউন্ট।"
                : "Curate your full heavyweight ensemble from top to bottom. Order as an architectural bundle and unlock an instant 10% discount across all pieces."}
            </p>
          </div>
        </div>

        {/* ── Outfit Preset Selector Tabs ── */}
        {outfits.length > 1 && (
          <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-none">
            {outfits.map((of, idx) => (
              <button
                key={of.id}
                type="button"
                onClick={() => setSelectedOutfitIndex(idx)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedOutfitIndex === idx
                    ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md"
                    : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
                }`}
              >
                {of.title}
              </button>
            ))}
          </div>
        )}

        {/* ── Canvas & Interactive Slots Grid (12 Cols) ── */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
          </div>
        ) : currentOutfit ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start mb-20">
            {/* Left Column: Garment Slots (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
                  {currentOutfit.title}
                </h2>
                <Badge className="bg-amber-400 text-neutral-950 font-black text-xs px-3 py-1">
                  10% BUNDLE SAVINGS
                </Badge>
              </div>

              <div className="space-y-4">
                {currentOutfit.slots?.map((slotItem) => {
                  const product = slotItem.product;
                  const pImg =
                    product.primaryImage ||
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80";
                  const selectedVarId = selectedVariants[slotItem.slot];

                  return (
                    <div
                      key={slotItem.slotId}
                      className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs hover-card-lift transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                          <img
                            src={pImg}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
                            SLOT: {slotItem.slot}
                          </span>
                          <h3 className="font-bold text-sm sm:text-base text-neutral-950 dark:text-white">
                            {product.title}
                          </h3>
                          <span className="text-sm font-black text-neutral-900 dark:text-white">
                            {formatPrice(product.effectivePrice)}
                          </span>
                        </div>
                      </div>

                      {/* Variant Size Selector */}
                      {product.availableVariants && product.availableVariants.length > 0 && (
                        <div className="space-y-1.5 sm:text-right">
                          <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                            {isBn ? "সাইজ নির্বাচন:" : "Select Size:"}
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {product.availableVariants.map((v) => {
                              const isSelected = selectedVarId === v.id;
                              return (
                                <button
                                  key={v.id}
                                  type="button"
                                  onClick={() =>
                                    setSelectedVariants((prev) => ({
                                      ...prev,
                                      [slotItem.slot]: v.id,
                                    }))
                                  }
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-xs"
                                      : "bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
                                  }`}
                                >
                                  {v.size}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Live Bundle Summary & 1-Click Checkout (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-neutral-950 text-white p-6 sm:p-8 shadow-2xl space-y-6 border border-neutral-800 sticky top-24">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 border-b border-white/10 pb-4">
                  <Percent className="h-4 w-4" />
                  <span>{isBn ? "বান্ডেল ডিসকাউন্ট সামারি" : "BUNDLE PRICE BREAKDOWN"}</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center text-neutral-300">
                    <span>{isBn ? "পৃথক পোশাকের মূল্য:" : "Individual Items Total:"}</span>
                    <span className="font-semibold text-white">{formatPrice(rawSubtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center text-amber-400 font-bold">
                    <span>{isBn ? `বান্ডেল ছাড় (${bundleDiscountPercent}%):` : `Bundle Discount (${bundleDiscountPercent}%):`}</span>
                    <span>- {formatPrice(savings)}</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-4 border-t border-white/10 text-sm">
                    <span className="font-black text-white">{isBn ? "সর্বমোট বান্ডেল মূল্য:" : "Bundle Total Price:"}</span>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-black text-white block">
                        {formatPrice(finalPrice)}
                      </span>
                      <span className="text-[11px] text-emerald-400 font-semibold block">
                        {isBn ? "৳২,৫০০+ অর্ডারে ফ্রি শিপিং" : "Free Nationwide Express Shipping Included"}
                      </span>
                    </div>
                  </div>
                </div>

                {bundleSuccess ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>{isBn ? "সম্পূর্ণ আউটফিট কার্টে যুক্ত হয়েছে!" : "Outfit Bundle Added to Shopping Bag!"}</span>
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={handleAddBundle}
                    disabled={isAddingBundle}
                    className="w-full py-4 rounded-2xl bg-white text-neutral-950 font-black text-xs sm:text-sm hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isAddingBundle ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingBag className="h-4 w-4" />
                    )}
                    <span>{isBn ? "সম্পূর্ণ বান্ডেল কার্টে যোগ করুন (১০% ছাড়)" : "Add Complete Bundle to Bag (Save 10%)"}</span>
                  </Button>
                )}

                <div className="pt-2 text-[11px] text-neutral-400 space-y-1">
                  <p>• {isBn ? "১০০% প্রিমিয়াম ৩৮০+ জিএসএম অর্গানিক ফেব্রিক।" : "Includes all styled pieces in selected sizes."}</p>
                  <p>• {isBn ? "সহজ ৭ দিনের সাইজ এক্সচেঞ্জ সুবিধা অন্তর্ভুক্ত।" : "Complimentary 7-day doorstep size exchange."}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
