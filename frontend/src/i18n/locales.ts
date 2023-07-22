import danish from "./translations/da-DK";
import german from "./translations/de-DE";
import english from "./translations/en-US";
import spanish from "./translations/es-ES";
import french from "./translations/fr-FR";
import portugueze from "./translations/pt-PT";
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
  PORTUGUEZE: {
    name: "Português",
    code: "pt-PT",
    messages: portugueze,
  },
  DANISH: {
    name: "Dansk",
    code: "da-DK",
    messages: danish,
  },
  THAI: {
    name: "ไทย",
    code: "th-TH",
    messages: thai,
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
};
