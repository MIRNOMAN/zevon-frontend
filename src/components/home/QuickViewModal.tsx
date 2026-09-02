"use client";

import React, { useState, useEffect } from "react";
import { X, ShoppingBag, Heart, Star, Check, ShieldCheck } from "lucide-react";
import { Product } from "./homeData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, size: string, color: string, qty: number) => void;
}

export function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0]?.name || "");
  const [quantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!product) return null;

  const handleAdd = () => {
    setIsAdded(true);
    if (onAddToCart) {
      onAddToCart(product, selectedSize, selectedColor, quantity);
    }
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden transition-all duration-300",
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      )}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div
        className={cn(
          "relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl z-10 max-h-[90vh] flex flex-col md:flex-row transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        )}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product preview"
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white shadow-md transition-colors focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left: Product Images Gallery */}
        <div className="md:w-1/2 bg-neutral-100 dark:bg-neutral-950 relative flex flex-col justify-between p-4">
          {/* Main Selected Image */}
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.badge && (
              <div className="absolute top-3 left-3">
                <Badge
                  variant={product.badge === "SALE" ? "sale" : "new"}
                  className="text-xs uppercase font-black px-2.5 py-0.5"
                >
                  {product.badge}
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 mt-3 justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    "h-14 w-14 rounded-xl overflow-hidden border-2 transition-all",
                    selectedImage === idx
                      ? "border-neutral-900 dark:border-white scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                {product.subcategory}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="h-3.5 w-3.5 fill-amber-500" />
                <span>{product.rating}</span>
                <span className="text-neutral-400">({product.reviewsCount})</span>
              </div>
            </div>

            {/* Title & Price */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                {product.name}
              </h2>
              <div className="flex items-center gap-2.5 mt-2">
                <span className="text-xl font-extrabold text-neutral-950 dark:text-white">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-semibold text-neutral-400 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-xs font-black text-rose-500">
                    SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
            </div>

            {/* GSM & Specs Badge */}
            <div className="flex flex-wrap gap-2 pt-1">
              {product.gsm && (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                  {product.gsm} Heavyweight
                </span>
              )}
              {product.fit && (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                  {product.fit}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {product.description}
            </p>

            {/* Color Swatches */}
            {product.colors.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-neutral-700 dark:text-neutral-300">
                    Color: <span className="font-medium text-neutral-500">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      className={cn(
                        "h-7 w-7 rounded-full border-2 transition-all p-0.5 flex items-center justify-center",
                        selectedColor === c.name
                          ? "border-neutral-900 dark:border-white scale-110"
                          : "border-transparent"
                      )}
                    >
                      <span
                        className="h-full w-full rounded-full border border-black/10"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-neutral-700 dark:text-neutral-300">
                    Select Size:
                  </span>
                  <button type="button" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={cn(
                        "h-9 min-w-10 px-3 rounded-xl text-xs font-bold transition-all border",
                        selectedSize === s
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-xs"
                          : "border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-6 space-y-3">
            <div className="flex gap-3">
              <Button
                onClick={handleAdd}
                size="lg"
                className="flex-1 font-bold tracking-wide gap-2"
              >
                {isAdded ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    Added to Bag!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    Add to Bag • ৳{product.price.toLocaleString()}
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Wishlist toggle"
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl border transition-colors",
                  isWishlisted
                    ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-500"
                    : "border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                )}
              >
                <Heart className={cn("h-5 w-5", isWishlisted && "fill-rose-500")} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 dark:text-neutral-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Authentic ZEVON Guarantee • 7-Day Doorstep Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
