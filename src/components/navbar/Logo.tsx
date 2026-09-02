import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  isCompact?: boolean;
}

export function ZevonLogo({ className, isCompact = false }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="ZEVON - Home"
      className={cn(
        "group flex items-center transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500 rounded-lg p-1",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={isCompact ? "0 0 70 90" : "0 0 460 90"}
        className="h-8 sm:h-9 md:h-10 w-auto text-neutral-900 dark:text-neutral-100 transition-colors duration-200"
        fill="none"
      >
        {/* Minimal Geometric Z Monogram */}
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 18 24 L 56 24 L 22 66 L 60 66" />
          <circle cx="39" cy="45" r="2.5" fill="currentColor" />
        </g>

        {!isCompact && (
          <>
            {/* Wordmark: ZEVON */}
            <text
              x="80"
              y="58"
              fill="currentColor"
              fontFamily="'Montserrat', 'Helvetica Neue', 'Outfit', sans-serif"
              fontSize="40"
              fontWeight="900"
              letterSpacing="6"
            >
              ZEVON
            </text>

            {/* High-End Capsule Badge: BD */}
            <g transform="translate(355, 30)">
              <rect
                x="0"
                y="0"
                width="44"
                height="26"
                rx="6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.85"
              />
              <text
                x="22"
                y="18"
                fill="currentColor"
                fontFamily="'Montserrat', sans-serif"
                fontSize="14"
                fontWeight="800"
                letterSpacing="1"
                textAnchor="middle"
              >
                BD
              </text>
            </g>

            {/* Subtitle Tagline */}
            <text
              x="83"
              y="74"
              fill="currentColor"
              opacity="0.55"
              fontFamily="'Montserrat', 'Inter', sans-serif"
              fontSize="8.5"
              fontWeight="600"
              letterSpacing="4.5"
            >
              APPAREL &amp; LIFESTYLE
            </text>
          </>
        )}
      </svg>
    </Link>
  );
}
