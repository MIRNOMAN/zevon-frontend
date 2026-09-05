"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  Check,
  Package,
  Loader2,
} from "lucide-react";
import { useWishlist, WishlistProductItem } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useTranslation, useCurrency, toBengaliDigits } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function WishlistView() {
  const { t, isBn } = useTranslation();
  const { formatPrice } = useCurrency();
  const { wishlistItems, wishlistCount, removeFromWishlist, clearWishlist, isMounted, isLoading } = useWishlist();
  const { addToCart } = useCart();
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const handleAddToCart = async (item: WishlistProductItem) => {
    setAddedMap((prev) => ({ ...prev, [item.id]: true }));
    const productSlug =
      item.slug ||
      (item.title || item.name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    await addToCart({
      productVariantId: item.id,
      quantity: 1,
      product: {
        id: item.id,
        title: item.title || item.name,
        name: item.title || item.name,
        slug: productSlug,
        basePrice: item.basePrice || item.price,
        discountPrice: item.discountPrice,
        category: item.category,
        primaryImage: item.image ? { url: item.image, altText: item.title, isPrimary: true } : null,
      },
      variant: {
        id: item.id,
        size: "M",
        color: "Standard",
        extraPrice: 0,
        imageUrl: item.image,
      },
    });

    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-[70vh] bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* ── Breadcrumbs ────────────────────────────────────── */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            {t("nav.home", "Home")}
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white">{t("wishlist.title", "My Wishlist")}</span>
        </nav>

        {/* ── Page Header ────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
              <span>
                {t("wishlist.title", "My Wishlist")}
                {isMounted && wishlistCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[11px] font-bold text-neutral-900 dark:text-white">
                    {isBn ? toBengaliDigits(wishlistCount) : wishlistCount}
                  </span>
                )}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white mt-1.5">
              {t("wishlist.title", "My Wishlist")}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
              {t("wishlist.subtitle", "Curated streetwear essentials and archive pieces saved for later.")}
            </p>
          </div>

          {isMounted && wishlistItems.length > 0 && (
            <button
              type="button"
              onClick={() => clearWishlist()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-rose-600 dark:text-neutral-400 dark:hover:text-rose-400 transition-colors self-start sm:self-auto py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-rose-200 dark:hover:border-rose-900/50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{isBn ? "সব মুছে ফেলুন" : "Clear All"}</span>
            </button>
          )}
        </div>

        {/* ── Main Content ───────────────────────────────────── */}
        {!isMounted || isLoading ? (
          /* Loading Skeleton State */
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-3xl bg-neutral-100 dark:bg-neutral-900 p-4 space-y-3 animate-pulse border border-neutral-200/50 dark:border-neutral-800"
              >
                <div className="aspect-[3/4] w-full rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-9 w-full rounded-xl bg-neutral-200 dark:bg-neutral-800" />
              </div>
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="py-20 sm:py-28 text-center space-y-4 max-w-md mx-auto">
            <div className="h-20 w-20 rounded-3xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mx-auto shadow-inner">
              <Heart className="h-10 w-10 text-neutral-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white">
              {t("wishlist.emptyTitle", "Your Wishlist is Empty")}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {t(
                "wishlist.emptyDesc",
                "Save items you love by tapping the heart icon on any product. They'll be saved here for your next drop."
              )}
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold tracking-wide hover:opacity-90 transition-opacity shadow-md"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>{t("wishlist.exploreDrops", "Explore New Drops")}</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistItems.map((item) => {
              const price = item.discountPrice || item.basePrice || item.price || 0;
              const originalPrice = item.discountPrice ? (item.basePrice || item.price) : undefined;
              const isAdded = !!addedMap[item.id];
              const productSlug =
                item.slug ||
                (item.title || item.name || "")
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");

              const imgUrl =
                item.image ||
                (item.images && item.images.length > 0 ? item.images[0] : "") ||
                "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-3 sm:p-4 shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  {/* Image & Badges */}
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-950">
                    <Link href={`/products/${productSlug}`}>
                      <img
                        src={imgUrl}
                        alt={item.title || item.name || "Product"}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item.id)}
                      title={t("wishlist.remove", "Remove from Wishlist")}
                      className="absolute top-2.5 right-2.5 z-10 h-8 w-8 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md flex items-center justify-center text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shadow-xs"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="mt-3 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <Link
                        href={`/products/${productSlug}`}
                        className="block text-xs sm:text-sm font-bold text-neutral-950 dark:text-white tracking-tight line-clamp-1 hover:underline"
                      >
                        {item.title || item.name}
                      </Link>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm sm:text-base font-black text-neutral-950 dark:text-white">
                          {formatPrice(price)}
                        </span>
                        {originalPrice && (
                          <span className="text-xs text-neutral-400 line-through font-semibold">
                            {formatPrice(originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Bag Action */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className={cn(
                        "w-full py-2.5 px-3 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all shadow-xs",
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 active:scale-[0.98]"
                      )}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>{isBn ? "যোগ করা হয়েছে!" : "Added!"}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>{t("wishlist.moveToBag", "Add to Bag")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
