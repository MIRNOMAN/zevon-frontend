"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
  RotateCcw,
  Sparkles,
  CreditCard,
  Banknote,
  Search,
  Filter,
  Copy,
  Check,
  Eye,
  Loader2,
  Calendar,
  MapPin,
  Tag,
  ArrowRight,
  ChevronLeft,
  RefreshCw,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser, selectIsAuthenticated } from "@/redux/features/authSlice";
import {
  useGetMyOrdersQuery,
  useCancelMyOrderMutation,
  Order,
  OrderStatus,
  PaymentStatus,
  PaginatedOrders,
} from "@/redux/api/orderApi";
import { useCreateCheckoutSessionMutation } from "@/redux/api/paymentApi";
import { useCart } from "@/context/CartContext";
import { useTranslation, useCurrency, toBengaliDigits } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type FilterStatus = "ALL" | OrderStatus;

export function MyOrdersView() {
  const { t, isBn } = useTranslation();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [reorderSuccessId, setReorderSuccessId] = useState<string | null>(null);

  // RTK Query to fetch orders from server
  const {
    data: ordersResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetMyOrdersQuery(
    {
      page: currentPage,
      limit: 10,
      status: selectedStatus !== "ALL" ? selectedStatus : undefined,
    },
    { skip: !isAuthenticated }
  );

  const [cancelMyOrder, { isLoading: isCancelling }] = useCancelMyOrderMutation();
  const [createCheckoutSession, { isLoading: isCreatingSession }] =
    useCreateCheckoutSessionMutation();

  const ordersData = useMemo(() => {
    if (!ordersResponse?.data) return { orders: [], total: 0, totalPages: 1 };
    if (Array.isArray(ordersResponse.data)) {
      return {
        orders: ordersResponse.data,
        total: ordersResponse.data.length,
        totalPages: 1,
      };
    }
    const d = ordersResponse.data as PaginatedOrders;
    return {
      orders: d.orders || [],
      total: d.meta?.total ?? d.total ?? (d.orders?.length || 0),
      totalPages: d.meta?.totalPages ?? d.totalPages ?? 1,
    };
  }, [ordersResponse]);

  // Client-side search filtering
  const filteredOrders = useMemo(() => {
    let list = ordersData.orders;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.items?.some((item) => item.productTitle.toLowerCase().includes(q)) ||
          o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
          o.courierName?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [ordersData.orders, searchQuery]);

  const handleCopyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedId(orderNumber);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCancelConfirm = async () => {
    if (!cancelModalOrder) return;
    try {
      await cancelMyOrder(cancelModalOrder.id).unwrap();
      setCancelModalOrder(null);
      if (selectedOrder?.id === cancelModalOrder.id) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
      }
      refetch();
    } catch (err) {
      // Handled by interceptor/alert
    }
  };

  const handlePayNow = async (order: Order) => {
    try {
      const res = await createCheckoutSession({
        orderId: order.id,
        successUrl: `${window.location.origin}/orders?payment_success=${order.orderNumber}`,
        cancelUrl: `${window.location.origin}/orders?payment_cancelled=${order.orderNumber}`,
      }).unwrap();

      if (res?.data?.url) {
        window.location.href = res.data.url;
      }
    } catch {
      // Handled
    }
  };

  const handleReorder = async (order: Order) => {
    if (!order.items || order.items.length === 0) return;
    setReorderSuccessId(order.id);

    for (const item of order.items) {
      const prodSlug =
        item.product?.slug ||
        item.productTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      const primaryImg =
        typeof item.product?.images?.[0] === "string"
          ? item.product.images[0]
          : (item.product?.images?.[0] as any)?.url ||
            item.productImage ||
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";

      await addToCart({
        productVariantId: item.productVariantId || item.variantId || item.id,
        quantity: item.quantity,
        product: {
          id: item.productId || item.id,
          title: item.productTitle,
          name: item.productTitle,
          slug: prodSlug,
          basePrice: item.unitPrice,
          primaryImage: { url: primaryImg, altText: item.productTitle, isPrimary: true },
        },
        variant: {
          id: item.productVariantId || item.variantId || item.id,
          size: item.size || "M",
          color: item.color || "Standard",
          extraPrice: 0,
          imageUrl: primaryImg,
        },
      });
    }

    setTimeout(() => setReorderSuccessId(null), 2500);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return {
          label: isBn ? "পেন্ডিং (অপেক্ষারত)" : "Pending",
          className:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
          icon: <Clock className="h-3.5 w-3.5 mr-1" />,
        };
      case "CONFIRMED":
        return {
          label: isBn ? "নিশ্চিত হয়েছে" : "Confirmed",
          className:
            "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
          icon: <Check className="h-3.5 w-3.5 mr-1" />,
        };
      case "PROCESSING":
        return {
          label: isBn ? "প্রসেসিং হচ্ছে" : "Processing",
          className:
            "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
          icon: <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />,
        };
      case "SHIPPED":
        return {
          label: isBn ? "ডেলিভারির পথে" : "Shipped",
          className:
            "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
          icon: <Truck className="h-3.5 w-3.5 mr-1" />,
        };
      case "DELIVERED":
        return {
          label: isBn ? "ডেলিভার্ড" : "Delivered",
          className:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
        };
      case "CANCELLED":
        return {
          label: isBn ? "বাতিলকৃত" : "Cancelled",
          className:
            "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
          icon: <XCircle className="h-3.5 w-3.5 mr-1" />,
        };
      default:
        return {
          label: status,
          className:
            "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/30",
          icon: <Package className="h-3.5 w-3.5 mr-1" />,
        };
    }
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "PAID":
        return {
          label: isBn ? "পরিশোধিত" : "Paid",
          className:
            "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold",
        };
      case "PENDING":
        return {
          label: isBn ? "বকেয়া" : "Pending",
          className:
            "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold",
        };
      case "FAILED":
        return {
          label: isBn ? "ব্যর্থ" : "Failed",
          className:
            "bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold",
        };
      default:
        return {
          label: status,
          className: "bg-neutral-500/15 text-neutral-700 dark:text-neutral-300",
        };
    }
  };

  // ── Unauthenticated State ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-background">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-neutral-100 dark:bg-neutral-800 mb-6 shadow-inner">
          <Package className="h-10 w-10 text-neutral-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight mb-2">
          {isBn ? "আপনার অর্ডার দেখতে লগইন করুন" : "Sign in to View Your Orders"}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mb-8 leading-relaxed">
          {isBn
            ? "আপনার সব পূর্বের অর্ডার ট্র্যাক করতে এবং রসিদ ডাউনলোড করতে আপনার অ্যাকাউন্টে সাইন ইন করুন।"
            : "Track your past and active streetwear orders, monitor live shipping delivery, and access invoices."}
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/login?redirect=/orders"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-6 py-3.5 text-xs font-bold tracking-wide hover:opacity-90 transition-all shadow-md"
          >
            <span>{isBn ? "লগইন করুন" : "Sign In to Account"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white px-5 py-3.5 text-xs font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <span>{isBn ? "শপ ব্রাউজ করুন" : "Browse Shop"}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-background py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb & Page Header ── */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          <Link
            href="/"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {t("nav.home", "Home")}
          </Link>
          <span>/</span>
          <Link
            href="/account"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {isBn ? "অ্যাকাউন্ট" : "Account"}
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white">
            {isBn ? "আমার অর্ডারসমূহ" : "My Orders"}
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              <Package className="h-3.5 w-3.5 text-neutral-900 dark:text-white" />
              <span>
                {isBn ? "অর্ডার হিস্ট্রি" : "Order History"}
                {ordersData.total > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[11px] font-bold text-neutral-900 dark:text-white">
                    {isBn ? toBengaliDigits(ordersData.total) : ordersData.total}
                  </span>
                )}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-950 dark:text-white mt-1.5">
              {isBn ? "আমার অর্ডারসমূহ" : "My Orders & Tracking"}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
              {isBn
                ? "আপনার সমস্ত প্রিমিয়াম স্ট্রিটওয়্যার অর্ডার এবং লাইভ ডেলিভারি স্ট্যাটাস দেখুন।"
                : "View your purchase history, live parcel tracking, and manage your orders."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
            <span>{isBn ? "রিফ্রেশ" : "Refresh"}</span>
          </button>
        </div>

        {/* ── Filters & Search Toolbar ── */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {(
              [
                { id: "ALL", label: isBn ? "সবগুলো" : "All Orders" },
                { id: "PENDING", label: isBn ? "পেন্ডিং" : "Pending" },
                { id: "PROCESSING", label: isBn ? "প্রসেসিং" : "Processing" },
                { id: "SHIPPED", label: isBn ? "শিপড" : "Shipped" },
                { id: "DELIVERED", label: isBn ? "ডেলিভার্ড" : "Delivered" },
                { id: "CANCELLED", label: isBn ? "বাতিলকৃত" : "Cancelled" },
              ] as const
            ).map((tab) => {
              const isActive = selectedStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSelectedStatus(tab.id as FilterStatus);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 focus-visible:outline-none",
                    isActive
                      ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md"
                      : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white border border-neutral-200/60 dark:border-neutral-800"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isBn ? "অর্ডার আইডি বা পণ্য খুঁজুন..." : "Search orders, products..."
              }
              className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 text-neutral-900 dark:text-white placeholder:text-neutral-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ── Main Orders List Content ── */}
        <div className="mt-8 space-y-4">
          {isLoading ? (
            /* Loading Skeletons */
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 p-5 sm:p-6 space-y-4 animate-pulse"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-neutral-200/60 dark:border-neutral-800">
                    <div className="h-5 w-40 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-6 w-24 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                  </div>
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-neutral-200 dark:bg-neutral-800 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800" />
                      <div className="h-3 w-1/4 rounded bg-neutral-200 dark:bg-neutral-800" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            /* Empty State */
            <div className="py-20 sm:py-28 text-center space-y-4 max-w-md mx-auto">
              <div className="h-20 w-20 rounded-3xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mx-auto shadow-inner">
                <ShoppingBag className="h-10 w-10 text-neutral-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white">
                {isBn ? "কোনো অর্ডার পাওয়া যায়নি" : "No Orders Found"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {searchQuery
                  ? isBn
                    ? `"${searchQuery}" এর সাথে মিলে এমন কোনো অর্ডার নেই।`
                    : `No orders match your search "${searchQuery}".`
                  : isBn
                  ? "আপনি এখনো কোনো অর্ডার করেননি। আমাদের নতুন কালেকশন ঘুরে দেখুন।"
                  : "You haven't placed any orders in this category yet. Explore our latest streetwear drops."}
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold tracking-wide hover:opacity-90 transition-opacity shadow-md"
                >
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>{isBn ? "শপে পণ্য দেখুন" : "Explore Collections"}</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          ) : (
            /* Orders List */
            filteredOrders.map((order) => {
              const statusBadge = getStatusBadge(order.status);
              const paymentBadge = getPaymentStatusBadge(order.paymentStatus);
              const isPending = order.status === "PENDING";
              const isPaymentPending =
                order.paymentStatus === "PENDING" && order.paymentMethod === "STRIPE";
              const formattedDate = new Date(order.createdAt).toLocaleDateString(
                isBn ? "bn-BD" : "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              );

              return (
                <div
                  key={order.id}
                  className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-black text-neutral-950 dark:text-white">
                        <span>#{order.orderNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyOrderNumber(order.orderNumber)}
                          title={isBn ? "অর্ডার আইডি কপি করুন" : "Copy Order ID"}
                          className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        >
                          {copiedId === order.orderNumber ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      <span className="text-neutral-300 dark:text-neutral-700">•</span>

                      <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border",
                          statusBadge.className
                        )}
                      >
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>

                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px]",
                          paymentBadge.className
                        )}
                      >
                        {order.paymentMethod} • {paymentBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-8 space-y-3">
                      {order.items?.slice(0, 3).map((item, idx) => {
                        const imgUrl =
                          typeof item.product?.images?.[0] === "string"
                            ? item.product.images[0]
                            : (item.product?.images?.[0] as any)?.url ||
                              item.productImage ||
                              "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80";

                        const prodSlug =
                          item.product?.slug ||
                          item.productTitle
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, "");

                        return (
                          <div key={item.id || idx} className="flex items-center gap-3">
                            <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-950 shrink-0 border border-neutral-200/60 dark:border-neutral-800">
                              <img
                                src={imgUrl}
                                alt={item.productTitle}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/products/${prodSlug}`}
                                className="text-xs sm:text-sm font-bold text-neutral-950 dark:text-white truncate block hover:underline"
                              >
                                {item.productTitle}
                              </Link>
                              <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                {item.size && (
                                  <span>
                                    {isBn ? "সাইজ:" : "Size:"}{" "}
                                    <strong className="text-neutral-700 dark:text-neutral-300">
                                      {item.size}
                                    </strong>
                                  </span>
                                )}
                                {item.color && (
                                  <>
                                    <span>•</span>
                                    <span>{item.color}</span>
                                  </>
                                )}
                                <span>•</span>
                                <span>
                                  {isBn ? "পরিমাণ:" : "Qty:"}{" "}
                                  <strong>
                                    {isBn ? toBengaliDigits(item.quantity) : item.quantity}
                                  </strong>
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0 font-bold text-xs sm:text-sm text-neutral-900 dark:text-white">
                              {formatPrice(item.totalPrice || item.unitPrice * item.quantity)}
                            </div>
                          </div>
                        );
                      })}

                      {order.items && order.items.length > 3 && (
                        <p className="text-xs font-semibold text-neutral-500">
                          {isBn
                            ? `+ আরও ${toBengaliDigits(order.items.length - 3)} টি আইটেম`
                            : `+ ${order.items.length - 3} more items`}
                        </p>
                      )}
                    </div>

                    {/* Order Total & Actions (md:col-span-4) */}
                    <div className="md:col-span-4 flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-neutral-100 dark:border-neutral-800 pt-3 md:pt-0 md:pl-5 space-y-3">
                      <div>
                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block md:text-right">
                          {isBn ? "মোট পরিশোধিত/বাকি:" : "Total Amount"}
                        </span>
                        <span className="text-lg sm:text-xl font-black text-neutral-950 dark:text-white md:text-right block">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 transition-all shadow-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>{isBn ? "বিস্তারিত" : "View Details"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          title={isBn ? "পুনরায় ব্যাগে যোগ করুন" : "Re-order items"}
                          className={cn(
                            "inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition-colors",
                            reorderSuccessId === order.id
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border-neutral-200 dark:border-neutral-700"
                          )}
                        >
                          {reorderSuccessId === order.id ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>{isBn ? "যোগ হয়েছে!" : "Added!"}</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span>{isBn ? "পুনরায় অর্ডার" : "Reorder"}</span>
                            </>
                          )}
                        </button>

                        {isPending && (
                          <button
                            type="button"
                            onClick={() => setCancelModalOrder(order)}
                            className="inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 transition-colors"
                          >
                            <span>{isBn ? "বাতিল" : "Cancel"}</span>
                          </button>
                        )}

                        {isPaymentPending && (
                          <button
                            type="button"
                            onClick={() => handlePayNow(order)}
                            disabled={isCreatingSession}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-xs"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            <span>{isBn ? "পেমেন্ট করুন" : "Pay Now"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Pagination ── */}
        {ordersData.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: ordersData.totalPages }).map((_, idx) => {
              const p = idx + 1;
              const isActive = currentPage === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all",
                    isActive
                      ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md"
                      : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  )}
                >
                  {isBn ? toBengaliDigits(p) : p}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= ordersData.totalPages}
              onClick={() => setCurrentPage((p) => Math.min(ordersData.totalPages, p + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── Order Details Modal ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {isBn ? "অর্ডার বিবরণী" : "Order Overview"}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-neutral-950 dark:text-white font-mono mt-0.5">
                  #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Status & Delivery Zone */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-neutral-400 block">{isBn ? "স্ট্যাটাস" : "Status"}</span>
                <span className="font-bold text-neutral-900 dark:text-white">
                  {getStatusBadge(selectedOrder.status).label}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">{isBn ? "পেমেন্ট" : "Payment"}</span>
                <span className="font-bold text-neutral-900 dark:text-white">
                  {selectedOrder.paymentMethod} (
                  {getPaymentStatusBadge(selectedOrder.paymentStatus).label})
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">{isBn ? "ডেলিভারি জোন" : "Zone"}</span>
                <span className="font-bold text-neutral-900 dark:text-white">
                  {selectedOrder.shippingZone?.name || selectedOrder.shippingAddress?.city}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">
                  {isBn ? "আনুমানিক সময়" : "Est. Delivery"}
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedOrder.shippingZone?.estimatedDeliveryDays ||
                    (isBn ? "২-৩ কার্যদিবস" : "2-3 Days")}
                </span>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-neutral-900 dark:text-white" />
                <span>{isBn ? "ডেলিভারি ঠিকানা" : "Delivery Address"}</span>
              </h4>
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                <p className="font-bold text-neutral-950 dark:text-white">
                  {selectedOrder.shippingAddress?.fullName} • {selectedOrder.shippingAddress?.phone}
                </p>
                <p>
                  {selectedOrder.shippingAddress?.addressLine1}
                  {selectedOrder.shippingAddress?.addressLine2
                    ? `, ${selectedOrder.shippingAddress.addressLine2}`
                    : ""}
                </p>
                <p>
                  {selectedOrder.shippingAddress?.city},{" "}
                  {selectedOrder.shippingAddress?.postalCode} -{" "}
                  {selectedOrder.shippingAddress?.country || "Bangladesh"}
                </p>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-neutral-900 dark:text-white" />
                <span>{isBn ? "আইটেমসমূহ" : "Order Items"}</span>
              </h4>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden p-2">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={item.id || idx} className="p-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-neutral-950 dark:text-white block truncate">
                        {item.productTitle}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {item.size ? `${item.size}` : ""} {item.color ? `• ${item.color}` : ""} • Qty:{" "}
                        {item.quantity} × {formatPrice(item.unitPrice)}
                      </span>
                    </div>
                    <span className="font-black text-neutral-950 dark:text-white shrink-0">
                      {formatPrice(item.totalPrice || item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculation summary */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-neutral-500">
                <span>{isBn ? "সাবটোটাল:" : "Subtotal:"}</span>
                <span className="font-bold text-neutral-900 dark:text-white">
                  {formatPrice(selectedOrder.subtotal)}
                </span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>{isBn ? "কুপন ছাড়:" : "Coupon Discount:"}</span>
                  <span>-{formatPrice(selectedOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-500">
                <span>{isBn ? "ডেলিভারি চার্জ:" : "Shipping Cost:"}</span>
                <span className="font-bold text-neutral-900 dark:text-white">
                  {formatPrice(selectedOrder.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700 text-sm font-black text-neutral-950 dark:text-white">
                <span>{isBn ? "সর্বমোট পরিশোধিত/বাকি:" : "Grand Total:"}</span>
                <span>{formatPrice(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                {isBn ? "বন্ধ করুন" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Cancel Order Confirmation Modal ── */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-neutral-950 dark:text-white">
              {isBn ? "অর্ডারটি বাতিল করতে চান?" : "Cancel this Order?"}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {isBn
                ? `আপনি কি নিশ্চিতভাবে অর্ডার #${cancelModalOrder.orderNumber} বাতিল করতে চান? সংরক্ষিত স্টক পুনরায় রিলিজ হবে।`
                : `Are you sure you want to cancel order #${cancelModalOrder.orderNumber}? Reserved inventory will be restored.`}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors"
              >
                {isBn ? "না, ফিরে যান" : "No, Keep Order"}
              </button>
              <button
                type="button"
                onClick={handleCancelConfirm}
                disabled={isCancelling}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md"
              >
                {isCancelling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span>{isBn ? "হ্যাঁ, বাতিল করুন" : "Yes, Cancel"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
