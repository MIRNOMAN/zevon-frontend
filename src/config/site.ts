const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://web.mirnoman.com";

export const siteConfig = {
  name: "ZEVON BD | Apparel & Lifestyle — Architectural Streetwear",
  shortName: "ZEVON",
  description:
    "Pioneering high-end streetwear and architectural essentials in Bangladesh. Engineered with 380+ GSM organic cotton.",
  url: siteUrl,
  ogImage: `${siteUrl}/og-image.jpg`,
  creator: "ZEVON",
  authors: [{ name: "ZEVON BD", url: siteUrl }] as {
    name: string;
    url: string;
  }[],
  keywords: [
    "streetwear",
    "bangladesh streetwear",
    "zevon",
    "heavyweight cotton",
    "380 gsm",
    "minimalist fashion",
    "oversized tee",
    "co-ords",
    "hoodies",
  ] as string[],
  links: {
    twitter: "https://twitter.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
