"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectCurrentCurrency,
  selectCurrentSymbol,
  selectRates,
  selectSupportedCurrencies,
  setCurrency,
  type CurrencyCode,
} from "@/redux/features/currencySlice";
import { toBengaliDigits } from "./helpers";
import { useTranslation } from "./useTranslation";

export function useCurrency() {
  const dispatch = useAppDispatch();
  const currentCurrency = useAppSelector(selectCurrentCurrency);
  const currentSymbol = useAppSelector(selectCurrentSymbol);
  const rates = useAppSelector(selectRates);
  const supportedCurrencies = useAppSelector(selectSupportedCurrencies);
  const { language, isBn } = useTranslation();

  const changeCurrency = useCallback(
    (code: CurrencyCode) => {
      dispatch(setCurrency(code));
    },
    [dispatch]
  );

  /**
   * Convert an amount (stored in base currency BDT) to active currency value
   */
  const convertAmount = useCallback(
    (amountInBDT: number | string): number => {
      const num = typeof amountInBDT === "number" ? amountInBDT : parseFloat(String(amountInBDT)) || 0;
      if (currentCurrency === "BDT") {
        return num;
      }
      const rate = rates[currentCurrency] || 1;
      return num * rate;
    },
    [currentCurrency, rates]
  );

  /**
   * Format a BDT amount into the user's selected currency with proper symbol and locale digits
   */
  const format = useCallback(
    (amountInBDT: number | string, customCurrency?: CurrencyCode): string => {
      const num = typeof amountInBDT === "number" ? amountInBDT : parseFloat(String(amountInBDT)) || 0;
      const targetCurrency = customCurrency || currentCurrency;
      const targetMeta = supportedCurrencies.find((c) => c.code === targetCurrency);
      const symbol = targetMeta?.symbol || currentSymbol;
      const decimals = targetMeta?.decimalPlaces ?? (targetCurrency === "BDT" ? 0 : 2);

      let converted = num;
      if (targetCurrency !== "BDT") {
        const rate = rates[targetCurrency] || 1;
        converted = num * rate;
      }

      const formattedNumber = converted.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

      if (isBn && targetCurrency === "BDT") {
        return `${symbol}${toBengaliDigits(formattedNumber)}`;
      }

      return `${symbol}${formattedNumber}`;
    },
    [currentCurrency, currentSymbol, isBn, rates, supportedCurrencies]
  );

  return {
    currency: currentCurrency,
    symbol: currentSymbol,
    rates,
    supportedCurrencies,
    setCurrency: changeCurrency,
    convertAmount,
    formatPrice: format,
  };
}
