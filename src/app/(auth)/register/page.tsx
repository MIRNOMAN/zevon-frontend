/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  Loader2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  useRegisterMutation,
  useVerifyRegisterOtpMutation,
  useResendRegisterOtpMutation,
} from "@/redux/api/authApi";
import { OtpModal } from "@/components/auth/OtpModal";
import { AuthSuccessModal } from "@/components/auth/AuthSuccessModal";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Modals state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [otpErrorMessage, setOtpErrorMessage] = useState<string | null>(null);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  // RTK Query hooks
  const [sendRegisterOtp, { isLoading: isSendingOtp }] = useRegisterMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyRegisterOtpMutation();
  const [resendOtp] = useResendRegisterOtpMutation();

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-neutral-200 dark:bg-neutral-700" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score: 25, label: "Weak", color: "bg-rose-500" };
      case 2:
        return { score: 50, label: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 75, label: "Good", color: "bg-blue-500" };
      case 4:
        return { score: 100, label: "Strong", color: "bg-emerald-500" };
      default:
        return { score: 10, label: "Too Short", color: "bg-rose-500" };
    }
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorMessage(null);

    if (!name.trim()) {
      setFormErrorMessage("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setFormErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setFormErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setFormErrorMessage("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setFormErrorMessage("Please agree to the Terms of Service & Privacy Policy.");
      return;
    }

    try {
      await sendRegisterOtp({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      }).unwrap();

      // Open OTP verification modal
      setOtpErrorMessage(null);
      setIsOtpModalOpen(true);
    } catch (err: any) {
      const serverMessage =
        err?.data?.message ||
        (Array.isArray(err?.data?.message)
          ? err.data.message.join(", ")
          : null) ||
        err?.message ||
        "Could not initiate registration. Please try again.";
      setFormErrorMessage(
        typeof serverMessage === "string"
          ? serverMessage
          : "Registration failed. Please check your details."
      );
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setOtpErrorMessage(null);
    try {
      await verifyOtp({
        email: email.trim(),
        otp,
      }).unwrap();

      // Close OTP modal and show Success Modal
      setIsOtpModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      const serverMessage =
        err?.data?.message ||
        (Array.isArray(err?.data?.message)
          ? err.data.message.join(", ")
          : null) ||
        err?.message ||
        "Invalid or expired verification code.";
      setOtpErrorMessage(
        typeof serverMessage === "string"
          ? serverMessage
          : "Verification failed. Please check the code."
      );
    }
  };

  const handleResendOtp = async () => {
    setOtpErrorMessage(null);
    try {
      await resendOtp({ email: email.trim() }).unwrap();
    } catch (err: any) {
      const serverMessage =
        err?.data?.message || "Failed to resend code. Please try again.";
      setOtpErrorMessage(String(serverMessage));
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <>
      <div className="rounded-3xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 mb-3 shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
            Create Account
          </h1>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Join ZEVON to discover exclusive drops & track orders
          </p>
        </div>

        {/* Error Alert */}
        {formErrorMessage && (
          <div className="mb-5 flex items-center gap-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 p-3.5 text-xs font-semibold text-rose-700 dark:text-rose-400 animate-in fade-in-50">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{formErrorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                <User className="h-4 w-4" />
              </div>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tamim Iqbal"
                className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 pl-10 pr-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-neutral-900 dark:focus:border-white focus:outline-none focus:ring-2 focus:ring-neutral-400/20 transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 pl-10 pr-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-neutral-900 dark:focus:border-white focus:outline-none focus:ring-2 focus:ring-neutral-400/20 transition-all"
              />
            </div>
          </div>

          {/* Phone Number (Optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="phone"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
              >
                Phone Number
              </label>
              <span className="text-[10px] text-neutral-400">Optional</span>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                <Phone className="h-4 w-4" />
              </div>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1700 000000"
                className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 pl-10 pr-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-neutral-900 dark:focus:border-white focus:outline-none focus:ring-2 focus:ring-neutral-400/20 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
            >
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 pl-10 pr-10 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-neutral-900 dark:focus:border-white focus:outline-none focus:ring-2 focus:ring-neutral-400/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Password strength bar */}
            {password.length > 0 && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-neutral-400">Strength:</span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                    {strength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 pl-10 pr-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-neutral-900 dark:focus:border-white focus:outline-none focus:ring-2 focus:ring-neutral-400/20 transition-all"
              />
            </div>
          </div>

          {/* Agree to Terms */}
          <div className="flex items-start gap-2 pt-1">
            <input
              id="terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="h-4 w-4 mt-0.5 rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-neutral-400 dark:focus:ring-offset-neutral-900"
            />
            <label
              htmlFor="terms"
              className="text-xs text-neutral-600 dark:text-neutral-400 select-none cursor-pointer"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="underline underline-offset-2 hover:text-neutral-900 dark:hover:text-white"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 hover:text-neutral-900 dark:hover:text-white"
              >
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSendingOtp}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-white font-bold py-3 px-4 text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {isSendingOtp ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending Verification Code...</span>
              </>
            ) : (
              <>
                <span>Continue & Verify Email</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-neutral-900 px-3 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign-up Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50/80 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 py-2.5 px-4 text-xs font-bold text-neutral-800 dark:text-neutral-200 transition-all shadow-xs hover:shadow-sm disabled:opacity-60"
        >
          {isGoogleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
          ) : (
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Sign up with Google</span>
        </button>

        {/* Switch to Login */}
        <div className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-neutral-900 dark:text-white underline-offset-4 hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* ── OTP Verification Modal ── */}
      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        email={email}
        title="Verify Your Account"
        subtitle="Please enter the 6-digit verification code sent to"
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        isLoading={isVerifyingOtp}
        errorMessage={otpErrorMessage}
      />

      {/* ── Success Modal with automated redirect to Sign In ── */}
      <AuthSuccessModal
        isOpen={isSuccessModalOpen}
        title="Registration Complete! 🎉"
        message="Your email has been verified and your account is ready. Redirecting to Sign In..."
        redirectTo="/login"
        redirectButtonText="Go to Sign In"
        autoRedirectSeconds={3}
      />
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
