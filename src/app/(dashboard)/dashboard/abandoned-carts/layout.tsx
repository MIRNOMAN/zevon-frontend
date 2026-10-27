import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abandoned Carts Recovery | ZEVON Dashboard",
  description: "Monitor and recover abandoned shopping bags.",
  alternates: {
    canonical: "/dashboard/abandoned-carts",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AbandonedCartsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

