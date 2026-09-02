"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Package, MapPin, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProfileDropdownProps {
  isLoggedIn?: boolean;
  userName?: string;
  userEmail?: string;
}

export function UserProfileDropdown({
  isLoggedIn = true,
  userName = "Abdul Rahim",
  userEmail = "abdul@example.com",
}: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = () => {
    // Perform logout action
    setIsOpen(false);
    console.log("Logged out");
  };

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
        <User className="h-4 w-4" />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 p-2 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 z-50 animate-fade-in-scale">
          {/* User Header Summary */}
          {isLoggedIn ? (
            <div className="px-3 py-2.5 mb-1.5 border-b border-neutral-100 dark:border-neutral-800/80">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 text-xs font-bold uppercase tracking-wider">
                  {userName.charAt(0)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                    {userName}
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                    {userEmail}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2 mb-1 border-b border-neutral-100 dark:border-neutral-800">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full inline-flex items-center justify-center rounded-lg bg-neutral-900 px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 transition-opacity"
              >
                Sign In / Register
              </Link>
            </div>
          )}

          {/* Menu Items */}
          <div className="space-y-0.5">
            <Link
              href="/account/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 rounded-xl hover:bg-neutral-100/80 dark:hover:bg-neutral-800/70 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Package className="h-4 w-4 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                <span>Orders & Tracking</span>
              </div>
              <ChevronRight className="h-3 w-3 text-neutral-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>

            <Link
              href="/account/addresses"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 rounded-xl hover:bg-neutral-100/80 dark:hover:bg-neutral-800/70 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                <span>Saved Addresses</span>
              </div>
              <ChevronRight className="h-3 w-3 text-neutral-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </div>

          {/* Logout Action */}
          {isLoggedIn && (
            <div className="mt-1 pt-1 border-t border-neutral-100 dark:border-neutral-800/80">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
