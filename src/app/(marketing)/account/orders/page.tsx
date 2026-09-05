import type { Metadata } from "next";
import { MyOrdersView } from "@/components/orders/MyOrdersView";

export const metadata: Metadata = {
  title: "My Orders | ZEVON",
  description: "Track and manage your ZEVON streetwear orders, live shipping status, and order history.",
};

export default function AccountOrdersPage() {
  return <MyOrdersView />;
}
