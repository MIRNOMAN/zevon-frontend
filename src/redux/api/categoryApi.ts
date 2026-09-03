/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import type {
  Category,
  CategoryTreeItem,
  CategoryQueryFilters,
  CreateCategoryInput,
  UpdateCategoryInput,
  ReorderCategoriesInput,
} from "@/features/categories";

// ---------------------------------------------------------------------------
// Category API — Hierarchical Categories & Mega-Menu
// ---------------------------------------------------------------------------

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Public: Get complete Hierarchical Category Tree for Mega-Menu & Navigation
    getCategoryTree: builder.query<CategoryTreeItem[], void>({
      query: () => "/categories/tree",
      transformResponse: (response: any): CategoryTreeItem[] => {
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
              ...result.map(({ id }) => ({ type: "Category" as const, id })),
              { type: "Category", id: "TREE" },
            ]
          : [{ type: "Category", id: "TREE" }],
    }),

    // Public: List active categories with optional filtering (e.g. onlyRoot, parentId)
    getCategories: builder.query<Category[], CategoryQueryFilters | void>({
      query: (params) => ({
        url: "/categories",
        params: {
          ...(params?.onlyRoot !== undefined ? { onlyRoot: params.onlyRoot } : {}),
          ...(params?.parentId ? { parentId: params.parentId } : {}),
        },
      }),
      transformResponse: (response: any): Category[] => {
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
              ...result.map(({ id }) => ({ type: "Category" as const, id })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    // Public: Get single category by slug with breadcrumbs & subcategories
    getCategoryBySlug: builder.query<Category, string>({
      query: (slug) => `/categories/${slug}`,
      transformResponse: (response: any): Category => {
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
      providesTags: (_result, _error, slug) => [{ type: "Category", id: slug }],
    }),

    // Admin: Create a new category or sub-category
    createCategory: builder.mutation<Category, CreateCategoryInput>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Category", id: "LIST" },
        { type: "Category", id: "TREE" },
      ],
    }),

    // Admin: Update category details
    updateCategory: builder.mutation<Category, UpdateCategoryInput>({
      query: ({ id, ...data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
        { type: "Category", id: "TREE" },
      ],
    }),

    // Admin: Toggle category active status
    toggleCategoryStatus: builder.mutation<Category, string>({
      query: (id) => ({
        url: `/categories/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
        { type: "Category", id: "TREE" },
      ],
    }),

    // Admin: Bulk reorder categories positions
    reorderCategories: builder.mutation<Category[], ReorderCategoriesInput>({
      query: (body) => ({
        url: "/categories/reorder",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        { type: "Category", id: "LIST" },
        { type: "Category", id: "TREE" },
      ],
    }),

    // Admin: Delete a category
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
        { type: "Category", id: "TREE" },
      ],
    }),
  }),
});

// ---------------------------------------------------------------------------
// Auto-generated hooks
// ---------------------------------------------------------------------------

export const {
  useGetCategoryTreeQuery,
  useLazyGetCategoryTreeQuery,
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useToggleCategoryStatusMutation,
  useReorderCategoriesMutation,
  useDeleteCategoryMutation,
} = categoryApi;
