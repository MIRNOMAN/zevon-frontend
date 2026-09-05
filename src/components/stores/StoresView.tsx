"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  ExternalLink,
  Sparkles,
  Calendar,
  CheckCircle2,
  Loader2,
  Building,
  Compass,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useGetStoreLocationsQuery, StoreLocationItem } from "@/redux/api/storeApi";
import { Button } from "@/components/ui/button";

export function StoresView() {
  const { t, isBn } = useTranslation();
  const { data: storesRes, isLoading } = useGetStoreLocationsQuery();

  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [selectedStoreForModal, setSelectedStoreForModal] = useState<StoreLocationItem | null>(null);
  const [appointmentName, setAppointmentName] = useState("");
  const [appointmentPhone, setAppointmentPhone] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");

  const stores: StoreLocationItem[] = storesRes?.data || [
    {
      id: "1",
      name: "ZEVON Flagship Atelier — Banani",
      address: "House 42, Road 11, Block D, Banani",
      city: "Dhaka",
      phone: "+880 1700-000001",
      email: "banani@zevon.com",
      openingHours: "Mon – Sun: 10:00 AM – 10:00 PM BST",
      googleMapsUrl: "https://maps.google.com/?q=Banani+Dhaka",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "ZEVON Studio Lounge — Gulshan 2",
      address: "Avenue 5, Gulshan 2 (Opposite Westin)",
      city: "Dhaka",
      phone: "+880 1700-000002",
      email: "gulshan@zevon.com",
      openingHours: "Mon – Sun: 11:00 AM – 10:30 PM BST",
      googleMapsUrl: "https://maps.google.com/?q=Gulshan+2+Dhaka",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "ZEVON Concept Space — Dhanmondi",
      address: "House 14, Road 27 (Old), Dhanmondi",
      city: "Dhaka",
      phone: "+880 1700-000003",
      email: "dhanmondi@zevon.com",
      openingHours: "Mon – Sun: 10:30 AM – 09:30 PM BST",
      googleMapsUrl: "https://maps.google.com/?q=Dhanmondi+27+Dhaka",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      name: "ZEVON Archive Pop-Up — Chattogram",
      address: "GEC Circle, Nasirabad, Chattogram",
      city: "Chattogram",
      phone: "+880 1700-000004",
      email: "chattogram@zevon.com",
      openingHours: "Mon – Sun: 11:00 AM – 09:00 PM BST",
      googleMapsUrl: "https://maps.google.com/?q=GEC+Circle+Chattogram",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const cities = useMemo(() => {
    const citySet = new Set<string>();
    stores.forEach((s) => citySet.add(s.city));
    return ["ALL", ...Array.from(citySet)];
  }, [stores]);

  const filteredStores = useMemo(() => {
    if (selectedCity === "ALL") return stores;
    return stores.filter((s) => s.city.toLowerCase() === selectedCity.toLowerCase());
  }, [stores, selectedCity]);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentSuccess(true);
    setTimeout(() => {
      setAppointmentSuccess(false);
      setSelectedStoreForModal(null);
      setAppointmentName("");
      setAppointmentPhone("");
      setAppointmentDate("");
    }, 2000);
  };

  return (
    <div className="min-h-[85vh] bg-background py-10 sm:py-16">
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
            {isBn ? "আউটলেট ও স্টুডিও" : "Flagship Stores"}
          </span>
        </nav>

        {/* ── Hero Banner ── */}
        <div className="relative rounded-3xl bg-linear-to-br from-neutral-950 via-neutral-900 to-black text-white p-8 sm:p-14 lg:p-20 shadow-2xl overflow-hidden mb-12 border border-neutral-800">
          <div className="absolute right-0 top-0 translate-x-20 -translate-y-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-neutral-300 border border-white/10 mb-4">
              <Compass className="h-3.5 w-3.5 text-amber-400" />
              <span>{isBn ? "ফিজিক্যাল লোকেশন" : "TACTILE SENSORY SPACES"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
              {isBn ? "আমাদের স্টুডিও ও আউটলেট সমূহ" : "VISIT OUR FLAGSHIP ATELIERS"}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed max-w-2xl">
              {isBn
                ? "আমাদের প্রিমিয়াম ৩৮০+ জিএসএম ফেব্রিক সরাসরি স্পর্শ করে দেখুন এবং বিশেষজ্ঞ স্টাইলিস্টদের থেকে পার্সোনালাইজড ফিটিং পরামর্শ গ্রহণ করুন।"
                : "Experience the physical weight of our heavyweight textiles, private tailoring consultations, and exclusive in-store archive drops."}
            </p>
          </div>
        </div>

        {/* ── City Filters ── */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {cities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCity === city
                  ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md"
                  : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
              }`}
            >
              {city === "ALL" ? (isBn ? "সব আউটলেট" : "All Locations") : city}
            </button>
          ))}
        </div>

        {/* ── Store Cards Grid ── */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 mb-16">
            {filteredStores.map((store, idx) => (
              <div
                key={store.id}
                style={{ animationDelay: `${idx * 100}ms` }}
                className="animate-fade-in-up rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 hover-card-lift hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase mb-2 border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {store.city}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-neutral-950 dark:text-white group-hover:text-emerald-500 transition-colors">
                        {store.name}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm pt-2 text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 shrink-0 text-neutral-400 mt-0.5 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 shrink-0 text-neutral-400 mt-0.5 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors" />
                      <span>{store.openingHours}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 shrink-0 text-neutral-400 mt-0.5 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors" />
                      <span>{store.phone}</span>
                    </div>
                    {store.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="h-4 w-4 shrink-0 text-neutral-400 mt-0.5 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors" />
                        <span>{store.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  {store.googleMapsUrl && (
                    <a
                      href={store.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-xs"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      <span>{isBn ? "ম্যাপে দিকনির্দেশনা" : "Get Directions"}</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedStoreForModal(store)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{isBn ? "প্রাইভেট ফিটিং বুকিং" : "Book Styling Session"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Appointment Booking Modal ── */}
        {selectedStoreForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <h3 className="text-base font-black text-neutral-950 dark:text-white">
                    {isBn ? "প্রাইভেট স্টাইলিং সেশন বুকিং" : "Book Private Fitting Session"}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {selectedStoreForModal.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStoreForModal(null)}
                  className="text-neutral-400 hover:text-neutral-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {appointmentSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-center space-y-2 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500" />
                  <p className="font-bold text-sm">
                    {isBn ? "আপনার সেশন সফলভাবে বুক করা হয়েছে!" : "Appointment Confirmed!"}
                  </p>
                  <p className="text-xs">
                    {isBn ? "আমাদের স্টাইলিস্ট টিম আপনাকে ফোন করে নিশ্চিত করবে।" : "Our atelier concierge will contact you via phone."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookAppointment} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                      {isBn ? "আপনার নাম *" : "Full Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={appointmentName}
                      onChange={(e) => setAppointmentName(e.target.value)}
                      placeholder="e.g. Mir Noman"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                      {isBn ? "ফোন নম্বর *" : "Phone Number *"}
                    </label>
                    <input
                      type="tel"
                      required
                      value={appointmentPhone}
                      onChange={(e) => setAppointmentPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                      {isBn ? "পছন্দের তারিখ *" : "Preferred Date *"}
                    </label>
                    <input
                      type="date"
                      required
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedStoreForModal(null)}
                      className="text-xs"
                    >
                      {isBn ? "বাতিল" : "Cancel"}
                    </Button>
                    <Button
                      type="submit"
                      className="bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold"
                    >
                      {isBn ? "কনফার্ম করুন" : "Confirm Appointment"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
