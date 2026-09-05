"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  Tag,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
  Plus,
  MapPin,
  Clock,
  Sparkles,
  Lock,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency, useTranslation, toBengaliDigits } from "@/lib/i18n";
import { useGetAddressesQuery, useCreateAddressMutation, Address } from "@/redux/api/addressApi";
import { useValidateCouponMutation, CouponValidationResult } from "@/redux/api/couponApi";
import { useCalculateShippingMutation, useGetPublicShippingZonesQuery } from "@/redux/api/shippingApi";
import { useCheckoutMutation, PaymentMethod } from "@/redux/api/orderApi";
import { useCreateCheckoutSessionMutation } from "@/redux/api/paymentApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CheckoutView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isBn, t } = useTranslation();
  const { formatPrice, currency } = useCurrency();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { items, subtotal: cartSubtotal, clearCart } = useCart();
  const { clearPurchasedItems } = useWishlist();

  // ── 1. Address State ──
  const { data: addressesData, isLoading: isAddressesLoading } = useGetAddressesQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [createAddress, { isLoading: isCreatingAddress }] = useCreateAddressMutation();

  const savedAddresses: Address[] = useMemo(() => {
    if (!addressesData?.data) return [];
    return Array.isArray(addressesData.data) ? addressesData.data : [];
  }, [addressesData]);

  const defaultAddress = useMemo(() => {
    return savedAddresses.find((a) => a.isDefault) || savedAddresses[0] || null;
  }, [savedAddresses]);

  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [useNewAddress, setUseNewAddress] = useState<boolean>(false);

  // Form Fields for shipping address
  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [postalCode, setPostalCode] = useState("1212");
  const [orderNotes, setOrderNotes] = useState("");
  const [saveAddressToAccount, setSaveAddressToAccount] = useState(true);

  // Sync initial default address selection
  useEffect(() => {
    if (defaultAddress && selectedAddressId === "new" && !useNewAddress) {
      setSelectedAddressId(defaultAddress.id);
      setFullName(defaultAddress.fullName);
      setPhone(defaultAddress.phone);
      setAddressLine1(defaultAddress.addressLine1);
      setCity(defaultAddress.city);
      setPostalCode(defaultAddress.postalCode);
    }
  }, [defaultAddress, selectedAddressId, useNewAddress]);

  // Handle existing address select
  const handleSelectSavedAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setUseNewAddress(false);
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setAddressLine1(addr.addressLine1);
    setCity(addr.city);
    setPostalCode(addr.postalCode);
  };

  // ── 2. Shipping Calculation ──
  const [deliveryType, setDeliveryType] = useState<"STANDARD" | "EXPRESS">("STANDARD");
  const [calculateShipping, { data: shippingRes, isLoading: isShippingCalcLoading }] =
    useCalculateShippingMutation();

  const { data: publicZonesData } = useGetPublicShippingZonesQuery();

  useEffect(() => {
    if (city || postalCode) {
      calculateShipping({
        city,
        postalCode,
        deliveryType,
        cartSubtotal,
      });
    }
  }, [city, postalCode, deliveryType, cartSubtotal, calculateShipping]);

  const shippingCalc = shippingRes?.data;
  const shippingCost = shippingCalc?.shippingCost ?? shippingCalc?.shippingCharge ?? (cartSubtotal >= 2500 ? 0 : 80);

  // ── 3. Coupon State ──
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validateCoupon, { isLoading: isValidatingCoupon }] = useValidateCouponMutation();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setCouponError(null);

    try {
      const res = await validateCoupon({
        code: couponCodeInput.trim(),
        cartSubtotal,
      }).unwrap();

      if (res.data) {
        setAppliedCoupon(res.data);
        setCouponCodeInput("");
      }
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        (isBn ? "কুপন কোডটি সঠিক নয় অথবা মেয়াদোত্তীর্ণ।" : "Invalid or expired promo code.");
      setCouponError(msg);
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const discountAmount = appliedCoupon?.discountAmount || 0;

  // ── 4. Payment Method State ──
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  // ── 5. Order Placement ──
  const [checkoutMutation, { isLoading: isPlacingOrder }] = useCheckoutMutation();
  const [createStripeSession, { isLoading: isCreatingStripeSession }] =
    useCreateCheckoutSessionMutation();

  const [orderSuccessData, setOrderSuccessData] = useState<any | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Calculated Grand Total
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  // Handle Submit Order
  const handlePlaceOrder = async () => {
    setCheckoutError(null);

    if (!isAuthenticated) {
      setCheckoutError(
        isBn
          ? "অর্ডার সম্পন্ন করতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।"
          : "Please sign in to your account to complete your order."
      );
      router.push(`/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }

    if (items.length === 0) {
      setCheckoutError(
        isBn ? "আপনার শপিং ব্যাগ খালি।" : "Your shopping bag is empty."
      );
      return;
    }

    if (!fullName.trim()) {
      setCheckoutError(isBn ? "অনুগ্রহ করে আপনার পুরো নাম দিন।" : "Please provide your full name.");
      return;
    }
    if (!phone.trim()) {
      setCheckoutError(isBn ? "অনুগ্রহ করে ফোন নম্বর প্রদান করুন।" : "Please provide a valid phone number.");
      return;
    }
    if (!addressLine1.trim()) {
      setCheckoutError(isBn ? "অনুগ্রহ করে ডেলিভারি ঠিকানা প্রদান করুন।" : "Please enter your delivery street address.");
      return;
    }

    // If authenticated and user checked "Save address" and used new address, save it
    if (isAuthenticated && (useNewAddress || selectedAddressId === "new") && saveAddressToAccount) {
      try {
        await createAddress({
          fullName,
          phone,
          addressLine1,
          city,
          postalCode,
          country: "Bangladesh",
          type: "SHIPPING",
          isDefault: savedAddresses.length === 0,
        }).unwrap();
      } catch {}
    }

    const payload = {
      shippingAddress: {
        fullName,
        phone,
        addressLine1,
        city,
        postalCode,
        country: "Bangladesh",
      },
      deliveryType,
      couponCode: appliedCoupon?.coupon?.code || (appliedCoupon as any)?.code || undefined,
      paymentMethod,
      notes: orderNotes || undefined,
    };

    try {
      const res = await checkoutMutation(payload).unwrap();
      const placedOrder = res.data;

      if (placedOrder) {
        // Clear purchased items from wishlist and cart
        const purchasedProductIds = items
          .map((i) => i.product?.id || i.product?.slug || i.variant?.id)
          .filter(Boolean) as string[];
        clearPurchasedItems(purchasedProductIds);
        await clearCart();

        // If Stripe payment selected, initiate session & redirect
        if (paymentMethod === "STRIPE") {
          try {
            const stripeRes = await createStripeSession({
              orderId: placedOrder.id,
              successUrl: `${window.location.origin}/checkout?order_success=${placedOrder.orderNumber}`,
              cancelUrl: `${window.location.origin}/checkout?order_cancelled=${placedOrder.orderNumber}`,
            }).unwrap();

            if (stripeRes?.data?.url) {
              window.location.href = stripeRes.data.url;
              return;
            }
          } catch (stripeErr) {
            // Fallback to confirmation screen if gateway fails
          }
        }

        setOrderSuccessData(placedOrder);
      }
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        (isBn
          ? "অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।"
          : "Failed to place order. Please verify your details and try again.");
      setCheckoutError(msg);
    }
  };

  // Check query params for redirected Stripe success
  const orderSuccessParam = searchParams.get("order_success");

  // ── Success Confirmation Screen ──
  if (orderSuccessData || orderSuccessParam) {
    const displayOrderNumber = orderSuccessData?.orderNumber || orderSuccessParam;
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-neutral-50/50 dark:bg-neutral-950/40">
        <div className="max-w-xl w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-center animate-in zoom-in-95 duration-300">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 mb-6 animate-bounce">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <Badge className="bg-emerald-500 text-white font-bold px-3.5 py-1 text-xs mb-3">
            {isBn ? "অর্ডার নিশ্চিত হয়েছে" : "Order Confirmed"}
          </Badge>

          <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight mb-2">
            {isBn ? "ধন্যবাদ! আপনার অর্ডারটি গ্রহণ করা হয়েছে" : "Thank you for your order!"}
          </h1>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            {isBn
              ? "আমরা আপনার অর্ডার প্রস্তুত করছি। দ্রুততম সময়ে আপনার ঠিকানায় ডেলিভারি পৌঁছে দেওয়া হবে।"
              : "We've received your order and are packing your premium streetwear essentials."}
          </p>

          {/* Order Details Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60 text-left mb-6 space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-neutral-500">{isBn ? "অর্ডার আইডি:" : "Order Reference:"}</span>
              <span className="font-extrabold text-neutral-950 dark:text-white font-mono">
                #{displayOrderNumber}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-neutral-500">{isBn ? "পেমেন্ট মাধ্যম:" : "Payment Method:"}</span>
              <span className="font-bold text-neutral-900 dark:text-white uppercase">
                {orderSuccessData?.paymentMethod || paymentMethod}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-neutral-500">{isBn ? "আনুমানিক ডেলিভারি:" : "Estimated Delivery:"}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {deliveryType === "EXPRESS"
                  ? isBn ? "২৪-৪৮ ঘণ্টার মধ্যে" : "Within 24-48 Hours"
                  : isBn ? "২-৩ কার্যদিবস" : "2-3 Business Days"}
              </span>
            </div>

            {orderSuccessData && (
              <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-500">{isBn ? "মোট পরিশোধযোগ্য:" : "Total Amount:"}</span>
                <span className="font-black text-base text-neutral-950 dark:text-white">
                  {formatPrice(Number(orderSuccessData.totalAmount || grandTotal))}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/account"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-5 py-3 font-bold text-sm hover:opacity-90 transition-all shadow-md"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{isBn ? "আমার অর্ডারসমূহ" : "View My Orders"}</span>
            </Link>

            <Link
              href="/shop"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white px-5 py-3 font-bold text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <span>{isBn ? "আরও কেনাকাটা করুন" : "Continue Shopping"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── If Cart is Empty ──
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-neutral-100 dark:bg-neutral-800/80 mb-5">
          <ShoppingBag className="h-10 w-10 text-neutral-400" />
        </div>
        <h2 className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight mb-2">
          {isBn ? "আপনার শপিং ব্যাগ খালি" : "Your Shopping Bag is Empty"}
        </h2>
        <p className="text-sm text-neutral-500 max-w-sm mb-6">
          {isBn
            ? "চেকআউট করতে প্রথমে আপনার পছন্দের পোশাক ও এক্সেসরিজ ব্যাগে যোগ করুন।"
            : "Looks like you haven't added any items to your bag yet. Explore our latest drops and start shopping."}
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-6 py-3 font-bold text-sm hover:opacity-90 transition-all shadow-lg"
        >
          <Sparkles className="h-4 w-4" />
          <span>{isBn ? "নতুন কালেকশন দেখুন" : "Explore New Drops"}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/30 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb & Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-2">
            <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              {isBn ? "হোম" : "Home"}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/shop" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              {isBn ? "শপ" : "Shop"}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-neutral-900 dark:text-white font-bold">{isBn ? "চেকআউট" : "Checkout"}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-950 dark:text-white">
            {isBn ? "নিরাপদ চেকআউট" : "Secure Checkout"}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-emerald-500" />
            <span>{isBn ? "২৫৬-বিট এনক্রিপ্টেড সিকিউর পেমেন্ট" : "256-Bit SSL Encrypted & Protected"}</span>
          </p>
        </div>

        {/* ── Checkout Error Alert ── */}
        {checkoutError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-sm font-semibold">{checkoutError}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ========================================================= */}
          {/* Left Column: Delivery Address & Payment (lg:col-span-7)   */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-8">
            {/* ── Section 1: Customer & Delivery Address ── */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-black text-sm">
                    1
                  </div>
                  <h2 className="text-lg font-bold text-neutral-950 dark:text-white">
                    {isBn ? "ডেলিভারি ঠিকানা" : "Delivery Address"}
                  </h2>
                </div>

                {!isAuthenticated && (
                  <Link
                    href="/login"
                    className="text-xs font-bold text-rose-500 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{isBn ? "লগইন করুন" : "Sign In"}</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                )}
              </div>

              {/* Saved Addresses Selector for Authenticated Users */}
              {isAuthenticated && savedAddresses.length > 0 && (
                <div className="mb-6 space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                    {isBn ? "সংরক্ষিত ঠিকানা নির্বাচন করুন:" : "Saved Addresses:"}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id && !useNewAddress;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={cn(
                            "cursor-pointer p-3.5 rounded-2xl border transition-all relative text-left",
                            isSelected
                              ? "border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-800/80 shadow-xs ring-1 ring-neutral-950 dark:ring-white"
                              : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 bg-white dark:bg-neutral-900"
                          )}
                        >
                          {addr.isDefault && (
                            <Badge className="absolute top-2.5 right-2.5 text-[10px] bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold px-1.5 py-0.2">
                              {isBn ? "ডিফল্ট" : "Default"}
                            </Badge>
                          )}
                          <div className="text-xs font-extrabold text-neutral-950 dark:text-white truncate">
                            {addr.fullName}
                          </div>
                          <div className="text-[11px] text-neutral-500 mt-0.5">{addr.phone}</div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-300 mt-1.5 line-clamp-2">
                            {addr.addressLine1}, {addr.city} - {addr.postalCode}
                          </div>
                        </div>
                      );
                    })}

                    {/* New Address Option Button */}
                    <div
                      onClick={() => {
                        setUseNewAddress(true);
                        setSelectedAddressId("new");
                        setFullName(user?.name || "");
                        setPhone(user?.phone || "");
                        setAddressLine1("");
                      }}
                      className={cn(
                        "cursor-pointer p-3.5 rounded-2xl border border-dashed flex flex-col items-center justify-center gap-1.5 text-center transition-all",
                        useNewAddress || selectedAddressId === "new"
                          ? "border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-800/80 ring-1 ring-neutral-950 dark:ring-white"
                          : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 bg-transparent text-neutral-500"
                      )}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {isBn ? "নতুন ঠিকানা যোগ করুন" : "Add New Address"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Address Input Form */}
              {(useNewAddress || selectedAddressId === "new" || savedAddresses.length === 0) && (
                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                        {isBn ? "পূর্ণ নাম *" : "Full Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Mir Noman"
                        className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                        {isBn ? "মোবাইল নম্বর *" : "Phone Number *"}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01700000000"
                        className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                      {isBn ? "ঠিকানা (রোড, বাড়ি, ফ্ল্যাট নং) *" : "Street Address (House, Road, Area) *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder={isBn ? "হাউজ ১২, রোড ৫, ধানমন্ডি" : "House 12, Road 5, Dhanmondi"}
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                        {isBn ? "শহর / জেলা *" : "City / District *"}
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-white"
                      >
                        <option value="Dhaka">Dhaka (ঢাকা)</option>
                        <option value="Chattogram">Chattogram (চট্টগ্রাম)</option>
                        <option value="Sylhet">Sylhet (সিলেট)</option>
                        <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                        <option value="Khulna">Khulna (খুলনা)</option>
                        <option value="Barishal">Barishal (বরিশাল)</option>
                        <option value="Rangpur">Rangpur (রংপুর)</option>
                        <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
                        <option value="Gazipur">Gazipur (গাজীপুর)</option>
                        <option value="Narayanganj">Narayanganj (নারায়ণগঞ্জ)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                        {isBn ? "পোস্টাল কোড *" : "Postal Code *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="1212"
                        className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-white"
                      />
                    </div>
                  </div>

                  {isAuthenticated && (
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={saveAddressToAccount}
                        onChange={(e) => setSaveAddressToAccount(e.target.checked)}
                        className="h-4 w-4 rounded text-neutral-950 focus:ring-neutral-950"
                      />
                      <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                        {isBn ? "ভবিষ্যতের কেনাকাটার জন্য এই ঠিকানা সংরক্ষণ করুন" : "Save this address for future orders"}
                      </span>
                    </label>
                  )}
                </div>
              )}

              {/* Order Delivery Notes */}
              <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
                  {isBn ? "অর্ডার নোট / বিশেষ নির্দেশনা (ঐচ্ছিক)" : "Order Notes & Instructions (Optional)"}
                </label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder={isBn ? "ডেলিভারির আগে ফোন দেওয়ার অনুরোধ..." : "Special delivery notes or gate instructions..."}
                  className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-white resize-none"
                />
              </div>
            </div>

            {/* ── Section 2: Delivery Speed Option ── */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-black text-sm">
                  2
                </div>
                <h2 className="text-lg font-bold text-neutral-950 dark:text-white">
                  {isBn ? "ডেলিভারি পদ্ধতি" : "Delivery Speed"}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Standard Delivery */}
                <div
                  onClick={() => setDeliveryType("STANDARD")}
                  className={cn(
                    "cursor-pointer p-4 rounded-2xl border transition-all relative flex flex-col justify-between",
                    deliveryType === "STANDARD"
                      ? "border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-800/80 ring-1 ring-neutral-950 dark:ring-white shadow-xs"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 bg-white dark:bg-neutral-900"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-extrabold text-neutral-950 dark:text-white">
                        {isBn ? "স্ট্যান্ডার্ড ডেলিভারি" : "Standard Delivery"}
                      </span>
                      <span className="text-xs font-black text-neutral-900 dark:text-white">
                        {shippingCalc?.deliveryOptions?.standard?.isFree || cartSubtotal >= 2500 ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[11px]">
                            {isBn ? "ফ্রি" : "FREE"}
                          </span>
                        ) : (
                          formatPrice(shippingCalc?.deliveryOptions?.standard?.finalRate ?? 80)
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      {isBn ? "২-৩ কার্যদিবসের মধ্যে ডেলিভারি" : "2-3 business days doorstep delivery"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 mt-3">
                    <Truck className="h-3.5 w-3.5 text-neutral-500" />
                    <span>{isBn ? "নরমাল কুরিয়ার ট্র্যাকিং" : "Standard Courier Shipping"}</span>
                  </div>
                </div>

                {/* Express Delivery */}
                <div
                  onClick={() => setDeliveryType("EXPRESS")}
                  className={cn(
                    "cursor-pointer p-4 rounded-2xl border transition-all relative flex flex-col justify-between",
                    deliveryType === "EXPRESS"
                      ? "border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-800/80 ring-1 ring-neutral-950 dark:ring-white shadow-xs"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 bg-white dark:bg-neutral-900"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-extrabold text-neutral-950 dark:text-white">
                          {isBn ? "এক্সপ্রেস ডেলিভারি" : "Express Delivery"}
                        </span>
                        <Badge className="bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0">
                          {isBn ? "দ্রুত" : "FAST"}
                        </Badge>
                      </div>
                      <span className="text-xs font-black text-neutral-900 dark:text-white">
                        {formatPrice(shippingCalc?.deliveryOptions?.express?.finalRate ?? 150)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      {isBn ? "২৪-৪৮ ঘণ্টার মধ্যে সুপারফাস্ট ডেলিভারি" : "Next Day / Priority 24-48h dispatch"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-500 mt-3">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{isBn ? "অগ্রাধিকার ডেলিভারি" : "Priority Handling"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 3: Payment Method ── */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-black text-sm">
                  3
                </div>
                <h2 className="text-lg font-bold text-neutral-950 dark:text-white">
                  {isBn ? "পেমেন্ট মাধ্যম" : "Payment Method"}
                </h2>
              </div>

              <div className="space-y-3">
                {/* Cash On Delivery (COD) */}
                <div
                  onClick={() => setPaymentMethod("COD")}
                  className={cn(
                    "cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between",
                    paymentMethod === "COD"
                      ? "border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-800/80 ring-1 ring-neutral-950 dark:ring-white shadow-xs"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 bg-white dark:bg-neutral-900"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
                      <Banknote className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-neutral-950 dark:text-white">
                        {isBn ? "ক্যাশ অন ডেলিভারি (COD)" : "Cash On Delivery (COD)"}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {isBn ? "পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন" : "Pay in cash upon delivery at your door"}
                      </div>
                    </div>
                  </div>
                  <div className="h-4 w-4 rounded-full border-2 flex items-center justify-center border-neutral-950 dark:border-white">
                    {paymentMethod === "COD" && <div className="h-2 w-2 rounded-full bg-neutral-950 dark:bg-white" />}
                  </div>
                </div>

                {/* bKash / Mobile Wallet */}
                <div
                  onClick={() => setPaymentMethod("BKASH")}
                  className={cn(
                    "cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between",
                    paymentMethod === "BKASH"
                      ? "border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-800/80 ring-1 ring-neutral-950 dark:ring-white shadow-xs"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 bg-white dark:bg-neutral-900"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800/80">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-neutral-950 dark:text-white">
                        {isBn ? "বিকাশ / নগদ / মোবাইল ব্যাংকিং" : "bKash / Nagad / Mobile Banking"}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {isBn ? "মোবাইল ওয়ালেটের মাধ্যমে তাত্ক্ষণিক পেমেন্ট" : "Instant mobile wallet payment gateway"}
                      </div>
                    </div>
                  </div>
                  <div className="h-4 w-4 rounded-full border-2 flex items-center justify-center border-neutral-950 dark:border-white">
                    {paymentMethod === "BKASH" && <div className="h-2 w-2 rounded-full bg-neutral-950 dark:bg-white" />}
                  </div>
                </div>

                {/* Credit / Debit Card & Stripe */}
                <div
                  onClick={() => setPaymentMethod("STRIPE")}
                  className={cn(
                    "cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between",
                    paymentMethod === "STRIPE"
                      ? "border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-800/80 ring-1 ring-neutral-950 dark:ring-white shadow-xs"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 bg-white dark:bg-neutral-900"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-neutral-950 dark:text-white">
                        {isBn ? "ক্রেডিট / ডেবিট কার্ড (Stripe Gateway)" : "Credit / Debit Card (Stripe Gateway)"}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {isBn ? "ভিসা, মাস্টারকার্ড, অ্যামেক্স ও আন্তর্জাতিক কার্ড" : "Visa, Mastercard, Amex & Global Cards"}
                      </div>
                    </div>
                  </div>
                  <div className="h-4 w-4 rounded-full border-2 flex items-center justify-center border-neutral-950 dark:border-white">
                    {paymentMethod === "STRIPE" && <div className="h-2 w-2 rounded-full bg-neutral-950 dark:bg-white" />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Right Column: Order Summary & Promo Code (lg:col-span-5)  */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-neutral-950 dark:text-white mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span>{isBn ? "অর্ডার সারাংশ" : "Order Summary"}</span>
                <span className="text-xs font-semibold text-neutral-500">
                  {isBn ? toBengaliDigits(items.length) : items.length} {isBn ? "টি আইটেম" : "item(s)"}
                </span>
              </h2>

              {/* Items List */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-neutral-100 dark:divide-neutral-800/80 mb-6">
                {items.map((item) => {
                  const itemImg =
                    item.variant?.imageUrl ||
                    (typeof item.product?.primaryImage === "object" && item.product?.primaryImage?.url
                      ? item.product.primaryImage.url
                      : typeof item.product?.primaryImage === "string"
                      ? item.product.primaryImage
                      : "");

                  return (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200 dark:border-neutral-800">
                        {itemImg ? (
                          <Image
                            src={itemImg}
                            alt={item.product.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-neutral-400">
                            ZEVON
                          </div>
                        )}
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-white text-[9px] font-black">
                          {item.quantity}
                        </span>
                      </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {item.variant.color} • {item.variant.size}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-neutral-950 dark:text-white">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                );
              })}
              </div>

              {/* ── Coupon Code Box ── */}
              <div className="mb-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-rose-500" />
                  <span>{isBn ? "প্রোমো কোড / ডিসকাউন্ট কুপন" : "Promo Code / Voucher"}</span>
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      <div>
                        <div className="text-xs font-extrabold uppercase tracking-wide">
                          {appliedCoupon.coupon?.code || (appliedCoupon as any).code}
                        </div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                          {appliedCoupon.savingsMessage || (isBn ? "কুপন কার্যকর হয়েছে" : "Coupon applied successfully")}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="p-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 transition-colors"
                      aria-label="Remove Coupon"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => {
                        setCouponCodeInput(e.target.value.toUpperCase());
                        setCouponError(null);
                      }}
                      placeholder={isBn ? "কুপন কোড (যেমন: ZEVON10)" : "Promo code (e.g. ZEVON10)"}
                      className="flex-1 h-10 px-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50 text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-white"
                    />
                    <Button
                      type="submit"
                      disabled={!couponCodeInput.trim() || isValidatingCoupon}
                      className="h-10 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold hover:opacity-90 transition-all shrink-0"
                    >
                      {isValidatingCoupon ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : isBn ? "প্রয়োগ" : "Apply"}
                    </Button>
                  </form>
                )}

                {couponError && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{couponError}</span>
                  </p>
                )}
              </div>

              {/* ── Bill Breakdown ── */}
              <div className="space-y-2.5 text-xs pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400 font-medium">
                  <span>{isBn ? "সাবটোটাল" : "Subtotal"}</span>
                  <span className="font-bold text-neutral-950 dark:text-white">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>{isBn ? "কুপন ডিসকাউন্ট" : "Coupon Discount"}</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600 dark:text-neutral-400 font-medium">
                  <span>{isBn ? "ডেলিভারি চার্জ" : "Shipping & Delivery"}</span>
                  <span className="font-bold text-neutral-950 dark:text-white">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 uppercase font-bold text-[11px]">
                        {isBn ? "ফ্রি" : "FREE"}
                      </span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline text-sm pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="font-extrabold text-neutral-950 dark:text-white">
                    {isBn ? "সর্বমোট প্রদেয়" : "Grand Total"}
                  </span>
                  <div className="text-right">
                    <span className="text-lg font-black text-neutral-950 dark:text-white tracking-tight">
                      {formatPrice(grandTotal)}
                    </span>
                    <span className="text-[10px] text-neutral-400 block font-medium">
                      {isBn ? "ভ্যাট ও ট্যাক্স সহ" : "Includes all taxes"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Submit Order Button ── */}
              <Button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || isCreatingStripeSession}
                className="w-full mt-6 h-12 rounded-2xl bg-neutral-950 hover:bg-neutral-900 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-black text-sm tracking-wide shadow-xl transition-all"
              >
                {isPlacingOrder || isCreatingStripeSession ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{isBn ? "অর্ডার প্রসেস হচ্ছে..." : "Processing Order..."}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>{isBn ? "অর্ডার নিশ্চিত করুন" : "Place Order"}</span>
                    <span>•</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                )}
              </Button>

              {/* Trust Badges */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-center text-[10px] font-semibold text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                <div className="flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{isBn ? "১০০% নিরাপদ" : "100% Secure"}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-neutral-500" />
                  <span>{isBn ? "৭ দিনের রিটার্ন" : "7-Day Easy Return"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
