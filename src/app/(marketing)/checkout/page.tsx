import React, { Suspense } from "react";
import { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Checkout | ZEVON Streetwear Archive",
  description: "Complete your luxury heavyweight streetwear order with secure payment options and instant delivery tracking.",
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      }
    >
      <CheckoutView />
    </Suspense>
  );
}
