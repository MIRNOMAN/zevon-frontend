import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  saveAuthTokens,
  saveStoredUser,
  clearAuthStorage,
  getStoredAuth,
} from "@/lib/auth-storage";
import type { RootState } from "../store";

// ---------------------------------------------------------------------------
// Types matching zevon-server
// ---------------------------------------------------------------------------

export type UserRole = "CUSTOMER" | "ADMIN" | "MANAGER" | string;

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  avatarUrl?: string | null;
  referralCode?: string | null;
  isActive?: boolean;
  createdAt?: string | Date;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isInitialized: false,
};

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Set user + tokens after login/register.
     * Persists tokens in both localStorage and cookies.
     */
    setCredentials: (
      state,
      action: PayloadAction<{
        user?: User | null;
        accessToken: string;
        refreshToken?: string | null;
      }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;

      if (user !== undefined) {
        state.user = user;
      }
      state.accessToken = accessToken;
      if (refreshToken !== undefined) {
        state.refreshToken = refreshToken;
      }
      state.isAuthenticated = true;
      state.isInitialized = true;

      // Persist to storage & cookies
      saveAuthTokens({
        accessToken,
        refreshToken: refreshToken || state.refreshToken,
        user: user !== undefined ? user : state.user,
      });
    },

    /**
     * Update only the user profile (e.g. after editing profile or /auth/me query).
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      saveStoredUser(action.payload);
    },

    /**
     * Update access token only (e.g. after silent refresh).
     */
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      saveAuthTokens({
        accessToken: action.payload,
        refreshToken: state.refreshToken,
        user: state.user,
      });
    },

    /**
     * Clear all auth state — full logout.
     */
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      clearAuthStorage();
    },

    /**
     * Hydrate state from browser cookies/localStorage on initial client mount.
     */
    hydrateAuth: (state) => {
      const stored = getStoredAuth();
      if (stored.accessToken) {
        state.accessToken = stored.accessToken;
        state.refreshToken = stored.refreshToken;
        state.user = stored.user;
        state.isAuthenticated = true;
      }
      state.isInitialized = true;
    },

    /**
     * Mark auth as initialized even if no tokens were found.
     */
    setAuthInitialized: (state) => {
      state.isInitialized = true;
    },
  },
});

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export const {
  setCredentials,
  setUser,
  updateAccessToken,
  logout,
  hydrateAuth,
  setAuthInitialized,
} = authSlice.actions;

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsAuthInitialized = (state: RootState) => state.auth.isInitialized;
export const selectUserRole = (state: RootState) => state.auth.user?.role ?? null;

/**
 * Check if the current user has one of the required roles.
 */
export const selectHasRole = (
  state: RootState,
  roles: Array<User["role"]>
): boolean => {
  const userRole = state.auth.user?.role;
  return userRole ? roles.map((r) => r.toUpperCase()).includes(userRole.toUpperCase()) : false;
};

// ---------------------------------------------------------------------------
// Reducer export
// ---------------------------------------------------------------------------

export default authSlice.reducer;
