"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2, CreditCard } from "lucide-react";
import { useVerifyPaymentSessionQuery } from "@/redux/api/paymentApi";
import { useGetMyOrderByIdQuery } from "@/redux/api/orderApi";
import { useTranslation, useCurrency } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const { isBn } = useTranslation();
  const { formatPrice } = useCurrency();

  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");
  const orderSuccessParam = searchParams.get("order_success");

  // Verify Stripe Session if redirected from Stripe Checkout
  const { data: verifyData } = useVerifyPaymentSessionQuery(
    sessionId || "",
    { skip: !sessionId }
  );

  const activeOrderId = verifyData?.data?.orderId || orderId;
  const { data: orderData } = useGetMyOrderByIdQuery(
    activeOrderId || "",
    { skip: !activeOrderId }
  );

  const order = orderData?.data;
  const displayOrderNumber =
    order?.orderNumber ||
    verifyData?.data?.orderNumber ||
    orderSuccessParam ||
    "ZV-CONFIRMED";

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-neutral-50/50 dark:bg-neutral-950/40">
      <div className="max-w-xl w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-center animate-in zoom-in-95 duration-300">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 mb-6 animate-bounce">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <Badge className="bg-emerald-500 text-white font-bold px-3.5 py-1 text-xs mb-3">
          {isBn ? "পেমেন্ট ও অর্ডার নিশ্চিত হয়েছে" : "Payment & Order Confirmed"}
        </Badge>

        <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight mb-2">
          {isBn ? "ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে" : "Thank you for your order!"}
        </h1>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          {isBn
            ? "আমরা আপনার পেমেন্ট পেয়েছি এবং অর্ডার প্রস্তুত করছি। দ্রুততম সময়ে আপনার ঠিকানায় ডেলিভারি পৌঁছে দেওয়া হবে।"
            : "We've received your payment and are packing your premium streetwear essentials."}
        </p>

        {/* Order Details Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60 text-left mb-6 space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-neutral-500">{isBn ? "অর্ডার রেফারেন্স:" : "Order Reference:"}</span>
            <span className="font-extrabold text-neutral-950 dark:text-white font-mono">
              #{displayOrderNumber}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-neutral-500">{isBn ? "পেমেন্ট মাধ্যম:" : "Payment Method:"}</span>
            <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-emerald-600" />
              <span>
                {order?.paymentMethod === "STRIPE"
                  ? isBn ? "Stripe কার্ড (পরিশোধিত)" : "Stripe Card (Paid)"
                  : order?.paymentMethod === "BKASH"
                  ? isBn ? "বিকাশ" : "bKash"
                  : order?.paymentMethod === "NAGAD"
                  ? isBn ? "নগদ" : "Nagad"
                  : isBn ? "অনলাইন পেমেন্ট" : "Online Payment"}
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-neutral-500">{isBn ? "পেমেন্ট স্ট্যাটাস:" : "Payment Status:"}</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-xs">
              {order?.paymentStatus || (verifyData?.data?.paid ? "PAID" : "COMPLETED")}
            </span>
          </div>

          {order?.totalAmount && (
            <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-neutral-200 dark:border-neutral-700">
              <span className="text-neutral-500">{isBn ? "মোট পরিশোধিত:" : "Total Paid:"}</span>
              <span className="font-black text-base text-neutral-950 dark:text-white">
                {formatPrice(Number(order.totalAmount))}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/account"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-5 py-3 font-bold text-sm hover:opacity-90 transition-all shadow-md"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{isBn ? "আমার অর্ডারসমূহ" : "View My Orders"}</span>
          </Link>

          <Link
            href="/shop"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white px-5 py-3 font-bold text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <span>{isBn ? "আরও কেনাকাটা করুন" : "Continue Shopping"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
