"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Gift,
  CreditCard,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  ArrowRight,
  ShieldCheck,
  Mail,
  Send,
  Calendar,
} from "lucide-react";
import { useTranslation, useCurrency, toBengaliDigits } from "@/lib/i18n";
import {
  usePurchaseGiftCardMutation,
  useCheckGiftCardBalanceMutation,
  GiftCardBalanceResult,
} from "@/redux/api/giftCardApi";
import { useAppSelector } from "@/redux/hooks";
import { selectIsAuthenticated } from "@/redux/features/authSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function GiftCardView() {
  const { t, isBn } = useTranslation();
  const { formatPrice } = useCurrency();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Purchase state
  const [selectedAmount, setSelectedAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const [purchaseGiftCard, { isLoading: isPurchasing }] = usePurchaseGiftCardMutation();

  // Balance Check state
  const [checkCode, setCheckCode] = useState("");
  const [balanceResult, setBalanceResult] = useState<GiftCardBalanceResult | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const [checkBalance, { isLoading: isChecking }] = useCheckGiftCardBalanceMutation();

  const presetAmounts = [1000, 2500, 5000, 10000];
  const finalAmount = customAmount ? Number(customAmount) : selectedAmount;

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setPurchaseError(null);

    if (!recipientEmail.trim() || finalAmount <= 0) {
      setPurchaseError(
        isBn
          ? "অনুগ্রহ করে বৈধ প্রাপক ইমেইল ও টাকার পরিমাণ দিন।"
          : "Please enter a valid recipient email and card amount."
      );
      return;
    }

    try {
      await purchaseGiftCard({
        amount: finalAmount,
        recipientEmail: recipientEmail.trim(),
        recipientName: recipientName.trim() || undefined,
        customMessage: customMessage.trim() || undefined,
      }).unwrap();

      setPurchaseSuccess(true);
      setRecipientEmail("");
      setRecipientName("");
      setCustomMessage("");
    } catch (err: any) {
      setPurchaseError(
        err?.data?.message ||
          (isBn
            ? "গিফট কার্ড প্রসেস করতে ব্যর্থ হয়েছে। অনুগ্রহ করে লগইন নিশ্চিত করুন।"
            : "Failed to purchase gift card. Please ensure you are logged in.")
      );
    }
  };

  const handleCheckBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    setBalanceError(null);
    setBalanceResult(null);

    if (!checkCode.trim()) return;

    try {
      const res = await checkBalance({ code: checkCode.trim() }).unwrap();
      if (res?.data) {
        setBalanceResult(res.data);
      }
    } catch (err: any) {
      setBalanceError(
        err?.data?.message ||
          (isBn
            ? "গিফট কার্ড ভাউচার কোডটি সঠিক নয় বা মেয়াদ শেষ হয়েছে।"
            : "Invalid or expired gift card voucher code.")
      );
    }
  };

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
            {isBn ? "ডিজিটাল গিফট কার্ড" : "Digital Gift Cards"}
          </span>
        </nav>

        {/* ── Hero Banner ── */}
        <div className="relative rounded-3xl bg-linear-to-br from-neutral-950 via-neutral-900 to-black text-white p-8 sm:p-14 lg:p-20 shadow-2xl overflow-hidden mb-12 border border-neutral-800 animate-fade-in-up">
          <div className="absolute right-0 top-0 translate-x-20 -translate-y-20 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-neutral-300 border border-white/10 mb-6">
              <Gift className="h-3.5 w-3.5 text-amber-400" />
              <span>{isBn ? "ডিজিটাল ভাউচার উপহার" : "DIGITAL ATELIER VOUCHER"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
              {isBn ? "প্রিয়জনকে দিন প্রিমিয়াম ফ্যাশনের সেরা উপহার" : "GIFT THE SUBSTANCE OF HEAVYWEIGHT LUXURY."}
            </h1>

            <p className="text-xs sm:text-base text-neutral-300 font-normal leading-relaxed mb-8 max-w-2xl">
              {isBn
                ? "জেভন ডিজিটাল গিফট কার্ড যেকোনো উপলক্ষে তাৎক্ষণিকভাবে প্রিয়জনের ইমেইলে পাঠিয়ে দিন। মেয়াদ ১ বছর এবং যেকোনো ড্রপের চেকআউটে ব্যবহারযোগ্য।"
                : "Deliver instant streetwear freedom directly to their inbox with a personalized note. Valid across all archive collections and bespoke drops for 12 months."}
            </p>
          </div>
        </div>

        {/* ── 2-Column Purchase & Balance Checker Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start mb-20">
          {/* Purchase Gift Card Form (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-10 shadow-lg space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white">
                {isBn ? "গিফট কার্ড কাস্টমাইজ করুন" : "Design Your Gift Card"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {isBn ? "পরিমাণ এবং প্রাপকের তথ্য পূরণ করুন" : "Select an amount and recipient delivery info"}
              </p>
            </div>

            {/* Visual Digital Card Preview */}
            <div className="relative rounded-3xl bg-linear-to-tr from-neutral-950 via-neutral-900 to-neutral-800 text-white p-6 sm:p-8 shadow-2xl border border-neutral-700 overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="font-black text-xl tracking-tighter">ZEVON</span>
                <Badge className="bg-amber-400 text-neutral-950 font-black text-[10px]">
                  E-GIFT VOUCHER
                </Badge>
              </div>

              <div className="my-8">
                <span className="text-xs uppercase text-neutral-400 font-bold block">
                  {isBn ? "কার্ডের মান" : "Voucher Value"}
                </span>
                <span className="text-3xl sm:text-4xl font-black text-white">
                  {formatPrice(finalAmount)}
                </span>
              </div>

              <div className="flex justify-between items-end text-xs text-neutral-400 font-mono">
                <span>{recipientName ? `FOR: ${recipientName}` : "FOR: VALUED RECIPIENT"}</span>
                <span>VALID: 1 YEAR</span>
              </div>
            </div>

            {purchaseSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3 animate-in fade-in">
                <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-500" />
                <h3 className="font-black text-base text-emerald-900 dark:text-emerald-200">
                  {isBn ? "গিফট কার্ড সফলভাবে পাঠানো হয়েছে!" : "Gift Card Issued Successfully!"}
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  {isBn
                    ? "প্রাপকের ইমেইলে ভাউচার কোড ও আপনার বার্তা পৌঁছে গেছে।"
                    : "The voucher code and your greeting message have been delivered to the recipient."}
                </p>
                <Button
                  type="button"
                  onClick={() => setPurchaseSuccess(false)}
                  className="bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold"
                >
                  {isBn ? "আরেকটি কার্ড কিনুন" : "Send Another Card"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handlePurchase} className="space-y-5">
                {purchaseError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{purchaseError}</span>
                  </div>
                )}

                {/* Amount presets */}
                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-2">
                    {isBn ? "কার্ডের পরিমাণ সিলেক্ট করুন (টাকা) *" : "Choose Amount (BDT) *"}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {presetAmounts.map((amt) => {
                      const isSelected = !customAmount && selectedAmount === amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amt);
                            setCustomAmount("");
                          }}
                          className={`py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-sm"
                              : "bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
                          }`}
                        >
                          ৳{isBn ? toBengaliDigits(amt) : amt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {isBn ? "অথবা কাস্টম পরিমাণ লিখুন:" : "Or Enter Custom Amount (BDT):"}
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="e.g. 7500"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                </div>

                {/* Recipient Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                      {isBn ? "প্রাপকের ইমেইল *" : "Recipient Email *"}
                    </label>
                    <input
                      type="email"
                      required
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="recipient@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                      {isBn ? "প্রাপকের নাম" : "Recipient Name"}
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Tanvir"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {isBn ? "ব্যক্তিগত বার্তা (ঐচ্ছিক)" : "Personal Note (Optional)"}
                  </label>
                  <textarea
                    rows={3}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Happy Birthday! Enjoy picking your favorite ZEVON heavyweight piece."
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isPurchasing}
                  className="w-full py-3.5 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isPurchasing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>{isBn ? `৳${toBengaliDigits(finalAmount)} গিফট কার্ড কিনুন` : `Purchase ${formatPrice(finalAmount)} Gift Card`}</span>
                </Button>
              </form>
            )}
          </div>

          {/* Balance Checker (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-200/60 dark:border-neutral-800 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-neutral-950 dark:text-white">
                  {isBn ? "ভাউচার ব্যালেন্স চেক" : "Check Card Balance"}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {isBn ? "আপনার কোড দিয়ে অবশিষ্ট টাকা জানুন" : "Enter your code to verify balance"}
                </p>
              </div>
            </div>

            {balanceError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{balanceError}</span>
              </div>
            )}

            <form onSubmit={handleCheckBalance} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  {isBn ? "গিফট কার্ড কোড *" : "Gift Voucher Code *"}
                </label>
                <input
                  type="text"
                  required
                  value={checkCode}
                  onChange={(e) => setCheckCode(e.target.value)}
                  placeholder="e.g. ZEV-GIFT-8921-4829"
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono font-bold text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 uppercase tracking-wider"
                />
              </div>

              <Button
                type="submit"
                disabled={isChecking}
                className="w-full py-3 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs hover:opacity-90 transition-all cursor-pointer"
              >
                {isChecking ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                <span>{isBn ? "ব্যালেন্স চেক করুন" : "Check Remaining Balance"}</span>
              </Button>
            </form>

            {balanceResult && (
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 animate-in fade-in">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500 font-medium">{isBn ? "ভাউচার স্ট্যাটাস:" : "Card Status:"}</span>
                  <Badge className="bg-emerald-500 text-white font-bold text-[10px]">
                    {balanceResult.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500 font-medium">{isBn ? "অবশিষ্ট ব্যালেন্স:" : "Remaining Balance:"}</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    ৳{isBn ? toBengaliDigits(balanceResult.currentBalance) : balanceResult.currentBalance}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px]">
                  <span>{isBn ? "মেয়াদ শেষ:" : "Expires:"}</span>
                  <span>{new Date(balanceResult.expiresAt).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
