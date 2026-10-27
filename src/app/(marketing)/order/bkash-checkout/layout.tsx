import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "bKash Payment Gateway | ZEVON BD",
  alternates: {
    canonical: "/order/bkash-checkout",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function BkashCheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

