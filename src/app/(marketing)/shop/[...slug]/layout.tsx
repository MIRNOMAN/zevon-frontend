import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug?: string[] }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugArray = Array.isArray(slug) ? slug : slug ? [slug] : [];
  const path = slugArray.join("/");
  const first = slugArray[0] || "";
  const title = first
    ? `${first.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Collection | ZEVON BD`
    : "Shop Catalog | ZEVON BD";

  return {
    title,
    alternates: {
      canonical: path ? `/shop/${path}` : "/shop",
    },
  };
}

export default function DynamicShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

