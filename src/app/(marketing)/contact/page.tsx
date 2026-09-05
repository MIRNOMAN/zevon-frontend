import { Metadata } from "next";
import { ContactView } from "@/components/contact/ContactView";

export const metadata: Metadata = {
  title: "Contact Atelier & Concierge | ZEVON Bangladesh",
  description:
    "Get in touch with ZEVON customer concierge. Inquire about streetwear archive drops, 380+ GSM specifications, custom orders, or order assistance in Dhaka.",
};

export default function ContactPage() {
  return <ContactView />;
}
