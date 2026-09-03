/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { logout, setCredentials } from "../features/authSlice";
import { getStoredAuth } from "@/lib/auth-storage";
import type { RootState } from "../store";

// ---------------------------------------------------------------------------
// Base query — auto-injects Authorization header from Redux state / storage
// ---------------------------------------------------------------------------

const getApiBaseUrl = () => {
  let url =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.NEXT_PUBLIC_BACKEND_URL
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`
      : "http://localhost:3000/api/v1");

  url = url.replace(/\/+$/, "");
  if (!url.endsWith("/api/v1")) {
    url = `${url}/api/v1`;
  }
  return url;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  prepareHeaders: (headers, { getState }) => {
    let token = (getState() as RootState).auth.accessToken;

    if (!token && typeof window !== "undefined") {
      const stored = getStoredAuth();
      token = stored.accessToken;
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Accept", "application/json");
    return headers;
  },
});

// ---------------------------------------------------------------------------
// Base query with automatic token refresh (re-auth on 401)
// ---------------------------------------------------------------------------

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken || (typeof window !== "undefined" ? getStoredAuth().refreshToken : null);

    if (refreshToken) {
      // Attempt to refresh access & refresh tokens
      const refreshResult = await rawBaseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Server sends { success: true, data: { accessToken, refreshToken } } or direct payload
        const payload = refreshResult.data as Record<string, any>;
        const tokenData = payload.data || payload;

        if (tokenData?.accessToken) {
          api.dispatch(
            setCredentials({
              accessToken: tokenData.accessToken,
              refreshToken: tokenData.refreshToken || refreshToken,
            })
          );

          // Retry the original request with new rotated access token
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } else {
        // Refresh failed (token expired or invalidated in DB) — log out
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

// ---------------------------------------------------------------------------
// Base API — all feature APIs inject endpoints into this
// ---------------------------------------------------------------------------

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Product", "User", "Order", "Cart", "Banner"],
  endpoints: () => ({}),
});
