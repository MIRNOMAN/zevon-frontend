import React from "react";
import { StorefrontCatalog } from "@/components/shop/StorefrontCatalog";

export const metadata = {
  title: "Men's Streetwear & Heavyweight Essentials | ZEVON BD",
  description:
    "Explore Men's collection at ZEVON: 380+ GSM heavyweight oversized t-shirts, acid wash hoodies, architectural wide-leg cargo pants, and minimal co-ords.",
};

const MEN_SUBCATEGORIES = [
  { name: "T-Shirts & Tops", slug: "men-t-shirts" },
  { name: "Hoodies & Sweatshirts", slug: "men-hoodies" },
  { name: "Pants & Cargos", slug: "men-pants" },
  { name: "Co-ords & Sets", slug: "men-coords" },
];

export default function MenStorefrontPage() {
  return (
    <StorefrontCatalog
      title="Men's Streetwear"
      subtitle="Architectural cuts engineered with 380+ GSM super-combed organic cotton. Designed for the modern wardrobe and crafted ethically in Bangladesh."
      badge="Men's SS/26 Drops"
      gender="MEN"
      categorySlug="men"
      subCategories={MEN_SUBCATEGORIES}
    />
  );
}
