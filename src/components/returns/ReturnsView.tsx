"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Truck,
  CreditCard,
  MessageSquare,
  Clock,
  ExternalLink,
  Search,
  Loader2,
  AlertCircle,
  Package,
  Check,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useTrackReturnMutation, TrackReturnResponse } from "@/redux/api/returnApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ReturnsView() {
  const { t, isBn } = useTranslation();

  const [returnReference, setReturnReference] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [trackError, setTrackError] = useState<string | null>(null);
  const [trackResult, setTrackResult] = useState<TrackReturnResponse | null>(null);

  const [trackReturn, { isLoading: isTracking }] = useTrackReturnMutation();

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError(null);
    setTrackResult(null);

    if (!returnReference.trim() || !emailOrPhone.trim()) {
      setTrackError(
        isBn
          ? "অনুগ্রহ করে রিটার্ন রেফারেন্স এবং ফোন/ইমেইল উভয় ফিল্ড পূরণ করুন।"
          : "Please enter both your return reference number and phone or email."
      );
      return;
    }

    try {
      const res = await trackReturn({
        returnReference: returnReference.trim(),
        emailOrPhone: emailOrPhone.trim(),
      }).unwrap();

      if (res?.data) {
        setTrackResult(res.data);
      }
    } catch (err: any) {
      setTrackError(
        err?.data?.message ||
          (isBn
            ? "রিটার্ন ট্র্যাকিং তথ্য খুঁজে পাওয়া যায়নি। অনুগ্রহ করে রেফারেন্স নম্বর যাচাই করুন।"
            : "Return reference not found. Please check your reference ID and email/phone.")
      );
    }
  };

  const steps = [
    {
      number: "01",
      icon: MessageSquare,
      titleEn: "Submit Return Request",
      titleBn: "রিটার্ন বা এক্সচেঞ্জ রিকোয়েস্ট",
      descEn: "Request a size swap or refund directly from your Account Orders page or WhatsApp Concierge within 7 calendar days of delivery.",
      descBn: "পণ্য হাতে পাওয়ার ৭ দিনের মধ্যে আপনার অ্যাকাউন্ট অর্ডার পেইজ থেকে অথবা আমাদের হোয়াটসঅ্যাপে রিকোয়েস্ট পাঠান।",
    },
    {
      number: "02",
      icon: Truck,
      titleEn: "Doorstep Courier Pickup",
      titleBn: "হোম পিকআপ ও যাচাই",
      descEn: "Our courier rider arrives at your doorstep across Dhaka and nationwide to safely collect the packaged item.",
      descBn: "আমাদের ডেলিভারি রাইডার সরাসরি আপনার ঠিকানায় গিয়ে পণ্যটি সংগ্রহ করে নিয়ে আসবে।",
    },
    {
      number: "03",
      icon: RotateCcw,
      titleEn: "Instant Replacement / Refund",
      titleBn: "তাৎক্ষণিক এক্সচেঞ্জ বা রিফান্ড",
      descEn: "Your preferred replacement size is dispatched immediately, or your full refund is processed to your bKash, Nagad, or Card within 3–5 working days.",
      descBn: "আপনার পছন্দের নতুন সাইজ অবিলম্বে পাঠানো হবে, অথবা ৩-৫ কার্যদিবসের মধ্যে বিকাশ/নগদে সম্পূর্ণ টাকা রিফান্ড করা হবে।",
    },
  ];

  const eligibleItems = [
    { textEn: "Unworn and unwashed garments in pristine state", textBn: "অব্যবহৃত, না ধোয়া এবং অক্ষত অবস্থায় থাকা পোশাক" },
    { textEn: "Original ZEVON streetwear hangtags and barcodes intact", textBn: "মূল জেভন হ্যাংট্যাগ ও বারকোড অক্ষত থাকা" },
    { textEn: "Return initiated within 7 calendar days from delivery date", textBn: "ডেলিভারি পাওয়ার সর্বোচ্চ ৭ দিনের মধ্যে রিকোয়েস্ট করা" },
    { textEn: "Returned with original packaging box & care accessories", textBn: "মূল প্যাকেজিং বক্স ও আনুষঙ্গিক উপাদানসহ ফেরত দেওয়া" },
  ];

  const ineligibleItems = [
    { textEn: "Items showing signs of perfume, deodorant, or makeup stains", textBn: "সুগন্ধি, ডিওডোরেন্ট বা মেকআপের দাগযুক্ত পোশাক" },
    { textEn: "Altered, hemmed, or customized streetwear pieces", textBn: "টেইলরিং করে অল্টার বা কাটছাঁট করা পোশাক" },
    { textEn: "Final Archive Clearance sales items explicitly marked non-returnable", textBn: "বিশেষ ক্লিয়ারেন্স সেলের পণ্য (যা রিটার্নযোগ্য নয়)" },
    { textEn: "Requests submitted after the 7-day warranty window", textBn: "ডেলিভারির ৭ দিন অতিক্রান্ত হওয়ার পর করা আবেদন" },
  ];

  const faqs = [
    {
      qEn: "Is size exchange completely free?",
      qBn: "সাইজ এক্সচেঞ্জের জন্য কি কোনো অতিরিক্ত ফি আছে?",
      aEn: "Yes! Your first size exchange is 100% free with complimentary doorstep courier collection and re-delivery.",
      aBn: "হ্যাঁ! প্রথমবার সাইজ এক্সচেঞ্জের জন্য কোনো ডেলিভারি চার্জ নেওয়া হয় না। সম্পূর্ণ ফ্রিতে নতুন সাইজ পৌঁছে দেওয়া হয়।",
    },
    {
      qEn: "How long does a refund take to reflect in my account?",
      qBn: "রিফান্ডের টাকা কত দিনের মধ্যে ফেরত পাওয়া যায়?",
      aEn: "Once the item reaches our quality inspection atelier in Dhaka, refunds are completed within 3–5 business days via bKash, Nagad, or original Bank Card.",
      aBn: "পণ্যটি আমাদের ঢাকা কোয়ালিটি কন্ট্রোল স্টুডিওতে পৌঁছানোর পর ৩ থেকে ৫ কার্যদিবসের মধ্যে বিকাশ, নগদ বা ব্যাংক কার্ডে টাকা রিফান্ড করা হয়।",
    },
    {
      qEn: "Can I exchange for a completely different product design?",
      qBn: "আমি কি অন্য কোনো ডিজাইনের পোশাকের সাথে এক্সচেঞ্জ করতে পারব?",
      aEn: "Yes. If the new item has a higher price, you only pay the difference during doorstep delivery. If lower, we refund the balance to your account.",
      aBn: "অবশ্যই। নতুন পণ্যের দাম বেশি হলে কেবল পার্থক্যের টাকা দিতে হবে, আর কম হলে বাকি টাকা আপনার অ্যাকাউন্টে রিফান্ড হবে।",
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
            {isBn ? "৭ দিনের রিটার্ন নীতি" : "7-Day Returns Policy"}
          </span>
        </nav>

        {/* ── Hero Banner ── */}
        <div className="relative rounded-3xl bg-linear-to-br from-neutral-950 via-neutral-900 to-black text-white p-8 sm:p-14 lg:p-20 shadow-2xl overflow-hidden mb-16 border border-neutral-800 animate-fade-in-up">
          <div className="absolute right-0 top-0 translate-x-20 -translate-y-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-neutral-800/20 rounded-full blur-3xl pointer-events-none animate-float-slow" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-neutral-300 border border-white/10 mb-6">
              <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
              <span>{isBn ? "সহজ সাইজ এক্সচেঞ্জ" : "RISK-FREE 7-DAY EXCHANGE"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
              {isBn ? "১০০% সন্তুষ্টির নিশ্চয়তা। ঝামেলাহীন ৭ দিনের রিটার্ন।" : "PERFECT FIT GUARANTEED. 7-DAY DOORSTEP RETURNS."}
            </h1>

            <p className="text-xs sm:text-base text-neutral-300 font-normal leading-relaxed mb-8 max-w-2xl">
              {isBn
                ? "আমাদের যেকোনো পোশাকের সাইজ বা ফিট নিয়ে সন্তুষ্ট না হলে ৭ দিনের মধ্যে সহজে এক্সচেঞ্জ বা রিফান্ড নিতে পারবেন। প্রথম সাইজ এক্সচেঞ্জ সম্পূর্ণ ফ্রি।"
                : "If your heavyweight garment does not drape precisely the way you envisioned, return or exchange it effortlessly within 7 days. First size swap is complimentary."}
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link
                href="/account/orders"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <span>{isBn ? "অর্ডার ড্যাশবোর্ড থেকে রিকোয়েস্ট করুন" : "Start Return from Orders"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-neutral-900 border border-neutral-700 text-white text-xs font-bold hover:bg-neutral-800 transition-all"
              >
                <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isBn ? "হোয়াটসঅ্যাপ কনসিয়ার্জ" : "WhatsApp Concierge"}</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── 3 Steps Timeline ── */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
              {isBn ? "সহজ ৩ ধাপে রিটার্ন ও এক্সচেঞ্জ" : "How Our Return Process Works"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              {isBn
                ? "কোনো ঝামেলা ছাড়াই দ্রুততম সময়ে আপনার দোরগোড়া থেকে এক্সচেঞ্জ সুবিধা।"
                : "Designed for seamless convenience without requiring you to visit courier offices."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  style={{ animationDelay: `${idx * 150}ms` }}
                  className="animate-fade-in-up rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 shadow-xs hover-card-lift transition-all space-y-4 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-black text-neutral-300 dark:text-neutral-700">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-neutral-950 dark:text-white">
                    {isBn ? step.titleBn : step.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {isBn ? step.descBn : step.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Eligibility Checklist (2-Column Grid) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Eligible */}
          <div className="rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-emerald-950 dark:text-emerald-300">
                  {isBn ? "যা যা রিটার্নযোগ্য" : "Items Eligible for Return & Exchange"}
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-400">
                  {isBn ? "নিম্নোক্ত শর্তাদি পূরণ সাপেক্ষে" : "Must meet following criteria"}
                </p>
              </div>
            </div>

            <ul className="space-y-3.5">
              {eligibleItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200/90">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <span>{isBn ? item.textBn : item.textEn}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ineligible */}
          <div className="rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500 text-white">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-rose-950 dark:text-rose-300">
                  {isBn ? "যা যা রিটার্নযোগ্য নয়" : "Items Not Eligible for Return"}
                </h3>
                <p className="text-xs text-rose-800 dark:text-rose-400">
                  {isBn ? "যেসব ক্ষেত্রে পলিসি প্রযোজ্য নয়" : "Exceptions and exclusions"}
                </p>
              </div>
            </div>

            <ul className="space-y-3.5">
              {ineligibleItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-rose-900 dark:text-rose-200/90">
                  <XCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                  <span>{isBn ? item.textBn : item.textEn}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Live Return Tracking & FAQ ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 mb-16 items-start">
          {/* Live Track Return Box (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 shadow-lg space-y-6">
              <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-neutral-950 dark:text-white">
                    {isBn ? "লাইভ রিটার্ন ট্র্যাকিং" : "Track Return Progress"}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {isBn ? "রেফারেন্স ও ফোন নম্বর দিন" : "Enter reference & phone/email"}
                  </p>
                </div>
              </div>

              {trackError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{trackError}</span>
                </div>
              )}

              <form onSubmit={handleTrackSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {isBn ? "রিটার্ন রেফারেন্স নম্বর *" : "Return Reference ID *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={returnReference}
                    onChange={(e) => setReturnReference(e.target.value)}
                    placeholder="e.g. RET-20260901-4821"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 uppercase tracking-wider"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {isBn ? "ফোন নম্বর অথবা ইমেইল *" : "Contact Phone / Email *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="e.g. 01700000000 or you@mail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isTracking}
                  className="w-full py-2.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isTracking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span>{isTracking ? (isBn ? "ট্র্যাক করা হচ্ছে..." : "Tracking...") : (isBn ? "স্ট্যাটাস দেখুন" : "Track Return")}</span>
                </Button>
              </form>

              {/* Live Tracking Result Details */}
              {trackResult && (
                <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-4 animate-in fade-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-black text-neutral-400">
                        {trackResult.returnReference}
                      </span>
                      <h4 className="font-bold text-sm text-neutral-950 dark:text-white">
                        {trackResult.item?.productTitle || "ZEVON Garment Piece"}
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        {isBn ? "অর্ডার #" : "Order #"}: {trackResult.orderNumber}
                      </p>
                    </div>
                    <Badge
                      className={
                        trackResult.status === "COMPLETED"
                          ? "bg-emerald-500 text-white"
                          : trackResult.status === "REJECTED"
                          ? "bg-rose-500 text-white"
                          : "bg-amber-500 text-white"
                      }
                    >
                      {trackResult.status}
                    </Badge>
                  </div>

                  {/* Stepper */}
                  {trackResult.stepper && (
                    <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                      {trackResult.stepper.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-3">
                          <div
                            className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              step.completed
                                ? "bg-emerald-500 text-white"
                                : step.current
                                ? "bg-amber-500 text-white animate-pulse"
                                : "bg-neutral-200 dark:bg-neutral-700 text-neutral-400"
                            }`}
                          >
                            {step.completed ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <span className="text-[9px] font-bold">{sIdx + 1}</span>
                            )}
                          </div>
                          <div className="text-xs">
                            <span
                              className={`font-bold block ${
                                step.completed || step.current
                                  ? "text-neutral-950 dark:text-white"
                                  : "text-neutral-400"
                              }`}
                            >
                              {step.title}
                            </span>
                            {step.description && (
                              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                                {step.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {trackResult.trackingNumber && (
                    <div className="pt-2 text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
                      <span>{isBn ? "কুরিয়ার ট্র্যাকিং:" : "Courier Tracking:"}</span>
                      <span className="font-mono font-bold text-neutral-950 dark:text-white">
                        {trackResult.trackingNumber} ({trackResult.courierName || "Courier"})
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* FAQ Accordion (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
              {isBn ? "সচরাচর জিজ্ঞাসিত প্রশ্ন" : "Frequently Asked Questions"}
            </h3>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs hover-card-lift transition-all space-y-2"
                >
                  <h4 className="font-bold text-sm sm:text-base text-neutral-950 dark:text-white flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{isBn ? faq.qBn : faq.qEn}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 pl-6 leading-relaxed">
                    {isBn ? faq.aBn : faq.aEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
