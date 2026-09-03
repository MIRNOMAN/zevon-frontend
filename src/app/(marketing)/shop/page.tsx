"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { StorefrontCatalog } from "@/components/shop/StorefrontCatalog";

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || undefined;
  const genderParam = (searchParams.get("gender")?.toUpperCase() as "MEN" | "WOMEN" | "UNISEX") || undefined;
  const filterParam = searchParams.get("filter");

  const title =
    genderParam === "MEN"
      ? "Men's Collection"
      : genderParam === "WOMEN"
      ? "Women's Collection"
      : categoryParam
      ? `${categoryParam.replace(/-/g, " ")} Collection`
      : "Complete Catalog";

  const subtitle =
    filterParam === "new"
      ? "Explore our newly dropped SS/26 architectural streetwear silhouettes and essentials."
      : "Engineered with 380+ GSM super-combed organic cotton and crafted ethically in Bangladesh.";

  return (
    <StorefrontCatalog
      title={title}
      subtitle={subtitle}
      badge={filterParam === "new" ? "New Drops" : "SS/26 Archive"}
      gender={genderParam}
      categorySlug={categoryParam}
    />
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ShopContent />
    </Suspense>
  );
}
