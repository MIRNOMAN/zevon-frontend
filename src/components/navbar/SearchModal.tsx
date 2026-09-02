"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp, ArrowRight, CornerDownLeft } from "lucide-react";
import { SEARCH_TRENDING_TAGS } from "./navData";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input on open & lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    router.push(`/shop?search=${encodeURIComponent(tag)}`);
    onClose();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-hidden transition-all duration-250",
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      )}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-250 ease-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal Dialog with smooth scale transition */}
      <div
        className={cn(
          "relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 z-10 transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2"
        )}
      >
        {/* Search Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-800/90 bg-transparent"
        >
          <Search className="h-5 w-5 text-neutral-400 dark:text-neutral-500 shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            suppressHydrationWarning
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search collections, apparel, accessories..."
            style={{ outline: "none", border: "none", boxShadow: "none" }}
            className="w-full bg-transparent px-3.5 py-1 text-base sm:text-lg font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 shadow-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mr-1 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors focus:outline-none"
          >
            <span>ESC</span>
          </button>
        </form>

        {/* Content Section */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-5">
          {/* Trending Searches */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Trending Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SEARCH_TRENDING_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-all duration-150"
                >
                  <span>{tag}</span>
                  <ArrowRight className="h-3 w-3 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Categories */}
          <div className="border-t border-neutral-100 dark:border-neutral-800/80 pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-2.5">
              Popular Categories
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { name: "Graphic T-Shirts", href: "/shop/men/t-shirts" },
                { name: "Heavyweight Hoodies", href: "/shop/men/outerwear" },
                { name: "Utility Cargo Pants", href: "/shop/men/pants" },
                { name: "Women's Co-ords", href: "/shop/women/dresses" },
                { name: "Caps & Beanies", href: "/shop/accessories/caps" },
                { name: "New Drops 2026", href: "/shop?filter=new" },
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 text-left hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-all group"
                >
                  <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white">
                    {item.name}
                  </span>
                  <CornerDownLeft className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-950/40 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
          <span>Press <strong>Enter</strong> to search</span>
          <span>ZEVON Global Store</span>
        </div>
      </div>
    </div>
  );
}
