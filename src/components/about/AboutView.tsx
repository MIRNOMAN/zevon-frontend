"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  ShieldCheck,
  Award,
  ArrowRight,
  Compass,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  Cpu,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function AboutView() {
  const { t, isBn } = useTranslation();

  const values = [
    {
      icon: Layers,
      titleEn: "380+ GSM Heavyweight Mastery",
      titleBn: "৩৮০+ জিএসএম হেভিওয়েট উৎকর্ষ",
      descEn:
        "We reject flimsy, fast-fashion synthetics. Every garment is constructed with high-density 380–420 GSM unblended organic combed cotton for timeless structural silhouettes.",
      descBn:
        "আমরা ফাস্ট-ফ্যাশনের পাতলা ও টেকসইহীন ফেব্রিক বর্জন করি। আমাদের প্রতিটি পোশাক উচ্চ ঘনত্বের ৩৮০-৪২০ জিএসএম অর্গানিক কমেড সুতো দিয়ে নিখুঁত কাঠামোর সাথে তৈরি।",
    },
    {
      icon: Cpu,
      titleEn: "Architectural Precision Cuts",
      titleBn: "আর্কিটেকচারাল প্রিসিশন প্যাটার্ন",
      descEn:
        "Engineered with drop-shoulder ergonomics, boxy streetwear proportions, and reinforced double-needle cover-stitching designed to withstand hundreds of wash cycles.",
      descBn:
        "ড্রপ-শোল্ডার এরগনোমিক্স, বক্সি স্ট্রিটওয়্যার অনুপাত এবং শক্তিশালী ডাবল-নিডেল সেলাই দ্বারা তৈরি যা শত শত ওয়াশের পরও অক্ষত থাকে।",
    },
    {
      icon: Award,
      titleEn: "Bangladeshi Artisan Heritage",
      titleBn: "ঐতিহ্যবাহী বাংলাদেশি কারিগরী",
      descEn:
        "Proudly designed and engineered in Dhaka. We collaborate with master generational tailors who receive fair living wages and dignified atelier work environments.",
      descBn:
        "গর্বের সাথে ঢাকায় ডিজাইন ও প্রকৌশলিত। অভিজ্ঞ প্রজন্মের পোশাক কারিগরদের সাথে অংশীদারিত্ব, যেখানে ন্যায্য মজুরি এবং স্বাস্থ্যকর কাজের পরিবেশ নিশ্চিত করা হয়।",
    },
    {
      icon: ShieldCheck,
      titleEn: "Circular & Zero-Plastic Ethics",
      titleBn: "পরিবেশবান্ধব ও প্লাস্টিক-মুক্ত অঙ্গীকার",
      descEn:
        "100% home-compostable mailers, azo-free non-toxic reactive dyes, and low-water footprint closed-loop facilities across our entire production cycle.",
      descBn:
        "১০০% প্রাকৃতিক উপাদানে বিনষ্টযোগ্য প্যাকেজিং, বিষাক্ত-রাসায়নিক মুক্ত ডাইং এবং বন্ধ লুপের মাধ্যমে পানি পুনঃব্যবহারযোগ্য উৎপাদন প্রক্রিয়া।",
    },
  ];

  const milestones = [
    {
      year: "2022",
      titleEn: "The Genesis in Dhaka",
      titleBn: "ঢাকায় জেভনের সূচনা",
      descEn: "Founded as an underground studio countering disposable fast-fashion with 400 GSM heavyweight jersey.",
      descBn: "ঢাকায় আন্ডারগ্রাউন্ড স্টুডিও হিসেবে যাত্রা শুরু, উদ্দেশ্য ছিল ৪০০ জিএসএম হেভিওয়েট জার্সির মাধ্যমে টেকসই পোশাক তৈরি।",
    },
    {
      year: "2023",
      titleEn: "The Architectural Cut (Drop 01)",
      titleBn: "প্রথম আর্কিটেকচারাল ড্রপ",
      descEn: "Launched our first signature boxy drop-shoulder hoodie collection which sold out within 14 minutes.",
      descBn: "আমাদের সিগনেচার ড্রপ-শোল্ডার হুডি কালেকশন ড্রপ করা হয় যা মাত্র ১৪ মিনিটে সম্পূর্ণ সোল্ড আউট হয়।",
    },
    {
      year: "2024",
      titleEn: "Banani Flagship Atelier",
      titleBn: "বনানী ফ্ল্যাগশিপ স্টুডিও",
      descEn: "Opened our physical sensory lounge in Banani, offering private styling and tactile fabric testing.",
      descBn: "বনানীতে আমাদের প্রথম ফিজিক্যাল কনসেপ্ট লাউঞ্জ উদ্বোধন, যেখানে প্রিমিয়াম ফেব্রিক এক্সপেরিয়েন্স প্রদান করা হয়।",
    },
    {
      year: "2026",
      titleEn: "Global Archive & Circular Future",
      titleBn: "গ্লোবাল ড্রপ ও সার্কুলার ভিশন",
      descEn: "Pioneering interactive 3D digital try-ons, mix-and-match outfit canvas, and global express shipping.",
      descBn: "ইন্টারেক্টিভ ডিজিটাল ট্রাই-অন, মিক্স-অ্যান্ড-ম্যাচ ক্যানভাস এবং বিশ্বমানের ফ্যাশন অভিজ্ঞতা সম্প্রসারণ।",
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
            {isBn ? "আমাদের গল্প" : "About ZEVON"}
          </span>
        </nav>

        {/* ── Hero Manifesto Banner ── */}
        <div className="relative rounded-3xl bg-linear-to-br from-neutral-950 via-neutral-900 to-black text-white p-8 sm:p-14 lg:p-20 shadow-2xl overflow-hidden mb-16 border border-neutral-800 text-center sm:text-left animate-fade-in-up">
          <div className="absolute right-0 top-0 translate-x-20 -translate-y-20 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-float-slow" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-neutral-300 border border-white/10 mb-6 hover:bg-white/15 transition-colors">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{isBn ? "ব্র্যান্ড দর্শন" : "THE ZEVON MANIFESTO"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 bg-linear-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              {isBn
                ? "ওজনই পোশাকের আসল পরিচয়। উচ্চমানের ফ্যাশন স্থাপত্য।"
                : "WEIGHT IS SUBSTANCE. ARCHITECTURAL STREETWEAR."}
            </h1>

            <p className="text-xs sm:text-base text-neutral-300 font-normal leading-relaxed mb-8">
              {isBn
                ? "জেভন (ZEVON) বাংলাদেশের সমসাময়িক লাক্সারি স্ট্রিটওয়্যার ব্র্যান্ড। আমরা পোশাকের স্থায়িত্ব, সঠিক ফেব্রিক ঘনত্ব (৩৮০+ জিএসএম) এবং আর্কিটেকচারাল অনুপাতের সমন্বয়ে এমন পোশাক তৈরি করি যা যুগ যুগ ধরে প্রাসঙ্গিক থাকে।"
                : "ZEVON is a contemporary streetwear atelier born in Dhaka. We reject disposable micro-trends in favor of heavyweight structural essentials, brutalist aesthetics, and uncompromising fabric engineering."}
            </p>

            <div className="flex flex-wrap items-center gap-4 justify-center sm:justify-start">
              <Link href="/shop">
                <Button size="lg" className="bg-white text-neutral-950 hover:bg-neutral-200 hover:scale-105 active:scale-95 transition-all font-bold text-xs tracking-wide rounded-2xl px-6 shadow-lg">
                  <span>{isBn ? "কালেকশন দেখুন" : "Explore Collections"}</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/stores">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all font-bold text-xs tracking-wide rounded-2xl px-6">
                  <span>{isBn ? "ফ্ল্যাগশিপ স্টুডিও ভিজিট" : "Visit Flagship Studio"}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Fabric Engineering Comparison Section ── */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
              {isBn ? "ফেব্রিক ইঞ্জিনিয়ারিং ও বৈচিত্র্য" : "The 380+ GSM Difference"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              {isBn
                ? "সাধারণ ফাস্ট ফ্যাশন বনাম জেভন আর্কিটেকচারাল হেভিওয়েট ফেব্রিকের তুলনামূলক পার্থক্য।"
                : "Why fabric weight and organic weave density dictate true longevity and drape."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Standard Fast Fashion */}
            <div className="rounded-3xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800 p-8 space-y-4 hover-card-lift">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400">
                {isBn ? "সাধারণ বাজারজাত পোশাক" : "Conventional Fast Fashion"}
              </span>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-300">
                160 – 200 GSM Thin Synthetics
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-500 dark:text-neutral-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>{isBn ? "কয়েকটি ওয়াশের পর কলার ও ঝুল নষ্ট হয়ে যায়" : "Loss of structural collar shape after 3-5 washes"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>{isBn ? "পলিয়েস্টার ব্লেন্ডেড ফেব্রিক যা সহজে রোঁয়া ওঠে" : "Polyester blends prone to surface pilling and shedding"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>{isBn ? "পাতলা কাপড় যা শরীরে নিখুঁত ড্রপ তৈরি করে না" : "Thin clingy fabric lacking structured silhouette"}</span>
                </li>
              </ul>
            </div>

            {/* ZEVON Heavyweight */}
            <div className="rounded-3xl bg-neutral-950 text-white dark:bg-neutral-900 p-8 space-y-4 border border-neutral-800 shadow-xl relative overflow-hidden hover-card-lift group">
              <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="h-32 w-32" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
                {isBn ? "জেভন সিগনেচার স্ট্যান্ডার্ড" : "ZEVON Atelier Standard"}
              </span>
              <h3 className="text-xl font-black text-white">
                380 – 420 GSM Pure Organic Cotton
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>{isBn ? "প্রি-শ্রাঙ্ক কম্বড সুতো—বহু বছর ধরে একই সাইজ ও শেপ বজায় রাখে" : "Pre-shrunk combed cotton maintaining structure for years"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>{isBn ? "হেভিওয়েট ডেনসিটি যা রাজকীয় ড্রপ ও নিখুঁত বক্সি লুক দেয়" : "Architectural boxy drape that hangs naturally away from body"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>{isBn ? "১০০% মাইক্রোপ্লাস্টিক মুক্ত ও শ্বাসপ্রশ্বাসযোগ্য প্রাকৃতিক তন্তু" : "100% microplastic-free breathable natural organic fiber"}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── 4 Pillars of Excellence ── */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
              {isBn ? "আমাদের মূল ভিত্তি ও বৈশিষ্ট্য" : "The Four Pillars of ZEVON"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              {isBn
                ? "প্রতিটি সেলাই ও পোশাকে আমাদের নিখুঁত মানের প্রতিশ্রুতি।"
                : "Principles that guide our textile sourcing, pattern engineering, and artisan partnerships."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-7 shadow-xs space-y-4 hover-card-lift group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white group-hover:bg-neutral-950 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-950 transition-colors duration-300">
                    <Icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-sm font-black text-neutral-950 dark:text-white">
                    {isBn ? v.titleBn : v.titleEn}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {isBn ? v.descBn : v.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Heritage Milestones Timeline ── */}
        <div className="rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800 p-8 sm:p-14 mb-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
              {isBn ? "জেভনের পথচলা ও মাইলফলক" : "Atelier Journey"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {milestones.map((m, idx) => (
              <div key={idx} className="space-y-3 relative hover-card-lift p-4 rounded-2xl hover:bg-white dark:hover:bg-neutral-800/60 transition-all group">
                <span className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white font-mono group-hover:text-amber-500 transition-colors">
                  {m.year}
                </span>
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
                  {isBn ? m.titleBn : m.titleEn}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {isBn ? m.descBn : m.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
