/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import type {
  Banner,
  BannerPlacement,
  CreateBannerInput,
  UpdateBannerInput,
  ReorderBannersInput,
} from "@/features/banners";

// ---------------------------------------------------------------------------
// Banner API — Hero slider & Promo Banners
// ---------------------------------------------------------------------------

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Public: Fetch active sorted banners for Home hero slider or sections
    getBanners: builder.query<Banner[], { placement?: BannerPlacement } | void>({
      query: (params) => ({
        url: "/banners",
        params: params?.placement ? { placement: params.placement } : undefined,
      }),
      transformResponse: (response: any): Banner[] => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
      providesTags: (result) =>
        result && result.length > 0
          ? [
              ...result.map(({ id }) => ({ type: "Banner" as const, id })),
              { type: "Banner", id: "LIST" },
            ]
          : [{ type: "Banner", id: "LIST" }],
    }),

    // Public: Get a single banner by ID
    getBannerById: builder.query<Banner, string>({
      query: (id) => `/banners/${id}`,
      transformResponse: (response: any): Banner => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: (_result, _error, id) => [{ type: "Banner", id }],
    }),

    // Admin: Create a new banner slide
    createBanner: builder.mutation<Banner, CreateBannerInput>({
      query: (body) => ({
        url: "/banners",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Banner", id: "LIST" }],
    }),

    // Admin: Update banner information
    updateBanner: builder.mutation<Banner, UpdateBannerInput>({
      query: ({ id, ...data }) => ({
        url: `/banners/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Banner", id },
        { type: "Banner", id: "LIST" },
      ],
    }),

    // Admin: Toggle banner active visibility
    toggleBannerStatus: builder.mutation<Banner, string>({
      query: (id) => ({
        url: `/banners/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Banner", id },
        { type: "Banner", id: "LIST" },
      ],
    }),

    // Admin: Bulk update sort positions for hero slider/banners
    reorderBanners: builder.mutation<Banner[], ReorderBannersInput>({
      query: (body) => ({
        url: "/banners/reorder",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Banner", id: "LIST" }],
    }),

    // Admin: Delete a banner
    deleteBanner: builder.mutation<void, string>({
      query: (id) => ({
        url: `/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Banner", id },
        { type: "Banner", id: "LIST" },
      ],
    }),
  }),
});

// ---------------------------------------------------------------------------
// Auto-generated hooks
// ---------------------------------------------------------------------------

export const {
  useGetBannersQuery,
  useLazyGetBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useToggleBannerStatusMutation,
  useReorderBannersMutation,
  useDeleteBannerMutation,
} = bannerApi;
