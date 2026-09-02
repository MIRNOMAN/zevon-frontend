"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  ChevronDown,
  Heart,
  User,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { NAV_CATEGORIES } from "./navData";
import { ZevonLogo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistCount?: number;
}

export function MobileDrawer({
  isOpen,
  onClose,
  wishlistCount = 2,
}: MobileDrawerProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    men: true, // open first by default for discoverability
  });
  const pathname = usePathname();

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

  const toggleAccordion = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="relative w-screen max-w-xs sm:max-w-sm bg-white dark:bg-neutral-900 shadow-2xl flex flex-col border-r border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-left duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <ZevonLogo className="h-7 w-auto" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Accordion List */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
            {NAV_CATEGORIES.map((category) => {
              const hasSubcategories =
                category.subCategories && category.subCategories.length > 0;
              const isExpanded = !!expandedCategories[category.id];
              const isCategoryActive = category.subCategories?.some((sub) =>
                pathname.startsWith(sub.href)
              );

              if (hasSubcategories) {
                return (
                  <div
                    key={category.id}
                    className="rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 overflow-hidden transition-colors"
                  >
                    {/* Accordion Trigger */}
                    <button
                      type="button"
                      onClick={() => toggleAccordion(category.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 text-sm font-bold tracking-wide transition-colors text-left",
                        isCategoryActive
                          ? "text-neutral-950 dark:text-white"
                          : "text-neutral-700 dark:text-neutral-200"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {category.title}
                        {isCategoryActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
                        )}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-neutral-400 transition-transform duration-200",
                          isExpanded && "rotate-180 text-neutral-900 dark:text-white"
                        )}
                      />
                    </button>

                    {/* Accordion Body */}
                    {isExpanded && (
                      <div className="px-3 pb-3 space-y-1 animate-in fade-in-0 duration-150">
                        {category.subCategories?.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={onClose}
                              className={cn(
                                "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors",
                                isSubActive
                                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60"
                              )}
                            >
                              <span>{sub.title}</span>
                              <ArrowRight className="h-3 w-3 opacity-60" />
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Direct routes (New Drops, Sale)
              const isSale = category.badgeVariant === "sale";
              return (
                <Link
                  key={category.id}
                  href={category.href || "#"}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-bold tracking-wide transition-all",
                    isSale
                      ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                      : "bg-neutral-50/80 dark:bg-neutral-800/40 border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {isSale && <Sparkles className="h-4 w-4 text-rose-500" />}
                    {category.title}
                  </span>
                  {category.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider",
                        isSale
                          ? "bg-rose-500 text-white"
                          : "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                      )}
                    >
                      {category.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Wishlist Link in Mobile Drawer */}
            <Link
              href="/account/wishlist"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-3 rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 text-sm font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="h-4 w-4 text-rose-500" />
                <span>Wishlist</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                {wishlistCount} items
              </span>
            </Link>
          </div>

          {/* Drawer Footer Actions (Language, Theme, Profile/Login) */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/40 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>

              <Link
                href="/account/orders"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-200/70 dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                <span>Account</span>
              </Link>
            </div>

            <Link
              href="/login"
              onClick={onClose}
              className="w-full inline-flex items-center justify-center rounded-xl bg-neutral-900 dark:bg-white px-4 py-2.5 text-xs font-bold text-white dark:text-neutral-950 hover:opacity-90 transition-opacity"
            >
              Sign In / Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
