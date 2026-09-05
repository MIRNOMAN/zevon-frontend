import { Metadata } from "next";
import { LoyaltyView } from "@/components/loyalty/LoyaltyView";

export const metadata: Metadata = {
  title: "Loyalty Club & Rewards | ZEVON Atelier",
  description:
    "Join the ZEVON Atelier Club. Earn points on every order, redeem for instant cash savings (1 point = 1 BDT), and unlock VIP tier privileges.",
};

export default function LoyaltyPage() {
  return <LoyaltyView />;
}
