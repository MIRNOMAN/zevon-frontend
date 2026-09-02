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
  LogOut,
  Shield,
  Loader2,
} from "lucide-react";
import { NAV_CATEGORIES } from "./navData";
import { ZevonLogo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  logout,
} from "@/redux/features/authSlice";
import { useLogoutMutation } from "@/redux/api/authApi";
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
    men: true,
  });
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [triggerLogout, { isLoading: isLoggingOut }] = useLogoutMutation();

  // Lock background scroll when open
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

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
    } catch {
      dispatch(logout());
    } finally {
      onClose();
    }
  };

  const isAdmin = user?.role === "ADMIN" || user?.role === "MANAGER";

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 overflow-hidden lg:hidden transition-all duration-300",
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      )}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div
          className={cn(
            "relative w-screen max-w-[19rem] sm:max-w-xs bg-white dark:bg-neutral-900 shadow-2xl flex flex-col border-r border-neutral-200 dark:border-neutral-800 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <ZevonLogo className="h-7 w-auto" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none"
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
                    <Badge
                      variant={isSale ? "sale" : "new"}
                      className="text-[10px] px-2 py-0.5 uppercase"
                    >
                      {category.badge}
                    </Badge>
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
              <Badge variant="secondary" className="text-xs bg-rose-500/10 text-rose-600 dark:text-rose-400 border-transparent">
                {wishlistCount} items
              </Badge>
            </Link>

            {isAdmin && (
              <Link
                href="/dashboard"
                onClick={onClose}
                className="flex items-center justify-between px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-sm font-bold text-amber-700 dark:text-amber-400 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="h-4 w-4 text-amber-500" />
                  <span>Admin Dashboard</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {/* Drawer Footer Actions (Language, Theme, Profile/Login) */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/40 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <LanguageSwitcher variant="segmented" />
                <ThemeToggle />
              </div>

              {isAuthenticated && (
                <Link
                  href="/account"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-200/70 dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>{user?.name?.split(" ")[0] || "Account"}</span>
                </Link>
              )}
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-xl bg-neutral-900 dark:bg-white px-3 py-2.5 text-xs font-bold text-white dark:text-neutral-950 hover:opacity-90 transition-opacity text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-xl bg-neutral-200/80 dark:bg-neutral-800 border border-neutral-300/50 dark:border-neutral-700 px-3 py-2.5 text-xs font-bold text-neutral-900 dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
