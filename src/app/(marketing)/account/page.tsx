import type { Metadata } from "next";
import { MyOrdersView } from "@/components/orders/MyOrdersView";

export const metadata: Metadata = {
  title: "My Account | ZEVON",
  description: "Manage your ZEVON account, streetwear orders, tracking, and wishlist.",
};

export default function AccountPage() {
  return <MyOrdersView />;
}
