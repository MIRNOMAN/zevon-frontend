"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Heart,
  Check,
  ShoppingBag,
  ArrowRight,
  Ruler,
  Layers,
  Flame,
  MessageSquare,
  UserCheck,
  AlertCircle,
  X,
  Send,
  Bell,
} from "lucide-react";
import type { Product, ProductReview } from "@/features/products";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
} from "@/redux/api/reviewApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser, selectIsAuthenticated } from "@/redux/features/authSlice";
import { useTranslation, useCurrency, toBengaliDigits, getCategoryI18nName } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { StockAlertModal } from "./StockAlertModal";
import Image from "next/image";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetailView({
  product,
  relatedProducts = [],
}: ProductDetailViewProps) {
  const { t, language, isBn } = useTranslation();
  const { formatPrice } = useCurrency();
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Images setup
  const rawImages: string[] =
    product.images && product.images.length > 0
      ? product.images.map((img) => (typeof img === "string" ? img : (img as any)?.url || ""))
      : [product.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80"];

  const [selectedImage, setSelectedImage] = useState(rawImages[0]);
  const [selectedColor, setSelectedColor] = useState(
    product.availableColors?.[0]?.color ||
      (product.variants?.[0]?.color ? product.variants[0].color : "Onyx Black")
  );
  const [selectedSize, setSelectedSize] = useState(
    product.availableSizes?.[0] ||
      (product.variants?.[0]?.size ? product.variants[0].size : "M")
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Live RTK Query for product reviews
  const { data: serverReviewsData, refetch: refetchReviews } = useGetProductReviewsQuery(
    { productId: product.id || product.slug },
    { skip: !product.id && !product.slug }
  );
  const [createReviewMutation] = useCreateReviewMutation();

  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);

  // Review Modal state & live reviews
  const [reviewsList, setReviewsList] = useState<ProductReview[]>(
    product.reviews || []
  );
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewName, setNewReviewName] = useState(currentUser?.name || "");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmittedSuccess, setReviewSubmittedSuccess] = useState(false);
  const [isStockAlertOpen, setIsStockAlertOpen] = useState(false);

  // Sync server reviews into reviewsList when loaded (strictly per-product)
  useEffect(() => {
    if (serverReviewsData && Array.isArray(serverReviewsData.reviews)) {
      setReviewsList(
        serverReviewsData.reviews.map((r) => ({
          id: r.id,
          rating: Number(r.rating) || 5,
          comment: r.comment,
          images: r.images || [],
          isVerifiedPurchase: r.isVerifiedPurchase ?? true,
          createdAt: r.createdAt,
          user: r.user || { id: "u", name: "Verified Customer", avatarUrl: null },
        }))
      );
    } else {
      setReviewsList(product.reviews || []);
    }
  }, [serverReviewsData, product.id, product.slug, product.reviews]);

  // Filtered reviews by star selection
  const displayedReviews = useMemo(() => {
    if (selectedStarFilter === null) return reviewsList;
    return reviewsList.filter((r) => r.rating === selectedStarFilter);
  }, [reviewsList, selectedStarFilter]);

  // Dynamic live average rating and star breakdown
  const liveAverageRating = useMemo(() => {
    if (serverReviewsData?.aggregate?.averageRating && serverReviewsData.aggregate.totalReviews > 0) {
      return Number(serverReviewsData.aggregate.averageRating.toFixed(1));
    }
    if (reviewsList.length === 0) return 5.0;
    const sum = reviewsList.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    return Number((sum / reviewsList.length).toFixed(1));
  }, [serverReviewsData, reviewsList]);

  const starBreakdown = useMemo(() => {
    if (serverReviewsData?.aggregate?.breakdown) {
      return serverReviewsData.aggregate.breakdown;
    }
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of reviewsList) {
      const star = Math.round(Number(r.rating)) || 5;
      if (counts[star] !== undefined) {
        counts[star] = (counts[star] || 0) + 1;
      }
    }
    return counts;
  }, [serverReviewsData, reviewsList]);

  // Determine current active variant & its exact stock quantity
  const activeVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null;
    return (
      product.variants.find(
        (v) =>
          v.color.toLowerCase().trim() === selectedColor.toLowerCase().trim() &&
          v.size.toUpperCase().trim() === selectedSize.toUpperCase().trim()
      ) || product.variants[0]
    );
  }, [product.variants, selectedColor, selectedSize]);

  const currentVariantStock = activeVariant ? activeVariant.stock : (product.totalStock ?? 25);
  const isVariantOutOfStock = currentVariantStock <= 0;
  const isLowStock = currentVariantStock > 0 && currentVariantStock <= 5;

  const price = typeof product.price === "number" ? product.price : product.basePrice || 0;
  const originalPrice = product.discountPrice ? (product.basePrice || product.price) : undefined;
  const discountPercent = originalPrice
    ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
    : 0;

  const categoryName =
    typeof product.category === "object"
      ? getCategoryI18nName((product.category as any).slug, (product.category as any).name, t)
      : typeof product.category === "string"
      ? getCategoryI18nName(product.category, product.category, t)
      : isBn ? "পোশাক" : "Apparel";

  const displayName = product.title || product.name || "ZEVON Heavyweight Piece";
  const isWishlisted = isInWishlist(product.id) || (product.slug ? isInWishlist(product.slug) : false);

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      title: displayName,
      name: displayName,
      slug: product.slug,
      price,
      basePrice: product.basePrice,
      discountPrice: product.discountPrice,
      image: selectedImage,
      category: product.category,
    });
  };

  const handleAddToCart = async () => {
    if (isVariantOutOfStock) return;
    setIsAdded(true);
    const variantToUse = activeVariant || product.variants?.[0] || {
      id: product.id,
      size: selectedSize,
      color: selectedColor,
      extraPrice: 0,
      stock: 50,
    };

    const variantId = (variantToUse.id || product.id) as string;

    await addToCart({
      productVariantId: variantId,
      quantity,
      product,
      variant: {
        ...variantToUse,
        id: variantId,
        extraPrice: Number(variantToUse.extraPrice || 0),
      },
    });

    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    setIsSubmittingReview(true);
    const authorName =
      newReviewName.trim() ||
      currentUser?.name ||
      (isBn ? "ভেরিফাইড ক্রেতা" : "Verified Customer");

    const newRev: ProductReview = {
      id: `rev_${Date.now()}`,
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      isVerifiedPurchase: true,
      createdAt: new Date().toISOString(),
      user: {
        id: currentUser?.id || `usr_${Date.now()}`,
        name: authorName,
        avatarUrl: currentUser?.avatarUrl || null,
      },
    };

    try {
      if (isAuthenticated) {
        await createReviewMutation({
          productId: product.id,
          rating: newReviewRating,
          comment: newReviewComment.trim(),
        }).unwrap();
        refetchReviews();
      }
    } catch {
      // Keep optimistic local update
    }

    setReviewsList([newRev, ...reviewsList.filter((r) => r.id !== newRev.id)]);
    setIsSubmittingReview(false);
    setReviewSubmittedSuccess(true);
    setTimeout(() => {
      setReviewSubmittedSuccess(false);
      setIsReviewModalOpen(false);
      setNewReviewComment("");
      setNewReviewName("");
    }, 1500);
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
                  <Image
                    src={img}
                    alt={`${displayName} thumb ${idx + 1}`}
                    fill
                    className="object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Hero Preview */}
          <div className="relative flex-1 aspect-4/5 rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-800 shadow-xl group">
            <Image
              src={selectedImage || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80"}
              alt={displayName}
              width={500}
              height={500}
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
                onClick={() =>
                  toggleWishlist({
                    id: product.id,
                    title: displayName,
                    name: displayName,
                    slug: product.slug,
                    price,
                    basePrice: product.basePrice,
                    discountPrice: product.discountPrice,
                    image: selectedImage,
                    category: product.category,
                  })
                }
                aria-label="Save to Wishlist"
                className="h-10 w-10 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md flex items-center justify-center text-neutral-700 dark:text-neutral-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shadow-md active:scale-90"
              >
                <Heart className={cn("h-5 w-5 transition-transform", isWishlisted && "fill-rose-500 text-rose-500 scale-110")} />
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
                {reviewsList.length > 0 ? liveAverageRating : "5.0"}
              </span>
              <a
                href="#customer-reviews"
                className="text-xs text-neutral-500 dark:text-neutral-400 underline underline-offset-2 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                ({isBn ? toBengaliDigits(reviewsList.length) : reviewsList.length} {isBn ? "টি রিভিউ" : "reviews"})
              </a>
            </div>
          </div>

          {/* Price Box */}
          <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
            <span className="text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="text-base text-neutral-400 line-through font-semibold">
                {formatPrice(originalPrice)}
              </span>
            )}
            <div className="ml-auto flex items-center gap-1.5 text-xs font-bold">
              {isVariantOutOfStock ? (
                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  {isBn ? "স্টক শেষ (Sold Out)" : "Sold Out"}
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {isBn ? "স্টকে আছে" : "In Stock"}
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Stock Quantity Urgency Indicator */}
          <div className="px-4 py-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-900 dark:bg-white" />
              <span>
                {isBn ? "বর্তমান ভ্যারিয়েন্ট স্টক:" : "Selected Variant Stock:"}
              </span>
            </div>
            <div>
              {isVariantOutOfStock ? (
                <span className="text-rose-600 font-bold">{isBn ? "০ টি" : "0 units"}</span>
              ) : isLowStock ? (
                <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 animate-pulse">
                  <Flame className="h-3.5 w-3.5" />
                  {isBn
                    ? `মাত্র ${toBengaliDigits(currentVariantStock)} টি বাকি আছে!`
                    : `Only ${currentVariantStock} left in stock - order soon!`}
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {isBn
                    ? `${toBengaliDigits(currentVariantStock)} টি স্টকে রয়েছে`
                    : `${currentVariantStock} units available`}
                </span>
              )}
            </div>
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
                <Link
                  href="/size-guide"
                  className="flex items-center gap-1 text-[11px] font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <Ruler className="h-3 w-3" />
                  <span>{isBn ? "সাইজ গাইড" : "Size Guide"}</span>
                </Link>
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
                  disabled={isVariantOutOfStock || quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700 disabled:opacity-30 transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-neutral-950 dark:text-white">
                  {isBn ? toBengaliDigits(quantity) : quantity}
                </span>
                <button
                  type="button"
                  disabled={isVariantOutOfStock || quantity >= currentVariantStock}
                  onClick={() => setQuantity(Math.min(currentVariantStock, quantity + 1))}
                  className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700 disabled:opacity-30 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add To Bag Button */}
              <button
                type="button"
                disabled={isVariantOutOfStock}
                onClick={handleAddToCart}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-200 shadow-md",
                  isVariantOutOfStock
                    ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : isAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 active:scale-[0.98]"
                )}
              >
                {isVariantOutOfStock ? (
                  <span>{isBn ? "স্টক শেষ (Sold Out)" : "Sold Out"}</span>
                ) : isAdded ? (
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

              {/* Wishlist Toggle Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={cn(
                  "flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-sm border transition-all duration-200 shadow-sm active:scale-95",
                  isWishlisted
                    ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-400"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-700"
                )}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isWishlisted ? "fill-rose-500 text-rose-500 scale-110" : ""
                  )}
                />
              </button>
            </div>

            {/* Back in stock Alert CTA */}
            {isVariantOutOfStock && (
              <button
                type="button"
                onClick={() => setIsStockAlertOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition-all shadow-xs"
              >
                <Bell className="h-4 w-4 text-amber-500 shrink-0" />
                <span>
                  {isBn
                    ? "এই সাইজ স্টকে আসলে নোটিফিকেশন চান? (Notify Me)"
                    : "Notify Me When Available"}
                </span>
              </button>
            )}
          </div>

          {/* Guarantees & USPs */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-5 grid grid-cols-2 gap-3 text-xs">
            <Link
              href="/shipping"
              className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors group"
            >
              <Truck className="h-4 w-4 text-neutral-900 dark:text-white shrink-0 group-hover:scale-110 transition-transform" />
              <span>{isBn ? "২৪-৪৮ ঘণ্টায় এক্সপ্রেস ডেলিভারি" : "24-48H Express Delivery"}</span>
            </Link>
            <Link
              href="/returns"
              className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors group"
            >
              <RotateCcw className="h-4 w-4 text-neutral-900 dark:text-white shrink-0 group-hover:scale-110 transition-transform" />
              <span>{isBn ? "সহজ ৭ দিনের এক্সচেঞ্জ" : "7-Day Easy Size Exchange"}</span>
            </Link>
            <Link
              href="/size-guide"
              className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors group"
            >
              <ShieldCheck className="h-4 w-4 text-neutral-900 dark:text-white shrink-0 group-hover:scale-110 transition-transform" />
              <span>{isBn ? "১০০% প্রিমিয়াম অর্গানিক কটন" : "100% Organic Combed Cotton"}</span>
            </Link>
            <div className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400">
              <Layers className="h-4 w-4 text-neutral-900 dark:text-white shrink-0" />
              <span>{isBn ? "ক্যাশ অন ডেলিভারি সুবিধা" : "Cash on Delivery Available"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Dynamic Customer Reviews & Ratings Section ────────────── */}
      <section id="customer-reviews" className="mt-16 sm:mt-24 pt-12 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{isBn ? "গ্রাহকদের মতামত ও মূল্যায়ন" : "Verified Customer Reviews"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 dark:text-white mt-1">
              {isBn ? "রেটিং ও কাস্টমার রিভিউ" : "Ratings & Real Feedback"}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsReviewModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold tracking-wide hover:opacity-90 transition-opacity"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{isBn ? "রিভিউ লিখুন" : "Write a Review"}</span>
          </button>
        </div>

        {/* Rating Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 mb-8">
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-700">
            <span className="text-5xl font-black text-neutral-950 dark:text-white tracking-tighter">
              {reviewsList.length > 0 ? liveAverageRating : (isBn ? "নতুন" : "5.0")}
            </span>
            <div className="flex items-center text-amber-500 my-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-5 w-5",
                    i < Math.round(liveAverageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-neutral-300 dark:text-neutral-700"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {reviewsList.length === 0
                ? isBn
                  ? "এখনো কোনো রিভিউ দেওয়া হয়নি"
                  : "No reviews yet • Be the first to review"
                : isBn
                ? `${toBengaliDigits(reviewsList.length)} টি ভেরিফাইড রিভিউয়ের ওপর ভিত্তি করে`
                : `Based on ${reviewsList.length} verified customer reviews`}
            </span>
          </div>

          {/* Star Distribution Progress Bars */}
          <div className="md:col-span-8 flex flex-col justify-center space-y-2 px-2 sm:px-6">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = starBreakdown[stars as 1 | 2 | 3 | 4 | 5] || 0;
              const percent =
                reviewsList.length > 0
                  ? Math.round((count / reviewsList.length) * 100)
                  : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  <span className="w-12 text-right shrink-0 flex items-center justify-end gap-1">
                    <span>{isBn ? toBengaliDigits(stars) : stars}</span>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-10 text-xs font-medium text-neutral-400 text-right">
                    {isBn ? toBengaliDigits(count) : count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Star Rating Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setSelectedStarFilter(null)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border",
              selectedStarFilter === null
                ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-xs"
                : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
            )}
          >
            {isBn ? "সকল রিভিউ" : "All Reviews"} ({reviewsList.length})
          </button>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = starBreakdown[stars as 1 | 2 | 3 | 4 | 5] || 0;
            return (
              <button
                key={stars}
                type="button"
                onClick={() => setSelectedStarFilter(selectedStarFilter === stars ? null : stars)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all border",
                  selectedStarFilter === stars
                    ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-xs"
                    : "bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
                )}
              >
                <span>{isBn ? toBengaliDigits(stars) : stars}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="opacity-70">({isBn ? toBengaliDigits(count) : count})</span>
              </button>
            );
          })}
        </div>

        {/* Reviews List */}
        {displayedReviews.length === 0 ? (
          <div className="text-center py-10 rounded-2xl bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-500">
            {isBn ? "এই রেটিংয়ে কোনো রিভিউ পাওয়া যায়নি" : "No reviews found for this star rating."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-black text-xs text-neutral-800 dark:text-neutral-200 overflow-hidden border border-neutral-200/60 dark:border-neutral-700/60">
                    {rev.user?.avatarUrl ? (
                      <img src={rev.user.avatarUrl} alt={rev.user.name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{(rev.user?.name || "U")[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-950 dark:text-white">
                      {rev.user?.name || "Customer"}
                    </h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <UserCheck className="h-3 w-3" />
                      <span>{isBn ? "ভেরিফাইড ক্রেতা" : "Verified Buyer"}</span>
                    </span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn("h-3.5 w-3.5", i < rev.rating ? "fill-amber-400 text-amber-400" : "text-neutral-200 dark:text-neutral-700")}
                    />
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                &ldquo;{rev.comment}&rdquo;
              </p>

              {/* Date */}
              <div className="text-[10px] text-neutral-400 pt-1">
                {new Date(rev.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
        )}
      </section>

      {/* ── Write A Review Modal ────────────────────────────── */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-neutral-900 p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                {isBn ? "পণ্যটির রিভিউ দিন" : "Review This Product"}
              </h3>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {reviewSubmittedSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {isBn ? "আপনার রিভিউ সফলভাবে যুক্ত হয়েছে!" : "Thank you! Your review has been submitted."}
                </h4>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Star rating picker */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {isBn ? "আপনার রেটিং সিলেক্ট করুন:" : "Select your rating:"}
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className="p-1 text-neutral-300 hover:scale-110 transition-transform focus:outline-none"
                      >
                        <Star
                          className={cn(
                            "h-6 w-6",
                            star <= newReviewRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-neutral-300 dark:text-neutral-700"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {isBn ? "আপনার নাম:" : "Your Name:"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    placeholder={isBn ? "নাম লিখুন..." : "e.g. Tanvir Ahmed"}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {isBn ? "আপনার অভিজ্ঞতা লিখুন:" : "Your Review:"}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder={isBn ? "কাপড়ের কোয়ালিটি, সাইজ এবং ফিটিং কেমন লেগেছে লিখুন..." : "Describe the fabric quality, drape, and overall fit..."}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold tracking-wide flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmittingReview ? (isBn ? "জমা হচ্ছে..." : "Submitting...") : (isBn ? "রিভিউ সাবমিট করুন" : "Submit Review")}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Back-in-Stock Alert Modal ──────────────────────── */}
      <StockAlertModal
        isOpen={isStockAlertOpen}
        onClose={() => setIsStockAlertOpen(false)}
        productTitle={displayName}
        productImage={selectedImage}
        variantId={activeVariant?.id || product.id}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
      />
    </div>
  );
}
