"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, ShoppingBag, Heart, Check, Eye, Sparkles, Layers, ShieldCheck } from "lucide-react";
import { QuickViewModal } from "@/components/home/QuickViewModal";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  brand?: string;
  category?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  secondaryImage?: string;
  badge?: string;
  colors?: ColorOption[];
  isNew?: boolean;
  inStock?: boolean;
  gsm?: string;
  description?: string;
  sizes?: string[];
  currencySymbol?: string;
}

export interface ProductCard3DProps {
  /** Product data object */
  product?: Product;
  /** Maximum tilt rotation angle in degrees (default: 12) */
  maxTiltAngle?: number;
  /** Perspective distance in pixels (default: 1000) */
  perspective?: number;
  /** Custom RGBA spotlight color overlay */
  spotlightColor?: string;
  /** Additional container CSS classes */
  className?: string;
  /** Currency symbol (default: "৳") */
  currencySymbol?: string;
  /** Callback fired when user clicks 'Add to Cart' */
  onAddToCart?: (product: Product) => void;
  /** Callback fired when user toggles wishlist */
  onWishlistToggle?: (product: Product, isWishlisted: boolean) => void;
  /** Callback fired when user clicks Quick View */
  onQuickView?: (product: Product) => void;
}

// Sample fallback product data
const DEFAULT_PRODUCT: Product = {
  id: "prod-3d-01",
  title: "Heavy French Terry Oversized Hoodie",
  brand: "ZEVON BD",
  category: "Streetwear",
  price: 2950,
  originalPrice: 3450,
  rating: 4.9,
  reviewsCount: 42,
  image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
  secondaryImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
  badge: "SALE",
  gsm: "380 GSM",
  isNew: true,
  inStock: true,
  description: "380 GSM heavy loopback cotton hoodie with dropped shoulders and relaxed fit.",
  sizes: ["S", "M", "L", "XL"],
  colors: [
    { name: "Washed Onyx", hex: "#18181b" },
    { name: "Raw Oatmeal", hex: "#e4e4e7" },
    { name: "Forest Sage", hex: "#3f6212" },
  ],
};

// ============================================================================
// MAIN LUXURY 3D TILT PRODUCT CARD COMPONENT
// ============================================================================

export function ProductCard3D({
  product = DEFAULT_PRODUCT,
  maxTiltAngle = 12,
  perspective = 1000,
  spotlightColor = "rgba(225, 29, 72, 0.12)", // Rose tint spotlight
  className = "",
  currencySymbol = "৳",
  onAddToCart,
  onWishlistToggle,
  onQuickView,
}: ProductCard3DProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Local state
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartState, setCartState] = useState<"idle" | "adding" | "added">("idle");
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0]?.hex || "#18181b"
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // --------------------------------------------------------------------------
  // MOBILE / TOUCH DETECTION GUARD
  // --------------------------------------------------------------------------
  useEffect(() => {
    const checkTouch = () => {
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const hasNoHover = window.matchMedia("(hover: none)").matches;
      setIsTouchDevice(hasCoarsePointer || hasNoHover || "ontouchstart" in window);
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  // --------------------------------------------------------------------------
  // MOTION VALUES & ANIMATION PHYSICS
  // --------------------------------------------------------------------------
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);
  const spotlightOpacity = useMotionValue(0);

  // High quality spring configuration
  const springConfig = { stiffness: 320, damping: 24, mass: 0.5 };

  const rotateXSpring = useSpring(0, springConfig);
  const rotateYSpring = useSpring(0, springConfig);
  const spotlightOpacitySpring = useSpring(spotlightOpacity, { stiffness: 200, damping: 20 });

  // --------------------------------------------------------------------------
  // 3D TILT VECTOR CALCULATIONS
  // --------------------------------------------------------------------------
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchDevice || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      spotlightX.set(x);
      spotlightY.set(y);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Normalized coordinates from -1.0 to +1.0
      const normX = (x - centerX) / centerX;
      const normY = (y - centerY) / centerY;

      // Pitch & Yaw target rotation angles
      const targetRotateX = -normY * maxTiltAngle;
      const targetRotateY = normX * maxTiltAngle;

      rotateXSpring.set(targetRotateX);
      rotateYSpring.set(targetRotateY);
    },
    [isTouchDevice, maxTiltAngle, rotateXSpring, rotateYSpring, spotlightX, spotlightY]
  );

  const handleMouseEnter = () => {
    if (isTouchDevice) return;
    setIsHovered(true);
    spotlightOpacity.set(1);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    setIsHovered(false);

    rotateXSpring.set(0);
    rotateYSpring.set(0);
    spotlightOpacity.set(0);
  };

  // Radial Spotlight background transforms
  const spotlightBackground = useTransform(
    [spotlightX, spotlightY],
    ([x, y]) =>
      `radial-gradient(400px circle at ${x}px ${y}px, ${spotlightColor}, transparent 85%)`
  );

  const borderSpotlightBackground = useTransform(
    [spotlightX, spotlightY],
    ([x, y]) =>
      `radial-gradient(300px circle at ${x}px ${y}px, rgba(225, 29, 72, 0.45), transparent 70%)`
  );

  // --------------------------------------------------------------------------
  // INTERACTION HANDLERS
  // --------------------------------------------------------------------------
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartState !== "idle") return;

    setCartState("adding");

    setTimeout(() => {
      setCartState("added");
      if (onAddToCart) onAddToCart(product);

      setTimeout(() => {
        setCartState("idle");
      }, 2000);
    }, 500);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    if (onWishlistToggle) onWishlistToggle(product, nextState);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
    if (onQuickView) onQuickView(product);
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  // Format product for QuickViewModal compatibility
  const quickViewCompatibleProduct = {
    id: product.id,
    name: product.title,
    category: "men" as const,
    subcategory: product.category || "Apparel",
    price: product.price,
    originalPrice: product.originalPrice,
    badge: (discountPercent ? "SALE" : product.isNew ? "NEW" : undefined) as any,
    images: [product.image, ...(product.secondaryImage ? [product.secondaryImage] : [])],
    colors: product.colors || [{ name: "Default", hex: "#18181b" }],
    sizes: product.sizes || ["S", "M", "L", "XL"],
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    gsm: product.gsm,
    description: product.description || product.title,
    inStock: product.inStock !== false,
  };

  return (
    <>
      {/* 1. Perspective Container */}
      <div
        className={`w-full select-none ${className}`}
        style={{
          perspective: `${perspective}px`,
        }}
      >
        {/* 2. 3D Tilting Card Surface */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: isTouchDevice ? 0 : rotateXSpring,
            rotateY: isTouchDevice ? 0 : rotateYSpring,
            transformStyle: "preserve-3d",
          }}
          whileTap={isTouchDevice ? { scale: 0.98 } : { scale: 0.995 }}
          className="group relative w-full rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-md hover:shadow-2xl transition-shadow duration-500 overflow-hidden flex flex-col justify-between"
        >
          {/* ================================================================ */}
          {/* SPOTLIGHT EFFECT OVERLAYS */}
          {/* ================================================================ */}
          {!isTouchDevice && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-3xl z-10 transition-opacity duration-300"
              style={{
                opacity: spotlightOpacitySpring,
                background: borderSpotlightBackground,
                maskImage: "linear-gradient(#black, #black) content-box, linear-gradient(#black, #black)",
                WebkitMaskImage: "linear-gradient(#black, #black) content-box, linear-gradient(#black, #black)",
                maskComposite: "exclude",
                WebkitMaskComposite: "xor",
                padding: "1.5px",
              }}
            />
          )}

          {!isTouchDevice && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 rounded-3xl transition-opacity duration-300"
              style={{
                opacity: spotlightOpacitySpring,
                background: spotlightBackground,
              }}
            />
          )}

          {/* Luxury Mesh Gradient Accents */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-40 h-40 bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-3xl group-hover:bg-rose-500/25 transition-all duration-700" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl group-hover:bg-indigo-500/25 transition-all duration-700" />

          {/* ================================================================ */}
          {/* CARD CONTENT WITH PARALLAX Z-DEPTH LAYERS */}
          {/* ================================================================ */}
          <div className="relative z-20 p-3.5 sm:p-4.5 flex flex-col h-full justify-between">
            {/* -------------------------------------------------------------- */}
            {/* IMAGE FRAME & OVERLAYS (Parallax Z: 40px) */}
            {/* -------------------------------------------------------------- */}
            <div
              className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/80 group/img"
              style={{
                transform: "translateZ(40px)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Primary Image */}
              <img
                src={product.image}
                alt={product.title}
                className={`w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-108 ${
                  product.secondaryImage && isHovered ? "opacity-0 scale-105" : "opacity-100"
                }`}
                loading="lazy"
              />

              {/* Secondary Image Swap */}
              {product.secondaryImage && (
                <img
                  src={product.secondaryImage}
                  alt={`${product.title} view 2`}
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
                    isHovered ? "opacity-100 scale-108" : "opacity-0 scale-100"
                  }`}
                  loading="lazy"
                />
              )}

              {/* Gradient Vignette for readable overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              {/* Top-Left Floating Badges (Parallax Z: 60px) */}
              <div
                className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-30"
                style={{ transform: "translateZ(60px)" }}
              >
                {discountPercent && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white px-2.5 py-1 rounded-full shadow-lg shadow-rose-500/20 backdrop-blur-md border border-white/20">
                    <Sparkles className="w-3 h-3" />
                    -{discountPercent}% OFF
                  </span>
                )}

                {product.gsm && (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-neutral-950/80 dark:bg-white/90 text-white dark:text-neutral-950 px-2.5 py-0.5 rounded-full shadow-sm backdrop-blur-md border border-white/10">
                    {product.gsm}
                  </span>
                )}
              </div>

              {/* Top-Right Quick Action Buttons (Wishlist & Quick View) */}
              <div
                className="absolute top-3 right-3 flex items-center gap-1.5 z-30"
                style={{ transform: "translateZ(60px)" }}
              >
                {/* Wishlist Heart */}
                <button
                  onClick={handleWishlistClick}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 shadow-md ${
                    isWishlisted
                      ? "bg-rose-500 text-white shadow-rose-500/30"
                      : "bg-white/80 dark:bg-neutral-900/80 text-neutral-800 dark:text-neutral-200 hover:text-rose-500 dark:hover:text-rose-400 border border-white/20 dark:border-neutral-700"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 transition-transform ${
                      isWishlisted ? "fill-white scale-110" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Quick View Button (Center Overlay on Image Hover) */}
              <div
                className="absolute inset-x-4 bottom-4 z-30 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                style={{ transform: "translateZ(60px)" }}
              >
                <button
                  onClick={handleQuickViewClick}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/95 dark:bg-neutral-900/95 text-neutral-950 dark:text-white backdrop-blur-md font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl border border-neutral-200/80 dark:border-neutral-700 hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Quick View</span>
                </button>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* PRODUCT DETAILS (Parallax Z: 25px) */}
            {/* -------------------------------------------------------------- */}
            <div
              className="mt-3.5 flex flex-col gap-1"
              style={{
                transform: "translateZ(25px)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Brand & Star Rating Row */}
              <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 dark:text-neutral-500">
                <span className="uppercase tracking-widest text-[10px] text-rose-500 dark:text-rose-400 font-extrabold">
                  {product.brand || product.category || "ZEVON BD"}
                </span>

                <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800/80 px-2 py-0.5 rounded-full border border-neutral-200/80 dark:border-neutral-700/60">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[11px] font-extrabold text-neutral-900 dark:text-white">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                    ({product.reviewsCount})
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-sm font-black text-neutral-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors mt-0.5">
                {product.title}
              </h3>

              {/* Color Swatches */}
              {product.colors && product.colors.length > 0 && (
                <div className="flex items-center gap-1.5 mt-1">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedColor(color.hex);
                      }}
                      title={color.name}
                      className={`w-3.5 h-3.5 rounded-full border transition-all ${
                        selectedColor === color.hex
                          ? "border-neutral-900 dark:border-white scale-125 shadow-xs"
                          : "border-neutral-300 dark:border-neutral-700 opacity-70 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              )}

              {/* Price Row */}
              <div className="flex items-baseline gap-2 mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                <span className="text-lg font-black text-neutral-950 dark:text-white">
                  {currencySymbol}
                  {product.price.toLocaleString()}
                </span>

                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 line-through">
                    {currencySymbol}
                    {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* CTA ADD TO CART BUTTON (Parallax Z: 45px) */}
            {/* -------------------------------------------------------------- */}
            <div
              className="mt-4"
              style={{
                transform: "translateZ(45px)",
              }}
            >
              <button
                onClick={handleAddToCartClick}
                disabled={cartState !== "idle" || !product.inStock}
                className={`w-full py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-sm ${
                  !product.inStock
                    ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
                    : cartState === "added"
                    ? "bg-emerald-500 text-white shadow-emerald-500/25"
                    : "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white dark:hover:text-white active:scale-[0.98] shadow-md"
                }`}
              >
                {cartState === "idle" && (
                  <>
                    <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{product.inStock !== false ? "Add to Cart" : "Out of Stock"}</span>
                  </>
                )}

                {cartState === "adding" && (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </>
                )}

                {cartState === "added" && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added to Cart!</span>
                  </motion.div>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick View Modal Popup */}
      <QuickViewModal
        product={quickViewCompatibleProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}

export default ProductCard3D;
