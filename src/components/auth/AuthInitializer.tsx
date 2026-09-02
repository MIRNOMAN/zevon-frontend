"use client";

import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  hydrateAuth,
  selectAccessToken,
  selectIsAuthInitialized,
} from "@/redux/features/authSlice";
import { useLazyGetMeQuery } from "@/redux/api/authApi";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectAccessToken);
  const isInitialized = useAppSelector(selectIsAuthInitialized);
  const [triggerGetMe] = useLazyGetMeQuery();
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (!hasHydrated.current) {
      hasHydrated.current = true;
      dispatch(hydrateAuth());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isInitialized && token) {
      // Validate session and sync latest profile from backend
      triggerGetMe();
    }
  }, [isInitialized, token, triggerGetMe]);

  return <>{children}</>;
}
