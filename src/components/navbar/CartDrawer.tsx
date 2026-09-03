"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTranslation, useCurrency, toBengaliDigits } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { t, isBn } = useTranslation();
  const { formatPrice, currency } = useCurrency();
  const {
    items,
    cartCount,
    subtotal,
    originalSubtotal,
    totalSavings,
    qualifiesForFreeShipping,
    amountUntilFreeShipping,
    freeShippingThreshold,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [isRendered, setIsRendered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Silky smooth right-to-left slide-in and left-to-right slide-out
  useEffect(() => {
    let animTimer: NodeJS.Timeout;
    let frame1: number;
    let frame2: number;

    if (isCartOpen) {
      animTimer = setTimeout(() => {
        setIsRendered(true);
        frame1 = requestAnimationFrame(() => {
          frame2 = requestAnimationFrame(() => {
            setIsActive(true);
          });
        });
      }, 0);
      document.body.style.overflow = "hidden";
    } else {
      animTimer = setTimeout(() => {
        setIsActive(false);
        const exitTimer = setTimeout(() => {
          setIsRendered(false);
          document.body.style.overflow = "unset";
        }, 360);
        return () => clearTimeout(exitTimer);
      }, 0);
    }

    return () => {
      clearTimeout(animTimer);
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
  }, [isCartOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isRendered) return null;

  // Free shipping percentage
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-350 ease-out",
          isActive ? "opacity-100" : "opacity-0"
        )}
        onClick={closeCart}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div
          className={cn(
            "relative w-screen max-w-xs sm:max-w-md bg-white dark:bg-neutral-900 shadow-2xl flex flex-col border-l border-neutral-200 dark:border-neutral-800 transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isActive ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* ── 1. Drawer Header ── */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-neutral-900 dark:text-white" />
              <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white tracking-wide">
                {t("cart.bagTitle", "Your Shopping Bag")}
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {isBn ? toBengaliDigits(cartCount) : cartCount}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  title="Clear bag"
                  className="p-1.5 text-[11px] font-semibold text-neutral-400 hover:text-rose-500 transition-colors"
                >
                  {isBn ? "খালি করুন" : "Clear"}
                </button>
              )}
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart drawer"
                className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ── 2. Free Shipping Progress Bar ── */}
          {items.length > 0 && (
            <div className="px-4 sm:px-6 py-3 bg-neutral-50 dark:bg-neutral-950/60 border-b border-neutral-100 dark:border-neutral-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300">
                  <Truck className="h-3.5 w-3.5 text-amber-500" />
                  {qualifiesForFreeShipping ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {isBn ? "🎉 অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন" : "🎉 Free Express Shipping Unlocked!"}
                    </span>
                  ) : (
                    <span>
                      {isBn ? "ফ্রি ডেলিভারির জন্য আর " : "Add "}
                      <span className="font-black text-neutral-900 dark:text-white">
                        {formatPrice(amountUntilFreeShipping)}
                      </span>
                      {isBn ? " যোগ করুন" : " more for Free Shipping"}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-bold text-neutral-500">
                  {freeShippingProgress}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    qualifiesForFreeShipping
                      ? "bg-emerald-500"
                      : "bg-linear-to-r from-amber-500 to-amber-400"
                  )}
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* ── 3. Cart Items List ── */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="h-16 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 shadow-inner">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">
                  {t("cart.emptyBag", "Your bag is currently empty")}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed">
                  {t(
                    "cart.emptyDesc",
                    "Discover our new seasonal drops and add your favorite essentials."
                  )}
                </p>
                <Link
                  href="/shop?filter=new"
                  onClick={closeCart}
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 transition-opacity shadow-md"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>{t("cart.exploreDrops", "Explore New Drops")}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const imgUrl =
                  item.variant?.imageUrl ||
                  (typeof item.product?.primaryImage === "object"
                    ? item.product?.primaryImage?.url
                    : typeof item.product?.primaryImage === "string"
                    ? item.product?.primaryImage
                    : "") ||
                  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";

                const productSlug = item.product?.slug || "product";

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800/80 transition-all hover:border-neutral-200 dark:hover:border-neutral-700"
                  >
                    {/* Thumbnail Image */}
                    <Link
                      href={`/products/${productSlug}`}
                      onClick={closeCart}
                      className="h-20 w-20 sm:h-22 sm:w-22 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-700/60 shrink-0 relative block"
                    >
                      <img
                        src={imgUrl}
                        alt={item.product?.title || "Product"}
                        className="h-full w-full object-cover object-center"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1.5">
                          <Link
                            href={`/products/${productSlug}`}
                            onClick={closeCart}
                            className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1 hover:underline"
                          >
                            {item.product?.title || "Product"}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.product?.title || "item"}`}
                            className="text-neutral-400 hover:text-rose-500 transition-colors shrink-0 p-0.5"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {item.variant?.colorCode && (
                            <span
                              className="h-2 w-2 rounded-full border border-black/10 shrink-0"
                              style={{ backgroundColor: item.variant.colorCode }}
                            />
                          )}
                          <span className="truncate">
                            {item.variant?.color || "Default"} / {item.variant?.size || "One Size"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        {/* Dynamic Converted Price */}
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs sm:text-sm font-extrabold text-neutral-950 dark:text-white">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                          {item.originalUnitPrice > item.unitPrice && (
                            <span className="text-[10px] text-neutral-400 line-through">
                              {formatPrice(item.originalUnitPrice * item.quantity)}
                            </span>
                          )}
                        </div>

                        {/* Interactive Quantity Controller */}
                        <div className="flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-0.5 bg-white dark:bg-neutral-900 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white p-0.5"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold text-neutral-900 dark:text-white w-4 text-center">
                            {isBn ? toBengaliDigits(item.quantity) : item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white p-0.5"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── 4. Footer Checkout Summary ── */}
          {items.length > 0 && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 bg-neutral-50/70 dark:bg-neutral-950/60 space-y-3.5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <span>{t("cart.subtotal", "Subtotal")}</span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between text-xs text-rose-600 dark:text-rose-400 font-semibold">
                    <span>{isBn ? "মোট ছাড় (Savings)" : "Total Savings"}</span>
                    <span>-{formatPrice(totalSavings)}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <span>{t("cart.shipping", "Shipping")}</span>
                  {qualifiesForFreeShipping ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {isBn ? "ফ্রি (FREE)" : "FREE"}
                    </span>
                  ) : (
                    <span className="font-medium text-neutral-600 dark:text-neutral-300">
                      {isBn ? "চেকআউটে নির্ধারিত হবে" : "Calculated at checkout"}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white block">
                    {t("cart.total", "Total")}
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase">
                    {currency}
                  </span>
                </div>
                <span className="text-base sm:text-lg font-black text-neutral-950 dark:text-white tracking-tight">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Checkout Action Button */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 dark:bg-white py-3 px-4 text-xs sm:text-sm font-bold text-white dark:text-neutral-950 shadow-lg shadow-neutral-900/10 hover:opacity-95 active:scale-[0.99] transition-all"
              >
                <span>{t("cart.checkout", "Proceed to Checkout")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 pt-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                <span>
                  {isBn
                    ? "নিরাপদ ও এনক্রিপ্টেড পেমেন্ট গেটওয়ে"
                    : "Secure 256-Bit Encrypted Checkout"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
