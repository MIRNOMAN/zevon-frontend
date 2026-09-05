"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Check,
  CheckCircle2,
  Shield,
  Lock,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  ShoppingBag,
  Heart,
  Loader2,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  Home,
  Building,
  Camera,
  UploadCloud,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser, selectIsAuthenticated } from "@/redux/features/authSlice";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useChangePasswordMutation,
} from "@/redux/api/userApi";
import { getAvatarUrl } from "@/lib/avatar";
import {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation,
  Address,
  CreateAddressInput,
} from "@/redux/api/addressApi";
import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import { useWishlist } from "@/context/WishlistContext";
import { useTranslation, toBengaliDigits } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Gift, RotateCcw } from "lucide-react";
import { ReferralTab } from "./ReferralTab";
import { ReturnsTab } from "./ReturnsTab";

type ActiveTab = "addresses" | "profile" | "security" | "referrals" | "returns";

export function AccountView() {
  const { t, isBn } = useTranslation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authUser = useAppSelector(selectCurrentUser);
  const { wishlistCount } = useWishlist();

  const [activeTab, setActiveTab] = useState<ActiveTab>("addresses");
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Profile API
  const { data: profileRes, isLoading: isProfileLoading, refetch: refetchProfile } =
    useGetProfileQuery(undefined, { skip: !isAuthenticated });
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  // Avatar Upload States
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const profileTabFileInputRef = useRef<HTMLInputElement>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null);

  // Addresses API
  const { data: addressesRes, isLoading: isAddressesLoading, refetch: refetchAddresses } =
    useGetAddressesQuery(undefined, { skip: !isAuthenticated });
  const [createAddress, { isLoading: isCreatingAddress }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdatingAddress }] = useUpdateAddressMutation();
  const [setDefaultAddress, { isLoading: isSettingDefault }] = useSetDefaultAddressMutation();
  const [deleteAddress, { isLoading: isDeletingAddress }] = useDeleteAddressMutation();

  // Orders count
  const { data: ordersRes } = useGetMyOrdersQuery(
    { page: 1, limit: 1 },
    { skip: !isAuthenticated }
  );

  const totalOrdersCount = useMemo(() => {
    if (!ordersRes?.data) return 0;
    if (Array.isArray(ordersRes.data)) return ordersRes.data.length;
    return (ordersRes.data as any).meta?.total ?? (ordersRes.data as any).total ?? 0;
  }, [ordersRes]);

  const user = profileRes?.data || authUser;
  const addresses: Address[] = addressesRes?.data || [];
  const avatarUrl = getAvatarUrl(user?.avatarUrl);

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset inputs
    e.target.value = "";
    setAvatarError(null);
    setAvatarSuccess(null);

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError(
        isBn
          ? "ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারে।"
          : "Avatar image size must not exceed 5MB."
      );
      return;
    }

    // Validate type
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp|gif)$/i)) {
      setAvatarError(
        isBn
          ? "শুধুমাত্র JPG, PNG, WebP বা GIF ছবি সমর্থন করে।"
          : "Only JPG, PNG, WebP, and GIF images are supported."
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadAvatar(formData).unwrap();
      refetchProfile();
      setAvatarSuccess(
        isBn ? "প্রোফাইল ছবি সফলভাবে পরিবর্তন হয়েছে!" : "Profile photo updated successfully!"
      );
      setTimeout(() => setAvatarSuccess(null), 3500);
    } catch (err: any) {
      setAvatarError(
        err?.data?.message ||
          (isBn ? "প্রোফাইল ছবি আপলোড করতে সমস্যা হয়েছে।" : "Failed to upload profile photo.")
      );
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatarError(null);
    setAvatarSuccess(null);
    try {
      await updateProfile({ avatarUrl: "" }).unwrap();
      refetchProfile();
      setAvatarSuccess(
        isBn ? "প্রোফাইল ছবি সফলভাবে মুছে ফেলা হয়েছে।" : "Profile photo removed."
      );
      setTimeout(() => setAvatarSuccess(null), 3500);
    } catch (err: any) {
      setAvatarError(
        err?.data?.message ||
          (isBn ? "ছবি মুছতে সমস্যা হয়েছে।" : "Failed to remove profile photo.")
      );
    }
  };

  // ── Profile Edit Form State ──
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Sync profile fields when data loads
  React.useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg(null);
    setProfileErrorMsg(null);

    if (!name.trim()) {
      setProfileErrorMsg(isBn ? "অনুগ্রহ করে আপনার নাম প্রদান করুন।" : "Name is required.");
      return;
    }

    try {
      await updateProfile({ name: name.trim(), phone: phone.trim() || undefined }).unwrap();
      setProfileSuccessMsg(
        isBn ? "প্রোফাইল সফলভাবে আপডেট হয়েছে!" : "Profile updated successfully!"
      );
      setTimeout(() => setProfileSuccessMsg(null), 3000);
    } catch (err: any) {
      setProfileErrorMsg(
        err?.data?.message || (isBn ? "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।" : "Failed to update profile.")
      );
    }
  };

  // ── Password Change Form State ──
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccessMsg(null);
    setPasswordErrorMsg(null);

    if (!currentPassword) {
      setPasswordErrorMsg(isBn ? "বর্তমান পাসওয়ার্ড প্রয়োজন।" : "Current password is required.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordErrorMsg(
        isBn
          ? "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।"
          : "New password must be at least 6 characters."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg(
        isBn ? "নতুন পাসওয়ার্ডের দুটি ফিল্ড মিলছে না।" : "Passwords do not match."
      );
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      setPasswordSuccessMsg(
        isBn ? "পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!" : "Password changed successfully!"
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccessMsg(null), 3500);
    } catch (err: any) {
      setPasswordErrorMsg(
        err?.data?.message || (isBn ? "পাসওয়ার্ড পরিবর্তনে সমস্যা হয়েছে।" : "Failed to change password.")
      );
    }
  };

  // ── Address Modal State ──
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteModalAddress, setDeleteModalAddress] = useState<Address | null>(null);

  // Address Form fields
  const [addrFullName, setAddrFullName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrLine1, setAddrLine1] = useState("");
  const [addrLine2, setAddrLine2] = useState("");
  const [addrCity, setAddrCity] = useState("Dhaka");
  const [addrPostalCode, setAddrPostalCode] = useState("1212");
  const [addrType, setAddrType] = useState<"SHIPPING" | "BILLING">("SHIPPING");
  const [addrIsDefault, setAddrIsDefault] = useState(false);
  const [addrError, setAddrError] = useState<string | null>(null);

  const openCreateAddressModal = () => {
    setEditingAddress(null);
    setAddrFullName(user?.name || "");
    setAddrPhone(user?.phone || "");
    setAddrLine1("");
    setAddrLine2("");
    setAddrCity("Dhaka");
    setAddrPostalCode("1212");
    setAddrType("SHIPPING");
    setAddrIsDefault(addresses.length === 0);
    setAddrError(null);
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (addr: Address) => {
    setEditingAddress(addr);
    setAddrFullName(addr.fullName);
    setAddrPhone(addr.phone);
    setAddrLine1(addr.addressLine1);
    setAddrLine2(addr.addressLine2 || "");
    setAddrCity(addr.city);
    setAddrPostalCode(addr.postalCode);
    setAddrType(addr.type);
    setAddrIsDefault(addr.isDefault);
    setAddrError(null);
    setIsAddressModalOpen(true);
  };

  const handleAddressFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddrError(null);

    if (!addrFullName.trim() || !addrPhone.trim() || !addrLine1.trim() || !addrCity.trim()) {
      setAddrError(isBn ? "অনুগ্রহ করে সব আবশ্যক তথ্য পূরণ করুন।" : "Please fill in all required fields.");
      return;
    }

    const payload: CreateAddressInput = {
      fullName: addrFullName.trim(),
      phone: addrPhone.trim(),
      addressLine1: addrLine1.trim(),
      addressLine2: addrLine2.trim() || undefined,
      city: addrCity.trim(),
      postalCode: addrPostalCode.trim() || "1212",
      country: "Bangladesh",
      type: addrType,
      isDefault: addrIsDefault,
    };

    try {
      if (editingAddress) {
        await updateAddress({ id: editingAddress.id, ...payload }).unwrap();
      } else {
        await createAddress(payload).unwrap();
      }
      setIsAddressModalOpen(false);
      refetchAddresses();
    } catch (err: any) {
      setAddrError(
        err?.data?.message || (isBn ? "ঠিকানা সংরক্ষণ করতে সমস্যা হয়েছে।" : "Failed to save address.")
      );
    }
  };

  const handleDeleteAddressConfirm = async () => {
    if (!deleteModalAddress) return;
    try {
      await deleteAddress(deleteModalAddress.id).unwrap();
      setDeleteModalAddress(null);
      refetchAddresses();
    } catch {}
  };

  const handleSetDefault = async (addrId: string) => {
    try {
      await setDefaultAddress(addrId).unwrap();
      refetchAddresses();
    } catch {}
  };

  const handleCopyReferral = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    }
  };

  // ── Unauthenticated State ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-background">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-neutral-100 dark:bg-neutral-800 mb-6 shadow-inner">
          <UserIcon className="h-10 w-10 text-neutral-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight mb-2">
          {isBn ? "অ্যাকাউন্ট দেখতে লগইন করুন" : "Sign In to Your Account"}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mb-8 leading-relaxed">
          {isBn
            ? "আপনার সেভ করা ডেলিভারি ঠিকানা, প্রোফাইল তথ্য ও অর্ডার হিস্ট্রি পরিচালনা করতে সাইন ইন করুন।"
            : "Manage your saved delivery addresses, profile details, and account security settings."}
        </p>
        <Link
          href="/login?redirect=/account"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-6 py-3.5 text-xs font-bold tracking-wide hover:opacity-90 transition-all shadow-md"
        >
          <span>{isBn ? "লগইন করুন" : "Sign In to Account"}</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const initial = (user?.name || "Customer").charAt(0).toUpperCase();

  return (
    <div className="min-h-[80vh] bg-background py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb ── */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          <Link
            href="/"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {t("nav.home", "Home")}
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white">
            {isBn ? "অ্যাকাউন্ট ও ঠিকানা" : "Account & Addresses"}
          </span>
        </nav>

        {/* ── Profile Header Card ── */}
        <div className="rounded-3xl bg-linear-to-br from-neutral-900 to-neutral-950 text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-8">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative group shrink-0">
                <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-white text-neutral-950 text-2xl sm:text-3xl font-black uppercase shadow-lg ring-4 ring-white/10 overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name || "User Avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{initial}</span>
                  )}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white backdrop-blur-xs">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => bannerFileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  title={isBn ? "প্রোফাইল ছবি পরিবর্তন করুন" : "Change Profile Photo"}
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-neutral-950 shadow-md hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all ring-2 ring-neutral-950 cursor-pointer disabled:opacity-50"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
                <input
                  ref={bannerFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleAvatarFileSelect}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight truncate">
                    {user?.name || "Customer"}
                  </h1>
                  {user?.role && user.role !== "CUSTOMER" && (
                    <Badge className="bg-amber-400 text-neutral-950 font-bold text-[10px] px-2">
                      {user.role}
                    </Badge>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 truncate mt-0.5">
                  {user?.email}
                </p>
                {user?.phone && (
                  <p className="text-xs text-neutral-400 mt-0.5">{user.phone}</p>
                )}
              </div>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/orders"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 text-xs font-bold transition-colors"
              >
                <ShoppingBag className="h-4 w-4 text-emerald-400" />
                <span>
                  {isBn ? "অর্ডার" : "Orders"}:{" "}
                  <strong>
                    {isBn ? toBengaliDigits(totalOrdersCount) : totalOrdersCount}
                  </strong>
                </span>
              </Link>

              <Link
                href="/account/wishlist"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 text-xs font-bold transition-colors"
              >
                <Heart className="h-4 w-4 text-rose-400 fill-rose-400" />
                <span>
                  {isBn ? "উইশলিস্ট" : "Wishlist"}:{" "}
                  <strong>
                    {isBn ? toBengaliDigits(wishlistCount) : wishlistCount}
                  </strong>
                </span>
              </Link>

              {user?.referralCode && (
                <button
                  type="button"
                  onClick={handleCopyReferral}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 text-xs font-bold transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>{user.referralCode}</span>
                  {copiedReferral ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-neutral-400" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-8 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("addresses")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0",
              activeTab === "addresses"
                ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md"
                : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
            )}
          >
            <MapPin className="h-4 w-4" />
            <span>{isBn ? "ডেলিভারি ঠিকানা" : "Saved Addresses"}</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-[11px]">
              {isBn ? toBengaliDigits(addresses.length) : addresses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0",
              activeTab === "profile"
                ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md"
                : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
            )}
          >
            <UserIcon className="h-4 w-4" />
            <span>{isBn ? "প্রোফাইল তথ্য" : "Profile Details"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("referrals")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0",
              activeTab === "referrals"
                ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md"
                : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
            )}
          >
            <Gift className="h-4 w-4 text-amber-500" />
            <span>{isBn ? "রেফারেল ও রিওয়ার্ড" : "Referrals (৳500)"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("returns")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0",
              activeTab === "returns"
                ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md"
                : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
            )}
          >
            <RotateCcw className="h-4 w-4" />
            <span>{isBn ? "রিটার্ন ও এক্সচেঞ্জ" : "Returns & Exchanges"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0",
              activeTab === "security"
                ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md"
                : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
            )}
          >
            <Lock className="h-4 w-4" />
            <span>{isBn ? "নিরাপত্তা ও পাসওয়ার্ড" : "Security & Password"}</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: SAVED ADDRESSES                                    */}
        {/* ========================================================= */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-neutral-950 dark:text-white">
                  {isBn ? "সংরক্ষিত ঠিকানা তালিকা" : "Manage Delivery Addresses"}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {isBn
                    ? "চেকআউটে দ্রুত অর্ডারের জন্য আপনার শিপিং ঠিকানা যোগ বা আপডেট করুন।"
                    : "Add and manage addresses for quick 1-click checkout and deliveries."}
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateAddressModal}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold hover:opacity-90 transition-all shadow-md self-start sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                <span>{isBn ? "নতুন ঠিকানা যোগ করুন" : "Add New Address"}</span>
              </button>
            </div>

            {isAddressesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-44 rounded-3xl bg-neutral-100 dark:bg-neutral-900 p-5 animate-pulse border border-neutral-200/60 dark:border-neutral-800"
                  />
                ))}
              </div>
            ) : addresses.length === 0 ? (
              <div className="py-16 text-center space-y-4 max-w-md mx-auto rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 p-8">
                <div className="h-16 w-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mx-auto">
                  <MapPin className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                  {isBn ? "কোনো ঠিকানা পাওয়া যায়নি" : "No Saved Addresses"}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {isBn
                    ? "সহজে চেকআউট করতে আপনার বর্তমান ঠিকানা যোগ করুন।"
                    : "Add your shipping address so you can checkout in seconds."}
                </p>
                <button
                  type="button"
                  onClick={openCreateAddressModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold hover:opacity-90 transition-all shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isBn ? "প্রথম ঠিকানা যোগ করুন" : "Add Your First Address"}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={cn(
                      "rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between relative",
                      addr.isDefault
                        ? "bg-white dark:bg-neutral-900 border-neutral-950 dark:border-white shadow-md ring-1 ring-black/5"
                        : "bg-white dark:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-neutral-300"
                    )}
                  >
                    <div>
                      {/* Top labels */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5">
                          {addr.type === "SHIPPING" ? (
                            <Home className="h-3.5 w-3.5 text-neutral-500" />
                          ) : (
                            <Building className="h-3.5 w-3.5 text-neutral-500" />
                          )}
                          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400">
                            {addr.type}
                          </span>
                        </div>

                        {addr.isDefault && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                            <Check className="h-3 w-3" />
                            <span>{isBn ? "ডিফল্ট ঠিকানা" : "Default"}</span>
                          </span>
                        )}
                      </div>

                      {/* Recipient & Phone */}
                      <h3 className="text-sm sm:text-base font-bold text-neutral-950 dark:text-white">
                        {addr.fullName}
                      </h3>
                      <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-0.5 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{addr.phone}</span>
                      </p>

                      {/* Street Address */}
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-3 leading-relaxed">
                        {addr.addressLine1}
                        {addr.addressLine2 && `, ${addr.addressLine2}`}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                        {addr.city}, {addr.postalCode} - {addr.country || "Bangladesh"}
                      </p>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <div>
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefault(addr.id)}
                            disabled={isSettingDefault}
                            className="text-xs font-bold text-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:underline transition-colors"
                          >
                            {isBn ? "ডিফল্ট করুন" : "Set Default"}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditAddressModal(addr)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title={isBn ? "সম্পাদনা" : "Edit"}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteModalAddress(addr)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title={isBn ? "মুছে ফেলুন" : "Delete"}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PROFILE DETAILS                                    */}
        {/* ========================================================= */}
        {activeTab === "profile" && (
          <div className="max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-lg sm:text-xl font-black text-neutral-950 dark:text-white">
                {isBn ? "ব্যক্তিগত প্রোফাইল তথ্য" : "Personal Profile Details"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                {isBn
                  ? "আপনার নাম ও যোগাযোগের নম্বর আপডেট করুন।"
                  : "Update your name and primary phone number used for orders."}
              </p>
            </div>

            {/* Avatar Section */}
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white text-2xl font-black uppercase shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name || "Profile Photo"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{initial}</span>
                  )}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white backdrop-blur-xs">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-950 dark:text-white">
                    {isBn ? "প্রোফাইল ছবি" : "Profile Picture"}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                    {isBn
                      ? "JPG, PNG, WebP বা GIF (সর্বোচ্চ ৫ মেগাবাইট)"
                      : "JPG, PNG, WebP or GIF. Max file size 5MB."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => profileTabFileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold hover:opacity-90 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <UploadCloud className="h-3.5 w-3.5" />
                  )}
                  <span>{isBn ? "নতুন ছবি আপলোড" : "Upload Photo"}</span>
                </button>
                <input
                  ref={profileTabFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleAvatarFileSelect}
                />

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={isUploadingAvatar || isUpdatingProfile}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-bold transition-all border border-rose-200 dark:border-rose-900/60 disabled:opacity-50 cursor-pointer"
                    title={isBn ? "ছবি মুছে ফেলুন" : "Remove Photo"}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{isBn ? "মুছে ফেলুন" : "Remove"}</span>
                  </button>
                )}
              </div>
            </div>

            {avatarSuccess && (
              <div className="mb-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{avatarSuccess}</span>
              </div>
            )}

            {avatarError && (
              <div className="mb-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{avatarError}</span>
              </div>
            )}

            {profileSuccessMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            {profileErrorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{profileErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  {isBn ? "পূর্ণ নাম *" : "Full Name *"}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mir Noman"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  {isBn ? "ইমেইল অ্যাড্রেস (পরিবর্তনযোগ্য নয়)" : "Email Address (Read-only)"}
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm font-medium text-neutral-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  {isBn ? "ফোন নম্বর" : "Phone Number"}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-6 py-3.5 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdatingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{isBn ? "পরিবর্তন সংরক্ষণ করুন" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SECURITY & PASSWORD                                */}
        {/* ========================================================= */}
        {activeTab === "security" && (
          <div className="max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-lg sm:text-xl font-black text-neutral-950 dark:text-white">
                {isBn ? "পাসওয়ার্ড পরিবর্তন করুন" : "Account Password"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                {isBn
                  ? "আপনার অ্যাকাউন্ট সুরক্ষিত রাখতে শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।"
                  : "Ensure your account is using a long, random password to stay secure."}
              </p>
            </div>

            {passwordSuccessMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{passwordSuccessMsg}</span>
              </div>
            )}

            {passwordErrorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{passwordErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  {isBn ? "বর্তমান পাসওয়ার্ড *" : "Current Password *"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  {isBn ? "নতুন পাসওয়ার্ড *" : "New Password *"}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  {isBn ? "নতুন পাসওয়ার্ড নিশ্চিত করুন *" : "Confirm New Password *"}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  required
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-6 py-3.5 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isChangingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{isBn ? "পাসওয়ার্ড আপডেট করুন" : "Update Password"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: REFERRAL & REWARDS (৳500)                          */}
        {/* ========================================================= */}
        {activeTab === "referrals" && <ReferralTab />}

        {/* ========================================================= */}
        {/* TAB 5: RETURNS & EXCHANGES                                */}
        {/* ========================================================= */}
        {activeTab === "returns" && <ReturnsTab />}
      </div>

      {/* ── Add / Edit Address Modal ── */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-lg font-black text-neutral-950 dark:text-white">
                {editingAddress
                  ? isBn
                    ? "ঠিকানা সম্পাদনা করুন"
                    : "Edit Address"
                  : isBn
                  ? "নতুন ঠিকানা যোগ করুন"
                  : "Add New Address"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {addrError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{addrError}</span>
              </div>
            )}

            <form onSubmit={handleAddressFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {isBn ? "প্রাপকের নাম *" : "Full Name *"}
                  </label>
                  <input
                    type="text"
                    value={addrFullName}
                    onChange={(e) => setAddrFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {isBn ? "ফোন নম্বর *" : "Phone Number *"}
                  </label>
                  <input
                    type="tel"
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  {isBn ? "ঠিকানা লাইন ১ (বাড়ি/রোড) *" : "Street Address Line 1 *"}
                </label>
                <input
                  type="text"
                  value={addrLine1}
                  onChange={(e) => setAddrLine1(e.target.value)}
                  placeholder="House 12, Road 4, Sector 7, Uttara"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  {isBn ? "ঠিকানা লাইন ২ (ঐচ্ছিক)" : "Address Line 2 (Optional)"}
                </label>
                <input
                  type="text"
                  value={addrLine2}
                  onChange={(e) => setAddrLine2(e.target.value)}
                  placeholder="Flat 4B"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {isBn ? "শহর/জেলা *" : "City / District *"}
                  </label>
                  <select
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  >
                    {[
                      "Dhaka",
                      "Chittagong",
                      "Sylhet",
                      "Rajshahi",
                      "Khulna",
                      "Barisal",
                      "Rangpur",
                      "Mymensingh",
                      "Gazipur",
                      "Narayanganj",
                    ].map((c) => (
                      <option key={c} value={c} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    {isBn ? "পোস্টাল কোড" : "Postal Code"}
                  </label>
                  <input
                    type="text"
                    value={addrPostalCode}
                    onChange={(e) => setAddrPostalCode(e.target.value)}
                    placeholder="1212"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                </div>
              </div>

              {/* Address Type */}
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  {isBn ? "ঠিকানার ধরন" : "Address Type"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAddrType("SHIPPING")}
                    className={cn(
                      "py-2 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5",
                      addrType === "SHIPPING"
                        ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white"
                        : "bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                    )}
                  >
                    <Home className="h-3.5 w-3.5" />
                    <span>Shipping</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddrType("BILLING")}
                    className={cn(
                      "py-2 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5",
                      addrType === "BILLING"
                        ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white"
                        : "bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                    )}
                  >
                    <Building className="h-3.5 w-3.5" />
                    <span>Billing</span>
                  </button>
                </div>
              </div>

              {/* Default toggle */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="rounded h-4 w-4 text-neutral-950 dark:text-white"
                />
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  {isBn ? "এই ঠিকানাটি ডিফল্ট হিসেবে নির্ধারণ করুন" : "Set as default address"}
                </span>
              </label>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 py-3 rounded-xl text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors"
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isCreatingAddress || isUpdatingAddress}
                  className="flex-1 py-3 rounded-xl text-xs font-bold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-1.5"
                >
                  {(isCreatingAddress || isUpdatingAddress) && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <span>
                    {editingAddress
                      ? isBn
                        ? "আপডেট করুন"
                        : "Update Address"
                      : isBn
                      ? "যোগ করুন"
                      : "Save Address"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Address Confirmation Modal ── */}
      {deleteModalAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-neutral-950 dark:text-white">
              {isBn ? "ঠিকানা মুছে ফেলতে চান?" : "Delete Address?"}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {isBn
                ? `আপনি কি নিশ্চিতভাবে "${deleteModalAddress.fullName}" এর জন্য সেভ করা ঠিকানাটি মুছে ফেলতে চান?`
                : `Are you sure you want to delete the saved address for "${deleteModalAddress.fullName}"?`}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalAddress(null)}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors"
              >
                {isBn ? "না, রাখুন" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleDeleteAddressConfirm}
                disabled={isDeletingAddress}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md"
              >
                {isDeletingAddress ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span>{isBn ? "হ্যাঁ, মুছে ফেলুন" : "Yes, Delete"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
