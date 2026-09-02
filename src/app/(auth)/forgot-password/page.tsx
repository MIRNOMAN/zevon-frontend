/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, Suspense, useRef, useEffect } from "react";
import Link from "next/link";
import {
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendResetOtpMutation,
} from "@/redux/api/authApi";
import { AuthSuccessModal } from "@/components/auth/AuthSuccessModal";

function ForgotPasswordForm() {
  const [step, setStep] = useState<"EMAIL" | "RESET">("EMAIL");
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Timer & Resend
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Status & Error
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // RTK Query Hooks
  const [sendForgotOtp, { isLoading: isSendingEmail }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();
  const [resendOtp] = useResendResetOtpMutation();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (step !== "RESET") return;
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [step, timer]);

  // Focus first digit when reaching step 2
  useEffect(() => {
    if (step === "RESET") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

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

  const strength = getPasswordStrength(newPassword);

  // Handle Step 1: Submit Email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    try {
      await sendForgotOtp({ email: email.trim() }).unwrap();
      setStep("RESET");
      setTimer(60);
      setCanResend(false);
    } catch (err: any) {
      const serverMsg =
        err?.data?.message ||
        err?.message ||
        "No account found with this email address.";
      setErrorMessage(typeof serverMsg === "string" ? serverMsg : "Request failed.");
    }
  };

  // Handle Digit Inputs
  const handleDigitChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setDigits(newDigits);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Handle Step 2: Submit Reset Password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const otp = digits.join("");
    if (otp.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({
        email: email.trim(),
        otp,
        newPassword,
      }).unwrap();

      setIsSuccessModalOpen(true);
    } catch (err: any) {
      const serverMsg =
        err?.data?.message ||
        err?.message ||
        "Invalid or expired verification code.";
      setErrorMessage(typeof serverMsg === "string" ? serverMsg : "Password reset failed.");
    }
  };

  // Handle Resend OTP
  const handleResend = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    setErrorMessage(null);
    try {
      await resendOtp({ email: email.trim() }).unwrap();
      setDigits(["", "", "", "", "", ""]);
      setTimer(60);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setErrorMessage(err?.data?.message || "Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <div className="rounded-3xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 mb-3 shadow-sm">
            <KeyRound className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
            {step === "EMAIL" ? "Forgot Password" : "Reset Password"}
          </h1>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {step === "EMAIL"
              ? "Enter your email to receive a 6-digit password reset code"
              : `Enter the code sent to ${email} and choose a new password`}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 p-3.5 text-xs font-semibold text-rose-700 dark:text-rose-400 animate-in fade-in-50">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step 1: Request Email */}
        {step === "EMAIL" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
              >
                Account Email Address
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

            <button
              type="submit"
              disabled={isSendingEmail}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-white font-bold py-3 px-4 text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {isSendingEmail ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending Reset Code...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Code</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Enter OTP & New Password */
          <form onSubmit={handleResetSubmit} className="space-y-5">
            {/* 6 Digit OTP */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                6-Digit Verification Code
              </label>
              <div className="flex items-center justify-between gap-2">
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    className="h-11 sm:h-12 w-10 sm:w-12 text-center text-lg sm:text-xl font-black font-mono rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:border-neutral-900 dark:focus:border-white focus:ring-2 focus:ring-neutral-400/20 focus:outline-none transition-all"
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep("EMAIL")}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Change email</span>
                </button>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="font-bold text-neutral-900 dark:text-white inline-flex items-center gap-1 hover:underline text-[11px]"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Resend Code</span>
                    )}
                  </button>
                ) : (
                  <span className="text-[11px] text-neutral-400">
                    Resend in <strong className="text-neutral-700 dark:text-neutral-300">{timer}s</strong>
                  </span>
                )}
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="newPassword"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
              >
                New Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

              {/* Strength Meter */}
              {newPassword.length > 0 && (
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
                Confirm New Password
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
                  placeholder="Repeat new password"
                  className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 pl-10 pr-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-neutral-900 dark:focus:border-white focus:outline-none focus:ring-2 focus:ring-neutral-400/20 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isResettingPassword}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-white font-bold py-3 px-4 text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {isResettingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Resetting Password...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-4">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-bold text-neutral-900 dark:text-white underline-offset-4 hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* ── Success Modal with automated redirect to Sign In ── */}
      <AuthSuccessModal
        isOpen={isSuccessModalOpen}
        title="Password Reset Complete! 🔒"
        message="Your password has been changed successfully. Redirecting to Sign In..."
        redirectTo="/login"
        redirectButtonText="Go to Sign In"
        autoRedirectSeconds={3}
      />
    </>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
