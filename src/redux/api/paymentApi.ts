import { baseApi } from "./baseApi";

export interface CreateCheckoutSessionInput {
  orderId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResult {
  sessionId: string;
  url?: string;
  sessionUrl?: string;
  publishableKey?: string;
}

export interface VerifySessionResult {
  paid: boolean;
  status: string;
  orderId?: string;
  orderNumber?: string;
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
    verifyPaymentSession: builder.query<ApiResponse<VerifySessionResult>, string>({
      query: (sessionId) => ({
        url: `/payments/verify/${sessionId}`,
        method: "GET",
      }),
      providesTags: ["Payment", "Order"],
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
  useVerifyPaymentSessionQuery,
  useGetStripeConfigQuery,
} = paymentApi;

