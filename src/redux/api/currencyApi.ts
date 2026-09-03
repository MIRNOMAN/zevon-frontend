import { baseApi } from "./baseApi";

export interface CurrencyMetadata {
  code: string;
  symbol: string;
  name: string;
  rateFromBDT: number;
  rateToBDT: number;
  decimalPlaces: number;
}

export interface RatesResponse {
  baseCurrency: string;
  baseSymbol: string;
  supportedCurrencies: CurrencyMetadata[];
  lastUpdated: string;
}

export interface DetectLocationResponse {
  detectedCountry: string;
  countryName: string;
  recommendedCurrency: string;
  symbol: string;
  currencyName: string;
  exchangeRateFromBDT: number;
}

export interface ConvertCurrencyResponse {
  originalAmount: number;
  fromCurrency: string;
  fromSymbol: string;
  convertedAmount: number;
  toCurrency: string;
  toSymbol: string;
  formatted: string;
  exchangeRate: number;
}

export const currencyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRates: builder.query<RatesResponse, void>({
      query: () => "/currency/rates",
      transformResponse: (response: { success?: boolean; data?: RatesResponse } | RatesResponse) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as RatesResponse;
      },
    }),

    detectLocation: builder.mutation<DetectLocationResponse, void>({
      query: () => ({
        url: "/currency/detect",
        method: "POST",
      }),
      transformResponse: (
        response: { success?: boolean; data?: DetectLocationResponse } | DetectLocationResponse
      ) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as DetectLocationResponse;
      },
    }),

    convertCurrency: builder.query<
      ConvertCurrencyResponse,
      { amount: number; from?: string; to?: string }
    >({
      query: ({ amount, from = "BDT", to = "USD" }) =>
        `/currency/convert?amount=${amount}&from=${from}&to=${to}`,
      transformResponse: (
        response: { success?: boolean; data?: ConvertCurrencyResponse } | ConvertCurrencyResponse
      ) => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as ConvertCurrencyResponse;
      },
    }),
  }),
});

export const {
  useGetRatesQuery,
  useDetectLocationMutation,
  useLazyConvertCurrencyQuery,
} = currencyApi;
