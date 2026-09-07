"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  MailCheck,
  RefreshCw,
  Send,
  Clock,
  User,
  Phone,
  Mail,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
} from "lucide-react";
import {
  useGetAbandonedCartsQuery,
  useTriggerCartRecoveryMutation,
} from "@/redux/api/abandonedCartApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AbandonedCartsPage() {
  const { data, isLoading, isFetching, refetch } = useGetAbandonedCartsQuery(undefined, {
    pollingInterval: 30000, // Refresh automatically every 30 seconds
  });

  const [triggerRecovery, { isLoading: isTriggering }] = useTriggerCartRecoveryMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SENT" | "PENDING">("ALL");
  const [scanResult, setScanResult] = useState<{
    scannedCartsCount: number;
    dispatchedRecoveryEmails: number;
    timestamp: string;
  } | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const carts = useMemo(() => data?.carts || [], [data]);

  const filteredCarts = useMemo(() => {
    return carts.filter((c) => {
      const name = c.user?.name?.toLowerCase() || "";
      const email = c.user?.email?.toLowerCase() || "";
      const phone = c.user?.phone?.toLowerCase() || "";
      const q = searchQuery.toLowerCase();

      const matchesSearch = !q || name.includes(q) || email.includes(q) || phone.includes(q);

      if (!matchesSearch) return false;

      if (statusFilter === "SENT") {
        return Boolean(c.abandonedEmailSentAt && c.abandonedEmailCount > 0);
      }
      if (statusFilter === "PENDING") {
        return !c.abandonedEmailSentAt || c.abandonedEmailCount === 0;
      }
      return true;
    });
  }, [carts, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = carts.length;
    const emailsSent = carts.filter((c) => c.abandonedEmailCount > 0).length;
    const pendingRecovery = total - emailsSent;
    const totalItems = carts.reduce((acc, c) => acc + (c.itemsCount || 0), 0);

    return {
      total,
      emailsSent,
      pendingRecovery,
      totalItems,
    };
  }, [carts]);

  const handleRunRecoveryScan = async () => {
    setScanResult(null);
    setScanError(null);
    try {
      const res = await triggerRecovery().unwrap();
      setScanResult(res);
      refetch();
    } catch (err: any) {
      setScanError(
        err?.data?.message || err?.message || "Failed to trigger abandoned cart recovery scanner."
      );
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffMs = Date.now() - date.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor(diffMs / (1000 * 60));

      if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
      if (diffHrs < 24) return `${diffHrs} hr${diffHrs === 1 ? "" : "s"} ago`;
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* ── Page Header ─────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Abandoned Cart Recovery
            </h1>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-semibold px-2 py-0.5">
              Automated Hourly Cron Active
            </Badge>
          </div>
          <p className="text-sm text-foreground/60 mt-1">
            Track abandoned checkout sessions and dispatch automated 10% promo recovery emails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 rounded-xl text-xs font-semibold"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            onClick={handleRunRecoveryScan}
            disabled={isTriggering}
            className="flex items-center gap-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold shadow-md hover:opacity-90"
          >
            {isTriggering ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Scanning & Sending...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Trigger Recovery Scan</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── Feedback Banners ────────────────────────── */}
      {scanResult && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-start gap-3 animate-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-sm">Abandoned Cart Scan Completed Successfully</h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
              Scanned <strong>{scanResult.scannedCartsCount}</strong> cart(s) and dispatched{" "}
              <strong>{scanResult.dispatchedRecoveryEmails}</strong> recovery email(s) with dynamic
              10% discount promo codes.
            </p>
          </div>
          <button
            onClick={() => setScanResult(null)}
            className="text-xs text-foreground/50 hover:text-foreground font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {scanError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 flex items-start gap-3 animate-in slide-in-from-top-2">
          <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-sm">Recovery Scan Error</h4>
            <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">{scanError}</p>
          </div>
          <button
            onClick={() => setScanError(null)}
            className="text-xs text-foreground/50 hover:text-foreground font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Metric Cards ────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-foreground/10 bg-foreground/[0.02] shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-bold uppercase tracking-wider">
                Total Abandoned
              </CardDescription>
              <ShoppingCart className="h-4 w-4 text-foreground/40" />
            </div>
            <CardTitle className="text-3xl font-black tabular-nums">
              {stats.total}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-foreground/50">
              Carts inactive &gt;2 hrs with unpurchased items
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-foreground/10 bg-foreground/[0.02] shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-bold uppercase tracking-wider">
                Emails Dispatched
              </CardDescription>
              <MailCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <CardTitle className="text-3xl font-black tabular-nums text-emerald-600 dark:text-emerald-400">
              {stats.emailsSent}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-foreground/50">
              Received 10% coupon recovery emails
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-foreground/10 bg-foreground/[0.02] shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-bold uppercase tracking-wider">
                Pending Scan / Recover
              </CardDescription>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <CardTitle className="text-3xl font-black tabular-nums text-amber-600 dark:text-amber-400">
              {stats.pendingRecovery}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-foreground/50">
              Eligible for next background cron run
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-foreground/10 bg-foreground/[0.02] shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-bold uppercase tracking-wider">
                Total Products Trapped
              </CardDescription>
              <Layers className="h-4 w-4 text-indigo-500" />
            </div>
            <CardTitle className="text-3xl font-black tabular-nums text-indigo-600 dark:text-indigo-400">
              {stats.totalItems}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-foreground/50">
              Items across all abandoned user carts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Filters & Search ────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-foreground/[0.02] p-4 rounded-2xl border border-foreground/10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email or phone..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-foreground/10 bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground/50 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Filter:
          </span>
          <div className="inline-flex rounded-xl bg-foreground/5 p-1 border border-foreground/10">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === "ALL"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              All ({carts.length})
            </button>
            <button
              onClick={() => setStatusFilter("SENT")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === "SENT"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              Emailed ({stats.emailsSent})
            </button>
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === "PENDING"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              Pending ({stats.pendingRecovery})
            </button>
          </div>
        </div>
      </div>

      {/* ── Table Section ───────────────────────────── */}
      <div className="rounded-2xl border border-foreground/10 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-foreground/10 bg-foreground/[0.02] text-xs font-bold uppercase tracking-wider text-foreground/60">
              <tr>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4 text-center">Cart Items</th>
                <th className="px-6 py-4">Last Inactive At</th>
                <th className="px-6 py-4">Recovery Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 w-32 bg-foreground/10 rounded mb-1" />
                      <div className="h-3 w-48 bg-foreground/10 rounded" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="h-4 w-12 bg-foreground/10 rounded mx-auto" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-foreground/10 rounded mb-1" />
                      <div className="h-3 w-32 bg-foreground/10 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-24 bg-foreground/10 rounded-full" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-8 w-20 bg-foreground/10 rounded-xl ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredCarts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/5 mb-4">
                      <ShoppingCart className="h-8 w-8 text-foreground/40" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-1">
                      No Abandoned Carts Found
                    </h3>
                    <p className="text-xs text-foreground/50 max-w-sm mx-auto">
                      {searchQuery || statusFilter !== "ALL"
                        ? "No abandoned carts matched your search criteria."
                        : "All shopping carts are either active or currently cleared."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCarts.map((cart) => {
                  const hasEmailSent = Boolean(
                    cart.abandonedEmailSentAt && cart.abandonedEmailCount > 0
                  );

                  return (
                    <tr
                      key={cart.id}
                      className="hover:bg-foreground/[0.01] transition-colors group"
                    >
                      {/* Customer Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground/5 border border-foreground/10 font-bold text-xs uppercase text-foreground">
                            {cart.user?.name ? cart.user.name.charAt(0) : "G"}
                          </div>
                          <div>
                            <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                              <span>{cart.user?.name || "Guest Customer"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-foreground/50 mt-0.5">
                              {cart.user?.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {cart.user.email}
                                </span>
                              )}
                              {cart.user?.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {cart.user.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Items Count */}
                      <td className="px-6 py-4 text-center">
                        <Badge
                          variant="secondary"
                          className="font-bold text-xs px-2.5 py-0.5 rounded-lg"
                        >
                          {cart.itemsCount} {cart.itemsCount === 1 ? "Item" : "Items"}
                        </Badge>
                      </td>

                      {/* Inactive Time */}
                      <td className="px-6 py-4">
                        <div className="text-xs font-semibold text-foreground">
                          {formatRelativeTime(cart.lastActiveAt)}
                        </div>
                        <div className="text-[11px] text-foreground/40 mt-0.5">
                          {new Date(cart.lastActiveAt).toLocaleString()}
                        </div>
                      </td>

                      {/* Recovery Status */}
                      <td className="px-6 py-4">
                        {hasEmailSent ? (
                          <div className="space-y-1">
                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold text-xs px-2.5 py-0.5 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Recovery Email Sent</span>
                            </Badge>
                            <div className="text-[11px] text-foreground/40 pl-1">
                              Dispatched {formatRelativeTime(cart.abandonedEmailSentAt!)} ({cart.abandonedEmailCount}x)
                            </div>
                          </div>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold text-xs px-2.5 py-0.5 flex items-center gap-1 w-fit">
                            <Clock className="h-3 w-3" />
                            <span>Pending Recovery</span>
                          </Badge>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleRunRecoveryScan}
                          disabled={isTriggering}
                          className="rounded-xl text-xs font-bold gap-1.5 hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950"
                        >
                          <Send className="h-3 w-3" />
                          <span>Dispatch</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Architecture & Info Footer ──────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/10 text-xs">
          <div className="font-bold text-foreground flex items-center gap-1.5 mb-1">
            <Clock className="h-3.5 w-3.5 text-foreground/70" />
            <span>Automated Cron Scanner</span>
          </div>
          <p className="text-foreground/60">
            The server automatically runs an hourly background cron (<code>@Cron(EVERY_HOUR)</code>) to detect carts abandoned between 2 and 48 hours ago.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/10 text-xs">
          <div className="font-bold text-foreground flex items-center gap-1.5 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            <span>Dynamic Promo Generation</span>
          </div>
          <p className="text-foreground/60">
            For each abandoned session, a 10% coupon (<code>RECOVER-XXXX</code>) is generated with 48h validity and embedded in the customer email.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/10 text-xs">
          <div className="font-bold text-foreground flex items-center gap-1.5 mb-1">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
            <span>Spam Protection</span>
          </div>
          <p className="text-foreground/60">
            Customers will only receive recovery emails once every 7 days per cart to ensure optimal deliverability and user satisfaction.
          </p>
        </div>
      </div>
    </div>
  );
}
