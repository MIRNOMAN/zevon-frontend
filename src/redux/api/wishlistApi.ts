/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import type { Product } from "@/features/products";

export interface WishlistItem {
  wishlistId: string;
  addedAt: string;
  product: Product;
}

export interface WishlistResponse {
  items: WishlistItem[];
  totalCount: number;
}

export interface ToggleWishlistResponse {
  productId: string;
  inWishlist: boolean;
  action: "ADDED" | "REMOVED";
  message: string;
}

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistResponse, void>({
      query: () => "/wishlists",
      transformResponse: (response: any): WishlistResponse => {
        if (response && response.data) {
          return response.data;
        }
        return response || { items: [], totalCount: 0 };
      },
      providesTags: ["Wishlist"],
    }),

    checkWishlist: builder.query<{ productId: string; inWishlist: boolean }, string>({
      query: (productId) => `/wishlists/check/${productId}`,
      transformResponse: (response: any) => {
        if (response && response.data) {
          return response.data;
        }
        return response || { productId: "", inWishlist: false };
      },
      providesTags: (_result, _error, productId) => [{ type: "Wishlist", id: productId }],
    }),

    toggleWishlist: builder.mutation<ToggleWishlistResponse, string>({
      query: (productId) => ({
        url: "/wishlists/toggle",
        method: "POST",
        body: { productId },
      }),
      transformResponse: (response: any): ToggleWishlistResponse => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: ["Wishlist"],
    }),

    clearWishlist: builder.mutation<{ clearedCount: number; message: string }, void>({
      query: () => ({
        url: "/wishlists",
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useCheckWishlistQuery,
  useToggleWishlistMutation,
  useClearWishlistMutation,
} = wishlistApi;
