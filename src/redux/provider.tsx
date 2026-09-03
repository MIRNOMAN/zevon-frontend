"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "./store";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { LanguageInitializer } from "@/lib/i18n";

/**
 * Client-side Redux provider.
 * Uses lazy `useState` initializer — creates the store exactly once per mount.
 * Automatically initializes & hydrates auth state and language preference on client mount.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState<AppStore>(() => makeStore());

  return (
    <Provider store={store}>
      <AuthInitializer>
        <LanguageInitializer>{children}</LanguageInitializer>
      </AuthInitializer>
    </Provider>
  );
}
