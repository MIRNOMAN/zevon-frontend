"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { useTranslation, LanguageCode } from "@/lib/i18n";

interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "EN" },
  { code: "bn", label: "বাংলা", nativeLabel: "বাং" },
];

interface LanguageSwitcherProps {
  variant?: "dropdown" | "segmented";
  align?: "left" | "right";
  dropDirection?: "up" | "down";
  className?: string;
}

export function LanguageSwitcher({
  variant = "dropdown",
  align = "right",
  dropDirection = "down",
  className,
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click for dropdown mode
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (variant === "dropdown") {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [variant]);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const currentOption: LanguageOption =
    LANGUAGES.find((l) => l.code === language) ?? {
      code: "en",
      label: "English",
      nativeLabel: "EN",
    };

  // 1. Segmented Pill Switch (Ideal for Mobile Drawer & compact UI)
  if (variant === "segmented") {
    return (
      <div
        className={cn(
          "inline-flex items-center p-0.5 rounded-lg bg-neutral-200/80 dark:bg-neutral-800 border border-neutral-300/50 dark:border-neutral-700/60",
          className
        )}
      >
        {LANGUAGES.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={cn(
                "px-2.5 py-1 text-xs font-bold rounded-md transition-all duration-150 focus-visible:outline-none",
                isSelected
                  ? "bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-xs"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              {lang.nativeLabel}
            </button>
          );
        })}
      </div>
    );
  }

  // 2. Dropdown Popover (Ideal for Desktop Header)
  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Language selector (current: ${currentOption.label})`}
        aria-expanded={isOpen}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
          isOpen
            ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white border-neutral-200 dark:border-neutral-700"
            : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60"
        )}
      >
        <Globe className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
        <span className="font-bold tracking-wider uppercase">
          {currentOption.nativeLabel}
        </span>
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute w-44 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 p-1.5 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 z-50 animate-fade-in-scale",
            align === "left" ? "left-0" : "right-0",
            dropDirection === "up" ? "bottom-full mb-2" : "top-full mt-2"
          )}
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-800/80 mb-1">
            Select Language
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-xl transition-all duration-150",
                  isSelected
                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold"
                    : "hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-700/60 text-neutral-800 dark:text-neutral-200">
                    {lang.nativeLabel}
                  </span>
                  <span>{lang.label}</span>
                </div>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-neutral-900 dark:text-neutral-100" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
