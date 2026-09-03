"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  setCurrency,
  setRatesData,
  setDetectedCountry,
  type CurrencyCode,
} from "@/redux/features/currencySlice";
import {
  useGetRatesQuery,
  useDetectLocationMutation,
} from "@/redux/api/currencyApi";

export function CurrencyInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const initialDetectionDone = useRef(false);

  // 1. Fetch live exchange rates table from server
  const { data: ratesData } = useGetRatesQuery();
  const [detectLocation] = useDetectLocationMutation();

  // 2. Hydrate from localStorage or auto-detect
  useEffect(() => {
    if (typeof window === "undefined" || initialDetectionDone.current) return;
    initialDetectionDone.current = true;

    try {
      const saved = localStorage.getItem("zevon_currency") as CurrencyCode | null;
      if (saved && ["BDT", "USD", "EUR", "GBP"].includes(saved)) {
        dispatch(setCurrency(saved));
      } else {
        // Auto-detect visitor location from server IP headers
        detectLocation()
          .unwrap()
          .then((res) => {
            if (res?.recommendedCurrency) {
              const rec = res.recommendedCurrency as CurrencyCode;
              if (["BDT", "USD", "EUR", "GBP"].includes(rec)) {
                dispatch(setCurrency(rec));
              }
              if (res.detectedCountry) {
                dispatch(setDetectedCountry(res.detectedCountry));
              }
            }
          })
          .catch(() => {
            // Default fallback to BDT
            dispatch(setCurrency("BDT"));
          });
      }
    } catch {
      // Ignore
    }
  }, [detectLocation, dispatch]);

  // 3. Keep exchange rates updated in Redux store
  useEffect(() => {
    if (ratesData?.supportedCurrencies) {
      dispatch(
        setRatesData({
          supportedCurrencies: ratesData.supportedCurrencies,
          lastUpdated: ratesData.lastUpdated,
        })
      );
    }
  }, [dispatch, ratesData]);

  return <>{children}</>;
}
