import React, { Suspense } from "react";
import { Metadata } from "next";
import { CartPageView } from "@/components/cart/CartPageView";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Shopping Bag | ZEVON Streetwear Archive",
  description: "Review your shopping bag, apply promo vouchers and recovery discounts, and proceed to checkout.",
};

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      }
    >
      <CartPageView />
    </Suspense>
  );
}
