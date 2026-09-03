"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  Search,
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
import { useGetCategoryTreeQuery } from "@/redux/api/categoryApi";
import { useTranslation, getCategoryI18nName, getCategoryI18nDesc } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { NavCategory } from "./types";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
  wishlistCount?: number;
}

export function MobileDrawer({
  isOpen,
  onClose,
  onOpenSearch,
  wishlistCount = 0,
}: MobileDrawerProps) {
  const { t, isBn } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { data: serverTree } = useGetCategoryTreeQuery();

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [triggerLogout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    men: true,
  });
  const [isRendered, setIsRendered] = useState(false);

  const navCategories = useMemo((): NavCategory[] => {
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

    dynamicCategories.push(
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
      }
    );

    return dynamicCategories;
  }, [serverTree, t]);

  useEffect(() => {
    let animTimer: NodeJS.Timeout;
    if (isOpen) {
      animTimer = setTimeout(() => {
        setIsRendered(true);
      }, 0);
      document.body.style.overflow = "hidden";
    } else {
      animTimer = setTimeout(() => {
        const exitTimer = setTimeout(() => {
          setIsRendered(false);
          document.body.style.overflow = "unset";
        }, 300);
        return () => clearTimeout(exitTimer);
      }, 0);
    }
    return () => clearTimeout(animTimer);
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
      router.push("/login");
    }
  };

  const isAdmin = user?.role === "ADMIN" || user?.role === "MANAGER";

  if (!isRendered) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 overflow-hidden lg:hidden transition-all duration-300",
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      )}
      aria-hidden={!isOpen}
    >
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div
          className={cn(
            "relative w-screen max-w-[19rem] sm:max-w-xs bg-white dark:bg-neutral-900 shadow-2xl flex flex-col border-r border-neutral-200 dark:border-neutral-800 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
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

          {onOpenSearch && (
            <div className="px-4 pt-3 pb-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-700/60 hover:border-neutral-400 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Search className="h-3.5 w-3.5" />
                  <span>{t("search.placeholder", "Search products...")}</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-neutral-900 shadow-xs">
                  {isBn ? "অনুসন্ধান" : "Search"}
                </span>
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {navCategories.map((category) => {
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
                        {category.productCount ? (
                          <span className="text-[10px] font-normal text-neutral-400 dark:text-neutral-500">
                            ({category.productCount} items)
                          </span>
                        ) : null}
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
                              <div className="flex items-center gap-2">
                                {sub.productCount !== undefined && sub.productCount > 0 && (
                                  <span className="text-[10px] font-bold opacity-60">
                                    {sub.productCount} {sub.productCount === 1 ? "item" : "items"}
                                  </span>
                                )}
                                <ArrowRight className="h-3 w-3 opacity-60" />
                              </div>
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
                <span>{t("nav.wishlist", "Wishlist")}</span>
              </div>
              <Badge variant="secondary" className="text-xs bg-rose-500/10 text-rose-600 dark:text-rose-400 border-transparent">
                {wishlistCount} {t("nav.items", "items")}
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
                  <span>{user?.name?.split(" ")[0] || t("nav.myProfile", "Account")}</span>
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
                <span>{isLoggingOut ? "Signing out..." : t("nav.logout", "Sign Out")}</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-xl bg-neutral-900 dark:bg-white px-3 py-2.5 text-xs font-bold text-white dark:text-neutral-950 hover:opacity-90 transition-opacity text-center"
                >
                  {t("nav.signIn", "Sign In")}
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-xl bg-neutral-200/80 dark:bg-neutral-800 border border-neutral-300/50 dark:border-neutral-700 px-3 py-2.5 text-xs font-bold text-neutral-900 dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors text-center"
                >
                  {t("nav.register", "Register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
