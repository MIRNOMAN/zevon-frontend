import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ZevonLogo } from "@/components/navbar/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors">
      {/* Background ambient decorative glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-linear-to-br from-neutral-200/50 dark:from-neutral-800/30 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-linear-to-tr from-neutral-200/50 dark:from-neutral-800/30 to-transparent blur-3xl" />
      </div>

      {/* Auth Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <ZevonLogo />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to store</span>
        </Link>
      </header>

      {/* Auth Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Auth Footer */}
      <footer className="w-full py-6 text-center text-xs text-neutral-400 dark:text-neutral-500">
        &copy; {new Date().getFullYear()} ZEVON Inc. All rights reserved.
      </footer>
    </div>
  );
}
