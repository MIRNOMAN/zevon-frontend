import { baseApi } from "./baseApi";

export type CustomerTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
export type PointTransactionType =
  | "EARNED_PURCHASE"
  | "REDEEMED_ORDER"
  | "REFERRAL_BONUS"
  | "REVIEW_REWARD"
  | "ADMIN_ADJUSTMENT"
  | "TIER_UPGRADE_BONUS";

export interface PointTransaction {
  id: string;
  points: number;
  type: PointTransactionType;
  description: string;
  orderId?: string | null;
  createdAt: string;
}

export interface TierInfo {
  currentTier: CustomerTier;
  tierName: string;
  tierColor: string;
  multiplier: number;
  totalLifetimeSpendBDT: number;
  nextTier: string | null;
  amountNeededForNextTierBDT: number;
  progressPercent: number;
  perks: string[];
}

export interface LoyaltyAccountData {
  id: string;
  userId: string;
  pointsBalance: number;
  cashValueBDT: number;
  lifetimePoints: number;
  tier: TierInfo;
  transactions: PointTransaction[];
}

export interface RedeemPointsInput {
  points: number;
  orderId?: string;
}

export interface RedeemPointsResult {
  redeemedPoints: number;
  discountAmountBDT: number;
  remainingPoints: number;
  message: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const loyaltyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyLoyaltyAccount: builder.query<ApiResponse<LoyaltyAccountData>, void>({
      query: () => ({
        url: "/loyalty/my-account",
        method: "GET",
      }),
      providesTags: ["Loyalty"],
    }),
    redeemLoyaltyPoints: builder.mutation<ApiResponse<RedeemPointsResult>, RedeemPointsInput>({
      query: (body) => ({
        url: "/loyalty/redeem",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Loyalty", "Cart", "Order"],
    }),
  }),
});

export const {
  useGetMyLoyaltyAccountQuery,
  useRedeemLoyaltyPointsMutation,
} = loyaltyApi;
