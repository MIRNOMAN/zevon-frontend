import { baseApi } from "./baseApi";
import { Address } from "./addressApi";
import { setUser } from "../features/authSlice";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: string;
  isActive: boolean;
  avatarUrl?: string | null;
  referralCode?: string | null;
  createdAt: string;
  updatedAt: string;
  addresses?: Address[];
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ApiResponse<UserProfile>, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["User"],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            dispatch(setUser(data.data as any));
          }
        } catch {}
      },
    }),

    updateProfile: builder.mutation<ApiResponse<UserProfile>, UpdateProfileInput>({
      query: (body) => ({
        url: "/users/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User", "Auth"],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            dispatch(setUser(data.data as any));
          }
        } catch {}
      },
    }),

    changePassword: builder.mutation<ApiResponse<{ message: string }>, ChangePasswordInput>({
      query: (body) => ({
        url: "/users/change-password",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = userApi;
