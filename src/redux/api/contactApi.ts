import { baseApi } from "./baseApi";

export interface CreateContactInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface SubscribeNewsletterInput {
  email: string;
}

export interface ContactApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ContactMessageResult {
  id: string;
  name: string;
  email: string;
  subject?: string;
  createdAt: string;
  message: string;
}

export interface NewsletterResult {
  email: string;
  subscribedAt: string;
  promoCode: string;
  discountPercent: number;
  message: string;
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitContactMessage: builder.mutation<ContactApiResponse<ContactMessageResult>, CreateContactInput>({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contact"],
    }),

    subscribeNewsletter: builder.mutation<ContactApiResponse<NewsletterResult>, SubscribeNewsletterInput>({
      query: (body) => ({
        url: "/newsletter/subscribe",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSubmitContactMessageMutation,
  useSubscribeNewsletterMutation,
} = contactApi;
