"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { NAV_CATEGORIES } from "./navData";
import { NavDropdown } from "./NavDropdown";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGetCategoryTreeQuery } from "@/redux/api/categoryApi";
import { useTranslation, getCategoryI18nName, getCategoryI18nDesc } from "@/lib/i18n";
import type { NavCategory } from "./types";

function NavItemsList() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { data: serverTree } = useGetCategoryTreeQuery();

  const navCategories: NavCategory[] = useMemo(() => {
    if (!serverTree || serverTree.length === 0) {
      return NAV_CATEGORIES.map((cat) => ({
        ...cat,
        title: getCategoryI18nName(cat.id, cat.title, t),
        subCategories: cat.subCategories?.map((sub) => ({
          ...sub,
          title: t(`categories.${sub.title.toLowerCase().replace(/[^a-z]/g, "")}`, sub.title),
        })),
      }));
    }

    const menCat = serverTree.find((c) => c.slug === "men");
    const womenCat = serverTree.find((c) => c.slug === "women");

    const dynamicCategories: NavCategory[] = [];

    if (menCat) {
      dynamicCategories.push({
        id: "men",
        title: t("nav.men", "Men"),
        href: "/men",
        productCount: menCat._count?.products ?? 0,
        subCategories: menCat.children?.map((sub) => ({
          title: getCategoryI18nName(sub.slug, sub.name, t),
          href: `/shop?category=${sub.slug}`,
          description: getCategoryI18nDesc(sub.slug, sub.description || undefined, t),
          productCount: sub._count?.products ?? 0,
        })),
      });
    }

    if (womenCat) {
      dynamicCategories.push({
        id: "women",
        title: t("nav.women", "Women"),
        href: "/women",
        productCount: womenCat._count?.products ?? 0,
        subCategories: womenCat.children?.map((sub) => ({
          title: getCategoryI18nName(sub.slug, sub.name, t),
          href: `/shop?category=${sub.slug}`,
          description: getCategoryI18nDesc(sub.slug, sub.description || undefined, t),
          productCount: sub._count?.products ?? 0,
        })),
      });
    }

    // Include other root categories like Outerwear/Accessories if present
    const otherCats = serverTree.filter((c) => c.slug !== "men" && c.slug !== "women");
    for (const cat of otherCats) {
      dynamicCategories.push({
        id: cat.slug,
        title: getCategoryI18nName(cat.slug, cat.name, t),
        href: `/shop?category=${cat.slug}`,
        productCount: cat._count?.products ?? 0,
        subCategories: cat.children?.map((sub) => ({
          title: getCategoryI18nName(sub.slug, sub.name, t),
          href: `/shop?category=${sub.slug}`,
          description: getCategoryI18nDesc(sub.slug, sub.description || undefined, t),
          productCount: sub._count?.products ?? 0,
        })),
      });
    }

    return [
      ...dynamicCategories,
      {
        id: "new-drops",
        title: t("nav.newDrops", "New Drops"),
        href: "/shop?filter=new",
        badge: "SS/26",
        badgeVariant: "new",
      },
      {
        id: "sale",
        title: t("nav.sale", "Sale"),
        href: "/sale",
        badge: "Hot",
        badgeVariant: "sale",
      },
    ];
  }, [serverTree, t]);

  return (
    <div className="flex items-center gap-1 xl:gap-2">
      {navCategories.map((category) => {
        // Dropdown Items (Men, Women, Accessories)
        if (category.subCategories && category.subCategories.length > 0) {
          return <NavDropdown key={category.id} category={category} />;
        }

        // Direct Route Items (New Drops, Sale)
        const isNewFilter =
          category.id === "new-drops" &&
          pathname === "/shop" &&
          searchParams?.get("filter") === "new";
        const isSaleRoute =
          category.id === "sale" &&
          (pathname === "/sale" || pathname.startsWith("/sale"));
        const isActive = isNewFilter || isSaleRoute;

        return (
          <Link
            key={category.id}
            href={category.href || "#"}
            className={cn(
              "group relative flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold tracking-wide transition-all duration-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
              category.badgeVariant === "sale"
                ? "text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300"
                : isActive
                ? "text-neutral-950 dark:text-white"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            )}
          >
            <span>{category.title}</span>

            {/* Highlighted Badges using shadcn Badge */}
            {category.badge && (
              <Badge
                variant={category.badgeVariant === "sale" ? "sale" : "new"}
                className="text-[10px] px-1.5 py-0 h-4 uppercase transition-transform group-hover:scale-105"
              >
                {category.badge}
              </Badge>
            )}

            {/* Active Indicator Bar */}
            <span
              className={cn(
                "absolute bottom-0 left-3 right-3 h-[2px] rounded-full transition-all duration-300",
                isActive
                  ? category.badgeVariant === "sale"
                    ? "bg-rose-500 scale-x-100 opacity-100"
                    : "bg-neutral-950 dark:bg-white scale-x-100 opacity-100"
                  : "bg-neutral-400 dark:bg-neutral-600 scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-40"
              )}
            />
          </Link>
        );
      })}
    </div>
  );
}

function NavFallback() {
  return (
    <div className="flex items-center gap-1 xl:gap-2">
      {NAV_CATEGORIES.map((category) => (
        <span
          key={category.id}
          className="px-3.5 py-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400"
        >
          {category.title}
        </span>
      ))}
    </div>
  );
}

export function DesktopNav() {
  return (
    <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
      <Suspense fallback={<NavFallback />}>
        <NavItemsList />
      </Suspense>
    </nav>
  );
}
