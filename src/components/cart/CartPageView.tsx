"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency, useTranslation } from "@/lib/i18n";
import { useValidateCouponMutation, CouponValidationResult } from "@/redux/api/couponApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CartPageView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isBn } = useTranslation();
  const { formatPrice } = useCurrency();
  const {
    items,
    subtotal,
    originalSubtotal,
    totalSavings,
    freeShippingThreshold,
    amountUntilFreeShipping,
    qualifiesForFreeShipping,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validateCoupon, { isLoading: isValidatingCoupon }] = useValidateCouponMutation();

  const urlCoupon = searchParams.get("coupon") || "";
  const isAbandonedCartRecovery = Boolean(
    urlCoupon.toUpperCase().startsWith("RECOVER-") || searchParams.get("recovery") === "true"
  );

  // Auto-apply recovery coupon from URL
  useEffect(() => {
    if (urlCoupon && !appliedCoupon && subtotal > 0) {
      validateCoupon({
        code: urlCoupon.trim(),
        cartSubtotal: subtotal,
      })
        .unwrap()
        .then((res) => {
          if (res.data) {
            setAppliedCoupon(res.data);
          }
        })
        .catch(() => {
          // Ignore invalid URL coupon
        });
    }
  }, [urlCoupon, subtotal, appliedCoupon, validateCoupon]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setCouponError(null);

    try {
      const res = await validateCoupon({
        code: couponCodeInput.trim(),
        cartSubtotal: subtotal,
      }).unwrap();

      if (res.data) {
        setAppliedCoupon(res.data);
        setCouponCodeInput("");
      }
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        (isBn ? "কুপন কোডটি সঠিক নয় অথবা মেয়াদোত্তীর্ণ।" : "Invalid or expired promo code.");
      setCouponError(msg);
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const discountAmount = appliedCoupon?.discountAmount || 0;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  // Empty cart view
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-foreground/5 mb-5">
          <ShoppingBag className="h-10 w-10 text-foreground/40" />
        </div>
        <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">
          {isBn ? "আপনার শপিং ব্যাগ খালি" : "Your Shopping Bag is Empty"}
        </h2>
        <p className="text-sm text-foreground/50 max-w-sm mb-6">
          {isBn
            ? "আপনার পছন্দের পোশাক ও এক্সেসরিজ ব্যাগে যোগ করে কেনাকাটা শুরু করুন।"
            : "Looks like you haven't added anything yet. Explore our latest drops and archive collections."}
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-6 py-3 font-bold text-sm hover:opacity-90 transition-all shadow-md"
        >
          <Sparkles className="h-4 w-4" />
          <span>{isBn ? "কালেকশন দেখুন" : "Explore Collections"}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb & Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground/40 mb-2">
            <Link href="/" className="hover:text-foreground transition-colors">
              {isBn ? "হোম" : "Home"}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/shop" className="hover:text-foreground transition-colors">
              {isBn ? "শপ" : "Shop"}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-bold">{isBn ? "শপিং ব্যাগ" : "Shopping Bag"}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
              {isBn ? "আপনার শপিং ব্যাগ" : "Shopping Bag"} ({items.length})
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearCart()}
              className="text-xs text-rose-500 hover:text-rose-600 rounded-xl w-fit"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              <span>{isBn ? "সব মুছে ফেলুন" : "Clear Bag"}</span>
            </Button>
          </div>
        </div>

        {/* ── Special Abandoned Cart Recovery Banner ── */}
        {isAbandonedCartRecovery && (
          <div className="mb-8 p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-indigo-500/15 border border-amber-500/30 text-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in slide-in-from-top-3 duration-300">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-neutral-950 font-black">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-500 text-neutral-950 font-black text-[10px] tracking-wider uppercase px-2 py-0.5">
                    Recovery Offer
                  </Badge>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    Welcome Back!
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-foreground mt-0.5">
                  {isBn
                    ? "আপনার ব্যাগ সংরক্ষণ করা হয়েছিল — উপভোগ করুন ১০% রিকভারি ছাড়!"
                    : "We held your items for you! Your 10% recovery discount has been provisioned."}
                </h3>
                <p className="text-xs text-foreground/60 mt-0.5">
                  Use coupon code{" "}
                  <code className="bg-foreground/10 px-1.5 py-0.5 rounded font-mono font-bold text-foreground">
                    {urlCoupon || "RECOVER-10"}
                  </code>{" "}
                  before it expires.
                </p>
              </div>
            </div>
            {appliedCoupon ? (
              <Badge className="bg-emerald-500 text-white font-bold px-3 py-1 text-xs shrink-0 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>10% Discount Applied</span>
              </Badge>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  if (urlCoupon) {
                    validateCoupon({ code: urlCoupon, cartSubtotal: subtotal })
                      .unwrap()
                      .then((res) => res.data && setAppliedCoupon(res.data));
                  }
                }}
                className="bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold rounded-xl shrink-0"
              >
                Apply 10% Promo
              </Button>
            )}
          </div>
        )}

        {/* ── Free Shipping Progress Bar ── */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-foreground/[0.02] border border-foreground/10">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5 text-foreground">
              <Truck className="h-4 w-4 text-emerald-500" />
              {qualifiesForFreeShipping
                ? isBn
                  ? "অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন।"
                  : "Congratulations! You've unlocked FREE Nationwide Shipping."
                : isBn
                ? `ফ্রি ডেলিভারির জন্য আর ${formatPrice(amountUntilFreeShipping)} কেনাকাটা করুন`
                : `Add ${formatPrice(amountUntilFreeShipping)} more to qualify for FREE Shipping`}
            </span>
            <span className="text-foreground/50">
              {Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%
            </span>
          </div>
          <div className="h-2 w-full bg-foreground/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ========================================================= */}
          {/* Left Column: Line Items (lg:col-span-8)                    */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              const imgUrl =
                item.variant?.imageUrl ||
                (typeof item.product?.primaryImage === "object"
                  ? item.product?.primaryImage?.url
                  : item.product?.primaryImage) ||
                "";

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-3xl border border-foreground/10 bg-card shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all hover:border-foreground/20"
                >
                  {/* Product Image */}
                  <div className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-2xl overflow-hidden bg-foreground/5 border border-foreground/10 relative">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={item.product?.title || "Product"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-foreground/20">
                        <ShoppingBag className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/products/${item.product?.slug || ""}`}
                          className="text-sm sm:text-base font-bold text-foreground hover:underline line-clamp-1"
                        >
                          {item.product?.title}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-foreground/50 mt-1">
                          {item.variant?.size && (
                            <span className="bg-foreground/5 px-2 py-0.5 rounded-md font-semibold text-foreground/70">
                              Size: {item.variant.size}
                            </span>
                          )}
                          {item.variant?.color && (
                            <span className="bg-foreground/5 px-2 py-0.5 rounded-md font-semibold text-foreground/70">
                              Color: {item.variant.color}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-lg text-foreground/40 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Quantity & Unit Price */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-foreground/5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 rounded-lg border border-foreground/10 flex items-center justify-center text-foreground/70 hover:bg-foreground/5 transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 rounded-lg border border-foreground/10 flex items-center justify-center text-foreground/70 hover:bg-foreground/5 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm sm:text-base font-black text-foreground tabular-nums">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </div>
                        {item.originalUnitPrice > item.unitPrice && (
                          <div className="text-xs text-foreground/40 line-through tabular-nums">
                            {formatPrice(item.originalUnitPrice * item.quantity)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs font-bold text-foreground/60 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{isBn ? "আরও কেনাকাটা করুন" : "Continue Shopping"}</span>
              </Link>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Right Column: Order Summary (lg:col-span-4)                */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl border border-foreground/10 bg-card shadow-xs space-y-5">
              <h2 className="text-lg font-black tracking-tight text-foreground">
                {isBn ? "অর্ডার সারাংশ" : "Order Summary"}
              </h2>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 block">
                  {isBn ? "প্রোমো কোড / ভাউচার" : "Promo Code"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder={urlCoupon || "RECOVER-10"}
                    className="flex-1 h-10 px-3 rounded-xl border border-foreground/10 bg-background text-xs font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                  <Button
                    type="submit"
                    disabled={isValidatingCoupon || !couponCodeInput.trim()}
                    className="h-10 px-4 rounded-xl text-xs font-bold bg-foreground text-background"
                  >
                    {isValidatingCoupon ? "..." : isBn ? "প্রয়োগ" : "Apply"}
                  </Button>
                </div>

                {couponError && (
                  <p className="text-xs text-rose-500 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {couponError}
                  </p>
                )}

                {appliedCoupon && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                      <Tag className="h-3.5 w-3.5" />
                      <span>{appliedCoupon.coupon?.code || "Coupon"} Applied (-{formatPrice(discountAmount)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-foreground/40 hover:text-foreground font-bold"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </form>

              {/* Financial Breakdown */}
              <div className="space-y-3 pt-3 border-t border-foreground/10 text-sm">
                <div className="flex items-center justify-between text-foreground/70">
                  <span>{isBn ? "সাবটোটাল:" : "Subtotal:"}</span>
                  <span className="font-bold text-foreground tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>{isBn ? "ডিসকাউন্ট ছাড়:" : "Promo Discount:"}</span>
                    <span className="tabular-nums">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                {totalSavings > 0 && (
                  <div className="flex items-center justify-between text-foreground/50 text-xs">
                    <span>{isBn ? "মোট সাশ্রয়:" : "Total Savings:"}</span>
                    <span className="tabular-nums">-{formatPrice(totalSavings)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-foreground/70">
                  <span>{isBn ? "ডেলিভারি চার্জ:" : "Estimated Shipping:"}</span>
                  <span className="font-bold text-foreground">
                    {qualifiesForFreeShipping ? (
                      <span className="text-emerald-600 dark:text-emerald-400 uppercase text-xs">
                        {isBn ? "ফ্রি" : "FREE"}
                      </span>
                    ) : (
                      formatPrice(80)
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-foreground/10 text-base font-black text-foreground">
                  <span>{isBn ? "সর্বমোট:" : "Estimated Total:"}</span>
                  <span className="tabular-nums">
                    {formatPrice(grandTotal + (qualifiesForFreeShipping ? 0 : 80))}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Button
                onClick={() => {
                  const query = appliedCoupon?.coupon?.code
                    ? `?coupon=${encodeURIComponent(appliedCoupon.coupon.code)}`
                    : urlCoupon
                    ? `?coupon=${encodeURIComponent(urlCoupon)}`
                    : "";
                  router.push(`/checkout${query}`);
                }}
                className="w-full h-12 rounded-2xl bg-foreground text-background font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 shadow-md"
              >
                <span>{isBn ? "চেকআউট করুন" : "Proceed to Checkout"}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              {/* Trust Badges */}
              <div className="pt-3 border-t border-foreground/5 space-y-2 text-[11px] text-foreground/50">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>100% Authentic Luxury Heavyweight Fabrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Express Nationwide Doorstep Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
