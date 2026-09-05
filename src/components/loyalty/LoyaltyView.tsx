"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  Sparkles,
  Crown,
  Gift,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Flame,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function LoyaltyView() {
  const { t, isBn } = useTranslation();

  const tiers = [
    {
      name: "Bronze",
      spend: isBn ? "৳০ - ৳৫,০০০" : "৳0 – ৳5,000",
      rate: "1.0x Points",
      color: "from-amber-900 to-amber-700",
      badge: "ENTRY TIER",
      perks: [
        "1 Point per ৳100 Spent",
        "Birthday Surprise Bonus",
        "Standard Drop Access",
      ],
    },
    {
      name: "Silver",
      spend: isBn ? "৳৫,০০০ - ৳২০,০০০" : "৳5,000 – ৳20,000",
      rate: "1.25x Points",
      color: "from-neutral-400 to-neutral-200 text-neutral-950",
      badge: "ACTIVE MEMBER",
      perks: [
        "1.25x Earning Multiplier",
        "12-Hour Drop Early Access",
        "Priority Customer Support",
      ],
    },
    {
      name: "Gold",
      spend: isBn ? "৳২০,০০০ - ৳৫০,০০০" : "৳20,000 – ৳50,000",
      rate: "1.5x Points",
      color: "from-amber-400 to-amber-200 text-neutral-950",
      badge: "VIP TIER",
      highlight: true,
      perks: [
        "1.5x Earning Multiplier",
        "Free Express Delivery Always",
        "Exclusive Gold Archive Drops",
        "Private Atelier Fitting Access",
      ],
    },
    {
      name: "Platinum",
      spend: isBn ? "৳৫০,০০০+" : "৳50,000+",
      rate: "2.0x Points",
      color: "from-indigo-600 via-purple-600 to-pink-600 text-white",
      badge: "INNER CIRCLE",
      perks: [
        "2.0x Points Multiplier",
        "Custom 1-of-1 Made-to-Order Piece",
        "Personal Styling Concierge",
        "VIP Fashion Week & Pop-Up Invites",
      ],
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
            {isBn ? "লয়ালটি ও রিওয়ার্ডস" : "ZEVON Club"}
          </span>
        </nav>

        {/* ── Hero Banner ── */}
        <div className="relative rounded-3xl bg-linear-to-br from-neutral-950 via-neutral-900 to-black text-white p-8 sm:p-14 lg:p-20 shadow-2xl overflow-hidden mb-16 border border-neutral-800 animate-fade-in-up">
          <div className="absolute right-0 top-0 translate-x-20 -translate-y-20 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-neutral-300 border border-white/10 mb-6">
              <Crown className="h-3.5 w-3.5 text-amber-400" />
              <span>{isBn ? "জেভন লয়ালটি প্রিভিলেজ" : "ZEVON ATELIER PRIVILEGE CLUB"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
              {isBn ? "প্রতিটি কেনাকাটায় পয়েন্ট ও এক্সক্লুসিভ রিওয়ার্ডস" : "UNLOCK TIERED PRIVILEGES & CASH REWARDS."}
            </h1>

            <p className="text-xs sm:text-base text-neutral-300 font-normal leading-relaxed mb-8 max-w-2xl">
              {isBn
                ? "আমাদের মেম্বারশিপে যোগ দিন। প্রতিটি অর্ডারে পয়েন্ট অর্জন করুন যা তাৎক্ষণিক ক্যাশ ডিসকাউন্ট হিসেবে ব্যবহার করা যায় (১ পয়েন্ট = ৳১)।"
                : "Earn points on every heavyweight drop. Redeem points for instant cash savings (1 Point = ৳1 BDT) and unlock early access to archive collections."}
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link
                href="/account"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <span>{isBn ? "আমার পয়েন্ট ও ওয়ালেট দেখুন" : "View My Loyalty Wallet"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-neutral-900 border border-neutral-700 text-white text-xs font-bold hover:bg-neutral-800 transition-all"
              >
                <span>{isBn ? "কালেকশন কিনুন ও পয়েন্ট জিতুন" : "Shop To Earn Points"}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Tiers Grid ── */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
              {isBn ? "লয়ালটি টায়ার ও সুবিধাসমূহ" : "Membership Tiers & Exclusive Perks"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              {isBn
                ? "যত বেশি কেনাকাটা করবেন, তত দ্রুত উচ্চতর টায়ার ও বিশেষ সুবিধা আনলক হবে।"
                : "Ascend through our 4 architectural tiers with compounding rewards and personal concierge access."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all ${
                  tier.highlight
                    ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 ring-2 ring-amber-400 shadow-2xl hover-card-lift"
                    : "bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover-card-lift"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white">
                      {tier.badge}
                    </span>
                    <Award className="h-5 w-5 text-amber-500" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black">{tier.name}</h3>
                    <p className="text-xs opacity-75 mt-0.5">{tier.spend}</p>
                  </div>

                  <div className="text-lg font-black text-amber-500">{tier.rate}</div>

                  <ul className="space-y-2.5 text-xs opacity-90 pt-2 border-t border-neutral-200/40 dark:border-neutral-700/40">
                    {tier.perks.map((p, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-500" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
