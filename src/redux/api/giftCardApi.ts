import { baseApi } from "./baseApi";

export interface PurchaseGiftCardInput {
  amount: number;
  recipientEmail: string;
  recipientName?: string;
  customMessage?: string;
}

export interface CheckGiftCardBalanceInput {
  code: string;
}

export interface GiftCardBalanceResult {
  code: string;
  currentBalance: number;
  initialBalance: number;
  currency: string;
  status: "ACTIVE" | "REDEEMED" | "EXPIRED" | "CANCELLED";
  expiresAt: string;
  recipientName?: string | null;
}

export interface RedeemGiftCardInput {
  code: string;
  orderId?: string;
  amount: number;
}

export interface RedeemGiftCardResult {
  code: string;
  deductedAmount: number;
  remainingBalance: number;
  status: string;
  message: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const giftCardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    purchaseGiftCard: builder.mutation<ApiResponse<any>, PurchaseGiftCardInput>({
      query: (body) => ({
        url: "/gift-cards/purchase",
        method: "POST",
        body,
      }),
      invalidatesTags: ["GiftCard", "Order"],
    }),
    checkGiftCardBalance: builder.mutation<ApiResponse<GiftCardBalanceResult>, CheckGiftCardBalanceInput>({
      query: (body) => ({
        url: "/gift-cards/check-balance",
        method: "POST",
        body,
      }),
    }),
    redeemGiftCard: builder.mutation<ApiResponse<RedeemGiftCardResult>, RedeemGiftCardInput>({
      query: (body) => ({
        url: "/gift-cards/redeem",
        method: "POST",
        body,
      }),
      invalidatesTags: ["GiftCard", "Order", "Cart"],
    }),
  }),
});

export const {
  usePurchaseGiftCardMutation,
  useCheckGiftCardBalanceMutation,
  useRedeemGiftCardMutation,
} = giftCardApi;
