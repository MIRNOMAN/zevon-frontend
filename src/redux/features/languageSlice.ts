import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LanguageCode = "en" | "bn";

interface LanguageState {
  currentLanguage: LanguageCode;
}

const getInitialLanguage = (): LanguageCode => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("zevon_language") as LanguageCode;
    if (saved === "en" || saved === "bn") {
      return saved;
    }
  }
  return "en";
};

const initialState: LanguageState = {
  currentLanguage: "en",
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<LanguageCode>) => {
      state.currentLanguage = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("zevon_language", action.payload);
      }
    },
    initializeLanguage: (state) => {
      state.currentLanguage = getInitialLanguage();
    },
  },
});

export const { setLanguage, initializeLanguage } = languageSlice.actions;

export const selectCurrentLanguage = (state: { language: LanguageState }) =>
  state.language.currentLanguage;

export default languageSlice.reducer;
