import { setCookie } from "cookies-next";
import { LOCALES } from "../i18n/locales";

const getLocaleByCode = (code: string) => {
  return Object.values(LOCALES).find((l) => l.code === code) ?? LOCALES.ENGLISH;
};

// Parse the Accept-Language header and return the first supported language
const getLanguageFromAcceptHeader = (acceptLanguage?: string) => {
  if (!acceptLanguage) return "en";

  const languages = acceptLanguage.split(",").map((l) => l.split(";")[0]);
  const supportedLanguages = Object.values(LOCALES).map((l) => l.code);
  const supportedLanguagesWithoutRegion = supportedLanguages.map(
    (l) => l.split("-")[0],
  );

  for (const language of languages) {
    // Try to match the full language code first, then the language code without the region
    if (supportedLanguages.includes(language)) {
      return language;
    } else if (
      supportedLanguagesWithoutRegion.includes(language.split("-")[0])
    ) {
      const similarLanguage = supportedLanguages.find((l) =>
        l.startsWith(language.split("-")[0]),
      );
      return similarLanguage;
    }
  }
  return "en";
};

const isLanguageSupported = (code: string) => {
  return Object.values(LOCALES).some((l) => l.code === code);
};

const setLanguageCookie = (code: string) => {
  setCookie("language", code, {
    sameSite: "lax",
    expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  });
};

export default {
  getLocaleByCode,
  getLanguageFromAcceptHeader,
  isLanguageSupported,
  setLanguageCookie,
};
