import React from "react";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { StorefrontCatalog } from "@/components/shop/StorefrontCatalog";

export const metadata = {
  title: "Seasonal Sale & Flash Drops | ZEVON BD",
  description:
    "Exclusive seasonal markdowns on selected ZEVON SS/26 streetwear drops, oversized t-shirts, minimal co-ord sets, and outer jackets.",
};

export default function SalePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <FlashSaleSection />
      <StorefrontCatalog
        title="Seasonal Sale Edition"
        subtitle="Exclusive markdowns on selected SS/26 drops, heavy knit co-ords, and organic cotton essentials. Limited quantities remaining."
        badge="Up to 40% Off"
      />
    </div>
  );
}
