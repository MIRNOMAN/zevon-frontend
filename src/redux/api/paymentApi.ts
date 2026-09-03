import { baseApi } from "./baseApi";

export interface CreateCheckoutSessionInput {
  orderId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResult {
  sessionId: string;
  url: string;
  publishableKey?: string;
}

export interface StripeConfigResult {
  publishableKey: string;
  currency: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation<ApiResponse<CheckoutSessionResult>, CreateCheckoutSessionInput>({
      query: (body) => ({
        url: "/payments/checkout-session",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "Payment"],
    }),
    getStripeConfig: builder.query<ApiResponse<StripeConfigResult>, void>({
      query: () => ({
        url: "/payments/config",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetStripeConfigQuery,
} = paymentApi;
