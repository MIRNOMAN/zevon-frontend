import { baseApi } from "./baseApi";

export type ReturnResolution = "REFUND" | "EXCHANGE";
export type ReturnStatus =
  | "PENDING"
  | "APPROVED"
  | "IN_TRANSIT"
  | "RECEIVED"
  | "COMPLETED"
  | "REJECTED";

export interface ReturnItemInfo {
  id: string;
  orderItemId: string;
  productTitle: string;
  sku?: string;
  size?: string;
  color?: string;
  quantity: number;
  totalPrice: number;
}

export interface ReturnRequestItem {
  id: string;
  returnReference: string;
  orderId: string;
  orderNumber?: string;
  orderItemId: string;
  reason: string;
  resolution: ReturnResolution;
  status: ReturnStatus;
  exchangeVariantId?: string | null;
  adminNotes?: string | null;
  rejectionReason?: string | null;
  refundAmount?: number | null;
  trackingNumber?: string | null;
  courierName?: string | null;
  pickupAddress?: Record<string, any> | null;
  proofImages?: string[];
  createdAt: string;
  updatedAt: string;
  order?: {
    id: string;
    orderNumber: string;
    createdAt: string;
  };
  orderItem?: {
    id: string;
    productTitle: string;
    sku?: string;
    size?: string;
    color?: string;
    quantity: number;
    totalPrice: number;
  };
}

export interface TrackReturnInput {
  returnReference: string;
  emailOrPhone: string;
}

export interface TrackReturnResponse {
  returnReference: string;
  status: ReturnStatus;
  resolution: ReturnResolution;
  orderNumber: string;
  reason: string;
  trackingNumber?: string;
  courierName?: string;
  refundAmount?: number;
  adminNotes?: string;
  rejectionReason?: string;
  stepper: Array<{
    title: string;
    completed: boolean;
    current: boolean;
    date?: string;
    description?: string;
  }>;
  item: {
    productTitle: string;
    sku?: string;
    size?: string;
    color?: string;
    quantity: number;
    totalPrice: number;
  };
  createdAt: string;
}

export interface CreateReturnInput {
  orderId: string;
  orderItemId: string;
  reason: string;
  resolution?: ReturnResolution;
  exchangeVariantId?: string;
  proofImages?: string[];
  pickupAddress?: {
    street?: string;
    city?: string;
    postalCode?: string;
    phone?: string;
    email?: string;
  };
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    items: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const returnApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    trackReturn: builder.mutation<ApiResponse<TrackReturnResponse>, TrackReturnInput>({
      query: (body) => ({
        url: "/returns/track",
        method: "POST",
        body,
      }),
    }),
    createReturn: builder.mutation<ApiResponse<ReturnRequestItem>, CreateReturnInput>({
      query: (body) => ({
        url: "/returns",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Return", "Order"],
    }),
    getMyReturns: builder.query<PaginatedApiResponse<ReturnRequestItem>, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/returns/my-returns",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Return"],
    }),
    getMyReturnById: builder.query<ApiResponse<ReturnRequestItem>, string>({
      query: (id) => ({
        url: `/returns/my-returns/${id}`,
        method: "GET",
      }),
      providesTags: ["Return"],
    }),
  }),
});

export const {
  useTrackReturnMutation,
  useCreateReturnMutation,
  useGetMyReturnsQuery,
  useGetMyReturnByIdQuery,
} = returnApi;
