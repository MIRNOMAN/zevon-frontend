import { Metadata } from "next";
import { ShippingView } from "@/components/shipping/ShippingView";

export const metadata: Metadata = {
  title: "Shipping & Delivery | ZEVON Atelier Bangladesh",
  description:
    "Learn about ZEVON nationwide express delivery, shipping zones, free shipping on orders above 2,500 BDT, and tamper-proof unboxing standards.",
};

export default function ShippingPage() {
  return <ShippingView />;
}
