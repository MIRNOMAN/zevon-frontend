import { baseApi } from "./baseApi";

export interface CalculateShippingInput {
  city?: string;
  postalCode?: string;
  shippingZoneId?: string;
  deliveryType?: "STANDARD" | "EXPRESS";
  cartSubtotal?: number;
}

export interface DeliveryOption {
  type: "STANDARD" | "EXPRESS";
  name: string;
  baseRate: number;
  finalRate: number;
  isFree: boolean;
  estimatedDeliveryDays: string;
  description: string;
}

export interface ShippingCalculationResult {
  shippingZone: {
    id: string;
    name: string;
    estimatedDeliveryDays: string;
    isDefault: boolean;
  };
  matchReason: string;
  cartSubtotal: number;
  selectedDeliveryType: "STANDARD" | "EXPRESS";
  shippingCost?: number;
  shippingCharge?: number;
  finalTotal?: number;
  finalOrderTotal?: number;
  freeShipping: {
    isFreeShipping: boolean;
    freeShippingThreshold: number | null;
    amountNeededForFreeShipping: number;
    progressPercent: number;
    message: string;
  };
  deliveryOptions: {
    standard: DeliveryOption;
    express?: DeliveryOption | null;
  };
}

export interface ShippingZone {
  id: string;
  name: string;
  cost: number;
  expressCost: number | null;
  freeShippingThreshold: number | null;
  estimatedDeliveryDays: string;
  isDefault: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const shippingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    calculateShipping: builder.mutation<ApiResponse<ShippingCalculationResult>, CalculateShippingInput | void>({
      query: (body) => ({
        url: "/shipping/calculate",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: ["Shipping"],
    }),
    getPublicShippingZones: builder.query<ApiResponse<ShippingZone[]>, void>({
      query: () => ({
        url: "/shipping/public",
        method: "GET",
      }),
      providesTags: ["Shipping"],
    }),
  }),
});

export const {
  useCalculateShippingMutation,
  useGetPublicShippingZonesQuery,
} = shippingApi;
