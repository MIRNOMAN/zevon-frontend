/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface CartVariantInfo {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorCode: string;
  extraPrice: number;
  imageUrl?: string | null;
}

export interface CartProductInfo {
  id: string;
  title: string;
  slug: string;
  category?: { id: string; name: string; slug: string } | string;
  primaryImage?: { url: string; altText?: string | null; isPrimary: boolean } | string | null;
}

export interface CartLineItem {
  id: string;
  quantity: number;
  unitPrice: number;
  originalUnitPrice: number;
  itemTotal: number;
  inStock: boolean;
  isQuantityAvailable: boolean;
  availableStock: number;
  variant: CartVariantInfo;
  product: CartProductInfo;
}

export interface CartSummary {
  uniqueItemCount: number;
  totalItems: number;
  subtotal: number;
  originalSubtotal: number;
  totalSavings: number;
  qualifiesForFreeShipping: boolean;
  freeShippingThreshold: number;
  amountUntilFreeShipping: number;
  hasOutOfStockItems: boolean;
}

export interface CartResponse {
  cartId: string;
  items: CartLineItem[];
  summary: CartSummary;
}

export interface AddToCartPayload {
  productVariantId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  cartItemId: string;
  quantity: number;
}

export interface SyncCartPayload {
  items: Array<{
    productVariantId: string;
    quantity: number;
  }>;
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, void>({
      query: () => "/carts",
      transformResponse: (response: any): CartResponse => {
        if (response && response.data) {
          return response.data;
        }
        return response || {
          cartId: "",
          items: [],
          summary: {
            uniqueItemCount: 0,
            totalItems: 0,
            subtotal: 0,
            originalSubtotal: 0,
            totalSavings: 0,
            qualifiesForFreeShipping: false,
            freeShippingThreshold: 2500,
            amountUntilFreeShipping: 2500,
            hasOutOfStockItems: false,
          },
        };
      },
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<CartResponse, AddToCartPayload>({
      query: (body) => ({
        url: "/carts/items",
        method: "POST",
        body,
      }),
      transformResponse: (response: any): CartResponse => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation<CartResponse, UpdateCartItemPayload>({
      query: ({ cartItemId, quantity }) => ({
        url: `/carts/items/${cartItemId}`,
        method: "PATCH",
        body: { quantity },
      }),
      transformResponse: (response: any): CartResponse => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: builder.mutation<CartResponse, string>({
      query: (cartItemId) => ({
        url: `/carts/items/${cartItemId}`,
        method: "DELETE",
      }),
      transformResponse: (response: any): CartResponse => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<CartResponse, void>({
      query: () => ({
        url: "/carts/clear",
        method: "DELETE",
      }),
      transformResponse: (response: any): CartResponse => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: ["Cart"],
    }),

    syncCart: builder.mutation<CartResponse, SyncCartPayload>({
      query: (body) => ({
        url: "/carts/sync",
        method: "POST",
        body,
      }),
      transformResponse: (response: any): CartResponse => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useSyncCartMutation,
} = cartApi;
