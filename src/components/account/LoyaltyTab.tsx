"use client";

import React, { useState } from "react";
import {
  Award,
  Sparkles,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Gift,
  ArrowRight,
  Clock,
  CheckCircle2,
  Lock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useTranslation, toBengaliDigits } from "@/lib/i18n";
import { useGetMyLoyaltyAccountQuery } from "@/redux/api/loyaltyApi";
import { Badge } from "@/components/ui/badge";

export function LoyaltyTab() {
  const { t, isBn } = useTranslation();
  const { data: loyaltyRes, isLoading } = useGetMyLoyaltyAccountQuery();

  const account = loyaltyRes?.data;
  const points = account?.pointsBalance ?? 0;
  const cashValue = account?.cashValueBDT ?? 0;
  const tier = account?.tier;
  const currentTier = tier?.tierName || "Bronze";
  const progress = tier?.progressPercent ?? 20;
  const transactions = account?.transactions || [];

  const tierBadges: Record<string, { color: string; border: string; bg: string }> = {
    Bronze: { color: "text-amber-700 dark:text-amber-400", border: "border-amber-700/30", bg: "bg-amber-700/10" },
    Silver: { color: "text-neutral-400 dark:text-neutral-200", border: "border-neutral-400/30", bg: "bg-neutral-400/10" },
    Gold: { color: "text-amber-400", border: "border-amber-400/30", bg: "bg-amber-400/10" },
    Platinum: { color: "text-indigo-400", border: "border-indigo-400/30", bg: "bg-indigo-400/10" },
  };

  const activeBadge = tierBadges[currentTier] ?? {
    color: "text-amber-700 dark:text-amber-400",
    border: "border-amber-700/30",
    bg: "bg-amber-700/10",
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* ── Loyalty Header Card ── */}
      <div className="relative rounded-3xl bg-linear-to-br from-neutral-950 via-neutral-900 to-black text-white p-6 sm:p-10 shadow-2xl overflow-hidden border border-neutral-800">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-neutral-300 border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>{isBn ? "জেভন ক্লাব ও রিওয়ার্ডস" : "ZEVON ATELIER CLUB"}</span>
            </div>

            <div className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${activeBadge.bg} ${activeBadge.color} ${activeBadge.border}`}>
              {currentTier} MEMBER
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div>
              <span className="text-xs text-neutral-400 block font-medium">
                {isBn ? "বর্তমান পয়েন্ট ব্যালেন্স" : "Points Balance"}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white mt-0.5">
                {isBn ? toBengaliDigits(points) : points}{" "}
                <span className="text-sm font-normal text-neutral-400">PTS</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-neutral-400 block font-medium">
                {isBn ? "ক্যাশ ডিসকাউন্ট সমমূল্য" : "Cash Equivalent"}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-0.5">
                ৳{isBn ? toBengaliDigits(cashValue) : cashValue}
              </div>
            </div>

            <div>
              <span className="text-xs text-neutral-400 block font-medium">
                {isBn ? "পয়েন্ট আর্নিং রেট" : "Earning Multiplier"}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-300 mt-0.5">
                {tier?.multiplier || 1.0}x
              </div>
            </div>
          </div>

          {/* Progress to next tier */}
          {tier?.nextTier && (
            <div className="space-y-2 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-neutral-300">
                  {isBn
                    ? `পরবর্তী টায়ার (${tier.nextTier})-এ উন্নীত হতে প্রয়োজন: ৳${toBengaliDigits(tier.amountNeededForNextTierBDT)}`
                    : `Spend ৳${tier.amountNeededForNextTierBDT} more to reach ${tier.nextTier}`}
                </span>
                <span className="text-amber-300">{progress}%</span>
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-linear-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Tier Perks & Ledger Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Tier Benefits (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="text-base font-black text-neutral-950 dark:text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            <span>{isBn ? "আপনার বর্তমান টায়ার সুবিধাসমূহ" : `${currentTier} Tier Privileges`}</span>
          </h3>

          <ul className="space-y-3 text-xs text-neutral-600 dark:text-neutral-300">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{isBn ? "১ পয়েন্ট = ৳১ নগদ ক্যাশব্যাক ডিসকাউন্ট" : "1 Loyalty Point = ৳1 Instant Cash Discount"}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{isBn ? "নতুন ড্রপে আর্লি এক্সেস অগ্রাধিকার" : "Early Access to Limited Heavyweight Drops"}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{isBn ? "জন্মদিনে বিশেষ উপহার ও বোনাস পয়েন্ট" : "Birthday Surprise Gift & Bonus Points"}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{isBn ? "ফ্রি এক্সপ্রেস ডেলিভারি ও প্রায়োরিটি সাপোর্ট" : "Complimentary Express Fulfillment"}</span>
            </li>
          </ul>
        </div>

        {/* Points Ledger (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-neutral-500" />
            <span>{isBn ? "পয়েন্ট লেনদেনের বিবরণ" : "Recent Points Activity"}</span>
          </h3>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
              {isBn
                ? "এখনও কোনো পয়েন্ট লেনদেন রেকর্ড করা হয়নি। অর্ডার সম্পন্ন করে পয়েন্ট অর্জন করুন।"
                : "No points transactions recorded yet. Complete orders to earn points."}
            </div>
          ) : (
            <div className="space-y-2.5">
              {transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 text-xs"
                >
                  <div>
                    <span className="font-bold text-neutral-950 dark:text-white block">
                      {tx.description}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span
                    className={`font-black text-sm ${
                      tx.points >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {tx.points >= 0 ? `+${tx.points}` : tx.points} PTS
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
