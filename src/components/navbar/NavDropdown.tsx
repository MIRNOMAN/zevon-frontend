"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import { NavCategory } from "./types";
import { cn } from "@/lib/utils";

interface NavDropdownProps {
  category: NavCategory;
}

export function NavDropdown({ category }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Check if any subcategory is currently active
  const isCategoryActive = category.subCategories?.some((sub) =>
    pathname.startsWith(sub.href)
  );

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180); // Smooth hover intent buffer
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={cn(
          "group relative flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold tracking-wide transition-all duration-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
          isOpen || isCategoryActive
            ? "text-neutral-950 dark:text-white"
            : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
        )}
      >
        <span>{category.title}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-neutral-200",
            isOpen && "rotate-180 text-neutral-950 dark:text-white"
          )}
        />

        {/* Active Indicator: Subtle 2px bottom line */}
        <span
          className={cn(
            "absolute bottom-0 left-3 right-3 h-[2px] rounded-full transition-all duration-300",
            isCategoryActive
              ? "bg-neutral-950 dark:bg-white scale-x-100 opacity-100"
              : "bg-neutral-400 dark:bg-neutral-600 scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-40"
          )}
        />
      </button>

      {/* Dropdown Content with Glassmorphic Backdrop */}
      {isOpen && (
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 w-80 sm:w-96 animate-in fade-in-0 zoom-in-95 duration-200"
          )}
        >
          <div className="relative overflow-hidden rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 p-3 shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
            {/* Top Subtitle Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-100 dark:border-neutral-800/80 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Explore {category.title}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3" />
                Premium Quality
              </span>
            </div>

            {/* Subcategories List */}
            <div className="space-y-1">
              {category.subCategories?.map((sub) => {
                const isSubActive = pathname === sub.href;
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={cn(
                      "group/item flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150",
                      isSubActive
                        ? "bg-neutral-100 dark:bg-neutral-800/90 text-neutral-950 dark:text-white"
                        : "hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300"
                    )}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-sm font-semibold tracking-tight transition-colors",
                            isSubActive
                              ? "text-neutral-950 dark:text-white"
                              : "group-hover/item:text-neutral-950 dark:group-hover/item:text-white"
                          )}
                        >
                          {sub.title}
                        </span>
                        {isSubActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
                        )}
                      </div>
                      {sub.description && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                          {sub.description}
                        </p>
                      )}
                    </div>

                    <ArrowRight className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200" />
                  </Link>
                );
              })}
            </div>

            {/* Bottom Category Quick View */}
            <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 px-3 py-1">
              <Link
                href={`/shop/${category.id}`}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors flex items-center justify-between"
              >
                <span>View all {category.title} collections</span>
                <span className="text-[10px] uppercase font-bold tracking-wider">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
