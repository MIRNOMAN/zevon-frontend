export const CATEGORY_NAME_KEYS: Record<string, string> = {
  men: "categories.menTitle",
  women: "categories.womenTitle",
  outerwear: "categories.outerwearTitle",
  accessories: "categories.accessoriesTitle",
  "men-t-shirts": "categories.menTshirts",
  "men-hoodies": "categories.menHoodies",
  "men-pants": "categories.menPants",
  "men-coords": "categories.menCoords",
  "women-coords": "categories.womenCoords",
  "women-dresses": "categories.womenDresses",
  "women-tops": "categories.womenTops",
  "women-trousers": "categories.womenTrousers",
  "jackets-bombers": "categories.outerwearJackets",
  "trench-overcoats": "categories.outerwearTrench",
  blazers: "categories.outerwearBlazers",
  "caps-headwear": "categories.accessoriesCaps",
  "bags-wallets": "categories.accessoriesBags",
  jewelry: "categories.accessoriesJewelry",
};

export const CATEGORY_DESC_KEYS: Record<string, string> = {
  men: "categories.menDesc",
  women: "categories.womenDesc",
  outerwear: "categories.outerwearDesc",
  accessories: "categories.accessoriesDesc",
  "men-t-shirts": "categories.menTshirtsDesc",
  "men-hoodies": "categories.menHoodiesDesc",
  "men-pants": "categories.menPantsDesc",
  "men-coords": "categories.menCoordsDesc",
  "women-coords": "categories.womenCoordsDesc",
  "women-dresses": "categories.womenDressesDesc",
  "women-tops": "categories.womenTopsDesc",
  "women-trousers": "categories.womenTrousersDesc",
  "jackets-bombers": "categories.outerwearJacketsDesc",
  "trench-overcoats": "categories.outerwearTrenchDesc",
  blazers: "categories.outerwearBlazersDesc",
  "caps-headwear": "categories.accessoriesCapsDesc",
  "bags-wallets": "categories.accessoriesBagsDesc",
  jewelry: "categories.accessoriesJewelryDesc",
};

export function getCategoryI18nName(
  slug: string,
  defaultName: string,
  t: (key: string, fallback?: string) => string
): string {
  if (slug === "men") return t("nav.men", defaultName);
  if (slug === "women") return t("nav.women", defaultName);
  if (slug === "outerwear") return t("nav.outerwear", defaultName);
  if (slug === "accessories") return t("nav.accessories", defaultName);

  const key = CATEGORY_NAME_KEYS[slug];
  return key ? t(key, defaultName) : defaultName;
}

export function getCategoryI18nDesc(
  slug: string,
  defaultDesc: string | undefined,
  t: (key: string, fallback?: string) => string
): string | undefined {
  const key = CATEGORY_DESC_KEYS[slug];
  return key ? t(key, defaultDesc) : defaultDesc;
}

const BENGALI_NUMERALS: Record<string, string> = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
};

export function toBengaliDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (w) => BENGALI_NUMERALS[w] || w);
}

export function formatPrice(
  amount: number | string,
  language: "en" | "bn" = "en"
): string {
  const num = typeof amount === "number" ? amount : parseFloat(String(amount)) || 0;
  const formatted = num.toLocaleString("en-US");
  if (language === "bn") {
    return `৳${toBengaliDigits(formatted)}`;
  }
  return `৳${formatted}`;
}
