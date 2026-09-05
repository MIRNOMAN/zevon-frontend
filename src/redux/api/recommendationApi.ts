import { baseApi } from "./baseApi";

export interface TrackViewInput {
  productId: string;
  sessionId?: string;
}

export interface RecommendationProduct {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  discountPrice?: number | null;
  description?: string;
  tags?: string[];
  totalStock?: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  images?: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
  }>;
  primaryImage?: string;
  variants?: Array<{
    id: string;
    sku: string;
    size: string;
    color: string;
    colorCode?: string;
    stock: number;
    extraPrice?: number;
  }>;
  rating?: number;
  reviewCount?: number;
  similarityScore?: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const recommendationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    trackProductView: builder.mutation<ApiResponse<{ recorded: boolean }>, TrackViewInput>({
      query: (body) => ({
        url: "/recommendations/track-view",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Recommendation"],
    }),
    getRecentlyViewed: builder.query<ApiResponse<{ total: number; items: RecommendationProduct[] }>, { sessionId?: string; limit?: number } | void>({
      query: (params) => ({
        url: "/recommendations/recently-viewed",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Recommendation"],
    }),
    getYouMayAlsoLike: builder.query<ApiResponse<RecommendationProduct[]>, { productId: string; limit?: number }>({
      query: ({ productId, limit = 8 }) => ({
        url: `/recommendations/you-may-also-like/${productId}`,
        method: "GET",
        params: { limit },
      }),
      providesTags: ["Recommendation"],
    }),
    getTrendingRecommendations: builder.query<ApiResponse<RecommendationProduct[]>, { limit?: number } | void>({
      query: (params) => ({
        url: "/recommendations/trending",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Recommendation"],
    }),
  }),
});

export const {
  useTrackProductViewMutation,
  useGetRecentlyViewedQuery,
  useGetYouMayAlsoLikeQuery,
  useGetTrendingRecommendationsQuery,
} = recommendationApi;
