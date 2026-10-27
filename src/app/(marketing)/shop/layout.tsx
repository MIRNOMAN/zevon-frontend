import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Collections | ZEVON BD",
  description:
    "Explore our complete catalog of heavyweight organic cotton t-shirts, minimal co-ords, luxury hoodies, and architectural streetwear in Bangladesh.",
  alternates: {
    canonical: "/shop",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

