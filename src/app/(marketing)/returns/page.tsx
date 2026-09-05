import { Metadata } from "next";
import { ReturnsView } from "@/components/returns/ReturnsView";

export const metadata: Metadata = {
  title: "7-Day Returns & Exchange Policy | ZEVON Atelier",
  description:
    "Learn about our 7-day hassle-free doorstep size exchanges, return eligibility, refund processes, and concierge assistance.",
};

export default function ReturnsPage() {
  return <ReturnsView />;
}
