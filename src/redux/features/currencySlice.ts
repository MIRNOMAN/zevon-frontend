import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { CurrencyMetadata } from "../api/currencyApi";

export type CurrencyCode = "BDT" | "USD" | "EUR" | "GBP";

export interface CurrencyState {
  currentCurrency: CurrencyCode;
  currentSymbol: string;
  rates: Record<string, number>;
  supportedCurrencies: CurrencyMetadata[];
  detectedCountry?: string;
  lastUpdated?: string;
}

const DEFAULT_SUPPORTED: CurrencyMetadata[] = [
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", rateFromBDT: 1.0, rateToBDT: 1.0, decimalPlaces: 0 },
  { code: "USD", symbol: "$", name: "US Dollar", rateFromBDT: 0.0084, rateToBDT: 119.05, decimalPlaces: 2 },
  { code: "EUR", symbol: "€", name: "Euro", rateFromBDT: 0.0078, rateToBDT: 128.2, decimalPlaces: 2 },
  { code: "GBP", symbol: "£", name: "British Pound", rateFromBDT: 0.0066, rateToBDT: 151.52, decimalPlaces: 2 },
];

const DEFAULT_RATES: Record<string, number> = {
  BDT: 1.0,
  USD: 0.0084,
  EUR: 0.0078,
  GBP: 0.0066,
};

const SYMBOLS: Record<CurrencyCode, string> = {
  BDT: "৳",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const initialState: CurrencyState = {
  currentCurrency: "BDT",
  currentSymbol: "৳",
  rates: DEFAULT_RATES,
  supportedCurrencies: DEFAULT_SUPPORTED,
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency(state, action: PayloadAction<CurrencyCode>) {
      const code = action.payload;
      state.currentCurrency = code;
      state.currentSymbol = SYMBOLS[code] || "৳";
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("zevon_currency", code);
        } catch {
          // Ignore
        }
      }
    },
    setRatesData(
      state,
      action: PayloadAction<{
        supportedCurrencies: CurrencyMetadata[];
        lastUpdated?: string;
      }>
    ) {
      state.supportedCurrencies = action.payload.supportedCurrencies;
      state.lastUpdated = action.payload.lastUpdated;
      const newRates: Record<string, number> = {};
      for (const cur of action.payload.supportedCurrencies) {
        newRates[cur.code] = cur.rateFromBDT;
      }
      state.rates = { ...state.rates, ...newRates };
    },
    setDetectedCountry(state, action: PayloadAction<string>) {
      state.detectedCountry = action.payload;
    },
  },
});

export const { setCurrency, setRatesData, setDetectedCountry } = currencySlice.actions;

export const selectCurrentCurrency = (state: RootState) => state.currency.currentCurrency;
export const selectCurrentSymbol = (state: RootState) => state.currency.currentSymbol;
export const selectRates = (state: RootState) => state.currency.rates;
export const selectSupportedCurrencies = (state: RootState) => state.currency.supportedCurrencies;
export const selectCurrencyState = (state: RootState) => state.currency;

export default currencySlice.reducer;
