"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Loader2,
  Calendar,
} from "lucide-react";
import { useTranslation, toBengaliDigits } from "@/lib/i18n";
import { useGetMyReturnsQuery, ReturnRequestItem } from "@/redux/api/returnApi";
import { Badge } from "@/components/ui/badge";

export function ReturnsTab() {
  const { t, isBn } = useTranslation();
  const { data: returnsRes, isLoading } = useGetMyReturnsQuery();

  const returnsList: ReturnRequestItem[] = returnsRes?.data?.items || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-emerald-500 text-white font-bold text-[10px]">COMPLETED</Badge>;
      case "APPROVED":
        return <Badge className="bg-blue-500 text-white font-bold text-[10px]">APPROVED</Badge>;
      case "IN_TRANSIT":
        return <Badge className="bg-indigo-500 text-white font-bold text-[10px]">IN TRANSIT</Badge>;
      case "RECEIVED":
        return <Badge className="bg-purple-500 text-white font-bold text-[10px]">RECEIVED</Badge>;
      case "REJECTED":
        return <Badge className="bg-rose-500 text-white font-bold text-[10px]">REJECTED</Badge>;
      default:
        return <Badge className="bg-amber-500 text-white font-bold text-[10px]">PENDING</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-neutral-950 dark:text-white">
            {isBn ? "আমার রিটার্ন ও এক্সচেঞ্জ হিস্ট্রি" : "My Returns & Exchanges"}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {isBn
              ? "আপনার সাবমিট করা সকল রিটার্ন রিকোয়েস্ট এবং কুরিয়ার ট্র্যাকিং স্ট্যাটাস।"
              : "Track progress of your requested size exchanges and refund statuses."}
          </p>
        </div>

        <Link
          href="/returns"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white"
        >
          <span>{isBn ? "রিটার্ন পলিসি ও শর্ত" : "View Return Policy"}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
        </div>
      ) : returnsList.length === 0 ? (
        <div className="rounded-3xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 p-10 sm:p-14 text-center space-y-4">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-3xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
            <RotateCcw className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-950 dark:text-white">
              {isBn ? "কোনো সক্রিয় রিটার্ন রিকোয়েস্ট নেই" : "No Return Requests Found"}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mt-1">
              {isBn
                ? "ডেলিভারি হওয়া অর্ডারের যেকোনো আইটেম এক্সচেঞ্জ বা রিটার্ন করতে আপনার অর্ডার তালিকা থেকে রিকোয়েস্ট করুন।"
                : "You have not submitted any return or exchange requests. Delivered items can be exchanged within 7 days from your Orders tab."}
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold hover:opacity-90 transition-all"
            >
              <span>{isBn ? "অর্ডার তালিকা দেখুন" : "Go to My Orders"}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {returnsList.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 shadow-xs hover-card-lift transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-neutral-950 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-xl">
                    {item.returnReference}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {isBn ? "টাইপ:" : "Resolution:"}{" "}
                    <strong className="text-neutral-900 dark:text-white">{item.resolution}</strong>
                  </span>
                </div>
                <div>{getStatusBadge(item.status)}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 block mb-0.5">{isBn ? "প্রোডাক্ট:" : "Item Details:"}</span>
                  <p className="font-bold text-neutral-950 dark:text-white">
                    {item.orderItem?.productTitle || "ZEVON Garment Piece"}
                  </p>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    {isBn ? "সাইজ:" : "Size:"} {item.orderItem?.size || "N/A"} • {isBn ? "কালার:" : "Color:"}{" "}
                    {item.orderItem?.color || "N/A"}
                  </p>
                </div>

                <div>
                  <span className="text-neutral-400 block mb-0.5">{isBn ? "রিটার্নের কারণ:" : "Reason for Return:"}</span>
                  <p className="font-medium text-neutral-800 dark:text-neutral-200">{item.reason}</p>
                  {item.trackingNumber && (
                    <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                      {isBn ? "কুরিয়ার ট্র্যাকিং:" : "Courier Tracking:"} {item.trackingNumber} ({item.courierName || "Courier"})
                    </p>
                  )}
                </div>
              </div>

              {item.refundAmount && item.refundAmount > 0 && (
                <div className="pt-2 flex justify-between items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 border-t border-neutral-100 dark:border-neutral-800">
                  <span>{isBn ? "রিফান্ড অ্যামাউন্ট:" : "Refund Amount:"}</span>
                  <span className="text-sm">৳{isBn ? toBengaliDigits(item.refundAmount) : item.refundAmount}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
