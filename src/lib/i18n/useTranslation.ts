"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectCurrentLanguage,
  setLanguage,
  LanguageCode,
} from "@/redux/features/languageSlice";
import { translations } from "./translations";

export function useTranslation() {
  const dispatch = useAppDispatch();
  const language = useAppSelector(selectCurrentLanguage) || "en";

  const t = (path: string, fallback?: string): string => {
    const keys = path.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = translations[language] || translations.en;

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // Fallback to English dictionary
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let enCurrent: any = translations.en;
        for (const enKey of keys) {
          if (enCurrent && typeof enCurrent === "object" && enKey in enCurrent) {
            enCurrent = enCurrent[enKey];
          } else {
            return fallback || path;
          }
        }
        return typeof enCurrent === "string" ? enCurrent : fallback || path;
      }
    }

    return typeof current === "string" ? current : fallback || path;
  };

  const changeLanguage = (lang: LanguageCode) => {
    dispatch(setLanguage(lang));
  };

  return {
    t,
    language,
    setLanguage: changeLanguage,
    isBn: language === "bn",
    isEn: language === "en",
  };
}
