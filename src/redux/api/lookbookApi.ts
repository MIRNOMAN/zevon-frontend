import { baseApi } from "./baseApi";

export interface LookbookHotspot {
  id: string;
  coordinateX: number;
  coordinateY: number;
  product: {
    id: string;
    title: string;
    slug: string;
    basePrice: number;
    discountPrice?: number | null;
    isFeatured?: boolean;
    category?: { id: string; name: string; slug: string };
    images?: Array<{ url: string; altText?: string; isPrimary: boolean }>;
    variants?: Array<{
      id: string;
      size: string;
      color: string;
      stock: number;
    }>;
  };
}

export interface LookbookItem {
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  tags?: string[];
  sortOrder: number;
  isActive: boolean;
  hotspots: LookbookHotspot[];
  createdAt: string;
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
    data: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const lookbookApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveLookbooks: builder.query<PaginatedApiResponse<LookbookItem>, { tag?: string; page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/lookbooks",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Lookbook"],
    }),
    getLookbookBySlug: builder.query<ApiResponse<LookbookItem>, string>({
      query: (slug) => ({
        url: `/lookbooks/slug/${slug}`,
        method: "GET",
      }),
      providesTags: ["Lookbook"],
    }),
  }),
});

export const {
  useGetActiveLookbooksQuery,
  useGetLookbookBySlugQuery,
} = lookbookApi;
