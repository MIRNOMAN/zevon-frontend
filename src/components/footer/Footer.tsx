"use client";

import React from "react";
import Link from "next/link";
import { ZevonLogo } from "@/components/navbar/Logo";
import { ShieldCheck } from "lucide-react";
import { useTranslation, toBengaliDigits } from "@/lib/i18n";

export function Footer() {
  const { t, isBn } = useTranslation();

  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Upper Grid Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10">
          {/* Brand Info (col-span-12 md:col-span-4) */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <ZevonLogo className="h-9 w-auto" />
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed">
              {t("footer.brandDesc", "Pioneering high-end streetwear and architectural essentials in Bangladesh. Engineered with 380+ GSM organic cotton.")}
            </p>
            {/* Social Links (Inline Clean SVG Icons) */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Men Column (col-span-1 md:col-span-2) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              {t("nav.men", "Men")}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              <li>
                <Link href="/shop?category=men-t-shirts" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {t("categories.menTshirts", "T-Shirts & Tops")}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=men-hoodies" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {t("categories.menHoodies", "Hoodies & Sweatshirts")}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=men-pants" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {t("categories.menPants", "Pants & Cargos")}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=men-coords" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {t("categories.menCoords", "Co-ords & Sets")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Women Column (col-span-1 md:col-span-2) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              {t("nav.women", "Women")}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              <li>
                <Link href="/shop?category=women-coords" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {t("categories.womenCoords", "Co-ords & Sets")}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=women-dresses" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {t("categories.womenDresses", "Dresses & Jumpsuits")}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=women-tops" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {t("categories.womenTops", "Tops & Baby Tees")}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=women-trousers" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {t("categories.womenTrousers", "Trousers & Skirts")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care (col-span-1 md:col-span-2) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              {isBn ? "সহায়তা ও সেবা" : "Help & Support"}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              <li>
                <Link href="/account/orders" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {isBn ? "অর্ডার ট্র্যাক করুন" : "Track Your Order"}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {isBn ? "ডেলিভারি তথ্য" : "Shipping & Delivery"}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {isBn ? "৭ দিনের রিটার্ন নীতি" : "7-Day Returns Policy"}
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {isBn ? "সাইজ গাইড ও জিএসএম" : "Size Guide & GSM"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Stores (col-span-1 md:col-span-2) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              {isBn ? "কোম্পানি" : "Company"}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              <li>
                <Link href="/about" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {isBn ? "আমাদের গল্প" : "Brand Story"}
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {isBn ? "পরিবেশবান্ধব উপাদান" : "Sustainable Sourcing"}
                </Link>
              </li>
              <li>
                <Link href="/stores" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {isBn ? "ফ্ল্যাগশিপ আউটলেট (ঢাকা)" : "Flagship Store (Dhaka)"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {isBn ? "যোগাযোগ" : "Contact Atelier"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Badges & Trust Banner */}
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>{isBn ? "১০০% নিরাপদ ও সুরক্ষিত চেকআউট" : "100% Encrypted & Secure Checkout"}</span>
          </div>

          {/* Payment Methods Badges */}
          <div className="flex items-center gap-2 flex-wrap text-[10px] font-extrabold uppercase">
            <span className="px-2.5 py-1 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-pink-600 font-black">
              bKash
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-orange-600 font-black">
              Nagad
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-blue-600 font-black">
              VISA
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-red-600 font-black">
              Mastercard
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300">
              {isBn ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery"}
            </span>
          </div>
        </div>

        {/* Bottom Sub-Footer */}
        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 dark:text-neutral-500">
          <p>
            &copy; {isBn ? toBengaliDigits(new Date().getFullYear()) : new Date().getFullYear()} ZEVON BD Apparel &amp; Lifestyle. {t("footer.copyright", "All rights reserved. Designed & Engineered in Bangladesh.")}
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              {isBn ? "গোপনীয়তা নীতি" : "Privacy Policy"}
            </Link>
            <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              {isBn ? "শর্তাবলী" : "Terms of Service"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
