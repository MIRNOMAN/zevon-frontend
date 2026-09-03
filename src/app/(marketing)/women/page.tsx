import React from "react";
import { StorefrontCatalog } from "@/components/shop/StorefrontCatalog";

export const metadata = {
  title: "Women's Minimalist Co-ords & Essentials | ZEVON BD",
  description:
    "Explore Women's collection at ZEVON: Monochrome ribbed knit co-ord sets, architectural column slip dresses, organic crop tops, and tailored pleated trousers.",
};

const WOMEN_SUBCATEGORIES = [
  { name: "Co-ords & Matching Sets", slug: "women-coords" },
  { name: "Dresses & Jumpsuits", slug: "women-dresses" },
  { name: "Tops & Tees", slug: "women-tops" },
  { name: "Trousers & Skirts", slug: "women-trousers" },
];

export default function WomenStorefrontPage() {
  return (
    <StorefrontCatalog
      title="Women's Minimalist Co-ords"
      subtitle="Contemporary two-piece knit sets, sculpting silhouettes, and tailored relaxed trousers crafted with organic breathable fabrics."
      badge="Women's SS/26 Drops"
      gender="WOMEN"
      categorySlug="women"
      subCategories={WOMEN_SUBCATEGORIES}
    />
  );
}
