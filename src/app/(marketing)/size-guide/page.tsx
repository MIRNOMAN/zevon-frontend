import { Metadata } from "next";
import { SizeGuideView } from "@/components/size-guide/SizeGuideView";

export const metadata: Metadata = {
  title: "Size Guide & GSM Specifications | ZEVON Atelier",
  description:
    "Explore precision sizing charts in inches and centimeters, smart fit recommender, and 380+ GSM heavyweight textile specifications.",
};

export default function SizeGuidePage() {
  return <SizeGuideView />;
}
