import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account | ZEVON BD",
  description: "Join ZEVON BD to experience architectural luxury streetwear, exclusive archive drops, and loyalty perks.",
  alternates: {
    canonical: "/register",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

