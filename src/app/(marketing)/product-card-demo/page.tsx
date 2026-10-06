import React from "react";
import ProductShowcase3D from "@/components/products/ProductShowcase3D";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Product Card Demo | ZEVON",
  description: "Interactive 3D Tilt and Mouse Spotlight Product Card Component powered by React, Tailwind CSS, and Framer Motion.",
};

export default function ProductCardDemoPage() {
  return <ProductShowcase3D />;
}
