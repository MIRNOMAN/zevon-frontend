/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface SubscribeStockAlertInput {
  productVariantId: string;
  email: string;
  phone?: string;
}

export interface StockAlertSubscription {
  id: string;
  productVariantId: string;
  email: string;
  phone?: string | null;
  status: "PENDING" | "NOTIFIED" | "CANCELLED";
  createdAt: string;
  productVariant?: {
    id: string;
    sku: string;
    color: string;
    colorCode: string;
    size: string;
    stock: number;
    product: {
      id: string;
      title: string;
      slug: string;
    };
  };
}

export interface StockAlertResponse {
  isAlreadyInStock?: boolean;
  message: string;
  subscriptionId?: string;
  status?: string;
  currentStock?: number;
}

export const stockAlertApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    subscribeStockAlert: builder.mutation<StockAlertResponse, SubscribeStockAlertInput>({
      query: (body) => ({
        url: "/stock-alerts/subscribe",
        method: "POST",
        body,
      }),
      transformResponse: (response: any): StockAlertResponse => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: ["StockAlert"],
    }),

    getMyStockAlerts: builder.query<StockAlertSubscription[], void>({
      query: () => "/stock-alerts/my-alerts",
      transformResponse: (response: any): StockAlertSubscription[] => {
        if (response && response.data) {
          return response.data;
        }
        return response || [];
      },
      providesTags: ["StockAlert"],
    }),

    cancelStockAlert: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/stock-alerts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StockAlert"],
    }),
  }),
});

export const {
  useSubscribeStockAlertMutation,
  useGetMyStockAlertsQuery,
  useCancelStockAlertMutation,
} = stockAlertApi;
