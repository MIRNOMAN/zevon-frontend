/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import type {
  Product,
  ProductListResponse,
  ProductQueryFilters,
  CreateProductInput,
} from "@/features/products";

// ---------------------------------------------------------------------------
// Product API — Storefront catalog, category filters, and detail endpoints
// ---------------------------------------------------------------------------

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResponse, ProductQueryFilters | void>({
      query: (params) => ({
        url: "/products",
        params: params ? (params as Record<string, any>) : undefined,
      }),
      transformResponse: (response: any): ProductListResponse => {
        if (response && response.data) {
          const data = response.data;
          if (Array.isArray(data)) {
            return {
              products: data,
              meta: { total: data.length, page: 1, limit: data.length, totalPages: 1 },
            };
          }
          if (Array.isArray(data.products)) {
            return data;
          }
        }
        if (response && Array.isArray(response.products)) {
          return response;
        }
        if (Array.isArray(response)) {
          return {
            products: response,
            meta: { total: response.length, page: 1, limit: response.length, totalPages: 1 },
          };
        }
        return {
          products: [],
          meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
        };
      },
      providesTags: (result) =>
        result && result.products.length > 0
          ? [
              ...result.products.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getProductBySlug: builder.query<Product, string>({
      query: (slug) => `/products/${slug}`,
      transformResponse: (response: any): Product => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: (_result, _error, slug) => [{ type: "Product", id: slug }],
    }),

    createProduct: builder.mutation<Product, CreateProductInput>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation<Product, { slug: string; data: Partial<CreateProductInput> }>({
      query: ({ slug, data }) => ({
        url: `/products/${slug}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { slug }) => [
        { type: "Product", id: slug },
        { type: "Product", id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (slug) => ({
        url: `/products/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, slug) => [
        { type: "Product", id: slug },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
});

// ---------------------------------------------------------------------------
// Auto-generated hooks
// ---------------------------------------------------------------------------

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
