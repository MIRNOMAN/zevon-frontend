import { baseApi } from "./baseApi";

export interface ValidateCouponInput {
  code: string;
  cartSubtotal?: number;
}

export interface CouponData {
  id: string;
  code: string;
  description?: string | null;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface CouponValidationResult {
  isValid: boolean;
  coupon: CouponData;
  originalSubtotal: number;
  discountAmount: number;
  newSubtotal: number;
  savingsMessage: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    validateCoupon: builder.mutation<ApiResponse<CouponValidationResult>, ValidateCouponInput>({
      query: (body) => ({
        url: "/coupons/validate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Coupon"],
    }),
    getCoupons: builder.query<ApiResponse<CouponData[]>, { page?: number; limit?: number; isActive?: boolean; search?: string } | void>({
      query: (params) => ({
        url: "/coupons",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Coupon"],
    }),
  }),
});

export const {
  useValidateCouponMutation,
  useGetCouponsQuery,
  useLazyGetCouponsQuery,
} = couponApi;
