/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface CountdownTimer {
  serverTime: string;
  startTime: string;
  endTime: string;
  status: "LIVE" | "UPCOMING" | "ENDED";
  timeRemainingMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface FlashSaleItem {
  id: string;
  discountPrice: number;
  discountPercent?: number | null;
  quantityLimit: number;
  soldCount: number;
  availableStock: number;
  claimPercentage: number;
  isSoldOut: boolean;
  product?: {
    id: string;
    title: string;
    slug: string;
    basePrice: number;
    discountPrice?: number | null;
    category?: {
      id: string;
      name: string;
      slug: string;
    } | null;
    images?: Array<{
      url: string;
      altText?: string | null;
      isPrimary?: boolean;
    }>;
    variants?: Array<{
      id: string;
      sku: string;
      size: string;
      color: string;
      colorCode?: string | null;
      stock: number;
    }>;
  };
}

export interface FlashSaleCampaign {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  bannerUrl?: string | null;
  discountPercent?: number | null;
  startTime: string;
  endTime: string;
  isActive: boolean;
  status: "LIVE" | "UPCOMING" | "ENDED";
  countdown: CountdownTimer;
  items: FlashSaleItem[];
}

export interface FlashSaleResponse {
  statusCode: number;
  message: string;
  data: FlashSaleCampaign | null;
}

export interface UpcomingFlashSalesResponse {
  statusCode: number;
  message: string;
  data: FlashSaleCampaign[];
}

export interface ClaimStockRequest {
  flashSaleId: string;
  productId: string;
  quantity: number;
}

export interface ClaimStockResponse {
  statusCode: number;
  message: string;
  data: {
    claimed: boolean;
    flashSaleId: string;
    productId: string;
    quantityClaimed: number;
    totalSaleStock: number;
    claimedStock: number;
    availableStock: number;
    claimPercentage: number;
    isSoldOut: boolean;
  };
}

export const flashSaleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get currently active LIVE flash sale
    getActiveFlashSale: builder.query<FlashSaleResponse, void>({
      query: () => ({
        url: "/flash-sales/active",
        method: "GET",
      }),
      providesTags: ["FlashSale"],
    }),

    // 2. Get upcoming scheduled flash sales
    getUpcomingFlashSales: builder.query<UpcomingFlashSalesResponse, void>({
      query: () => ({
        url: "/flash-sales/upcoming",
        method: "GET",
      }),
      providesTags: ["FlashSale"],
    }),

    // 3. Get flash sale campaign by slug
    getFlashSaleBySlug: builder.query<FlashSaleResponse, string>({
      query: (slug) => ({
        url: `/flash-sales/slug/${slug}`,
        method: "GET",
      }),
      providesTags: (_res, _err, slug) => [{ type: "FlashSale", id: slug }],
    }),

    // 4. Claim / Reserve flash sale stock allocation
    claimFlashSaleStock: builder.mutation<ClaimStockResponse, ClaimStockRequest>({
      query: ({ flashSaleId, ...body }) => ({
        url: `/flash-sales/${flashSaleId}/claim`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["FlashSale"],
    }),
  }),
});

export const {
  useGetActiveFlashSaleQuery,
  useGetUpcomingFlashSalesQuery,
  useGetFlashSaleBySlugQuery,
  useClaimFlashSaleStockMutation,
} = flashSaleApi;
