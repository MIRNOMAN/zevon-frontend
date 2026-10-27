import { Metadata } from "next";
import { StoresView } from "@/components/stores/StoresView";

export const metadata: Metadata = {
  title: "Flagship Stores & Ateliers | ZEVON Bangladesh",
  description:
    "Visit ZEVON flagship stores in Banani, Gulshan 2, and Dhanmondi Dhaka. Experience heavyweight 380+ GSM organic streetwear, physical fit testing, and private styling sessions.",
  alternates: {
    canonical: "/stores",
  },
};

export default function StoresPage() {
  return <StoresView />;
}
