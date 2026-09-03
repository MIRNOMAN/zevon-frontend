"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Heart, Check, X, ArrowRight, Trash2 } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectIsAuthenticated } from "@/redux/features/authSlice";
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "@/redux/api/wishlistApi";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface WishlistProductItem {
  id: string;
  title: string;
  name?: string;
  slug: string;
  price: number | string;
  basePrice?: number | string;
  discountPrice?: number | string | null;
  image?: string;
  images?: string[];
  category?: any;
}

interface ToastNotification {
  id: string;
  type: "added" | "removed";
  product: WishlistProductItem;
  message: string;
}

interface WishlistContextType {
  wishlistIds: string[];
  wishlistItems: WishlistProductItem[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: WishlistProductItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = "zevon_wishlist_items";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isBn } = useTranslation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [localWishlist, setLocalWishlist] = useState<WishlistProductItem[]>([]);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Backend RTK Query (only triggers when authenticated)
  const { data: serverWishlist } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [triggerToggle] = useToggleWishlistMutation();

  // Load guest wishlist from localStorage
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setLocalWishlist(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save guest wishlist to localStorage
  const saveToStorage = (items: WishlistProductItem[]) => {
    setLocalWishlist(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore
    }
  };

  // Determine active wishlist items
  const activeItems: WishlistProductItem[] = isAuthenticated && serverWishlist?.items
    ? serverWishlist.items.map((item) => ({
        id: item.product.id,
        title: item.product.title || item.product.name || "Product",
        slug: item.product.slug,
        price: item.product.discountPrice || item.product.basePrice || 0,
        basePrice: item.product.basePrice,
        discountPrice: item.product.discountPrice,
        image:
          (item.product.primaryImage as any)?.url ||
          (typeof item.product.images?.[0] === "string"
            ? item.product.images[0]
            : (item.product.images?.[0] as any)?.url) ||
          item.product.image ||
          "",
        category: item.product.category,
      }))
    : localWishlist;

  const wishlistIds = activeItems.map((i) => i.id);

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlistIds.includes(productId);
    },
    [wishlistIds]
  );

  const showToast = (product: WishlistProductItem, type: "added" | "removed") => {
    const title = product.title || product.name || "Product";
    const msg =
      type === "added"
        ? isBn
          ? `"${title}" উইশলিস্টে যুক্ত হয়েছে!`
          : `"${title}" saved to your wishlist!`
        : isBn
        ? `"${title}" উইশলিস্ট থেকে সরানো হয়েছে`
        : `"${title}" removed from your wishlist`;

    setToast({
      id: String(Date.now()),
      type,
      product,
      message: msg,
    });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const toggleWishlist = async (product: WishlistProductItem) => {
    const isCurrentlySaved = isInWishlist(product.id);

    if (isAuthenticated) {
      try {
        await triggerToggle(product.id).unwrap();
        showToast(product, isCurrentlySaved ? "removed" : "added");
      } catch {
        // Fallback to local
        const next = isCurrentlySaved
          ? localWishlist.filter((i) => i.id !== product.id)
          : [...localWishlist, product];
        saveToStorage(next);
        showToast(product, isCurrentlySaved ? "removed" : "added");
      }
    } else {
      // Guest mode
      const next = isCurrentlySaved
        ? localWishlist.filter((i) => i.id !== product.id)
        : [...localWishlist, product];
      saveToStorage(next);
      showToast(product, isCurrentlySaved ? "removed" : "added");
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const item = activeItems.find((i) => i.id === productId);
    if (!item) return;

    if (isAuthenticated) {
      try {
        await triggerToggle(productId).unwrap();
        showToast(item, "removed");
      } catch {
        const next = localWishlist.filter((i) => i.id !== productId);
        saveToStorage(next);
        showToast(item, "removed");
      }
    } else {
      const next = localWishlist.filter((i) => i.id !== productId);
      saveToStorage(next);
      showToast(item, "removed");
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistItems: activeItems,
        wishlistCount: isMounted ? activeItems.length : 0,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}

      {/* ── Global Animated Wishlist Toast Notification ── */}
      {toast && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in-0 duration-300 pointer-events-auto">
          <div
            className={cn(
              "flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all",
              toast.type === "added"
                ? "bg-neutral-950/95 text-white border-neutral-800 ring-1 ring-white/10"
                : "bg-white/95 text-neutral-950 border-neutral-200 dark:bg-neutral-900/95 dark:text-white dark:border-neutral-800"
            )}
          >
            {/* Heart Icon Badge */}
            <div
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs",
                toast.type === "added"
                  ? "bg-rose-500 text-white animate-bounce"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
              )}
            >
              {toast.type === "added" ? (
                <Heart className="h-5 w-5 fill-white text-white" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </div>

            {/* Content info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wide">
                  {toast.type === "added"
                    ? isBn
                      ? "উইশলিস্টে যুক্ত হয়েছে!"
                      : "Saved to Wishlist"
                    : isBn
                    ? "উইশলিস্ট থেকে সরানো হয়েছে"
                    : "Removed from Wishlist"}
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 dark:text-neutral-400 truncate mt-0.5">
                {toast.product.title || toast.product.name}
              </p>
            </div>

            {/* Quick Action Link to wishlist */}
            <Link
              href="/account/wishlist"
              onClick={() => setToast(null)}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
            >
              {isBn ? "দেখুন" : "View"}
            </Link>

            {/* Close */}
            <button
              type="button"
              onClick={() => setToast(null)}
              className="p-1 rounded-lg text-neutral-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
