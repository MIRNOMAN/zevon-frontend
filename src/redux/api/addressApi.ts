import { baseApi } from "./baseApi";

export interface Address {
  id: string;
  userId: string;
  type: "SHIPPING" | "BILLING";
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressInput {
  type?: "SHIPPING" | "BILLING";
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

export interface UpdateAddressInput extends Partial<CreateAddressInput> {
  id: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<ApiResponse<Address[]>, { type?: "SHIPPING" | "BILLING" } | void>({
      query: (params) => ({
        url: "/addresses",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Address"],
    }),
    createAddress: builder.mutation<ApiResponse<Address>, CreateAddressInput>({
      query: (body) => ({
        url: "/addresses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Address"],
    }),
    updateAddress: builder.mutation<ApiResponse<Address>, UpdateAddressInput>({
      query: ({ id, ...body }) => ({
        url: `/addresses/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Address"],
    }),
    setDefaultAddress: builder.mutation<ApiResponse<Address>, string>({
      query: (id) => ({
        url: `/addresses/${id}/default`,
        method: "PATCH",
      }),
      invalidatesTags: ["Address"],
    }),
    deleteAddress: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
