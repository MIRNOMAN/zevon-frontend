import React from "react";
import { StorefrontCatalog } from "@/components/shop/StorefrontCatalog";

export const metadata = {
  title: "Seasonal Sale | ZEVON BD",
  description:
    "Exclusive seasonal markdowns on selected ZEVON SS/26 streetwear drops, oversized t-shirts, minimal co-ord sets, and outer jackets.",
};

export default function SalePage() {
  return (
    <StorefrontCatalog
      title="Seasonal Sale Edition"
      subtitle="Exclusive markdowns on selected SS/26 drops, heavy knit co-ords, and organic cotton essentials. Limited quantities remaining."
      badge="Up to 40% Off"
    />
  );
}
