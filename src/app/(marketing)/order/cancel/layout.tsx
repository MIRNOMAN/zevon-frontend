import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Cancelled | ZEVON BD",
  alternates: {
    canonical: "/order/cancel",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderCancelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

