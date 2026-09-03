"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Flame,
  Compass,
  Truck,
  RotateCcw,
  Crown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetBannersQuery } from "@/redux/api/bannerApi";
import type { Banner } from "@/features/banners";

// Fallback banner if backend is initializing or has no entries
const DEFAULT_BANNERS: Banner[] = [
  {
    id: "default-1",
    title: "URBAN LUXURY. MINIMALIST ESSENCE.",
    subtitle:
      "Architectural silhouettes engineered with 380+ GSM super-combed organic cotton. Designed for the modern wardrobe and crafted ethically in Bangladesh.",
    badge: "SS/26 Collection Now Live • Drop 01",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&auto=format&fit=crop&q=80",
    mobileImageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
    ctaText: "Explore New Drops",
    linkUrl: "/shop?filter=new",
    placement: "HERO",
    sortOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MARQUEE_ITEMS = [
  {
    icon: <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />,
    text: "SS/26 DROPS NOW LIVE",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
  },
  {
    icon: <Truck className="h-4 w-4 text-sky-500 shrink-0" />,
    text: "FREE NATIONWIDE SHIPPING OVER ৳3000",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
  },
  {
    icon: <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />,
    text: "380 GSM HEAVYWEIGHT COTTON",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    icon: <RotateCcw className="h-4 w-4 text-violet-500 shrink-0" />,
    text: "7-DAY HASSLE-FREE EXCHANGES",
    gradient: "from-violet-500 via-purple-500 to-pink-500",
  },
  {
    icon: <Compass className="h-4 w-4 text-rose-500 shrink-0" />,
    text: "ETHICALLY CRAFTED IN BANGLADESH",
    gradient: "from-rose-500 via-red-500 to-amber-500",
  },
  {
    icon: <Flame className="h-4 w-4 text-orange-500 shrink-0" />,
    text: "LIMITED ARCHIVE DROPS",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
  },
  {
    icon: <Crown className="h-4 w-4 text-purple-400 shrink-0" />,
    text: "PREMIUM STREETWEAR & LIFESTYLE",
    gradient: "from-indigo-400 via-purple-400 to-pink-400",
  },
];

const SLIDE_DURATION = 6500; // 6.5s per slide

export function HeroBanner() {
  const { data: serverBanners, isLoading } = useGetBannersQuery({
    placement: "HERO",
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const fallbackBanner = DEFAULT_BANNERS[0]!;
  const bannersList =
    serverBanners && serverBanners.length > 0
      ? serverBanners
      : DEFAULT_BANNERS;

  const bannerCount = bannersList.length;
  const currentBanner: Banner =
    bannersList[currentIndex % bannerCount] ?? fallbackBanner;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % bannerCount);
  }, [bannerCount]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + bannerCount) % bannerCount);
  }, [bannerCount]);

  // Autoplay timer with pause on hover
  useEffect(() => {
    if (bannerCount <= 1 || isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [bannerCount, isPaused, handleNext]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0]?.clientX ?? null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Helper to format title with split gradient emphasis
  const renderFormattedTitle = (title: string) => {
    if (!title) return null;

    if (title.includes(".")) {
      const parts = title.split(".");
      const firstPart = parts[0]?.trim();
      const secondPart = parts.slice(1).join(".").trim();

      return (
        <>
          {firstPart}. {secondPart && <br className="hidden sm:inline" />}
          {secondPart && (
            <span className="bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-500 dark:from-white dark:via-neutral-300 dark:to-neutral-500 bg-clip-text text-transparent">
              {secondPart}
            </span>
          )}
        </>
      );
    }

    if (title.includes("\n")) {
      const parts = title.split("\n");
      return (
        <>
          {parts[0]} <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-500 dark:from-white dark:via-neutral-300 dark:to-neutral-500 bg-clip-text text-transparent">
            {parts.slice(1).join(" ")}
          </span>
        </>
      );
    }

    // Default: split words to style last words with gradient
    const words = title.split(" ");
    if (words.length > 2) {
      const splitAt = Math.ceil(words.length / 2);
      const firstHalf = words.slice(0, splitAt).join(" ");
      const secondHalf = words.slice(splitAt).join(" ");
      return (
        <>
          {firstHalf} <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-500 dark:from-white dark:via-neutral-300 dark:to-neutral-500 bg-clip-text text-transparent">
            {secondHalf}
          </span>
        </>
      );
    }

    return title;
  };

  // Helper to parse badge text (e.g. "SS/26 Collection Now Live • Drop 01")
  const renderBadge = (badge?: string | null) => {
    const rawBadge = badge || "SS/26 Collection Now Live • Drop 01";
    const parts = rawBadge.split(/•|\|/);
    const mainText = parts[0]?.trim() || rawBadge;
    const tagText = parts[1]?.trim();

    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 dark:bg-neutral-800/80 px-3.5 py-1.5 border border-neutral-200/80 dark:border-neutral-700/60 shadow-xs animate-in fade-in slide-in-from-top-3 duration-500">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
          {mainText}
        </span>
        {tagText && (
          <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-950">
            {tagText}
          </span>
        )}
      </div>
    );
  };

  return (
    <section
      className="relative overflow-hidden border-b border-foreground/10 bg-background pt-8 pb-0 sm:pt-12 lg:pt-16 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Decorative Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[36rem] w-[48rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-neutral-200 via-neutral-100 to-transparent dark:from-neutral-900/60 dark:via-neutral-800/30 dark:to-transparent opacity-70 blur-3xl transition-opacity duration-1000"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-40 -z-10 h-80 w-80 rounded-full bg-rose-500/10 dark:bg-rose-500/5 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 lg:pb-28 relative">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center min-h-[440px]">
          {/* Left Column: Text & CTAs */}
          <div
            key={`text-${currentBanner.id}-${currentIndex}`}
            className="lg:col-span-7 text-center lg:text-left space-y-6 animate-in fade-in slide-in-from-left-4 duration-500"
          >
            {/* Top Season Pill Badge */}
            {renderBadge(currentBanner.badge)}

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-950 dark:text-white leading-[1.08]">
              {renderFormattedTitle(currentBanner.title)}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {currentBanner.subtitle ||
                "Architectural silhouettes engineered with 380+ GSM super-combed organic cotton. Designed for the modern wardrobe and crafted ethically in Bangladesh."}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link
                href={currentBanner.linkUrl || "/shop?filter=new"}
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto font-bold tracking-wide gap-2 group shadow-lg shadow-neutral-900/10 dark:shadow-none transition-all duration-200"
                >
                  {currentBanner.ctaText || "Explore New Drops"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link href="/sale" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto font-bold tracking-wide gap-2 border-neutral-300 dark:border-neutral-700"
                >
                  <Flame className="h-4 w-4 text-rose-500" />
                  Shop Seasonal Sale
                </Button>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-6 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-center lg:justify-start gap-6 sm:gap-10 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              <div>
                <span className="block text-base font-extrabold text-neutral-900 dark:text-white">
                  380+ GSM
                </span>
                Heavyweight Cotton
              </div>
              <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
              <div>
                <span className="block text-base font-extrabold text-neutral-900 dark:text-white">
                  24-48h
                </span>
                Express Delivery
              </div>
              <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
              <div>
                <span className="block text-base font-extrabold text-neutral-900 dark:text-white">
                  4.9 / 5
                </span>
                Verified Reviews
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Presentation with Floating Badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Visual Image Container with Shadow & Rounded Frames */}
            <div
              key={`image-${currentBanner.id}-${currentIndex}`}
              className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xl group animate-in fade-in zoom-in-95 duration-500"
            >
              {/* Responsive Image Presentation */}
              <picture>
                {currentBanner.mobileImageUrl && (
                  <source
                    media="(max-width: 640px)"
                    srcSet={currentBanner.mobileImageUrl}
                  />
                )}
                <img
                  src={currentBanner.imageUrl}
                  alt={currentBanner.title || "ZEVON Collection"}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
              </picture>

              {/* Gradient Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Bottom Card Summary */}
              <div className="absolute bottom-5 left-5 right-5 text-white p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="pr-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">
                      {currentBanner.badge || "Signature Look"}
                    </span>
                    <h3 className="text-sm font-extrabold tracking-tight line-clamp-1">
                      {currentBanner.title}
                    </h3>
                  </div>
                  <Link
                    href={currentBanner.linkUrl || "/shop?filter=new"}
                    className="flex h-8 w-8 items-center justify-center shrink-0 rounded-full bg-white text-neutral-950 hover:scale-110 active:scale-95 transition-transform shadow-md"
                    aria-label="Shop this look"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating Interactive Badge: Top-Left (Organic Cotton) */}
            <div className="absolute -top-4 -left-3 sm:-left-6 hidden sm:flex items-center gap-2.5 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 p-3 shadow-xl animate-in zoom-in-90 duration-500">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="text-left pr-2">
                <p className="text-[11px] font-bold text-neutral-900 dark:text-white">
                  100% Organic Fabric
                </p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                  Pre-shrunk &amp; combed
                </p>
              </div>
            </div>

            {/* Floating Interactive Badge: Bottom-Right (Engineered in BD) */}
            <div className="absolute -bottom-4 -right-3 sm:-right-6 hidden sm:flex items-center gap-2.5 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 p-3 shadow-xl animate-in zoom-in-90 duration-700">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white">
                <Compass className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="text-left pr-2">
                <p className="text-[11px] font-bold text-neutral-900 dark:text-white">
                  Crafted in Bangladesh
                </p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                  Global Streetwear Standards
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Slide Navigation Controls & Pagination Dots (if > 1 banner) */}
        {bannerCount > 1 && (
          <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-100 dark:border-neutral-800/60">
            {/* Pagination Tracks / Progress Pills */}
            <div className="flex items-center gap-2">
              {bannersList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-8 bg-neutral-950 dark:bg-white shadow-xs"
                      : "w-2.5 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
              <span className="text-[11px] font-bold text-neutral-400 ml-2 font-mono">
                0{currentIndex + 1} / 0{bannerCount}
              </span>
            </div>

            {/* Arrow Nav Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous slide"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-xs active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next slide"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-xs active:scale-95"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Marquee Ticker Tape Banner with react-fast-marquee & Gradient Text */}
      <div className="border-y border-neutral-200 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-950/80 py-3.5 backdrop-blur-xs">
        <Marquee
          speed={50}
          pauseOnHover={true}
          gradient={false}
          className="overflow-hidden"
        >
          {MARQUEE_ITEMS.map((item, index) => (
            <div key={index} className="flex items-center mx-6 sm:mx-8 gap-3">
              {/* Dynamic Icon */}
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
                {item.icon}
              </div>

              {/* Gradient Text */}
              <span
                className={`text-xs sm:text-sm font-black uppercase tracking-wider bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}
              >
                {item.text}
              </span>

              {/* Separator */}
              <span className="text-neutral-300 dark:text-neutral-700 ml-4 font-black">
                ✦
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
