"use client";

import React from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { cn } from "@/lib/utils";

interface NavActionsProps {
  onOpenSearch: () => void;
  onOpenCart: () => void;
  wishlistCount?: number;
  cartCount?: number;
}

export function NavActions({
  onOpenSearch,
  onOpenCart,
  wishlistCount = 2,
  cartCount = 2,
}: NavActionsProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
      {/* Search Trigger Button */}
      <button
        type="button"
        onClick={onOpenSearch}
        aria-label="Open global search"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
      >
        <Search className="h-4 w-4" />
      </button>

      {/* Language Switcher (Desktop / Tablet) */}
      <div className="hidden sm:block">
        <LanguageSwitcher />
      </div>

      {/* Dark / Light Mode Switcher (Desktop / Tablet) */}
      <div className="hidden sm:block">
        <ThemeToggle />
      </div>

      {/* User Profile Dropdown (Desktop / Tablet) */}
      <div className="hidden sm:block">
        <UserProfileDropdown />
      </div>

      {/* Wishlist Link with Live Counter Badge (Desktop / Tablet) */}
      <Link
        href="/account/wishlist"
        aria-label={`View wishlist (${wishlistCount} items)`}
        className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
      >
        <Heart className="h-4 w-4 transition-transform active:scale-90" />
        {wishlistCount > 0 && (
          <span className="absolute 0 top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-900 dark:bg-white text-[10px] font-black text-white dark:text-neutral-950 px-1 shadow-sm">
            {wishlistCount}
          </span>
        )}
      </Link>

      {/* Cart Drawer Trigger Button with Live Counter Badge */}
      <button
        type="button"
        onClick={onOpenCart}
        aria-label={`Open shopping cart (${cartCount} items)`}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
          "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60"
        )}
      >
        <ShoppingBag className="h-4 w-4 transition-transform active:scale-90" />
        {cartCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white px-1 shadow-sm animate-in zoom-in-50">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}
