import { Metadata } from "next";
import { OutfitBuilderView } from "@/components/outfits/OutfitBuilderView";

export const metadata: Metadata = {
  title: "Outfit Builder & Mix-and-Match Canvas | ZEVON Atelier",
  description:
    "Style your full streetwear silhouette on our interactive mix & match canvas and save 10% on complete outfit bundles.",
};

export default function OutfitsPage() {
  return <OutfitBuilderView />;
}
