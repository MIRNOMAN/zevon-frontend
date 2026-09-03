export interface SubCategory {
  title: string;
  href: string;
  description?: string;
  badge?: string;
  productCount?: number;
}

export interface NavCategory {
  id: string;
  title: string;
  href?: string;
  badge?: string;
  badgeVariant?: "sale" | "new" | "default";
  subCategories?: SubCategory[];
  productCount?: number;
}

export interface ProfileMenuItem {
  title: string;
  href?: string;
  icon?: string;
  isDanger?: boolean;
  onClick?: () => void;
}

export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image?: string;
}
