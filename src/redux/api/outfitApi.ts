import { baseApi } from "./baseApi";

export interface OutfitSlotItem {
  slotId: string;
  slot: string;
  positionX: number;
  positionY: number;
  zIndex: number;
  scale: number;
  product: {
    id: string;
    title: string;
    slug: string;
    category?: { id: string; name: string; slug: string };
    basePrice: number;
    discountPrice?: number | null;
    effectivePrice: number;
    fabricWeave?: string;
    primaryImage: string | null;
    allImages?: string[];
    defaultVariant?: {
      id: string;
      sku: string;
      color: string;
      colorCode?: string;
      size: string;
      stock: number;
      inStock: boolean;
      imageUrl?: string | null;
    } | null;
    availableVariants: Array<{
      id: string;
      sku: string;
      color: string;
      colorCode?: string;
      size: string;
      stock: number;
      inStock: boolean;
      extraPrice: number;
      imageUrl?: string | null;
    }>;
  };
}

export interface OutfitData {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  occasion?: string;
  gender?: string;
  bundleDiscountPercent: number;
  tags?: string[];
  viewsCount: number;
  itemCount: number;
  itemsSubtotal: number;
  bundlePrice: number;
  savingsAmount: number;
  slots: OutfitSlotItem[];
}

export interface CalculateOutfitInput {
  outfitId: string;
  selectedVariantIds: string[];
}

export interface CalculateOutfitResult {
  outfitId: string;
  selectedCount: number;
  totalSlots: number;
  itemsSubtotal: number;
  bundleDiscountPercent: number;
  bundleDiscountAmount: number;
  finalBundleTotal: number;
  qualifiesForBundleDiscount: boolean;
  inventoryStatus: {
    allInStock: boolean;
    outOfStockCount: number;
  };
  items: Array<{
    variantId: string;
    productTitle: string;
    sku: string;
    size: string;
    color: string;
    price: number;
    inStock: boolean;
    stock: number;
  }>;
}

export interface BundleToCartInput {
  outfitId: string;
  selectedVariants: Array<{
    productVariantId: string;
    quantity?: number;
  }>;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    data: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const outfitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOutfits: builder.query<PaginatedApiResponse<OutfitData>, { page?: number; limit?: number; occasion?: string; gender?: string; search?: string } | void>({
      query: (params) => ({
        url: "/outfits",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Outfit"],
    }),
    getOutfitBySlugOrId: builder.query<ApiResponse<OutfitData>, string>({
      query: (idOrSlug) => ({
        url: `/outfits/${idOrSlug}`,
        method: "GET",
      }),
      providesTags: ["Outfit"],
    }),
    calculateOutfitTotal: builder.mutation<ApiResponse<CalculateOutfitResult>, CalculateOutfitInput>({
      query: (body) => ({
        url: "/outfits/calculate-total",
        method: "POST",
        body,
      }),
    }),
    addOutfitBundleToCart: builder.mutation<ApiResponse<{ addedItemsCount: number; cartSubtotal: number }>, BundleToCartInput>({
      query: (body) => ({
        url: "/outfits/bundle-to-cart",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart", "Outfit"],
    }),
    getMySavedOutfits: builder.query<ApiResponse<OutfitData[]>, void>({
      query: () => ({
        url: "/outfits/user/my-outfits",
        method: "GET",
      }),
      providesTags: ["Outfit"],
    }),
  }),
});

export const {
  useGetOutfitsQuery,
  useGetOutfitBySlugOrIdQuery,
  useCalculateOutfitTotalMutation,
  useAddOutfitBundleToCartMutation,
  useGetMySavedOutfitsQuery,
} = outfitApi;
