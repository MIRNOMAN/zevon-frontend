import { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";

export const metadata: Metadata = {
  title: "About ZEVON | Architectural Streetwear Atelier",
  description:
    "Discover the story of ZEVON Bangladesh. 380+ GSM organic heavyweight cotton, architectural drop-shoulder silhouettes, and generational Bangladeshi craftsmanship.",
};

export default function AboutPage() {
  return <AboutView />;
}
