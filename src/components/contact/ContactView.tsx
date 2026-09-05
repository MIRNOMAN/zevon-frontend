"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Ruler,
  HelpCircle,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useSubmitContactMessageMutation } from "@/redux/api/contactApi";
import { Button } from "@/components/ui/button";

export function ContactView() {
  const { t, isBn } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [submitContact, { isLoading }] = useSubmitContactMessageMutation();

  const subjectOptions = [
    { value: "General Inquiry", labelEn: "General Inquiry", labelBn: "সাধারণ জিজ্ঞাসা" },
    { value: "Order Status & Tracking", labelEn: "Order Status & Tracking", labelBn: "অর্ডার ট্র্যাকিং ও অবস্থা" },
    { value: "Size & GSM Specifications", labelEn: "Size & GSM Specifications", labelBn: "সাইজ ও জিএসএম স্পেসিফিকেশন" },
    { value: "Returns & Exchanges", labelEn: "Returns & Exchanges", labelBn: "রিটার্ন ও এক্সচেঞ্জ" },
    { value: "B2B & Wholesale Collaborations", labelEn: "B2B & Wholesale Collaborations", labelBn: "পাইকারি ও কোলাবোরেশন" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage(
        isBn
          ? "অনুগ্রহ করে আবশ্যক ফিল্ডগুলো (নাম, ইমেইল ও বার্তা) পূরণ করুন।"
          : "Please fill in all required fields (Name, Email, and Message)."
      );
      return;
    }

    try {
      await submitContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: subject.trim(),
        message: message.trim(),
      }).unwrap();

      setIsSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err: any) {
      console.error("Contact submit error:", err);
      const msg = err?.data?.message;
      const displayMsg = Array.isArray(msg) ? msg.join(", ") : msg;
      setErrorMessage(
        displayMsg ||
          (isBn
            ? "বার্তা পাঠানো ব্যর্থ হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।"
            : "Failed to send message. Please try again in a few moments.")
      );
    }
  };

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
            {isBn ? "যোগাযোগ" : "Contact Atelier"}
          </span>
        </nav>

        {/* ── Header Banner ── */}
        <div className="rounded-3xl bg-linear-to-br from-neutral-900 via-neutral-950 to-black text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden mb-12 border border-neutral-800">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-neutral-300 border border-white/10 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>{isBn ? "জেভন কনসিয়ার্জ" : "ZEVON CONCIERGE & ATELIER"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {isBn ? "আমাদের সাথে যোগাযোগ করুন" : "CONNECT WITH OUR ATELIER"}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed mt-3">
              {isBn
                ? "নতুন ড্রপ, সাইজ গাইডেন্স, বা কাস্টম অর্ডারের ব্যাপারে যেকোনো তথ্যের জন্য আমাদের ডেডিকেটেড সাপোর্ট টিমের সাথে সরাসরি যোগাযোগ করুন।"
                : "Whether you have questions regarding archive drops, fabric specifications (380+ GSM), sizing guidance, or order inquiries — our concierge is here to assist."}
            </p>
          </div>
        </div>

        {/* ── Main 2-Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          {/* ── Left Column: Contact Details & Quick Links (5 Cols) ── */}
          <div className="lg:col-span-5 space-y-6 animate-fade-in-up">
            {/* Atelier Info Card */}
            <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 shadow-xs space-y-6 hover-card-lift transition-all">
              <h2 className="text-base sm:text-lg font-black text-neutral-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isBn ? "সরাসরি যোগাযোগের ঠিকানা" : "Studio & Support Information"}</span>
              </h2>

              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex items-start gap-4 group">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white group-hover:scale-110 transition-transform">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-950 dark:text-white">
                      {isBn ? "ফ্ল্যাগশিপ স্টুডিও" : "Flagship Atelier (Dhaka)"}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                      House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white group-hover:scale-110 transition-transform">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-950 dark:text-white">
                      {isBn ? "হটলাইন ও হোয়াটসঅ্যাপ" : "Hotline & WhatsApp Concierge"}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-0.5">
                      +880 1700-000000 / +880 1900-000000
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white group-hover:scale-110 transition-transform">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-950 dark:text-white">
                      {isBn ? "অফিসিয়াল ইমেইল" : "Official Inquiries"}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-0.5">
                      concierge@zevon.com / support@zevon.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white group-hover:scale-110 transition-transform">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-950 dark:text-white">
                      {isBn ? "কাজের সময়সূচী" : "Concierge Hours"}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {isBn
                        ? "প্রতিদিন সকাল ১০:০০ টা - রাত ১০:০০ টা (বিএসটি)"
                        : "Monday – Sunday, 10:00 AM – 10:00 PM BST"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-7 space-y-4 hover-card-lift transition-all">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-neutral-500" />
                <span>{isBn ? "দ্রুত সাহায্য ও নির্দেশিকা" : "Quick Help & Self-Service"}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                <Link
                  href="/account/orders"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 hover:border-neutral-400 dark:hover:border-neutral-500 text-xs font-bold text-neutral-950 dark:text-white transition-all shadow-xs hover:translate-x-1"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="h-4 w-4 text-neutral-500" />
                    <span>{isBn ? "অর্ডার ট্র্যাক করুন" : "Track Your Order"}</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                </Link>

                <Link
                  href="/returns"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 hover:border-neutral-400 dark:hover:border-neutral-500 text-xs font-bold text-neutral-950 dark:text-white transition-all shadow-xs hover:translate-x-1"
                >
                  <div className="flex items-center gap-2.5">
                    <RotateCcw className="h-4 w-4 text-neutral-500" />
                    <span>{isBn ? "৭ দিনের রিটার্ন নীতি" : "7-Day Return Policy"}</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                </Link>

                <Link
                  href="/size-guide"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 hover:border-neutral-400 dark:hover:border-neutral-500 text-xs font-bold text-neutral-950 dark:text-white transition-all shadow-xs hover:translate-x-1"
                >
                  <div className="flex items-center gap-2.5">
                    <Ruler className="h-4 w-4 text-neutral-500" />
                    <span>{isBn ? "সাইজ গাইড ও ফ্যাব্রিক" : "Size Guide & GSM Specs"}</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* ── Right Column: Interactive Contact Form (7 Cols) ── */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-10 shadow-lg relative">
              <div className="mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-neutral-950 dark:text-white">
                    {isBn ? "বার্তা পাঠান" : "Send Us a Direct Message"}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {isBn
                      ? "ফর্মটি পূরণ করুন, আমাদের প্রতিনিধি সর্বোচ্চ ২৪ ঘণ্টার মধ্যে যোগাযোগ করবেন।"
                      : "Fill out the form below. Our concierge team responds within 24 hours."}
                  </p>
                </div>
                <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white">
                  <MessageSquare className="h-6 w-6" />
                </div>
              </div>

              {isSubmitted ? (
                <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-lg">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-emerald-900 dark:text-emerald-200">
                    {isBn ? "আপনার বার্তা সফলভাবে গৃহীত হয়েছে!" : "Message Sent Successfully!"}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300/90 max-w-md mx-auto leading-relaxed">
                    {isBn
                      ? "জেভন কনসিয়ার্জের সাথে যোগাযোগ করার জন্য ধন্যবাদ। আমাদের কাস্টমার কেয়ার টিম দ্রুত আপনার ইমেইলে যোগাযোগ করবে।"
                      : "Thank you for reaching out to ZEVON Atelier. Our concierge team has received your message and will reply via email shortly."}
                  </p>
                  <div className="pt-2">
                    <Button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs rounded-xl px-5 py-2.5 hover:opacity-90"
                    >
                      {isBn ? "আরেকটি বার্তা পাঠান" : "Send Another Message"}
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        {isBn ? "পূর্ণ নাম *" : "Full Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Mir Noman"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm font-medium text-neutral-950 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        {isBn ? "ইমেইল অ্যাড্রেস *" : "Email Address *"}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. noman@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm font-medium text-neutral-950 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        {isBn ? "ফোন নম্বর (ঐচ্ছিক)" : "Phone Number (Optional)"}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm font-medium text-neutral-950 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        {isBn ? "বিষয় *" : "Subject *"}
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-all cursor-pointer"
                      >
                        {subjectOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {isBn ? opt.labelBn : opt.labelEn}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                      {isBn ? "বার্তা / বিস্তারিত বিবরণ *" : "Your Message *"}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        isBn
                          ? "আপনার মতামত বা প্রশ্ন বিস্তারিত লিখুন..."
                          : "Describe your inquiry or order details in detail..."
                      }
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm font-medium text-neutral-950 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-all resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="lg"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span>{isBn ? "বার্তা পাঠান" : "Submit Message"}</span>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
