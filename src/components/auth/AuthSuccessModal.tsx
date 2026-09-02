"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface AuthSuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  redirectTo?: string;
  redirectButtonText?: string;
  autoRedirectSeconds?: number;
}

export function AuthSuccessModal({
  isOpen,
  title = "Success!",
  message = "Your action has been completed successfully.",
  redirectTo = "/login",
  redirectButtonText = "Continue to Sign In",
  autoRedirectSeconds = 3,
}: AuthSuccessModalProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(autoRedirectSeconds);

  useEffect(() => {
    if (!isOpen) return;

    setCountdown(autoRedirectSeconds);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push(redirectTo);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, redirectTo, autoRedirectSeconds, router]);

  if (!isOpen) return null;

  const handleManualRedirect = () => {
    router.push(redirectTo);
  };

  const progressPercent = ((autoRedirectSeconds - countdown) / autoRedirectSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 text-center shadow-2xl ring-1 ring-black/10 dark:ring-white/10 animate-in zoom-in-95 duration-200">
        {/* Animated Check Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-inner">
          <CheckCircle2 className="h-8 w-8 animate-in zoom-in-50 duration-300" />
        </div>

        {/* Title & Message */}
        <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
          {title}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm mx-auto">
          {message}
        </p>

        {/* Redirect Notice & Progress Bar */}
        <div className="my-6 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
            <span>Redirecting automatically...</span>
            <span className="font-mono text-neutral-900 dark:text-white font-bold">{countdown}s</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleManualRedirect}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-white font-bold py-3.5 px-4 text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.99]"
        >
          <span>{redirectButtonText}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
