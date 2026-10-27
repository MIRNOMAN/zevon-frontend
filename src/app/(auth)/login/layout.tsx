import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | ZEVON BD",
  description: "Sign in to your ZEVON account to manage your orders, wishlist, and shipping addresses.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

