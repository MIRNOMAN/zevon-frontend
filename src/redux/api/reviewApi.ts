/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface ReviewUser {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

export interface ReviewItem {
  id: string;
  userId?: string;
  productId?: string;
  rating: number;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt?: string;
  user?: ReviewUser;
}

export interface RatingAggregate {
  averageRating: number;
  totalReviews: number;
  breakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ProductReviewsResponse {
  aggregate: RatingAggregate;
  reviews: ReviewItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateReviewInput {
  productId: string;
  rating: number;
  comment: string;
  images?: string[];
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query<ProductReviewsResponse, { productId: string; page?: number; sortBy?: string }>({
      query: ({ productId, page = 1, sortBy = "NEWEST" }) => ({
        url: `/reviews/product/${productId}?page=${page}&sortBy=${sortBy}`,
      }),
      transformResponse: (response: any): ProductReviewsResponse => {
        if (response && response.data) {
          return response.data;
        }
        return response || {
          aggregate: { averageRating: 5.0, totalReviews: 0, breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
          reviews: [],
          meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
        };
      },
      providesTags: (_result, _error, { productId }) => [{ type: "Review", id: productId }],
    }),

    createReview: builder.mutation<{ review: ReviewItem; productAggregate: RatingAggregate }, CreateReviewInput>({
      query: (body) => ({
        url: "/reviews",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Review", id: productId },
        "Product",
      ],
    }),

    checkReviewEligibility: builder.query<{ isEligible: boolean; hasReviewed: boolean; message: string }, string>({
      query: (productId) => `/reviews/eligibility/${productId}`,
      transformResponse: (response: any) => {
        if (response && response.data) {
          return response.data;
        }
        return response || { isEligible: true, hasReviewed: false, message: "" };
      },
    }),

    getMyReviews: builder.query<ReviewItem[], void>({
      query: () => "/reviews/me",
      transformResponse: (response: any): ReviewItem[] => {
        if (response && response.data) {
          return response.data;
        }
        return response || [];
      },
      providesTags: ["Review"],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useCheckReviewEligibilityQuery,
  useGetMyReviewsQuery,
} = reviewApi;
