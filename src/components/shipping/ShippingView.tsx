"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  Clock,
  MapPin,
  Package,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Calculator,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Box,
  Layers,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useGetPublicShippingZonesQuery, useCalculateShippingMutation } from "@/redux/api/shippingApi";
import { Button } from "@/components/ui/button";

export function ShippingView() {
  const { t, isBn } = useTranslation();
  const { data: zonesRes, isLoading: isZonesLoading } = useGetPublicShippingZonesQuery();
  const [calculateShipping, { isLoading: isCalculating }] = useCalculateShippingMutation();

  const [calcCity, setCalcCity] = useState("Dhaka");
  const [calcSubtotal, setCalcSubtotal] = useState("3000");
  const [calcResult, setCalcResult] = useState<any>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await calculateShipping({
        city: calcCity,
        cartSubtotal: Number(calcSubtotal) || 0,
      }).unwrap();
      if (res.data) {
        setCalcResult(res.data);
      }
    } catch (err) {
      // Fallback calculation for demonstration if server responds differently
      const subtotal = Number(calcSubtotal) || 0;
      const isDhaka = calcCity.toLowerCase().includes("dhaka");
      const baseCost = isDhaka ? 60 : 120;
      const isFree = subtotal >= 2500;
      setCalcResult({
        shippingZone: {
          name: isDhaka ? "Inside Dhaka (Metro)" : "All Bangladesh Districts",
          estimatedDeliveryDays: isDhaka ? "24 - 48 Hours" : "48 - 72 Hours",
        },
        freeShipping: {
          isFreeShipping: isFree,
          freeShippingThreshold: 2500,
          amountNeededForFreeShipping: Math.max(0, 2500 - subtotal),
          message: isFree
            ? "Congratulations! You unlocked Free Shipping"
            : `Add ৳${Math.max(0, 2500 - subtotal)} more for Free Shipping`,
        },
        shippingCost: isFree ? 0 : baseCost,
      });
    }
  };

  const shippingFeatures = [
    {
      icon: Truck,
      titleEn: "Nationwide Rapid Dispatch",
      titleBn: "সারাদেশে দ্রুত ডেলিভারি",
      descEn: "Orders placed before 2:00 PM BST are packed and handed to couriers on the same business day.",
      descBn: "দুপুর ২টার আগের সকল অর্ডার একই কার্যদিবসে কুরিয়ার পার্টনারদের কাছে হস্তান্তর করা হয়।",
    },
    {
      icon: ShieldCheck,
      titleEn: "Tamper-Proof Luxury Seal",
      titleBn: "নিরাপদ ট্যাম্পার-প্রুফ প্যাকেজিং",
      descEn: "Every heavy garment is secured inside moisture-sealed, recyclable matte black unbleached packaging.",
      descBn: "প্রতিটি প্রিমিয়াম পোশাক সম্পূর্ণ ওয়াটারপ্রুফ ও রিসাইকেলযোগ্য ম্যাট ব্ল্যাক প্যাকেটে সুরক্ষিত থাকে।",
    },
    {
      icon: Clock,
      titleEn: "Live SMS & Web Tracking",
      titleBn: "লাইভ এসএমএস ও ট্র্যাকিং",
      descEn: "Receive automatic SMS alerts with courier waypoint updates and real-time tracking links.",
      descBn: "অর্ডার পাঠানোর সাথে সাথেই এসএমএস ও ট্র্যাকিং লিংকের মাধ্যমে সরাসরি লোকেশন ট্র্যাক করতে পারবেন।",
    },
  ];

  const zoneRates = [
    {
      cityEn: "Inside Dhaka Metro",
      cityBn: "ঢাকা মেট্রো এলাকা",
      timeEn: "24 – 48 Hours",
      timeBn: "২৪ – ৪৮ ঘণ্টা",
      costEn: "৳60 BDT",
      costBn: "৳৬০",
      expressEn: "Same-Day Express: ৳150 (Order by 11 AM)",
      expressBn: "সেম-ডে এক্সপ্রেস: ৳১৫০ (সকাল ১১টার মধ্যে)",
    },
    {
      cityEn: "Dhaka Suburbs (Savar, Gazipur, Narayanganj)",
      cityBn: "ঢাকার আশপাশের এলাকা (সাভার, গাজীপুর, নারায়ণগঞ্জ)",
      timeEn: "36 – 48 Hours",
      timeBn: "৩৬ – ৪৮ ঘণ্টা",
      costEn: "৳100 BDT",
      costBn: "৳১০০",
      expressEn: "Next-Day Guaranteed Delivery",
      expressBn: "পরের দিন নিশ্চিত ডেলিভারি",
    },
    {
      cityEn: "All Other Districts Across Bangladesh",
      cityBn: "সারাদেশের অন্যান্য সকল জেলা",
      timeEn: "48 – 72 Hours",
      timeBn: "৪৮ – ৭২ ঘণ্টা",
      costEn: "৳120 BDT",
      costBn: "৳১২০",
      expressEn: "Air Express to CTG & Sylhet Available",
      expressBn: "চট্টগ্রাম ও সিলেটে এয়ার এক্সপ্রেস সুবিধা",
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
            {isBn ? "শিপিং ও ডেলিভারি" : "Shipping & Delivery"}
          </span>
        </nav>

        {/* ── Hero Banner ── */}
        <div className="relative rounded-3xl bg-linear-to-br from-neutral-950 via-neutral-900 to-black text-white p-8 sm:p-14 lg:p-20 shadow-2xl overflow-hidden mb-16 border border-neutral-800 animate-fade-in-up">
          <div className="absolute right-0 top-0 translate-x-20 -translate-y-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-neutral-800/20 rounded-full blur-3xl pointer-events-none animate-float-slow" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-neutral-300 border border-white/10 mb-6">
              <Truck className="h-3.5 w-3.5 text-amber-400" />
              <span>{isBn ? "এক্সপ্রেস ফুলফিলমেন্ট" : "RAPID ATELIER FULFILLMENT"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
              {isBn ? "সঠিক সময়ে আপনার দরজায় পৌঁছে দেওয়ার নিশ্চয়তা" : "SECURE, DOORSTEP DELIVERY ACROSS BANGLADESH."}
            </h1>

            <p className="text-xs sm:text-base text-neutral-300 font-normal leading-relaxed mb-8 max-w-2xl">
              {isBn
                ? "জেভন-এর প্রিমিয়াম ৩৮০+ জিএসএম পোশাক সম্পূর্ণ সুরক্ষিত ট্যাম্পার-প্রুফ বক্সে সরাসরি আপনার ঠিকানায় পৌঁছে যায়। ২,৫০০ টাকার অর্ডারে উপভোগ করুন ফ্রি ডেলিভারি।"
                : "Engineered to reach your doorstep with extreme precision. We partner with top-tier courier networks for rapid 24–72 hour fulfillment nationwide."}
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link
                href="/account/orders"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <span>{isBn ? "লাইভ অর্ডার ট্র্যাক করুন" : "Track Active Order"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-4 py-3 rounded-2xl border border-emerald-800/40">
                <CheckCircle2 className="h-4 w-4" />
                <span>{isBn ? "৳২,৫০০+ অর্ডারে ফ্রি শিপিং" : "Free Shipping Over ৳2,500"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {shippingFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                style={{ animationDelay: `${idx * 150}ms` }}
                className="animate-fade-in-up rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 shadow-xs hover-card-lift transition-all space-y-4 group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-neutral-950 dark:text-white">
                  {isBn ? feat.titleBn : feat.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {isBn ? feat.descBn : feat.descEn}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Rates Table & Interactive Calculator ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 mb-16 items-start">
          {/* Rate Zones (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
                {isBn ? "ডেলিভারি এরিয়া ও খরচ" : "Delivery Zones & Timelines"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                {isBn
                  ? "আপনার লোকেশন অনুযায়ী স্ট্যান্ডার্ড ডেলিভারি সময় ও চার্জের তালিকা।"
                  : "Transparent standard and express rates calculated based on regional courier hubs."}
              </p>
            </div>

            <div className="space-y-4">
              {zoneRates.map((rate, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs hover-card-lift transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-500" />
                      <h3 className="font-extrabold text-sm sm:text-base text-neutral-950 dark:text-white">
                        {isBn ? rate.cityBn : rate.cityEn}
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-6">
                      {isBn ? rate.timeBn : rate.timeEn} • {isBn ? rate.expressBn : rate.expressEn}
                    </p>
                  </div>

                  <div className="sm:text-right pl-6 sm:pl-0">
                    <span className="text-lg font-black text-neutral-950 dark:text-white">
                      {isBn ? rate.costBn : rate.costEn}
                    </span>
                    <span className="block text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {isBn ? "৳২,৫০০+ অর্ডারে ফ্রি" : "Free on ৳2,500+"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculator Widget (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 shadow-lg space-y-6">
              <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-neutral-950 dark:text-white">
                    {isBn ? "শিপিং চার্জ ক্যালকুলেটর" : "Estimate Shipping Cost"}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {isBn ? "লোকেশন ও বাজেট সিলেক্ট করুন" : "Enter location & cart estimate"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleCalculate} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {isBn ? "ডেলিভারি শহর / জেলা" : "Destination City / District"}
                  </label>
                  <select
                    value={calcCity}
                    onChange={(e) => setCalcCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  >
                    <option value="Dhaka">Dhaka (Metro)</option>
                    <option value="Gazipur">Gazipur / Savar / Narayanganj</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barishal">Barishal</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                    <option value="Other">Other District</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {isBn ? "আনুমানিক শপিং বাজেট (টাকা)" : "Estimated Cart Value (BDT)"}
                  </label>
                  <input
                    type="number"
                    value={calcSubtotal}
                    onChange={(e) => setCalcSubtotal(e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isCalculating}
                  className="w-full py-2.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs hover:opacity-90 transition-all cursor-pointer"
                >
                  {isCalculating ? (isBn ? "হিসাব করা হচ্ছে..." : "Calculating...") : (isBn ? "চার্জ চেক করুন" : "Calculate Rate")}
                </Button>
              </form>

              {calcResult && (
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2 animate-in fade-in">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 dark:text-neutral-400 font-medium">
                      {isBn ? "ডেলিভারি জোন:" : "Zone:"}
                    </span>
                    <span className="font-bold text-neutral-950 dark:text-white">
                      {calcResult.shippingZone?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 dark:text-neutral-400 font-medium">
                      {isBn ? "আনুমানিক সময়:" : "Timeline:"}
                    </span>
                    <span className="font-bold text-neutral-950 dark:text-white">
                      {calcResult.shippingZone?.estimatedDeliveryDays || "24 - 48 Hours"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-neutral-200 dark:border-neutral-700">
                    <span className="font-extrabold text-neutral-950 dark:text-white">
                      {isBn ? "শিপিং চার্জ:" : "Shipping Charge:"}
                    </span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-base">
                      {calcResult.shippingCost === 0 || calcResult.freeShipping?.isFreeShipping
                        ? isBn ? "ফ্রি (৳০)" : "FREE (৳0)"
                        : `৳${calcResult.shippingCost || 60}`}
                    </span>
                  </div>
                  {calcResult.freeShipping?.message && (
                    <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
                      {calcResult.freeShipping.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Packaging Standards ── */}
        <div className="rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 p-8 sm:p-12 mb-16">
          <div className="max-w-3xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-[10px] font-extrabold uppercase mb-3 text-neutral-800 dark:text-neutral-200">
              <Package className="h-3.5 w-3.5" />
              {isBn ? "প্যাকেজিং স্ট্যান্ডার্ড" : "UNBOXING EXPERIENCE"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white">
              {isBn ? "প্রিমিয়াম ও টেকসই আনবক্সিং অভিজ্ঞতা" : "Engineered Packaging & Garment Protection"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              {isBn
                ? "আমাদের ভারী ফেব্রিকের পোশাকগুলো যেন ভাঁজ বা দাগ ছাড়া ঠিক কারখানার মান নিয়ে আপনার হাতে পৌঁছায়, সেজন্য আমরা বিশেষভাবে তৈরি ম্যাট ফিনিশ বক্সে ডেলিভারি করি।"
                : "Every piece is pressed, placed into anti-static breathable inner bags, and housed inside triple-walled matte black unbleached kraft boxes."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <h4 className="font-bold text-xs text-neutral-950 dark:text-white">
                {isBn ? "ট্যাম্পার এভিডেন্ট সিল" : "Tamper Security Tape"}
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {isBn ? "প্যাকেট খোলা হলে তা সহজেই বোঝা যায়।" : "Guarantees unopened factory condition."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-2">
              <Box className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
              <h4 className="font-bold text-xs text-neutral-950 dark:text-white">
                {isBn ? "হেভিওয়েট ক্রাফ্ট বক্স" : "Heavyweight Mailer"}
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {isBn ? "বৃষ্টি বা ধুলাবালি থেকে সুরক্ষিত রাখে।" : "Moisture and pressure impact resistant."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-2">
              <Layers className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
              <h4 className="font-bold text-xs text-neutral-950 dark:text-white">
                {isBn ? "বায়োডিগ্রেডেবল কভার" : "Bio Inner Sleeves"}
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {isBn ? "১০০% প্লাস্টিক-মুক্ত ও পরিবেশবান্ধব।" : "100% compostable botanical packaging."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h4 className="font-bold text-xs text-neutral-950 dark:text-white">
                {isBn ? "কালেক্টরস আর্ট কার্ড" : "Authenticity Card"}
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {isBn ? "প্রতিটি অর্ডারে আর্টওয়ার্ক ও কেয়ার গাইড।" : "Includes fabric GSM spec card & care notes."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
