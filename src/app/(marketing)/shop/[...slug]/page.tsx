"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { StorefrontCatalog } from "@/components/shop/StorefrontCatalog";

function DynamicShopSlugContent() {
  const params = useParams();
  const slugArray = Array.isArray(params?.slug)
    ? params.slug
    : typeof params?.slug === "string"
    ? [params.slug]
    : [];

  const firstParam = slugArray[0]?.toLowerCase() || "";
  const secondParam = slugArray[1]?.toLowerCase() || "";

  let gender: "MEN" | "WOMEN" | "UNISEX" | undefined;
  let categorySlug: string | undefined;
  let subCategory: string | undefined;

  if (firstParam === "men") {
    gender = "MEN";
    if (secondParam) {
      categorySlug = secondParam;
      subCategory = secondParam;
    }
  } else if (firstParam === "women") {
    gender = "WOMEN";
    if (secondParam) {
      categorySlug = secondParam;
      subCategory = secondParam;
    }
  } else if (firstParam === "unisex") {
    gender = "UNISEX";
    if (secondParam) {
      categorySlug = secondParam;
      subCategory = secondParam;
    }
  } else {
    categorySlug = firstParam;
    if (secondParam) {
      subCategory = secondParam;
    }
  }

  const formatTitle = (str: string) =>
    str
      .replace(/-/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const title =
    secondParam && gender
      ? `${gender === "MEN" ? "Men's" : "Women's"} ${formatTitle(secondParam)}`
      : gender
      ? `${gender === "MEN" ? "Men's" : "Women's"} Collection`
      : categorySlug
      ? `${formatTitle(categorySlug)} Collection`
      : "Complete Catalog";

  const subtitle = `Explore premium ${title.toLowerCase()} engineered with heavy organic cotton and architectural cuts.`;

  return (
    <StorefrontCatalog
      title={title}
      subtitle={subtitle}
      badge="SS/26 Archive"
      gender={gender}
      categorySlug={categorySlug}
      initialSubCategory={subCategory}
    />
  );
}

export default function DynamicShopSlugPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <DynamicShopSlugContent />
    </Suspense>
  );
}
