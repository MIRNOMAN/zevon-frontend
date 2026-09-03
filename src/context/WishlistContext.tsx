"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Link from "next/link";
import { Heart, X, Trash2 } from "lucide-react";
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
  isLoading: boolean;
  isMounted: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: WishlistProductItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = "zevon_wishlist_items";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isBn } = useTranslation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [items, setItems] = useState<WishlistProductItem[]>([]);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const initialLoadDone = useRef(false);

  // Backend RTK Query (auto triggers when authenticated)
  const { data: serverWishlist, isLoading: isServerLoading } = useGetWishlistQuery(
    undefined,
    { skip: !isAuthenticated }
  );
  const [triggerToggle] = useToggleWishlistMutation();

  // Load from localStorage immediately on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
    initialLoadDone.current = true;
  }, []);

  // When server wishlist loads, merge and persist
  useEffect(() => {
    if (isAuthenticated && serverWishlist?.items) {
      const serverMapped: WishlistProductItem[] = serverWishlist.items.map((item) => ({
        id: item.product.id,
        title: item.product.title || item.product.name || "Product",
        name: item.product.title || item.product.name || "Product",
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
      }));

      setItems(serverMapped);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverMapped));
      } catch {
        // Ignore
      }
    }
  }, [isAuthenticated, serverWishlist]);

  // Helper to persist state & storage
  const persistItems = (newItems: WishlistProductItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch {
      // Ignore
    }
  };

  const wishlistIds = items.map((i) => i.id);

  const isInWishlist = useCallback(
    (productId: string) => {
      if (!productId) return false;
      return items.some(
        (item) =>
          item.id === productId ||
          (item.slug && item.slug === productId) ||
          (item.title && item.title.toLowerCase() === productId.toLowerCase())
      );
    },
    [items]
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
    const isSaved = isInWishlist(product.id) || (product.slug ? isInWishlist(product.slug) : false);

    let nextItems: WishlistProductItem[];
    if (isSaved) {
      nextItems = items.filter(
        (i) =>
          i.id !== product.id &&
          (!product.slug || i.slug !== product.slug)
      );
    } else {
      nextItems = [product, ...items.filter((i) => i.id !== product.id)];
    }

    // Optimistically update instantly
    persistItems(nextItems);
    showToast(product, isSaved ? "removed" : "added");

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await triggerToggle(product.id || product.slug).unwrap();
      } catch {
        // Keeps local state
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const item = items.find((i) => i.id === productId || i.slug === productId);
    const nextItems = items.filter((i) => i.id !== productId && i.slug !== productId);

    persistItems(nextItems);
    if (item) {
      showToast(item, "removed");
    }

    if (isAuthenticated) {
      try {
        await triggerToggle(productId).unwrap();
      } catch {
        // Keeps local state
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistItems: items,
        wishlistCount: items.length,
        isLoading: !isMounted || (isAuthenticated && isServerLoading && items.length === 0),
        isMounted,
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
