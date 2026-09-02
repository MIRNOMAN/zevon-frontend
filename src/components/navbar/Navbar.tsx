"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import { ZevonLogo } from "./Logo";
import { DesktopNav } from "./DesktopNav";
import { NavActions } from "./NavActions";
import { MobileDrawer } from "./MobileDrawer";
import { SearchModal } from "./SearchModal";
import { CartDrawer } from "./CartDrawer";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
  wishlistCount?: number;
  cartCount?: number;
}

export function Navbar({
  className,
  wishlistCount = 2,
  cartCount = 2,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          "bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md",
          "border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-xs",
          className
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ========================================================= */}
          {/* 1. Left Section: Logo (Desktop) & Hamburger (Mobile)      */}
          {/* ========================================================= */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile navigation"
              className="flex lg:hidden h-9 w-9 items-center justify-center rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Brand Logo - Links to / */}
            <div className="flex items-center">
              <ZevonLogo />
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. Center Section: Navigation Dropdowns & Direct Links   */}
          {/* ========================================================= */}
          <DesktopNav />

          {/* ========================================================= */}
          {/* 3. Right Section: Utility and Action Icons                */}
          {/* ========================================================= */}
          <NavActions
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            wishlistCount={wishlistCount}
            cartCount={cartCount}
          />
        </div>
      </header>

      {/* ========================================================= */}
      {/* Dynamic Overlays: Mobile Drawer, Search, Cart Drawer       */}
      {/* ========================================================= */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        wishlistCount={wishlistCount}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartCount={cartCount}
      />
    </>
  );
}
