import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Success | ZEVON BD",
  alternates: {
    canonical: "/order/success",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

