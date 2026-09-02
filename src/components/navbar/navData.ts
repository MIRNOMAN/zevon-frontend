import { NavCategory } from "./types";

export const NAV_CATEGORIES: NavCategory[] = [
  {
    id: "men",
    title: "Men",
    subCategories: [
      {
        title: "T-Shirts & Polos",
        href: "/shop/men/t-shirts",
        description: "Graphic tees, oversized cuts & classic polos",
      },
      {
        title: "Shirts",
        href: "/shop/men/shirts",
        description: "Casual flannel, oxford button-downs & linens",
      },
      {
        title: "Pants & Trousers",
        href: "/shop/men/pants",
        description: "Utility cargos, relaxed chinos & structured joggers",
      },
      {
        title: "Jackets & Hoodies",
        href: "/shop/men/outerwear",
        description: "Heavyweight hoodies, bomber jackets & windbreakers",
      },
    ],
  },
  {
    id: "women",
    title: "Women",
    subCategories: [
      {
        title: "Tops & Tees",
        href: "/shop/women/tops",
        description: "Cropped tees, ribbed tanks & minimal blouses",
      },
      {
        title: "Dresses & Co-ords",
        href: "/shop/women/dresses",
        description: "Everyday midi dresses, two-piece knit sets & co-ords",
      },
      {
        title: "Pants & Skirts",
        href: "/shop/women/bottoms",
        description: "Wide-leg trousers, denim skirts & relaxed bottoms",
      },
    ],
  },
  {
    id: "accessories",
    title: "Accessories",
    subCategories: [
      {
        title: "Caps & Beanies",
        href: "/shop/accessories/caps",
        description: "Embroidered dad caps, snapbacks & ribbed beanies",
      },
      {
        title: "Bags & Wallets",
        href: "/shop/accessories/bags",
        description: "Crossbody bags, canvas totes & leather wallets",
      },
      {
        title: "Belts & Socks",
        href: "/shop/accessories/others",
        description: "Premium woven belts, cushioned socks & lifestyle essentials",
      },
    ],
  },
  {
    id: "new-drops",
    title: "New Drops",
    href: "/shop?filter=new",
    badge: "NEW",
    badgeVariant: "new",
  },
  {
    id: "sale",
    title: "Sale",
    href: "/sale",
    badge: "SALE",
    badgeVariant: "sale",
  },
];

export const PROFILE_MENU_ITEMS = [
  {
    title: "Orders & Tracking",
    href: "/account/orders",
    icon: "Package",
  },
  {
    title: "Saved Addresses",
    href: "/account/addresses",
    icon: "MapPin",
  },
];

export const SEARCH_TRENDING_TAGS = [
  "Oversized Hoodie",
  "Polo T-Shirt",
  "Cargo Pants",
  "Caps & Beanies",
  "Wide Leg Trousers",
  "Summer Drop",
];
