import { baseApi } from "./baseApi";

export interface SustainabilityStoryItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImageUrl: string;
  publishedAt?: string | null;
  isPublished: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const sustainabilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSustainabilityStories: builder.query<ApiResponse<SustainabilityStoryItem[]>, void>({
      query: () => ({
        url: "/sustainability",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSustainabilityStoriesQuery } = sustainabilityApi;
