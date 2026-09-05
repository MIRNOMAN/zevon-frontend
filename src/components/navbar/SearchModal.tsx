/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  TrendingUp,
  ArrowRight,
  CornerDownLeft,
  Loader2,
  Package,
  ShoppingBag,
  Sparkles,
  Mic,
  MicOff,
  Camera,
  UploadCloud,
  Layers,
  CheckCircle2,
  Tag,
  Palette,
  Volume2,
  RefreshCw,
} from "lucide-react";
import { useGetProductsQuery } from "@/redux/api/productApi";
import {
  useVoiceSearchMutation,
  useVisualSearchMutation,
  type VoiceSearchMatchedProduct,
  type VisualSearchMatchedProduct,
  type ParsedVoiceIntent,
  type VisualProfile,
} from "@/redux/api/searchApi";
import { FEATURED_PRODUCTS } from "@/components/home/homeData";
import type { Product } from "@/features/products";
import { useTranslation, useCurrency, getCategoryI18nName, toBengaliDigits } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchTab = "text" | "voice" | "visual";

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { t, isBn } = useTranslation();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  // Active search mode / tab
  const [activeTab, setActiveTab] = useState<SearchTab>("text");

  // ── Text Search State ─────────────────────────────────────────
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Voice Search State ────────────────────────────────────────
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const [
    executeVoiceSearch,
    {
      data: voiceData,
      isLoading: isVoiceSearching,
    },
  ] = useVoiceSearchMutation();

  // ── Visual Search State ───────────────────────────────────────
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [selectedHexColor, setSelectedHexColor] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [
    executeVisualSearch,
    {
      data: visualData,
      isLoading: isVisualSearching,
    },
  ] = useVisualSearchMutation();

  // Debounce user input to optimize backend requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 200);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch real-time products matching search from backend (Text Search)
  const {
    data: searchData,
    isLoading: isSearching,
    isFetching,
  } = useGetProductsQuery(
    {
      search: debouncedQuery,
      limit: 8,
      isPublished: true,
    },
    {
      skip: !debouncedQuery || activeTab !== "text",
    }
  );

  // Initialize Speech Recognition on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  const handleStartVoiceRecognition = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = isBn ? "bn-BD" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setActiveTab("voice");
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0]?.transcript)
          .join(" ");
        setSpeechTranscript(transcript);
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (speechTranscript.trim()) {
          executeVoiceSearch({ query: speechTranscript.trim(), limit: 12 });
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error("Speech start error:", e);
      setIsListening(false);
    }
  };

  const handleStopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    if (speechTranscript.trim()) {
      executeVoiceSearch({ query: speechTranscript.trim(), limit: 12 });
    }
  };

  const handleVoiceQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (speechTranscript.trim()) {
      executeVoiceSearch({ query: speechTranscript.trim(), limit: 12 });
    }
  };

  // Handle Image File selection for Visual Search
  const handleImageFileChange = (file: File) => {
    setSelectedImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setSelectedHexColor(null);
    setImageUrlInput("");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("limit", "12");
    executeVisualSearch(formData);
  };

  const handleHexColorSelect = (hex: string) => {
    setSelectedHexColor(hex);
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setImageUrlInput("");
    executeVisualSearch({ hexColor: hex, limit: 12 });
  };

  const handleImageUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      setSelectedImageFile(null);
      setImagePreviewUrl(imageUrlInput.trim());
      setSelectedHexColor(null);
      executeVisualSearch({ imageUrl: imageUrlInput.trim(), limit: 12 });
    }
  };

  // Combine backend search results + local featured catalog matches (Text Mode)
  const productsList = useMemo((): Product[] => {
    if (!debouncedQuery) return [];

    const serverProducts: Product[] = searchData?.products || [];
    const q = debouncedQuery.toLowerCase();

    // Find local featured matches
    const localMatches: Product[] = FEATURED_PRODUCTS.filter((p) => {
      return (
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.colors?.some((c) => c.name.toLowerCase().includes(q))
      );
    }).map((p) => {
      const generatedSlug = p.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      return {
        id: p.id,
        title: p.name,
        name: p.name,
        slug: generatedSlug,
        description: p.description,
        basePrice: p.price,
        discountPrice: p.originalPrice ? p.price : null,
        price: p.price,
        category: {
          id: p.category,
          name: p.subcategory || p.category,
          slug: p.subcategory
            ? p.subcategory.toLowerCase().replace(/[^a-z0-9]+/g, "-")
            : p.category,
        },
        images: p.images,
        primaryImage: { url: p.images[0], isPrimary: true },
        inStock: p.inStock,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Product;
    });

    const combined = [...serverProducts];
    for (const item of localMatches) {
      const exists = combined.some(
        (cp) =>
          cp.slug === item.slug ||
          cp.title?.toLowerCase().trim() === item.title?.toLowerCase().trim() ||
          cp.id === item.id
      );
      if (!exists) {
        combined.push(item);
      }
    }

    return combined;
  }, [debouncedQuery, searchData]);

  const hasQuery = debouncedQuery.length > 0;
  const isBusy = isSearching || isFetching;

  // Focus input on open & lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        if (activeTab === "text") {
          inputRef.current?.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setDebouncedQuery("");
      setSpeechTranscript("");
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
      setSelectedHexColor(null);
      setActiveTab("text");
      if (isListening && recognitionRef.current) {
        recognitionRef.current.abort();
        setIsListening(false);
      }
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, activeTab]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    router.push(`/shop?search=${encodeURIComponent(tag)}`);
    onClose();
  };

  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`);
    onClose();
  };

  // Helper to extract image URL safely
  const getProductImageUrl = (p: Product | VoiceSearchMatchedProduct | VisualSearchMatchedProduct) => {
    if ("primaryImage" in p && typeof p.primaryImage === "string" && p.primaryImage) {
      return p.primaryImage;
    }
    if ("primaryImage" in p && p.primaryImage && typeof p.primaryImage === "object" && "url" in p.primaryImage) {
      return (p.primaryImage as any).url;
    }
    if ("images" in p && Array.isArray(p.images) && p.images.length > 0) {
      const first = p.images[0];
      if (typeof first === "string") return first;
      if (first && typeof first === "object" && "url" in first) return first.url;
    }
    return "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80";
  };

  const getProductCategoryName = (p: any) => {
    if (p.category && typeof p.category === "object") {
      return getCategoryI18nName(p.category.slug, p.category.name, t);
    }
    if (typeof p.category === "string") {
      return getCategoryI18nName(p.category, p.category, t);
    }
    return p.gender || (isBn ? "পোশাক" : "Apparel");
  };

  const trendingTags = isBn
    ? ["হেভিওয়েট টি-শার্ট", "কার্গো প্যান্ট", "ওভারসাইজড হুডি", "ড্রপ শোল্ডার", "ক্যাপ ও টুপি", "উইমেন কো-অর্ড"]
    : ["Heavyweight Tee", "Cargo Pants", "Oversized Hoodie", "Drop Shoulder", "Caps & Beanies", "Women's Co-ords"];

  const sampleVoicePrompts = isBn
    ? [
        "ব্ল্যাক ওভারসাইজড হুডি under ২৫০০",
        "হেভিওয়েট গ্রাফিক টি-শার্ট ড্রপ শোল্ডার",
        "ইউটিলিটি কার্গো প্যান্ট",
        "উইমেন প্রিমিয়াম কো-অর্ড সেট",
      ]
    : [
        "Black oversized hoodie under 2500",
        "Heavyweight graphic tee drop shoulder",
        "Olive utility cargo pants",
        "Women's minimalist knit co-ord set",
      ];

  const presetColorSwatches = [
    { label: "Onyx Black", hex: "#111827", bg: "bg-gray-900" },
    { label: "Dark Charcoal", hex: "#1E293B", bg: "bg-slate-800" },
    { label: "Deep Navy", hex: "#0F172A", bg: "bg-slate-900" },
    { label: "Concrete Gray", hex: "#475569", bg: "bg-slate-600" },
    { label: "Desert Sand", hex: "#D97706", bg: "bg-amber-600" },
    { label: "Olive Drab", hex: "#3F6212", bg: "bg-lime-900" },
    { label: "Crimson Burgundy", hex: "#881337", bg: "bg-rose-950" },
  ];

  const popularCategories = [
    { name: t("categories.menTshirts", "Graphic T-Shirts"), href: "/shop?category=men-t-shirts" },
    { name: t("categories.menHoodies", "Heavyweight Hoodies"), href: "/shop?category=men-hoodies" },
    { name: t("categories.menPants", "Utility Cargo Pants"), href: "/shop?category=men-pants" },
    { name: t("categories.womenCoords", "Women's Co-ords"), href: "/shop?category=women-coords" },
    { name: t("categories.accessoriesCaps", "Caps & Headwear"), href: "/shop?category=caps-headwear" },
    { name: isBn ? "নতুন ড্রপস ২০২৬" : "New Drops 2026", href: "/shop?filter=new" },
  ];

  const parsedIntent: ParsedVoiceIntent | undefined = voiceData?.data?.parsedIntent;
  const voiceProducts: VoiceSearchMatchedProduct[] = voiceData?.data?.data || [];
  const visualProfile: VisualProfile | undefined = visualData?.data?.visualProfile;
  const visualProducts: VisualSearchMatchedProduct[] = visualData?.data?.data || [];

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-4 overflow-hidden transition-all duration-250",
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      )}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity duration-250 ease-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal Dialog with smooth scale transition */}
      <div
        className={cn(
          "relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 z-10 flex flex-col max-h-[88vh] transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2"
        )}
      >
        {/* Top Header Mode Tabs */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/40 shrink-0">
          <div className="flex items-center gap-1.5 p-0.5 rounded-xl bg-neutral-200/60 dark:bg-neutral-800/80 text-xs font-semibold">
            {/* Tab 1: Live Text */}
            <button
              type="button"
              onClick={() => setActiveTab("text")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all",
                activeTab === "text"
                  ? "bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-xs font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              <Search className="h-3.5 w-3.5" />
              <span>{isBn ? "লাইভ সার্চ" : "Instant Search"}</span>
            </button>

            {/* Tab 2: AI Voice Search */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("voice");
                if (!speechTranscript && !isListening) {
                  handleStartVoiceRecognition();
                }
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all relative",
                activeTab === "voice"
                  ? "bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-xs font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              <Mic className={cn("h-3.5 w-3.5", isListening && "text-red-500 animate-pulse")} />
              <span>{isBn ? "ভয়েস AI" : "AI Voice Search"}</span>
              <span className="px-1 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase">
                AI
              </span>
            </button>

            {/* Tab 3: AI Visual Search */}
            <button
              type="button"
              onClick={() => setActiveTab("visual")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all",
                activeTab === "visual"
                  ? "bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-xs font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              <Camera className="h-3.5 w-3.5" />
              <span>{isBn ? "ইমেজ ও কালার AI" : "Visual AI"}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors focus:outline-none shrink-0"
          >
            <span>ESC</span>
          </button>
        </div>

        {/* ── MODE 1: TEXT SEARCH BAR ─────────────────────────────── */}
        {activeTab === "text" && (
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-800/90 bg-transparent shrink-0"
          >
            {isBusy ? (
              <Loader2 className="h-5 w-5 text-neutral-400 dark:text-neutral-500 shrink-0 ml-1 animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-neutral-400 dark:text-neutral-500 shrink-0 ml-1" />
            )}
            <input
              ref={inputRef}
              type="text"
              suppressHydrationWarning
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search.placeholder", "Search collections, apparel, accessories...")}
              style={{ outline: "none", border: "none", boxShadow: "none" }}
              className="w-full bg-transparent px-3.5 py-1 text-base sm:text-lg font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 shadow-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mr-1 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* In-bar Quick AI Shortcuts */}
            <button
              type="button"
              title={isBn ? "ভয়েস অনুসন্ধান" : "Voice Search"}
              onClick={() => {
                setActiveTab("voice");
                handleStartVoiceRecognition();
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors mr-1"
            >
              <Mic className="h-4 w-4" />
            </button>
            <button
              type="button"
              title={isBn ? "ছবি দিয়ে খুঁজুন" : "Visual Search"}
              onClick={() => setActiveTab("visual")}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* ── MODE 2: VOICE SEARCH INPUT / BAR ──────────────────────── */}
        {activeTab === "voice" && (
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-800/90 bg-neutral-50/50 dark:bg-neutral-950/20 shrink-0 space-y-3">
            <form onSubmit={handleVoiceQuerySubmit} className="flex items-center gap-2">
              <div className="relative flex-1 flex items-center px-3 py-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
                <Volume2 className="h-4 w-4 text-neutral-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={speechTranscript}
                  onChange={(e) => setSpeechTranscript(e.target.value)}
                  placeholder={
                    isListening
                      ? isBn
                        ? "কথা বলুন, শুনছি..."
                        : "Listening... speak now"
                      : isBn
                      ? "ভয়েস কোয়েরি লিখুন বা মাইক্রোফোনে বলুন"
                      : "Speak or type natural voice query (e.g. 'black hoodie under 2000')"
                  }
                  className="w-full bg-transparent text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 border-none outline-none focus:outline-none focus:ring-0"
                />
                {speechTranscript && (
                  <button
                    type="button"
                    onClick={() => setSpeechTranscript("")}
                    className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Mic Listen Toggle */}
              <button
                type="button"
                onClick={isListening ? handleStopVoiceRecognition : handleStartVoiceRecognition}
                className={cn(
                  "p-3 rounded-2xl flex items-center justify-center transition-all shadow-md shrink-0",
                  isListening
                    ? "bg-red-500 text-white animate-pulse ring-4 ring-red-500/20"
                    : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:opacity-90"
                )}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            </form>

            {/* Spoken Query Intent Chips Breakdown */}
            {parsedIntent && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mr-1 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>{isBn ? "AI শনাক্ত করেছে:" : "AI Extracted:"}</span>
                </span>
                {parsedIntent.detectedColors?.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-[11px] font-semibold text-neutral-800 dark:text-neutral-200"
                  >
                    <Palette className="h-3 w-3 text-neutral-500" />
                    <span>Color: {c}</span>
                  </span>
                ))}
                {parsedIntent.detectedGarments?.map((g) => (
                  <span
                    key={g}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-[11px] font-semibold text-neutral-800 dark:text-neutral-200"
                  >
                    <Tag className="h-3 w-3 text-neutral-500" />
                    <span>Garment: {g}</span>
                  </span>
                ))}
                {parsedIntent.detectedSizes?.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-[11px] font-semibold text-neutral-800 dark:text-neutral-200"
                  >
                    <span>Size: {s}</span>
                  </span>
                ))}
                {parsedIntent.priceFilter && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-bold">
                    <span>
                      Max: {formatPrice(parsedIntent.priceFilter.max || 0)}
                    </span>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── MODE 3: VISUAL IMAGE & COLOR PALETTE SEARCH ─────────── */}
        {activeTab === "visual" && (
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-800/90 bg-neutral-50/50 dark:bg-neutral-950/20 shrink-0 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* File Upload Zone */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFileChange(file);
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2.5 p-3 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white bg-white dark:bg-neutral-900 transition-all text-xs font-semibold text-neutral-700 dark:text-neutral-300 group"
              >
                <UploadCloud className="h-4 w-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                <span>{selectedImageFile ? selectedImageFile.name : isBn ? "পোশাকের ছবি আপলোড করুন" : "Upload outfit photo"}</span>
              </button>

              {/* Or Image URL Form */}
              <form onSubmit={handleImageUrlSubmit} className="flex-1 flex items-center gap-1.5">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder={isBn ? "বা ছবির URL পেস্ট করুন..." : "Or paste image URL..."}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold hover:opacity-90 transition-opacity shrink-0"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>

            {/* Quick Color Swatches Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 shrink-0 mr-1">
                {isBn ? "কালার প্যালেট:" : "Match by Color:"}
              </span>
              {presetColorSwatches.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => handleHexColorSelect(color.hex)}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shrink-0 border",
                    selectedHexColor === color.hex
                      ? "border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs"
                      : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-black/20"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.label}</span>
                </button>
              ))}
            </div>

            {/* Visual Profile Breakdown Alert */}
            {visualProfile && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="h-5 w-5 rounded-md border border-neutral-300 dark:border-neutral-600 shadow-xs"
                    style={{ backgroundColor: visualProfile.dominantColorHex }}
                  />
                  <div>
                    <span className="font-bold text-neutral-900 dark:text-white block">
                      {visualProfile.dominantColorName} ({visualProfile.detectedTone})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {visualProfile.palette?.map((hex, idx) => (
                    <span
                      key={idx}
                      className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Dynamic Scrollable Content ────────────────────────────── */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: TEXT SEARCH RESULTS */}
          {activeTab === "text" && (
            <>
              {hasQuery && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
                      <span>
                        {t("search.matchingProducts", "Matching Products")}
                        {productsList.length > 0 && (
                          <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px]">
                            {isBn ? toBengaliDigits(productsList.length) : productsList.length}
                          </span>
                        )}
                      </span>
                    </div>
                    {isBusy && (
                      <span className="text-[11px] font-normal text-neutral-400 dark:text-neutral-500">
                        {t("search.searching", "Searching...")}
                      </span>
                    )}
                  </div>

                  {/* Product Live Matches List */}
                  {productsList.length > 0 ? (
                    <div className="space-y-2">
                      {productsList.map((product) => {
                        const imgUrl = getProductImageUrl(product);
                        const categoryName = getProductCategoryName(product);
                        const price = product.discountPrice || product.basePrice || product.price || 0;
                        const originalPrice = product.discountPrice ? (product.basePrice || product.price) : undefined;

                        return (
                          <div
                            key={product.id}
                            onClick={() => handleProductClick(product.slug)}
                            className="group flex items-center justify-between p-2.5 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/30 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0 border border-neutral-200/60 dark:border-neutral-700/60">
                                <img
                                  src={imgUrl}
                                  alt={product.title || product.name || "Product"}
                                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                  loading="lazy"
                                />
                              </div>

                              <div className="min-w-0">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block truncate">
                                  {categoryName}
                                </span>
                                <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate group-hover:text-neutral-950 dark:group-hover:text-white">
                                  {product.title || product.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs font-extrabold text-neutral-900 dark:text-white">
                                    {formatPrice(price)}
                                  </span>
                                  {originalPrice && (
                                    <span className="text-[11px] text-neutral-400 line-through">
                                      {formatPrice(originalPrice)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 pl-2">
                              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                                <span>{isBn ? "দেখুন" : "View"}</span>
                                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                              </span>
                              <div className="h-7 w-7 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-950 transition-colors shadow-xs">
                                <ArrowRight className="h-3.5 w-3.5" />
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full mt-3 py-2.5 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold tracking-wide flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                      >
                        <span>
                          {t("search.viewAllResults", "View all results for")} &ldquo;{debouncedQuery}&rdquo;
                        </span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : !isBusy ? (
                    <div className="text-center py-8 space-y-2">
                      <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mx-auto">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                        {t("search.noResults", "No products found for")} &ldquo;{debouncedQuery}&rdquo;
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                        {t(
                          "search.noResultsDesc",
                          "Try searching with broader terms like 'tee', 'hoodie', 'cargos', or 'black'."
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-2">
                      {[1, 2, 3].map((n) => (
                        <div
                          key={n}
                          className="flex items-center gap-3 p-2.5 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 animate-pulse"
                        >
                          <div className="h-14 w-14 rounded-xl bg-neutral-200 dark:bg-neutral-700" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
                            <div className="h-4 w-40 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Default Suggested Trending Tags */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{t("search.trending", "Trending Searches")}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-all duration-150"
                    >
                      <span>{tag}</span>
                      <ArrowRight className="h-3 w-3 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Categories */}
              <div className="border-t border-neutral-100 dark:border-neutral-800/80 pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-2.5">
                  {t("search.popularCategories", "Popular Categories")}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {popularCategories.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        router.push(item.href);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 text-left hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-all group"
                    >
                      <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white">
                        {item.name}
                      </span>
                      <CornerDownLeft className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: VOICE SEARCH RESULTS */}
          {activeTab === "voice" && (
            <div className="space-y-4">
              {isVoiceSearching ? (
                <div className="text-center py-10 space-y-3">
                  <Loader2 className="h-8 w-8 text-neutral-900 dark:text-white animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-neutral-500">
                    {isBn ? "AI স্পিচ কোয়েরি বিশ্লেষণ করছে..." : "AI analyzing voice query and garment attributes..."}
                  </p>
                </div>
              ) : voiceProducts.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    <span>{isBn ? "প্রাসঙ্গিক পণ্যসমূহ" : "Ranked Intent Matches"}</span>
                    <span>{voiceProducts.length} {isBn ? "টি ফলাফল" : "results"}</span>
                  </div>

                  {voiceProducts.map((p) => {
                    const imgUrl = getProductImageUrl(p);
                    const categoryName = getProductCategoryName(p);
                    const price = p.discountPrice || p.basePrice || 0;

                    return (
                      <div
                        key={p.id}
                        onClick={() => handleProductClick(p.slug)}
                        className="group flex items-center justify-between p-2.5 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0 border border-neutral-200/60 dark:border-neutral-700/60">
                            <img
                              src={imgUrl}
                              alt={p.title}
                              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                {categoryName}
                              </span>
                              {p.matchScore > 0 && (
                                <span className="px-1.5 py-0.2 rounded bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-extrabold">
                                  {p.matchScore}% Match
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">
                              {p.title}
                            </h4>
                            <div className="text-xs font-extrabold text-neutral-900 dark:text-white mt-0.5">
                              {formatPrice(price)}
                            </div>
                          </div>
                        </div>

                        <div className="h-7 w-7 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-950 transition-colors shadow-xs">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-6 space-y-2">
                    <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mx-auto">
                      <Mic className="h-6 w-6" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {isBn ? "প্রাকৃতিক ভাষায় বলুন" : "Try Spoken Natural Language Search"}
                    </h4>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                      {isBn
                        ? "রং, সাইজ, বাজেট ও পোশাকের ধরন একসাথে বলুন। যেমন:"
                        : "Describe color, fit, price limit, or category simultaneously. For example:"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sampleVoicePrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSpeechTranscript(prompt);
                          executeVoiceSearch({ query: prompt, limit: 12 });
                        }}
                        className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 flex items-center justify-between group"
                      >
                        <span>&ldquo;{prompt}&rdquo;</span>
                        <ArrowRight className="h-3.5 w-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VISUAL IMAGE SEARCH RESULTS */}
          {activeTab === "visual" && (
            <div className="space-y-4">
              {isVisualSearching ? (
                <div className="text-center py-10 space-y-3">
                  <Loader2 className="h-8 w-8 text-neutral-900 dark:text-white animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-neutral-500">
                    {isBn ? "ইমেজ কালার প্যালেট ও ডেল্টা-ই দূরত্ব বিশ্লেষণ করছে..." : "Computing Delta-E color distance & ranking garments..."}
                  </p>
                </div>
              ) : visualProducts.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    <span>{isBn ? "কালার ম্যাচিং পণ্যসমূহ" : "Visual & Color Match Results"}</span>
                    <span>{visualProducts.length} {isBn ? "টি ফলাফল" : "matches"}</span>
                  </div>

                  {visualProducts.map((p) => {
                    const imgUrl = getProductImageUrl(p);
                    const categoryName = getProductCategoryName(p);
                    const price = p.discountPrice || p.basePrice || 0;

                    return (
                      <div
                        key={p.id}
                        onClick={() => handleProductClick(p.slug)}
                        className="group flex items-center justify-between p-2.5 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0 border border-neutral-200/60 dark:border-neutral-700/60">
                            <img
                              src={imgUrl}
                              alt={p.title}
                              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                {categoryName}
                              </span>
                              {p.similarityScore > 0 && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-extrabold">
                                  {p.similarityScore}% Visual Match
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">
                              {p.title}
                            </h4>
                            <div className="text-xs font-extrabold text-neutral-900 dark:text-white mt-0.5">
                              {formatPrice(price)}
                            </div>
                          </div>
                        </div>

                        <div className="h-7 w-7 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-950 transition-colors shadow-xs">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 space-y-2">
                  <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mx-auto">
                    <Camera className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {isBn ? "ছবি বা প্যালেট নির্বাচন করুন" : "Upload an outfit photo or select a color palette"}
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    {isBn
                      ? "আমাদের কম্পিউটার ভিশন কালার ইঞ্জিন আপনার কাঙ্ক্ষিত শেডের সাথে হুবহু মিলিয়ে পোশাক খুঁজে দেবে।"
                      : "Our computer vision color distance algorithm extracts dominant tones to find exact streetwear matches."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-950/40 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500 shrink-0">
          <span>{isBn ? "অনুসন্ধান করতে Enter চাপুন" : "Press Enter to search catalog"}</span>
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>ZEVON AI Search Engine</span>
          </span>
        </div>
      </div>
    </div>
  );
}
