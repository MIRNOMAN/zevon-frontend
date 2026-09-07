/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface AbandonedCartUser {
  id: string;
  name: string | null;
  email: string;
  phone?: string | null;
}

export interface AbandonedCartSummaryItem {
  id: string;
  user: AbandonedCartUser | null;
  itemsCount: number;
  abandonedEmailSentAt: string | null;
  abandonedEmailCount: number;
  lastActiveAt: string;
}

export interface AbandonedCartsResponse {
  totalAbandoned: number;
  carts: AbandonedCartSummaryItem[];
}

export interface TriggerRecoveryResponse {
  scannedCartsCount: number;
  dispatchedRecoveryEmails: number;
  timestamp: string;
}

export const abandonedCartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAbandonedCarts: builder.query<AbandonedCartsResponse, void>({
      query: () => "/abandoned-carts",
      transformResponse: (response: any): AbandonedCartsResponse => {
        if (response && response.data) {
          return response.data;
        }
        return response || { totalAbandoned: 0, carts: [] };
      },
      providesTags: ["AbandonedCart"],
    }),

    triggerCartRecovery: builder.mutation<TriggerRecoveryResponse, void>({
      query: () => ({
        url: "/abandoned-carts/trigger-recovery",
        method: "POST",
      }),
      transformResponse: (response: any): TriggerRecoveryResponse => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
      invalidatesTags: ["AbandonedCart"],
    }),
  }),
});

export const {
  useGetAbandonedCartsQuery,
  useLazyGetAbandonedCartsQuery,
  useTriggerCartRecoveryMutation,
} = abandonedCartApi;
