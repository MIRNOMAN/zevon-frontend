import { NavCategory } from "./types";

export const NAV_CATEGORIES: NavCategory[] = [
  {
    id: "men",
    title: "Men",
    href: "/men",
    subCategories: [
      {
        title: "T-Shirts & Tops",
        href: "/shop?category=men-t-shirts",
        description: "Graphic tees, oversized 380+ GSM cuts & classic polos",
      },
      {
        title: "Hoodies & Sweatshirts",
        href: "/shop?category=men-hoodies",
        description: "Heavyweight brushed fleece and acid wash hoodies",
      },
      {
        title: "Pants & Cargos",
        href: "/shop?category=men-pants",
        description: "Utility cargos, wide-leg trousers & relaxed joggers",
      },
      {
        title: "Co-ords & Sets",
        href: "/shop?category=men-coords",
        description: "Minimalist matching top and bottom sets",
      },
    ],
  },
  {
    id: "women",
    title: "Women",
    href: "/women",
    subCategories: [
      {
        title: "Co-ords & Matching Sets",
        href: "/shop?category=women-coords",
        description: "Two-piece knit sets, wide-leg ribbed trousers & tops",
      },
      {
        title: "Dresses & Jumpsuits",
        href: "/shop?category=women-dresses",
        description: "Architectural column slip dresses & minimal midi silhouettes",
      },
      {
        title: "Tops & Baby Tees",
        href: "/shop?category=women-tops",
        description: "Sculpted crop tops, ribbed tanks & organic cotton tees",
      },
      {
        title: "Trousers & Skirts",
        href: "/shop?category=women-trousers",
        description: "High-waisted tailored pleated trousers & column skirts",
      },
    ],
  },
  {
    id: "outerwear",
    title: "Outerwear",
    href: "/shop?category=outerwear",
    subCategories: [
      {
        title: "Jackets & Bombers",
        href: "/shop?category=jackets-bombers",
        description: "Matte flight bombers, leather jackets & windbreakers",
      },
      {
        title: "Trench & Overcoats",
        href: "/shop?category=trench-overcoats",
        description: "Structured double-breasted coats & tailored trench",
      },
      {
        title: "Blazers",
        href: "/shop?category=blazers",
        description: "Oversized minimalist tailored blazers",
      },
    ],
  },
  {
    id: "accessories",
    title: "Accessories",
    href: "/shop?category=accessories",
    subCategories: [
      {
        title: "Caps & Headwear",
        href: "/shop?category=caps-headwear",
        description: "Enzyme-washed canvas dad caps & ribbed beanies",
      },
      {
        title: "Bags & Wallets",
        href: "/shop?category=bags-wallets",
        description: "Minimalist totes, crossbody rigs & leather goods",
      },
      {
        title: "Jewelry & Silverware",
        href: "/shop?category=jewelry",
        description: "925 silver chains, signet rings & minimalist cuffs",
      },
    ],
  },
  {
    id: "new-drops",
    title: "New Drops",
    href: "/shop?filter=new",
    badge: "SS/26",
    badgeVariant: "new",
  },
  {
    id: "sale",
    title: "Sale",
    href: "/sale",
    badge: "Hot",
    badgeVariant: "sale",
  },
];

export const SEARCH_TRENDING_TAGS = [
  "380 GSM",
  "Oversized",
  "Hoodie",
  "Co-ord",
  "Cargo Pants",
  "Maxi Dress",
  "Crop Top",
  "Bomber",
];
