"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  Shield,
  Loader2,
  LogIn,
  UserPlus,
  Heart,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  logout,
} from "@/redux/features/authSlice";
import { useLogoutMutation } from "@/redux/api/authApi";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function UserProfileDropdown() {
  const { t, isBn } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [triggerLogout, { isLoading: isLoggingOut }] = useLogoutMutation();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
    } catch {
      // Clear Redux state even on network error
      dispatch(logout());
    } finally {
      setIsOpen(false);
      router.push("/login");
    }
  };

  const displayName = user?.name || (isBn ? "সম্মানিত গ্রাহক" : "Customer");
  const displayEmail = user?.email || "";
  const initial = displayName.charAt(0).toUpperCase();
  const isAdmin = user?.role === "ADMIN" || user?.role === "MANAGER";

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="User Account Menu"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
          isOpen
            ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white border-neutral-200 dark:border-neutral-700"
            : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60"
        )}
      >
        {isAuthenticated && user ? (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold ring-1 ring-neutral-300 dark:ring-neutral-700">
            {initial}
          </div>
        ) : (
          <UserIcon className="h-4 w-4" />
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 p-2.5 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 z-50 animate-fade-in-scale">
          {/* User Header Summary */}
          {isAuthenticated && user ? (
            <div className="px-3 py-3 mb-1.5 border-b border-neutral-100 dark:border-neutral-800/80">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-neutral-800 to-neutral-950 text-white dark:from-neutral-100 dark:to-neutral-300 dark:text-neutral-950 text-sm font-black uppercase tracking-wider shadow-xs">
                  {initial}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {displayName}
                    </span>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                        <Shield className="h-2.5 w-2.5" />
                        {user.role}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                    {displayEmail}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 mb-1.5 border-b border-neutral-100 dark:border-neutral-800 space-y-2">
              <div className="text-center pb-1">
                <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                  {t("userMenu.welcome", "Welcome to ZEVON")}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {t("userMenu.signInDesc", "Sign in to access your profile & orders")}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 transition-opacity"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>{t("userMenu.signIn", "Sign In")}</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-3 py-2 text-xs font-semibold text-neutral-900 dark:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-700 transition-colors"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>{t("userMenu.register", "Register")}</span>
                </Link>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="space-y-0.5">
            {isAdmin && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 rounded-xl hover:bg-neutral-100/80 dark:hover:bg-neutral-800/70 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="h-4 w-4 text-amber-500" />
                  <span>{t("userMenu.adminDashboard", "Admin Dashboard")}</span>
                </div>
                <ChevronRight className="h-3 w-3 text-neutral-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>
            )}

            <Link
              href="/account/wishlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 rounded-xl hover:bg-neutral-100/80 dark:hover:bg-neutral-800/70 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="h-4 w-4 text-rose-500 transition-colors" />
                <span>{t("userMenu.wishlist", "My Wishlist")}</span>
              </div>
              <ChevronRight className="h-3 w-3 text-neutral-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>

            <Link
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 rounded-xl hover:bg-neutral-100/80 dark:hover:bg-neutral-800/70 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Package className="h-4 w-4 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                <span>{t("userMenu.orders", "Orders & Tracking")}</span>
              </div>
              <ChevronRight className="h-3 w-3 text-neutral-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>

            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 rounded-xl hover:bg-neutral-100/80 dark:hover:bg-neutral-800/70 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                <span>{t("userMenu.account", "Account & Addresses")}</span>
              </div>
              <ChevronRight className="h-3 w-3 text-neutral-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </div>

          {/* Logout Action */}
          {isAuthenticated && (
            <div className="mt-1 pt-1 border-t border-neutral-100 dark:border-neutral-800/80">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-2.5">
                  {isLoggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  <span>{isLoggingOut ? (isBn ? "লগআউট হচ্ছে..." : "Signing out...") : t("userMenu.signOut", "Sign Out")}</span>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
