"use client";

import React, { useEffect, useRef } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { initializeLanguage } from "@/redux/features/languageSlice";

export function LanguageInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (!hasHydrated.current) {
      hasHydrated.current = true;
      dispatch(initializeLanguage());
    }
  }, [dispatch]);

  return <>{children}</>;
}
