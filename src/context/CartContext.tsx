"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import Link from "next/link";
import { ShoppingBag, X, Check, Trash2, ArrowRight } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectIsAuthenticated } from "@/redux/features/authSlice";
import {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useSyncCartMutation,
  type CartLineItem,
} from "@/redux/api/cartApi";
import { useTranslation, useCurrency } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface AddToCartItemInput {
  productVariantId: string;
  quantity?: number;
  product?: {
    id: string;
    title?: string;
    name?: string;
    slug: string;
    basePrice?: number | string;
    discountPrice?: number | string | null;
    category?: any;
    primaryImage?: any;
    image?: string;
    images?: any[];
  };
  variant?: {
    id: string;
    sku?: string;
    size?: string;
    color?: string;
    colorCode?: string;
    stock?: number;
    extraPrice?: number;
    imageUrl?: string | null;
  };
}

interface CartToastNotification {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  price: number;
}

interface CartContextType {
  items: CartLineItem[];
  cartCount: number;
  subtotal: number;
  originalSubtotal: number;
  totalSavings: number;
  freeShippingThreshold: number;
  amountUntilFreeShipping: number;
  qualifiesForFreeShipping: boolean;
  isLoading: boolean;
  isCartOpen: boolean;
  isMounted: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (input: AddToCartItemInput) => Promise<void>;
  updateQuantity: (cartItemId: string, newQuantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "zevon_guest_cart_items";
const FREE_SHIPPING_THRESHOLD = 2500; // 2500 BDT Base

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isBn } = useTranslation();
  const { formatPrice } = useCurrency();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [guestItems, setGuestItems] = useState<CartLineItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<CartToastNotification | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // RTK Query Hooks for Authenticated Mode
  const {
    data: serverCart,
    isLoading: isServerLoading,
    refetch: refetchCart,
  } = useGetCartQuery(undefined, { skip: !isAuthenticated });

  const [triggerAddToCart] = useAddToCartMutation();
  const [triggerUpdateItem] = useUpdateCartItemMutation();
  const [triggerRemoveItem] = useRemoveCartItemMutation();
  const [triggerClearCart] = useClearCartMutation();
  const [triggerSyncCart] = useSyncCartMutation();

  // Load guest items from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setGuestItems(parsed);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save guest items to localStorage whenever they change in guest mode
  const persistGuestItems = useCallback((items: CartLineItem[]) => {
    setGuestItems(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, []);

  // Sync guest cart to server upon login
  const syncedRef = useRef(false);
  useEffect(() => {
    if (isAuthenticated && !syncedRef.current && guestItems.length > 0) {
      syncedRef.current = true;
      const payload = {
        items: guestItems.map((i) => ({
          productVariantId: i.variant.id,
          quantity: i.quantity,
        })),
      };

      triggerSyncCart(payload)
        .unwrap()
        .then(() => {
          // Clear guest cart once synced
          setGuestItems([]);
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch {
            // Ignore
          }
          refetchCart();
        })
        .catch(() => {
          // Keep guest cart fallback
        });
    }
  }, [isAuthenticated, guestItems, triggerSyncCart, refetchCart]);

  // Active items: server cart if authenticated and has items, else guestItems
  const items: CartLineItem[] = useMemo(() => {
    if (isAuthenticated && serverCart?.items && serverCart.items.length > 0) {
      return serverCart.items;
    }
    return guestItems;
  }, [isAuthenticated, serverCart, guestItems]);

  // Calculated totals & free shipping metrics
  const { subtotal, originalSubtotal, totalSavings, totalCount } = useMemo(() => {
    let sub = 0;
    let orig = 0;
    let count = 0;

    for (const item of items) {
      sub += item.unitPrice * item.quantity;
      orig += item.originalUnitPrice * item.quantity;
      count += item.quantity;
    }

    return {
      subtotal: sub,
      originalSubtotal: orig,
      totalSavings: orig - sub,
      totalCount: count,
    };
  }, [items]);

  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const showToast = useCallback(
    (productTitle: string, subtitle: string, price: number, image?: string) => {
      setToast({
        id: String(Date.now()),
        title: productTitle,
        subtitle,
        price,
        image,
      });

      setTimeout(() => {
        setToast(null);
      }, 4000);
    },
    []
  );

  // Add Item to Cart
  const addToCart = useCallback(
    async (input: AddToCartItemInput) => {
      const qty = input.quantity && input.quantity > 0 ? input.quantity : 1;
      const variantId = input.productVariantId;

      const pTitle = input.product?.title || input.product?.name || "Product";
      const vSize = input.variant?.size || "Standard";
      const vColor = input.variant?.color || "Default";
      const img =
        input.variant?.imageUrl ||
        input.product?.primaryImage?.url ||
        input.product?.image ||
        (Array.isArray(input.product?.images) && typeof input.product?.images[0] === "string"
          ? input.product?.images[0]
          : input.product?.images?.[0]?.url) ||
        "";

      const basePrice = Number(input.product?.basePrice || 0);
      const discountPrice = input.product?.discountPrice ? Number(input.product.discountPrice) : null;
      const extraPrice = Number(input.variant?.extraPrice || 0);
      const unitPrice = (discountPrice ?? basePrice) + extraPrice;
      const originalUnitPrice = basePrice + extraPrice;

      const addLocalItem = () => {
        setGuestItems((prev) => {
          const existingIndex = prev.findIndex((i) => i.variant.id === variantId);
          if (existingIndex > -1 && prev[existingIndex]) {
            const updated = [...prev];
            const item = updated[existingIndex]!;
            const newQty = item.quantity + qty;
            updated[existingIndex] = {
              ...item,
              quantity: newQty,
              itemTotal: item.unitPrice * newQty,
            };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch {}
            return updated;
          }

          const newItem: CartLineItem = {
            id: `cart_item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            quantity: qty,
            unitPrice,
            originalUnitPrice,
            itemTotal: unitPrice * qty,
            inStock: true,
            isQuantityAvailable: true,
            availableStock: input.variant?.stock ?? 50,
            variant: {
              id: variantId,
              sku: input.variant?.sku || `SKU-${Date.now()}`,
              size: vSize,
              color: vColor,
              colorCode: input.variant?.colorCode || "#111111",
              extraPrice,
              imageUrl: img,
            },
            product: {
              id: input.product?.id || `prod_${Date.now()}`,
              title: pTitle,
              slug: input.product?.slug || "product",
              category: input.product?.category,
              primaryImage: img ? { url: img, altText: pTitle, isPrimary: true } : null,
            },
          };

          const next = [newItem, ...prev];
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          } catch {}
          return next;
        });
      };

      if (isAuthenticated) {
        try {
          await triggerAddToCart({ productVariantId: variantId, quantity: qty }).unwrap();
          refetchCart();
        } catch {
          // If server fails or is offline, update local state optimistically
          addLocalItem();
        }
      } else {
        addLocalItem();
      }
    },
    [isAuthenticated, refetchCart, showToast, triggerAddToCart]
  );

  // Update line item quantity
  const updateQuantity = useCallback(
    async (cartItemId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        return removeItem(cartItemId);
      }

      if (isAuthenticated) {
        try {
          await triggerUpdateItem({ cartItemId, quantity: newQuantity }).unwrap();
        } catch {
          // Keep state
        }
      } else {
        const next = guestItems.map((item) => {
          if (item.id === cartItemId) {
            return {
              ...item,
              quantity: newQuantity,
              itemTotal: item.unitPrice * newQuantity,
            };
          }
          return item;
        });
        persistGuestItems(next);
      }
    },
    [guestItems, isAuthenticated, persistGuestItems, triggerUpdateItem]
  );

  // Remove line item
  const removeItem = useCallback(
    async (cartItemId: string) => {
      if (isAuthenticated) {
        try {
          await triggerRemoveItem(cartItemId).unwrap();
        } catch {
          // Keep state
        }
      } else {
        const next = guestItems.filter((i) => i.id !== cartItemId);
        persistGuestItems(next);
      }
    },
    [guestItems, isAuthenticated, persistGuestItems, triggerRemoveItem]
  );

  // Clear all items
  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await triggerClearCart().unwrap();
      } catch {
        // Keep state
      }
    } else {
      persistGuestItems([]);
    }
  }, [isAuthenticated, persistGuestItems, triggerClearCart]);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount: items.length,
        subtotal,
        originalSubtotal,
        totalSavings,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountUntilFreeShipping,
        qualifiesForFreeShipping,
        isLoading: !isMounted || (isAuthenticated && isServerLoading && items.length === 0),
        isCartOpen,
        isMounted,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}

      {/* ── Global Animated Added-To-Cart Notification ── */}
      {toast && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in-0 duration-300 pointer-events-auto">
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl shadow-2xl border backdrop-blur-xl bg-neutral-950/95 text-white border-neutral-800 ring-1 ring-white/10 transition-all">
            {/* Thumbnail or Cart Icon */}
            {toast.image ? (
              <div className="h-12 w-12 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700">
                <img
                  src={toast.image}
                  alt={toast.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Check className="h-5 w-5" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs font-bold tracking-wide text-emerald-400">
                  {isBn ? "ব্যাগে যোগ করা হয়েছে!" : "Added to Shopping Bag"}
                </span>
              </div>
              <p className="text-xs font-bold text-white truncate mt-0.5">
                {toast.title}
              </p>
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-0.5">
                <span className="truncate">{toast.subtitle}</span>
                <span className="font-bold text-white ml-2 shrink-0">
                  {formatPrice(toast.price)}
                </span>
              </div>
            </div>

            {/* Quick Bag Button */}
            <button
              type="button"
              onClick={() => {
                setToast(null);
                setIsCartOpen(true);
              }}
              className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-white text-neutral-950 hover:bg-neutral-200 transition-colors shrink-0 flex items-center gap-1 shadow-xs"
            >
              <span>{isBn ? "ব্যাগ" : "Bag"}</span>
              <ArrowRight className="h-3 w-3" />
            </button>

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
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
