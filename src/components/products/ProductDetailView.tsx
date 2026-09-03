"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Heart,
  Share2,
  Check,
  ShoppingBag,
  ArrowRight,
  Ruler,
  Layers,
  Flame,
} from "lucide-react";
import type { Product } from "@/features/products";
import { useTranslation, formatPrice, toBengaliDigits, getCategoryI18nName } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetailView({
  product,
  relatedProducts = [],
}: ProductDetailViewProps) {
  const { t, language, isBn } = useTranslation();

  // Images setup
  const rawImages: string[] =
    product.images && product.images.length > 0
      ? product.images.map((img) => (typeof img === "string" ? img : img?.url || ""))
      : [product.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80"];

  const [selectedImage, setSelectedImage] = useState(rawImages[0]);
  const [selectedColor, setSelectedColor] = useState(
    product.availableColors?.[0]?.color || "Onyx Black"
  );
  const [selectedSize, setSelectedSize] = useState(
    product.availableSizes?.[0] || "M"
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const price = typeof product.price === "number" ? product.price : product.basePrice || 0;
  const originalPrice = product.discountPrice ? (product.basePrice || product.price) : undefined;
  const discountPercent = originalPrice
    ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
    : 0;

  const categoryName =
    typeof product.category === "object"
      ? getCategoryI18nName(product.category.slug, product.category.name, t)
      : typeof product.category === "string"
      ? getCategoryI18nName(product.category, product.category, t)
      : isBn ? "পোশাক" : "Apparel";

  const displayName = product.title || product.name || "ZEVON Heavyweight Piece";

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* ── Breadcrumbs ────────────────────────────────────── */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
        <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
          {t("nav.home", "Home")}
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
          {t("nav.shop", "Shop")}
        </Link>
        <span>/</span>
        <span className="text-neutral-900 dark:text-white truncate max-w-xs">{displayName}</span>
      </nav>

      {/* ── Product Hero Grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery Section (Left - 7 Cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {rawImages.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 shrink-0 py-1">
              {rawImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    "relative h-18 w-18 sm:h-20 sm:w-20 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-2 transition-all shrink-0",
                    selectedImage === img
                      ? "border-neutral-950 dark:border-white shadow-md ring-2 ring-black/5"
                      : "border-transparent opacity-70 hover:opacity-100 hover:border-neutral-300 dark:hover:border-neutral-700"
                  )}
                >
                  <img
                    src={img}
                    alt={`${displayName} thumb ${idx + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Hero Preview */}
          <div className="relative flex-1 aspect-4/5 rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-800 shadow-xl group">
            <img
              src={selectedImage}
              alt={displayName}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <Badge variant="default" className="bg-neutral-950/90 text-white text-xs px-2.5 py-1 backdrop-blur-md">
                <Sparkles className="h-3 w-3 mr-1 text-amber-400" />
                {product.season || "SS/26 ARCHIVE"}
              </Badge>
              {discountPercent > 0 && (
                <Badge variant="sale" className="text-xs px-2.5 py-1">
                  <Flame className="h-3 w-3 mr-1" />
                  {isBn ? `${toBengaliDigits(discountPercent)}% ছাড়` : `${discountPercent}% OFF`}
                </Badge>
              )}
            </div>

            {/* Quick Wishlist / Share Button */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Save to Wishlist"
                className="h-10 w-10 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md flex items-center justify-center text-neutral-700 dark:text-neutral-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shadow-md"
              >
                <Heart className={cn("h-5 w-5", isWishlisted && "fill-rose-500 text-rose-500")} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Details & Actions Section (Right - 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
          {/* Header & Title */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              {categoryName}
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white leading-snug">
              {displayName}
            </h1>

            {/* Ratings & Reviews */}
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-900 dark:text-white">
                {product.averageRating || 4.9}
              </span>
              <span className="text-xs text-neutral-400">
                ({isBn ? toBengaliDigits(product.reviewCount || 48) : (product.reviewCount || 48)} {t("home.reviews", "reviews")})
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
            <span className="text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
              {formatPrice(price, language as "en" | "bn")}
            </span>
            {originalPrice && (
              <span className="text-base text-neutral-400 line-through font-semibold">
                {formatPrice(originalPrice, language as "en" | "bn")}
              </span>
            )}
            <span className="ml-auto text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {product.inStock ? t("home.inStock", "In Stock") : t("home.outOfStock", "Sold Out")}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {product.description}
          </p>

          {/* Color Selector */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  {t("cart.color", "Color")}: <span className="font-normal text-neutral-500">{selectedColor}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.availableColors.map((col: any) => {
                  const colorName = typeof col === "string" ? col : col.color || col.name;
                  const colorCode = typeof col === "string" ? "#111" : col.colorCode || col.hex || "#111";
                  const isSelected = selectedColor === colorName;

                  return (
                    <button
                      key={colorName}
                      type="button"
                      onClick={() => setSelectedColor(colorName)}
                      className={cn(
                        "group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all",
                        isSelected
                          ? "border-neutral-950 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs"
                          : "border-neutral-200 dark:border-neutral-700 bg-transparent text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
                      )}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: colorCode }}
                      />
                      <span>{colorName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  {t("cart.size", "Size")}: <span className="font-normal text-neutral-500">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  className="flex items-center gap-1 text-[11px] font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <Ruler className="h-3 w-3" />
                  <span>{isBn ? "সাইজ গাইড" : "Size Guide"}</span>
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.availableSizes.map((sz: string) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={cn(
                        "py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border",
                        isSelected
                          ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-sm"
                          : "bg-neutral-50 dark:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700/80 hover:border-neutral-400"
                      )}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="pt-2 space-y-3">
            <div className="flex gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700 transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-neutral-950 dark:text-white">
                  {isBn ? toBengaliDigits(quantity) : quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add To Bag Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-200 shadow-md",
                  isAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 active:scale-[0.98]"
                )}
              >
                {isAdded ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>{isBn ? "ব্যাগে যোগ করা হয়েছে!" : "Added to Bag!"}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>{t("home.addToBag", "Add to Bag")}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Guarantees & USPs */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400">
              <Truck className="h-4 w-4 text-neutral-900 dark:text-white shrink-0" />
              <span>{isBn ? "২৪-৪৮ ঘণ্টায় এক্সপ্রেস ডেলিভারি" : "24-48H Express Delivery"}</span>
            </div>
            <div className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400">
              <RotateCcw className="h-4 w-4 text-neutral-900 dark:text-white shrink-0" />
              <span>{isBn ? "সহজ ৭ দিনের এক্সচেঞ্জ" : "7-Day Easy Size Exchange"}</span>
            </div>
            <div className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400">
              <ShieldCheck className="h-4 w-4 text-neutral-900 dark:text-white shrink-0" />
              <span>{isBn ? "১০০% প্রিমিয়াম অর্গানিক কটন" : "100% Organic Combed Cotton"}</span>
            </div>
            <div className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400">
              <Layers className="h-4 w-4 text-neutral-900 dark:text-white shrink-0" />
              <span>{isBn ? "ক্যাশ অন ডেলিভারি সুবিধা" : "Cash on Delivery Available"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
