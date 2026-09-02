/**
 * Authentication Storage & Cookie Management Utilities
 * Handles persistence of Access Token, Refresh Token, and User Profile.
 */

import type { User } from "@/redux/features/authSlice";

const ACCESS_TOKEN_KEY = "zevon_access_token";
const REFRESH_TOKEN_KEY = "zevon_refresh_token";
const USER_KEY = "zevon_user_data";

// ============================================================================
// Cookie Utilities
// ============================================================================

export function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
  return match && match[3] ? decodeURIComponent(match[3]) : null;
}

export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

// ============================================================================
// Auth Storage Helpers
// ============================================================================

export interface StoredAuthData {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

/**
 * Persists accessToken, refreshToken and optionally user info across
 * both localStorage and document.cookie.
 */
export function saveAuthTokens({
  accessToken,
  refreshToken,
  user,
}: {
  accessToken: string;
  refreshToken?: string | null;
  user?: User | null;
}): void {
  if (typeof window === "undefined") return;

  try {
    // 1. Access token (15 mins on server, 1 day max cookie lifespan)
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      setCookie(ACCESS_TOKEN_KEY, accessToken, 1);
    }

    // 2. Refresh token (7 days server lifespan)
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      setCookie(REFRESH_TOKEN_KEY, refreshToken, 7);
    }

    // 3. User cached profile
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.warn("Could not save auth tokens to storage:", err);
  }
}

/**
 * Retrieves persisted tokens and user data.
 */
export function getStoredAuth(): StoredAuthData {
  if (typeof window === "undefined") {
    return { accessToken: null, refreshToken: null, user: null };
  }

  try {
    const accessToken =
      localStorage.getItem(ACCESS_TOKEN_KEY) || getCookie(ACCESS_TOKEN_KEY);
    const refreshToken =
      localStorage.getItem(REFRESH_TOKEN_KEY) || getCookie(REFRESH_TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);
    const user: User | null = rawUser ? JSON.parse(rawUser) : null;

    return { accessToken, refreshToken, user };
  } catch (err) {
    console.warn("Could not retrieve auth tokens from storage:", err);
    return { accessToken: null, refreshToken: null, user: null };
  }
}

/**
 * Updates stored user profile.
 */
export function saveStoredUser(user: User): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn("Could not save user data to storage:", err);
  }
}

/**
 * Clears all tokens, cached user info, and cookies upon logout.
 */
export function clearAuthStorage(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    deleteCookie(ACCESS_TOKEN_KEY);
    deleteCookie(REFRESH_TOKEN_KEY);
  } catch (err) {
    console.warn("Could not clear auth tokens from storage:", err);
  }
}
