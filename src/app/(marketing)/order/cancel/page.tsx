"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, ShoppingBag, RotateCcw, ArrowRight, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";

function OrderCancelContent() {
  const searchParams = useSearchParams();
  const { isBn } = useTranslation();
  const orderCancelledParam = searchParams.get("order_cancelled");

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-neutral-50/50 dark:bg-neutral-950/40">
      <div className="max-w-xl w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-center animate-in zoom-in-95 duration-300">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 mb-6">
          <XCircle className="h-10 w-10" />
        </div>

        <Badge className="bg-rose-500 text-white font-bold px-3.5 py-1 text-xs mb-3">
          {isBn ? "পেমেন্ট সম্পন্ন হয়নি" : "Payment Incomplete"}
        </Badge>

        <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight mb-2">
          {isBn ? "পেমেন্ট বাতিল করা হয়েছে" : "Payment was Cancelled"}
        </h1>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          {isBn
            ? "আপনার কার্ড বা অনলাইন পেমেন্টটি সম্পূর্ণ হয়নি। আপনার অ্যাকাউন্ট থেকে কোনো টাকা কাটা হয়নি। আপনি পুনরায় চেষ্টা করতে পারেন অথবা অন্য মাধ্যমে পেমেন্ট করতে পারেন।"
            : "Your payment process was cancelled or was not completed. No money was deducted from your account."}
        </p>

        {orderCancelledParam && (
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-400 mb-6 font-mono">
            {isBn ? "অর্ডার রেফারেন্স: " : "Order Reference: "} #{orderCancelledParam}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/checkout"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-5 py-3 font-bold text-sm hover:opacity-90 transition-all shadow-md"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{isBn ? "পুনরায় চেষ্টা করুন" : "Retry Checkout"}</span>
          </Link>

          <Link
            href="/shop"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white px-5 py-3 font-bold text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <span>{isBn ? "শপিং-এ ফিরে যান" : "Return to Shop"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
        </div>
      }
    >
      <OrderCancelContent />
    </Suspense>
  );
}
