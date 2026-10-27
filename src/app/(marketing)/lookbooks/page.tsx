import { Metadata } from "next";
import { LookbookView } from "@/components/lookbooks/LookbookView";

export const metadata: Metadata = {
  title: "Editorial Lookbook & Shop The Look | ZEVON Atelier",
  description:
    "Explore full streetwear editorial lookbooks with interactive shoppable hotspot coordinates and instant garment checkout.",
  alternates: {
    canonical: "/lookbooks",
  },
};

export default function LookbooksPage() {
  return <LookbookView />;
}
