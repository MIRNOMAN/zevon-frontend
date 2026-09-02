import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function ZevonLogo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="ZEVON - Home"
      className={cn(
        "group flex items-center transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500 rounded-lg py-1 pr-2",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 56"
        className="h-8 sm:h-9 md:h-10 w-auto text-current transition-colors duration-200"
        fill="none"
      >
        {/* Main Wordmark Group: Large 'Z' + Smaller 'EVON' + 'BD' */}
        <g fill="currentColor">
          {/* Prominent Large 'Z' */}
          <text
            x="2"
            y="36"
            fontFamily="'Montserrat', 'Helvetica Neue', 'Outfit', sans-serif"
            fontSize="44"
            fontWeight="900"
            letterSpacing="0.5"
          >
            Z
          </text>

          {/* Medium 'EVON' */}
          <text
            x="36"
            y="34"
            fontFamily="'Montserrat', 'Helvetica Neue', 'Outfit', sans-serif"
            fontSize="28"
            fontWeight="900"
            letterSpacing="3"
          >
            EVON
          </text>

          {/* 'BD' Suffix */}
          <text
            x="146"
            y="34"
            fontFamily="'Montserrat', 'Helvetica Neue', 'Outfit', sans-serif"
            fontSize="19"
            fontWeight="900"
            letterSpacing="1.5"
            opacity="0.85"
          >
            BD
          </text>

          {/* Subtitle Tagline */}
          <text
            x="5"
            y="50"
            opacity="0.6"
            fontFamily="'Montserrat', 'Inter', sans-serif"
            fontSize="7.5"
            fontWeight="700"
            letterSpacing="3.6"
          >
            APPAREL &amp; LIFESTYLE
          </text>
        </g>
      </svg>
    </Link>
  );
}
