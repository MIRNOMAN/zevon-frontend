"use client";

import React, { useState } from "react";
import { X, Bell, Check, Sparkles, Mail, Phone, Loader2 } from "lucide-react";
import { useSubscribeStockAlertMutation } from "@/redux/api/stockAlertApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/authSlice";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface StockAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  productImage?: string;
  variantId: string;
  selectedColor?: string;
  selectedSize?: string;
}

export function StockAlertModal({
  isOpen,
  onClose,
  productTitle,
  productImage,
  variantId,
  selectedColor,
  selectedSize,
}: StockAlertModalProps) {
  const { isBn } = useTranslation();
  const currentUser = useAppSelector(selectCurrentUser);
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [subscribeMutation, { isLoading }] = useSubscribeStockAlertMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !variantId) return;

    setErrorMessage("");
    try {
      const res = await subscribeMutation({
        productVariantId: variantId,
        email: email.trim(),
        phone: phone.trim() || undefined,
      }).unwrap();

      setIsSuccess(true);
      setSuccessMessage(
        res.message ||
          (isBn
            ? "স্টক আসার সাথে সাথে আপনার ইমেইলে নোটিফিকেশন পাঠানো হবে!"
            : "You're all set! We'll email you the second this item is restocked.")
      );

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMessage(
        err?.data?.message ||
          (isBn
            ? "সাবস্ক্রিপশন ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।"
            : "Failed to subscribe. Please verify your email and try again.")
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-neutral-900 p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-950 dark:text-white leading-tight">
                {isBn ? "স্টক আসলে জানান" : "Notify Me When Available"}
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {isBn
                  ? "পণ্যটি পুনরায় স্টকে আসলে সাথে সাথে ইমেইল পাবেন"
                  : "Get an instant alert the moment this piece is back in stock."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Product Variant Summary */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
          {productImage && (
            <img
              src={productImage}
              alt={productTitle}
              className="h-12 w-12 rounded-xl object-cover shrink-0 border border-black/5 dark:border-white/10"
            />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-neutral-950 dark:text-white truncate">
              {productTitle}
            </h4>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400 font-semibold">
              {selectedColor && <span>{selectedColor}</span>}
              {selectedColor && selectedSize && <span>•</span>}
              {selectedSize && <span>Size: {selectedSize}</span>}
            </div>
          </div>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="py-6 text-center space-y-2.5 animate-in zoom-in-95 duration-200">
            <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
              <Check className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              {isBn ? "সাবস্ক্রিপশন সম্পন্ন হয়েছে!" : "Alert Activated!"}
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
              {successMessage}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
                {errorMessage}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                {isBn ? "আপনার ইমেইল ঠিকানা:" : "Your Email Address:"}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white"
                />
                <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-neutral-400" />
              </div>
            </div>

            {/* Phone Input (Optional) */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                {isBn ? "মোবাইল নম্বর (ঐচ্ছিক SMS এলার্ট):" : "Phone Number (Optional SMS Alert):"}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801700000000"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white"
                />
                <Phone className="absolute left-3 top-3 h-3.5 w-3.5 text-neutral-400" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full py-3 px-4 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold tracking-wide flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isBn ? "সংরক্ষণ করা হচ্ছে..." : "Subscribing..."}</span>
                </>
              ) : (
                <>
                  <Bell className="h-3.5 w-3.5" />
                  <span>{isBn ? "স্টক এলার্ট চালু করুন" : "Notify Me When In Stock"}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
