import { baseApi } from "./baseApi";

export type PaymentMethod = "COD" | "BKASH" | "NAGAD" | "SSLCOMMERZ" | "STRIPE";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface AddressSnapshot {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country?: string;
}

export interface CheckoutInput {
  shippingAddressId?: string;
  shippingAddress?: AddressSnapshot;
  billingAddressId?: string;
  billingAddress?: AddressSnapshot;
  shippingZoneId?: string;
  deliveryType?: "STANDARD" | "EXPRESS";
  couponCode?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface OrderItem {
  id: string;
  orderId?: string;
  productId?: string;
  variantId?: string;
  productVariantId?: string;
  productTitle: string;
  sku?: string;
  variantSku?: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  productImage?: string;
  product?: {
    id?: string;
    title?: string;
    slug?: string;
    images?: Array<{ url: string; isPrimary?: boolean } | string>;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  totalAmount: number;
  couponId?: string | null;
  shippingAddress: AddressSnapshot;
  billingAddress?: AddressSnapshot;
  notes?: string | null;
  courierName?: string | null;
  trackingNumber?: string | null;
  itemCount?: number;
  items: OrderItem[];
  shippingZone?: {
    id?: string;
    name?: string;
    estimatedDeliveryDays?: string;
  };
  coupon?: {
    id?: string;
    code?: string;
    discountType?: string;
    discountValue?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TrackOrderInput {
  orderNumber: string;
  emailOrPhone: string;
}

export interface TrackOrderResult {
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  courierName?: string;
  trackingNumber?: string;
  currentStep: number;
  steps: {
    status: OrderStatus;
    label: string;
    description: string;
    isCompleted: boolean;
    isCurrent: boolean;
    timestamp?: string;
  }[];
  shippingAddress: AddressSnapshot;
  items: OrderItem[];
  totalAmount: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedOrders {
  orders: Order[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation<ApiResponse<Order>, CheckoutInput>({
      query: (body) => ({
        url: "/orders/checkout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "Cart", "Wishlist"],
    }),
    getMyOrders: builder.query<ApiResponse<PaginatedOrders | Order[]>, { page?: number; limit?: number; status?: string } | void>({
      query: (params) => ({
        url: "/orders/my-orders",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Order"],
    }),
    getMyOrderById: builder.query<ApiResponse<Order>, string>({
      query: (id) => ({
        url: `/orders/my-orders/${id}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    cancelMyOrder: builder.mutation<ApiResponse<Order>, string>({
      query: (id) => ({
        url: `/orders/my-orders/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Order", "Cart"],
    }),
    trackOrder: builder.mutation<ApiResponse<TrackOrderResult>, TrackOrderInput>({
      query: (body) => ({
        url: "/orders/track",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCheckoutMutation,
  useGetMyOrdersQuery,
  useGetMyOrderByIdQuery,
  useCancelMyOrderMutation,
  useTrackOrderMutation,
} = orderApi;
