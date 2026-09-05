import { Metadata } from "next";
import { SustainabilityView } from "@/components/sustainability/SustainabilityView";

export const metadata: Metadata = {
  title: "Sustainability & Ethical Atelier | ZEVON Bangladesh",
  description:
    "Learn about ZEVON's commitment to 100% GOTS organic cotton, zero single-use plastic packaging, low-impact azo-free dyes, and fair living wages in Dhaka, Bangladesh.",
};

export default function SustainabilityPage() {
  return <SustainabilityView />;
}
