import { baseApi } from "./baseApi";
import {
  setCredentials,
  setUser,
  logout,
  type User,
} from "../features/authSlice";

// ---------------------------------------------------------------------------
// Request & Response Types matching zevon-server
// ---------------------------------------------------------------------------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface RegisterAdminRequest extends RegisterRequest {
  role?: "ADMIN" | "MANAGER";
  adminSecretKey: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface GenericAuthResponse {
  success: boolean;
  message: string;
  email?: string;
  user?: User;
}

export interface ApiResponseEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp?: string;
}

// ---------------------------------------------------------------------------
// Helper unwrapper for server's ApiResponse envelope
// ---------------------------------------------------------------------------
function unwrapResponse<T>(res: ApiResponseEnvelope<T> | T): T {
  if (res && typeof res === "object" && "data" in res && "success" in res) {
    return (res as ApiResponseEnvelope<T>).data;
  }
  return res as T;
}

// ---------------------------------------------------------------------------
// Auth API Endpoints
// ---------------------------------------------------------------------------

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Login ──────────────────────────────────────────────────
    login: builder.mutation<AuthResponseData, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: ApiResponseEnvelope<AuthResponseData> | AuthResponseData) =>
        unwrapResponse(response),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.accessToken) {
            dispatch(
              setCredentials({
                user: data.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              })
            );
          }
        } catch {
          // Handled by component
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),

    // ── Registration with OTP ──────────────────────────────────
    register: builder.mutation<GenericAuthResponse, RegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponseEnvelope<GenericAuthResponse> | GenericAuthResponse) =>
        unwrapResponse(response),
    }),

    verifyRegisterOtp: builder.mutation<GenericAuthResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/auth/verify-register-otp",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponseEnvelope<GenericAuthResponse> | GenericAuthResponse) =>
        unwrapResponse(response),
      invalidatesTags: ["Auth", "User"],
    }),

    resendRegisterOtp: builder.mutation<GenericAuthResponse, { email: string }>({
      query: (data) => ({
        url: "/auth/resend-register-otp",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponseEnvelope<GenericAuthResponse> | GenericAuthResponse) =>
        unwrapResponse(response),
    }),

    // ── Forgot Password & Reset ────────────────────────────────
    forgotPassword: builder.mutation<GenericAuthResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponseEnvelope<GenericAuthResponse> | GenericAuthResponse) =>
        unwrapResponse(response),
    }),

    verifyResetOtp: builder.mutation<GenericAuthResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/auth/verify-reset-otp",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponseEnvelope<GenericAuthResponse> | GenericAuthResponse) =>
        unwrapResponse(response),
    }),

    resetPassword: builder.mutation<GenericAuthResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponseEnvelope<GenericAuthResponse> | GenericAuthResponse) =>
        unwrapResponse(response),
      invalidatesTags: ["Auth"],
    }),

    resendResetOtp: builder.mutation<GenericAuthResponse, { email: string }>({
      query: (data) => ({
        url: "/auth/resend-reset-otp",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponseEnvelope<GenericAuthResponse> | GenericAuthResponse) =>
        unwrapResponse(response),
    }),

    // ── Administrative Registration ────────────────────────────
    registerAdmin: builder.mutation<AuthResponseData, RegisterAdminRequest>({
      query: (data) => ({
        url: "/auth/register-admin",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponseEnvelope<AuthResponseData> | AuthResponseData) =>
        unwrapResponse(response),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.accessToken) {
            dispatch(
              setCredentials({
                user: data.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              })
            );
          }
        } catch {
          // Handled by component
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),

    // ── Logout ─────────────────────────────────────────────────
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // Even if server call fails, clear local credentials
        } finally {
          dispatch(logout());
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),

    // ── Token Refresh ──────────────────────────────────────────
    refreshToken: builder.mutation<AuthTokens, { refreshToken: string }>({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponseEnvelope<AuthTokens> | AuthTokens) =>
        unwrapResponse(response),
    }),

    // ── Profile Me ─────────────────────────────────────────────
    getMe: builder.query<User, void>({
      query: () => "/auth/me",
      transformResponse: (response: ApiResponseEnvelope<User> | User) =>
        unwrapResponse(response),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.id) {
            dispatch(setUser(data));
          }
        } catch {
          // Invalid token or guest user
        }
      },
      providesTags: ["User"],
    }),
  }),
});

// ---------------------------------------------------------------------------
// Auto-generated hooks
// ---------------------------------------------------------------------------

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyRegisterOtpMutation,
  useResendRegisterOtpMutation,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
  useResendResetOtpMutation,
  useRegisterAdminMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;
