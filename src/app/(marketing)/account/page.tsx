import type { Metadata } from "next";
import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = {
  title: "Account & Addresses | ZEVON",
  description: "Manage your ZEVON account profile, saved delivery addresses, security settings, and streetwear orders.",
};

export default function AccountPage() {
  return <AccountView />;
}
