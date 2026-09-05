import { baseApi } from "./baseApi";

export interface ReferralProgramInfo {
  giveRewardBDT: number;
  getRewardBDT: number;
  pointsEquivalent: number;
}

export interface ReferralStatsData {
  totalFriendsInvited: number;
  successfulOrders: number;
  totalPointsEarned: number;
  totalCashValueBDT: number;
}

export interface MyReferralStatsResponse {
  referralCode: string;
  referralLink: string;
  program: ReferralProgramInfo;
  stats: ReferralStatsData;
}

export interface ApplyReferralInput {
  referralCode: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const referralApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyReferralStats: builder.query<ApiResponse<MyReferralStatsResponse>, void>({
      query: () => ({
        url: "/referrals/my-stats",
        method: "GET",
      }),
      providesTags: ["Referral"],
    }),
    applyReferralCode: builder.mutation<ApiResponse<any>, ApplyReferralInput>({
      query: (body) => ({
        url: "/referrals/apply",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Referral", "User"],
    }),
  }),
});

export const {
  useGetMyReferralStatsQuery,
  useApplyReferralCodeMutation,
} = referralApi;
