"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Ruler,
  Sparkles,
  Layers,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Scale,
  Shirt,
  Info,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function SizeGuideView() {
  const { t, isBn } = useTranslation();

  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [selectedCategory, setSelectedCategory] = useState<"tees" | "hoodies" | "pants" | "outerwear">("tees");

  // Fit Finder states
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [fitStyle, setFitStyle] = useState<"oversized" | "regular">("oversized");

  // Calculate recommended size
  const getRecommendedSize = () => {
    let base = "M";
    if (weightKg < 62 || heightCm < 168) base = "S";
    else if (weightKg <= 74 && heightCm <= 178) base = "M";
    else if (weightKg <= 85 && heightCm <= 185) base = "L";
    else if (weightKg <= 96) base = "XL";
    else base = "XXL";

    if (fitStyle === "regular" && base !== "S") {
      // Step down one size for a snug fit since ZEVON cut is naturally oversized
      if (base === "XXL") return "XL";
      if (base === "XL") return "L";
      if (base === "L") return "M";
      if (base === "M") return "S";
    }
    return base;
  };

  const categories = [
    {
      id: "tees",
      nameEn: "Oversized Tees (260 GSM)",
      nameBn: "ওভারসাইজড টি-শার্ট (২৬০ জিএসএম)",
      gsm: "260 GSM",
      fitNoteEn: "Drop-shoulder boxy silhouette. We recommend your true size for the intended relaxed streetwear drape.",
      fitNoteBn: "ড্রপ-শোল্ডার বক্সি ফিট। পারফেক্ট স্ট্রিটওয়্যার লুকের জন্য আপনার নিয়মিত সাইজ বেছে নিন।",
      measurements: {
        in: [
          { size: "S", chest: "42.0", length: "28.0", shoulder: "21.5", sleeve: "8.5" },
          { size: "M", chest: "44.0", length: "29.0", shoulder: "22.5", sleeve: "9.0" },
          { size: "L", chest: "46.0", length: "30.0", shoulder: "23.5", sleeve: "9.5" },
          { size: "XL", chest: "48.0", length: "31.0", shoulder: "24.5", sleeve: "10.0" },
          { size: "XXL", chest: "50.0", length: "32.0", shoulder: "25.5", sleeve: "10.5" },
        ],
        cm: [
          { size: "S", chest: "106.7", length: "71.1", shoulder: "54.6", sleeve: "21.6" },
          { size: "M", chest: "111.8", length: "73.7", shoulder: "57.2", sleeve: "22.9" },
          { size: "L", chest: "116.8", length: "76.2", shoulder: "59.7", sleeve: "24.1" },
          { size: "XL", chest: "121.9", length: "78.7", shoulder: "62.2", sleeve: "25.4" },
          { size: "XXL", chest: "127.0", length: "81.3", shoulder: "64.8", sleeve: "26.7" },
        ],
      },
    },
    {
      id: "hoodies",
      nameEn: "Heavyweight Hoodies (380+ GSM)",
      nameBn: "হেভিওয়েট হুডি ও সোয়েটশার্ট (৩৮০+ জিএসএম)",
      gsm: "380–420 GSM",
      fitNoteEn: "Ultra-heavy loopback French terry with double-layered hood. Generously cut through the chest and torso.",
      fitNoteBn: "দ্বিগুণ ঘন ফ্রেন্স টেরি ফেব্রিক ও ডাবল-লেয়ার হুড। চেস্ট ও বডিতে পর্যাপ্ত রিল্যাক্সড কাটিং।",
      measurements: {
        in: [
          { size: "S", chest: "44.0", length: "27.5", shoulder: "22.0", sleeve: "24.0" },
          { size: "M", chest: "46.0", length: "28.5", shoulder: "23.0", sleeve: "24.5" },
          { size: "L", chest: "48.0", length: "29.5", shoulder: "24.0", sleeve: "25.0" },
          { size: "XL", chest: "51.0", length: "30.5", shoulder: "25.0", sleeve: "25.5" },
          { size: "XXL", chest: "54.0", length: "31.5", shoulder: "26.0", sleeve: "26.0" },
        ],
        cm: [
          { size: "S", chest: "111.8", length: "69.8", shoulder: "55.9", sleeve: "61.0" },
          { size: "M", chest: "116.8", length: "72.4", shoulder: "58.4", sleeve: "62.2" },
          { size: "L", chest: "121.9", length: "74.9", shoulder: "61.0", sleeve: "63.5" },
          { size: "XL", chest: "129.5", length: "77.5", shoulder: "63.5", sleeve: "64.8" },
          { size: "XXL", chest: "137.2", length: "80.0", shoulder: "66.0", sleeve: "66.0" },
        ],
      },
    },
    {
      id: "pants",
      nameEn: "Cargo Pants & Sweatpants (340 GSM)",
      nameBn: "কার্গো ও সোয়েটপ্যান্টস (৩৪০ জিএসএম)",
      gsm: "340 GSM",
      fitNoteEn: "Elasticized drawstring waist with tailored stacking hem at the ankles.",
      fitNoteBn: "ইলাস্টিক ওয়েস্টব্যান্ড এবং গোড়ালিতে আধুনিক স্ট্যাকিং হেম কাটিং।",
      measurements: {
        in: [
          { size: "S", chest: "28-30", length: "39.0", shoulder: "24.0", sleeve: "12.0" },
          { size: "M", chest: "31-33", length: "40.0", shoulder: "25.0", sleeve: "12.5" },
          { size: "L", chest: "34-36", length: "41.0", shoulder: "26.0", sleeve: "13.0" },
          { size: "XL", chest: "37-39", length: "42.0", shoulder: "27.0", sleeve: "13.5" },
          { size: "XXL", chest: "40-42", length: "43.0", shoulder: "28.0", sleeve: "14.0" },
        ],
        cm: [
          { size: "S", chest: "71-76", length: "99.1", shoulder: "61.0", sleeve: "30.5" },
          { size: "M", chest: "78-84", length: "101.6", shoulder: "63.5", sleeve: "31.8" },
          { size: "L", chest: "86-91", length: "104.1", shoulder: "66.0", sleeve: "33.0" },
          { size: "XL", chest: "94-99", length: "106.7", shoulder: "68.6", sleeve: "34.3" },
          { size: "XXL", chest: "101-107", length: "109.2", shoulder: "71.1", sleeve: "35.6" },
        ],
      },
    },
    {
      id: "outerwear",
      nameEn: "Outerwear & Bombers (420+ GSM)",
      nameBn: "আউটারওয়্যার ও জ্যাকেট (৪২০+ জিএসএম)",
      gsm: "420–480 GSM",
      fitNoteEn: "Layer-friendly fit designed to comfortably wear over heavy hoodies.",
      fitNoteBn: "হুডি বা সোয়েটারের উপর সহজে পরার জন্য বিশেষ লেয়ারিং কাটিং।",
      measurements: {
        in: [
          { size: "S", chest: "46.0", length: "26.5", shoulder: "21.0", sleeve: "25.0" },
          { size: "M", chest: "48.0", length: "27.5", shoulder: "22.0", sleeve: "25.5" },
          { size: "L", chest: "50.0", length: "28.5", shoulder: "23.0", sleeve: "26.0" },
          { size: "XL", chest: "53.0", length: "29.5", shoulder: "24.0", sleeve: "26.5" },
          { size: "XXL", chest: "56.0", length: "30.5", shoulder: "25.0", sleeve: "27.0" },
        ],
        cm: [
          { size: "S", chest: "116.8", length: "67.3", shoulder: "53.3", sleeve: "63.5" },
          { size: "M", chest: "121.9", length: "69.8", shoulder: "55.9", sleeve: "64.8" },
          { size: "L", chest: "127.0", length: "72.4", shoulder: "58.4", sleeve: "66.0" },
          { size: "XL", chest: "134.6", length: "74.9", shoulder: "61.0", sleeve: "67.3" },
          { size: "XXL", chest: "142.2", length: "77.5", shoulder: "63.5", sleeve: "68.6" },
        ],
      },
    },
  ];

  const activeCategoryData = (categories.find((c) => c.id === selectedCategory) ?? categories[0])!;
  const activeTable = activeCategoryData.measurements[unit];

  const gsmComparison = [
    {
      gsm: "140–160 GSM",
      titleEn: "Fast-Fashion Standard",
      titleBn: "সাধারণ ফাস্ট ফ্যাশন টি-শার্ট",
      descEn: "Thin, prone to stretching and collar warping after 3–5 washes. Loses silhouette quickly.",
      descBn: "অতিরিক্ত পাতলা, কয়েকবার ধোয়ার পরেই কলার ও শেইপ নষ্ট হয়ে যায়।",
      badge: isBn ? "অন্যান্য ব্র্যান্ড" : "Commercial Standard",
      highlight: false,
    },
    {
      gsm: "260–280 GSM",
      titleEn: "ZEVON Heavy Boxy Tees",
      titleBn: "জেভন হেভি বক্সি টি-শার্ট",
      descEn: "Substantial compact combed cotton. Holds structural drape and never turns see-through.",
      descBn: "উচ্চমানের কমপ্যাক্ট কম্বড তুলা। দীর্ঘস্থায়ী বক্সি শেইপ ও প্রিমিয়াম অনুভূতি।",
      badge: "ZEVON T-SHIRTS",
      highlight: true,
    },
    {
      gsm: "380–420 GSM",
      titleEn: "ZEVON Architectural Hoodies",
      titleBn: "জেভন আর্কিটেকচারাল হুডি",
      descEn: "Ultra-heavy loopback French terry. Zero sag, zero fleece peeling, engineered warmth.",
      descBn: "৩৮০+ জিএসএম ঘন ফ্রেন্স টেরি। বাতাস প্রতিরোধক, টেকসই এবং অসাধারণ কমফোর্ট।",
      badge: "ZEVON SIGNATURE",
      highlight: true,
    },
  ];

  return (
    <div className="min-h-[85vh] bg-background py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb ── */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            {t("nav.home", "Home")}
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white">
            {isBn ? "সাইজ গাইড ও জিএসএম" : "Size Guide & GSM"}
          </span>
        </nav>

        {/* ── Hero Banner ── */}
        <div className="relative rounded-3xl bg-linear-to-br from-neutral-950 via-neutral-900 to-black text-white p-8 sm:p-14 lg:p-20 shadow-2xl overflow-hidden mb-16 border border-neutral-800 animate-fade-in-up">
          <div className="absolute right-0 top-0 translate-x-20 -translate-y-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-neutral-800/20 rounded-full blur-3xl pointer-events-none animate-float-slow" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-neutral-300 border border-white/10 mb-6">
              <Ruler className="h-3.5 w-3.5 text-amber-400" />
              <span>{isBn ? "প্রিসিশন কাটিং গাইড" : "PRECISION SIZING & TEXTILES"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
              {isBn ? "নিখুঁত ফিটিং ও হেভিওয়েট জিএসএম স্পেসিফিকেশন" : "ARCHITECTURAL FIT & 380+ GSM TEXTILE ENGINEERING."}
            </h1>

            <p className="text-xs sm:text-base text-neutral-300 font-normal leading-relaxed mb-8 max-w-2xl">
              {isBn
                ? "আমাদের স্ট্রিটওয়্যার মূলত ড্রপ-শোল্ডার এবং বক্সি সিলুয়েটে তৈরি। আপনার উচ্চতা ও পছন্দ অনুযায়ী সঠিক মাপ বেছে নিতে নিচের ইন্টারঅ্যাক্টিভ চার্ট ও সাইজ ফাইন্ডার ব্যবহার করুন।"
                : "ZEVON silhouettes are cut boxy and relaxed with intentional drop-shoulders. Explore our measurement matrix and smart sizing calculator below."}
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <span>{isBn ? "কালেকশন ব্রাউজ করুন" : "Explore Collections"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 bg-amber-950/60 px-4 py-3 rounded-2xl border border-amber-800/40">
                <Sparkles className="h-4 w-4" />
                <span>{isBn ? "প্রিসিশন কাট ৩৮০+ জিএসএম" : "Pre-Shrunk Heavyweight Cotton"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Interactive Fit Finder & Size Calculator (2-Column Grid) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 mb-20 items-stretch">
          {/* Sizing Tool (6 Cols) */}
          <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-10 shadow-lg space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-neutral-950 dark:text-white">
                    {isBn ? "স্মার্ট সাইজ ফাইন্ডার" : "Smart Fit Recommender"}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {isBn ? "উচ্চতা ও ওজন অনুযায়ী আদর্শ মাপ জানুন" : "Calculate your exact streetwear size"}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Height Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {isBn ? "উচ্চতা (Height)" : "Your Height"}
                    </span>
                    <span className="text-neutral-950 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-lg">
                      {heightCm} cm ({Math.floor(heightCm / 30.48)}&apos;{Math.round((heightCm % 30.48) / 2.54)}&quot;)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="155"
                    max="198"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neutral-950 dark:accent-white"
                  />
                </div>

                {/* Weight Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {isBn ? "ওজন (Weight)" : "Your Weight"}
                    </span>
                    <span className="text-neutral-950 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-lg">
                      {weightKg} kg ({(weightKg * 2.20462).toFixed(0)} lbs)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="115"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neutral-950 dark:accent-white"
                  />
                </div>

                {/* Fit Preference Toggle */}
                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-2">
                    {isBn ? "পছন্দের ফিটিং স্টাইল" : "Fit Preference"}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFitStyle("oversized")}
                      className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                        fitStyle === "oversized"
                          ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-md"
                          : "bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      {isBn ? "ওভারসাইজড ড্রপ (সিগনেচার)" : "Signature Boxy (Oversized)"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFitStyle("regular")}
                      className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                        fitStyle === "regular"
                          ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-md"
                          : "bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      {isBn ? "রেগুলার / স্লিম ফিট" : "Standard Regular Fit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation Result Card */}
            <div className="p-5 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 space-y-2 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-600">
                  {isBn ? "আপনার প্রস্তাবিত সাইজ" : "Recommended Size"}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 dark:text-emerald-700 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> 98% Match
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black">{getRecommendedSize()}</span>
                <span className="text-xs text-neutral-300 dark:text-neutral-700">
                  {fitStyle === "oversized"
                    ? isBn ? "সিগনেচার রিল্যাক্সড ড্রপ ফিট" : "True Oversized Streetwear Silhouette"
                    : isBn ? "বডি কমপ্যাক্ট রেগুলার ফিট" : "Tailored Closer-to-Body Fit"}
                </span>
              </div>
            </div>
          </div>

          {/* Measurement Guide Visual (6 Cols) */}
          <div className="lg:col-span-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-[10px] font-extrabold uppercase text-neutral-800 dark:text-neutral-200">
                <Info className="h-3.5 w-3.5" />
                {isBn ? "মাপ নেওয়ার নিয়ম" : "HOW TO MEASURE"}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white">
                {isBn ? "কীভাবে সঠিক মাপ নেবেন?" : "How to Measure Your Current Favorite Piece"}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {isBn
                  ? "আপনার সবচেয়ে পছন্দের একটি টি-শার্ট বা হুডি সমতল স্থানে বিছিয়ে ফিতা দিয়ে মেপে নিচের পয়েন্টগুলোর সাথে মিলিয়ে নিন:"
                  : "Lay your favorite tee or hoodie flat on a table and measure across the following points with a soft tape:"}
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-1">
                <h4 className="text-xs font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-black">A</span>
                  <span>{isBn ? "চেস্ট / বুক (Chest Pit-to-Pit)" : "Chest (Pit-to-Pit)"}</span>
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pl-7">
                  {isBn ? "এক বগল থেকে অপর বগল পর্যন্ত সোজা মাপ (ইঞ্চি বা সেমিতে)।" : "Measure straight across from one armpit seam to the other."}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-1">
                <h4 className="text-xs font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-black">B</span>
                  <span>{isBn ? "দৈর্ঘ্য (Body Length)" : "Body Length (HPS)"}</span>
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pl-7">
                  {isBn ? "কলার সংলগ্ন কাঁধের সর্বোচ্চ বিন্দু থেকে নিচের হেমলাইন পর্যন্ত।" : "From the highest point of the shoulder down to the bottom hem."}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-1">
                <h4 className="text-xs font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-black">C</span>
                  <span>{isBn ? "ড্রপ শোল্ডার (Shoulder Width)" : "Shoulder Drop Width"}</span>
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pl-7">
                  {isBn ? "এক কাঁধের ড্রপ সিম থেকে অপর কাঁধের সিম পর্যন্ত।" : "Measure across the back from shoulder seam to shoulder seam."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Measurement Tables & Category Filter ── */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
                {isBn ? "পূর্ণাঙ্গ মাপের চার্ট" : "Garment Measurement Matrix"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {isBn ? activeCategoryData.fitNoteBn : activeCategoryData.fitNoteEn}
              </p>
            </div>

            {/* Unit Toggle Buttons */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setUnit("in")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  unit === "in"
                    ? "bg-white text-neutral-950 dark:bg-neutral-900 dark:text-white shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Inches (in)
              </button>
              <button
                type="button"
                onClick={() => setUnit("cm")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  unit === "cm"
                    ? "bg-white text-neutral-950 dark:bg-neutral-900 dark:text-white shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md"
                    : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
                }`}
              >
                {isBn ? cat.nameBn : cat.nameEn}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-6">{isBn ? "সাইজ" : "Size"}</th>
                    <th className="py-4 px-6">{isBn ? `চেস্ট (${unit})` : `Chest (${unit})`}</th>
                    <th className="py-4 px-6">{isBn ? `দৈর্ঘ্য (${unit})` : `Length (${unit})`}</th>
                    <th className="py-4 px-6">{isBn ? `শোল্ডার (${unit})` : `Shoulder (${unit})`}</th>
                    <th className="py-4 px-6">{isBn ? `হাতা / হিপ (${unit})` : `Sleeve / Inseam (${unit})`}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium text-neutral-900 dark:text-white">
                  {activeTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                      <td className="py-4 px-6 font-black text-sm">{row.size}</td>
                      <td className="py-4 px-6">{row.chest}</td>
                      <td className="py-4 px-6">{row.length}</td>
                      <td className="py-4 px-6">{row.shoulder}</td>
                      <td className="py-4 px-6">{row.sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── GSM Masterclass Comparison ── */}
        <div className="rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 p-8 sm:p-12 mb-16">
          <div className="max-w-3xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-[10px] font-extrabold uppercase mb-3 text-neutral-800 dark:text-neutral-200">
              <Layers className="h-3.5 w-3.5" />
              {isBn ? "ফেব্রিক ডেনসিটি গাইড" : "GSM EXPLAINED"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white">
              {isBn ? "জিএসএম (GSM) কী এবং কেন জেভন ৩৮০+ জিএসএম ব্যবহার করে?" : "What is GSM and Why Does Fabric Weight Matter?"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              {isBn
                ? "GSM মানে হলো Grams per Square Meter (প্রতি বর্গমিটারে কাপড়ের ওজন)। জিএসএম যত বেশি, কাপড় তত ভারী, ঘন এবং দীর্ঘস্থায়ী হয়।"
                : "GSM measures fabric density. Higher GSM creates substantial structure, eliminating clinging and fabric deformation over hundreds of wears."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gsmComparison.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 sm:p-8 space-y-4 transition-all ${
                  item.highlight
                    ? "bg-white dark:bg-neutral-900 border-2 border-neutral-950 dark:border-white shadow-xl hover-card-lift"
                    : "bg-white/60 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 opacity-75"
                }`}
              >
                <span className="inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white">
                  {item.badge}
                </span>
                <h3 className="text-2xl font-black text-neutral-950 dark:text-white">
                  {item.gsm}
                </h3>
                <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
                  {isBn ? item.titleBn : item.titleEn}
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {isBn ? item.descBn : item.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
