export interface ProductImage {
  id?: string;
  url: string;
  altText?: string | null;
  isPrimary?: boolean;
}

export interface ProductVariant {
  id?: string;
  sku: string;
  color: string;
  colorCode: string;
  size: string;
  stock: number;
  extraPrice?: number | string;
  imageUrl?: string | null;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
}

export interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  images?: string[];
  isVerifiedPurchase?: boolean;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  details?: string | null;
  fabricSpecs?: string | null;
  washCare?: string | null;
  tags?: string[];
  basePrice: number | string;
  discountPrice?: number | string | null;
  categoryId?: string;
  category?: ProductCategory | string;
  gender?: string | null;
  season?: string | null;
  isFeatured?: boolean;
  isPublished?: boolean;
  primaryImage?: ProductImage | null;
  images: (ProductImage | string)[];
  variants?: ProductVariant[];
  totalStock?: number;
  inStock?: boolean;
  availableSizes?: string[];
  availableColors?: { color: string; colorCode: string }[];
  reviewCount?: number;
  averageRating?: number;
  reviews?: ProductReview[];
  ratingBreakdown?: { [key: number]: number };
  createdAt: string;
  updatedAt: string;

  // Convenience / Legacy compatibility aliases
  name?: string;
  price?: number;
  image?: string;
}

export interface ProductQueryFilters {
  page?: number;
  limit?: number;
  pageSize?: number;
  search?: string;
  categorySlug?: string;
  categoryId?: string;
  gender?: string;
  season?: string;
  sizes?: string[];
  size?: string;
  colors?: string[];
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isPublished?: boolean;
  sortBy?: string;
}

export interface ProductListResponse {
  products: Product[];
  data?: Product[];
  total?: number;
  page?: number;
  pageSize?: number;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  facets?: {
    categories?: { id: string; name: string; slug: string; count: number }[];
    colors?: { color: string; colorCode: string; count: number }[];
    sizes?: { size: string; count: number }[];
    priceRange?: { min: number; max: number };
  };
}

export interface CreateProductInput {
  title: string;
  slug?: string;
  description: string;
  details?: string;
  fabricSpecs?: string;
  washCare?: string;
  tags?: string[];
  basePrice: number;
  discountPrice?: number;
  categoryId: string;
  gender?: string;
  season?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}
