import { baseApi } from "./baseApi";

export interface ChatSender {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN" | "MANAGER";
  avatarUrl?: string | null;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  customerId: string;
  content: string | null;
  attachmentUrl: string | null;
  attachmentType: "IMAGE" | "PDF" | "FILE" | null;
  isRead: boolean;
  createdAt: string;
  sender?: ChatSender;
}

export interface ChatHistoryResponse {
  messages: ChatMessage[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    roomId: string;
    customerId: string;
  };
}

export interface UploadAttachmentResponse {
  url: string;
  originalName: string;
  mimetype: string;
  size: number;
  attachmentType: "IMAGE" | "PDF" | "FILE";
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatHistory: builder.query<ApiResponse<ChatHistoryResponse>, { customerId: string; page?: number; limit?: number }>({
      query: ({ customerId, page = 1, limit = 50 }) => ({
        url: `/chat/history/${customerId}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (_result, _err, { customerId }) => [{ type: "Chat", id: customerId }],
    }),

    uploadChatAttachment: builder.mutation<ApiResponse<UploadAttachmentResponse>, FormData>({
      query: (formData) => ({
        url: "/chat/upload",
        method: "POST",
        body: formData,
      }),
    }),

    markChatAsRead: builder.mutation<ApiResponse<any>, string>({
      query: (customerId) => ({
        url: `/chat/read/${customerId}`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _err, customerId) => [{ type: "Chat", id: customerId }],
    }),
  }),
});

export const {
  useGetChatHistoryQuery,
  useUploadChatAttachmentMutation,
  useMarkChatAsReadMutation,
} = chatApi;
