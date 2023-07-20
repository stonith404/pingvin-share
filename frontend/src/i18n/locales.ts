import danish from "./translations/da";
import german from "./translations/de";
import english from "./translations/en";
import spanish from "./translations/es";
import french from "./translations/fr";
import portugueze from "./translations/pt";
import thai from "./translations/th";
import chineseSimplified from "./translations/zh-CN";

export const LOCALES = {
  ENGLISH: {
    name: "English",
    code: "en",
    messages: english,
  },
  GERMAN: {
    name: "Deutsch",
    code: "de",
    messages: german,
  },
  FRENCH: {
    name: "Français",
    code: "fr",
    messages: french,
  },
  PORTUGUEZE: {
    name: "Português",
    code: "pt",
    messages: portugueze,
  },
  DANISH: {
    name: "Dansk",
    code: "da",
    messages: danish,
  },
  THAI: {
    name: "ไทย",
    code: "th",
    messages: thai,
  },
  SPANISH: {
    name: "Español",
    code: "es",
    messages: spanish,
  },
  CHINESE_SIMPLIFIED: {
    name: "简体中文",
    code: "zh-CN",
    messages: chineseSimplified,
  },
};
