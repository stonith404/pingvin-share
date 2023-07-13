import { LOCALES } from "./locales";

import { english } from "./translations/english";
import { french } from "./translations/french";
import { german } from "./translations/german";
import { spanish } from "./translations/spanish";

export const messages = {
  [LOCALES.ENGLISH]: english,
  [LOCALES.FRENCH]: french,
  [LOCALES.SPANISH]: spanish,
  [LOCALES.GERMAN]: german,
};
