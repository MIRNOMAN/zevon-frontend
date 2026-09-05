import { baseApi } from "./baseApi";

export interface StoreLocationItem {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email?: string | null;
  openingHours: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const storeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStoreLocations: builder.query<ApiResponse<StoreLocationItem[]>, void>({
      query: () => ({
        url: "/stores",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetStoreLocationsQuery } = storeApi;
