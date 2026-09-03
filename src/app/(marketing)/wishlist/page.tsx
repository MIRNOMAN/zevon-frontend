import type { Metadata } from "next";
import { WishlistView } from "@/components/wishlist/WishlistView";

export const metadata: Metadata = {
  title: "My Wishlist | ZEVON",
  description: "View and manage your saved streetwear items and wishlist at ZEVON.",
};

export default function DirectWishlistPage() {
  return <WishlistView />;
}
