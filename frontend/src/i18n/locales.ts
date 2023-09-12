import danish from "./translations/da-DK";
import german from "./translations/de-DE";
import english from "./translations/en-US";
import spanish from "./translations/es-ES";
import finnish from "./translations/fi-FI";
import french from "./translations/fr-FR";
import portuguese from "./translations/pt-BR";
import russian from "./translations/ru-RU";
import serbian from "./translations/sr-SP";
import thai from "./translations/th-TH";
import chineseSimplified from "./translations/zh-CN";

export const LOCALES = {
  ENGLISH: {
    name: "English",
    code: "en-US",
    messages: english,
  },
  GERMAN: {
    name: "Deutsch",
    code: "de-DE",
    messages: german,
  },
  FRENCH: {
    name: "Français",
    code: "fr-FR",
    messages: french,
  },
  PORTUGUESE_BRAZIL: {
    name: "Português (Brasil)",
    code: "pt-BR",
    messages: portuguese,
  },
  DANISH: {
    name: "Dansk",
    code: "da-DK",
    messages: danish,
  },
  SPANISH: {
    name: "Español",
    code: "es-ES",
    messages: spanish,
  },
  CHINESE_SIMPLIFIED: {
    name: "简体中文",
    code: "zh-CN",
    messages: chineseSimplified,
  },
  FINNISH: {
    name: "Suomi",
    code: "fi-FI",
    messages: finnish,
  },
  RUSSIAN: {
    name: "Русский",
    code: "ru-RU",
    messages: russian,
  },
  THAI: {
    name: "ไทย",
    code: "th-TH",
    messages: thai,
  },
  SERBIAN: {
    name: "Srpski",
    code: "sr-SP",
    messages: serbian,
  },
};
