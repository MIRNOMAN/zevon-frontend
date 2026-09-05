/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface ParsedVoiceIntent {
  detectedColors: string[];
  detectedGarments: string[];
  detectedFabrics: string[];
  detectedOccasions: string[];
  detectedGender: string | null;
  detectedSizes: string[];
  priceFilter: { min: number | null; max: number | null } | null;
}

export interface VoiceSearchMatchedProduct {
  id: string;
  title: string;
  slug: string;
  category: { id: string; name: string; slug: string } | null;
  basePrice: number;
  discountPrice: number | null;
  effectivePrice: number;
  primaryImage: string | null;
  images: Array<{ id?: string; url: string; isPrimary?: boolean }>;
  fabricWeave?: string | null;
  hoverVideoUrl?: string | null;
  inStock: boolean;
  matchScore: number;
  matchedVariant?: {
    id: string;
    color: string;
    colorCode: string | null;
    size: string;
    imageUrl?: string | null;
  } | null;
}

export interface VoiceSearchResponse {
  statusCode: number;
  message: string;
  data: {
    query: string;
    parsedIntent: ParsedVoiceIntent;
    resultsCount: number;
    data: VoiceSearchMatchedProduct[];
  };
}

export interface VoiceSearchRequest {
  query: string;
  gender?: string;
  limit?: number;
}

export interface VisualProfile {
  dominantColorHex: string;
  dominantColorName: string;
  palette: string[];
  detectedTone: string;
  textureKeyword: string | null;
}

export interface VisualSearchMatchedProduct {
  id: string;
  title: string;
  slug: string;
  category: { id: string; name: string; slug: string } | null;
  basePrice: number;
  discountPrice: number | null;
  effectivePrice: number;
  primaryImage: string | null;
  fabricWeave?: string | null;
  hoverVideoUrl?: string | null;
  similarityScore: number;
  visualMatchReason: string;
  matchedVariant?: {
    id: string;
    color: string;
    colorCode: string | null;
    size: string;
    imageUrl?: string | null;
  } | null;
}

export interface VisualSearchResponse {
  statusCode: number;
  message: string;
  data: {
    visualProfile: VisualProfile;
    resultsCount: number;
    data: VisualSearchMatchedProduct[];
  };
}

export interface VisualSearchRequest {
  image?: File;
  imageUrl?: string;
  hexColor?: string;
  categoryHint?: string;
  limit?: number;
}

export interface ComplementarySuggestion {
  id: string;
  title: string;
  slug: string;
  category: { id: string; name: string; slug: string } | null;
  basePrice: number;
  discountPrice: number | null;
  effectivePrice: number;
  primaryImage: string | null;
  harmonyScore: number;
  styleAdvice: string;
  matchingVariant?: {
    id: string;
    color: string;
    colorCode: string | null;
    size: string;
    imageUrl?: string | null;
  } | null;
}

export interface ComplementaryResponse {
  statusCode: number;
  message: string;
  data: {
    sourceProductId: string;
    pairingAdvice: string;
    resultsCount: number;
    data: ComplementarySuggestion[];
  };
}

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Voice Search / Natural Language Intent Parser
    voiceSearch: builder.mutation<VoiceSearchResponse, VoiceSearchRequest>({
      query: (body) => ({
        url: "/search/voice",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Search"],
    }),

    // 2. Visual Image & Color Palette Search
    visualSearch: builder.mutation<VisualSearchResponse, VisualSearchRequest | FormData>({
      query: (arg) => {
        if (arg instanceof FormData) {
          return {
            url: "/search/visual",
            method: "POST",
            body: arg,
          };
        }
        return {
          url: "/search/visual",
          method: "POST",
          body: arg,
        };
      },
      invalidatesTags: ["Search"],
    }),

    // 3. Complementary Outfit Styling Suggestions
    getComplementarySuggestions: builder.query<
      ComplementaryResponse,
      { productId: string; targetSlot?: string; limit?: number }
    >({
      query: ({ productId, targetSlot, limit }) => {
        const params = new URLSearchParams();
        if (targetSlot) params.append("targetSlot", targetSlot);
        if (limit) params.append("limit", limit.toString());

        const qs = params.toString();
        return {
          url: `/search/complementary/${productId}${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (_res, _err, { productId }) => [
        { type: "Search", id: `COMPLEMENTARY_${productId}` },
      ],
    }),
  }),
});

export const {
  useVoiceSearchMutation,
  useVisualSearchMutation,
  useGetComplementarySuggestionsQuery,
} = searchApi;
