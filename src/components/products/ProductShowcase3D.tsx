"use client";

import React, { useState } from "react";
import ProductCard3D, { Product } from "./ProductCard3D";
import { Sparkles, Layers, ShieldCheck, Zap } from "lucide-react";

const DEMO_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    title: "Structured Oversized Trench Coat",
    brand: "ZEVON BD",
    category: "Outerwear",
    price: 4600,
    originalPrice: 5200,
    rating: 4.9,
    reviewsCount: 34,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
    badge: "SALE",
    gsm: "450 GSM",
    isNew: true,
    inStock: true,
    description: "Structured architectural trench coat with waterproof finish and custom hardware.",
    colors: [
      { name: "Oatmeal Beige", hex: "#d7c4b7" },
      { name: "Obsidian Black", hex: "#18181b" },
    ],
  },
  {
    id: "prod-2",
    title: "Pleated Wide-Leg Tonal Trousers",
    brand: "ZEVON BD",
    category: "Bottoms",
    price: 2450,
    originalPrice: 2850,
    rating: 4.8,
    reviewsCount: 19,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
    badge: "NEW",
    gsm: "320 GSM",
    isNew: true,
    inStock: true,
    colors: [
      { name: "Emerald Mint", hex: "#0d9488" },
      { name: "Charcoal Dark", hex: "#27272a" },
    ],
  },
  {
    id: "prod-3",
    title: "Ribbed Knit Crop Top & Trouser Co-ord",
    brand: "ZEVON BD",
    category: "Co-ords",
    price: 2800,
    originalPrice: 3200,
    rating: 4.9,
    reviewsCount: 52,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    badge: "BESTSELLER",
    gsm: "380 GSM",
    isNew: false,
    inStock: true,
    colors: [
      { name: "Mustard Gold", hex: "#eab308" },
      { name: "Raw Espresso", hex: "#451a03" },
    ],
  },
  {
    id: "prod-4",
    title: "Heavy French Terry Oversized Hoodie",
    brand: "ZEVON BD",
    category: "Hoodies",
    price: 2950,
    originalPrice: 3450,
    rating: 5.0,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
    badge: "SALE",
    gsm: "400 GSM",
    isNew: true,
    inStock: true,
    colors: [
      { name: "Washed Slate", hex: "#334155" },
      { name: "Pure Sand", hex: "#f5f5f4" },
    ],
  },
];

export function ProductShowcase3D() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = (product: Product) => {
    showNotification(`🛒 Added "${product.title}" to cart!`);
  };

  const handleWishlistToggle = (product: Product, isWishlisted: boolean) => {
    showNotification(
      isWishlisted
        ? `❤️ Saved "${product.title}" to wishlist`
        : `Removed "${product.title}" from wishlist`
    );
  };

  return (
    <section className="relative py-16 sm:py-24 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold text-xs uppercase tracking-widest mb-3 border border-rose-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Architectural 3D Product Cards
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 dark:text-white uppercase font-sans">
            Ultra-Modern 3D Tilt & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Spotlight Cards + Quick View
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Click Quick View on any card to test the interactive modal popup. Hover over cards for 3D depth and spotlight reflections.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-neutral-600 dark:text-neutral-400">
            <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              ⚡ Framer Motion Physics
            </span>
            <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              👁️ Quick View Modal Popup
            </span>
            <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              ৳ Dynamic Taka Currency
            </span>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {DEMO_PRODUCTS.map((prod) => (
            <ProductCard3D
              key={prod.id}
              product={prod}
              currencySymbol="৳"
              maxTiltAngle={12}
              perspective={1000}
              onAddToCart={handleAddToCart}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl border border-white/20 dark:border-black/20 animate-bounce">
          {toastMessage}
        </div>
      )}
    </section>
  );
}

export default ProductShowcase3D;
