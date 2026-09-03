"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Zap, RotateCcw, Sparkles, ArrowRight, Award, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const USP_ICONS: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
  Zap: <Zap className="h-6 w-6 text-amber-500" />,
  RotateCcw: <RotateCcw className="h-6 w-6 text-indigo-500" />,
  Sparkles: <Sparkles className="h-6 w-6 text-rose-500" />,
};

export function BrandStoryUSPs() {
  const { t, isBn } = useTranslation();

  const brandUSPs = [
    {
      title: t("usp.card1Title", "380+ GSM Heavyweight Cotton"),
      description: t("usp.card1Desc", "Custom-knitted 100% combed organic cotton with pre-shrunk treatment that never loses its boxy structure."),
      icon: "ShieldCheck",
    },
    {
      title: t("usp.card2Title", "Precision Boxy Silhouettes"),
      description: t("usp.card2Desc", "Dropped shoulder proportions engineered to drape naturally without looking oversized or sloppy."),
      icon: "Zap",
    },
    {
      title: t("usp.card3Title", "Express 24-48H Delivery"),
      description: t("usp.card3Desc", "Fast insured doorstep dispatch across Dhaka and all 64 districts in Bangladesh."),
      icon: "RotateCcw",
    },
    {
      title: t("usp.card4Title", "Hassle-Free 7-Day Exchange"),
      description: t("usp.card4Desc", "Zero-risk shopping with instant size exchanges and dedicated WhatsApp client concierge."),
      icon: "Sparkles",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* 1. Value Proposition Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brandUSPs.map((usp) => (
            <div
              key={usp.title}
              className="group p-6 rounded-3xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-lg"
            >
              <div className="h-12 w-12 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {USP_ICONS[usp.icon]}
              </div>
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white tracking-tight mb-1.5">
                {usp.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {usp.description}
              </p>
            </div>
          ))}
        </div>

        {/* 2. Brand Story / Manifesto Split */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center rounded-3xl bg-neutral-950 text-white p-8 sm:p-12 lg:p-16 border border-neutral-800 overflow-hidden relative">
          {/* Ambient light */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl"
          />

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-neutral-300 border border-white/10">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span>{isBn ? "জেভন দর্শন" : "The ZEVON Philosophy"}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1]">
              {isBn ? "স্থায়িত্বের প্রতিশ্রুতি।" : "CRAFTED FOR LONGEVITY."} <br />
              <span className="text-neutral-400">
                {isBn ? "স্ট্রিটওয়্যারের আধুনিক রূপ।" : "ENGINEERED FOR THE STREETS."}
              </span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed max-w-xl">
              {isBn
                ? "জেভন গড়ে উঠেছে একটি অনন্য লক্ষ্য নিয়ে: প্রিমিয়াম ও আর্কিটেকচারাল পোশাক তৈরি করা যা নিখুঁতভাবে মানানসই। আমরা শতভাগ কম্বড অর্গানিক কটন ও দক্ষ কারিগরদের দিয়ে প্রতিটি পোশাক নিখুঁতভাবে তৈরি করি।"
                : "ZEVON was founded on a singular obsession: to build luxury, architectural everyday wear tailored for the modern silhouette. We source dense, super-combed organic cotton and partner directly with master craftsmen in Bangladesh."}
            </p>

            {/* Checklist */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-neutral-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{isBn ? "কোনো সিন্থেটিক মিশ্রণ নেই" : "Zero Synthetic Fillers"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-neutral-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{isBn ? "ডাবল-নিডল রিইনফোর্সড কলার" : "Double-Needle Reinforced Collars"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-neutral-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{isBn ? "পরিবেশবান্ধব প্রি-শ্রাঙ্ক কালার" : "Eco-Friendly Pre-Shrunk Dyes"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-neutral-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{isBn ? "ন্যায্য মজুরি ও নিজস্ব উৎপাদন" : "Fair-Wage Artisan Guilds"}</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider uppercase text-white hover:text-neutral-300 underline underline-offset-8 transition-colors"
              >
                <span>{isBn ? "আমাদের গল্প পড়ুন" : "Read Full Brand Manifesto"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Image Visual */}
          <div className="lg:col-span-5 relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80"
              alt="ZEVON Workshop"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                {isBn ? "হেডকোয়ার্টার ও কারখানা • ঢাকা, বাংলাদেশ" : "HQ & Atelier • Dhaka, Bangladesh"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
