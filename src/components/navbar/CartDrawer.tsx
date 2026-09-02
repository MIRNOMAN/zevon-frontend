"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { CartItem } from "./types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount?: number;
}

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: "item-1",
    name: "Oversized Minimalist Heavyweight Tee",
    category: "Men / T-Shirts",
    price: 1850,
    size: "L",
    color: "Washed Black",
    quantity: 1,
  },
  {
    id: "item-2",
    name: "Architectural Utility Cargo Pants",
    category: "Men / Pants",
    price: 3450,
    size: "32",
    color: "Dark Olive",
    quantity: 1,
  },
];

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);

  // Disable background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      {/* Drawer Container (100% width on mobile, sleek slide-in without clipping) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-xs sm:max-w-md bg-white dark:bg-neutral-900 shadow-2xl flex flex-col border-l border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-neutral-900 dark:text-white" />
              <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white tracking-wide">
                Your Shopping Bag
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {totalCount}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart drawer"
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="h-16 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Your bag is currently empty
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs">
                  Discover our new seasonal drops and add your favorite essentials.
                </p>
                <Link
                  href="/shop?filter=new"
                  onClick={onClose}
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 transition-opacity"
                >
                  Explore New Drops <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800/80 transition-all"
                >
                  {/* Thumbnail Placeholder */}
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-neutral-200 dark:bg-neutral-700/60 flex items-center justify-center shrink-0 text-neutral-400 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                    ZEVON
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1.5">
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                          {item.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="text-neutral-400 hover:text-rose-500 transition-colors shrink-0 p-0.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                        {item.color} / {item.size}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        ৳{item.price.toLocaleString()}
                      </span>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-0.5 bg-white dark:bg-neutral-900">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-semibold text-neutral-900 dark:text-white w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-3.5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                  Total
                </span>
                <span className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-white">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 dark:bg-white py-2.5 sm:py-3 px-4 text-xs sm:text-sm font-bold text-white dark:text-neutral-950 shadow-lg shadow-neutral-900/10 hover:opacity-95 active:scale-[0.99] transition-all"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
