import React from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { CategoryLookbook } from "@/components/home/CategoryLookbook";
import { FeaturedNewArrivals } from "@/components/home/FeaturedNewArrivals";
import { BrandStoryUSPs } from "@/components/home/BrandStoryUSPs";
import { ShoppableUGC } from "@/components/home/ShoppableUGC";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata = {
  title: "ZEVON BD | Apparel & Lifestyle — Architectural Streetwear",
  description:
    "Explore ZEVON's SS/26 drops: 380+ GSM heavyweight cotton t-shirts, minimal co-ords, tailored cargo pants, and urban accessories crafted ethically in Bangladesh.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Banner with Parallax Ambient Glow and Floating Badges */}
      <HeroBanner />

      {/* 2. Live Flash Sale & Tiered Deal Campaign with Countdown Timer */}
      <FlashSaleSection />

      {/* 3. Category Grid / Lookbook with Hover Micro-Interactions */}
      <CategoryLookbook />

      {/* 4. Featured / New Arrivals Tabbed Product Slider with Quick View */}
      <FeaturedNewArrivals />

      {/* 5. Brand Story & Value Propositions Grid */}
      <BrandStoryUSPs />

      {/* 6. Social Proof / UGC Shoppable Instagram Hotspot Feed */}
      <ShoppableUGC />

      {/* 7. VIP Newsletter Capture with Promo Code Unlock */}
      <NewsletterSection />
    </div>
  );
}
