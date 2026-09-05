import type { Metadata } from "next";
import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = {
  title: "Saved Addresses | ZEVON",
  description: "Manage your saved delivery and shipping addresses for fast checkout.",
};

export default function AddressesPage() {
  return <AccountView />;
}
