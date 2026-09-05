import { Metadata } from "next";
import { GiftCardView } from "@/components/gift-cards/GiftCardView";

export const metadata: Metadata = {
  title: "Digital Gift Cards & Vouchers | ZEVON Atelier",
  description:
    "Gift the ultimate heavyweight streetwear luxury. Purchase instant digital vouchers with custom amounts or check your remaining balance.",
};

export default function GiftCardsPage() {
  return <GiftCardView />;
}
