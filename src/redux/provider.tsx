"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "./store";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { LanguageInitializer } from "@/lib/i18n";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import { CurrencyInitializer } from "@/components/currency/CurrencyInitializer";

/**
 * Client-side Redux provider.
 * Uses lazy `useState` initializer — creates the store exactly once per mount.
 * Automatically initializes & hydrates auth state, language, currency, cart, and wishlist on client mount.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState<AppStore>(() => makeStore());

  return (
    <Provider store={store}>
      <AuthInitializer>
        <LanguageInitializer>
          <CurrencyInitializer>
            <WishlistProvider>
              <CartProvider>{children}</CartProvider>
            </WishlistProvider>
          </CurrencyInitializer>
        </LanguageInitializer>
      </AuthInitializer>
    </Provider>
  );
}
