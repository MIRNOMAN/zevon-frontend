"use client";

import React, { useState } from "react";
import {
  Gift,
  Copy,
  Check,
  Users,
  Award,
  Wallet,
  ArrowRight,
  Share2,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useTranslation, toBengaliDigits } from "@/lib/i18n";
import {
  useGetMyReferralStatsQuery,
  useApplyReferralCodeMutation,
} from "@/redux/api/referralApi";
import { Button } from "@/components/ui/button";

export function ReferralTab() {
  const { t, isBn } = useTranslation();
  const { data: statsRes, isLoading } = useGetMyReferralStatsQuery();
  const [applyReferralCode, { isLoading: isApplying }] = useApplyReferralCodeMutation();

  const [copied, setCopied] = useState(false);
  const [friendCode, setFriendCode] = useState("");
  const [applySuccess, setApplySuccess] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  const referralData = statsRes?.data;
  const referralCode = referralData?.referralCode || "ZEV-STREET-2026";
  const referralLink =
    referralData?.referralLink ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${referralCode}`
      : `https://zevon.com/register?ref=${referralCode}`);

  const stats = referralData?.stats || {
    totalFriendsInvited: 0,
    successfulOrders: 0,
    totalPointsEarned: 0,
    totalCashValueBDT: 0,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplySuccess(null);
    setApplyError(null);

    if (!friendCode.trim()) {
      setApplyError(isBn ? "অনুগ্রহ করে একটি রেফারেল কোড দিন।" : "Please enter a referral code.");
      return;
    }

    try {
      const res = await applyReferralCode({ referralCode: friendCode.trim() }).unwrap();
      setApplySuccess(
        res?.message ||
          (isBn
            ? "রেফারেল কোড সফলভাবে যোগ করা হয়েছে! আপনার প্রথম অর্ডারে পাবেন ৫০০ টাকা ডিসকাউন্ট।"
            : "Referral code applied! You unlocked a ৳500 discount on your first order.")
      );
      setFriendCode("");
    } catch (err: any) {
      setApplyError(
        err?.data?.message ||
          (isBn ? "রেফারেল কোডটি সঠিক নয় বা ইতোমধ্যেই ব্যবহার করা হয়েছে।" : "Invalid or already used referral code.")
      );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* ── Banner: Give ৳500, Get ৳500 ── */}
      <div className="relative rounded-3xl bg-linear-to-br from-neutral-950 via-neutral-900 to-black text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-neutral-800">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-400 border border-amber-400/20">
            <Gift className="h-3.5 w-3.5" />
            <span>{isBn ? "জেভন রেফারেল প্রোগ্রাম" : "ZEVON REWARDS & REFERRAL"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            {isBn ? "বন্ধুকে উপহার দিন ৳৫০০, আপনিও পান ৳৫০০!" : "GIVE ৳500, GET ৳500 REWARD."}
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
            {isBn
              ? "আপনার ইউনিক রেফারেল লিংক বা কোড বন্ধুদের সাথে শেয়ার করুন। তারা প্রথম অর্ডারে পাবে ৫০০ টাকা ডিসকাউন্ট এবং তাদের অর্ডার ডেলিভারি হলে আপনি পাবেন ৫০০ টাকার ওয়ালেট ক্যাশব্যাক বা পয়েন্ট।"
              : "Share your exclusive referral invite with friends. They receive ৳500 off their first heavyweight order, and you earn ৳500 in store credits or loyalty points when they check out."}
          </p>

          {/* Copyable Link Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 flex items-center justify-between px-4 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md text-xs font-mono text-neutral-200">
              <span className="truncate">{referralLink}</span>
              <span className="font-bold text-amber-300 ml-2 shrink-0">{referralCode}</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-md shrink-0 cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? (isBn ? "কপি হয়েছে!" : "Copied Link!") : (isBn ? "লিংক কপি করুন" : "Copy Link")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats Overview (4 Cards) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-2 hover-card-lift transition-all">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white">
            <Users className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">
            {isBn ? "আমন্ত্রিত বন্ধু" : "Total Friends Invited"}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white">
            {isBn ? toBengaliDigits(stats.totalFriendsInvited) : stats.totalFriendsInvited}
          </span>
        </div>

        <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-2 hover-card-lift transition-all">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">
            {isBn ? "সফল ডেলিভারি" : "Completed Orders"}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white">
            {isBn ? toBengaliDigits(stats.successfulOrders) : stats.successfulOrders}
          </span>
        </div>

        <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-2 hover-card-lift transition-all">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Award className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">
            {isBn ? "অর্জিত পয়েন্ট" : "Loyalty Points"}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white">
            {isBn ? toBengaliDigits(stats.totalPointsEarned) : stats.totalPointsEarned}
          </span>
        </div>

        <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-2 hover-card-lift transition-all">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">
            {isBn ? "মোট ক্যাশ রিওয়ার্ড" : "Total Cash Earned"}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white">
            ৳{isBn ? toBengaliDigits(stats.totalCashValueBDT) : stats.totalCashValueBDT}
          </span>
        </div>
      </div>

      {/* ── Apply Friend's Code & How It Works ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Apply Friend's Code Form (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-neutral-950 dark:text-white">
              {isBn ? "বন্ধুর রেফারেল কোড যুক্ত করুন" : "Have a Friend's Referral Code?"}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {isBn
                ? "কোডটি লিখুন এবং আপনার অ্যাকাউন্টে তাৎক্ষণিক ৫০০ টাকা রিওয়ার্ড আনলক করুন।"
                : "Enter their code below to claim your ৳500 welcome discount."}
            </p>
          </div>

          {applySuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{applySuccess}</span>
            </div>
          )}

          {applyError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{applyError}</span>
            </div>
          )}

          <form onSubmit={handleApply} className="space-y-3">
            <input
              type="text"
              required
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value)}
              placeholder="e.g. ZEV-NOMAN-8421"
              className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 uppercase tracking-wider"
            />
            <Button
              type="submit"
              disabled={isApplying}
              className="w-full py-3 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs hover:opacity-90 transition-all cursor-pointer"
            >
              {isApplying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              <span>{isApplying ? (isBn ? "যাচাই করা হচ্ছে..." : "Applying...") : (isBn ? "কোড প্রয়োগ করুন" : "Apply & Unlock ৳500")}</span>
            </Button>
          </form>
        </div>

        {/* How It Works (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>{isBn ? "রেফারেল যেভাবে কাজ করে" : "How the Program Works"}</span>
          </h3>

          <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
              <span className="h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
              <span>{isBn ? "আপনার ব্যক্তিগত রেফারেল লিংক বা কোড বন্ধুদের পাঠান।" : "Share your personal invite link or ZEV code via WhatsApp or Socials."}</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
              <span className="h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
              <span>{isBn ? "তারা রেজিস্ট্রেশন করে যেকোনো পোশাকের প্রথম অর্ডারে পাবে ৫০০ টাকা ছাড়।" : "Your friend registers and receives an instant ৳500 discount on their first drop."}</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
              <span className="h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
              <span>{isBn ? "তাদের অর্ডার সফলভাবে ডেলিভারি হওয়ার সাথে সাথেই আপনার ওয়ালেটে ৫০০ টাকা ক্রেডিট জমা হবে।" : "Once their package is delivered, you automatically receive ৳500 / 50 points in your account!"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
