"use client";

import React from "react";
import Link from "next/link";
import {
  Leaf,
  Droplets,
  Recycle,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Globe2,
  TreePine,
  Loader2,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useGetSustainabilityStoriesQuery } from "@/redux/api/sustainabilityApi";
import { Button } from "@/components/ui/button";

export function SustainabilityView() {
  const { t, isBn } = useTranslation();
  const { data: storiesRes, isLoading } = useGetSustainabilityStoriesQuery();

  const stories = storiesRes?.data || [
    {
      id: "1",
      title: "380+ GSM 100% GOTS Certified Organic Cotton",
      slug: "organic-heavyweight-cotton",
      summary:
        "We engineer our signature heavy fleece and jersey with unblended organic combed cotton sourced from certified sustainable agricultural farms.",
      content:
        "At ZEVON, weight is substance. Our 380–420 GSM textiles are crafted without synthetic fillers or micro-plastics, ensuring garments that retain structure for decades rather than single seasons.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "2",
      title: "Azo-Free Low Impact Reactive Dyeing",
      slug: "eco-friendly-reactive-dyes",
      summary:
        "Deep onyx blacks and concrete greys achieved through closed-loop water filtration systems that eliminate hazardous runoffs.",
      content:
        "Traditional garment dyeing consumes enormous water volumes. Our partnered facilities in Gazipur and Narayanganj utilize advanced biological effluent treatment plants (ETP), recycling 85% of process water.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "3",
      title: "Zero Single-Use Plastic & 100% Biodegradable Packaging",
      slug: "biodegradable-packaging-initiative",
      summary:
        "From garment dust bags to shipping mailers, our packaging is made from cornstarch and recycled kraft board.",
      content:
        "Every ZEVON archive order is delivered in home-compostable mailers and unbleached paper boxes. Our hangtags are crafted from cotton manufacturing offcuts with zero synthetic laminates.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "4",
      title: "Ethical Atelier Craftsmanship & Living Wages",
      slug: "ethical-atelier-fair-wages",
      summary:
        "We champion generational garment artisans in Bangladesh with 40% above living-wage standards, safe working studios, and comprehensive healthcare.",
      content:
        "Bangladesh has been the garment hub of the world for decades. ZEVON brings pride back to local craftsmanship by creating artisanal-grade small batches, respecting the master tailors behind every stitch.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const impactMetrics = [
    {
      value: "100%",
      labelEn: "GOTS Organic Cotton",
      labelBn: "অর্গানিক কমেড সুতো",
      descEn: "Zero chemical pesticides or synthetic nylon blends used in our fleece.",
      descBn: "আমাদের পোশাকে কোনো সিন্থেটিক বা ক্ষতিকর উপাদান ব্যবহার করা হয় না।",
    },
    {
      value: "85%",
      labelEn: "Water Recycled in ETP",
      labelBn: "পানি পুনঃব্যবহারযোগ্য সিস্টেম",
      descEn: "Closed-loop biological effluent filtration prevents river pollution in Dhaka.",
      descBn: "উন্নত বায়োলজিক্যাল ফিল্টারিংয়ের মাধ্যমে বর্জ্য পানি বিশুদ্ধ করে পুনঃব্যবহার।",
    },
    {
      value: "0%",
      labelEn: "Single-Use Plastic",
      labelBn: "প্লাস্টিক-মুক্ত প্যাকেজিং",
      descEn: "Compostable plant-based mailers and recycled unbleached kraft board.",
      descBn: "সম্পূর্ণ পরিবেশবান্ধব ও প্রাকৃতিক উপাদানে বিনষ্টযোগ্য ডেলিভারি ব্যাগ।",
    },
    {
      value: "40%+",
      labelEn: "Above Living Wage",
      labelBn: "ন্যায্য মজুরি ও সুবিধা",
      descEn: "Dedicated atelier artisan compensation, fair hours, and health coverage.",
      descBn: "আমাদের দক্ষ কারিগরদের স্বাস্থ্যসেবা ও সর্বোচ্চ সম্মানজনক মজুরি প্রদান।",
    },
  ];

  return (
    <div className="min-h-[85vh] bg-background py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb ── */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          <Link
            href="/"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {t("nav.home", "Home")}
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white">
            {isBn ? "পরিবেশবান্ধব উপাদান" : "Sustainability & Ethics"}
          </span>
        </nav>

        {/* ── Hero Banner ── */}
        <div className="relative rounded-3xl bg-linear-to-br from-emerald-950 via-neutral-950 to-black text-white p-8 sm:p-14 lg:p-20 shadow-2xl overflow-hidden mb-16 border border-emerald-900/40 animate-fade-in-up">
          <div className="absolute right-0 top-0 translate-x-20 -translate-y-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="absolute left-1/4 bottom-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-float-slow" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-emerald-300 border border-emerald-500/30 mb-6 hover:bg-emerald-500/30 transition-colors">
              <Leaf className="h-3.5 w-3.5 text-emerald-400 animate-bounce" />
              <span>{isBn ? "সার্কুলার আর্কিটেকচার" : "CIRCULAR & SUSTAINABLE ATELIER"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 bg-linear-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
              {isBn
                ? "টেকসই মানের দীর্ঘস্থায়ী পোশাক। প্রকৃতির সাথে ভারসাম্য।"
                : "BUILT TO OUTLAST TRENDS. CONSCIOUS FROM SEED TO STITCH."}
            </h1>

            <p className="text-xs sm:text-base text-neutral-300 font-normal leading-relaxed mb-8">
              {isBn
                ? "আমাদের প্রতিটি পোশাক পরিবেশবান্ধব উপাদানে তৈরি। আমরা ফাস্ট-ফ্যাশনের বর্জ্য রোধ করতে কম সংখ্যায় সর্বোচ্চ কোয়ালিটির ৩৮০+ জিএসএম অর্গানিক তুলা এবং প্লাস্টিক-মুক্ত প্যাকেজিং ব্যবহার করি।"
                : "True sustainability begins with durability. By crafting 380–420 GSM heavyweight pieces designed to endure decades, eliminating single-use plastics, and enforcing fair ethical living wages in Bangladesh."}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/shop">
                <Button size="lg" className="bg-white text-neutral-950 hover:bg-neutral-200 hover:scale-105 active:scale-95 transition-all font-bold text-xs tracking-wide rounded-2xl px-6 shadow-xl">
                  <span>{isBn ? "অর্গানিক কালেকশন দেখুন" : "Explore Organic Drops"}</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Impact Metrics Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {impactMetrics.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 shadow-xs space-y-2 hover-card-lift hover:border-emerald-500/50 group"
            >
              <span className="text-3xl sm:text-4xl font-black text-neutral-950 dark:text-white font-mono group-hover:text-emerald-500 transition-colors">
                {stat.value}
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {isBn ? stat.labelBn : stat.labelEn}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed pt-1">
                {isBn ? stat.descBn : stat.descEn}
              </p>
            </div>
          ))}
        </div>

        {/* ── Detailed Sustainability Stories ── */}
        <div className="space-y-12 mb-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
              {isBn ? "আমাদের স্থায়িত্বশীল উদ্যোগ ও গবেষণা" : "Our Core Sustainability Pillars"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              {isBn
                ? "কীভাবে আমরা কাঁচামাল থেকে শুরু করে প্যাকেজিং পর্যন্ত পরিবেশ রক্ষা করি।"
                : "How we eliminate harmful environmental impact across every phase of production in Bangladesh."}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-xs group hover:shadow-xl hover-card-lift transition-all flex flex-col"
                >
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={story.coverImageUrl}
                      alt={story.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <h3 className="text-lg font-black text-neutral-950 dark:text-white leading-snug group-hover:text-emerald-500 transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {story.summary}
                      </p>
                    </div>
                    {story.content && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-3">
                        {story.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
