export interface Product {
  id: string;
  name: string;
  category: "men" | "women" | "accessories";
  subcategory: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: "NEW" | "SALE" | "HOT" | "LIMITED";
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  gsm?: string;
  fit?: string;
  description: string;
  inStock: boolean;
  variants?: any[];
  rawProduct?: any;
}

export interface LookbookCategory {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  itemCount: number;
  accent: string;
  imageAlt: string;
  bgGradient: string;
}

export interface UGCPost {
  id: string;
  author: string;
  handle: string;
  likes: number;
  caption: string;
  taggedProduct: {
    name: string;
    price: number;
    href: string;
    x: number; // percentage coordinate
    y: number; // percentage coordinate
  };
}

export const LOOKBOOK_CATEGORIES: LookbookCategory[] = [
  {
    id: "men-oversized",
    title: "Men's Heavyweight Streetwear",
    subtitle: "380 GSM Drop-Shoulder Tees, Cargos & Hoodies",
    href: "/shop/men/t-shirts",
    itemCount: 24,
    accent: "from-neutral-900 via-neutral-900/80 to-transparent",
    imageAlt: "Minimalist streetwear collection for men",
    bgGradient: "bg-gradient-to-tr from-neutral-950 to-neutral-800",
  },
  {
    id: "women-coords",
    title: "Women's Minimalist Co-ords",
    subtitle: "Two-Piece Knit Sets, Wide Leg Trousers & Ribbed Tops",
    href: "/shop/women/dresses",
    itemCount: 18,
    accent: "from-stone-900 via-stone-900/80 to-transparent",
    imageAlt: "Contemporary women's monochrome apparel",
    bgGradient: "bg-gradient-to-tr from-stone-950 to-stone-800",
  },
  {
    id: "outerwear-drop",
    title: "Architectural Outerwear",
    subtitle: "Heavyweight French Terry & Utility Bombers",
    href: "/shop/men/outerwear",
    itemCount: 12,
    accent: "from-zinc-900 via-zinc-900/80 to-transparent",
    imageAlt: "High-end outerwear and layering pieces",
    bgGradient: "bg-gradient-to-tr from-zinc-950 to-zinc-800",
  },
  {
    id: "lifestyle-accessories",
    title: "Caps & Lifestyle Gear",
    subtitle: "Embroidered 6-Panel Dad Caps & Crossbody Bags",
    href: "/shop/accessories/caps",
    itemCount: 16,
    accent: "from-neutral-900 via-neutral-900/80 to-transparent",
    imageAlt: "Caps, beanies, and everyday carry gear",
    bgGradient: "bg-gradient-to-tr from-neutral-900 to-neutral-800",
  },
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Architectural Minimalist Heavyweight Tee",
    category: "men",
    subcategory: "T-Shirts & Polos",
    price: 1850,
    originalPrice: 2200,
    rating: 4.9,
    reviewsCount: 128,
    badge: "HOT",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
    ],
    colors: [
      { name: "Washed Onyx", hex: "#1c1917" },
      { name: "Off White", hex: "#f5f5f4" },
      { name: "Vintage Olive", hex: "#3f4634" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    gsm: "380 GSM",
    fit: "Boxy Drop-Shoulder Oversized",
    description:
      "Crafted from 100% super-combed organic cotton with double-needle ribbed collar and pre-shrunk wash. Designed for effortless streetwear drape.",
    inStock: true,
  },
  {
    id: "prod-2",
    name: "Heavy French Terry Oversized Hoodie",
    category: "men",
    subcategory: "Jackets & Hoodies",
    price: 3450,
    originalPrice: 3950,
    rating: 5.0,
    reviewsCount: 94,
    badge: "NEW",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80",
    ],
    colors: [
      { name: "Pitch Black", hex: "#0a0a0a" },
      { name: "Heather Slate", hex: "#64748b" },
      { name: "Earth Khaki", hex: "#786d5f" },
    ],
    sizes: ["M", "L", "XL"],
    gsm: "450 GSM",
    fit: "Relaxed Boxy Fit",
    description:
      "Ultra-dense 450 GSM unbrushed loopback cotton fleece. Features double-lined hood with zero drawstrings for clean minimalist aesthetic.",
    inStock: true,
  },
  {
    id: "prod-3",
    name: "Ribbed Knit Crop Top & Trouser Co-ord",
    category: "women",
    subcategory: "Dresses & Co-ords",
    price: 3200,
    originalPrice: 3800,
    rating: 4.8,
    reviewsCount: 67,
    badge: "LIMITED",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=80",
    ],
    colors: [
      { name: "Espresso Brown", hex: "#3e2723" },
      { name: "Cream Oatmeal", hex: "#f5ebe0" },
      { name: "Midnight Black", hex: "#121212" },
    ],
    sizes: ["XS", "S", "M", "L"],
    gsm: "320 GSM",
    fit: "Tailored Sculpted Fit",
    description:
      "A versatile two-piece lounge and streetwear set made with premium stretch rib knit. Fluid wide-leg pants paired with sculpted top.",
    inStock: true,
  },
  {
    id: "prod-4",
    name: "Pleated Wide-Leg Tonal Trousers",
    category: "women",
    subcategory: "Pants & Skirts",
    price: 2850,
    rating: 4.9,
    reviewsCount: 82,
    badge: "NEW",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80",
    ],
    colors: [
      { name: "Charcoal Grey", hex: "#334155" },
      { name: "Raw Umber", hex: "#5c4033" },
    ],
    sizes: ["26", "28", "30", "32"],
    fit: "High-Rise Wide Leg",
    description:
      "Modern tailored trousers with double front pleats and fluid drape. Designed to transition seamlessly from street to smart-casual.",
    inStock: true,
  },
  {
    id: "prod-5",
    name: "Signature 6-Panel Embroidered Dad Cap",
    category: "accessories",
    subcategory: "Caps & Beanies",
    price: 1150,
    originalPrice: 1450,
    rating: 4.9,
    reviewsCount: 215,
    badge: "HOT",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&auto=format&fit=crop&q=80",
    ],
    colors: [
      { name: "Washed Black", hex: "#1f1f1f" },
      { name: "Forest Green", hex: "#1e392a" },
      { name: "Desert Sand", hex: "#d7c9aa" },
    ],
    sizes: ["One Size"],
    description:
      "100% heavy washed cotton twill with low-profile unconstructed crown, antique brass buckle closure, and subtle tonal ZEVON embroidery.",
    inStock: true,
  },
  {
    id: "prod-6",
    name: "Tactical Crossbody Utility Messenger",
    category: "accessories",
    subcategory: "Bags & Wallets",
    price: 1950,
    originalPrice: 2400,
    rating: 4.7,
    reviewsCount: 53,
    badge: "SALE",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    ],
    colors: [
      { name: "Matte Black", hex: "#111111" },
      { name: "Coyote Tan", hex: "#816d55" },
    ],
    sizes: ["One Size"],
    description:
      "Water-resistant Cordura nylon with quick-release Fidlock magnetic buckle and modular compartments for urban everyday carry.",
    inStock: true,
  },
];

export const UGC_POSTS: UGCPost[] = [
  {
    id: "ugc-1",
    author: "Zayan Karim",
    handle: "@zayan.fits",
    likes: 1420,
    caption: "Subtle cuts, unreal weight. The 380 GSM drop is elite. #ZEVON_BD",
    taggedProduct: {
      name: "Architectural Heavyweight Tee",
      price: 1850,
      href: "/products/architectural-minimalist-heavyweight-tee",
      x: 48,
      y: 42,
    },
  },
  {
    id: "ugc-2",
    author: "Nabila Hossain",
    handle: "@nabilastyle",
    likes: 2180,
    caption: "Monochrome elegance for the weekend coffee run ✨ #ZEVON_WOMEN",
    taggedProduct: {
      name: "Ribbed Knit Co-ord Set",
      price: 3200,
      href: "/products/ribbed-knit-crop-top-and-trouser-co-ord",
      x: 52,
      y: 50,
    },
  },
  {
    id: "ugc-3",
    author: "Fahim Ahmed",
    handle: "@fahim_street",
    likes: 980,
    caption: "Daily essentials locked in. Heavy loopback hoodie is unmatched.",
    taggedProduct: {
      name: "French Terry Hoodie",
      price: 3450,
      href: "/products/heavy-french-terry-oversized-hoodie",
      x: 45,
      y: 38,
    },
  },
  {
    id: "ugc-4",
    author: "Maliha Tasnim",
    handle: "@maliha.t",
    likes: 1750,
    caption: "Structured wide-leg trousers from @ZEVON_BD — perfection in every stitch.",
    taggedProduct: {
      name: "Pleated Wide-Leg Trousers",
      price: 2850,
      href: "/products/pleated-wide-leg-tonal-trousers",
      x: 55,
      y: 65,
    },
  },
];

export const BRAND_USPS = [
  {
    icon: "ShieldCheck",
    title: "380+ GSM Combed Cotton",
    description:
      "Ultra-durable, pre-shrunk organic fabrics tailored to retain structure wash after wash.",
  },
  {
    icon: "Zap",
    title: "Express 24-48h Delivery",
    description:
      "Next-day delivery across Dhaka city and rapid nationwide doorstep fulfillment.",
  },
  {
    icon: "RotateCcw",
    title: "7-Day Hassle-Free Returns",
    description:
      "Easy size exchanges and 100% money-back guarantee with doorstep pickup.",
  },
  {
    icon: "Sparkles",
    title: "Engineered in Bangladesh",
    description:
      "World-class garment craftsmanship made locally with ethical sustainable standards.",
  },
];
