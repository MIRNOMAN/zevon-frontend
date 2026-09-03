"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, ArrowRight, Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

export function NewsletterSection() {
  const { t, isBn } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setIsSubscribed(true);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText("ZEVON10");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="py-16 sm:py-24 bg-background border-t border-neutral-200/80 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 dark:bg-neutral-900/90 text-white p-8 sm:p-14 lg:p-20 border border-neutral-800 shadow-2xl text-center">
          {/* Ambient Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 left-1/2 -z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-rose-500/20 blur-3xl"
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-neutral-300 border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>{t("newsletter.tag", "ZEVON INSIDERS CLUB")}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {t("newsletter.title", "GET 10% OFF YOUR FIRST ORDER")}
            </h2>

            <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed">
              {t("newsletter.desc", "Subscribe to unlock private archive drops, early seasonal sales, and secret discount codes delivered straight to your inbox.")}
            </p>

            {isSubscribed ? (
              <div className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-3 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-base">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>{isBn ? "জেভন ক্লাবে স্বাগতম!" : "Welcome to the ZEVON Club!"}</span>
                </div>
                <p className="text-xs text-neutral-300">
                  {isBn ? "চেকআউটে আপনার ১০% ডিসকাউন্ট কোড ব্যবহার করুন:" : "Use your exclusive 10% promo code at checkout:"}
                </p>
                <div className="inline-flex items-center gap-3 bg-black/60 px-4 py-2 rounded-xl border border-white/20">
                  <span className="font-mono text-base font-black text-amber-400 tracking-wider">
                    ZEVON10
                  </span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="flex items-center gap-1 text-xs font-bold bg-white text-neutral-950 px-2.5 py-1 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {isCopied ? (isBn ? "কপি হয়েছে" : "Copied") : (isBn ? "কপি করুন" : "Copy")}
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
              >
                <div className="relative flex-1">
                  <Mail className="h-5 w-5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    suppressHydrationWarning
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("newsletter.placeholder", "Enter your email address...")}
                    style={{ outline: "none", boxShadow: "none" }}
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 pl-11 text-sm text-white placeholder:text-neutral-400 focus:border-white focus:outline-none transition-colors"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-white text-neutral-950 hover:bg-neutral-200 font-bold tracking-wide shrink-0 gap-2"
                >
                  {t("newsletter.button", "Join Club")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            )}

            <p className="text-[11px] text-neutral-500">
              {t("newsletter.privacyNote", "No spam, ever. Unsubscribe anytime with 1-click.")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
